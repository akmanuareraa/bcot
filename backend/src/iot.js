const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http);

app.use(express.json());
app.use(cors());

// Store the IoT data in a variable
let iotData = {
  temperature: 0,
  humidity: 0,
  pressure: 0,
  ph: 0,
  energy: 0,
  power: 0,
  airquality: 0,
  gasemission: 0,
};

// POST endpoint to receive data continuously from IoT
app.post('/data', (req, res) => {
  const data = req.body;

  console.log('BE Data:', data);

  iotData.temperature = data.temperature ? data.temperature : iotData.temperature;
  iotData.humidity = data.humidity ? data.humidity : iotData.humidity;
  iotData.pressure = data.pressure ? data.pressure : iotData.pressure;
  iotData.ph = data.ph ? data.ph : iotData.ph;
  iotData.energy = data.energy ? data.energy : iotData.energy;
  iotData.power = data.duration ? data.duration : iotData.power;
  iotData.airquality = data.airquality ? data.airquality : iotData.airquality;
  iotData.gasemission = data.gasemission ? data.gasemission : iotData.gasemission;

  res.sendStatus(200);
});

// GET endpoint to retrieve the IoT data for the frontend
app.get('/iotdata', (req, res) => {
  res.status(200).json(iotData);
});

// Start the server
http.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API working fine!' });
});
