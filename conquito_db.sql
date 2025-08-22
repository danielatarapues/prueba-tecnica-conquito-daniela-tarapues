-- ============================================
-- CONQUITO DATABASE - PRUEBA TÉCNICA
-- Archivo de exportación SQL para PostgreSQL
-- ============================================

-- Eliminar tabla si existe (para recreación limpia)
DROP TABLE IF EXISTS persons CASCADE;

-- Crear tabla persons con todos los campos requeridos
CREATE TABLE persons (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    age INTEGER NOT NULL,
    profession VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Establecer la secuencia para que comience desde 101
ALTER SEQUENCE persons_id_seq RESTART WITH 101;

-- Insertar datos de ejemplo (algunos comparten meses en created_at)
INSERT INTO persons (id, first_name, last_name, birth_date, age, profession, address, phone, photo_url, created_at, updated_at) VALUES 
(101, 'María', 'García', '1990-03-15', 34, 'Ingeniera de Software', 'Av. Amazonas 123, Quito', '+593-99-123-4567', 'https://example.com/photos/maria.jpg', '2024-01-15 08:30:00', '2024-01-15 08:30:00'),
(102, 'Carlos', 'Rodríguez', '1985-07-22', 39, 'Médico', 'Calle de los Shiris 456, Quito', '+593-98-765-4321', 'https://example.com/photos/carlos.jpg', '2024-01-25 14:15:30', '2024-02-05 16:20:45'),

(103, 'Ana', 'López', '1992-11-08', 32, 'Diseñadora Gráfica', 'Av. 6 de Diciembre 789, Quito', '+593-97-234-5678', 'https://example.com/photos/ana.jpg', '2024-03-05 10:45:15', '2024-03-05 10:45:15'),
(104, 'Diego', 'Martínez', '1988-01-30', 36, 'Arquitecto', 'Av. República 321, Quito', '+593-96-345-6789', 'https://example.com/photos/diego.jpg', '2024-03-18 09:20:00', '2024-04-12 11:30:22'),

(105, 'Sofía', 'Herrera', '1995-09-14', 29, 'Marketing Digital', 'Calle Venezuela 654, Quito', '+593-95-456-7890', 'https://example.com/photos/sofia.jpg', '2024-05-18 13:10:45', '2024-05-18 13:10:45'),

(106, 'Fernando', 'Vásquez', '1983-12-03', 41, 'Contador', 'Av. Patria 987, Quito', '+593-94-567-8901', 'https://example.com/photos/fernando.jpg', '2024-07-01 16:45:30', '2024-07-10 08:15:12'),
(107, 'Isabella', 'Morales', '1991-04-27', 33, 'Psicóloga', 'Calle Colón 159, Quito', '+593-93-678-9012', 'https://example.com/photos/isabella.jpg', '2024-07-20 11:25:20', '2024-07-20 11:25:20'),

(108, 'Andrés', 'Castillo', '1987-06-11', 37, 'Chef', 'Av. Gonzalez Suarez 753, Quito', '+593-92-789-0123', 'https://example.com/photos/andres.jpg', '2024-08-14 07:50:10', '2024-08-20 14:30:55'),

(109, 'Valentina', 'Jiménez', '1994-10-19', 30, 'Abogada', 'Calle Juan León Mera 482, Quito', '+593-91-890-1234', 'https://example.com/photos/valentina.jpg', '2024-09-07 15:35:40', '2024-09-07 15:35:40'),

(110, 'Ricardo', 'Peña', '1986-08-25', 38, 'Profesor', 'Av. América 246, Quito', '+593-90-901-2345', 'https://example.com/photos/ricardo.jpg', '2024-10-12 12:15:25', '2024-11-05 09:40:18');

-- Actualizar la secuencia después de los inserts manuales
SELECT setval('persons_id_seq', (SELECT MAX(id) FROM persons));

-- ============================================
-- FIN DEL SCRIPT DE EXPORTACIÓN
-- ============================================
