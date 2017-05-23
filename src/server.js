import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import Submission from './models/submission';

// Database
console.log("Connecting to MongoDB...")
mongoose.connect('mongodb://localhost:27017/julia-server').then(() => {
    console.log("Connected to MongoDB.")
    main();
}).catch((err) => {
    console.error("Could not connect to MongoDB. Is it running on port 27017?");
    process.exit(1);
});

function main() {
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
                } else {
                    res.json({ message: 'Submission created! with category: ' + req.body.category });
                }
            })
        });

    router.get('/', (req, res) => {
        res.json({message: 'what up!'})
    });

    app.use('/api', router);

    app.listen(port);
    console.log(`Running on port ${port}`);
}
