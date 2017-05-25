import path from 'path';
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
      sub.content = req.body.content;
      sub.authorName = req.body.authorName;

      sub.save((err, submission) => {
        if (err) {
          if (err.name === "ValidationError") {
            res.status(400)
          } else {
            res.status(500);
          }
          res.send(err);
        } else {
          res.json(submission);
        }
      })
    })
    .get((req, res) => {
      Submission.find((err, submissions) => {
        if (err) {
          res.send(err);
        } else {
          res.json(submissions);
        }
      })
    });


  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build/index.html'));
  });

  app.use('/static', express.static(path.resolve(__dirname, '../../client/build/static')));

  app.use('/api', router);

  app.listen(port);
  console.log(`Running on port ${port}`);
}
