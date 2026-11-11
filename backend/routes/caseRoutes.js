const express = require('express');
const router = express.Router();
const {
  createCase,
  getUserCases,
  getCaseDetails,
  deleteCase,
  getCaseStatus
} = require('../controllers/caseController');
const {
  getCaseEvidence,
  getEvidenceDetails,
  getCaseSuspects,
  getCaseTimeline
} = require('../controllers/evidenceController');
const { protect } = require('../middleware/authMiddleware');

// Case management
router.route('/')
  .post(protect, createCase)
  .get(protect, getUserCases);

router.route('/:id')
  .get(protect, getCaseDetails)
  .delete(protect, deleteCase);

router.get('/:id/status', protect, getCaseStatus);

// Evidence and Suspects within a case
router.get('/:id/evidence', protect, getCaseEvidence);
router.get('/:id/evidence/:evidenceId', protect, getEvidenceDetails);
router.get('/:id/suspects', protect, getCaseSuspects);
router.get('/:id/timeline', protect, getCaseTimeline);

module.exports = router;

