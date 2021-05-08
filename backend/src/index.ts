import express from 'express';
import cors from 'cors';

import cupcake from '../routers/cupcake';
import orders from '../routers/orders';

const corsOptions = {
  origin: 'http://localhost:8080'
};

const app = express();
const port = 3000;

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Yes I did in ts file!');
});

app.use('/cupcake', cupcake);
app.use('/orders', orders);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});