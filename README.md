# Setup
1. `npm i express bcryptjs jsonwebtoken cookie-parser nodemailer`
2. Copy `.env.example` -> `.env`, fill OWNER_EMAIL, OWNER_PASSWORD_HASH, ADMIN_JWT_SECRET, SMTP_*.
3. In your existing server: `const {mountAdmin}=require('./admin-auth'); mountAdmin(app,{sendMail});` (see server.example.js)
4. Serve `public/admin-login.html` at /admin-login.html. Run `node test.js` to verify (16 checks).
5. Delete the old "local fallback / offline" admin login. Any client-side fallback is a bypass.
6. Registration + OAuth (Google/GitHub/FB/Instagram) handlers: always `role:'user'`, ignore `req.body.role`.
