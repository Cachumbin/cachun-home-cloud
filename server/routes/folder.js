const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/:path', (req, res) => {
    const requestedPath = req.params.path.replace(/~/g, path.sep).replace('root', '');
    const absolutePath = path.join(__dirname, '../uploads', requestedPath);

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

module.exports = router;
