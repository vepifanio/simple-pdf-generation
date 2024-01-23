const path = require('path');
const { PDF } = require('./PDF');
const { generateNewPdf } = require('./generate-new-pdf');

class PDFsController {
  constructor(pdfsRepository) {
    this.pdfsRepository = pdfsRepository;
  }

  index(req, res) {
    const pdfs = this.pdfsRepository.list();
    return res.json({
      pdfs,
    });
  }

  create(req, res) {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({
          error: "'content' field is missing",
        });
      }

      const backgroundImageURL = req.file ? path.join('public', req.file.filename) : undefined;

      const pdf = new PDF({
        content,
        backgroundImageURL,
      });

      this.pdfsRepository.save(pdf);

      return res.status(201).send();
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  getOne(req, res) {
    const { id } = req.params;

    const pdf = this.pdfsRepository.getById(id);

    if (!pdf) {
      return res.status(404).json({
        error: 'No PDF found.',
      });
    }

    const generatedPDFUrl = generateNewPdf(pdf);

    return res.json({
      path: generatedPDFUrl,
    });
  }
}

module.exports = {
  PDFsController,
};
