const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateDummyReport = async (patientName) => {
  const doc = new PDFDocument();
  const reportsDir = path.join(__dirname, '../uploads/reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const fileName = `${Date.now()}-${patientName.replace(/\s+/g, '_')}-report.pdf`;
  const filePath = path.join(reportsDir, fileName);

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).text(`Nutrition Report`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Patient Name: ${patientName}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.moveDown();
  doc.text(`Summary: This is a dummy report generated for ${patientName}.`);
  doc.end();

  await new Promise((resolve) => stream.on('finish', resolve));
  return filePath;
};

module.exports = generateDummyReport;
