import { model as Submission } from '../models/submission';

const submissionRoutes = (router) => {
  router.route('/submissions')
    .post((req, res) => {
      const sub = new Submission();
      sub.category = req.body.category;
      sub.authorName = req.body.authorName;
      sub.content = req.body.content;
      sub.rawContentWithoutTitle = req.body.rawContentWithoutTitle;
      sub.contentTitle = req.body.contentTitle;
      sub.release = req.body.release;

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
        contentTitle: req.body.contentTitle,
        release: req.body.release
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
      Submission.find().populate('release').then((err, submissions) => {
        if (err) {
          res.send(err);
        } else {
          res.json(submissions);
        }
      })
    });

  router.route('/submissions/:subId')
    .get((req, res) => {
      Submission.where({ id: req.params.subId }).findOne().populate('release').then((err, sub) => {
        if (err) {
          res.send(err);
        } else {
          res.json(sub);
        }
      });
    });
}

export default submissionRoutes;
