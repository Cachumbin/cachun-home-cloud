const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

const PORT = 3000;

app.use(fileUpload());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log(req.files);

    res.send('File uploaded!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

