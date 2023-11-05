require('dotenv').config()
const Reservation = require('../models/reservationModel.js')
const mongoose = require('mongoose');

rooms = 
{
    "buildings": 
    {
        "ECSW":[
            "1.130",
            "1.150B",
            "1.160B",
            "1.160BA",
            "1.160A",
            "1.415A",
            "1.429",
            "1.435",
            "1.455",
            "1.460",
            "1.440",
            "1.365",
            "1.355",
            "1.315"
        ]
    }
}


//get all reservations
const getReservations = async (req, res) => {
    const reservations = await Reservation.find({}).sort({createdAt: -1})

    res.status(200).json(reservations)
}

// //get reservations on day
// const searchReservations = async (req, res) => {
//     const {day} = req.params;

//     const startDate = day.

//     if (!mongoose.Types.Date.isValid(day)) {
//         return res.status(404).json({error: "Invalid Date"});
//     }

//     const reservations = await Reservation.find({})

//     if (!reservation) {
//         return res.status(404).json({error: "No reservation found"});
//     }

//     res.status(200).json(reservation);
// }

//get one reservation
const getReservation = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No reservation found"});
    }

    const reservation = await Reservation.findById(id);

    if (!reservation) {
        return res.status(404).json({error: "No reservation found"});
    }

    res.status(200).json(reservation);
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

//remove reservation with id
const removeReservation = async (req, res) => {
    const {id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No reservation found"});
    }

    const reservation = await Reservation.findOneAndDelete({_id: id})

    if (!reservation) {
        return res.status(404).json({error: "No reservation found"});
    }

    res.status(200).json({reservation});
}

//get classes on day at building
const getClasses = async (req, res) => {
    const {building, day} = req.params;
    const apiString = "https://api.utdnebula.com/section?academic_session.name=23F"
    const buildingString = `&meetings.location.building=${building}`
    const dayString = `&meetings.meeting_days=${day}`
    const requestString = apiString + buildingString + dayString
    console.log(requestString)
    const response = await fetch(requestString, {
        method: 'GET',
        headers: {
            'x-api-key' : process.env.API_KEY,
            'Accept': 'application/json',
        },
      })


      classes = await response.json();
      console.log(classes)

    res.status(200).json({classes});
}

//get rooms
const getRooms = async (req, res) => {
    const {building} = req.params;

    const roomList = await rooms.buildings[building]

    res.status(200).json(roomList);
}

//get availablity
const getAvailable = async (req, res) => {
    const {building, day} = req.params;

    const roomList = await rooms.buildings[building]

    const apiString = "https://api.utdnebula.com/section?academic_session.name=23F"
    const buildingString = `&meetings.location.building=${building}`
    const dayString = `&meetings.meeting_days=${day}`
    const requestString = apiString + buildingString + dayString
    console.log(requestString)
    const response = await fetch(requestString, {
        method: 'GET',
        headers: {
            'x-api-key' : process.env.API_KEY,
            'Accept': 'application/json',
        },
      })


    classes = await response.json();

    let classesList = [];
    for (i = 0; i < classes.data.length; i++)
    {
        classesList.push(classes.data[i].meetings[0].location.room);
    }

    let available;

    for(i = 0; i < rooms.length; i++)
    {
        
    }


    res.status(200).json(roomList);
}

module.exports = {
    getReservations,
    getReservation,
    createReservation,
    removeReservation,
    getClasses,
    getRooms,
    getAvailable
}

