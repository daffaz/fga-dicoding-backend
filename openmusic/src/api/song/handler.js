const ClientError = require('../../exceptions/ClientError');

class NotesHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    // binding this
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.postSongHandler = this.postSongHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    this.getAllSongHandler = this.getAllSongHandler.bind(this);
  }

  async getAllSongHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this.service.allSong({ title, performer });
    return h.response({
      status: 'success',
      data: {
        songs,
      },
    });
  }

  async postSongHandler(request, h) {
    try {
      this.validator.validateSongPayload(request.payload);
      const {
        title,
        year,
        genre,
        performer,
        duration = 0,
        albumId = '',
      } = request.payload;
      const songId = await this.service.addSong({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });
      return h.response({
        status: 'success',
        data: { songId },
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

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this.service.getSongById(id);

      return h.response({
        status: 'success',
        data: {
          song,
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

  async putSongByIdHandler(request, h) {
    try {
      this.validator.validateSongPayload(request.payload);
      const { id } = request.params;
      const {
        title,
        year,
        genre,
        performer,
        duration = 0,
        albumId = '',
      } = request.payload;

      await this.service.editSongById(id, {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });
      return h.response({
        status: 'success',
        message: 'successfully updated the song',
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

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this.service.deleteSongById(id);
      return h.response({
        status: 'success',
        message: 'successfully deleted the song',
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
