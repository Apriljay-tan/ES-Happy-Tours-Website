<?php
declare(strict_types=1);

function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['SERVER_PORT'] ?? null) === '443');

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_name('es_admin_session');
    session_start();
}

function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

function is_admin_logged_in(): bool
{
    start_admin_session();

    return isset($_SESSION['admin_id'], $_SESSION['admin_username']);
}

function require_admin(): void
{
    if (is_admin_logged_in()) {
        return;
    }

    header('Location: login.php');
    exit;
}

function current_admin_username(): string
{
    start_admin_session();

    return (string)($_SESSION['admin_username'] ?? '');
}

function csrf_token(): string
{
    start_admin_session();

    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return (string)$_SESSION['csrf_token'];
}

function csrf_is_valid(?string $token): bool
{
    start_admin_session();

    return is_string($token)
        && isset($_SESSION['csrf_token'])
        && hash_equals((string)$_SESSION['csrf_token'], $token);
}

function login_admin(int $adminId, string $username): void
{
    start_admin_session();
    session_regenerate_id(true);

    $_SESSION['admin_id'] = $adminId;
    $_SESSION['admin_username'] = $username;
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function logout_admin(): void
{
    start_admin_session();

    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            (bool)$params['secure'],
            (bool)$params['httponly']
        );
    }

    session_destroy();
}
