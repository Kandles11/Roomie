const express = require('express');
const {
  getReservations, getReservation, createReservation, removeReservation, getClasses, getRooms, getAvailableClass, getAvailableReserve, getMotion
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

router.get('/api/available/class/:building/:day', getAvailableClass)

router.get('/api/available/reserve/:building/:date', getAvailableReserve)

router.get('/api/motion/:building', getMotion)



module.exports = router;