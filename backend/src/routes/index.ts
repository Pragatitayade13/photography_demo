import { Router } from "express";
import healthRoutes from "../modules/health/health.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import categoryRoutes from "../modules/categories/category.routes.js";
import photoRoutes from "../modules/photos/photo.routes.js";
import projectRoutes from "../modules/projects/project.routes.js";
import homepageRoutes from "../modules/homepage/homepage.routes.js";
import aboutRoutes from "../modules/about/about.routes.js";
import contactRoutes from "../modules/contact/contact.routes.js";
import settingsRoutes from "../modules/settings/settings.routes.js";
import seoRoutes from "../modules/seo/seo.routes.js";
import analyticsRoutes from "../modules/analytics/analytics.routes.js";
import notificationRoutes from "../modules/notifications/notifications.routes.js";
import mediaRoutes from "../modules/media/media.routes.js";
import securityRoutes from "../modules/security/security.routes.js";
import { appearanceRoutes } from "../modules/placeholders.js";

const apiRouter = Router();

// Health Check
apiRouter.use("/", healthRoutes);

// Core Modules
apiRouter.use("/auth", authRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/categories", categoryRoutes);
apiRouter.use("/photos", photoRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/homepage", homepageRoutes);

// Feature Modules
apiRouter.use("/about", aboutRoutes);
apiRouter.use("/contact", contactRoutes);
apiRouter.use("/appearance", appearanceRoutes);
apiRouter.use("/settings", settingsRoutes);
apiRouter.use("/seo", seoRoutes);
apiRouter.use("/analytics", analyticsRoutes);
apiRouter.use("/notifications", notificationRoutes);
apiRouter.use("/media", mediaRoutes);
apiRouter.use("/security", securityRoutes);

// Public aliases
apiRouter.use("/public", settingsRoutes);
apiRouter.use("/public/analytics", analyticsRoutes);
apiRouter.use("/", mediaRoutes);
apiRouter.use("/", securityRoutes);

export default apiRouter;
