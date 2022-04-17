const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this.pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(15);
    const query = {
      text: 'INSERT INTO album VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const res = await this.pool.query(query);
    return res.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM album WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return result.rows[0];
  }
}

module.exports = AlbumService;
