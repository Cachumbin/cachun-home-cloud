const express = require('express');
const path = require('path');
const { ensureDirectoryExists, saveFile } = require('../utils/fileUtils');

const router = express.Router();

router.post('/:path', (req, res) => {
    const requestedPath = req.params.path.replace(/~/g, path.sep).replace('root', '');
    const uploadFolder = path.join(__dirname, '../uploads', requestedPath);

    ensureDirectoryExists(uploadFolder);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.file;
    saveFile(uploadedFile, uploadFolder)
        .then((filePath) => {
            res.send({
                message: 'File uploaded successfully!',
                fileName: uploadedFile.name,
                filePath,
            });
        })
        .catch(() => {
            res.status(500).send('Failed to upload the file.');
        });
});

module.exports = router;
