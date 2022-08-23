CREATE TABLE users (
    username VARCHAR(30) PRIMARY,
    password TEXT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    date_of_birth DATE NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    zip_code VARCHAR(10) NOT NULL
)

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    max_occupancy INTEGER NOT NULL,
    price INTEGER CHECK (price >= 0),
    zip_code VARCHAR(10) NOT NULL,
    owner VARCHAR(30) REFERENCES users ON DELETE CASCADE,
    swimming_pool BOOLEAN DEFAULT FALSE,
    jacuzzi BOOLEAN DEFAULT FALSE,
    outdoor_cinema BOOLEAN DEFAULT FALSE,
    barbecue_grill BOOLEAN DEFAULT FALSE,
    basketball_court BOOLEAN DEFAULT FALSE,
    tennis_court BOOLEAN DEFAULT FALSE,
    volleyball_court BOOLEAN DEFAULT FALSE,
    mini_golf BOOLEAN DEFAULT FALSE,
    pool_table BOOLEAN DEFAULT FALSE,
    pets_allowed BOOLEAN DEFAULT FALSE
)

CREATE TABLE listing_availabilities (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listings,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
)

CREATE TABLE messages (
    from_user VARCHAR(30) REFERENCES users ON DELETE CASCADE,
    to_user VARCHAR(30) REFERENCES users ON DELETE CASCADE,
    message TEXT NOT NULL,
    time_sent TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY(from_user, to_user)
)