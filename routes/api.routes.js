import express from 'express'
import { check, createPaste, getPaste } from '../controllers/controllers.js'
import { validate, validateParams } from '../middleware/middleware.js';
import { createPasteSchema, pasteIdSchema } from '../validation/paste.validation.js';

const routes = express.Router()

routes.get("/healthz",check)
routes.post("/pastes",  validate(createPasteSchema),  createPaste);
routes.get("/pastes/:id", validateParams(pasteIdSchema), getPaste);

export default routes;