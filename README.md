# 🗳️ Sistema de Votación Online - Prueba Técnica (New Inntech)

Este proyecto es una aplicación de votación online que permite a **administradores**, **candidatos** y **votantes** interactuar en un sistema seguro y sencillo.  
Incluye **backend con API REST** y **frontend con React**.

---

## 🚀 Instrucciones para ejecutar el proyecto localmente

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/Josepaez07/Prueba_tecnica_new_inntech
```

---

### 2️⃣ Configuración del Backend
1. Ingresar a la carpeta del backend:
   ```bash
   cd back
   ```

2. Crear un archivo `.env` con las siguientes variables:
   ```env
   USERBD=jpaez5393
   PASSWORDBD=R0h5WZSByCC0n1xZ
   BD=VotingSystem
   PORT=9999
   JWT_SECRET=jwtScretPrueba
   ```

3. Instalar dependencias:
   ```bash
   npm install
   ```

4. Ejecutar el servidor:
   ```bash
   npm run dev
   ```

El backend estará disponible en:  
👉 `http://localhost:9999`

Y la documentación de endpoints en Swagger:  
👉 `http://localhost:9999/api-docs/#/`

---

### 3️⃣ Configuración del Frontend
1. Ingresar a la carpeta del frontend:
   ```bash
   cd front
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

El frontend estará disponible en:  
👉 `http://localhost:5173`

---

## 📌 Endpoints principales del API

La API expone múltiples recursos: **autenticación, votantes, candidatos, votos y estadísticas**.  

### 🔑 Autenticación
```bash
curl -X POST http://localhost:9999/api/auth/login   -H "Content-Type: application/json"   -d '{"email": "admin@test.com", "password": "123456"}'
```

### 👥 Votantes
```bash
curl -X GET http://localhost:9999/api/voters   -H "Authorization: Bearer <token>"
```

### 🏛️ Candidatos
```bash
curl -X GET http://localhost:9999/api/candidates
```

### 🗳️ Votos
```bash
curl -X POST http://localhost:9999/api/votes   -H "Authorization: Bearer <token>"   -H "Content-Type: application/json"   -d '{"candidateId": "68b0a93de2f8b8ccb4b729ed"}'
```

### 📊 Estadísticas
```bash
curl -X GET http://localhost:9999/api/stats
```

Ejemplo de respuesta:
```json
{
  "total_voters": 10,
  "total_votes": 7,
  "total_candidates": 3,
  "participation_rate": "70%",
  "votes_per_candidate": [
    {
      "_id": "68b0a93de2f8b8ccb4b729ed",
      "candidateName": "Jose candidate 1",
      "candidateParty": "partido en la tarde",
      "voteCount": 2
    }
  ]
}
```

---

## 📸 Capturas de pantalla

### 📊 Estadísticas en el Dashboard
![Ejemplo de estadísticas](./docs/capturas/stats-dashboard.png)

### 🗳️ Vista de votación
![Ejemplo de votación](./docs/capturas/vote-dashboard.png)

---

## 👨‍💻 Tecnologías utilizadas
- **Backend:** Node.js, Express, MongoDB, JWT  
- **Frontend:** React, TailwindCSS, Recharts  
- **Autenticación:** JSON Web Tokens  
- **Gestión de estado:** LocalStorage / Context API  

---
