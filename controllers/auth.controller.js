const bcrypt = require("bcrypt");

const dbConnection = require("../config/db");
const generateToken = require("../core/generateToken");

// Registre controller
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validation
    if (!username || !email || !password)
      return res.status(400).json({ message: "required data !", data: null });

    // DB
    const db = await dbConnection();

    // Username exists ??
    const usernameExist = await db.collection("Users").findOne({ username });
    if (usernameExist)
      return res
        .status(401)
        .json({ message: "Invalid Username !", data: null });

    // Email exists ??
    const user = await db.collection("Users").findOne({ email });
    if (user)
      return res.status(401).json({ message: "Invalid Email !", data: null });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db
      .collection("Users")
      .insertOne({ username, email, password: hashedPassword });

    // Create token
    const token = generateToken(result.insertedId);

    // Succesful Responce
    return res.status(201).json({
      message: "User registered successfully",
      data: { _id: result.insertedId, ...req.body, password: undefined },
      token,
    });
  } catch (error) {
    console.log("register ~ error:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", data: null });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required.", data: null });

    // DB
    const db = await dbConnection();

    // Find user
    const user = await db.collection("Users").findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid email or password.", data: null });

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(401)
        .json({ message: "Invalid email or password.", data: null });

    // Create token
    const token = generateToken(user._id);

    // Succesful Responce
    return res.status(200).json({
      message: "Login successful",
      data: { ...user, password: undefined },
      token,
    });
  } catch (error) {
    console.log("login ~ error:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", data: null });
  }
};

// Logout controller
const logout = async (req, res) => {
  try {
    // Invalidate the token
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      invalidateToken(token); // Implement token invalidation logic here
    }

    return res.status(200).json({
      message: "Logout successful",
      data: null,
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", data: null });
  }
};

module.exports = { register, login, logout };
