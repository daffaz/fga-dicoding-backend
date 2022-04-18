const Hapi = require('@hapi/hapi');
const album = require('./api/album');
const song = require('./api/song');
const AlbumService = require('./services/postgres/AlbumService');
const SongService = require('./services/postgres/SongService');
const AlbumValidator = require('./validator/album');
const SongValidator = require('./validator/song');

require('dotenv').config();

(async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    host: 'localhost',
    port: 4000,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Running in port ${server.info.uri}`);
})();

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
