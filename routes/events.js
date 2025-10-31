import express from 'express';
import Event from '../models/Event.js'; // Asegúrate que tu modelo tenga export default

const router = express.Router();

// ✅ Obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Crear evento
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Obtener evento por id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if(!event) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Editar evento
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if(!updatedEvent) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Eliminar evento
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if(!deleted) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json({ msg: 'Evento eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

