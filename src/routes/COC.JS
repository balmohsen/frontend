const express = require('express');
const router = express.Router();
const COC = require('../models/COC');
const { verifyToken } = require('../middleware/auth'); // Middleware to verify JWT

// POST /api/coc/submit
router.post('/submit', verifyToken, async (req, res) => {
  const { fullName, email, submissionDate, department, comments, agreeToTerms } = req.body;

  // Basic validation
  if (!fullName || !email || !department || !agreeToTerms) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  try {
    const newCOC = new COC({
      fullName,
      email,
      submissionDate: submissionDate || Date.now(),
      department,
      comments,
      agreeToTerms,
      submittedBy: req.user.username, // Assuming username is in JWT
    });

    await newCOC.save();

    res.status(201).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting COC:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
