document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // --- LIVE SCHEDULE LOGIC (THE FUNCTIONAL HEART) ---
    function updateLiveTimings() {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const hiaceStatusEl = document.getElementById('hiace-status');
        if (hiaceStatusEl) {
            const hiaceDepartureTime = 8 * 60; // 8:00 AM
            if (currentMinutes < hiaceDepartureTime - 15) {
                hiaceStatusEl.textContent = 'Scheduled';
                hiaceStatusEl.className = 'status-badge bg-blue-100 text-blue-800';
            } else if (currentMinutes >= hiaceDepartureTime - 15 && currentMinutes <= hiaceDepartureTime) {
                hiaceStatusEl.textContent = 'Boarding Now';
                hiaceStatusEl.className = 'status-badge bg-yellow-100 text-yellow-800 animate-pulse';
            } else if (currentMinutes > hiaceDepartureTime && currentMinutes < hiaceDepartureTime + 60) {
                hiaceStatusEl.textContent = 'En Route';
                hiaceStatusEl.className = 'status-badge bg-green-100 text-green-800';
            } else {
                hiaceStatusEl.textContent = 'Concluded for Today';
                hiaceStatusEl.className = 'status-badge bg-gray-200 text-gray-800';
            }
        }
        const raviTimes = ['9:30', '11:00', '13:00', '15:30', '17:00'];
        const raviTimingsContainer = document.getElementById('ravi-timings');
        const raviNextEl = document.getElementById('ravi-next');
        if (raviTimingsContainer && raviNextEl) {
            raviTimingsContainer.innerHTML = '';
            let nextDepartureFound = false;
            raviTimes.forEach(time => {
                const [h, m] = time.split(':');
                const departureMinutes = parseInt(h) * 60 + parseInt(m);
                const timeEl = document.createElement('div');
                timeEl.textContent = time;
                timeEl.className = 'p-2 rounded-lg';
                if (!nextDepartureFound && currentMinutes < departureMinutes) {
                    timeEl.classList.add('bg-green-200', 'text-green-900', 'font-bold', 'next-departure-highlight');
                    raviNextEl.textContent = time;
                    nextDepartureFound = true;
                } else if (currentMinutes >= departureMinutes) {
                    timeEl.classList.add('bg-gray-200', 'text-gray-500', 'line-through');
                } else {
                    timeEl.classList.add('bg-gray-100', 'text-gray-800');
                }
                raviTimingsContainer.appendChild(timeEl);
            });
            if (!nextDepartureFound) {
                raviNextEl.textContent = 'None';
                raviNextEl.classList.remove('text-green-600');
                raviNextEl.classList.add('text-red-600');
            }
        }
    }
    updateLiveTimings();
    setInterval(updateLiveTimings, 30000);

    // --- GSAP ANIMATION ORCHESTRA ---
    
    // 1. HERO ANIMATION: CINEMATIC REVEAL
    const heroTitles = new SplitType('.hero-title, .hero-subtitle', { types: 'chars' });
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
    heroTl
        .to('.hero-bg', { scale: 1, opacity: 0.2, duration: 2.5 })
        .to(heroTitles.chars, { y: 0, stagger: 0.04, delay: 0.2 }, "-=2")
        .to('.hero-p', { opacity: 1, y: 0, duration: 1 }, "-=1.5")
        .to('.hero-cta-wrapper', { opacity: 1 }, "-=1.2");
        
    // 2. 3D INTERACTIVE CARDS
    const cards = document.querySelectorAll(".vehicle-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = -1 * ((y - rect.height / 2) / (rect.height / 2)) * 10;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                ease: "power2.out",
                duration: 0.4
            });
        });
        card.addEventListener("mouseleave", () => {
            gsap.to(card, { rotationX: 0, rotationY: 0, ease: "power2.out", duration: 1 });
        });
    });

    // 3. SVG ROUTE ANIMATION - THE MASTERPIECE
    const svgTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#schedule",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
        }
    });
    svgTl
        .to("#routePath", { strokeDashoffset: 0, ease: "power1.inOut" })
        .to("#hiaceIcon", {
            motionPath: {
                path: "#routePath",
                align: "#routePath",
                alignOrigin: [0.5, 0.5],
                autoRotate: true
            },
            opacity: 1,
            ease: "power1.inOut"
        }, "<");

    // 4. GENERAL SCROLL-TRIGGERED FADE-INS
    gsap.utils.toArray('.section-title, .booking-card, .contact-wrapper').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%' }
            }
        );
    });

    // 5. HEADER ANIMATION
    gsap.to("header", {
        scrollTrigger: { trigger: "body", start: "100 top", end: "150 top", scrub: 1 },
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    });

    // 6. FOOTER ENTRANCE ANIMATION - THE GRAND FINALE
    const footerTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".main-footer",
            start: "top 95%",
            toggleActions: "play none none none"
        }
    });
    footerTl
        .to(".main-footer", {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
        })
        .to(".footer-column", {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        }, "-=0.8")
        .to(".footer-bottom-bar", {
            opacity: 1,
            y: 0,
            duration: 1
        }, "-=0.5");
        
});