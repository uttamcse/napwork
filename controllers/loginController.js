const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
require("dotenv").config();

const log = (message, data = {}) => {
  console.log(message, JSON.stringify(data, null, 2));
};

const generateToken = (studentId) => {
  return jwt.sign(
    { id: studentId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME || "1h" }
  );
};


const signup = async (req, res) => {

  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email, and password are required",
      });
    }

    const userExists = await Student.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newStudent = new Student({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newStudent.save();

    // Generate JWT
    const token = generateToken(newStudent._id);

    const response = {
      success: true,
      message: "Signup successful",
      token,
      student: {
        _id: newStudent._id,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        email: newStudent.email,
      },
    };

    res.status(200).json(response);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during signup",
      error: error.message,
    });
  }
};


const login = async (req, res) => {

  try {
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      log("Login Failed: Invalid Password", { email });
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate token
    const token = generateToken(student._id);

    const response = {
      success: true,
      message: "Login successful",
      token,
      student: {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      },
    };

    res.status(200).json(response);

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
};
