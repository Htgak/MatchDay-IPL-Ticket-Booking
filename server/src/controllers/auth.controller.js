const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../db');
const redis = require('../config/redis');
const AppError = require('../utils/AppError');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Name, email and password are required', 400);
    }

    // Check existing
    const { rows: existing } = await db.query('SELECT id FROM "Users" WHERE email = $1', [email]);
    if (existing.length > 0) {
      throw new AppError('Email already exists', 400);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const payload = JSON.stringify({ name, email, password_hash, otp });
    
    // Store in Redis with 10 mins TTL
    await redis.setex(`otp:${email}`, 600, payload);

    if (env.smtp.user && env.smtp.pass) {
      try {
        const senderEmail = env.smtp.from || env.smtp.user;
        await transporter.sendMail({
          from: `"MatchDay Support" <${senderEmail}>`,
          to: email,
          subject: 'Verify your email for MatchDay',
          text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
          html: `<p>Welcome to MatchDay!</p><p>Your verification code is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`
        });
        if (env.nodeEnv === 'development') {
          console.log(`\n[DEV MODE] OTP sent to ${email}. OTP: ${otp}\n`);
        }
      } catch (mailErr) {
        console.error('SMTP Error:', mailErr.message);
        console.log(`\n[DEV FALLBACK] SMTP failed to send email. OTP for ${email} is ${otp}\n`);
      }
    } else {
      console.log(`\n[DEV MODE] SMTP not configured. OTP for ${email} is ${otp}\n`);
    }

    res.status(200).json({ 
      status: 'success', 
      message: 'Registration initiated. Please check your email for the OTP.' 
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) throw new AppError('Email and OTP are required', 400);

    const payloadStr = await redis.get(`otp:${email}`);
    if (!payloadStr) throw new AppError('OTP expired or invalid email', 400);

    const payload = JSON.parse(payloadStr);
    
    if (payload.otp !== otp.toString()) {
      throw new AppError('Invalid OTP', 400);
    }

    // Insert user
    const { rows } = await db.query(
      'INSERT INTO "Users" (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [payload.name, payload.email, payload.password_hash, 'CUSTOMER']
    );
    
    const dbUser = rows[0];
    
    // Clear redis
    await redis.del(`otp:${email}`);

    const token = jwt.sign({ id: dbUser.id, role: dbUser.role }, env.jwt?.secret || 'matchday_secret_key', { expiresIn: '7d' });

    res.status(200).json({ status: 'success', data: { user: dbUser, token } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new AppError('Email and password are required', 400);

    const { rows } = await db.query('SELECT id, name, email, phone, role, password_hash FROM "Users" WHERE email = $1', [email]);
    const dbUser = rows[0];

    if (!dbUser) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, dbUser.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    delete dbUser.password_hash;

    const token = jwt.sign({ id: dbUser.id, role: dbUser.role }, env.jwt?.secret || 'matchday_secret_key', { expiresIn: '7d' });

    res.status(200).json({ status: 'success', data: { user: dbUser, token } });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT id, name, email, phone, role, created_at FROM "Users" WHERE id = $1', [req.user.id]);
    const user = rows[0];

    if (!user) throw new AppError('User not found', 404);
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
};
