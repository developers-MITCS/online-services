const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const response = require("../utils/response.utils");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1hr";
// REGISTER
exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      firstname,
      lastname,
      middlename,
      suffix,
    } = req.body;

    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      return response.error(res, "Email already exists", "EMAIL_EXISTS", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      firstname,
      lastname,
      middlename,
      suffix,
      role: role || "cashier",
    });

    return response.success(res, "User created successfully", { userId }, 201);
  } catch (error) {
    console.error(error);

    return response.error(res, "Failed to create user", error.message, 500);
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);

    if (!user) {
      return response.error(
        res,
        "Invalid credentials",
        "INVALID_CREDENTIALS",
        401,
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return response.error(
        res,
        "Invalid credentials",
        "INVALID_CREDENTIALS",
        401,
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    return response.success(
      res,
      "Login successful",
      {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);

    return response.error(res, "Login failed", error.message, 500);
  }
};

// PROFILE
exports.me = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return response.error(res, "User not found", "USER_NOT_FOUND", 404);
    }

    delete user.password;

    return response.success(res, "Profile retrieved successfully", user, 200);
  } catch (error) {
    console.error(error);

    return response.error(
      res,
      "Failed to retrieve profile",
      error.message,
      500,
    );
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await UserModel.getAll();

    return response.success(res, "Users retrieved successfully", data, 200);
  } catch (err) {
    console.error(err);

    return response.error(res, "Failed to retrieve Users", err.message, 500);
  }
};
