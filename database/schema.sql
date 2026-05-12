-- ES Happy Tours Admin Foundation Schema
-- Phase 1: admins table only.
--
-- Import this file into your Hostinger MySQL database using phpMyAdmin.
-- Then create an admin password hash with PHP:
-- php -r "echo password_hash('ChangeThisPassword', PASSWORD_DEFAULT), PHP_EOL;"
--
-- Insert your first admin by replacing the password hash below:
-- INSERT INTO admins (username, email, password_hash)
-- VALUES ('admin', 'owner@example.com', '$2y$10$REPLACE_WITH_PASSWORD_HASH_FROM_PHP');

CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(190) NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
