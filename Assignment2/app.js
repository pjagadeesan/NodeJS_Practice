const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const rootDir = require('./util/path');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));

//serving static content
app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin/add-user',(req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-user.html'));
});

app.post('/admin/user',(req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

app.get('/',(req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'users.html'));
});

app.use((req,res,next) => {
    res.status(404).sendFile(path.join(__dirname, './', 'views', 'error.html'));
});

app.listen(3000);