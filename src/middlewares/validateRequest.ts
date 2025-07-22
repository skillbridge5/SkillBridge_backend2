import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodRawShape } from 'zod';

export type AnyZodObject = ZodObject<ZodRawShape>;

export const validateRequest = (schema: AnyZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); // Only validate the body
      next();
    } catch (error) {
      res.status(400).json(error);
    }
  };
