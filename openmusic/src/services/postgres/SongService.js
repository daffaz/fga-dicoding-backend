const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongService {
  constructor() {
    this.pool = new Pool();
  }

  async allSong({ title, performer }) {
    const fixedPerformer = `%${performer}%`;
    const fixedTitle = `%${title}%`;
    let query = 'SELECT * FROM song';
    if (title && performer) {
      query = {
        text: `${query} WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2`,
        values: [fixedTitle, fixedPerformer],
      };
    } else if (title) {
      query = {
        text: `${query} WHERE LOWER(title) LIKE $1`,
        values: [fixedTitle],
      };
    } else if (performer) {
      query = {
        text: `${query} WHERE LOWER(performer) LIKE $1`,
        values: [fixedPerformer],
      };
    }
    const result = await this.pool.query(query);
    return result.rows.map((res) => ({
      id: res.id,
      title: res.title,
      performer: res.performer,
    }));
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const id = `song-${nanoid(15)}`;
    const query = {
      text: 'INSERT INTO song VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const res = await this.pool.query(query);
    return res.rows[0].id;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM song WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }
    return result.rows[0];
  }

  async editSongById(id, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const query = {
      text: 'UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbaharui Song. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM song where id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;
