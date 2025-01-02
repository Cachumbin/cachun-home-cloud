const fs = require('fs');
const path = require('path');

const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const saveFile = (file, dir) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(dir, file.name);
        file.mv(filePath, (err) => {
            if (err) return reject(err);
            resolve(`./uploads/${path.relative(path.join(__dirname, '../uploads'), filePath)}`.replace(/\\/g, '/'));
        });
    });
};

module.exports = {
    ensureDirectoryExists,
    saveFile,
};
