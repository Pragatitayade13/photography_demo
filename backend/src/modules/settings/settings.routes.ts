import { Router } from "express";
import { SettingsController } from "./settings.controller.js";
import {
  updateGeneralSettingsSchema,
  updateBrandingSettingsSchema,
  updateContactSettingsSchema,
  updateAdvancedSettingsSchema,
  createNavigationItemSchema,
  updateNavigationItemSchema,
  reorderNavigationSchema,
  createSocialLinkSchema,
  updateSocialLinkSchema,
  reorderSocialLinksSchema,
  updateFooterSchema,
  updateSeoSchema,
} from "./settings.schema.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();
const controller = new SettingsController();

// --- PUBLIC ROUTE ---
router.get("/public/site-config", controller.getPublicSiteConfig);
router.get("/public/settings", controller.getPublicSiteConfig);
router.get("/public", controller.getPublicSiteConfig);
router.get("/site-config", controller.getPublicSiteConfig);
router.get("/settings", controller.getPublicSiteConfig);

// --- PROTECTED ADMIN ROUTES ---
// 1. General & Unified Settings
router.get("/", authMiddleware, controller.getAllSettings);
router.patch("/", authMiddleware, validate(updateGeneralSettingsSchema), controller.updateGeneralSettings);

// 2. Sub-domains
router.patch("/branding", authMiddleware, validate(updateBrandingSettingsSchema), controller.updateBrandingSettings);
router.patch("/contact", authMiddleware, validate(updateContactSettingsSchema), controller.updateContactSettings);
router.patch("/advanced", authMiddleware, validate(updateAdvancedSettingsSchema), controller.updateAdvancedSettings);

// 3. Navigation Management
router.get("/navigation", authMiddleware, controller.getNavigationItems);
router.post("/navigation", authMiddleware, validate(createNavigationItemSchema), controller.createNavigationItem);
router.patch("/navigation/reorder", authMiddleware, validate(reorderNavigationSchema), controller.reorderNavigation);
router.patch("/navigation/:id", authMiddleware, validate(updateNavigationItemSchema), controller.updateNavigationItem);
router.delete("/navigation/:id", authMiddleware, controller.deleteNavigationItem);

// 4. Social Links Management
router.get("/social-links", authMiddleware, controller.getSocialLinks);
router.post("/social-links", authMiddleware, validate(createSocialLinkSchema), controller.createSocialLink);
router.patch("/social-links/reorder", authMiddleware, validate(reorderSocialLinksSchema), controller.reorderSocialLinks);
router.patch("/social-links/:id", authMiddleware, validate(updateSocialLinkSchema), controller.updateSocialLink);
router.delete("/social-links/:id", authMiddleware, controller.deleteSocialLink);

// 5. Footer Management
router.get("/footer", authMiddleware, controller.getFooterSettings);
router.patch("/footer", authMiddleware, validate(updateFooterSchema), controller.updateFooterSettings);

// 6. SEO Management
router.get("/seo", authMiddleware, controller.getSeoSettings);
router.patch("/seo", authMiddleware, validate(updateSeoSchema), controller.updateSeoSettings);

export default router;
