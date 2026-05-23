import 'dotenv/config';
import { Client } from 'pg';

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  console.log('Seeding database using pg client...');

  // Clean existing data (respect FK order)
  await client.query('DELETE FROM "QuoteItem"');
  await client.query('DELETE FROM "QuoteRequest"');
  await client.query('DELETE FROM "Product"');

  const products = [
    ['Correa Dentada de Neopreno AX42', 'correa-dentada-neopreno-ax42', 'Correa industrial de transmisión dentada, de alta resistencia y flexibilidad. Diseñada para poleas de diámetros reducidos.', 2450.0, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', 'Correas'],
    ['Correa en V Sección B B55', 'correa-en-v-seccion-b-b55', 'Correa trapezoidal estándar para transmisión de potencia de uso general en la industria agrícola y manufacturera.', 1890.0, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', 'Correas'],
    ['Manguera de Goma para Aspiración de Fluidos 2"', 'manguera-goma-aspiracion-fluidos-2', 'Manguera reforzada con espiral de acero para succión y descarga de agua, lodos y fluidos químicos ligeros.', 7200.0, 'https://images.unsplash.com/photo-1585713181935-d5f622cc2415?auto=format&fit=crop&w=600&q=80', 'Mangueras'],
    ['Manguera de PVC Cristales Atóxica 1/2"', 'manguera-pvc-cristales-atoxica-1-2', 'Manguera transparente apta para el transporte de alimentos líquidos y agua potable. Flexible y resistente a la presión.', 1200.0, 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&w=600&q=80', 'Mangueras'],
    ['Acople Rápido Kamlock Tipo C 2"', 'acople-rapido-kamlock-tipo-c-2', 'Acople rápido de aluminio con palancas de bronce para conexión segura de mangueras de transferencia de líquidos.', 3100.0, 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80', 'Acoples'],
    ['Acople Elástico de Goma LN-95', 'acople-elastico-goma-ln-95', 'Estrella de acoplamiento elástico de poliuretano para amortiguar vibraciones en ejes de transmisión.', 950.0, 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80', 'Acoples'],
    ['Piso de Goma Moneda Negro 3mm (Metro)', 'piso-de-goma-moneda-negro-3mm', 'Piso de goma antideslizante con diseño de botones. Ideal para zonas de alto tránsito, talleres y rampas.', 5800.0, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', 'Pisos de Goma'],
    ['Piso de Goma Liso para Gimnasio 8mm (Metro)', 'piso-de-goma-liso-gimnasio-8mm', 'Plancha de goma de alta densidad para amortiguación de impactos pesados. Aislante acústico y térmico.', 8500.0, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80', 'Pisos de Goma'],
  ];

  const insertText = `INSERT INTO "Product" ("id", "name", "slug", "description", "price", "imageUrl", "category", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, now(), now()) RETURNING "name"`;

  for (const p of products) {
    const res = await client.query(insertText, p);
    console.log(`Created product: ${res.rows[0].name}`);
  }

  console.log('Database seeding completed successfully!');
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

