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

app.post('/:path', (req, res) => {
    const requestedPath = req.params.path.replace(/~/g, path.sep).replace('root', '');
    const uploadFolder = path.join(uploadsDir, requestedPath);

    if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.file;
    const uploadPath = path.join(uploadFolder, uploadedFile.name);

    uploadedFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send('Failed to upload the file.');
        }

        res.send({
            message: 'File uploaded successfully!',
            fileName: uploadedFile.name,
            filePath: `./uploads/${requestedPath}/${uploadedFile.name}`.replace(/\/\//g, '/'),
        });
    });
});

app.use('/uploads', express.static(uploadsDir));

app.get('/:path', (req, res) => {
    const requestedPath = req.params.path.replace(/~/g, path.sep).replace('root', '');
    const absolutePath = path.join(uploadsDir, requestedPath);

    if (fs.existsSync(absolutePath) && fs.lstatSync(absolutePath).isDirectory()) {
        const files = fs.readdirSync(absolutePath);
        res.json({
            message: 'Contents of the folder:',
            path: req.params.path,
            files,
        });
    } else {
        res.status(404).send('Folder not found or invalid path.');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
