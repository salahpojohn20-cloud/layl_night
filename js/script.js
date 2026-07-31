document.addEventListener("DOMContentLoaded", () => {
    // ---- Elements Setup ----
    const introScreen = document.getElementById('intro-screen');
    const mainScreen = document.getElementById('main-screen');
    const giftScreen = document.getElementById('gift-screen');
    
    const enterBtn = document.getElementById('enter-btn');
    const nextBtn = document.getElementById('next-btn');
    const giftBtn = document.getElementById('gift-btn');
    const replayBtn = document.getElementById('replay-btn');
    
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const romanticText = document.getElementById('romantic-text');
    const nameTyping = document.getElementById('name-typing');
    const finalMessage = document.getElementById('final-message');
    
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const mouseGlow = document.getElementById('mouse-glow');
    const mainCard = document.getElementById('main-card');

    let musicPlaying = false;

    // ---- Audio Controls ----
    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            bgMusic.pause();
            musicPlaying = false;
            musicToggle.style.opacity = '0.5';
        } else {
            bgMusic.play().catch(e => console.log("Audio play prevented"));
            musicPlaying = true;
            musicToggle.style.opacity = '1';
        }
    });

    // ---- Mouse Glow & Parallax Effect ----
    document.addEventListener('mousemove', (e) => {
        mouseGlow.style.left = `${e.clientX}px`;
        mouseGlow.style.top = `${e.clientY}px`;

        // Slight parallax for the main card
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;
        if(mainCard) {
            mainCard.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    // ---- Typing Effect Function ----
    async function typeWriter(element, text, speed) {
        element.innerHTML = '';
        for (let i = 0; i < text.length; i++) {
            if (text.charAt(i) === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += text.charAt(i);
            }
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }

    // ---- Interaction Flow ----
    
    // 1. Enter Button
    enterBtn.addEventListener('click', () => {
        // Play music on first interaction
        bgMusic.play().catch(() => console.log("No audio file found or blocked"));
        musicPlaying = true;

        introScreen.classList.add('hidden');
        
        setTimeout(() => {
            mainScreen.classList.remove('hidden');
            typeWriter(nameTyping, "Layl", 200);
        }, 1000);
    });

    // 2. Next Button (Image Transition)
    nextBtn.addEventListener('click', () => {
        // Crossfade images
        img1.classList.remove('active');
        img1.classList.add('inactive');
        
        img2.classList.remove('inactive');
        img2.classList.add('active');

        // Change text
        romanticText.style.opacity = 0;
        setTimeout(() => {
            romanticText.innerHTML = "✨ A beauty that outshines the moon itself... ✨";
            romanticText.style.opacity = 1;
        }, 500);

        // Switch Buttons
        nextBtn.classList.add('hidden');
        setTimeout(() => {
            giftBtn.classList.remove('hidden');
        }, 1000);
    });

    // 3. Open Gift Button
    giftBtn.addEventListener('click', () => {
        mainScreen.classList.add('hidden');
        
        setTimeout(() => {
            giftScreen.classList.remove('hidden');
            startConfetti();
            
            const message = `احح 😭💙\n\nانا خليت ChatGPT يساعدني في كل حاجة،\nلكن دي أنا كاتبها بنفسي طبعًا عشانك ✨\n\nإنتِ صديقة غالية جدًا عندي،\nوأتمنى الهدية دي تعجبك.\n\nعارف إنها مش بالمقام،\nلكن عملتها بكل اهتمام وأتمنى تكون سبب في ابتسامتك 🌙💙\n\nوبس كذا 🫠♥\n\nHappy Birthday My Honey 💙`;
            
            typeWriter(finalMessage, message, 50).then(() => {
                replayBtn.classList.remove('hidden');
            });
        }, 1000);
    });

    // 4. Replay Button
    replayBtn.addEventListener('click', () => {
        location.reload();
    });

    // ---- Background Star Canvas ----
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let stars = [];
    let shootingStars = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.baseAlpha = Math.random() * 0.8 + 0.1;
            this.alpha = this.baseAlpha;
            this.alphaChange = (Math.random() * 0.02) + 0.005;
        }
        update() {
            this.alpha += this.alphaChange;
            if (this.alpha <= 0.1 || this.alpha >= this.baseAlpha) {
                this.alphaChange = -this.alphaChange;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.fill();
        }
    }

    class ShootingStar {
        constructor() {
            this.x = Math.random() * width;
            this.y = 0;
            this.length = Math.random() * 80 + 30;
            this.speed = Math.random() * 10 + 6;
            this.angle = Math.PI / 4; // 45 degrees
            this.opacity = 1;
            this.dead = false;
        }
        update() {
            this.x -= this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);
            this.opacity -= 0.015;
            if (this.opacity <= 0 || this.x < 0 || this.y > height) {
                this.dead = true;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.length * Math.cos(this.angle), this.y - this.length * Math.sin(this.angle));
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // Initialize 300+ stars
    for (let i = 0; i < 350; i++) {
        stars.push(new Star());
    }

    function animateStars() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw normal stars
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        // Add shooting star randomly
        if (Math.random() < 0.01) {
            shootingStars.push(new ShootingStar());
        }

        // Draw and update shooting stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            shootingStars[i].update();
            shootingStars[i].draw();
            if (shootingStars[i].dead) {
                shootingStars.splice(i, 1);
            }
        }

        requestAnimationFrame(animateStars);
    }
    animateStars();

    // ---- Confetti Canvas (Vanilla JS) ----
    const confCanvas = document.getElementById('confetti-canvas');
    const confCtx = confCanvas.getContext('2d');
    let confWidth, confHeight;
    let confettis = [];
    let confettiActive = false;

    function resizeConfetti() {
        confWidth = confCanvas.width = window.innerWidth;
        confHeight = confCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeConfetti);
    resizeConfetti();

    const colors = ['#8ab4f8', '#ffffff', '#ffd700', '#ff6b6b', '#4ecdc4'];

    class Confetti {
        constructor() {
            this.x = Math.random() * confWidth;
            this.y = Math.random() * confHeight - confHeight;
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 5 + 2;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            if (this.y > confHeight) {
                this.y = -10;
                this.x = Math.random() * confWidth;
            }
        }
        draw() {
            confCtx.save();
            confCtx.translate(this.x, this.y);
            confCtx.rotate((this.rotation * Math.PI) / 180);
            confCtx.fillStyle = this.color;
            confCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            confCtx.restore();
        }
    }

    function startConfetti() {
        confettiActive = true;
        for (let i = 0; i < 150; i++) {
            confettis.push(new Confetti());
        }
        animateConfetti();
    }

    function animateConfetti() {
        if (!confettiActive) return;
        confCtx.clearRect(0, 0, confWidth, confHeight);
        confettis.forEach(c => {
            c.update();
            c.draw();
        });
        requestAnimationFrame(animateConfetti);
    }
});

