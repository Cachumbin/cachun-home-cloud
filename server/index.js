const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use(fileUpload());

app.get('/', (req, res) => res.send('CachunHomeCloud'));

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.file;
    const uploadPath = path.join(uploadsDir, uploadedFile.name);

    uploadedFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send('Failed to upload the file.');
        }

        res.send({
            message: 'File uploaded successfully!',
            fileName: uploadedFile.name,
            filePath: `./uploads/${uploadedFile.name}`,
        });
    });
});

app.use('./uploads', express.static(uploadsDir));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
