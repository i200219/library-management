-- Migration to add reservations table
-- This should be run after the existing migrations

CREATE TYPE reservation_status AS ENUM ('ACTIVE', 'FULFILLED', 'CANCELLED', 'EXPIRED');

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    reservation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status reservation_status DEFAULT 'ACTIVE' NOT NULL,
    priority_position INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a user can only have one active reservation per book
    UNIQUE(user_id, book_id, status) WHERE status = 'ACTIVE'
);

-- Index for efficient queries
CREATE INDEX idx_reservations_book_status ON reservations(book_id, status);
CREATE INDEX idx_reservations_user_status ON reservations(user_id, status);
CREATE INDEX idx_reservations_expiry ON reservations(expiry_date) WHERE status = 'ACTIVE';

-- Function to automatically update priority positions
CREATE OR REPLACE FUNCTION update_reservation_priorities()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate priority positions for the book
    WITH ranked_reservations AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY reservation_date ASC) as new_priority
        FROM reservations 
        WHERE book_id = COALESCE(NEW.book_id, OLD.book_id) 
        AND status = 'ACTIVE'
    )
    UPDATE reservations 
    SET priority_position = ranked_reservations.new_priority
    FROM ranked_reservations 
    WHERE reservations.id = ranked_reservations.id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain priority positions
CREATE TRIGGER trigger_update_reservation_priorities
    AFTER INSERT OR UPDATE OR DELETE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_reservation_priorities();