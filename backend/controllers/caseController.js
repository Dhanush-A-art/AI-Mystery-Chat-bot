const Case = require('../models/Case');
const Suspect = require('../models/Suspect');
const Evidence = require('../models/Evidence');
const Solution = require('../models/Solution');
const Investigation = require('../models/Investigation');
const { generateInvestigation } = require('../services/ai/mysteryGenerator.service');

// @desc    Create and generate a new mystery
// @route   POST /api/v1/cases
// @access  Protected (User or Guest)
const createCase = async (req, res, next) => {
  try {
    const {
      title,
      scenario,
      category = 'Theft',
      difficulty = 'Medium',
      suspectCount = 4,
      evidenceComplexity = 'Intermediate'
    } = req.body;

    if (!scenario || scenario.trim().length < 15) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a detailed story scenario (minimum 15 characters)',
        error: { code: 'INVALID_SCENARIO' }
      });
    }

    const userId = req.user ? req.user._id : null;
    const guestSessionId = req.guestSessionId || (req.user ? null : req.headers['x-guest-session-id']);

    const caseTitle = title && title.trim() ? title.trim() : `The Mystery of ${category}`;

    // 1. Initialize case in database
    const newCase = await Case.create({
      userId,
      guestSessionId,
      title: caseTitle,
      scenario,
      category,
      difficulty,
      suspectCount: parseInt(suspectCount) || 4,
      evidenceComplexity,
      status: 'generating',
      generationProgress: {
        stage: 'generating',
        message: 'Connecting to AI Investigation Engine...',
        percent: 25
      }
    });

    // 2. Generate full investigation via AI Pipeline
    const generatedData = await generateInvestigation({
      scenario,
      category,
      difficulty,
      suspectCount
    });

    // 3. Save Suspects
    const suspectsToInsert = generatedData.suspects.map(s => ({
      caseId: newCase._id,
      suspectId: s.suspectId,
      name: s.name,
      age: s.age || 35,
      occupation: s.occupation || 'Associate',
      avatar: s.avatar || '',
      description: s.description,
      relationship: s.relationship,
      alibi: s.alibi,
      publicInfo: s.publicInfo || [],
      secretInfo: s.secretInfo || '',
      suspicionLevel: s.suspicionLevel || 'Moderate'
    }));
    await Suspect.insertMany(suspectsToInsert);

    // 4. Save Evidence
    const evidenceToInsert = generatedData.evidence.map(e => ({
      caseId: newCase._id,
      evidenceId: e.evidenceId,
      type: e.type,
      title: e.title,
      description: e.description,
      content: e.content || {},
      assetUrl: e.assetUrl || '',
      timestamp: e.timestamp || '',
      location: e.location || '',
      relatedSuspectIds: e.relatedSuspectIds || [],
      isUnlocked: true,
      isKeyEvidence: Boolean(e.isKeyEvidence),
      isRedHerring: Boolean(e.isRedHerring)
    }));
    await Evidence.insertMany(evidenceToInsert);

    // 5. Save Solution in private vault
    await Solution.create({
      caseId: newCase._id,
      culpritId: generatedData.solution.culpritId,
      culpritName: generatedData.solution.culpritName,
      motive: generatedData.solution.motive,
      explanation: generatedData.solution.explanation,
      methodOfInvolvement: generatedData.solution.methodOfInvolvement,
      actualTimeline: generatedData.solution.actualTimeline || [],
      revealingEvidenceIds: generatedData.solution.revealingEvidenceIds || [],
      redHerringExplanations: generatedData.solution.redHerringExplanations || []
    });

    // 6. Update Case to active
    newCase.title = generatedData.caseTitle || caseTitle;
    newCase.location = generatedData.location || 'Crime Scene';
    newCase.incident = generatedData.incident || { type: category, date: '2026-11-01', time: '20:30' };
    newCase.publicTimeline = generatedData.publicTimeline || [];
    newCase.status = 'active';
    newCase.generationProgress = {
      stage: 'completed',
      message: 'Investigation room secured and ready',
      percent: 100
    };
    await newCase.save();

    // 7. Initialize user investigation tracking
    const investigation = await Investigation.create({
      caseId: newCase._id,
      userId,
      guestSessionId,
      openedEvidenceIds: [],
      notes: [],
      hintsUsed: 0,
      status: 'active'
    });

    // Update user stats if registered
    if (req.user) {
      await req.user.updateOne({ $inc: { 'stats.casesCreated': 1 } });
    }

    res.status(201).json({
      success: true,
      message: 'Investigation generated successfully',
      data: {
        caseId: newCase._id,
        investigationId: investigation._id,
        title: newCase.title,
        category: newCase.category,
        difficulty: newCase.difficulty,
        suspectCount: newCase.suspectCount,
        evidenceCount: evidenceToInsert.length
      }
    });
  } catch (error) {
    console.error('[Case Generation Error]', error);
    next(error);
  }
};

// @desc    Get user's cases (or guest session cases)
// @route   GET /api/v1/cases
// @access  Protected
const getUserCases = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user) {
      filter.userId = req.user._id;
    } else if (req.guestSessionId) {
      filter.guestSessionId = req.guestSessionId;
    } else {
      return res.status(401).json({
        success: false,
        message: 'No identification provided',
        error: { code: 'UNAUTHORIZED' }
      });
    }

    const cases = await Case.find(filter)
      .sort({ createdAt: -1 })
      .select('title category difficulty status createdAt incident location suspectCount');

    res.json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get case details by ID
// @route   GET /api/v1/cases/:id
// @access  Protected
const getCaseDetails = async (req, res, next) => {
  try {
    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Investigation case not found',
        error: { code: 'CASE_NOT_FOUND' }
      });
    }

    // Ownership check
    const isOwner =
      (req.user && caseItem.userId && caseItem.userId.toString() === req.user._id.toString()) ||
      (req.guestSessionId && caseItem.guestSessionId === req.guestSessionId);

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this case file',
        error: { code: 'FORBIDDEN' }
      });
    }

    res.json({
      success: true,
      data: caseItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a case
// @route   DELETE /api/v1/cases/:id
// @access  Protected
const deleteCase = async (req, res, next) => {
  try {
    const caseItem = await Case.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
        error: { code: 'CASE_NOT_FOUND' }
      });
    }

    await Promise.all([
      Case.findByIdAndDelete(req.params.id),
      Suspect.deleteMany({ caseId: req.params.id }),
      Evidence.deleteMany({ caseId: req.params.id }),
      Solution.deleteMany({ caseId: req.params.id }),
      Investigation.deleteMany({ caseId: req.params.id })
    ]);

    res.json({
      success: true,
      message: 'Case file permanently purged'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get generation status
// @route   GET /api/v1/cases/:id/status
// @access  Protected
const getCaseStatus = async (req, res, next) => {
  try {
    const caseItem = await Case.findById(req.params.id).select('status generationProgress');

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
        error: { code: 'CASE_NOT_FOUND' }
      });
    }

    res.json({
      success: true,
      data: {
        status: caseItem.status,
        progress: caseItem.generationProgress
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCase,
  getUserCases,
  getCaseDetails,
  deleteCase,
  getCaseStatus
};

