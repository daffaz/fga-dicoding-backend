const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this.pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(15)}`;
    const query = {
      text: 'INSERT INTO album VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const res = await this.pool.query(query);
    return res.rows[0].id;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbaharui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album where id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async getSongsByAlbumId(albumId) {
    const queryAlbum = {
      text: 'SELECT * FROM album WHERE id = $1',
      values: [albumId],
    };
    const querySong = {
      text: 'SELECT * FROM song WHERE album_id = $1',
      values: [albumId],
    };
    const albumResult = await this.pool.query(queryAlbum);
    const songResult = await this.pool.query(querySong);
    if (!albumResult.rows.length && !songResult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return { album: albumResult.rows[0], song: songResult.rows };
  }
}

module.exports = AlbumService;
