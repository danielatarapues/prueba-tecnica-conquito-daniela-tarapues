const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
const Joi = require('joi');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la base de datos
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Esquema de validación
const personSchema = Joi.object({
  first_name: Joi.string().required().min(1).max(100),
  last_name: Joi.string().required().min(1).max(100),
  birth_date: Joi.date().required(),
  profession: Joi.string().required().min(1).max(100),
  address: Joi.string().required().min(1),
  phone: Joi.string().required().pattern(/^[0-9+\-\s\(\)]+$/).min(10).max(20)
});

// Función para calcular la edad
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Rutas
// GET /api/persons - Obtener todas las personas
app.get('/api/persons', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM persons ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo personas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/persons - Crear nueva persona
app.post('/api/persons', upload.single('photo'), async (req, res) => {
  try {
    const { error, value } = personSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Datos de validación incorrectos', 
        details: error.details.map(d => d.message) 
      });
    }

    const { first_name, last_name, birth_date, profession, address, phone } = value;
    const age = calculateAge(birth_date);
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO persons (first_name, last_name, birth_date, age, profession, address, phone, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [first_name, last_name, birth_date, age, profession, address, phone, photo_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando persona:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/dashboard/stats - Obtener estadísticas para el dashboard
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // Personas por profesión
    const professionStats = await pool.query(`
      SELECT profession, COUNT(*) as count 
      FROM persons 
      GROUP BY profession 
      ORDER BY count DESC
    `);

    // Distribución por rangos de edad
    const ageRangeStats = await pool.query(`
      SELECT 
        CASE 
          WHEN age BETWEEN 0 AND 18 THEN '0-18'
          WHEN age BETWEEN 19 AND 35 THEN '19-35'
          WHEN age BETWEEN 36 AND 60 THEN '36-60'
          ELSE '60+'
        END as age_range,
        COUNT(*) as count
      FROM persons
      GROUP BY age_range
      ORDER BY MIN(age)
    `);

    // Personas registradas por mes - CORREGIDO para mostrar TODOS los meses
    const monthlyStats = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      FROM persons
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `);

    console.log('📊 Estadísticas obtenidas:');
    console.log('Profesiones:', professionStats.rows.length);
    console.log('Rangos de edad:', ageRangeStats.rows.length);
    console.log('Meses con datos:', monthlyStats.rows.length);

    res.json({
      professionStats: professionStats.rows,
      ageRangeStats: ageRangeStats.rows,
      monthlyStats: monthlyStats.rows.map(row => ({
        month: row.month.toISOString().substring(0, 7), // YYYY-MM format
        count: parseInt(row.count)
      }))
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/professions - Obtener lista de profesiones
app.get('/api/professions', (req, res) => {
  const professions = [
    'Ingeniero',
    'Médico',
    'Abogado',
    'Profesor',
    'Contador',
    'Arquitecto',
    'Psicólogo',
    'Enfermero',
    'Dentista',
    'Veterinario',
    'Diseñador',
    'Programador'
  ];
  
  res.json(professions);
});

// Crear directorio uploads si no existe
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});