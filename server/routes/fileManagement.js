const express = require('express');
const path = require('path');
const fs = require('fs');
const { ensureDirectoryExists } = require('../utils/fileUtils');

const router = express.Router();

router.put('/move/:srcPath/:destPath', (req, res) => {
    const srcPath = req.params.srcPath.replace(/~/g, path.sep).replace('root', '');
    const destPath = req.params.destPath.replace(/~/g, path.sep).replace('root', '');

    const sourceFile = path.join(__dirname, '../uploads', srcPath);
    const destinationDir = path.join(__dirname, '../uploads', path.dirname(destPath));
    const destinationFile = path.join(__dirname, '../uploads', destPath);

    if (!fs.existsSync(sourceFile)) {
        return res.status(404).send('Source file not found.');
    }

    if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
    }

    fs.rename(sourceFile, destinationFile, (err) => {
        if (err) {
            return res.status(500).send('Failed to move the file.');
        }
        res.send({
            message: 'File moved successfully!',
            source: srcPath,
            destination: destPath,
        });
    });
});

router.delete('/:filePath', (req, res) => {
    const filePath = req.params.filePath.replace(/~/g, path.sep).replace('root', '');
    const fullPath = path.join(__dirname, '../uploads', filePath);

    if (!fs.existsSync(fullPath)) {
        return res.status(404).send('File not found.');
    }

    fs.unlink(fullPath, (err) => {
        if (err) {
            return res.status(500).send('Failed to delete the file.');
        }
        res.send({
            message: 'File deleted successfully!',
            filePath,
        });
    });
});

router.post('/directory/:dirPath', (req, res) => {
    const dirPath = req.params.dirPath.replace(/~/g, path.sep).replace('root', '');
    const fullPath = path.join(__dirname, '../uploads', dirPath);

    if (fs.existsSync(fullPath)) {
        return res.status(400).send('Directory already exists.');
    }

    fs.mkdir(fullPath, { recursive: true }, (err) => {
        if (err) {
            return res.status(500).send('Failed to create the directory.');
        }
        res.send({
            message: 'Directory created successfully!',
            dirPath,
        });
    });
});

router.delete('/directory/:dirPath', (req, res) => {
    const dirPath = req.params.dirPath.replace(/~/g, path.sep).replace('root', '');
    const fullPath = path.join(__dirname, '../uploads', dirPath);

    if (!fs.existsSync(fullPath)) {
        return res.status(404).send('Directory not found.');
    }

    fs.rmdir(fullPath, { recursive: true }, (err) => {
        if (err) {
            return res.status(500).send('Failed to delete the directory.');
        }
        res.send({
            message: 'Directory deleted successfully!',
            dirPath,
        });
    });
});

router.put('/rename/:filePath/:newName', (req, res) => {
    const filePath = req.params.filePath.replace(/~/g, path.sep).replace('root', '');
    const newName = req.params.newName;
    const fullPath = path.join(__dirname, '../uploads', filePath);
    const newFullPath = path.join(path.dirname(fullPath), newName);

    if (!fs.existsSync(fullPath)) {
        return res.status(404).send('File not found.');
    }

    if (fs.existsSync(newFullPath)) {
        return res.status(400).send('A file with the new name already exists.');
    }

    fs.rename(fullPath, newFullPath, (err) => {
        if (err) {
            return res.status(500).send('Failed to rename the file.');
        }
        res.send({
            message: 'File renamed successfully!',
            oldName: path.basename(fullPath),
            newName,
            path: path.relative(path.join(__dirname, '../uploads'), newFullPath).replace(/\\/g, '/'),
        });
    });
});

const searchFilesByName = (directory, searchName) => {
    let results = [];
    const items = fs.readdirSync(directory);

    items.forEach((item) => {
        const itemPath = path.join(directory, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            results = results.concat(searchFilesByName(itemPath, searchName));
        } else if (stats.isFile() && item.includes(searchName)) {
            results.push({
                name: item,
                path: itemPath.replace(/\\/g, '/'),
                url: `/uploads/${path.relative(path.join(__dirname, '../uploads'), itemPath).replace(/\\/g, '/')}`,
            });
        }
    });

    return results;
};

router.get('/search/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const uploadsDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadsDir)) {
        return res.status(404).send('Uploads directory not found.');
    }

    const matches = searchFilesByName(uploadsDir, fileName);

    res.send({
        message: `Files matching "${fileName}":`,
        matches,
    });
});

module.exports = router;
