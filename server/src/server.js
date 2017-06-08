import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import Submission from './models/submission';

// Database
console.log("Connecting to MongoDB...")
const dbUrl = process.env.DB_BASE_URL || 'localhost';
const dbPort = process.env.DB_PORT || '27017';
mongoose.connect(`mongodb://${dbUrl}:${dbPort}/julia-server`).then(() => {
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
      sub.authorName = req.body.authorName;
      sub.content = req.body.content;
      sub.rawContentWithoutTitle = req.body.rawContentWithoutTitle;
      sub.contentTitle = req.body.contentTitle;

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
    .put((req, res) => {
      const subId = JSON.parse(req.body.subId);
      Submission.findOneAndUpdate({ id: subId }, {
        category: req.body.category,
        authorName: req.body.authorName,
        content: req.body.content,
        rawContentWithoutTitle: req.body.rawContentWithoutTitle,
        contentTitle: req.body.contentTitle
      }, { new: true }, (err, submission) => {
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
      });
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

  router.route('/submissions/:subId')
    .get((req, res) => {
      Submission.where({ id: req.params.subId }).findOne((err, sub) => {
        if (err) {
          res.send(err);
        } else {
          res.json(sub);
        }
      });
    });


  app.use('/static', express.static(path.resolve(__dirname, '../../client/build/static')));

  app.use('/api', router);

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build/index.html'));
  });

  app.listen(port);
  console.log(`Running on port ${port}`);
}
