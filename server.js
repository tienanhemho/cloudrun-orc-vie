const express = require('express');
const multer = require('multer');
const tesseract = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

const upload = multer({ dest: 'uploads/' });

app.post('/orc', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const inputFilePath = req.file.path;
  const outputFilePath = `${inputFilePath}-processed.png`;

  sharp(inputFilePath)
    .greyscale()
    .png({ colors: 2 })
    .toFile(outputFilePath)
    .then(() => {
      tesseract.recognize(outputFilePath, 'vie', { logger: m => console.log(m) })
        .then(({ data: { text } }) => {
          // Clean up temporary files
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
          res.json({ text });
        })
        .catch(err => {
          // Clean up temporary files
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
          res.status(500).json({ error: 'Failed to process image', details: err.message });
        });
    })
    .catch(err => {
      // Clean up temporary files
      fs.unlinkSync(inputFilePath);
      fs.unlinkSync(outputFilePath);
      res.status(500).json({ error: 'Failed to preprocess image', details: err.message });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
