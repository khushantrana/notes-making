require('dotenv').config();

const express=require('express');

const expressLayouts=require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const app=express(); 
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const port=5000||process.env.PORT;
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
//connect to database 
connectDB();

//static files;
app.use(express.static('public'));

//Templating Engine

app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine','ejs');


// app.get('/', (req, res) => {
//     const locals = {
//         title: 'NodeJs Notes',
//         description:'Free NodeJs Notes app',
//     }
//     res.render('index',locals);
// })

app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));
app.use('/', require('./server/routes/auth'));
app.listen(port, () => {
    console.log(`Listening on the port ${port}`);
})


app.use('*', (req, res) => {
    res.status(404).render('404'); 
});
