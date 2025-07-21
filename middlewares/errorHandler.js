const fs = require('fs');
const path = require('path');

const errorLogPath = path.join(__dirname, '../logs/error.log');

module.exports = (err, req, res, next) => {
  const errorDetails = {
    time: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    message: err.message,
    stack: err.stack,
    code: err.code || 'INTERNAL_ERROR',
  };

  // Write error log to file
  fs.appendFile(
    errorLogPath,
    JSON.stringify(errorDetails, null, 2) + ',\n',
    (fileErr) => {
      if (fileErr) console.error('Failed to write error log:', fileErr);
    }
  );

  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      code: errorDetails.code,
      message: errorDetails.message,
    },
  });
};
