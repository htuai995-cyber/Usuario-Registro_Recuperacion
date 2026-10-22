<section class="card">
    <p class="eyebrow">Acceso a tu cuenta</p>
    <h1>Cambiar contraseña</h1>

    <?php if (isset($error)): ?>
        <div class="notice notice-error" role="alert"><?= h($error) ?></div>
    <?php endif; ?>

    <?php if (!empty($token)): ?>
        <form method="post" action="index.php?route=reset-password">
            <input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">
            <input type="hidden" name="token" value="<?= h($token) ?>">
            <label for="password">Nueva contraseña</label>
            <input id="password" name="password" type="password"
                   autocomplete="new-password" minlength="8" maxlength="72" required>

            <label for="password_confirmation">Confirmar contraseña</label>
            <input id="password_confirmation" name="password_confirmation" type="password"
                   autocomplete="new-password" minlength="8" maxlength="72" required>

            <button class="button" type="submit">Guardar contraseña</button>
        </form>
    <?php endif; ?>
    <p class="form-footer"><a href="index.php?route=login">Volver a iniciar sesión</a></p>
</section>


