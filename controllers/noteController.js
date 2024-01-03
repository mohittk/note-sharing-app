const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);



const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createNote = async (req, res) => {
  try {
    console.log('Request user:', req.user);
    const { title, content } = req.body;

    const newNote = new Note({
      title,
      content,
      userId: req.user._id,
    });

    await newNote.save();

    res.status(201).json({ message: 'Note created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, content },
      { new: true }
    );

    if (!updatedNote) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json({ message: 'Note updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!deletedNote) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const shareNote = async (req, res) => {
  try {
    const { userId } = req.body;

    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (note.sharedWith.includes(userId)) {
      return res.status(400).json({ message: 'Note already shared with this user' });
    }

    note.sharedWith.push(userId);
    await note.save();

    res.status(200).json({ message: 'Note shared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const searchNotes = async (req, res) => {
  try {
    const query = req.query.q;

    const notes = await Note.find({
      userId: req.user._id,
      $text: { $search: query },
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
};
