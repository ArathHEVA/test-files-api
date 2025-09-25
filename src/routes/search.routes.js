import { Router } from "express";
import { auth } from "../middleware/auth.js";
import * as search from "../controllers/search.controller.js";

const router = Router();

router.use(auth);
router.get("/images", search.search);

export default router;
