const ClientError = require('../../exceptions/ClientError');

class NotesHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    // binding this
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this.validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const albumId = await this.service.addAlbum({ name, year });
      return h.response({
        status: 'success',
        data: { albumId },
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      console.log(error);
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(500);
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { album, song } = await this.service.getSongsByAlbumId(id);
      return h.response({
        status: 'success',
        data: {
          album: {
            ...album,
            songs: song,
          },
        },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      console.log(error);
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(500);
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this.validator.validateAlbumPayload(request.payload);
      const { id } = request.params;
      const { name, year } = request.payload;

      await this.service.editAlbumById(id, { name, year });
      return h.response({
        status: 'success',
        message: 'successfully updated the album',
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      console.log(error);
      return h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this.service.deleteAlbumById(id);
      return h.response({
        status: 'success',
        message: 'successfully deleted the album',
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      console.log(error);
      return h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }
}

module.exports = NotesHandler;
