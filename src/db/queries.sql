
-- SQL Queries for DBS Expense Manager Project

-- User Management Queries
-- Register new user
INSERT INTO users (username, email, password_hash, full_name, role)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, username, email, role;

-- Login user
SELECT id, username, email, role, password_hash
FROM users
WHERE username = $1 OR email = $1;

-- Get user profile
SELECT id, username, email, full_name, role, created_at
FROM users
WHERE id = $1;

-- Expense Management Queries
-- Add new expense
INSERT INTO expenses (user_id, amount, category, description, date)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, amount, category, description, date;

-- Get all expenses for a user
SELECT id, amount, category, description, date, created_at
FROM expenses
WHERE user_id = $1
ORDER BY date DESC;

-- Get expenses for a specific date range
SELECT id, amount, category, description, date, created_at
FROM expenses
WHERE user_id = $1 AND date BETWEEN $2 AND $3
ORDER BY date DESC;

-- Get expenses by category
SELECT id, amount, category, description, date, created_at
FROM expenses
WHERE user_id = $1 AND category = $2
ORDER BY date DESC;

-- Update expense
UPDATE expenses
SET amount = $2, category = $3, description = $4, date = $5, updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND user_id = $6
RETURNING id, amount, category, description, date;

-- Delete expense
DELETE FROM expenses
WHERE id = $1 AND user_id = $2
RETURNING id;

-- Analysis Queries
-- Get total expenses by user
SELECT SUM(amount) as total_amount
FROM expenses
WHERE user_id = $1;

-- Get weekly expenses for the last 7 days
SELECT date, SUM(amount) as daily_total
FROM expenses
WHERE user_id = $1 AND date >= CURRENT_DATE - INTERVAL '6 days'
GROUP BY date
ORDER BY date;

-- Get expenses by category (for pie chart)
SELECT category, SUM(amount) as category_total
FROM expenses
WHERE user_id = $1
GROUP BY category
ORDER BY category_total DESC;

-- Get monthly expenses trend
SELECT EXTRACT(MONTH FROM date) as month, EXTRACT(YEAR FROM date) as year, SUM(amount) as monthly_total
FROM expenses
WHERE user_id = $1
GROUP BY month, year
ORDER BY year, month;

-- Chat Queries
-- Add new chat message from user
INSERT INTO chat_messages (user_id, message, is_from_admin)
VALUES ($1, $2, false)
RETURNING id, message, is_from_admin, created_at;

-- Add admin reply
INSERT INTO chat_messages (user_id, message, is_from_admin, replied_to_id)
VALUES ($1, $2, true, $3)
RETURNING id, message, is_from_admin, replied_to_id, created_at;

-- Get all chat messages for a user
SELECT cm.id, cm.message, cm.is_from_admin, cm.is_read, cm.replied_to_id, cm.created_at,
       r.message as replied_message
FROM chat_messages cm
LEFT JOIN chat_messages r ON cm.replied_to_id = r.id
WHERE cm.user_id = $1
ORDER BY cm.created_at;

-- Mark message as read
UPDATE chat_messages
SET is_read = true
WHERE id = $1 AND user_id = $2
RETURNING id;

-- Get all unread messages for admin
SELECT cm.id, cm.message, u.username, u.full_name, cm.created_at
FROM chat_messages cm
JOIN users u ON cm.user_id = u.id
WHERE cm.is_from_admin = false AND cm.is_read = false
ORDER BY cm.created_at;
