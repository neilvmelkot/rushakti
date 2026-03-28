const express    = require('express');
const nodemailer = require('nodemailer');
const auth       = require('../middleware/auth');
const Content    = require('../models/Content');
const Admin      = require('../models/Admin');
const router     = express.Router();

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
});

const DEFAULT_EBOARD = [
  { name: 'Anika',  role: 'Co-President', photo: '' },
  { name: 'Maanya', role: 'Co-President', photo: '' },
  { name: 'Kashvi', role: '',             photo: '' },
  { name: 'Sayee',  role: '',             photo: '' },
];

async function getOrCreateContent() {
  let c = await Content.findOne();
  if (!c) c = await Content.create({ applyEnabled: true, eboard: DEFAULT_EBOARD });
  return c;
}

// Public — frontend reads this
router.get('/content', async (_req, res) => {
  try {
    res.json(await getOrCreateContent());
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected — toggle apply on/off
router.put('/apply-toggle', auth, async (_req, res) => {
  try {
    const c = await getOrCreateContent();
    c.applyEnabled = !c.applyEnabled;
    await c.save();
    res.json({ applyEnabled: c.applyEnabled });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected — update entire eboard array
router.put('/eboard', auth, async (req, res) => {
  try {
    const c = await getOrCreateContent();
    c.eboard = req.body.eboard;
    await c.save();
    res.json(c.eboard);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected — change password
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both fields required' });
  }
  try {
    const admin = await Admin.findOne({ username: req.admin.username });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const valid = await admin.comparePassword(currentPassword);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    admin.password = newPassword;
    await admin.save();

    await mailer.sendMail({
      from:    `"RU Shakti Admin" <${process.env.GMAIL_FROM}>`,
      to:      process.env.GMAIL_FROM,
      subject: 'RU Shakti — Admin Password Changed',
      text:    `Your admin password was just updated.\n\nOld password: ${currentPassword}\nNew password: ${newPassword}\n\nIf you did not make this change, contact your developer immediately.`,
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
