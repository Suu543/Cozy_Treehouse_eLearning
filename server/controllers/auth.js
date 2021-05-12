import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";

const awsConfig = {
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

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
    if (!match) return res.status(400).send("Wrong Password");

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

export const sendTestEmail = async (req, res) => {
  // console.log("Send Email Using SES");
  // res.json({ ok: true });
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: ["jos50275266@gmail.com"],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <html>
              <h1>Reset Password Link</h1>
              <p>Please use the following link to reset your password</p>
            </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Password Reset Link",
      },
    },
  };

  const emailSent = SES.sendEmail(params).promise();

  emailSent
    .then((data) => {
      console.log(data);
      res.json({ ok: true });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );

    if (!user) return res.status(400).send("User Not Found...");

    // Prepare for Email
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
              <html>
                <h1>Reset Password</h1>
                <p>User this code to reset your passwrod</p>
                <h2 style="color:red;">${shortCode}</h2>
                <i>Cozy Treehouse eLearning</i>
              </html>
            `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset Password",
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    // console.table({ email, code, newPassword });
    const hashedPassword = await hashPassword(newPassword);

    const user = User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: "",
      }
    ).exec();

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error! Please Try Again!");
  }
};
