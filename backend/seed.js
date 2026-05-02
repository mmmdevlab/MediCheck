const bcrypt = require("bcrypt");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const { sequelize } = require("./src/config/database");
const {
  User,
  Appointment,
  CaregiverAssignment,
  SupportRequest,
  MedicalLog,
  Task,
} = require("./src/models");

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await Task.destroy({ where: {}, force: true });
    await SupportRequest.destroy({ where: {}, force: true });
    await MedicalLog.destroy({ where: {}, force: true });
    await CaregiverAssignment.destroy({ where: {}, force: true });
    await Appointment.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    console.log("Cleared existing data");

    const hashedPassword = await bcrypt.hash("Password123!", 12);

    const patient = await User.create({
      email: "patient@test.com",
      passwordHash: hashedPassword,
      fullName: "Test Patient",
      role: "patient",
      phone: "+65 9123 4567",
      dateOfBirth: "1985-05-12",
    });

    const caregiver = await User.create({
      email: "caregiver@test.com",
      passwordHash: hashedPassword,
      fullName: "Test Caregiver",
      role: "caregiver",
      phone: "+65 9234 5678",
      dateOfBirth: "1985-05-20",
    });

    console.log("Created test users.");
    console.log(`   - Patient: ${patient.email} (ID: ${patient.id})`);
    console.log(`   - Caregiver: ${caregiver.email} (ID: ${caregiver.id})`);

    // Grant caregiver access to patient
    const assignment = await CaregiverAssignment.create({
      patientId: patient.id,
      caregiverId: caregiver.id,
      relationshipType: "family",
      accessLevel: "full",
      isActive: true,
    });

    console.log("Created caregiver assignment");

    // Appointments
    const now = new Date();

    const upcomingDate = new Date("2026-05-20T10:00:00+08:00");
    const appointment1 = await Appointment.create({
      userId: patient.id,
      title: "Annual Physical Checkup",
      doctorName: "Dr. Sarah Tan",
      clinicName: "Raffles Medical Group",
      appointmentDate: upcomingDate,
      location: "Tower B, Level 3, Room 302",
      status: "scheduled",
      notes:
        "Bring recent lab work and list of current medications. Fast for 8 hours before appointment.",
    });

    const completedDate = new Date("2026-04-15T14:00:00+08:00");
    const appointment2 = await Appointment.create({
      userId: patient.id,
      title: "Dental Cleaning",
      doctorName: "Dr. Lee Wei Ming",
      clinicName: "Q&M Dental Surgery",
      appointmentDate: completedDate,
      location: "Orchard Road, #05-12",
      status: "completed",
      notes:
        "Routine cleaning completed. No cavities detected. Next visit in 6 months.",
    });

    const missedDate = new Date("2026-04-20T09:00:00+08:00");
    const appointment3 = await Appointment.create({
      userId: patient.id,
      title: "Cardiology Follow-up",
      doctorName: "Dr. Robert Chen",
      clinicName: "National Heart Centre Singapore",
      appointmentDate: missedDate,
      location: "Block A, Level 2, Clinic 2A",
      status: "scheduled",
      notes:
        "Follow-up on blood pressure medication. Bring BP readings from last 2 weeks.",
    });

    const cancelledDate = new Date("2026-05-25T11:00:00+08:00");
    const appointment4 = await Appointment.create({
      userId: patient.id,
      title: "Dermatology Consultation",
      doctorName: "Dr. Emily Ng",
      clinicName: "National Skin Centre",
      appointmentDate: cancelledDate,
      location: "Mandalay Road, Level 1",
      status: "cancelled",
      notes: "Cancelled due to schedule conflict. Will reschedule next month.",
    });

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const appointment5 = await Appointment.create({
      userId: patient.id,
      title: "Eye Examination",
      doctorName: "Dr. Tan Mei Ling",
      clinicName: "Singapore National Eye Centre",
      appointmentDate: nextWeek,
      location: "Block 11, Level 3, Eye Clinic",
      status: "scheduled",
      notes: "Bring existing glasses. Pupil dilation test may be done.",
    });

    console.log("Created appointments");
    console.log(`   - ${appointment1.title} (${appointment1.appointmentDate})`);
    console.log(`   - ${appointment2.title} (${appointment2.appointmentDate})`);
    console.log(`   - ${appointment3.title} (${appointment3.appointmentDate})`);
    console.log(`   - ${appointment4.title} (${appointment4.appointmentDate})`);
    console.log(`   - ${appointment5.title} (${appointment5.appointmentDate})`);

    // Tasks
    const task1 = await Task.create({
      appointmentId: appointment1.id,
      patientId: patient.id,
      title: "Fast for 8 hours before appointment",
      description:
        "No food or drinks except water after midnight. Appointment at 10 AM.",
      taskType: "lab_work",
      dueDate: upcomingDate,
      isCompleted: false,
    });

    const task2 = await Task.create({
      appointmentId: appointment1.id,
      patientId: patient.id,
      title: "Bring NRIC and Medisave card",
      description: "Insurance and identification required for registration",
      taskType: "other",
      dueDate: upcomingDate,
      isCompleted: true,
    });

    const task3 = await Task.create({
      appointmentId: appointment5.id,
      patientId: patient.id,
      title: "Pick up prescription refill at Guardian Pharmacy",
      description: "Blood pressure medication - 30-day supply",
      taskType: "medication",
      dueDate: nextWeek,
      isCompleted: false,
    });

    const task4 = await Task.create({
      appointmentId: appointment3.id,
      patientId: patient.id,
      title: "Bring blood pressure readings (2 weeks)",
      description: "Morning and evening readings recorded at home",
      taskType: "other",
      dueDate: missedDate,
      isCompleted: false,
    });

    console.log("Created tasks");
    console.log(`   - ${task1.title}`);
    console.log(`   - ${task2.title}`);
    console.log(`   - ${task3.title}`);
    console.log(`   - ${task4.title}`);

    // Medical Logs (7 days)
    console.log("Creating 7 days of medical logs...");

    const logs = [];
    for (let i = 6; i >= 0; i--) {
      const logDate = new Date();
      logDate.setDate(logDate.getDate() - i);

      const randomHour = Math.floor(Math.random() * 12) + 8;
      const randomMinute = Math.floor(Math.random() * 60);
      logDate.setHours(randomHour, randomMinute, 0, 0);

      const log = await MedicalLog.create({
        userId: patient.id,
        feelingScore: Math.floor(Math.random() * 3) + 3,
        createdAt: logDate,
      });
      logs.push(log);
    }
    console.log("Created 7 days of medical logs");

    // Create Support Requests
    const supportRequest1 = await SupportRequest.create({
      appointmentId: appointment1.id,
      patientId: patient.id,
      caregiverId: caregiver.id,
      requestType: "transport",
      status: "accepted",
      message: "Need a ride to tomorrow's appointment at 9 AM",
      respondedAt: new Date(),
    });

    const supportRequest2 = await SupportRequest.create({
      appointmentId: appointment5.id,
      patientId: patient.id,
      caregiverId: caregiver.id,
      requestType: "notes",
      status: "pending",
      message:
        "Can you come along to take notes during the eye exam consultation?",
    });

    const supportRequest3 = await SupportRequest.create({
      appointmentId: appointment3.id,
      patientId: patient.id,
      caregiverId: caregiver.id,
      requestType: "transport",
      status: "declined",
      message:
        "Need transport to National Heart Centre (this was the missed appointment)",
      respondedAt: new Date(missedDate),
    });

    console.log("Created support requests");
    console.log(`   - Transport request (accepted) - ${appointment1.title}`);
    console.log(`   - Notes request (pending) - ${appointment5.title}`);
    console.log(`   - Transport request (declined) - ${appointment3.title}`);

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
