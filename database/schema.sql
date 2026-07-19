CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "Users" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'USER',
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "Stadiums" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    image_url TEXT,
    capacity INTEGER
);

CREATE TABLE "Teams" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_code TEXT NOT NULL,
    logo_url TEXT
);

CREATE TABLE "Matches" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_a UUID REFERENCES "Teams"(id) ON DELETE CASCADE,
    team_b UUID REFERENCES "Teams"(id) ON DELETE CASCADE,
    stadium_id UUID REFERENCES "Stadiums"(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    format TEXT DEFAULT 'T20',
    status TEXT DEFAULT 'UPCOMING'
);

CREATE TABLE "Stands" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stadium_id UUID REFERENCES "Stadiums"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT NOT NULL
);

CREATE TABLE "Blocks" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stand_id UUID REFERENCES "Stands"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    color_code TEXT NOT NULL DEFAULT '#b9c3ff',
    price NUMERIC(10,2) NOT NULL
);

CREATE TABLE "Rows" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_id UUID REFERENCES "Blocks"(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

CREATE TABLE "Seats" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row_id UUID REFERENCES "Rows"(id) ON DELETE CASCADE,
    seat_number INTEGER NOT NULL,
    x NUMERIC(10,2) NOT NULL DEFAULT 0,
    y NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE "MatchSeats" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES "Matches"(id) ON DELETE CASCADE,
    seat_id UUID REFERENCES "Seats"(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'AVAILABLE',
    locked_by UUID REFERENCES "Users"(id),
    locked_until TIMESTAMP WITH TIME ZONE,
    price NUMERIC(10,2) NOT NULL
);
CREATE INDEX idx_matchseats_match_status ON "MatchSeats"(match_id, status);

CREATE TABLE "Bookings" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES "Users"(id),
    match_id UUID REFERENCES "Matches"(id),
    total_amount NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'PENDING',
    payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_bookings_user_id ON "Bookings"(user_id);

CREATE TABLE "Payments" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES "Bookings"(id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    amount NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "BookingSeats" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES "Bookings"(id) ON DELETE CASCADE,
    match_seat_id UUID REFERENCES "MatchSeats"(id)
);

CREATE TABLE "Tickets" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_seat_id UUID REFERENCES "BookingSeats"(id) ON DELETE CASCADE,
    qr_token TEXT NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
