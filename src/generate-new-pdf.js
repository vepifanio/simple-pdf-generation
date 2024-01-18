const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { PUBLIC_FOLDER_PATH_STRING } = require('./consts');

const generateNewPdf = ({ content, backgroundImageUrl }) => {
  const doc = new PDFDocument({
    layout: 'landscape',
  });
  const pdfFile = fs.createWriteStream(path.resolve('pdf', 'test.pdf'));

  doc.pipe(pdfFile);

  if (backgroundImageUrl) {
    const backgroundImagePath = path.resolve(PUBLIC_FOLDER_PATH_STRING, backgroundImageUrl);

    doc.image(backgroundImagePath.toString(), 0, 0, {
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
};

module.exports = {
  generateNewPdf,
};
