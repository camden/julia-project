import mongoose from 'mongoose';
import autoIncrement from 'mongoose-sequence';

import { schema as SubmissionSchema } from './submission';

const ReleaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  submissions: {
    type: [SubmissionSchema],
    default: [],
    required: true
  },
  type: {
    type: String,
    enum: ['major', 'minor'],
    required: true
  },
  previewBeginDate: {
    type: Date,
    required: true
  },
  prodBeginDate: {
    type: Date,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true
  }
});

ReleaseSchema.plugin(autoIncrement, {inc_field: 'id', id: 'release_id'});
export default mongoose.model('Release', ReleaseSchema);
