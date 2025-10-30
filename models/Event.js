const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'El título es obligatorio'] },
  description: { type: String, trim: true },
  date: { type: Date, required: [true, 'La fecha es obligatoria'] },
  time: { type: String },
  location: { type: String },
  capacity: { type: Number, min: 1 },
  createdAt: { type: Date, default: Date.now }
});

EventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', EventSchema);
