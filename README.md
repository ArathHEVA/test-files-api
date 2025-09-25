# Consultora-file-api

API REST para **subida y gestión de archivos** con autenticación JWT, MongoDB, y soporte para S3.
Incluye endpoints de **login/registro**, **olvido de contraseña** (simulado vía MailDev), **subida/descarga**,
**gestor de archivos** (renombrar, eliminar, obtener URL) y un **buscador** (stub de Unsplash).
Documentación con Swagger.

## Requisitos
- Node.js >= 18
- Docker & docker-compose (opcional)
- AWS Credentials

## Variables de entorno
Ver `.env.example`.

## Desarrollo local
```bash
cp .env.example .env
npm i
npm run dev
```
Swagger en: `http://localhost:3000/docs`

## Docker (app + Mongo + MailDev)
```bash
docker compose up --build
```
- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- MailDev UI: http://localhost:1080

