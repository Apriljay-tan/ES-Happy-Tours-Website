<?php
declare(strict_types=1);

/*
 * Database configuration.
 *
 * Local XAMPP settings:
 * - DB_HOST: 127.0.0.1
 * - DB_NAME: es_happy_tours
 * - DB_USER: root
 * - DB_PASS: empty string
 *
 * When uploading to Hostinger, replace these constants with your Hostinger
 * MySQL database host, database name, username, and password.
 *
 * Keep this file private. Do not expose database credentials in JavaScript.
 */
const DB_HOST = '127.0.0.1';
const DB_NAME = 'es_happy_tours';
const DB_USER = 'root';
const DB_PASS = '';
const DB_CHARSET = 'utf8mb4';

function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        DB_HOST,
        DB_NAME,
        DB_CHARSET
    );

    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}
