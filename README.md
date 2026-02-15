# Portafolio de Darwin Cedeño

Este es el repositorio del portafolio de Darwin Cedeño, desarrollado con Astro.

Visita mi portafolio en [darwincd.com](https://darwincd.com) para conocer más sobre mi trabajo.

## Blog evergreen (publicación automática)

El proyecto incluye un flujo de **contenido evergreen** (artículos que no caducan en el tiempo) sobre IA y programación, generado con la API de Gemini e imágenes de [Pollinations.ai](https://pollinations.ai).

- **Script local:** `npm run evergreen` — genera un post y lo guarda en `src/content/blog/`. Necesitas `GEMINI_API_KEY` en el entorno.
- **GitHub Action:** El workflow `.github/workflows/evergreen-blog.yml` se ejecuta **cada día a las 9:00 (hora España)** y publica un nuevo post automáticamente.

### Configuración en GitHub

1. Obtén una API key en [Google AI Studio](https://aistudio.google.com/apikey).
2. En tu repositorio: **Settings → Secrets and variables → Actions**.
3. Crea un secret llamado `GEMINI_API_KEY` con tu clave.

Si el workflow genera el post pero **falla al hacer push** con `Permission denied` (403):

4. Crea un **Personal Access Token (PAT)** en GitHub: **Settings (tu cuenta) → Developer settings → Personal access tokens**. Dale permiso **repo** (classic) o **Contents: Read and write** (fine-grained) para este repositorio.
5. Añade un secret llamado **`REPO_TOKEN`** con el valor del PAT. El workflow usará este token para hacer push y evitará el 403.