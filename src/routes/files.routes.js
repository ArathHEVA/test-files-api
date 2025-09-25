import { Router } from "express";
import { auth } from "../middleware/auth.js";
import * as files from "../controllers/files.controller.js";

const router = Router();

router.use(auth);
router.get("/", files.listFiles);
router.post("/upload", files.upload.single("file"), files.uploadFile);
router.post("/import-url", files.importFromUrl);
router.get("/:id/link", files.getDownloadUrl);
router.get("/:id/download", files.downloadFile);
router.patch("/:id/rename", files.renameFile);

export default router;
