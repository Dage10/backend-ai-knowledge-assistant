🌍 Languages:
[English](README.md) | [Español](README.es.md)

# 🧠 AI Knowledge Assistant

> AI-powered document assistant that allows users to upload PDF documents and ask natural language questions about their content using Retrieval-Augmented Generation (RAG), vector embeddings, semantic search and Google Gemini.

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

# 🚀 Live Demo

### Frontend

> https://frontend-ai-knowledge-assistant.vercel.app/

### Backend API

> https://backend-ai-knowledge-assistant.onrender.com

---

# 📖 Overview

AI Knowledge Assistant is a full-stack application that demonstrates how a modern Retrieval-Augmented Generation (RAG) system works.

Instead of allowing an LLM to answer using its own knowledge, the application retrieves only the relevant sections of a document and sends them as context to Google Gemini.

This approach provides:

- Accurate answers based only on uploaded documents
- Lower hallucination rate
- Semantic search using embeddings
- Conversation history per document
- Persistent document storage
- Modern cloud deployment

The project was developed as a portfolio project to showcase practical software engineering skills, backend development, frontend development, databases, cloud deployment and AI integration.

---

# ✨ Features

## 📄 Document Management

- Upload PDF documents
- Duplicate document detection using SHA-256 hashing
- Automatic PDF text extraction
- Persistent storage in PostgreSQL
- Delete uploaded documents
- View uploaded document history

---

## 🤖 AI Question Answering

- Natural language questions
- Retrieval-Augmented Generation (RAG)
- Semantic similarity search
- Google Gemini 2.5 Flash
- Gemini Embedding API
- Context-aware prompting
- Responses generated only from document content

---

## 🧠 Vector Search

Each uploaded document is automatically:

1. Parsed
2. Split into overlapping chunks
3. Converted into vector embeddings
4. Stored inside PostgreSQL using pgvector
5. Retrieved by cosine similarity during user queries

---

## 💬 Conversation History

Every interaction is stored.

Each document maintains its own conversation history including:

- User questions
- AI responses
- Timestamp

---

## 🔒 Security

- Helmet
- CORS
- Environment variables
- File size limits
- Rate limiting
- Request validation
- SQL parameterized queries

---

# 🏗 Architecture

```

Frontend (Next.js + React)

↓

REST API

↓

Express.js Backend

↓

PDF Parsing

↓

Chunk Generation

↓

Gemini Embeddings

↓

PostgreSQL + pgvector

↓

Semantic Search

↓

Gemini 2.5 Flash

↓

AI Response

```

---

# ⚙ AI Pipeline

The complete RAG pipeline implemented by the application:

### 1. Upload PDF

User uploads a PDF document.

↓

### 2. Extract Text

The backend extracts all textual content using pdf-parse.

↓

### 3. Split into Chunks

The document is divided into overlapping chunks to improve semantic retrieval.

↓

### 4. Generate Embeddings

Each chunk is transformed into a 768-dimensional vector using Google's Gemini Embedding model.

↓

### 5. Store

Chunks and vectors are stored inside PostgreSQL.

↓

### 6. Ask Question

The user asks a natural language question.

↓

### 7. Embed Question

The question is converted into another embedding.

↓

### 8. Semantic Search

The backend retrieves the five most similar chunks using pgvector similarity search.

↓

### 9. Prompt Construction

Only those retrieved chunks become the context for Gemini.

↓

### 10. AI Response

Gemini generates an answer using only the provided context.

---

# 🛠 Tech Stack

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

## AI

- Gemini 2.5 Flash
- Gemini Embedding API

---

## Database

- PostgreSQL
- Neon Database
- pgvector extension

---

## Deployment

- Vercel
- Render
- Neon

---

# 📁 Project Structure

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

# ⚡ Installation

## Clone repositories

```bash
git clone https://github.com/Dage10/frontend-ai-knowledge-assistant

git clone https://github.com/Dage10/backend-ai-knowledge-assistant
```

Install frontend

```bash
cd frontend-ai-knowledge-assistant

npm install
```

Install backend

```bash
cd backend-ai-knowledge-assistant

npm install
```

Start backend

```bash
npm start
```

Start frontend

```bash
npm run dev
```

---

# 🔑 Environment Variables

## Backend

Create a `.env` file:

```env
PORT=3001

DATABASE_URL=

GEMINI_API_KEY=

FRONTEND_URL=https://your-vercel-url.vercel.app
```

---

## Frontend

Create:

```env
NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com
```

---

# ☁ Deployment

## Frontend

Deploy using **Vercel**.

Configure:

```
NEXT_PUBLIC_API_URL
```

with your backend URL.

---

## Backend

Deploy using **Render**.

Required variables:

- DATABASE_URL
- GEMINI_API_KEY
- FRONTEND_URL

The backend automatically connects to PostgreSQL and starts the Express server.

---

# 📡 REST API

The backend exposes a simple REST API for document management and AI interactions.

---

## Health Check

```http
GET /health
```

Response

```text
OK
```

---

## Get Documents

```http
GET /documents
```

Returns every uploaded document ordered by creation date.

---

## Upload Document

```http
POST /documents/upload
```

Multipart form-data

```
file: PDF
```

Response

```json
{
  "id": 1,
  "message": "File uploaded successfully"
}
```

---

## Ask Question

```http
POST /ask
```

Body

```json
{
  "question":"What is the main topic?",
  "documentId":1
}
```

Response

```json
{
  "answer":"...",
  "sources":[]
}
```

---

## Conversation History

```http
GET /documents/:id/conversations
```

Returns the conversation associated with a document.

---

## Delete Document

```http
DELETE /documents/:id
```

Deletes the document and its associated data.

---

# 🗄 Database Design

The application uses PostgreSQL with pgvector.

Main tables:

## documents

Stores uploaded PDFs.

| Column | Description |
|----------|------------|
| id | Primary key |
| name | Original filename |
| text | Extracted document text |
| file_hash | SHA-256 duplicate detection |
| created_at | Upload timestamp |

---

## chunks

Stores semantic chunks.

| Column | Description |
|----------|------------|
| id | Primary key |
| document_id | Foreign key |
| content | Chunk text |
| chunk_index | Chunk order |
| embedding | pgvector embedding |

---

## conversations

Stores chat history.

| Column | Description |
|----------|------------|
| id | Primary key |
| document_id | Related document |
| question | User question |
| answer | AI response |
| created_at | Timestamp |

---

# 🧩 Design Decisions

Several architectural decisions were made to improve maintainability and scalability.

### Why chunking?

Large documents exceed the context window of modern LLMs.

Splitting documents into overlapping chunks significantly improves retrieval quality while preserving semantic continuity.

---

### Why embeddings?

Traditional keyword search fails when users ask questions using different wording.

Embeddings enable semantic retrieval rather than lexical matching.

---

### Why Retrieval-Augmented Generation?

Instead of relying on the LLM's internal knowledge, only relevant document fragments are provided.

Benefits:

- Lower hallucination rate
- Better factual accuracy
- Reduced prompt size
- Faster inference

---

### Why PostgreSQL?

PostgreSQL offers:

- ACID compliance
- Mature ecosystem
- pgvector support
- Excellent cloud providers (Neon)

---

# ⚡ Performance

Current optimizations include:

- Semantic retrieval limited to Top-5 chunks
- Chunk overlap to preserve context
- Vector similarity search
- SHA-256 duplicate detection
- Connection pooling
- File upload limits
- Express rate limiting

---

# 🔐 Security

The application includes several security best practices.

✔ Helmet security headers

✔ CORS configuration

✔ Environment variables

✔ SQL parameterized queries

✔ Request validation

✔ Upload size restrictions

✔ Rate limiting

✔ Duplicate upload prevention

---

# 🚀 Future Improvements

Potential future enhancements include:

- User authentication (JWT)
- Multiple users
- Document sharing
- Streaming AI responses
- Citation highlighting
- OCR support
- Markdown rendering
- Redis caching
- Background embedding generation
- Docker support
- Kubernetes deployment
- CI/CD pipeline
- Unit tests
- Integration tests
- Vector database migration
- Hybrid search
- Multi-document querying

---

# 📸 Screenshots

<img width="800" alt="Home" src="https://github.com/user-attachments/assets/df3ed29d-1054-447a-a596-6b766a7df391" />
<img width="800" alt="Error 1" src="https://github.com/user-attachments/assets/1cf41906-46a3-477e-9ca5-6ac01f0a77a3" />
<img width="800" alt="Error 2" src="https://github.com/user-attachments/assets/a89b9520-1952-4360-8ab7-990aef9f9678" />
<img width="800" alt="Question" src="https://github.com/user-attachments/assets/94360852-db9e-4264-805b-b62c779a6b8c" />
<img width="800" alt="Uploading" src="https://github.com/user-attachments/assets/84cd88ca-4956-44ad-ab82-fba3cca2697f" />
<img width="800" alt="Uploaded successfully" src="https://github.com/user-attachments/assets/8aef26ad-1a6e-4063-8ce8-886571121770" />
<img width="800" alt="Response" src="https://github.com/user-attachments/assets/5dbcb753-d5a3-47a6-b514-f26d291e0e33" />
<img width="800" alt="Conversation Persistence" src="https://github.com/user-attachments/assets/cb7865a1-5392-4790-9605-102cef7587f6" />

---

# 💡 What I Learned

This project allowed me to gain hands-on experience with:

- Retrieval-Augmented Generation (RAG)
- Vector databases
- Semantic search
- Google Gemini API
- Embeddings
- Express.js
- PostgreSQL
- Next.js
- Cloud deployment
- Full-stack architecture
- REST API development
- Modern AI application design

---

# 🔗 Repositories

This project is split into two repositories:

### Backend (current repository)

https://github.com/Dage10/backend-ai-knowledge-assistant

### Frontend

https://github.com/Dage10/frontend-ai-knowledge-assistant


# 🎯 Portfolio Highlights

This project demonstrates knowledge of:

- Full Stack Development
- AI Integration
- REST APIs
- Cloud Deployment
- Database Design
- Vector Search
- Backend Architecture
- Frontend Development
- Secure API Design
- Modern JavaScript
- TypeScript
- PostgreSQL
- Google Gemini
- Software Engineering Best Practices

---

# 🤝 Contributing

Contributions, suggestions and feedback are welcome.

Feel free to open an Issue or submit a Pull Request.

---

# 👨‍💻 Author

**David Gelma Corral**

GitHub

https://github.com/Dage10

LinkedIn

https://www.linkedin.com/in/david-gelma-corral-92b817114/

---

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps increase visibility and motivates future improvements.

---

> Built with ❤️ using Next.js, Express, PostgreSQL, pgvector and Google Gemini.
