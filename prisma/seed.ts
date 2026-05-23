import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with industrial products...');

  // Clean existing data
  await prisma.quoteItem.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.product.deleteMany();

  const products = [
    // Correas (Belts)
    {
      name: 'Correa Dentada de Neopreno AX42',
      slug: 'correa-dentada-neopreno-ax42',
      description: 'Correa industrial de transmisión dentada, de alta resistencia y flexibilidad. Diseñada para poleas de diámetros reducidos.',
      price: 2450.00,
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      category: 'Correas',
    },
    {
      name: 'Correa en V Sección B B55',
      slug: 'correa-en-v-seccion-b-b55',
      description: 'Correa trapezoidal estándar para transmisión de potencia de uso general en la industria agrícola y manufacturera.',
      price: 1890.00,
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      category: 'Correas',
    },

    // Mangueras (Hoses)
    {
      name: 'Manguera de Goma para Aspiración de Fluidos 2"',
      slug: 'manguera-goma-aspiracion-fluidos-2',
      description: 'Manguera reforzada con espiral de acero para succión y descarga de agua, lodos y fluidos químicos ligeros.',
      price: 7200.00,
      imageUrl: 'https://images.unsplash.com/photo-1585713181935-d5f622cc2415?auto=format&fit=crop&w=600&q=80',
      category: 'Mangueras',
    },
    {
      name: 'Manguera de PVC Cristales Atóxica 1/2"',
      slug: 'manguera-pvc-cristales-atoxica-1-2',
      description: 'Manguera transparente apta para el transporte de alimentos líquidos y agua potable. Flexible y resistente a la presión.',
      price: 1200.00,
      imageUrl: 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&w=600&q=80',
      category: 'Mangueras',
    },

    // Acoples (Couplings)
    {
      name: 'Acople Rápido Kamlock Tipo C 2"',
      slug: 'acople-rapido-kamlock-tipo-c-2',
      description: 'Acople rápido de aluminio con palancas de bronce para conexión segura de mangueras de transferencia de líquidos.',
      price: 3100.00,
      imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80',
      category: 'Acoples',
    },
    {
      name: 'Acople Elástico de Goma LN-95',
      slug: 'acople-elastico-goma-ln-95',
      description: 'Estrella de acoplamiento elástico de poliuretano para amortiguar vibraciones en ejes de transmisión.',
      price: 950.00,
      imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
      category: 'Acoples',
    },

    // Pisos de Goma (Rubber Flooring)
    {
      name: 'Piso de Goma Moneda Negro 3mm (Metro)',
      slug: 'piso-de-goma-moneda-negro-3mm',
      description: 'Piso de goma antideslizante con diseño de botones. Ideal para zonas de alto tránsito, talleres y rampas.',
      price: 5800.00,
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      category: 'Pisos de Goma',
    },
    {
      name: 'Piso de Goma Liso para Gimnasio 8mm (Metro)',
      slug: 'piso-de-goma-liso-gimnasio-8mm',
      description: 'Plancha de goma de alta densidad para amortiguación de impactos pesados. Aislante acústico y térmico.',
      price: 8500.00,
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
      category: 'Pisos de Goma',
    },
  ];

  for (const item of products) {
    const product = await prisma.product.create({
      data: item,
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

