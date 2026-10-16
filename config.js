// ============================================================
//  CONFIGURACIÓN DEL FUNNEL "¿Por qué se aleja?" — Tovlov / Malka
//  Lo único que tienes que editar para conectar pagos, leads y video.
// ============================================================
window.FUNNEL = {
  // --- Pagos (Klaze + Stripe) ---
  // URL de tu Klaze en producción, sin "/" al final. Ej: "https://klaze-three.vercel.app"
  // Mientras esté vacío, los botones de compra muestran un aviso en lugar de cobrar.
  klazeUrl: "",

  // Slugs de los cursos tal cual los creas en el /admin de Klaze.
  products: {
    front: "reto-calma-magnetica",     // Reto 21 días (producto de entrada)
    bump: "kit-sos-antes-de-escribirle", // Order bump
    upsell: "mujer-magnetica",         // Curso Mujer Magnética 12 semanas
    downsell: "libro-mujer-magnetica", // Libro (PDF + EPUB)
  },

  // Precios que se MUESTRAN en las páginas (MXN). El cobro real usa el precio
  // guardado en Klaze, así que mantenlos iguales en los dos lados.
  prices: { front: 197, bump: 97, upsell: 397, downsell: 147 },
  // Precio público del curso y del libro (para mostrar el ahorro real del upsell).
  publicPrices: { upsell: 529, downsell: 349 },

  // --- Leads ---
  // Webhook que recibe nombre/correo/WhatsApp + resultado del quiz (GHL, Make, n8n…).
  leadWebhook: "",

  // --- Tracking ---
  metaPixelId: "",

  // --- Video ---
  // ID del video de Vimeo de la VSL (solo el número). Vacío = muestra un póster.
  vslVimeoId: "",
};
