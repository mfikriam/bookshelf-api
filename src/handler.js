const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

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

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
  }

  return h
    .response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    })
    .code(500);
};

const getAllBookHandler = (request, h) => {
  if (books.length === 0) {
    return h.response({ status: 'success', data: { books: [] } }).code(200);
  }

  const {
    name,
    reading,
    finished,
  } = request.query;

  if (name !== undefined) {
    const namedBooks = books
      .filter((item) => item.name.toLowerCase().includes(name.toLowerCase()))
      .map((book) => (
        {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }
      ));
    return h.response({ status: 'success', data: { books: namedBooks } }).code(200);
  }

  if (reading !== undefined) {
    const isReading = Boolean(Number.parseInt(reading, 10));
    const readingBooks = books
      .filter((item) => item.reading === isReading)
      .map((book) => (
        {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }
      ));
    return h.response({ status: 'success', data: { books: readingBooks } }).code(200);
  }

  if (finished !== undefined) {
    const isFinished = Boolean(Number.parseInt(finished, 10));
    const finishedBooks = books
      .filter((item) => item.finished === isFinished)
      .map((book) => (
        {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }
      ));
    return h.response({ status: 'success', data: { books: finishedBooks } }).code(200);
  }

  const filteredBooks = books.map((book) => (
    {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }
  ));

  const response = h
    .response({
      status: 'success',
      data: { books: filteredBooks },
    })
    .code(200);

  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((item) => item.id === bookId)[0];

  if (book !== undefined) {
    return h.response({ status: 'success', data: { book } }).code(200);
  }

  return h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  const updateAt = new Date().toISOString();
  const index = books.findIndex((item) => item.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updateAt,
    };

    return h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
  }

  return h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((item) => item.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    return h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
  }

  return h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
