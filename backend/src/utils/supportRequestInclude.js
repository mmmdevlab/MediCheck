const User = require("../models/User");
const Appointment = require("../models/Appointment");

const supportRequestInclude = [
  {
    model: User,
    as: "patient",
    attributes: ["id", "fullName", "email"],
  },
  {
    model: User,
    as: "caregiver",
    attributes: ["id", "fullName", "email", "phone"],
  },
  {
    model: Appointment,
    as: "appointment",
    attributes: ["id", "doctorName", "clinicName", "appointmentDate"],
  },
];

module.exports = supportRequestInclude;
