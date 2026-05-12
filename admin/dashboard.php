<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';

require_admin();

$adminCount = 0;

try {
    $stmt = db()->query('SELECT COUNT(*) AS total FROM admins');
    $adminCount = (int)($stmt->fetch()['total'] ?? 0);
} catch (Throwable $exception) {
    $adminCount = 0;
}

$pageTitle = 'Dashboard';
require __DIR__ . '/includes/header.php';
?>

<section class="admin-card">
  <div class="admin-card__body">
    <h1 class="admin-title">Dashboard</h1>
    <p class="admin-subtitle">
      This is the protected admin foundation. Package, booking, and calendar management will be added in later phases.
    </p>

    <div class="dashboard-grid">
      <div class="metric">
        <strong><?= e((string)$adminCount) ?></strong>
        <span>Active admin accounts</span>
      </div>
      <div class="metric">
        <strong>0</strong>
        <span>Package tools pending Phase 2</span>
      </div>
      <div class="metric">
        <strong>0</strong>
        <span>Booking tools pending Phase 4</span>
      </div>
    </div>
  </div>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
