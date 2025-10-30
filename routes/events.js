const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Crear evento
router.post('/', async (req,res)=>{
  try{
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  }catch(err){ res.status(400).json({error: err.message}); }
});

// Listar eventos
router.get('/', async (req,res)=>{
  const events = await Event.find().sort({date:1});
  res.json(events);
});

// Obtener detalle
router.get('/:id', async (req,res)=>{
  const event = await Event.findById(req.params.id);
  if(!event) return res.status(404).json({error:'No encontrado'});
  res.json(event);
});

// Editar
router.put('/:id', async (req,res)=>{
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(event);
});

// Eliminar
router.delete('/:id', async (req,res)=>{
  await Event.findByIdAndDelete(req.params.id);
  res.json({msg:'Eliminado'});
});

module.exports = router;
