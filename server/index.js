const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/upload', require('./routes/upload'));
app.use('/folder', require('./routes/folder'));

app.get('/', (req, res) => res.send('CachunHomeCloud'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
