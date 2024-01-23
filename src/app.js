const express = require('express');
const cors = require('cors');
const { uploadImageFileMiddleware } = require('./upload-img-file-middleware');
const { InMemoryPDFsRepository } = require('./PDFsRepository');
const { PDFsController } = require('./PDFsController');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.static('pdf'));
app.use(express.json());

const pdfsRepository = new InMemoryPDFsRepository();
const pdfsController = new PDFsController(pdfsRepository);

const index = pdfsController.index.bind(pdfsController);
const create = pdfsController.create.bind(pdfsController);
const getOne = pdfsController.getOne.bind(pdfsController);

app.get('/pdfs', index);
app.post('/pdfs', uploadImageFileMiddleware, create);

app.get('/pdfs/:id/generate', getOne);

module.exports = { app };
