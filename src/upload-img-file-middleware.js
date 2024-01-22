const multer = require('multer');

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
  destination: 'public',
  filename: (req, file, callback) => {
    const timestamp = Date.now();
    callback(null, `${timestamp}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter,
});

const uploadFile = upload.single('file');

const uploadImageFileMiddleware = (req, res, next) => {
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

module.exports = {
  uploadImageFileMiddleware,
};
