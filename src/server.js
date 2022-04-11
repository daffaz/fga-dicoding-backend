const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NoteService = require('./services/inMemory/NotesService');
const NotesValidator = require('./validator/notes');

require('dotenv').config();

const init = async () => {
  const noteService = new NoteService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
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
      validator: NotesValidator,
    },
  });
  await server.start();
  console.log(`Server running in port ${server.info.uri}`);
};

init();
