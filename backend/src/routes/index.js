const express = require('express');
const {
  getReservations, getReservation, createReservation, removeReservation, getClasses, getRooms, getAvailable
} = require('../controllers/reservationController.js')
const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

// router.get('/api/rooms', getRooms);

router.get('/api/reservations', getReservations);

router.get('/api/reservations/:id', getReservation);

router.post('/api/reservations', createReservation);

router.delete('/api/reservations/:id', removeReservation)

router.get('/api/classes/:building/:day', getClasses)

router.get('/api/rooms/:building/', getRooms)

router.get('/api/available/:building/:day', getAvailable)





module.exports = router;