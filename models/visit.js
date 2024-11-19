const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitSchema = new Schema ({
    reason:{
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true
    },
    medications: {
        type: Array,
        required: true
    },
    nurse: {
        type: String,
        required: true
    },
    rfid: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true
    },
    section:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    time_start:{
        type: String,
        required: true
    },
    time_end:{
        type: String,
        required: true
    }
}, {timestamps: true});

const Visit = mongoose.model('Visit', visitSchema);
module.exports = Visit;