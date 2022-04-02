const { nanoid } = require('nanoid');
const books = require('./books');

const addNewBookHandler = (request, h) => {
  const {
    name,
    author,
    summary,
    publisher,
    year,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  const id = nanoid(15);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = pageCount - readPage;

  if (finished < 0) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  finished = finished === 0;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let processedBooks = books.map((book) => book);

  if (name) {
    processedBooks = processedBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading) {
    if (+reading === 0) {
      processedBooks = processedBooks.filter((book) => book.reading === false);
    } else {
      processedBooks = processedBooks.filter((book) => book.reading === true);
    }
  }

  if (finished) {
    if (+finished === 0) {
      processedBooks = processedBooks.filter((book) => book.finished === false);
    } else {
      processedBooks = processedBooks.filter((book) => book.finished === true);
    }
  }

  processedBooks = processedBooks.map((book) => ({
    id: book.id, name: book.name, publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: processedBooks,
    },
  });
};

const getBooksById = (request, h) => {
  const { bookId } = request.params;
  const searchedBook = books.find((book) => book.id === bookId);

  if (!searchedBook) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book: searchedBook,
    },
  });
};

const updateBookById = (request, h) => {
  const { bookId } = request.params;
  const searchedBookIndex = books.findIndex((book) => book.id === bookId);

  if (searchedBookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }
  const data = request.payload;
  if (!data.name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (data.readPage > data.pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const finished = data.readPage === data.pageCount;
  data.updatedAt = new Date().toISOString();
  books[searchedBookIndex] = { ...books[searchedBookIndex], ...data, finished };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const searchedBookIndex = books.findIndex((book) => book.id === bookId);

  if (searchedBookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(searchedBookIndex, 1);
  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
};

module.exports = {
  addNewBookHandler, getAllBooksHandler, getBooksById, updateBookById, deleteBookById,
};
