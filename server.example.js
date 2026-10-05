require('dotenv').config?.();
const express = require('express'), path = require('path'), nodemailer = require('nodemailer');
const { mountAdmin } = require('./admin-auth');
const app = express(); app.set('trust proxy', 1);
const mail = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: +process.env.SMTP_PORT || 465, secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
app.get('/admin-login.html', (_, r) => r.sendFile(path.join(__dirname, 'public/admin-login.html'))); // public login page only
mountAdmin(app, { sendMail: (to, subject, text) => mail.sendMail({ from: process.env.SMTP_USER, to, subject, text }) });
app.get('/admin/*', (_, r) => r.send('Admin panel (owner only)'));   // replace with your real admin pages
// Normal registration/SSO routes: NEVER accept `role` from the body; always create { role: 'user' }.
app.listen(process.env.PORT || 3000);
