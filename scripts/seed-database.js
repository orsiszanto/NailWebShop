const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'nailshopweb-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'nailshopweb',
});

const db = admin.firestore();

async function seedDatabase() {
  try {
    console.log('🌱 Seed adatok feltöltése...\n');

    // 1. KATEGÓRIÁK feltöltése
    console.log('📁 Kategóriák létrehozása...');
    const categories = [
      { name: 'Körmök', description: 'Műkörmök és modellek', active: true },
      { name: 'Lakk és festékek', description: 'Körömlakk és dekorációs festékek', active: true },
      { name: 'Szerszámok', description: 'Manikűr szerszámok és felszerelések', active: true },
      { name: 'Felszerelések', description: 'UV lámpák, csiszolók és egyéb felszerelések', active: true },
      { name: 'Díszítések', description: 'Csillámok, matricák és díszítő elemek', active: true },
    ];

    const categoryIds = {};
    for (const cat of categories) {
      const docRef = await db.collection('categories').add({
        ...cat,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      });
      categoryIds[cat.name] = docRef.id;
      console.log(`  ✅ ${cat.name} (ID: ${docRef.id})`);
    }

    // 2. TERMÉKEK feltöltése
    console.log('\n📦 Termékek létrehozása...');
    const products = [
      {
        name: 'Akril púder - Fehér',
        description: 'Magas minőségű akril púder fehér szín',
        price: 2500,
        stock: 50,
        categoryId: categoryIds['Körmök'],
        images: ['product-white-acrylic.jpg'],
        active: true,
      },
      {
        name: 'UV Gél - Rózsaszín',
        description: 'UV-vel keményedő géllakk rózsaszínben',
        price: 3200,
        stock: 30,
        categoryId: categoryIds['Lakk és festékek'],
        images: ['product-pink-gel.jpg'],
        active: true,
      },
      {
        name: 'Manikűr csiszoló',
        description: 'Elektromos manikűr csiszoló 30000 fordulat/perc',
        price: 12500,
        stock: 15,
        categoryId: categoryIds['Szerszámok'],
        images: ['product-drill.jpg'],
        active: true,
      },
      {
        name: 'LED UV lámpa - 48W',
        description: '48W USB-s LED UV lámpa körmök szárítésához',
        price: 8900,
        stock: 20,
        categoryId: categoryIds['Felszerelések'],
        images: ['product-uv-lamp.jpg'],
        active: true,
      },
      {
        name: 'Csillám szett',
        description: '50+ féle szín csillám és dekoráció csomag',
        price: 4500,
        stock: 40,
        categoryId: categoryIds['Díszítések'],
        images: ['product-glitter-set.jpg'],
        active: true,
      },
      {
        name: 'Köröm tip csomag - M',
        description: '100 db-os műköröm tip szett, M méret',
        price: 1800,
        stock: 100,
        categoryId: categoryIds['Körmök'],
        images: ['product-nail-tips.jpg'],
        active: true,
      },
    ];

    const productIds = [];
    for (const prod of products) {
      const docRef = await db.collection('products').add({
        ...prod,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      });
      productIds.push(docRef.id);
      console.log(`  ✅ ${prod.name} (ID: ${docRef.id})`);
    }

    // 3. FELHASZNÁLÓK feltöltése
    console.log('\n👥 Felhasználók létrehozása...');
    const users = [
      {
        email: 'admin@nailshop.hu',
        name: 'Admin Felhasználó',
        role: 'admin',
        phone: '+36701234567',
        address: 'Budapest, Admin utca 1.',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        email: 'user@example.com',
        name: 'Test Felhasználó',
        role: 'customer',
        phone: '+36702345678',
        address: 'Budapest, Vásárló utca 2.',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
    ];

    const userIds = [];
    for (const user of users) {
      const docRef = await db.collection('users').add(user);
      userIds.push(docRef.id);
      console.log(`  ✅ ${user.name} (${user.email})`);
    }

    // 4. RENDELÉSEK feltöltése
    console.log('\n📋 Rendelések létrehozása...');
    const orders = [
      {
        userId: userIds[1], // customer
        totalPrice: 3200,
        status: 'pending',
        shippingAddress: 'Budapest, Szállítási utca 3.',
        notes: 'Kérlek óvatosan csomagolj',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        userId: userIds[1], // customer
        totalPrice: 8900,
        status: 'completed',
        shippingAddress: 'Budapest, Szállítási utca 3.',
        notes: '',
        createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        updatedAt: admin.firestore.Timestamp.now(),
      },
    ];

    const orderIds = [];
    for (let i = 0; i < orders.length; i++) {
      const docRef = await db.collection('orders').add(orders[i]);
      orderIds.push(docRef.id);

      // 5. RENDELÉSI TÉTELEK feltöltése
      const items = [
        {
          productId: productIds[1], // UV Gél - Rózsaszín
          quantity: 1,
          unitPrice: 3200,
          subtotal: 3200,
          createdAt: admin.firestore.Timestamp.now(),
        },
      ];

      if (i === 1) {
        items.push({
          productId: productIds[3], // LED UV lámpa
          quantity: 1,
          unitPrice: 8900,
          subtotal: 8900,
          createdAt: admin.firestore.Timestamp.now(),
        });
      }

      for (const item of items) {
        await db.collection('orders').doc(docRef.id).collection('items').add(item);
      }

      console.log(`  ✅ Rendelés #${i + 1} (ID: ${docRef.id}) - ${orders[i].totalPrice} Ft`);
    }

    console.log('\n✅ Seed adatok sikeresen feltöltve!');
    console.log(`
📊 Összefoglalás:
  - Kategóriák: ${Object.keys(categoryIds).length}
  - Termékek: ${productIds.length}
  - Felhasználók: ${userIds.length}
  - Rendelések: ${orderIds.length}
  
🔑 Admin: admin@nailshop.hu
🔑 Felhasználó: user@example.com
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Hiba a seed adatok feltöltésekor:', error);
    process.exit(1);
  }
}

seedDatabase();
