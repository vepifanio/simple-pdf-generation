const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateNewPdf = ({ id, content, backgroundImageURL }) => {
  const doc = new PDFDocument({
    layout: 'landscape',
  });

  const fileName = `${id}-${Date.now()}.pdf`;

  const pdfFile = fs.createWriteStream(path.resolve('pdf', fileName));

  doc.pipe(pdfFile);

  if (backgroundImageURL) {
    const backgroundImagePath = path.resolve(backgroundImageURL);

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

  const baseURL = 'http://localhost:3333';
  const serverPdfUrl = `${baseURL}/${fileName}`;

  return serverPdfUrl;
};

module.exports = {
  generateNewPdf,
};
