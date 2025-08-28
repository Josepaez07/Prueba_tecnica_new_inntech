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

La API expone múltiples recursos: **votantes, candidatos, votos y estadísticas**.  

### Capturas de pantalla

### 👥 Ejemplos para Usuarios
![Ejemplo de crear votante](./docs/capturas/crear-votante.png)
![Ejemplo de crear candidato](./docs/capturas/crear-candidato.png)
![Ejemplo de obtener usuarios](./docs/capturas/obtener-usuarios.png)
![Ejemplo de obtener usuarios por id](./docs/capturas/obtener-usuario-id.png)
![Ejemplo de eliminar usuario](./docs/capturas/eliminar-usuario.png)

### 🗳️ Votos
![Ejemplo de crear voto](./docs/capturas/crear-voto.png)
![Ejemplo de obtener votos](./docs/capturas/obtener-votos.png)
![Ejemplo de obtener votos por id](./docs/capturas/obtener-votos-id.png)
![Ejemplo de eliminar votos](./docs/capturas/eliminar-voto.png)

### 📊 Estadísticas
![Ejemplo de obtener estadisticas](./docs/capturas/obtener-estadisticas.png)
![Ejemplo de estadisticas](./docs/capturas/vote-dashboard.png)

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
