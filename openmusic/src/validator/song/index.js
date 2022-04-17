const InvariantError = require('../../exceptions/InvariantError');
const OpenMusicSongValidator = require('./schema');

const validator = (schema, payload) => {
  const validationResult = schema.validate(payload);

  if (validationResult.error) {
    throw new InvariantError(validationResult.error);
  }
};

const SongValidator = {
  validateSongPayload: (payload) => {
    validator(OpenMusicSongValidator.SongPayloadSchema, payload);
  },
};

module.exports = SongValidator;
