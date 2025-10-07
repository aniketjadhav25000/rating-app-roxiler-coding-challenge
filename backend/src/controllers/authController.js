import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        const hashed = await bcrypt.hash(password, 10);
        const role = "user";

        const { rows } = await pool.query(
            "INSERT INTO users (name, email, password_hash, address, role) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (email) DO NOTHING RETURNING id, name, email, role",
            [name, email, hashed, address, role]
        );

        if (rows.length === 0) {
             return res.status(409).json({ message: "User with this email already exists." });
        }

        res.status(201).json({ message: "User registered", user: rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Registration failed." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        const user = rows[0];
        if (!user) return res.status(404).json({ message: "User not found" });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const { rows } = await pool.query("SELECT * FROM users WHERE id=$1", [req.user.id]);
        const user = rows[0];
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(oldPassword, user.password_hash);
        if (!match) return res.status(401).json({ message: "Old password incorrect" });

        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password_hash=$1 WHERE id=$2", [hashed, req.user.id]);

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Password change failed" });
    }
};