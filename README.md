# Tangoma - Catálogo y Cotizador Industrial

Este es el repositorio del proyecto web para **Tangoma**, una tienda especializada en la venta de productos industriales como correas, mangueras, acoples y pisos de goma. La finalidad principal de la aplicación es mostrar el catálogo de productos y permitir a los clientes armar una lista para solicitar un presupuesto/cotización de manera directa y sencilla.

## 🛠️ Tecnologías Utilizadas

El proyecto está construido con un stack moderno y escalable (T3 Stack / Next.js):

- **[Next.js (App Router)](https://nextjs.org/)**: Framework de React utilizado para toda la aplicación, permitiendo un manejo eficiente del renderizado tanto del lado del servidor (SSR) como generación estática (SSG).
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado fuerte para asegurar la calidad del código.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework de CSS para crear una interfaz limpia, minimalista e industrial.
- **[Prisma ORM](https://www.prisma.io/)**: ORM utilizado para la manipulación y gestión de la base de datos de productos y pedidos.
- **[PostgreSQL / Neon Serverless](https://neon.tech/)**: Base de datos relacional. El proyecto está configurado con un esquema híbrido: 
  - Entorno local: Utiliza el driver estándar `pg` apuntando a un contenedor Docker.
  - Entorno de producción (Vercel): Utiliza `@neondatabase/serverless` para conexiones vía WebSockets a Neon.
- **[Resend](https://resend.com/)**: Plataforma de envío de correos electrónicos transaccionales para recibir los mensajes de contacto y los pedidos de cotizaciones directamente en la casilla de la tienda.

## ⚙️ Método de Creación y Arquitectura

1. **Diseño Visual**: Se optó por una estética "Clásica y Minimalista", priorizando la funcionalidad y velocidad. Se utilizó una paleta con colores institucionales (Azul oscuro, Verde Menta y tonos neutros).
2. **Catálogo de Productos**: La carga inicial fue realizada a través de un script de `seed` (`prisma/seed.ts`), poblado con productos mock de diferentes categorías (correas, acoples, etc.).
3. **Cotizador (Carrito)**: Se desarrolló un flujo donde el cliente selecciona cantidades y añade al carrito. Esto genera una cotización en base de datos.
4. **Notificaciones Automáticas**: Una vez confirmada la cotización o enviado un mensaje de contacto, se dispara una API Route (`/api/cotizaciones` o `/api/contacto`) que procesa la lógica y utiliza el SDK de Resend para entregar un correo con el detalle a la administración (configurado en `.env` mediante `NOTIFICATION_EMAIL`).
5. **Panel de Administración (`/admin`)**: Una sección protegida (o en vías de serlo) que permite realizar el CRUD de los productos del catálogo y visualizar en detalle las solicitudes de presupuesto recibidas.

## 🚀 Cómo Correr el Proyecto Localmente

Para levantar el proyecto en tu entorno de desarrollo, sigue estos pasos:

### 1. Clonar e Instalar
```bash
# Clona el repositorio e instala las dependencias
npm install
```

### 2. Configurar Variables de Entorno
Asegúrate de contar con un archivo `.env` en la raíz del proyecto. Debe contener:
```env
# URL de conexión a tu PostgreSQL local (o tu URL directa de Neon para pruebas)
DATABASE_URL="postgresql://user:password@localhost:5432/tangomadb?schema=public"

# Clave de API de Resend para el envío de correos
RESEND_API_KEY="re_tu_api_key_aqui"

# Correo donde deseas recibir las notificaciones
NOTIFICATION_EMAIL="tu_correo@gmail.com"
```

### 3. Base de Datos
Si usas Docker de manera local, levanta el contenedor de PostgreSQL. Luego ejecuta la sincronización y la carga de datos inicial de Prisma:
```bash
npx prisma db push
npm run build # (Opcional, generará el Prisma Client)
npx prisma db seed
```

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para interactuar con la web.

## 📦 Despliegue (Deploy) en Vercel

El proyecto está completamente preparado para desplegarse en [Vercel](https://vercel.com).
El script de `build` en `package.json` ya incluye el comando `prisma generate && next build` para asegurar la compilación del cliente ORM. Simplemente debes configurar las variables de entorno (`DATABASE_URL`, `DIRECT_URL` en caso de usar Neon, `RESEND_API_KEY` y `NOTIFICATION_EMAIL`) en el dashboard de Vercel y el proyecto detectará automáticamente el driver Serverless de Neon.
