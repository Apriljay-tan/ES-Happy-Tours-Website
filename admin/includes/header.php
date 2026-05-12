<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

$pageTitle = $pageTitle ?? 'Admin';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex,nofollow">
  <title><?= e($pageTitle) ?> - ES Happy Tours Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: light;
      --gold: #ffd60a;
      --gold-dark: #b98500;
      --text: #1c1c1e;
      --muted: #636366;
      --line: #e5e5ea;
      --bg: #f5f5f7;
      --card: rgba(255, 255, 255, 0.92);
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Poppins", sans-serif;
      color: var(--text);
      background: radial-gradient(circle at top left, rgba(255, 214, 10, 0.22), transparent 34%), var(--bg);
    }

    a { color: inherit; }

    .admin-shell {
      min-height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr;
    }

    .admin-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px clamp(18px, 4vw, 42px);
      border-bottom: 1px solid rgba(229, 229, 234, 0.78);
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(18px);
    }

    .admin-brand {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-weight: 850;
      letter-spacing: -0.01em;
    }

    .admin-brand span {
      color: var(--muted);
      font-size: 0.78rem;
      font-weight: 650;
    }

    .admin-nav {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--muted);
      font-size: 0.9rem;
    }

    .admin-link,
    .admin-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      padding: 10px 14px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: #fff;
      color: var(--text);
      font: inherit;
      font-weight: 750;
      text-decoration: none;
      cursor: pointer;
    }

    .admin-link--gold,
    .admin-button--gold {
      border-color: rgba(255, 190, 0, 0.6);
      background: var(--gold);
      box-shadow: 0 12px 26px rgba(255, 190, 0, 0.26);
    }

    .admin-main {
      width: min(1120px, 100%);
      margin: 0 auto;
      padding: clamp(22px, 4vw, 46px);
    }

    .admin-card {
      border: 1px solid rgba(255, 255, 255, 0.82);
      border-radius: 26px;
      background: var(--card);
      box-shadow: 0 20px 60px rgba(28, 28, 30, 0.09);
    }

    .admin-card__body { padding: clamp(22px, 4vw, 34px); }
    .admin-title { margin: 0 0 8px; font-size: clamp(1.8rem, 4vw, 2.6rem); letter-spacing: -0.03em; }
    .admin-subtitle { margin: 0; color: var(--muted); line-height: 1.65; }

    .form-grid { display: grid; gap: 16px; margin-top: 26px; }
    .form-field { display: grid; gap: 8px; }
    .form-label { color: var(--text); font-size: 0.86rem; font-weight: 800; }
    .form-input {
      width: 100%;
      min-height: 48px;
      padding: 12px 14px;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: #fff;
      color: var(--text);
      font: inherit;
    }

    .form-input:focus {
      outline: 3px solid rgba(255, 214, 10, 0.32);
      border-color: rgba(255, 190, 0, 0.72);
    }

    .alert {
      margin-top: 18px;
      padding: 12px 14px;
      border-radius: 16px;
      font-weight: 700;
      line-height: 1.45;
    }

    .alert--error {
      background: rgba(255, 59, 48, 0.11);
      color: #9f241d;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-top: 28px;
    }

    .metric {
      padding: 20px;
      border: 1px solid var(--line);
      border-radius: 22px;
      background: #fff;
    }

    .metric strong { display: block; font-size: 2rem; letter-spacing: -0.04em; }
    .metric span { color: var(--muted); font-weight: 700; }

    @media (max-width: 760px) {
      .admin-topbar { align-items: flex-start; flex-direction: column; }
      .admin-nav { flex-wrap: wrap; }
      .dashboard-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="admin-shell">
    <header class="admin-topbar">
      <div class="admin-brand">
        ES Happy Tours Admin
        <span>Secure owner dashboard</span>
      </div>
      <?php if (is_admin_logged_in()): ?>
        <nav class="admin-nav" aria-label="Admin navigation">
          <span>Signed in as <?= e(current_admin_username()) ?></span>
          <a class="admin-link" href="dashboard.php">Dashboard</a>
          <a class="admin-link admin-link--gold" href="logout.php">Logout</a>
        </nav>
      <?php endif; ?>
    </header>
    <main class="admin-main">
