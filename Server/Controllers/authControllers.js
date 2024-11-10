/**
 * authControllers.js
 *
 * This file contains the controller functions for handling authentication
 * and authorization-related functionality within the Student Portal project.
 * Specifically, it manages the functionality associated with the /auth route.
 * This module is imported by the `authRoutes` route file.
 *
 * Controller Functions:
 * - `loginUser`: Handles user login requests. It responds with different status codes
 *   based on the outcome of the request.
 *
 * Error Handling:
 * - Each controller function includes a `try-catch` block. The `catch` block logs
 *   any errors to the console and returns an appropriate error response to the client.
 *
 * Status Codes:
 * - 200: Success - Indicates that the API request was successful and the functionality
 *   was fulfilled (e.g., user authenticated successfully).
 * - 201: Invalid - Indicates that the API request was processed but the result was
 *   not favorable to the client (e.g., incorrect password).
 * - 400: Bad Request - Indicates that the API request was invalid or failed (e.g., missing credentials, DB failed).
 * - 500: Internal Server Error - Indicates a server-side issue preventing the request
 *   from being fulfilled (e.g., server connectivity issues).
 */

import bcryptjs from "bcryptjs";
import user from "../Models/User.model.js";
import student from "../Models/StudentUser.model.js";
import faculty from "../Models/FacultyUser.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { jwtDecode } from "jwt-decode";

dotenv.config();
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

// Method for handling user login requests
export const loginUser = async (req, res) => {
  try {
    const { email, password, isFaculty } = req.body;
    const userData = await user.findOne({ email: email });
    if (!userData) {
      return res.status(201).json({ error: "User not found" });
    } else {
      if (userData.firstTime) {
        if (password === userData.password) {
          return res.status(200).json({ firstTimer: true });
        } else {
          return res.status(400).json({ error: "Incorrect password" });
        }
      } else {
        const passwordMatch = await bcryptjs.compareSync(
          password,
          userData.password
        );
        if (!passwordMatch) {
          return res.status(201).json({ error: "Incorrect password" });
        } else {
          jwt.sign(
            { email, isFaculty },
            jwtPrivateKey,
            { expiresIn: "60d" },
            (err, token) => {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ error: "Error generating token" });
              }
              res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
              });
            }
          );
          if (isFaculty) {
            // Stimulate fetching data of faculty from StudentUser.model
            const facultyData = await faculty.findOne({ email });
            return res.status(200).json({ isFaculty: true, facultyData });
          } else {
            // Stimulate fetching data of faculty from StudentUser.model

            const studentData = await student.findOne({ email });
            return res.status(200).json(studentData);
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message });
  }
};

// Method for changing Password and changing firstTime parameter to false
export const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcryptjs.hashSync(newPassword, 8);
    const userDB = await user.findOne({ email });
    if (userDB) {
      userDB.password = hashedPassword;
      userDB.firstTime = false;
      userDB
        .save()
        .then(() => {
          return res
            .status(200)
            .json({ success: true, message: "Password changed successfully" });
        })
        .catch((err) => {
          return res.status(400).json({ error: "Failed to change password" });
        });
    } else {
      return res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

//Method for logging in a user using JWT credentials
export const tokenLogin = async (req, res) => {
  const { token } = req;
  try {
    let email, isFaculty;
    jwt.verify(token, jwtPrivateKey, (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Authorization Failed" });
      }
      email = data.email;
      isFaculty = data.isFaculty;
    });
    if (isFaculty) {
      const facultyData = await faculty
        .findOne({ email })
        .populate(["classroom", "subjects"]);
      return res.status(200).json({ isFaculty: true, facultyData});
    } else {
      const result = await student
        .findOne({ email })
        .populate(["branchId", "subjects"]);
      return res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//Method for logging out a user from the browser
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const { ABCId, DOB, avatar } = req.body;
    const { email } = jwtDecode(req.token);
    const userDb = await student.updateOne({ email }, { avatar, DOB, ABCId });
    if (userDb) {
      return res
        .status(200)
        .json({ success: true, message: "Profile edited successfully" });
    } else {
      return res.status(400).json({ error: "Failed to edit profile" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
