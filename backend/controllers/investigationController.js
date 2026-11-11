const Investigation = require('../models/Investigation');
const Solution = require('../models/Solution');
const Suspect = require('../models/Suspect');
const Evidence = require('../models/Evidence');
const Case = require('../models/Case');
const User = require('../models/User');
const { getDetectiveHint } = require('../services/ai/detectiveAssistant.service');

// @desc    Get investigation progress
// @route   GET /api/v1/investigations/:caseId
// @access  Protected
const getInvestigation = async (req, res, next) => {
  try {
    const filter = { caseId: req.params.caseId };
    if (req.user) filter.userId = req.user._id;
    else if (req.guestSessionId) filter.guestSessionId = req.guestSessionId;

    let investigation = await Investigation.findOne(filter);

    if (!investigation) {
      investigation = await Investigation.create({
        caseId: req.params.caseId,
        userId: req.user ? req.user._id : null,
        guestSessionId: req.guestSessionId,
        openedEvidenceIds: [],
        notes: [],
        hintsUsed: 0,
        status: 'active'
      });
    }

    res.json({
      success: true,
      data: investigation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/update detective notes
// @route   PUT /api/v1/investigations/:caseId/notes
// @access  Protected
const saveNotes = async (req, res, next) => {
  try {
    const { notes } = req.body;

    if (!Array.isArray(notes)) {
      return res.status(400).json({
        success: false,
        message: 'Notes must be provided as an array',
        error: { code: 'INVALID_NOTES_FORMAT' }
      });
    }

    const filter = { caseId: req.params.caseId };
    if (req.user) filter.userId = req.user._id;
    else if (req.guestSessionId) filter.guestSessionId = req.guestSessionId;

    const investigation = await Investigation.findOneAndUpdate(
      filter,
      { $set: { notes } },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Detective notes updated',
      data: investigation.notes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request a hint from the Detective Assistant
// @route   POST /api/v1/investigations/:caseId/hints
// @access  Protected
const requestHint = async (req, res, next) => {
  try {
    const { level = 'gentle', question = '' } = req.body;

    const filter = { caseId: req.params.caseId };
    if (req.user) filter.userId = req.user._id;
    else if (req.guestSessionId) filter.guestSessionId = req.guestSessionId;

    const investigation = await Investigation.findOne(filter);
    if (!investigation) {
      return res.status(404).json({
        success: false,
        message: 'Investigation not found',
        error: { code: 'INVESTIGATION_NOT_FOUND' }
      });
    }

    const caseItem = await Case.findById(req.params.caseId);
    const suspects = await Suspect.find({ caseId: req.params.caseId }).select('-secretInfo');
    const evidence = await Evidence.find({ caseId: req.params.caseId }).select('-isKeyEvidence -isRedHerring');

    const hintText = await getDetectiveHint({
      caseOverview: caseItem,
      suspects,
      evidence,
      question,
      hintLevel: level
    });

    investigation.hintsUsed += 1;
    investigation.hintHistory.push({
      level,
      question,
      hint: hintText,
      timestamp: new Date()
    });
    await investigation.save();

    res.json({
      success: true,
      data: {
        hint: hintText,
        hintsUsed: investigation.hintsUsed,
        level
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit final accusation
// @route   POST /api/v1/investigations/:caseId/accuse
// @access  Protected
const submitAccusation = async (req, res, next) => {
  try {
    const { suspectId, reasoning = '' } = req.body;

    if (!suspectId) {
      return res.status(400).json({
        success: false,
        message: 'A suspect must be chosen for the accusation',
        error: { code: 'NO_SUSPECT_SELECTED' }
      });
    }

    const filter = { caseId: req.params.caseId };
    if (req.user) filter.userId = req.user._id;
    else if (req.guestSessionId) filter.guestSessionId = req.guestSessionId;

    const investigation = await Investigation.findOne(filter);
    if (!investigation) {
      return res.status(404).json({
        success: false,
        message: 'Active investigation not found',
        error: { code: 'INVESTIGATION_NOT_FOUND' }
      });
    }

    if (investigation.accusation && investigation.accusation.submittedAt) {
      return res.status(400).json({
        success: false,
        message: 'An accusation has already been submitted for this case',
        error: { code: 'ACCUSATION_ALREADY_SUBMITTED' }
      });
    }

    // Verify suspect exists
    const suspect = await Suspect.findOne({ caseId: req.params.caseId, suspectId });
    if (!suspect) {
      return res.status(404).json({
        success: false,
        message: 'Selected suspect does not exist in this investigation',
        error: { code: 'INVALID_SUSPECT' }
      });
    }

    // Retrieve private solution
    const solution = await Solution.findOne({ caseId: req.params.caseId });
    if (!solution) {
      return res.status(500).json({
        success: false,
        message: 'Case solution record missing',
        error: { code: 'SOLUTION_NOT_FOUND' }
      });
    }

    const isCorrect = solution.culpritId === suspectId;

    // Calculate score based on spec section 10.4
    let basePoints = isCorrect ? 100 : 0;
    let hintPenalty = 0;
    investigation.hintHistory.forEach(h => {
      if (h.level === 'gentle') hintPenalty += 5;
      else if (h.level === 'evidence_based') hintPenalty += 10;
      else if (h.level === 'strong') hintPenalty += 15;
    });

    let reasoningBonus = (isCorrect && reasoning.trim().length > 30) ? 20 : 0;
    let noHintBonus = (isCorrect && investigation.hintsUsed === 0) ? 20 : 0;

    let finalScore = Math.max(0, basePoints + reasoningBonus + noHintBonus - hintPenalty);

    investigation.status = isCorrect ? 'solved' : 'failed';
    investigation.accusation = {
      suspectId,
      reasoning,
      isCorrect,
      submittedAt: new Date()
    };
    investigation.score = finalScore;
    investigation.scoreBreakdown = {
      basePoints,
      hintPenalty,
      reasoningBonus: reasoningBonus + noHintBonus,
      finalScore
    };
    await investigation.save();

    // Update Case status
    await Case.findByIdAndUpdate(req.params.caseId, {
      status: isCorrect ? 'solved' : 'failed'
    });

    // Update user stats if registered
    if (req.user) {
      const updateFields = isCorrect
        ? { $inc: { 'stats.casesSolved': 1, 'stats.totalScore': finalScore } }
        : { $inc: { 'stats.casesFailed': 1 } };
      await User.findByIdAndUpdate(req.user._id, updateFields);
    }

    res.json({
      success: true,
      message: isCorrect ? 'Case solved! The truth is uncovered.' : 'Case closed, but the accusation was incorrect.',
      data: {
        isCorrect,
        accusedSuspect: {
          suspectId: suspect.suspectId,
          name: suspect.name
        },
        score: finalScore,
        scoreBreakdown: investigation.scoreBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get authorized result (only after accusation is submitted)
// @route   GET /api/v1/investigations/:caseId/result
// @access  Protected
const getResult = async (req, res, next) => {
  try {
    const filter = { caseId: req.params.caseId };
    if (req.user) filter.userId = req.user._id;
    else if (req.guestSessionId) filter.guestSessionId = req.guestSessionId;

    const investigation = await Investigation.findOne(filter);

    if (!investigation || !investigation.accusation || !investigation.accusation.submittedAt) {
      return res.status(403).json({
        success: false,
        message: 'The solution is sealed until an accusation has been submitted',
        error: { code: 'SOLUTION_SEALED' }
      });
    }

    const solution = await Solution.findOne({ caseId: req.params.caseId });
    const accused = await Suspect.findOne({
      caseId: req.params.caseId,
      suspectId: investigation.accusation.suspectId
    });
    const trueCulprit = await Suspect.findOne({
      caseId: req.params.caseId,
      suspectId: solution.culpritId
    });

    res.json({
      success: true,
      data: {
        isCorrect: investigation.accusation.isCorrect,
        accusedSuspect: accused ? { suspectId: accused.suspectId, name: accused.name, avatar: accused.avatar } : null,
        trueCulprit: {
          suspectId: trueCulprit?.suspectId || solution.culpritId,
          name: trueCulprit?.name || solution.culpritName,
          avatar: trueCulprit?.avatar || ''
        },
        userReasoning: investigation.accusation.reasoning,
        solution: {
          motive: solution.motive,
          explanation: solution.explanation,
          methodOfInvolvement: solution.methodOfInvolvement,
          actualTimeline: solution.actualTimeline,
          revealingEvidenceIds: solution.revealingEvidenceIds,
          redHerringExplanations: solution.redHerringExplanations
        },
        score: investigation.score,
        scoreBreakdown: investigation.scoreBreakdown,
        hintsUsed: investigation.hintsUsed
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvestigation,
  saveNotes,
  requestHint,
  submitAccusation,
  getResult
};

