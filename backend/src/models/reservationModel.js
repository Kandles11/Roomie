const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    user: {
        type: String,
        required: true 
    },
    room: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},
    {collection: 'reservations'}
)

module.exports = mongoose.model('Reservation', ReservationSchema);