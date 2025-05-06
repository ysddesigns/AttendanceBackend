const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Create JWT
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role, fullname: newUser.fullname },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Exclude password in response
    const userToReturn = {
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      role: newUser.role,
    };

    res.status(201).json({
      user: userToReturn,
      token,
      message: "User registered successfully ✅",
    });

    // res.status(201).json({ message: "User registered successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid credentials Please Check Again " });

    // Create JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role, fullname: user.fullname },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const userInfo = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming userId is set in the request object (e.g., via middleware)

    // Fetch user details
    const user = await User.findById(userId).select("-password"); // Exclude password from the response
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const setRole = async (req, res) => {
  const { role } = req.body;

  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("❌ Error updating role:", error);
    res.status(500).json({ message: "Error updating role", error });
  }
};

module.exports = { login, register, userInfo, setRole };
