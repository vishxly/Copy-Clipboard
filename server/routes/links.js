const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const auth = require('../middleware/auth');

// @route   GET api/links
// @desc    Get all links for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/links
// @desc    Add a new link
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { text, url } = req.body;

    const newLink = new Link({
      user: req.user.id,
      text,
      url,
    });

    const savedLink = await newLink.save();
    res.status(201).json(savedLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/links/:id
// @desc    Delete a link
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Check user
    if (link.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await link.remove();
    res.json({ message: 'Link removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;