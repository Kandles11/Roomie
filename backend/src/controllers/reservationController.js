const Reservation = require('../models/reservationModel.js')
const mongoose = require('mongoose');

//get all reservations
const getReservations = async (req, res) => {
    const reservations = await Reservation.find({}).sort({createdAt: -1})

    res.status(200).json(reservations)
}

//create new reservation
const createReservation = async (req, res) => {
    const {user, room, startTime, endTime} = req.body;

    //add doc to db
    try {
        const reservation = await Reservation.create({user, room, startTime, endTime});
        res.status(200).json(reservation);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// const getRooms = async (req, res) => {


//     res.status(200).json(reservations)
// }

module.exports = {
    getReservations,
    createReservation
}