import pool from './db.js';
const createTables = async () => {
  try {
    const conn = await pool.getConnection();
    await conn.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\`;`);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await conn.query(`USE \`${process.env.DB_NAME}\`;`);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Hotels (
        HotelID CHAR(36) PRIMARY KEY,
        HotelName VARCHAR(100),
        Location VARCHAR(150),
        Email VARCHAR(100),
        Phone VARCHAR(20),
        APIEndpoint VARCHAR(255),
        APIKey VARCHAR(255),
        LastSyncedAt DATETIME,
        IsAPIActive BOOLEAN DEFAULT TRUE,
        PaymentCredentials VARCHAR(255),
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        StaffAutomation BOOLEAN DEFAULT FALSE
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Guests (
        GuestID INT PRIMARY KEY AUTO_INCREMENT,
        HotelID CHAR(36),
        FirstName VARCHAR(100),
        LastName VARCHAR(100),
        Email VARCHAR(100),
        PhoneNumber VARCHAR(15),
        Address TEXT,
        Identification TEXT,
        isActive BOOLEAN DEFAULT TRUE,
        visits INT DEFAULT 1,
        FOREIGN KEY (HotelID) REFERENCES Hotels(HotelID)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Rooms (
        RoomID INT PRIMARY KEY AUTO_INCREMENT,
        HotelID CHAR(36),
        RoomNumber VARCHAR(20),
        RoomType VARCHAR(50),
        Floor VARCHAR(20),
        Capacity INT,
        PricePerNight DECIMAL(10,2),
        Amenities TEXT,
        IsAvailable VARCHAR(10) DEFAULT 'Available',
        FOREIGN KEY (HotelID) REFERENCES Hotels(HotelID)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Reservations (
        ReservationID CHAR(36) PRIMARY KEY,
        HotelID CHAR(36),
        GuestID INT,
        RoomIDs TEXT,
        CheckInDate DATE,
        CheckOutDate DATE,
        NumberOfGuests INT,
        Status VARCHAR(20),
        FOREIGN KEY (HotelID) REFERENCES Hotels(HotelID),
        FOREIGN KEY (GuestID) REFERENCES Guests(GuestID)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Invoices (
        InvoiceID CHAR(36) PRIMARY KEY,
        GuestID INT,
        ReservationID CHAR(36),
        HotelID CHAR(36),
        InvoiceDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        TotalAmount DECIMAL(10,2),
        TaxAmount DECIMAL(10,2),
        DiscountAmount DECIMAL(10,2),
        FinalAmount DECIMAL(10,2),
        PaymentStatus VARCHAR(20),
        Notes TEXT,
        FOREIGN KEY (GuestID) REFERENCES Guests(GuestID),
        FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID),
        FOREIGN KEY (HotelID) REFERENCES Hotels(HotelID)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS Staff (
        StaffID INT PRIMARY KEY AUTO_INCREMENT,
        HotelID CHAR(36),
        FirstName VARCHAR(100),
        LastName VARCHAR(100),
        Email VARCHAR(100),
        PhoneNumber VARCHAR(15),
        Role VARCHAR(50),
        JoinDate DATE,
        Salary DECIMAL(10,2),
        Address TEXT,
        Shift VARCHAR(50),
        IsActive BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (HotelID) REFERENCES Hotels(HotelID)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS ActivityServiceDetails (
        ActivityServiceID INT PRIMARY KEY AUTO_INCREMENT,
        HotelID CHAR(36),
        ActivityName VARCHAR(100),
        ProviderName VARCHAR(100),
        DurationInMinutes INT,
        FOREIGN KEY (HotelID) REFERENCES Hotels(HotelID)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS RestaurantServiceDetails (
        RestaurantServiceID INT PRIMARY KEY AUTO_INCREMENT,
        HotelID CHAR(36),
        DishName VARCHAR(100),
        Quantity INT,
        PricePerItemHALF DECIMAL(10,2),
        PricePerItem DECIMAL(10,2),
        FOREIGN KEY (HotelID) REFERENCES Hotels(HotelID)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS RoomServiceDetails (
        RoomServiceID INT PRIMARY KEY AUTO_INCREMENT,
        HotelID CHAR(36),
        ItemName VARCHAR(100),
        Quantity INT,
        SpecialInstructions TEXT,
        FOREIGN KEY (HotelID) REFERENCES Hotels(HotelID)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS HotelServices (
        ServiceID INT PRIMARY KEY AUTO_INCREMENT,
        HotelID CHAR(36),
        GuestID INT,
        ReservationID CHAR(36),
        ServiceType VARCHAR(50),
        ServiceDate DATETIME,
        Amount DECIMAL(10,2),
        Description TEXT,
        Status VARCHAR(20) DEFAULT 'Pending',
        FOREIGN KEY (HotelID) REFERENCES Hotels(HotelID),
        FOREIGN KEY (GuestID) REFERENCES Guests(GuestID),
        FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID)
      );
    `);

    // Example insert with UUID (replace with uuidv4() in real usage)
    await conn.query(`
      INSERT INTO Hotels (HotelID, HotelName, Location)
      VALUES (UUID(), 'Test Hotel', 'Earth')
    `);

    console.log('✅ All tables created successfully!');
    conn.release();
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
  }
};

createTables();