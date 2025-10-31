import express from 'express';
const router = express.Router();

// Ejemplo de almacenamiento en memoria temporal
let events = [];

// GET → Obtener eventos
router.get('/', (req, res) => {
  res.json(events);
});

// POST → Crear nuevo evento
router.post('/', (req, res) => {
  const { nombre, fecha, lugar } = req.body;

  if (!nombre || !fecha || !lugar) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const nuevoEvento = { id: Date.now(), nombre, fecha, lugar };
  events.push(nuevoEvento);
  res.status(201).json(nuevoEvento);
});

export default router;

