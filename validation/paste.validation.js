import Joi from "joi";

export const createPasteSchema = Joi.object({
  content: Joi.string().trim().min(1).required(),

  ttl_seconds: Joi.number()
    .integer()
    .min(1)
    .required(),

  max_views: Joi.number()
    .integer()
    .min(1)
    .required(),
});

export const pasteIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

