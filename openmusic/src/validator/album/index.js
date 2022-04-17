const InvariantError = require('../../exceptions/InvariantError');
const OpenMusicAlbumValidator = require('./schema');

const validator = (schema, payload) => {
  const validationResult = schema.validate(payload);

  if (validationResult.error) {
    throw new InvariantError(validationResult.error);
  }
};

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    validator(OpenMusicAlbumValidator.AlbumPayloadSchema, payload);
  },

};

module.exports = AlbumValidator;
