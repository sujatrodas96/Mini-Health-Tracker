const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Common destination logic for multiple fields
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads/others';

    if (file.fieldname === 'profileImage') {
      folder = 'uploads/profile';
    } else if (file.fieldname === 'report') {
      folder = 'uploads/reports';
    }

    const destPath = path.join(__dirname, '..', folder);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    cb(null, destPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  }
});

// Filter files by MIME type
const fileFilter = function (req, file, cb) {
  if (file.fieldname === 'profileImage') {
    const imageTypes = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (imageTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG/PNG images allowed for profileImage.'));
    }
  }

  if (file.fieldname === 'report') {
    const pdfType = /pdf/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (pdfType.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF allowed for report.'));
    }
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
