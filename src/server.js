import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Submission from './models/submission';

// Database
mongoose.connect('mongodb://localhost:27017');

// Server
const app = express();

app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const router = express.Router();

router.route('/submissions')
    .post((req, res) => {
        const sub = new Submission();
        sub.category = req.body.category;

        sub.save((err) => {
            if (err) {
                res.send(err);
            }

            res.json({ message: 'Submission created!' });
        })
    });

router.get('/', (req, res) => {
    res.json({message: 'what up!'})
});

app.use('/api', router);

app.listen(port);
console.log(`Running on port ${port}`);
