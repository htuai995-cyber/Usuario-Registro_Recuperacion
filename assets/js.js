'use strict';

document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            form.reportValidity();
        }
    });
});

const canvas = document.querySelector('#ambient-canvas');

if (canvas instanceof HTMLCanvasElement) {
    const context = canvas.getContext('2d');

    if (context !== null) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const pointer = { x: 0.5, y: 0.5 };
        const currentPointer = { x: 0.5, y: 0.5 };
        const colors = [
            [147, 45, 255],
            [231, 49, 218],
            [92, 54, 239],
            [194, 87, 255],
        ];
        const starColors = ['#ffffff', '#fff0ff', '#f5ddff', '#e8d4ff'];
        let stars = [];
        let width = 0;
        let height = 0;
        let pixelRatio = 1;
        let frameId = 0;

        const resizeCanvas = () => {
            window.cancelAnimationFrame(frameId);
            pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            const starCount = Math.min(110, Math.max(45, Math.round(width * height / 11000)));
            stars = Array.from({ length: starCount }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 0.8 + Math.random() * 1.8,
                phase: Math.random() * Math.PI * 2,
                speed: 0.35 + Math.random() * 0.9,
                drift: 3 + Math.random() * 12,
                color: starColors[Math.floor(Math.random() * starColors.length)],
                sparkle: Math.random() > 0.78,
            }));
            draw(0);
        };

        const draw = (time) => {
            const seconds = reducedMotion.matches ? 0 : time * 0.00018;
            const size = Math.max(width, height);
            currentPointer.x += (pointer.x - currentPointer.x) * 0.035;
            currentPointer.y += (pointer.y - currentPointer.y) * 0.035;
            context.clearRect(0, 0, width, height);
            context.fillStyle = '#e4c9ff';
            context.fillRect(0, 0, width, height);

            colors.forEach(([red, green, blue], index) => {
                const phase = seconds + index * 2.1;
                const orbitX = Math.cos(phase) * width * 0.11;
                const orbitY = Math.sin(phase * 0.8) * height * 0.12;
                const pointerPull = (index % 2 === 0 ? 1 : -1) * 38;
                const x = width * (0.18 + index * 0.22)
                    + orbitX + (currentPointer.x - 0.5) * pointerPull;
                const y = height * (index % 2 === 0 ? 0.2 : 0.78)
                    + orbitY + (currentPointer.y - 0.5) * pointerPull;
                const radius = size * (0.38 + (index % 2) * 0.08);
                const glow = context.createRadialGradient(x, y, 0, x, y, radius);

                glow.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 0.58)`);
                glow.addColorStop(0.48, `rgba(${red}, ${green}, ${blue}, 0.26)`);
                glow.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
                context.fillStyle = glow;
                context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
            });

            stars.forEach((star) => {
                const twinkle = reducedMotion.matches
                    ? 0.72
                    : 0.32 + (Math.sin(seconds * star.speed * 3 + star.phase) + 1) * 0.34;
                const driftX = reducedMotion.matches
                    ? 0
                    : Math.sin(seconds * star.speed + star.phase) * star.drift;
                const driftY = reducedMotion.matches
                    ? 0
                    : ((seconds * star.speed * 5 + star.y) % (height + 12)) - star.y;
                const x = star.x + driftX;
                const y = star.y + driftY;

                context.globalAlpha = twinkle;
                context.fillStyle = star.color;
                context.beginPath();
                context.arc(x, y, star.radius, 0, Math.PI * 2);
                context.fill();

                if (star.sparkle) {
                    const ray = star.radius * 3.2;
                    context.globalAlpha = twinkle * 0.65;
                    context.strokeStyle = star.color;
                    context.lineWidth = 0.8;
                    context.beginPath();
                    context.moveTo(x - ray, y);
                    context.lineTo(x + ray, y);
                    context.moveTo(x, y - ray);
                    context.lineTo(x, y + ray);
                    context.stroke();
                }
            });
            context.globalAlpha = 1;

            if (!reducedMotion.matches) {
                frameId = window.requestAnimationFrame(draw);
            }
        };

        window.addEventListener('pointermove', (event) => {
            pointer.x = event.clientX / Math.max(width, 1);
            pointer.y = event.clientY / Math.max(height, 1);

            if (reducedMotion.matches) {
                currentPointer.x = pointer.x;
                currentPointer.y = pointer.y;
                draw(0);
            }
        }, { passive: true });
        window.addEventListener('pointerleave', () => {
            pointer.x = 0.5;
            pointer.y = 0.5;
        });
        window.addEventListener('resize', resizeCanvas, { passive: true });
        reducedMotion.addEventListener('change', () => {
            window.cancelAnimationFrame(frameId);
            draw(0);
        });
        document.addEventListener('visibilitychange', () => {
            window.cancelAnimationFrame(frameId);

            if (!document.hidden) {
                draw(performance.now());
            }
        });

        resizeCanvas();
    }
}