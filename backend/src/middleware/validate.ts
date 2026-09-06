import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { sendError } from "../utils/response.js";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let parsed: any;
      try {
        parsed = await schema.parseAsync(req.body);
      } catch (errDirect) {
        try {
          const wrapperResult = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
          });
          parsed = wrapperResult?.body !== undefined ? wrapperResult.body : wrapperResult;
        } catch {
          throw errDirect;
        }
      }
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        sendError(res, "VALIDATION_ERROR", "Validation failed", 400, error.errors);
        return;
      }
      next(error);
    }
  };
};
