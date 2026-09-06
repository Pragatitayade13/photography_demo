import { Request, Response, NextFunction } from "express";
import { ContactRepository } from "./contact.repository.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { notificationService } from "../notifications/notifications.service.js";

const repository = new ContactRepository();

// Simple in-memory IP rate limiter for public submissions (max 10 submissions per IP per hour)
const ipSubmissionTracker = new Map<string, { count: number; expires: number }>();

export class ContactController {
  async submitEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      const now = Date.now();
      const tracker = ipSubmissionTracker.get(clientIp);

      if (tracker) {
        if (now < tracker.expires) {
          if (tracker.count >= 10) {
            sendError(
              res,
              "RATE_LIMIT_EXCEEDED",
              "Too many inquiries submitted from this connection. Please try again later.",
              429
            );
            return;
          }
          tracker.count += 1;
        } else {
          ipSubmissionTracker.set(clientIp, { count: 1, expires: now + 3600000 });
        }
      } else {
        ipSubmissionTracker.set(clientIp, { count: 1, expires: now + 3600000 });
      }

      // Check honeypot
      if (req.body.honeypot && req.body.honeypot.trim() !== "") {
        // Silently drop bot submission
        sendSuccess(res, { reference_number: "ENQ-2026-000999" }, "Your enquiry has been received.");
        return;
      }

      const enquiry = await repository.createEnquiry(req.body);

      // Asynchronously trigger notification pipeline (in-app alert, admin email, visitor confirmation)
      notificationService.handleNewEnquiry(enquiry).catch((err) => {
        console.error("[NOTIFICATIONS] Error triggering new enquiry notification:", err);
      });

      sendSuccess(
        res,
        {
          reference_number: enquiry.reference_number,
          message: "Thank you for reaching out. Your inquiry has been received by Alex Mercer Studio.",
        },
        "Enquiry submitted successfully",
        201
      );
    } catch (err) {
      next(err);
    }
  }

  async listEnquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, priority, enquiry_type, search } = req.query;
      const enquiries = await repository.listEnquiries({
        status: status as string,
        priority: priority as string,
        enquiry_type: enquiry_type as string,
        search: search as string,
      });
      const stats = await repository.getStats();
      sendSuccess(res, { enquiries, stats }, "Enquiries retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async getEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const enquiry = await repository.getEnquiryById(id);
      if (!enquiry) {
        sendError(res, "NOT_FOUND", "Enquiry not found", 404);
        return;
      }
      const activity = await repository.getActivity(enquiry.id);
      sendSuccess(res, { enquiry, activity }, "Enquiry details retrieved");
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const existing = await repository.getEnquiryById(id);
      const oldStatus = existing ? existing.status : "NEW";

      const updated = await repository.updateStatus(id, status);

      // Asynchronously trigger status update notifications
      if (existing && oldStatus !== status) {
        notificationService.handleEnquiryStatusChanged(updated, oldStatus, status).catch((err) => {
          console.error("[NOTIFICATIONS] Error triggering status update notification:", err);
        });
      }

      sendSuccess(res, updated, `Status updated to ${status}`);
    } catch (err) {
      next(err);
    }
  }

  async updatePriority(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { priority } = req.body;
      const updated = await repository.updatePriority(id, priority);
      sendSuccess(res, updated, `Priority updated to ${priority}`);
    } catch (err) {
      next(err);
    }
  }

  async addNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const updated = await repository.addNote(id, notes);
      sendSuccess(res, updated, "Private notes saved successfully");
    } catch (err) {
      next(err);
    }
  }

  async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await repository.getStats();
      sendSuccess(res, stats, "Inquiry statistics retrieved");
    } catch (err) {
      next(err);
    }
  }
}
