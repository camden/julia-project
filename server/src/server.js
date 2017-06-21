import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import addSubmissionRoutes from './routes/submission';
import addReleaseRoutes from './routes/release';

// Database
const DB_URL = process.env.DB_BASE_URL || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const dbFinalUrl = `mongodb://${DB_URL}:${DB_PORT}/julia-server`;

console.log(`Connecting to MongoDB @ ${dbFinalUrl}...`);
mongoose.connect(dbFinalUrl).then(() => {
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

  addSubmissionRoutes(router);
  addReleaseRoutes(router);

  app.use('/static', express.static(path.resolve(__dirname, '../../client/build/static')));

  app.use('/api', router);

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build/index.html'));
  });

  app.listen(port);
  console.log(`Running on port ${port}`);
}
