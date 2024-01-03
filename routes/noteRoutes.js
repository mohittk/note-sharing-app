const express = require('express');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', noteController.getAllNotes);
router.get('/:id', noteController.getNoteById);
router.post('/', authMiddleware, noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.post('/:id/share', noteController.shareNote);
router.get('/search', noteController.searchNotes);

module.exports = router;
