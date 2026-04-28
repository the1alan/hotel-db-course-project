require("dotenv").config({ path: "../.env" });

const bcrypt = require("bcryptjs");
const db = require("./app/models");

async function seed() {
  await db.sequelize.sync({ force: true });

  const roomTypes = await db.roomTypes.bulkCreate([
    { name: "Standard", description: "Стандартный номер", base_price: 3000, capacity: 2 },
    { name: "Deluxe", description: "Улучшенный номер", base_price: 5000, capacity: 3 },
    { name: "Suite", description: "Люкс", base_price: 9000, capacity: 4 },
  ]);

  const rooms = await db.rooms.bulkCreate(
    Array.from({ length: 10 }, (_, i) => ({
      number: String(101 + i),
      floor: Math.floor(i / 5) + 1,
      status: "available",
      roomTypeId: roomTypes[i % roomTypes.length].id,
    }))
  );

  const guests = await db.guests.bulkCreate([
    { first_name: "Ivan", last_name: "Ivanov", phone: "+70000000001", email: "g1@example.com", passport_number: "AA1001" },
    { first_name: "Petr", last_name: "Petrov", phone: "+70000000002", email: "g2@example.com", passport_number: "AA1002" },
    { first_name: "Olga", last_name: "Sidorova", phone: "+70000000003", email: "g3@example.com", passport_number: "AA1003" },
    { first_name: "Maria", last_name: "Smirnova", phone: "+70000000004", email: "g4@example.com", passport_number: "AA1004" },
    { first_name: "Alex", last_name: "Kuznetsov", phone: "+70000000005", email: "g5@example.com", passport_number: "AA1005" },
    { first_name: "Nina", last_name: "Volkova", phone: "+70000000006", email: "g6@example.com", passport_number: "AA1006" },
    { first_name: "Sergey", last_name: "Orlov", phone: "+70000000007", email: "g7@example.com", passport_number: "AA1007" },
    { first_name: "Anna", last_name: "Belova", phone: "+70000000008", email: "g8@example.com", passport_number: "AA1008" },
  ]);

  const services = await db.services.bulkCreate([
    { name: "Breakfast", description: "Шведский стол", price: 700 },
    { name: "Laundry", description: "Прачечная", price: 500 },
    { name: "Transfer", description: "Трансфер", price: 1500 },
    { name: "Spa", description: "SPA", price: 2500 },
    { name: "Parking", description: "Парковка", price: 400 },
  ]);

  const bookings = await db.bookings.bulkCreate(
    Array.from({ length: 10 }, (_, i) => ({
      guestId: guests[i % guests.length].id,
      roomId: rooms[i % rooms.length].id,
      check_in_date: `2026-04-${String(1 + i).padStart(2, "0")}`,
      check_out_date: `2026-04-${String(2 + i).padStart(2, "0")}`,
      status: i % 3 === 0 ? "confirmed" : "checked_out",
      total_price: 3000 + i * 500,
    }))
  );

  await db.payments.bulkCreate(
    Array.from({ length: 8 }, (_, i) => ({
      bookingId: bookings[i].id,
      amount: 2500 + i * 300,
      payment_date: new Date(Date.UTC(2026, 3, i + 1)),
      method: i % 2 === 0 ? "card" : "cash",
      status: "paid",
    }))
  );

  await db.bookingServices.bulkCreate(
    bookings.slice(0, 8).map((booking, i) => ({
      bookingId: booking.id,
      serviceId: services[i % services.length].id,
      quantity: 1 + (i % 2),
      total_price: Number(services[i % services.length].price) * (1 + (i % 2)),
    }))
  );

  await db.staff.bulkCreate([
    { first_name: "Admin", last_name: "One", position: "Admin", email: "admin_staff@example.com", role: "admin", password_hash: await bcrypt.hash("admin123", 10) },
    { first_name: "Manager", last_name: "One", position: "Manager", email: "manager_staff@example.com", role: "manager", password_hash: await bcrypt.hash("manager123", 10) },
    { first_name: "Reception", last_name: "One", position: "Receptionist", email: "reception_staff@example.com", role: "receptionist", password_hash: await bcrypt.hash("receptionist123", 10) },
  ]);

  await db.users.bulkCreate([
    { email: "admin@example.com", full_name: "System Admin", role: "admin", password_hash: await bcrypt.hash("admin123", 10) },
    { email: "manager@example.com", full_name: "Hotel Manager", role: "manager", password_hash: await bcrypt.hash("manager123", 10) },
    { email: "receptionist@example.com", full_name: "Front Desk", role: "receptionist", password_hash: await bcrypt.hash("receptionist123", 10) },
  ]);

  console.log("Seed completed successfully.");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.sequelize.close();
  });
