require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const Joi = require('joi');
const request = require('request');
const sgMail = require('@sendgrid/mail');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {

  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email(),
    subject: Joi.string().required(),
    phone: Joi.number().integer(),
    message: Joi.string(),
    'g-recaptcha-response': Joi.string()
  });

  // Return result.
  const result = Joi.validate(req.body, schema);

  if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.render('contact', {msg:'<script>alert("Please select reCAPTCHA")</script>'});
  }

  const secretKey = process.env.RECAPTCHA_SECRET;
  const verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

  if (result.error !== null) {
    return res.render('contact', {msg:'<script>alert("Form content not valid. Please make sure all required* fields are filled properly.")</script>'});
  }
  else {
    request(verificationUrl, (error, response, body) => {
      body = JSON.parse(body);
      
    if (body.success !== undefined && !body.success) {
      return res.render('contact', {msg:'<script>alert("Failed reCAPTCHA verification")</script>'});
    }
    else {
      const {name, email, subject, phone, message} = req.body;

      const output = `
        <p>Greetings,</p>
        <p>You have a new contact request from agents-world.com !</p>
        <h3>Contact Details</h3>
        <ul>  
          <li>Name: ${req.body.name}</li>
          <li>Email: ${req.body.email}</li>
          <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
      `;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const emails = [process.env.EMAIL_TO_1, process.env.EMAIL_TO_2];

      const msg = {
        to: emails,
        from: email,
        subject: subject,
        html: output
      };
      sgMail.send(msg);
      res.render('contact', {msg:'<script>$(document).ready(function(){$("#postresultgo").modal("show");});</script>'});
      
    }
    });
  }
});

app.listen(3000, () => console.log('Server started...'));