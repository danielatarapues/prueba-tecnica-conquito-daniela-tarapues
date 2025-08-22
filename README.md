# ConQuito - Sistema de Registro de Personas

Aplicación web para registro de personas con dashboard de estadísticas desarrollada para la prueba técnica de ConQuito.

## 🚀 Tecnologías

**Frontend:** Vite + React + TypeScript  
**Backend:** Node.js + Express  
**Base de datos:** PostgreSQL  

## 📦 Instalación

### Backend
```bash
cd backend-node
npm install

# Configurar el archivo .env (ya incluido en el proyecto)
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=conquito_db
DB_USER=postgres
DB_PASSWORD=password


# Crear base de datos
createdb conquito_db
psql -U postgres -d conquito_db -f conquito_db.sql

npm run dev
```

### Frontend
```bash
cd frontend-react
npm install
npm run dev
```

## 🎯 Funcionalidades

✅ **Registro de personas** con múltiples formularios dinámicos  
✅ **Validaciones completas** (nombres, teléfonos, etc.)  
✅ **Subida de fotos** con drag & drop  
✅ **Dashboard interactivo** con 3 tipos de gráficos  
✅ **Sistema de filtros**  
✅ **Diseño responsive** y moderno  

## 📊 Dashboard

- **Gráfico de barras:** Personas por profesión
- **Gráfico de torta:** Distribución por rangos de edad  
- **Gráfico de líneas:** Registros por mes
- **Filtros:** Por profesión, edad y fechas 

## 🗃️ Base de Datos

La tabla `persons` incluye todos los campos requeridos con 10 registros de ejemplo.

---

**Prueba Técnica - Daniela Tarapues**
