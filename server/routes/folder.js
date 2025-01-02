const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/:folderPath', (req, res) => {
    const folderPath = req.params.folderPath.replace(/~/g, path.sep).replace('root', '');
    const fullPath = path.join(__dirname, '../uploads', folderPath);

    if (!fs.existsSync(fullPath)) {
        return res.status(404).send('Folder not found.');
    }

    const contents = fs.readdirSync(fullPath);
    const filesAndDirs = contents.map((item) => {
        const itemPath = path.join(fullPath, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        return {
            name: item,
            type: isDirectory ? 'directory' : 'file',
            url: isDirectory ? null : `/uploads/${path.join(folderPath, item).replace(/\\/g, '/')}`
        };
    });

    res.send({
        message: 'Contents of the folder:',
        path: folderPath,
        items: filesAndDirs,
    });
});

router.delete('/:folderPath/*', (req, res) => {
    const folderPath = req.params.folderPath.replace(/~/g, path.sep).replace('root', '');
    const filePath = req.params[0].replace(/~/g, path.sep);
    const fullPath = path.join(__dirname, '../uploads', folderPath, filePath);

    if (!fs.existsSync(fullPath)) {
        return res.status(404).send('File not found.');
    }

    fs.unlink(fullPath, (err) => {
        if (err) {
            return res.status(500).send('Error deleting the file.');
        }

        res.send({
            message: 'File deleted successfully!',
            path: filePath
        });
    });
});

module.exports = router;
