import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    category: String
});

export default mongoose.model('Submission', SubmissionSchema);
