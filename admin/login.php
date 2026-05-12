<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';

start_admin_session();

if (is_admin_logged_in()) {
    header('Location: dashboard.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim((string)($_POST['username'] ?? ''));
    $password = (string)($_POST['password'] ?? '');
    $csrf = (string)($_POST['csrf_token'] ?? '');

    if (!csrf_is_valid($csrf)) {
        $error = 'Your session expired. Please try again.';
    } elseif ($username === '' || $password === '') {
        $error = 'Enter your username and password.';
    } else {
        try {
            $stmt = db()->prepare(
                'SELECT id, username, password_hash
                 FROM admins
                 WHERE username = :username
                 LIMIT 1'
            );
            $stmt->execute(['username' => $username]);
            $admin = $stmt->fetch();
        } catch (Throwable $exception) {
            $admin = false;
            $error = 'Login is temporarily unavailable. Please check the database configuration.';
        }

        if (
            $admin
            && password_verify($password, (string)$admin['password_hash'])
        ) {
            login_admin((int)$admin['id'], (string)$admin['username']);

            header('Location: dashboard.php');
            exit;
        }

        if ($error === '') {
            $error = 'Invalid username or password.';
        }
    }
}

$pageTitle = 'Login';
require __DIR__ . '/includes/header.php';
?>

<section class="admin-card" style="max-width: 460px; margin: 7vh auto 0;">
  <div class="admin-card__body">
    <h1 class="admin-title">Admin Login</h1>
    <p class="admin-subtitle">Sign in to manage ES Happy Tours content and bookings.</p>

    <?php if ($error !== ''): ?>
      <div class="alert alert--error"><?= e($error) ?></div>
    <?php endif; ?>

    <form class="form-grid" method="post" action="login.php" novalidate>
      <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">

      <div class="form-field">
        <label class="form-label" for="username">Username</label>
        <input class="form-input" type="text" id="username" name="username" autocomplete="username" required>
      </div>

      <div class="form-field">
        <label class="form-label" for="password">Password</label>
        <input class="form-input" type="password" id="password" name="password" autocomplete="current-password" required>
      </div>

      <button class="admin-button admin-button--gold" type="submit">Login</button>
    </form>
  </div>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
