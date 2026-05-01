const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { signupSchema, loginSchema } = require("../validations/authSchemas");

const saltRounds = 12;

const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });
};

const signup = async (req, res) => {
  try {
    const validatedData = signupSchema.parse(req.body);

    const existingUser = await User.findOne({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

    const user = await User.create({
      email: validatedData.email,
      passwordHash,
      fullName: validatedData.fullName,
      role: validatedData.role,
      phone: validatedData.phone,
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
};

const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await User.findOne({
      where: { email: validatedData.email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      validatedData.password,
      user.passwordHash,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
};
