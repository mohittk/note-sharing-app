const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    sharedWith: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }
    ],
    isTestData: {
        type: Boolean,
        default: false
    }
});




module.exports = mongoose.model('Note', noteSchema);