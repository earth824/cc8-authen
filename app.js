const express = require('express');
// const { sequelize } = require('./models');
const userRoute = require('./routes/userRoute');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', userRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: 'path not found on this server' });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message });
});

// sequelize.sync().then(() => console.log('DB sync'));

const port = 8000;
app.listen(port, () => console.log(`server running on port ${port}`));
