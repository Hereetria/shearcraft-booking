const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  console.log('Testing package booking counts...');
  
  const packages = await prisma.package.findMany({
    include: {
      _count: {
        select: {
          bookings: true
        }
      }
    }
  });
  
  console.log('Packages with booking counts:');
  packages.forEach(pkg => {
    console.log(`- ${pkg.name}: ${pkg._count?.bookings || 0} bookings`);
  });
  
  const bookings = await prisma.booking.findMany({
    select: {
      id: true,
      packageId: true,
      package: {
        select: {
          name: true
        }
      }
    }
  });
  
  console.log('\nAll bookings with package references:');
  bookings.forEach(booking => {
    console.log(`- Booking ${booking.id}: Package ${booking.package?.name || 'None'}`);
  });
  
  await prisma.$disconnect();
}

test().catch(console.error);

