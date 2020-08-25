const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors');

const app = express();

//view engine set up
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // by default it will set to views folder already

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

//serving static files like css, images
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorController.getError);

app.listen(3000);
