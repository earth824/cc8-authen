require('dotenv').config();
require('./middlewares/passport');

const express = require('express');
// const { sequelize } = require('./models');
const userRoute = require('./routes/userRoute');
const errorMiddleware = require('./middlewares/error');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', userRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: 'path not found on this server' });
});

app.use(errorMiddleware);

// sequelize.sync().then(() => console.log('DB sync'));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port ${port}`));
