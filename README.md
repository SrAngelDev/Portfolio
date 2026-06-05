# Portfolio — srangeldev.es

Portfolio personal de Ángel Sánchez. Astro + Tailwind, paleta clara en gama azul, despliegue automático en GHCR + Watchtower detrás de un túnel Cloudflare.

> Live: **https://srangeldev.es**

---

## Stack

- **Astro 5** — sitio estático.
- **Tailwind CSS 4** — vía `@tailwindcss/vite`, sistema de diseño en `src/styles/global.css`.
- **Nginx alpine** — sirve `dist/` en producción.
- **GitHub Actions + GHCR** — build & push automático.
- **Watchtower** — pull automático en el servidor.
- **Cloudflare Tunnel** — expone el servicio sin abrir puertos.

---

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve el build localmente
```

---

## Docker local

```bash
docker build -t portfolio:local .
docker run --rm -p 8080:80 portfolio:local
# abre http://localhost:8080
```

El `Dockerfile` es multi-stage: `node:20-alpine` para construir, `nginx:1.27-alpine` para servir. `nginx.conf` aporta gzip, cabeceras de seguridad, cache de 1 año para `/_astro/*` (assets con hash) y `no-store` para HTML.

---

## CI/CD — GitHub Actions → GHCR

El workflow `.github/workflows/deploy.yml`:

1. Se dispara en `push` a `main` (o manualmente).
2. Construye la imagen multi-stage.
3. La publica en `ghcr.io/<owner>/<repo>` con dos tags:
   - `latest`
   - `${{ github.sha }}` (inmutable por commit)
4. Usa caché de Actions (`type=gha`) para acelerar.

El nombre de la imagen se normaliza a minúsculas (`tr '[:upper:]' '[:lower:]'`) para cumplir el requisito de GHCR.

### Visibilidad del paquete

Si quieres `pull` sin autenticar desde Watchtower:

1. GitHub → perfil → **Packages**.
2. Selecciona el paquete del repo.
3. **Package settings → Change visibility → Public**.

Si lo dejas privado, necesitas `docker login ghcr.io` en el servidor antes de que Watchtower pueda actualizar.

---

## Despliegue en casa

En tu `docker-compose.yml` del servidor pega lo que hay en `docker-compose.snippet.yml`. Servicios incluidos:

- **cloudflared** — túnel hacia `srangeldev.es`.
- **portfolio** — `ghcr.io/<owner>/<repo>:latest`, expuesto solo en la red interna.
- **watchtower** — con `WATCHTOWER_LABEL_ENABLE=true` para actualizar solo los contenedores con la etiqueta `com.centurylinklabs.watchtower.enable=true`.

Variables necesarias en `.env`:

```env
TUNNEL_TOKEN=tu_token_de_cloudflare
```

Configura el túnel en el dashboard de Cloudflare apuntando `srangeldev.es` → `http://portfolio:80` (red interna `web` del compose).

---

## Sistema de diseño

Tokens en `src/styles/global.css` dentro de `@theme`. Paleta única en gama azul, claridad alta:

| Token                 | Valor      | Uso                  |
| --------------------- | ---------- | -------------------- |
| `--color-bg`          | `#F6FAFD`  | Fondo principal      |
| `--color-surface`     | `#FFFFFF`  | Cards                |
| `--color-text`        | `#0A1931`  | Texto principal      |
| `--color-accent`      | `#1A3D63`  | Botones, énfasis     |
| `--color-accent-2`    | `#4A7FA7`  | Hover, decoraciones  |
| `--color-accent-soft` | `#B3CFE5`  | Blobs ambientales    |

No hay variante oscura: el portfolio es **light-only por diseño**.

---

## Estructura

```
src/
  components/     Navbar, Footer, ProjectCard, TechStack, TerminalConsole
  layouts/        Layout.astro
  pages/          index, sobre-mi, 404, proyectos/*
  styles/         global.css
  scripts/        scroll.js
public/           favicon, og, cv.pdf
```
