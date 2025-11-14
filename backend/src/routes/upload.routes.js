const express = require('express');
const upload = require('../middlewares/upload.middleware');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', requireAuth, requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }
  res.status(201).json({
    message: 'File uploaded successfully',
    url: `/${req.file.destination.replace('public/', '')}/${req.file.filename}`
  });
});

module.exports = router;