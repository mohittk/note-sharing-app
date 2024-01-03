const express = require('express');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, noteController.getAllNotes);
router.post('/', authMiddleware, noteController.createNote);    
router.get('/search', authMiddleware, noteController.searchNotes);
router.get('/:id', authMiddleware, noteController.getNoteById);
router.put('/:id', authMiddleware, noteController.updateNote);
router.delete('/:id', authMiddleware, noteController.deleteNote);
router.post('/:id/share', authMiddleware, noteController.shareNote);

module.exports = router;
