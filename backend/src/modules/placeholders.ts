import { Router } from "express";
import { sendSuccess } from "../utils/response.js";

const createModuleRouter = (moduleName: string) => {
  const router = Router();
  router.get("/", (_req, res) => {
    sendSuccess(res, { module: moduleName, status: "ready" }, `${moduleName} module ready`);
  });
  return router;
};

export const photoRoutes = createModuleRouter("photos");
export const projectRoutes = createModuleRouter("projects");
export const categoryRoutes = createModuleRouter("categories");
export const homepageRoutes = createModuleRouter("homepage");
export const aboutRoutes = createModuleRouter("about");
export const contactRoutes = createModuleRouter("contact");
export const appearanceRoutes = createModuleRouter("appearance");
export const settingsRoutes = createModuleRouter("settings");
