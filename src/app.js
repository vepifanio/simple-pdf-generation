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
    const backgroundImagePathString = path.resolve('tmp', backgroundImageUrl).toString();
    doc.image(backgroundImagePathString, 0, 0, {
      cover: [doc.page.width, doc.page.height],
    });
  }

  doc.fontSize(25).text(
    content,
    0,
    doc.page.height / 2,
    {
      width: doc.page.width,
      align: 'center',
    },
  );

  doc.end();

  return pdfFile;
}

function deleteFile(fileUrl) {
  fs.unlink(fileUrl, (err) => {
    if (err) throw err;
  });
}

app.post('/create-pdf', handleUploadFile, (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      error: "'content' field is missing",
    });
  }

  const backgroundImageUrl = req.file ? path.resolve('tmp', req.file.filename) : undefined;

  const pdfGenerated = generateNewPdf({
    content,
    backgroundImageUrl,
  });

  if (backgroundImageUrl) {
    deleteFile(backgroundImageUrl);
  }

  const pdfFileName = pdfGenerated.path.split('/').at(-1);

  return res.sendFile(pdfFileName, { root: path.resolve(__dirname, '..', 'pdf') }, (err) => {
    if (err) {
      throw new Error('Error sending file:', err);
    }
  });
});

module.exports = { app };
