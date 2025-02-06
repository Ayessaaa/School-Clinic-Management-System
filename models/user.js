const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    student_id:{
        type: String,
        required: true
    },
    section:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    sex:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    guardian_name:{
        type: String,
        required: true
    },
    guardian_number:{
        type: String,
        required: true
    },
    adviser_name:{
        type: String,
        required: true
    },
    adviser_number:{
        type: String,
        required: true
    },
    chronic_health_condition:{
        type: Array,
        required: false
    },
    medications:{
        type: Array,
        required: false
    },
    doctors:{
        type: Array,
        required: false
    },
    doctor_number:{
        type: Array,
        required: false
    },
    health_history:{
        type: String,
        required: true
    },
    rfid:{
        type: String,
        required: true
    },
}, {timestamps: true})

const User = mongoose.model('User', userSchema);
module.exports = User;