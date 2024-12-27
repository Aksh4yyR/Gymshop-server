require('dotenv').config(); // Load .env variables

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const users = require("./models/userModel"); 

const ConnectionString = process.env.DBCONNECTIONSTRING;

// Connect to MongoDB Atlas
mongoose.connect(ConnectionString)
  .then(() => {
    console.log("MongoDB connection established");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

async function updateAdminPassword() {
  try {
    // Find the admin user by email
    const adminUser = await users.findOne({ email: "admin@gmail.com" });

    if (!adminUser) {
      console.log("Admin user not found");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("admin", 12);

    // Update the password in the database
    adminUser.password = hashedPassword;
    await adminUser.save();

    console.log("Admin password updated successfully");
  } catch (error) {
    console.error("Error updating admin password:", error);
  } finally {
    mongoose.connection.close();
  }
}

updateAdminPassword();
