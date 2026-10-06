// Datos de contacto. Lo que está vacío figura en PENDIENTES.md.
export const WHATSAPP = ''; // formato internacional sin "+": 549376xxxxxxx

export function linkWhatsApp(texto: string) {
  const q = encodeURIComponent(texto);
  return WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${q}` : `https://wa.me/?text=${q}`;
}
