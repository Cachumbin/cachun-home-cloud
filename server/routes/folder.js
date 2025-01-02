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

module.exports = router;