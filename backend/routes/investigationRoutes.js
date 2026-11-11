const express = require('express');
const router = express.Router();
const {
  getInvestigation,
  saveNotes,
  requestHint,
  submitAccusation,
  getResult
} = require('../controllers/investigationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:caseId', protect, getInvestigation);
router.put('/:caseId/notes', protect, saveNotes);
router.post('/:caseId/hints', protect, requestHint);
router.post('/:caseId/accuse', protect, submitAccusation);
router.get('/:caseId/result', protect, getResult);

module.exports = router;

