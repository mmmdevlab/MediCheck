const bcrypt = require("bcrypt");
const { sequelize } = require("./config/database");
const {
  User,
  Appointment,
  CaregiverAssignment,
  SupportRequest,
  MedicalLog,
  Task,
} = require("./models");

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
      phone: "+81 555-0100",
      dateOfBirth: "1990-01-15",
    });

    const caregiver = await User.create({
      email: "caregiver@test.com",
      passwordHash: hashedPassword,
      fullName: "Jane Caregiver",
      role: "caregiver",
      phone: "+81 555-0200",
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
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const appointment1 = await Appointment.create({
      userId: patient.id,
      title: "Annual Checkup",
      doctorName: "Dr. Sarah Johnson",
      clinicName: "Tokyo Medical Center",
      appointmentDate: tomorrow,
      location: "Building A, 3rd Floor",
      status: "scheduled",
      notes: "Bring previous test results",
    });

    const appointment2 = await Appointment.create({
      userId: patient.id,
      title: "Follow-up Consultation",
      doctorName: "Dr. Michael Chen",
      clinicName: "Shibuya Clinic",
      appointmentDate: nextWeek,
      location: "Room 205",
      status: "scheduled",
      notes: "Discuss medication adjustments",
    });

    const appointment3 = await Appointment.create({
      userId: patient.id,
      title: "Blood Test",
      doctorName: "Dr. Emily Tanaka",
      clinicName: "Tokyo Medical Center",
      appointmentDate: lastWeek,
      status: "completed",
      notes: "Results reviewed - all normal",
    });

    console.log("Created appointments");
    console.log(`   - ${appointment1.title} (${appointment1.appointmentDate})`);
    console.log(`   - ${appointment2.title} (${appointment2.appointmentDate})`);
    console.log(`   - ${appointment3.title} (${appointment3.appointmentDate})`);

    // Tasks
    const task1 = await Task.create({
      appointmentId: appointment1.id,
      patientId: patient.id,
      title: "Fast for 8 hours before appointment",
      description: "No food or drinks except water after midnight",
      taskType: "lab_work",
      dueDate: tomorrow,
      isCompleted: false,
    });

    const task2 = await Task.create({
      appointmentId: appointment1.id,
      patientId: patient.id,
      title: "Bring insurance card and ID",
      taskType: "other",
      dueDate: tomorrow,
      isCompleted: true,
    });

    const task3 = await Task.create({
      appointmentId: appointment2.id,
      patientId: patient.id,
      title: "Pick up prescription refill",
      taskType: "medication",
      dueDate: nextWeek,
      isCompleted: false,
    });

    console.log("Created tasks");
    console.log(`   - ${task1.title}`);
    console.log(`   - ${task2.title}`);
    console.log(`   - ${task3.title}`);

    // Medical Logs (7 days)
    const logs = [];
    for (let i = 6; i >= 0; i--) {
      const logDate = new Date();
      logDate.setDate(logDate.getDate() - i);

      const log = await MedicalLog.create({
        userId: patient.id,
        feelingScore: Math.floor(Math.random() * 2) + 3,
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
      appointmentId: appointment2.id,
      patientId: patient.id,
      caregiverId: caregiver.id,
      requestType: "notes",
      status: "pending",
      message: "Can you help me remember what the doctor said?",
    });

    console.log("Created support requests");
    console.log(`   - Transport request (accepted)`);
    console.log(`   - Notes request (pending)`);

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
