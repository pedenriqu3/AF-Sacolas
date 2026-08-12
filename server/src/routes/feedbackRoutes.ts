import { Router } from "express";
import { createFeedback, listFeedbacks } from "../controllers/feedbackController.js";

const router = Router();

router.get("/", listFeedbacks);
router.post("/", createFeedback);

export default router;