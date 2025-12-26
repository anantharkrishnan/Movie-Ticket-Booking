const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/userModel"); 


mongoose.connect("mongodb+srv://ananthakrishnan1102_db_user:cbWHlHSCmBzheYpd@cluster0.njg70o9.mongodb.net/movie-website", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

(async () => {
  try {
   
    const existingAdmin = await User.findOne({ role: "admin", email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // 4. Create the admin
    const admin = await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date()
    });

    console.log("Admin created successfully:", admin);
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
})();
