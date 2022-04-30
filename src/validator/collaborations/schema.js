const Joi = require('joi');

const CollaboratorPayloadSchema = Joi.object({
  noteId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { CollaboratorPayloadSchema };
