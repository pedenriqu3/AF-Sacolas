import { Router } from "express";
import { updateAddress, updateProfile } from "../controllers/userController.js";

const router = Router();

router.put("/profile", updateProfile);
router.put("/address", updateAddress);

export default router;
