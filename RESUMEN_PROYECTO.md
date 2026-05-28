# Resumen del Proyecto

## Nombre

**Presskit Generator**

## Descripción

Aplicación web para crear presskits digitales para artistas independientes. Permite capturar información del artista, imágenes, enlaces, biografías y material visual para generar una experiencia tipo dossier/EPK con vista previa en vivo y exportación.

## Objetivo principal

Centralizar en un solo editor la construcción de un presskit profesional, con una interfaz visual que ayuda a organizar:

- Portada
- Datos del artista
- Reconocimientos y métricas
- Biografía generada o editada manualmente
- Hitos artísticos
- Releases / videos
- Enlaces a redes y plataformas
- Galería de imágenes
- Artículos de prensa
- Contacto profesional
- Tema visual y tipografías

## Stack tecnológico

- **React** para la interfaz.
- **Vite** como entorno de desarrollo y build.
- **Firebase** para almacenamiento y backend.
- **Tailwind CSS** para estilos.
- **React PDF** para exportación de documentos.
- **Gemini / Google Generative AI** para asistencia de escritura de biografía.
- **react-pageflip** para experiencia tipo libro en el preview.

## Estructura funcional

### Editor

El editor principal permite completar los pasos del presskit y subir archivos. Incluye generación asistida por IA para biografías y carga de imágenes por secciones.

### Preview en vivo

El preview muestra el presskit como una experiencia visual con páginas navegables. Las secciones se renderizan dinámicamente según el contenido cargado por el usuario.

### Exportación

El proyecto contempla salida en formato PDF y una vista previa visual del material generado.

## Funcionalidades destacadas

- Generación de biografías con IA.
- Carga de imágenes para portada, galería, reconocimientos, links y artículos de prensa.
- Vista previa tipo libro con navegación por páginas.
- Diseño responsivo para desktop y mobile.
- Soporte para enlaces externos a plataformas musicales y redes sociales.
- Personalización de tema visual y tipografía.
- Información de contacto profesional para booking o prensa.

## Estado actual del proyecto

El proyecto ya tiene una base funcional avanzada. Actualmente se está afinando el layout del preview, especialmente en la sección de datos del artista, y se agregó soporte para artículos de prensa como páginas individuales dentro del presskit.

## Configuración necesaria

Para ejecutar el proyecto localmente se requiere:

1. Un archivo `.env` basado en `.env.example`.
2. Variables de Firebase configuradas.
3. `VITE_GEMINI_API_KEY` si se quiere usar generación de biografía con IA.

## Scripts disponibles

- `npm run dev`: inicia el entorno local.
- `npm run build`: genera el build de producción.
- `npm run preview`: ejecuta la vista previa del build.
- `npm run lint`: revisa el código con ESLint.

## Observación final

Es una herramienta pensada para artistas que necesitan presentar su propuesta de forma profesional, visual y adaptable a medios, promotores, festivales y prensa.
