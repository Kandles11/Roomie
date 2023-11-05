const express = require('express');
const {
  getReservations, createReservation
} = require('../controllers/reservationController.js')
const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

// router.get('/api/rooms', getRooms);

router.get('/api/reservations', getReservations);

router.post('/api/reservations', createReservation);

module.exports = router;