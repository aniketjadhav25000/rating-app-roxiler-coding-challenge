import express from "express";
import { register, login, changePassword } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";
import { validateUser, validateNewPassword } from "../middleware/validation.js";

const router = express.Router();

router.post("/register", validateUser, register);
router.post("/login", login);
router.post("/change-password", verifyToken, validateNewPassword, changePassword);

export default router;