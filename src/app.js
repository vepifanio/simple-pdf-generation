const express = require('express');
const cors = require('cors');
const path = require('path');
const { randomUUID } = require('crypto');
const { uploadImageFileMiddleware } = require('./upload-img-file-middleware');
const { generateNewPdf } = require('./generate-new-pdf');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.static('pdf'));
app.use(express.json());

const pdfs = [];

app.get('/pdfs', (req, res) => res.json({
  pdfs,
}));

app.post('/pdfs/create', uploadImageFileMiddleware, (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "'content' field is missing",
      });
    }

    const backgroundImageUrl = path.join('public', req.file.filename);

    const pdf = {
      id: randomUUID(),
      content,
      backgroundImageUrl,
    };

    pdfs.push(pdf);

    return res.status(201).send();
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.get('/pdfs/generate/:id', (req, res) => {
  const { id } = req.params;

  const pdf = pdfs.find((item) => item.id === id);

  if (!pdf) {
    return res.status(404).json({
      error: 'No PDF found.',
    });
  }

  const generatedPDFPath = generateNewPdf(pdf);

  return res.json({
    path: generatedPDFPath,
  });
});

module.exports = { app };
