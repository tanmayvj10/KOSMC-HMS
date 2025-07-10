import pool from './db.js';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

const populateData = async () => {
  const conn = await pool.getConnection();
  try {
    await conn.query(`USE \`${process.env.DB_NAME}\`;`);

    // Create one hotel
    const hotelId = uuidv4();
    await conn.query(`
      INSERT INTO Hotels (HotelID, HotelName, Location, Email, Phone, APIEndpoint, APIKey)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      hotelId,
      faker.company.name() + ' Hotel',
      faker.location.city(),
      faker.internet.email(),
      faker.phone.number('+91-##########').slice(0, 15),
      faker.internet.url(),
      faker.string.alphanumeric(32)
    ]);

    // Add 5 guests
    const guestIds = [];
    for (let i = 0; i < 5; i++) {
      const guestData = [
        hotelId,
        faker.person.firstName(),
        faker.person.lastName(),
        faker.internet.email(),
        faker.phone.number('+91-##########').slice(0, 15),
        faker.location.streetAddress(),
        faker.string.uuid(), // Identification
      ];
      const [res] = await conn.query(`
        INSERT INTO Guests (HotelID, FirstName, LastName, Email, PhoneNumber, Address, Identification)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, guestData);
      guestIds.push(res.insertId);
    }

    // Add 3 rooms
    const roomIds = [];
    for (let i = 0; i < 3; i++) {
      const [res] = await conn.query(`
        INSERT INTO Rooms (HotelID, RoomNumber, RoomType, Floor, Capacity, PricePerNight, Amenities)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        hotelId,
        `10${i}`,
        faker.helpers.arrayElement(['Single', 'Double', 'Suite']),
        `Floor ${i + 1}`,
        faker.number.int({ min: 1, max: 4 }),
        faker.number.float({ min: 100, max: 500, precision: 0.01 }),
        'WiFi+TV+AC'
      ]);
      roomIds.push(res.insertId);
    }

    // Add 2 reservations
    const reservationIds = [];
    for (let i = 0; i < 2; i++) {
      const reservationId = uuidv4();
      const guestId = guestIds[i];
      const checkIn = faker.date.soon();
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + faker.number.int({ min: 1, max: 5 }));

      await conn.query(`
        INSERT INTO Reservations (ReservationID, HotelID, GuestID, RoomIDs, CheckInDate, CheckOutDate, NumberOfGuests, Status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        reservationId,
        hotelId,
        guestId,
        JSON.stringify([roomIds[i]]),
        checkIn,
        checkOut,
        faker.number.int({ min: 1, max: 3 }),
        'Confirmed'
      ]);
      reservationIds.push(reservationId);
    }

    // Add 2 invoices
    for (let i = 0; i < 2; i++) {
      await conn.query(`
        INSERT INTO Invoices (InvoiceID, GuestID, ReservationID, HotelID, TotalAmount, TaxAmount, DiscountAmount, FinalAmount, PaymentStatus)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(),
        guestIds[i],
        reservationIds[i],
        hotelId,
        300,
        30,
        20,
        310,
        'Paid'
      ]);
    }

    // Add 3 staff members
    for (let i = 0; i < 3; i++) {
      await conn.query(`
        INSERT INTO Staff (HotelID, FirstName, LastName, Email, PhoneNumber, Role, JoinDate, Salary, Address, Shift)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        hotelId,
        faker.person.firstName(),
        faker.person.lastName(),
        faker.internet.email(),
        faker.phone.number('+91-##########').slice(0, 15),
        faker.helpers.arrayElement(['Manager', 'Receptionist', 'Cleaner']),
        faker.date.past(),
        faker.number.float({ min: 20000, max: 50000 }),
        faker.location.streetAddress(),
        faker.helpers.arrayElement(['Morning', 'Evening', 'Night'])
      ]);
    }

    // Add 2 activity services
    for (let i = 0; i < 2; i++) {
      await conn.query(`
        INSERT INTO ActivityServiceDetails (HotelID, ActivityName, ProviderName, DurationInMinutes)
        VALUES (?, ?, ?, ?)
      `, [
        hotelId,
        faker.helpers.arrayElement(['Spa', 'City Tour']),
        faker.company.name(),
        faker.number.int({ min: 30, max: 120 })
      ]);
    }

    // Add 3 restaurant service items
    for (let i = 0; i < 3; i++) {
      await conn.query(`
        INSERT INTO RestaurantServiceDetails (HotelID, DishName, Quantity, PricePerItemHALF, PricePerItem)
        VALUES (?, ?, ?, ?, ?)
      `, [
        hotelId,
        faker.commerce.productName(),
        faker.number.int({ min: 1, max: 20 }),
        faker.number.float({ min: 50, max: 150 }),
        faker.number.float({ min: 100, max: 300 })
      ]);
    }

    // Add 2 room service entries
    for (let i = 0; i < 2; i++) {
      await conn.query(`
        INSERT INTO RoomServiceDetails (HotelID, ItemName, Quantity, SpecialInstructions)
        VALUES (?, ?, ?, ?)
      `, [
        hotelId,
        faker.commerce.product(),
        faker.number.int({ min: 1, max: 3 }),
        faker.lorem.sentence()
      ]);
    }

    // Add 2 hotel service records
    for (let i = 0; i < 2; i++) {
      await conn.query(`
        INSERT INTO HotelServices (HotelID, GuestID, ReservationID, ServiceType, ServiceDate, Amount, Description, Status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        hotelId,
        guestIds[i],
        reservationIds[i],
        faker.helpers.arrayElement(['Spa', 'Room Service', 'Restaurant']),
        faker.date.recent(),
        faker.number.float({ min: 100, max: 500 }),
        faker.lorem.sentence(),
        'Completed'
      ]);
    }

    console.log('✅ Sample data populated successfully!');
  } catch (error) {
    console.error('❌ Error populating data:', error.message);
  } finally {
    conn.release();
  }
};

populateData();
