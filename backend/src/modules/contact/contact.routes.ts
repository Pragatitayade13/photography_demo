import { Router } from "express";
import { ContactController } from "./contact.controller.js";
import {
  createEnquirySchema,
  updateStatusSchema,
  updatePrioritySchema,
  addNoteSchema,
} from "./contact.schema.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
const controller = new ContactController();

// Public Ingestion
router.post("/", validate(createEnquirySchema), controller.submitEnquiry);
router.post("/enquiries", validate(createEnquirySchema), controller.submitEnquiry);

// Protected Admin Endpoints
router.get("/admin/enquiries", authMiddleware, controller.listEnquiries);
router.get("/admin/enquiries/stats", authMiddleware, controller.getStats);
router.get("/admin/enquiries/:id", authMiddleware, controller.getEnquiry);
router.patch("/admin/enquiries/:id/status", authMiddleware, validate(updateStatusSchema), controller.updateStatus);
router.patch("/admin/enquiries/:id/priority", authMiddleware, validate(updatePrioritySchema), controller.updatePriority);
router.post("/admin/enquiries/:id/notes", authMiddleware, validate(addNoteSchema), controller.addNote);

export default router;
