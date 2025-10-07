import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { validateRatingInput } from "../middleware/validation.js";
import {
    listStores,
    getStore,
    submitRating,
    updateRating,
} from "../controllers/storeController.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", listStores);
router.get("/:id", getStore);
router.post("/:id/rating", validateRatingInput, submitRating);
router.put("/:id/rating", validateRatingInput, updateRating);

export default router;