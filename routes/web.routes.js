import express from 'express'
import { viewPaste } from '../controllers/controllers.js';
import { pasteIdSchema } from '../validation/paste.validation.js';
import { validateParams } from '../middleware/middleware.js';


const webRoutes = express.Router()

webRoutes.get("/p/:id", validateParams(pasteIdSchema), viewPaste);

export default webRoutes