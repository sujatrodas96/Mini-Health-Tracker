const Patient = require('../Models/Patient');
const User = require('../Models/User');
// Fix the import - remove destructuring if it's a default export
const generateDummyReport = require('../utils/pdfGenerator');
const { addCRMSyncJob } = require('../utils/queues');
const { addWhatsAppJob } = require('../utils/queues');
const { sendWelcomePatientEmail } = require('../utils/patientprofilecreatemail');
const {sendWhatsAppMessage} = require('../utils/whatsappmsg');

exports.createPatient = async (req, res) => {
  try {
    const { email, name, age, phone, weight, fatPercent } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Find user by email and validate role
    const user = await User.findOne({ email, role: 'patient' });
    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid email or user is not a patient. Please ensure the email belongs to a registered user with patient role.' 
      });
    }

    // Prevent duplicate patient record
    const existingByUserId = await Patient.findOne({ userId: user._id });
    if (existingByUserId) {
      return res.status(400).json({ error: 'Patient record already exists for this user' });
    }

    const profileImage = req.files?.profileImage?.[0]?.path || null;
    let reportPath = req.files?.report?.[0]?.path;

    // Generate dummy report if no report file uploaded
    if (!reportPath) {
      try {
        // Check if generateDummyReport is a function
        if (typeof generateDummyReport !== 'function') {
          console.error('generateDummyReport is not a function:', typeof generateDummyReport);
          throw new Error('PDF generator function not available');
        }
        reportPath = await generateDummyReport(name);
      } catch (pdfError) {
        console.error('PDF Generation Error:', pdfError.message);
        reportPath = null; // Continue without report if generation fails
      }
    }

    const newPatient = await Patient.create({
      userId: user._id,
      name,
      email,
      phone,
      age,
      weight,
      fatPercent,
      profileImage,
      report: reportPath
    });
    await sendWelcomePatientEmail(newPatient);
    await sendWhatsAppMessage(phone, `Hello ${name}, Thank you for creating your profile in our platform 🚀`);
    // Mock background tasks safely
    let reportQueued = true;
    let crmSynced = true;

    try {
      await addWhatsAppJob(email, `${name} your profile created successfully` );
    } catch (err) {
      console.error('WhatsApp job failed:', err.message);
    }

    try {
      await addCRMSyncJob(email, `${name} your profile Synced successfully`);
    } catch (err) {
      console.error('CRM Sync Failed:', err.message);
      crmSynced = false;
    }

    res.status(201).json({
      message: 'Patient created successfully',
      patient: newPatient,
      backgroundJobs: {
        reportQueue: reportQueued ? 'Queued' : 'Failed',
        zohoSync: crmSynced ? 'Success' : 'Failed'
      }
    });

  } catch (error) {
    console.error('Create Patient Error:', error);
    
    // Handle validation errors
    if (error.message === 'User not found' || error.message === 'User must have patient role') {
      return res.status(400).json({ error: error.message });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Patient with this userId already exists' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPatients = async (req, res) => {
  let { page = 1, limit = 10, sortBy = 'age', order = 'asc', bmi, email } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const query = {};
  if (bmi) query.fatPercent = { $gte: parseFloat(bmi) };

  try {
    let patients = await Patient.find(query)
      .populate('userId', 'name email role') // Populate user details to access email
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter by email if provided (since email is in the populated userId)
    if (email) {
      patients = patients.filter(patient => 
        patient.userId && patient.userId.email && 
        patient.userId.email.toLowerCase().includes(email.toLowerCase())
      );
    }

    const total = await Patient.countDocuments(query);
    res.status(200).json({ 
      message: "Patient details fetched successfully", 
      total, 
      page,
      limit,
      patients 
    });
  } catch (err) {
    console.error('Get Patients Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const user = req.user; // Injected by auth middleware from JWT
    const requestedId = req.params.id;
    
    console.log('Requested Patient ID:', requestedId);
    console.log('User from token:', user);

    if (user.role !== 'patient') {
      return res.status(403).json({ error: 'Access denied: Not a patient' });
    }

    // Find the patient record tied to the logged-in user
    const patient = await Patient.findOne({ _id: requestedId, userId: user._id })
      .populate('userId', 'name email role');

    if (!patient) {
      return res.status(404).json({ error: 'Access denied. You can only view your own data.' });
    }

    res.status(200).json({
      message: 'Patient details fetched successfully',
      patient,
    });
  } catch (err) {
    console.error('Get Patient by ID Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPatientByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const loggedInUser = req.user; // From auth middleware

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    // Ensure only the logged-in patient can access their own data
    if (loggedInUser.role !== 'patient' || loggedInUser.email !== email) {
      return res.status(403).json({ error: 'Access denied. You can only view your own data.' });
    }

    const user = await User.findOne({ email, role: 'patient' });
    if (!user) {
      return res.status(404).json({ error: 'User not found with this email or not a patient' });
    }

    const patient = await Patient.findOne({ userId: user._id })
      .populate('userId', 'name email role');

    if (!patient) {
      return res.status(404).json({ error: 'Patient record not found for this email' });
    }

    res.status(200).json({
      message: 'Patient details fetched successfully',
      patient,
    });
  } catch (err) {
    console.error('Get Patient by Email Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.updatePatient = async (req, res) => {
  try {
    const { email, name, age, weight, fatPercent } = req.body;
    const updateData = {};

    // Only include fields that are provided
    if (name) updateData.name = name;
    if (age) updateData.age = age;
    if (weight) updateData.weight = weight;
    if (fatPercent) updateData.fatPercent = fatPercent;

    // If email is being updated, validate it and update userId
    if (email) {
      const user = await User.findOne({ email, role: 'patient' });
      if (!user) {
        return res.status(400).json({ 
          error: 'Invalid email or user is not a patient' 
        });
      }
      updateData.userId = user._id;
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('userId', 'name email role');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json({
      message: 'Patient updated successfully',
      patient
    });

    try {
      await addWhatsAppJob(email, `${name} your profile Updated successfully` );
    } catch (err) {
      console.error('WhatsApp job failed:', err.message);
    }
  } catch (err) {
    console.error('Update Patient Error:', err);
    
    if (err.code === 11000) {
      return res.status(400).json({ error: 'User already has a patient record' });
    }
    
    res.status(400).json({ error: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json({ 
      message: 'Patient deleted successfully from storage', 
      patient 
    });

    try {
      await addWhatsAppJob(email, `${name} your profile Deleted successfully` );
    } catch (err) {
      console.error('WhatsApp job failed:', err.message);
    }
  } catch (err) {
    console.error('Delete Patient Error:', err);
    res.status(500).json({ error: err.message });
  }
};