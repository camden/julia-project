import mongoose from 'mongoose';
import autoIncrement from 'mongoose-sequence';

import SubmissionSchema from './submission';

const ReleaseSchema = new mongoose.Schema({
    previewBeginDate: {
        type: Date,
        required: true
    },
    prodBeginDate: {
      type: Date,
      required: true
    },
    category: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    contentTitle: {
        type: String,
        required: true
    },
    rawContentWithoutTitle: {
        type: mongoose.Schema.Types.Mixed,
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

ReleaseSchema.plugin(autoIncrement, {inc_field: 'id'});
export default mongoose.model('Release', ReleaseSchema);
