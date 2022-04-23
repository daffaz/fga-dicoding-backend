const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const users = require('./api/users');
const UserService = require('./services/postgres/UsersService');
const NoteService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
const UsersValidator = require('./validator/users');

require('dotenv').config();

const init = async () => {
  const noteService = new NoteService();
  const userService = new UserService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['http://notesapp-v1.dicodingacademy.com'],
      },
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: noteService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UsersValidator,
      },
    },
  ]);
  await server.start();
  console.log(`Server running in port ${server.info.uri}`);
};

init();
