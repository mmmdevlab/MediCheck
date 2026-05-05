const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { signupSchema, loginSchema } = require("../validations/authSchemas");
const catchAsync = require("../utils/catchAsync");

const saltRounds = 12;
const refreshTokens = new Map();

const generateAccessToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });
};

const generateRefreshToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    type: "refresh",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  refreshTokens.set(token, {
    userId: user.id,
    createdAt: Date.now(),
  });
  return token;
};

const signup = catchAsync(async (req, res, next) => {
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

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.status(201).json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
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

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.status(200).json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
});

const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.userId, {
    attributes: { exclude: ["passwordHash"] },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user });
});

const refreshTokenHandler = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }
  if (!refreshTokens.has(refreshToken)) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    refreshTokens.delete(refreshToken);
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

const deleteAccount = catchAsync(async (req, res, next) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  for (const [token, tokenData] of refreshTokens.entries()) {
    if (tokenData.userId === userId) {
      refreshTokens.delete(token);
    }
  }

  await user.destroy();

  return res.status(200).json({ message: "Account deleted successfully" });
});

module.exports = {
  signup,
  login,
  getProfile,
  refreshTokenHandler,
  deleteAccount,
};
