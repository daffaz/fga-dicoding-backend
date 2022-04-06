const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NoteService = require('./services/inMemory/NotesService');

const init = async () => {
  const noteService = new NoteService();
  const server = Hapi.server({
    port: 4000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['http://notesapp-v1.dicodingacademy.com'],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: noteService,
    },
  });
  await server.start();
  console.log(`Server running in port ${server.info.uri}`);
};

init();
