const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

const initializeDatabase = async () => {
  try {
    console.log("\nStarting database initialization...\n");

    // Step 1: Test connection
    await testConnection();

    console.log("Verifying/creating ENUM types...");
    await sequelize.query(`
      DO $$ 
      BEGIN
        -- User role ENUM
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_role') THEN
          CREATE TYPE enum_users_role AS ENUM('patient', 'caregiver', 'clinic');
          RAISE NOTICE 'Created enum_users_role';
        ELSE
          RAISE NOTICE 'enum_users_role already exists';
        END IF;

        -- Appointment status ENUM
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_appointments_status') THEN
          CREATE TYPE enum_appointments_status AS ENUM('scheduled', 'completed', 'cancelled');
          RAISE NOTICE 'Created enum_appointments_status';
        ELSE
          RAISE NOTICE 'enum_appointments_status already exists';
        END IF;

        -- Caregiver assignment relationship type
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_caregiver_assignments_relationship_type') THEN
          CREATE TYPE enum_caregiver_assignments_relationship_type AS ENUM('family', 'friend', 'professional');
          RAISE NOTICE 'Created enum_caregiver_assignments_relationship_type';
        ELSE
          RAISE NOTICE 'enum_caregiver_assignments_relationship_type already exists';
        END IF;
        
        -- Caregiver assignment access level
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_caregiver_assignments_access_level') THEN
          CREATE TYPE enum_caregiver_assignments_access_level AS ENUM('full', 'limited');
          RAISE NOTICE 'Created enum_caregiver_assignments_access_level';
        ELSE
          RAISE NOTICE 'enum_caregiver_assignments_access_level already exists';
        END IF;

        -- Support request type
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_support_requests_request_type') THEN
          CREATE TYPE enum_support_requests_request_type AS ENUM('transport', 'notes', 'pickup', 'meal_prep', 'recovery_care', 'other');
          RAISE NOTICE 'Created enum_support_requests_request_type';
        ELSE
          RAISE NOTICE 'enum_support_requests_request_type already exists';
        END IF;
        
        -- Support request status
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_support_requests_status') THEN
          CREATE TYPE enum_support_requests_status AS ENUM('pending', 'accepted', 'declined', 'completed');
          RAISE NOTICE 'Created enum_support_requests_status';
        ELSE
          RAISE NOTICE 'enum_support_requests_status already exists';
        END IF;

        -- Task type
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_tasks_task_type') THEN
          CREATE TYPE enum_tasks_task_type AS ENUM('medication', 'imaging', 'lab_work', 'follow_up', 'rest', 'lifestyle', 'other');
          RAISE NOTICE 'Created enum_tasks_task_type';
        ELSE
          RAISE NOTICE 'enum_tasks_task_type already exists';
        END IF;
      END $$;
    `);

    console.log("ENUM types verified/created\n");

    console.log("Syncing database models...");
    await sequelize.sync({ force: false });
    console.log("Database models synced successfully\n");

    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  initializeDatabase,
};
