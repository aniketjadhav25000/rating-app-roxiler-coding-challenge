import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { validateUser, validateStore } from "../middleware/validation.js";
import {
    getDashboard,
    createUser,
    listUsers,
    getUserDetails,
    listStores,
    createStore,
    deleteUser, 
    deleteStore,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(verifyToken, allowRoles("admin"));

router.get("/dashboard/stats", getDashboard);

router.post("/users", validateUser, createUser);
router.get("/users", listUsers);
router.get("/users/:id", getUserDetails);
router.delete("/users/:id", deleteUser); 

router.get("/stores", listStores);
router.post("/stores", validateStore, createStore);
router.delete("/stores/:id", deleteStore); 

export default router;