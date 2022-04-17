const Hapi = require('@hapi/hapi');
const album = require('./api/album');
const AlbumService = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/album');

require('dotenv').config();

(async () => {
  const albumService = new AlbumService();

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
  ]);

  await server.start();
  console.log(`Running in port ${server.info.uri}`);
})();

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
