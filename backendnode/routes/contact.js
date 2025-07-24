const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Adjust path to your Contact model

// POST endpoint to handle contact form submission
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newContact = await Contact.create({
      Name: name,
      Email: email,
      Message: message,
    });

    res.status(201).json({ message: 'Message sent successfully', data: newContact });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;