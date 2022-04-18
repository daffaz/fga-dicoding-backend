const SongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'onsg',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    server.route(routes(songHandler));
  },
};
