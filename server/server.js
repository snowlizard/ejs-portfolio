const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('./styles'));

// lets app know where views are
app.set('views', './views');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/thanks', (req, res) => {
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
            user: 'stoiccheese@gmail.com',
            pass: process.env.APP_PASS
        }
    });

    const mailOptions = {
        from: 'stoiccheese@gmail.com',
        to: 'illegal_burrito@live.com',
        subject: 'portfolio contact',
        text: `${req.body.name} sent you a msg \n
        ${req.body.text}`
    };

    transporter.sendMail(mailOptions, (err, ok) =>{
        err ? console.log(err) 
        : console.log('email sent!');
        transporter.close();
    });

    res.render('thanks', { contact: req.body });
});

module.exports = app ;