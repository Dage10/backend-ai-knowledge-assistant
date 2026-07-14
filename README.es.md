🌍 Idiomas:
[English](README.md) | [Español](README.es.md)

# 🧠 AI Knowledge Assistant

> Asistente inteligente basado en IA que permite subir documentos PDF y realizar preguntas en lenguaje natural sobre su contenido mediante Retrieval-Augmented Generation (RAG), embeddings vectoriales, búsqueda semántica y Google Gemini.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)
![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=google)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)

---

# 🚀 Demo

### Frontend

> https://frontend-ai-knowledge-assistant.vercel.app/

### Backend

> https://backend-ai-knowledge-assistant.onrender.com

---

# 📖 Descripción

AI Knowledge Assistant es una aplicación Full Stack que demuestra el funcionamiento de un sistema moderno basado en **Retrieval-Augmented Generation (RAG)**.

En lugar de permitir que el modelo responda utilizando únicamente su conocimiento interno, la aplicación recupera primero los fragmentos más relevantes del documento y únicamente esos se utilizan como contexto para generar la respuesta mediante Google Gemini.

Este enfoque ofrece numerosas ventajas:

- Respuestas basadas únicamente en el contenido del documento.
- Reducción de alucinaciones del modelo.
- Búsqueda semántica mediante embeddings.
- Historial de conversaciones por documento.
- Almacenamiento persistente de documentos.
- Arquitectura preparada para despliegue en la nube.

Este proyecto ha sido desarrollado como proyecto de portfolio con el objetivo de demostrar conocimientos en desarrollo Full Stack, integración de Inteligencia Artificial, bases de datos, APIs REST y despliegue de aplicaciones modernas.

---

# ✨ Funcionalidades

## 📄 Gestión de documentos

- Subida de documentos PDF.
- Extracción automática del texto.
- Detección de documentos duplicados mediante SHA-256.
- Almacenamiento persistente en PostgreSQL.
- Eliminación de documentos.
- Historial de documentos subidos.

---

## 🤖 Preguntas mediante IA

- Preguntas en lenguaje natural.
- Sistema Retrieval-Augmented Generation (RAG).
- Búsqueda semántica mediante embeddings.
- Integración con Google Gemini 2.5 Flash.
- Prompt basado únicamente en el contexto recuperado.
- Respuestas generadas exclusivamente utilizando el contenido del documento.

---

## 🧠 Búsqueda Vectorial

Cada documento se procesa automáticamente siguiendo estos pasos:

1. Extracción del texto.
2. División en fragmentos (chunks).
3. Generación de embeddings.
4. Almacenamiento de los vectores en PostgreSQL mediante pgvector.
5. Recuperación de los fragmentos más relevantes durante cada consulta.

---

## 💬 Historial de conversaciones

Cada documento mantiene su propio historial de conversación.

Se almacena:

- Pregunta realizada.
- Respuesta generada.
- Fecha y hora.

---

## 🔒 Seguridad

La aplicación incorpora diferentes medidas de seguridad:

- Helmet.
- Configuración CORS.
- Variables de entorno.
- Limitación del tamaño de subida.
- Rate Limiting.
- Validación de peticiones.
- Consultas SQL parametrizadas.

---

# 🏗 Arquitectura

```

Frontend (Next.js + React)

↓

API REST

↓

Backend Express

↓

Procesamiento PDF

↓

Generación de Chunks

↓

Embeddings Gemini

↓

PostgreSQL + pgvector

↓

Búsqueda Semántica

↓

Gemini 2.5 Flash

↓

Respuesta generada

```

---

# ⚙ Flujo de funcionamiento (Pipeline RAG)

La aplicación implementa el siguiente flujo de Retrieval-Augmented Generation:

### 1. Subida del documento

El usuario selecciona un documento PDF.

↓

### 2. Extracción del texto

El backend obtiene el contenido textual mediante pdf-parse.

↓

### 3. División en fragmentos

El documento se divide en fragmentos solapados para mejorar la recuperación semántica.

↓

### 4. Generación de embeddings

Cada fragmento se convierte en un vector de 768 dimensiones utilizando Gemini Embedding.

↓

### 5. Almacenamiento

Los fragmentos y sus embeddings se almacenan en PostgreSQL.

↓

### 6. Pregunta del usuario

El usuario realiza una pregunta sobre el documento.

↓

### 7. Embedding de la pregunta

La pregunta también se transforma en un embedding.

↓

### 8. Búsqueda semántica

Se recuperan los cinco fragmentos más similares utilizando pgvector.

↓

### 9. Construcción del prompt

Únicamente esos fragmentos forman el contexto enviado al modelo.

↓

### 10. Respuesta

Gemini genera una respuesta basada exclusivamente en dicho contexto.

---

# 🛠 Tecnologías utilizadas

## Frontend

- Next.js 15
- React 19
- TypeScript
- Axios
- Fetch API
- CSS

---

## Backend

- Node.js
- Express 5
- PostgreSQL
- pgvector
- Multer
- Helmet
- CORS
- Express Rate Limit
- Google Gemini SDK

---

## Inteligencia Artificial

- Gemini 2.5 Flash
- Gemini Embedding API

---

## Base de datos

- PostgreSQL
- Neon Database
- pgvector

---

## Despliegue

- Vercel
- Render
- Neon

---

# 📁 Estructura del proyecto

```

frontend/

├── app/

├── public/

├── components/

└── ...

backend/

├── index.js

├── package.json

└── ...

```

---

# ⚡ Instalación

## Clonar los repositorios

```bash
git clone https://github.com/Dage10/frontend-ai-knowledge-assistant

git clone https://github.com/Dage10/backend-ai-knowledge-assistant
```

Instalar frontend

```bash
cd frontend-ai-knowledge-assistant

npm install
```

Instalar backend

```bash
cd backend-ai-knowledge-assistant

npm install
```

Ejecutar backend

```bash
npm start
```

Ejecutar frontend

```bash
npm run dev
```

---

# 🔑 Variables de entorno

## Backend

Crear un archivo `.env`

```env
PORT=3001

DATABASE_URL=

GEMINI_API_KEY=

FRONTEND_URL=https://tu-frontend.vercel.app
```

---

## Frontend

Crear un archivo `.env.local`

```env
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com
```

---

# ☁ Despliegue

## Frontend

Desplegar utilizando **Vercel**.

Configurar la variable:

```
NEXT_PUBLIC_API_URL
```

con la URL pública del backend.

---

## Backend

Desplegar utilizando **Render**.

Variables necesarias:

- DATABASE_URL
- GEMINI_API_KEY
- FRONTEND_URL

Una vez desplegado, el servidor se conecta automáticamente a PostgreSQL y expone la API REST.

---
# 📡 API REST

El backend expone una API REST sencilla para la gestión de documentos y consultas mediante IA.

---

## Comprobar estado del servidor

```http
GET /health
```

Respuesta

```text
OK
```

---

## Obtener documentos

```http
GET /documents
```

Devuelve todos los documentos almacenados ordenados por fecha de creación.

---

## Subir documento

```http
POST /documents/upload
```

Tipo de petición

```
multipart/form-data
```

Campo requerido

```
file: PDF
```

Respuesta

```json
{
  "id": 1,
  "message": "File uploaded successfully"
}
```

---

## Realizar una pregunta

```http
POST /ask
```

Body

```json
{
  "question": "¿Cuál es el tema principal del documento?",
  "documentId": 1
}
```

Respuesta

```json
{
  "answer": "...",
  "sources": []
}
```

---

## Historial de conversaciones

```http
GET /documents/:id/conversations
```

Obtiene el historial completo de preguntas y respuestas asociado a un documento.

---

## Eliminar documento

```http
DELETE /documents/:id
```

Elimina el documento junto con toda la información relacionada.

---

# 🗄 Diseño de la Base de Datos

La aplicación utiliza PostgreSQL junto con la extensión **pgvector** para almacenar embeddings.

---

## Tabla: documents

Almacena los documentos PDF subidos por el usuario.

| Columna | Descripción |
|----------|-------------|
| id | Identificador del documento |
| name | Nombre original del archivo |
| text | Texto extraído del PDF |
| file_hash | Hash SHA-256 para detectar duplicados |
| created_at | Fecha de subida |

---

## Tabla: chunks

Contiene los fragmentos generados automáticamente a partir de cada documento.

| Columna | Descripción |
|----------|-------------|
| id | Identificador |
| document_id | Documento asociado |
| content | Contenido del fragmento |
| chunk_index | Posición dentro del documento |
| embedding | Embedding almacenado mediante pgvector |

---

## Tabla: conversations

Registra el historial de conversación.

| Columna | Descripción |
|----------|-------------|
| id | Identificador |
| document_id | Documento relacionado |
| question | Pregunta realizada |
| answer | Respuesta generada |
| created_at | Fecha de creación |

---

# 🧩 Decisiones de Diseño

Durante el desarrollo se tomaron diferentes decisiones arquitectónicas para mejorar el rendimiento, la escalabilidad y el mantenimiento del proyecto.

### ¿Por qué dividir el documento en chunks?

Los modelos de lenguaje tienen una ventana de contexto limitada.

Dividir los documentos en fragmentos solapados permite recuperar únicamente la información más relevante sin perder continuidad entre secciones.

---

### ¿Por qué utilizar embeddings?

Las búsquedas tradicionales funcionan mediante coincidencias exactas de palabras.

Los embeddings permiten realizar búsquedas por significado, obteniendo resultados mucho más precisos incluso cuando el usuario formula la pregunta utilizando palabras diferentes.

---

### ¿Por qué utilizar Retrieval-Augmented Generation (RAG)?

El modelo no responde utilizando su conocimiento general.

Antes de generar una respuesta:

- Se buscan los fragmentos más relevantes.
- Se construye un contexto específico.
- Gemini responde únicamente utilizando esa información.

Este enfoque reduce considerablemente las alucinaciones y mejora la precisión.

---

### ¿Por qué PostgreSQL?

PostgreSQL ofrece:

- Fiabilidad.
- Soporte ACID.
- Excelente rendimiento.
- Compatibilidad con pgvector.
- Integración sencilla con servicios cloud como Neon.

---

# ⚡ Rendimiento

La aplicación incorpora diversas optimizaciones.

- Recuperación únicamente de los cinco fragmentos más relevantes.
- Chunks con solapamiento para conservar el contexto.
- Búsqueda vectorial mediante pgvector.
- Detección de documentos duplicados mediante SHA-256.
- Pool de conexiones a PostgreSQL.
- Limitación del tamaño máximo de archivos.
- Rate Limiting para evitar abuso de la API.

---

# 🔐 Seguridad

Se han implementado diferentes medidas de seguridad siguiendo buenas prácticas actuales.

✔ Helmet para cabeceras HTTP.

✔ Configuración CORS.

✔ Variables de entorno.

✔ Consultas SQL parametrizadas.

✔ Validación de peticiones.

✔ Restricción del tamaño de subida.

✔ Limitación de peticiones por minuto.

✔ Prevención de documentos duplicados.

---

# 🚀 Mejoras Futuras

Algunas funcionalidades que podrían añadirse en futuras versiones:

- Autenticación mediante JWT.
- Gestión de múltiples usuarios.
- Compartir documentos.
- Streaming de respuestas.
- Citado visual del fragmento utilizado.
- Soporte OCR para PDFs escaneados.
- Renderizado Markdown.
- Caché mediante Redis.
- Generación de embeddings en segundo plano.
- Docker.
- Kubernetes.
- Pipeline CI/CD.
- Tests unitarios.
- Tests de integración.
- Compatibilidad con múltiples documentos.
- Búsqueda híbrida (vectorial + textual).

---

# 📸 Capturas de Pantalla

<img width="800" alt="Home" src="https://github.com/user-attachments/assets/df3ed29d-1054-447a-a596-6b766a7df391" />
<img width="800" alt="Error 1" src="https://github.com/user-attachments/assets/1cf41906-46a3-477e-9ca5-6ac01f0a77a3" />
<img width="800" alt="Error 2" src="https://github.com/user-attachments/assets/a89b9520-1952-4360-8ab7-990aef9f9678" />
<img width="800" alt="Subiendo" src="https://github.com/user-attachments/assets/84cd88ca-4956-44ad-ab82-fba3cca2697f" />
<img width="800" alt="Subida correcta" src="https://github.com/user-attachments/assets/8aef26ad-1a6e-4063-8ce8-886571121770" />
<img width="800" alt="Respuesta" src="https://github.com/user-attachments/assets/8723dc7a-935f-437c-b661-888f5e771656" />
<img width="800" alt="Persistencia conversacion" src="https://github.com/user-attachments/assets/775a91a9-3b45-4fc0-bdd3-0da19bc061e5" />
<img width="800" alt="Delete" src="https://github.com/user-attachments/assets/70ea5206-c045-4369-8a2f-ad22fb83c8b4" />

Ejemplo:

- Pantalla principal.
- Selección de documento.
- Subida de PDF.
- Conversación con la IA.
- Historial de conversaciones.

---

# 💡 Aprendizajes

Este proyecto me ha permitido profundizar en áreas como:

- Inteligencia Artificial aplicada.
- Retrieval-Augmented Generation (RAG).
- Embeddings.
- Búsqueda semántica.
- Google Gemini API.
- PostgreSQL + pgvector.
- Desarrollo Backend.
- Desarrollo Frontend.
- Arquitecturas Full Stack.
- Diseño de APIs REST.
- Despliegue en la nube.

---

# 🎯 Competencias demostradas

Este proyecto refleja conocimientos en:

- Desarrollo Full Stack.
- Integración de Inteligencia Artificial.
- APIs REST.
- Bases de datos relacionales.
- Búsqueda vectorial.
- Arquitectura Backend.
- Desarrollo Frontend.
- Despliegue Cloud.
- Buenas prácticas de seguridad.
- Ingeniería del Software.

---

# 🤝 Contribuciones

Las sugerencias, mejoras o Pull Requests son siempre bienvenidas.

Si encuentras algún problema, puedes abrir una **Issue** en GitHub.

---

# 👨‍💻 Autor

**David Gelma Corral**

GitHub

https://github.com/Dage10

LinkedIn

https://www.linkedin.com/in/david-gelma-corral-92b817114/

---

# 📄 Licencia

Este proyecto está distribuido bajo la licencia **MIT**.

Consulta el archivo `LICENSE` para obtener más información.

---

# ⭐ ¿Te ha gustado el proyecto?

Si este proyecto te ha resultado interesante o útil, considera darle una ⭐ al repositorio.

Es una forma sencilla de apoyar el proyecto y ayudar a que tenga mayor visibilidad.

---

> Desarrollado con ❤️ utilizando Next.js, Express, PostgreSQL, pgvector y Google Gemini.
