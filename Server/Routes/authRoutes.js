/**
 * authRoutes.js
 *
 * This file is a component of the Authorization and Authentication module 
 * for the Student Portal project. It defines the routes responsible for 
 * handling user authentication requests.
 *
 * Specifically, this module sets up the route to handle user login requests, 
 * invoking the appropriate controller function to process these requests.
 * The router is then exported for integration with the main server file.
 *
 * Route:
 * - GET /: Calls the `loginUser` function from the `authControllers` module 
 *   to handle login requests.
 */

import express from "express";
import  { changePassword, loginUser, logoutUser, tokenLogin } from "../Controllers/authControllers.js";
import { authorization } from "../middlewares/auth.js";

const router = express.Router();

// Define the route and associate it with the controller function
router.post("/", loginUser);
router.post("/change-password", changePassword);
router.get("/tokenLogin", authorization, tokenLogin);
router.get("/logout", authorization, logoutUser)
// Export the router for use in the main server file
export default router;
