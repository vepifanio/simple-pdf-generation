const express = require('express');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const fileTypesWhitelist = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

const fileFilter = (req, file, callback) => {
  if (!fileTypesWhitelist.includes(file.mimetype)) {
    return callback(new Error('File type is not allowed'), false);
  }

  return callback(null, true);
};

const storage = multer.diskStorage({
  destination: 'tmp',
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter,
});

const uploadFile = upload.single('file');

const handleUploadFile = (req, res, next) => {
  uploadFile(req, res, (err) => {
    if (err) {
      res.status(400).json({
        error: {
          message: err.message,
          ...err,
        },
      });
    }

    next();
  });
};

function generateNewPdf({ content, backgroundImageUrl }) {
  const doc = new PDFDocument({
    layout: 'landscape',
  });
  const pdfFile = fs.createWriteStream(path.resolve('pdf', 'test.pdf'));

  doc.pipe(pdfFile);

  if (backgroundImageUrl) {
    doc.image(path.resolve('tmp', backgroundImageUrl).toString());
  }

  doc.fontSize(25).text(content, 100, 100);

  doc.end();
}

app.post('/create-pdf', handleUploadFile, (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      error: "'content' field is missing",
    });
  }

  const backgroundImageUrl = req.file ? path.resolve('tmp', req.file.filename) : undefined;

  generateNewPdf({
    content,
    backgroundImageUrl,
  });

  return res.send();
});

module.exports = { app };
