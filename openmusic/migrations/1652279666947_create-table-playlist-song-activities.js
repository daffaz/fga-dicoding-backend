/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlists_activities', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    time: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint('playlists_activities', 'fk_playlists_activities.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlists_activities', 'fk_playlists_activities.song.id', 'FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE');
  pgm.addConstraint('playlists_activities', 'fk_playlists_activities.user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('playlists_activities');
};
