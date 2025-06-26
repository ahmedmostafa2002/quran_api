/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const port = process.env.PORT || 3000;
const server = express();

server.set('trust proxy', 1);

// Configure CORS to allow specific origins
const corsOptions = {
  origin: ['https://alquran-al-kareem.vercel.app','https://alquran-al-kareem.vercel.app/surahs', 'http://localhost:5173'], // Add your frontend origin(s) here
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you need to send cookies or authorization headers
  optionsSuccessStatus: 204
};
server.use(cors(corsOptions));

server.use(express.json());
server.use(routes);

server.listen(port, () => {
  console.log('Server running at port:', port);
});
