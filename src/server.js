import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'what up!'})
});

app.use('/api', router);

app.listen(port);
console.log(`Running on port ${port}`);
