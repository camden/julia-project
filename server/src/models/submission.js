import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    titleText: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    }
});

export default mongoose.model('Submission', SubmissionSchema);
