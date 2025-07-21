const express = require('express');
const router = express.Router();
const upload = require('../utils/multerProfile');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const {
  createPatient,
  getPatients,
  getPatientById,
  getPatientByEmail,
  updatePatient,
  deletePatient,
} = require('../Controllers/patientController');

router.use(auth);

router.post(
  '/create',
  role('coach', 'admin'),
  upload.fields([
    { name: 'report', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 }
  ]),
  createPatient
);

router.get('/allpatients', role('coach', 'admin'), getPatients);
router.get('/email/:email', role('patient'), getPatientByEmail);
router.get('/:id', role('patient'), getPatientById);

router.put('/:id', role('coach', 'admin'), updatePatient);
router.delete('/:id', role('admin'), deletePatient);

module.exports = router;
