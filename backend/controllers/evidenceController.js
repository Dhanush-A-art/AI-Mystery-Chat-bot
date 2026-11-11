const Evidence = require('../models/Evidence');
const Suspect = require('../models/Suspect');
const Case = require('../models/Case');
const Investigation = require('../models/Investigation');

// @desc    Get all evidence for a case (sanitized)
// @route   GET /api/v1/cases/:id/evidence
// @access  Protected
const getCaseEvidence = async (req, res, next) => {
  try {
    const evidenceList = await Evidence.find({ caseId: req.params.id })
      .select('-isKeyEvidence -isRedHerring')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: evidenceList.length,
      data: evidenceList
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single evidence item & mark opened
// @route   GET /api/v1/cases/:id/evidence/:evidenceId
// @access  Protected
const getEvidenceDetails = async (req, res, next) => {
  try {
    const item = await Evidence.findOne({
      caseId: req.params.id,
      evidenceId: req.params.evidenceId
    }).select('-isKeyEvidence -isRedHerring');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Evidence piece not found',
        error: { code: 'EVIDENCE_NOT_FOUND' }
      });
    }

    // Record that investigator opened this piece of evidence
    const filter = { caseId: req.params.id };
    if (req.user) filter.userId = req.user._id;
    else if (req.guestSessionId) filter.guestSessionId = req.guestSessionId;

    await Investigation.findOneAndUpdate(
      filter,
      { $addToSet: { openedEvidenceIds: item.evidenceId } },
      { new: true }
    );

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get suspect profiles for a case (sanitized)
// @route   GET /api/v1/cases/:id/suspects
// @access  Protected
const getCaseSuspects = async (req, res, next) => {
  try {
    const suspects = await Suspect.find({ caseId: req.params.id })
      .select('-secretInfo')
      .sort({ suspectId: 1 });

    res.json({
      success: true,
      count: suspects.length,
      data: suspects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public case timeline
// @route   GET /api/v1/cases/:id/timeline
// @access  Protected
const getCaseTimeline = async (req, res, next) => {
  try {
    const caseItem = await Case.findById(req.params.id).select('publicTimeline incident location');

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
        incident: caseItem.incident,
        location: caseItem.location,
        timeline: caseItem.publicTimeline
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCaseEvidence,
  getEvidenceDetails,
  getCaseSuspects,
  getCaseTimeline
};

