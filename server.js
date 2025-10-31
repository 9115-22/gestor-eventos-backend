import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import eventsRouter from './routes/events.js';
import participantsRouter from './routes/participants.js';

dotenv.config();
const app = express();

// ======================
// Configuración CORS
// ======================
const allowedOrigins = [
  "https://gestorevento.netlify.app",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // requests como Postman
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'El CORS no está permitido para este origen';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

// Habilitar preflight
app.options('*', cors());

// ======================
// Middleware
// ======================
app.use(express.json());

// ======================
// Conexión a MongoDB
// ======================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar MongoDB:', err));

// ======================
// Rutas
// ======================
app.use('/api/events', eventsRouter);
app.use('/api/participants', participantsRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ Backend de Gestor de Eventos funcionando correctamente.');
});

// ======================
// Puerto
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
