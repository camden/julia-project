import { model as Submission } from '../models/submission';
import { processRes } from '../utils';

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

      Submission.find().sort('-order').limit(1).then((subWithMaxOrder) => {
        if (subWithMaxOrder.length > 0) {
          sub.order = subWithMaxOrder[0].order + 1;
        } else {
          sub.order = 0;
        }
      }).then(() => {
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
    })
    .put((req, res) => {
      const subId = JSON.parse(req.body.subId);
      Submission.findOneAndUpdate({ id: subId }, {
        order: req.body.order,
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
      Submission.find().populate('release').then((submissions) => {
        processRes(res, submissions);
      }).catch((err) => {
        if (err) {
          res.send(err);
        }
      });
    });

  router.route('/submissions/:subId')
    .get((req, res) => {
      Submission.where({ id: req.params.subId }).findOne().populate('release').then((sub) => {
        processRes(res, sub);
      }).catch((err) => {
        if (err) {
          res.send(err);
        }
      })
    })
    .delete((req, res) => {
      Submission.where({ id: req.params.subId }).findOne().remove().then((sub) => {
        processRes(res, sub);
      }).catch((err) => {
        if (err) {
          res.send(err);
        }
      });
    });
}

export default submissionRoutes;
