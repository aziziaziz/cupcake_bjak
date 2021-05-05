import express from 'express';
import cors from 'cors';
import details from '../routers/getDetails';
import cupcake from '../routers/cupcake';

const corsOptions = {
  origin: 'http://localhost:8080'
};

const app = express();
const port = 3000;

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Yes I did in ts file!');
});

app.use('/details', details);
app.use('/cupcake', cupcake);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});