import express from 'express';
import Participant from '../models/Participant.js';
import Event from '../models/Event.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configuración de correo
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Registrar participante
router.post('/', async (req, res) => {
  const { event, name, email } = req.body;

  try {
    if(!event || !name || !email) 
      return res.status(400).json({ error: "Faltan datos: event, name o email" });

    const ev = await Event.findById(event);
    if(!ev) return res.status(404).json({ error: "Evento no encontrado" });

    const participant = new Participant({ event, name, email });
    await participant.save();

    // Enviar correo de confirmación
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `Confirmación de registro: ${ev.title}`,
      text: `Hola ${name},\n\nTe has registrado correctamente en "${ev.title}" que se realizará el ${new Date(ev.date).toLocaleDateString()}.\n\nUbicación: ${ev.location}\n\nGracias por participar.`
    };

    transporter.sendMail(mailOptions)
      .then(info => console.log("📧 Correo enviado:", info.response))
      .catch(err => console.error("❌ Error al enviar correo:", err));

    res.status(201).json(participant);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Obtener participantes por evento
router.get('/event/:id', async (req, res) => {
  try {
    const list = await Participant.find({ event: req.params.id }).populate('event');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

