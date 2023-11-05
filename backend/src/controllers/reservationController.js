require('dotenv').config()
const Reservation = require('../models/reservationModel.js')
const sensorServer = require('./communication.js').server
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
            "1.315",
            "2.100",
            "2.150",
            "2.415",
            "2.164",
            "2.160",
            "2.410",
            "2.430",
            "2.430A",
            "2.445",
            "2.455",
            "2.440",
            "2.450",
            "2.460",
            "2.470",
            "2.475",
            "2.375",
            "2.369",
            "2.475A",
            "2.355",
            "2.355",
            "2.325",
            "2.315A",
            "2.309",
            "2.315",
            "2.305",
            "2.336",
            "2.330",
            "2.250",
            "2.210",
            "2.125",
            "2.115"


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

    let roomData = [];
    for (i = 0; i < rooms.buildings[building].length; i++)
    {
        roomData.push({room: rooms.buildings[building][i], type: 0, startTime: 0, endTime: 0})
    }

    res.status(200).json(roomData);
}

//get availablity class
const getAvailableClass = async (req, res) => {
    const {building, day} = req.params;

    const apiString = "https://api.utdnebula.com/section?academic_session.name=23F"
    const buildingString = `&meetings.location.building=${building}`
    const dayString = `&meetings.meeting_days=${day}`
    const requestString = apiString + buildingString + dayString
    console.log(requestString)
    let reponseJSON;
    let classes = [];
    let offset = 0;
    do
    {
        const offsetString = `&offset=${offset}`
        console.log("run")
        response = await fetch(requestString + offsetString, {
            method: 'GET',
            headers: {
                'x-api-key' : process.env.API_KEY,
                'Accept': 'application/json',
            },
          })
    
        responseJSON = await response.json()
        if (responseJSON.data != null) 
        {
            classes = classes.concat(responseJSON.data);
        }
        offset += 20;
    }
    while (responseJSON.data != null);

    let available = [];
    for (i = 0; i < classes.length; i++)
    {
        available.push({room: classes[i].meetings[0].location.room, 
            type: 1, 
            startTime: classes[i].meetings[0].start_time.toString().substring(11,16), 
            endTime: classes[i].meetings[0].end_time.toString().substring(11,16)});
    }

    res.status(200).json(available);
}

const getAvailableReserve = async (req, res) => {
    const {building, date} = req.params;

    let available =[];

    startDateString = date + "T00:00:00.000+00:00"
    endDateString = date + "T23:59:59.000+00:00"
    const startDate = new Date(startDateString)
    const endDate = new Date(endDateString)


    const reservations = await Reservation.find({
        startTime: {
            $gte: startDate,
            $lt: endDate
        }
    }).sort({createdAt: -1})

    for (i = 0; i < reservations.length; i++)
    {
        available.push({room: reservations[i].room, 
            type: 2, 
            startTime: reservations[i].startTime.toString().substring(16,21), 
            endTime: reservations[i].endTime.toString().substring(16,21)});
    }

    res.status(200).json(available);
}

const getMotion = async (req, res) => {
    const {building} = req.params;

    SensorServer.getMotion();

    let motion = [];

    //motion.push({
    //    room: 
    //})
}





module.exports = {
    getReservations,
    getReservation,
    createReservation,
    removeReservation,
    getClasses,
    getRooms,
    getAvailableClass,
    getAvailableReserve
}

