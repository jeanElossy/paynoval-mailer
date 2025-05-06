const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  console.log('📨 Reçu /send-email payload:', req.body);
  const { email, subject, htmlContent } = req.body;

  if (!email || !subject || !htmlContent) {
    return res.status(400).json({ success: false, error: 'Champs manquants' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"PayNoval" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: htmlContent,
    });

    res.json({ success: true, message: '📤 Email envoyé avec succès' });
  } catch (error) {
    console.error('❌ Erreur envoi mail :', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l’envoi de l’email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`📬 Microservice email actif sur le port ${PORT}`);
});
