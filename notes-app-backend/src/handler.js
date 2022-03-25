const { nanoid } = require('nanoid');
const notes = require('./notes');

const helperFindNoteByID = (id) => notes.find((note) => note.id === id);

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id, title, tags, body, createdAt, updatedAt,
  };

  notes.push(newNote);
  const isSucess = notes.filter((note) => note.id === id).length > 0;
  if (isSucess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  return h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  }).code(500);
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNotesByIDHandler = (request, h) => {
  const { id } = request.params;
  const noteFound = helperFindNoteByID(id);

  if (noteFound) {
    return h.response({
      status: 'success',
      data: {
        note: noteFound,
      },
    });
  }

  return h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  }).code(404);
};

const updateNoteByIDHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const noteFound = helperFindNoteByID(id);

  if (noteFound) {
    noteFound.title = title;
    noteFound.tags = tags;
    noteFound.body = body;

    return h.response({
      status: 'success',
      message: 'Catatan berhasil diperbaharui',
    });
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id catatan tidak ditemukan',
  }).code(404);
};

const deleteNoteByIDHandler = (request, h) => {
  const { id } = request.params;
  const noteFound = helperFindNoteByID(id);

  if (noteFound) {
    notes.splice(notes.indexOf(noteFound), 1);
    return h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
  }

  return h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id catatan tidak ditemukan',
  }).code(404);
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNotesByIDHandler,
  updateNoteByIDHandler,
  deleteNoteByIDHandler,
};
