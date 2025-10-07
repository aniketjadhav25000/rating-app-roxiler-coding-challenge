import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { 
    listOwnedStores, 
    getStoreRatings, 
    getStoreSummary,
    createOwnedStore,
    deleteOwnedStore 
} from "../controllers/ownerController.js"; 

import { validateStore } from "../middleware/validation.js"; 

const router = express.Router();

router.use(verifyToken, allowRoles("owner"));

router.post("/stores", validateStore, createOwnedStore); 

router.get("/stores", listOwnedStores);

router.get("/stores/:id/ratings", getStoreRatings);

router.get("/stores/:id/summary", getStoreSummary);

router.delete("/stores/:storeId", deleteOwnedStore);

export default router;