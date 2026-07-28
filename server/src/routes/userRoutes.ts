import { Router } from "express";
import { updateAddress } from "../controllers/userController.js";

const router = Router();

router.put("/address", updateAddress);

export default router;
