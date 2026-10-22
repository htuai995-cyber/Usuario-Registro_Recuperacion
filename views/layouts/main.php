<?php
$flash = take_flash();
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= h($pageTitle) ?> | LoginB</title>
    <link rel="stylesheet" href="assets/index.css">
    <script src="assets/js.js" defer></script>
</head>
<body>
    <canvas class="ambient-canvas" id="ambient-canvas" aria-hidden="true"></canvas>
    <header class="site-header">
        <a class="brand" href="index.php?route=login">LoginB</a>
        <?php if (isset($_SESSION['user_id'])): ?>
            <form action="index.php?route=logout" method="post">
                <input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">
                <button class="button button-link" type="submit">Cerrar sesión</button>
            </form>
        <?php else: ?>
            <span class="header-caption">Acceso seguro a tu cuenta</span>
        <?php endif; ?>
    </header>
    <main class="page">
        <?php if ($flash !== null): ?>
            <div class="notice notice-<?= h((string) ($flash['type'] ?? 'success')) ?>" role="status">
                <?= h((string) ($flash['message'] ?? '')) ?>
            </div>
        <?php endif; ?>
        <?php require $viewFile; ?>
    </main>
</body>
</html>
