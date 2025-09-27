import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  
  const customerPassword = await bcrypt.hash('demo123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'demo@customer.com' },
    update: {},
    create: {
      name: 'Demo Customer',
      email: 'demo@customer.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      isTrusted: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  
  const adminPassword = await bcrypt.hash('demo123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'demo@admin.com' },
    update: {},
    create: {
      name: 'Demo Admin',
      email: 'demo@admin.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isTrusted: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Demo accounts created:');
  console.log(`   Customer: ${customer.email} (${customer.role})`);
  console.log(`   Admin: ${admin.email} (${admin.role})`);

  
  const serviceData = [
    { name: 'Haircut', duration: 30, price: 25.00 },
    { name: 'Hair Wash', duration: 15, price: 10.00 },
    { name: 'Beard Trim', duration: 20, price: 15.00 },
  ];

  const services = [];
  for (const data of serviceData) {
    let service = await prisma.service.findFirst({ where: { name: data.name } });
    if (!service) {
      service = await prisma.service.create({ data });
    }
    services.push(service);
  }

  console.log('✅ Demo services created:', services.length);

  
  const packageData = [
    { name: 'Basic Package', duration: 45, price: 30.00 },
    { name: 'Premium Package', duration: 60, price: 50.00 },
  ];

  const packages = [];
  for (const data of packageData) {
    let packageItem = await prisma.package.findFirst({ where: { name: data.name } });
    if (!packageItem) {
      packageItem = await prisma.package.create({ data });
    }
    packages.push(packageItem);
  }

  console.log('✅ Demo packages created:', packages.length);

  
  if (services.length >= 2 && packages.length >= 1) {
    await prisma.packageService.upsert({
      where: {
        packageId_serviceId: {
          packageId: packages[0].id,
          serviceId: services[0].id,
        },
      },
      update: {},
      create: {
        packageId: packages[0].id,
        serviceId: services[0].id,
      },
    });

    await prisma.packageService.upsert({
      where: {
        packageId_serviceId: {
          packageId: packages[0].id,
          serviceId: services[1].id,
        },
      },
      update: {},
      create: {
        packageId: packages[0].id,
        serviceId: services[1].id,
      },
    });
  }

  console.log('✅ Package services linked');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
