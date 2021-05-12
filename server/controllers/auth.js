import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    }

    // Check if user exists
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken...");

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log("Saved User", user);

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error Occurred... Please Try Again...");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if our DB has user with that email
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No User Found...");

    // Check Password
    const match = await comparePassword(password, user.password); // Boolean Value

    // Create Signed JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user and token to client, exclude hashed password
    user.password = undefined;

    // Send token in cookie - Browser can access this cookie
    // Same Domain 에서 동작하기 때문에 브라우저 쿠키에 바로 전달된다.
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // only works on https
    });

    // Send user as json response
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error Occurred... Please Try Again...");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Logout Success" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};
