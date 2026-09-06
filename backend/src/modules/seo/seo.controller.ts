import { Request, Response, NextFunction } from "express";
import { SeoRepository } from "./seo.repository.js";
import { sendSuccess, sendError } from "../../utils/response.js";

const repository = new SeoRepository();

export class SeoController {
  // --- GLOBAL SEO ---
  async getGlobalSeo(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const seo = await repository.getGlobalSeo();
      sendSuccess(res, seo, "Global SEO configuration retrieved");
    } catch (err) {
      next(err);
    }
  }

  async updateGlobalSeo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await repository.updateGlobalSeo(req.body);
      sendSuccess(res, updated, "Global SEO configuration updated");
    } catch (err) {
      next(err);
    }
  }

  // --- PAGE SEO ---
  async getAllPageSeo(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pages = await repository.getAllPageSeo();
      sendSuccess(res, pages, "Page SEO configurations retrieved");
    } catch (err) {
      next(err);
    }
  }

  async getPageSeo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pageKey } = req.params;
      const pageSeo = await repository.getPageSeo(pageKey);
      if (!pageSeo) {
        sendError(res, "NOT_FOUND", `SEO for page '${pageKey}' not found`, 404);
        return;
      }
      sendSuccess(res, pageSeo, "Page SEO configuration retrieved");
    } catch (err) {
      next(err);
    }
  }

  async updatePageSeo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pageKey } = req.params;
      const updated = await repository.updatePageSeo(pageKey, req.body);
      sendSuccess(res, updated, `SEO for page '${pageKey}' updated successfully`);
    } catch (err) {
      next(err);
    }
  }

  // --- PROJECT SEO ---
  async getProjectSeo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const projectSeo = await repository.getProjectSeo(projectId);
      if (!projectSeo) {
        sendError(res, "NOT_FOUND", `SEO for project '${projectId}' not found`, 404);
        return;
      }
      sendSuccess(res, projectSeo, "Project SEO retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async updateProjectSeo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const updated = await repository.updateProjectSeo(projectId, req.body);
      sendSuccess(res, updated, "Project SEO updated successfully");
    } catch (err) {
      next(err);
    }
  }

  // --- PUBLIC SITEMAP & ROBOTS ---
  async getSitemapXml(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const host = req.get("host") || "alexmercer.photography";
      const protocol = req.protocol || "https";
      const baseUrl = `${protocol}://${host}`;
      const xml = await repository.generateSitemapXml(baseUrl);
      res.header("Content-Type", "application/xml");
      res.status(200).send(xml);
    } catch (err) {
      next(err);
    }
  }

  async getRobotsTxt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const host = req.get("host") || "alexmercer.photography";
      const protocol = req.protocol || "https";
      const baseUrl = `${protocol}://${host}`;
      const txt = repository.generateRobotsTxt(baseUrl);
      res.header("Content-Type", "text/plain");
      res.status(200).send(txt);
    } catch (err) {
      next(err);
    }
  }
}
