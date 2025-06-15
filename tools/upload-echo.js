// upload-echo.js
const express = require('express');
const multer = require('multer');

const app = express();
const port = 3000;

// Use memory storage to avoid saving files on disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to receive file upload and echo it back immediately
app.post('/upload-echo', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  
  // Set headers to indicate binary data
  res.set({
    'Content-Type': req.file.mimetype,
    'Content-Length': req.file.size,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  });

  // Send back the exact uploaded file buffer
  res.send(req.file.buffer);
});

app.listen(port, () => {
  console.log(`Upload echo server listening at http://localhost:${port}`);
});
