const { sequelize, testConnection } = require("./src/config/database");

const runTest = async () => {
  try {
    await testConnection();

    const tables = [
      "users",
      "appointments",
      "caregiver_assignments",
      "support_requests",
      "medical_logs",
      "tasks",
    ];

    for (const table of tables) {
      const result = await sequelize.query(
        `SELECT COUNT(*) as count FROM ${table}`,
      );
      const count = result[0][0].count;
      console.log(`${table} table has ${count} records`);
    }

    console.log("Everything is working!");

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err.message);
    process.exit(1);
  }
};

runTest();
