const express = require('express');
const path = require('path');
const { uploadImageFileMiddleware } = require('./upload-img-file-middleware');
const { PUBLIC_FOLDER_PATH_STRING } = require('./consts');
const { generateNewPdf } = require('./generate-new-pdf');

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.post('/create-pdf', uploadImageFileMiddleware, (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "'content' field is missing",
      });
    }

    const backgroundImageUrl = req.file
      ? path.resolve(PUBLIC_FOLDER_PATH_STRING, req.file.filename)
      : undefined;

    const pdfGenerated = generateNewPdf({
      content,
      backgroundImageUrl,
    });

    const pdfFileName = pdfGenerated.path.split('/').at(-1);

    return res.sendFile(pdfFileName, { root: path.resolve(__dirname, '..', 'pdf') }, (err) => {
      if (err) {
        throw new Error('Error sending file:', err);
      }
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = { app };
