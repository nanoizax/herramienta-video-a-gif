# Convertir Video a GIF

Convierte un fragmento de video en GIF liviano. Gratis y sin que el archivo salga de tu equipo.

Herramienta gratuita y de código abierto de [SonhoLab](https://sonholab.com). Corre **100 % en el navegador**: los archivos no se suben a ningún servidor.

> Licencia: **GPL-2.0-or-later** · Autor: Leandro Manuel Perez Montañana · Idiomas de la interfaz: español, inglés, francés, portugués (BR), alemán, hindi, indonesio y ruso.

## Qué hace

Muchas veces no hace falta mandar el video entero: alcanza con esos tres segundos. Aquí eliges el inicio y el fin del fragmento y obtienes un GIF liviano, listo para pegar en un chat o un correo. Todo ocurre dentro de tu navegador: el video no se sube a ningún servidor ni necesitas registrarte.

**Cuándo te sirve:**

- Mostrarle a un cliente por WhatsApp cómo se usa una función de la app, sin que tenga que abrir un video.
- Poner en la ficha de un producto un GIF que muestre cómo se abre o cómo se mueve, sin subir un video pesado a la tienda.
- Sacar de una grabación de clase los diez segundos del experimento y pegarlos en el grupo del curso o en una presentación.

## Cómo se usa

1. **Elige el video.** Arrastra el archivo al recuadro o haz clic para buscarlo en tu equipo. Sirve con los formatos de video más comunes, como MP4 o WebM.
2. **Marca inicio y fin.** Mueve los controles hasta el tramo que quieres convertir. Mientras más corto sea el fragmento, más liviano queda el GIF.
3. **Convierte y descarga.** Presiona convertir, espera unos segundos y descarga el GIF. La primera vez tarda más porque se baja el motor de video; después queda guardado.

## Qué necesita para funcionar

### Para instalarla y compilarla

- [Node.js](https://nodejs.org) 18 o superior (probado con Node 22) y npm.
- Conexión a internet **solo** durante `npm install`. Una vez compilada, la herramienta no pide nada a internet.

### Complementos específicos de esta herramienta

- **ffmpeg.wasm (≈30 MB)**: viene como dependencia de npm (`@ffmpeg/core`) y se carga solo cuando el usuario procesa un video. No tienes que instalar ffmpeg en tu equipo ni en tu servidor.

### En el navegador de quien la usa

- WebAssembly. Un video grande consume memoria RAM del navegador: en equipos modestos conviene limitar el tamaño del archivo.
- El servidor que publique la herramienta debe entregar los archivos `.wasm` con el tipo `application/wasm`.

## Instalación

```bash
git clone https://github.com/nanoizax/herramienta-video-a-gif.git
cd herramienta-video-a-gif
npm install
npm run dev         # servidor de desarrollo en http://localhost:5173
```

Para publicarla:

```bash
npm run build       # genera la carpeta dist/
npm run preview     # probar la versión compilada
```

Esta herramienta **no tiene servidor propio**: todo ocurre en el navegador de quien la usa. Basta con publicar la carpeta `dist/` en cualquier hosting estático (GitHub Pages, Netlify, Cloudflare Pages, Nginx, Apache...).

## Cómo está organizado

```
src/pages/tools/   La página de la herramienta (interfaz y lógica de pantalla)
src/lib/tools/     La lógica de la herramienta, separada de la interfaz
src/components/    Piezas compartidas (zona de arrastre de archivos, botón)
src/locales/       Textos en 8 idiomas (esta herramienta solamente)
src/i18n.ts        Configuración de idiomas
```

## Cómo meterla en tu propia plataforma

1. **Como página aparte:** publica `dist/` en una ruta de tu sitio, por ejemplo `/herramientas/video-a-gif/`. Si la sirves en una subcarpeta, define `base` en `vite.config.ts`.
2. **Dentro de tu aplicación React:** copia `src/pages/tools/*Page.tsx`, `src/lib/tools/` y `src/components/` a tu proyecto, instala las mismas dependencias de `package.json` y renderiza la página donde quieras.
3. **Con tu diseño:** el marco de la página (título, ayuda, preguntas frecuentes) está en `src/components/tools/ToolPageLayout.tsx` y es intencionalmente simple. Cámbialo por tu cabecera, tu pie y tus estilos; solo necesita pintar `children`.
4. **Con tu analítica:** `src/lib/hitCounter.ts` no hace nada. Si quieres medir el uso, conéctalo ahí a tu propia herramienta.

## Privacidad

Todo el procesamiento ocurre en el navegador. Esta copia no incluye analítica, cookies, contadores ni llamadas a ningún servidor propio. Los archivos del usuario no salen de su equipo.

## Preguntas frecuentes

**¿Qué pasa con mi video? ¿Se sube a algún servidor?**  
No. El video se abre y se procesa dentro de tu navegador, en tu propio equipo. No viaja a ningún servidor nuestro ni de terceros, así que no queda copia en ninguna parte. Si cierras la pestaña, no queda nada.

**¿Es gratis? ¿Hay límite de videos o de duración?**  
Es gratis y no hay tope de conversiones: puedes hacer las que necesites. Tampoco pedimos registro ni ponemos marca de agua. El único límite real es la memoria de tu equipo, porque el trabajo lo hace tu navegador.

**¿Por qué la primera conversión tarda tanto?**  
Porque la herramienta necesita un motor de video que se descarga la primera vez que la usas. Son unos segundos extra, una sola vez: después queda guardado en el navegador y las conversiones siguientes arrancan enseguida.

**¿Necesito instalar algo o crear una cuenta?**  
No hace falta instalar ningún programa ni extensión, y tampoco hay que registrarse. Funciona con el navegador que ya tienes en la computadora o el teléfono; en móviles conviene usar fragmentos cortos para no quedarse sin memoria.

**¿Por qué el GIF pesa más que el video original?**  
Es normal: el formato GIF comprime mucho peor que el video y solo maneja 256 colores, por eso se ve con menos detalle. Para que no engorde, quédate con un tramo corto: unos segundos alcanzan para mostrar la idea. El GIF tampoco lleva sonido.

## Licencia

Este proyecto se publica bajo la licencia **GPL-2.0-or-later**. El texto completo está en [LICENSE](LICENSE).

**Por qué GPL:** esta herramienta incluye `@ffmpeg/core` (ffmpeg compilado a WebAssembly), que se distribuye bajo GPL-2.0 o posterior. Si la publicas en tu sitio, estás distribuyendo ese binario y debes ofrecer también el código fuente correspondiente y mantener esta misma licencia. Es una obligación de la GPL, no una opción.

Las dependencias tienen sus propias licencias, listadas en [THIRD-PARTY.md](THIRD-PARTY.md).

## Más herramientas gratuitas

Esta es una de las herramientas gratuitas de SonhoLab. Encuentra el resto, cada una con su repositorio, en https://sonholab.com/es/herramientas.

---

Hecho por Leandro Manuel Perez Montañana.
