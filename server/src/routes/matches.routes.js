const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matches.controller');
const authMiddleware = require('../middlewares/auth');

router.get('/', matchesController.getMatches);
router.get('/:id', matchesController.getMatchDetails);

// New hierarchical seat routes
router.get('/:id/stands', matchesController.getStands);
router.get('/:id/stands/:standId/blocks', matchesController.getBlocks);
router.get('/:id/blocks/:blockId/seats', matchesController.getBlockSeats);

// Legacy seats route (kept for compatibility)
router.get('/:id/seats', matchesController.getMatchSeats);

router.post('/:id/lock-seat', authMiddleware, matchesController.lockSeat);

// Queue routes
router.post('/:id/queue/join', authMiddleware, matchesController.joinQueue);
router.post('/:id/queue/leave', authMiddleware, matchesController.leaveQueue);
router.get('/:id/queue/status', authMiddleware, matchesController.getQueueStatus);

module.exports = router;
