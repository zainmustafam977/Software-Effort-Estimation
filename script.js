document.addEventListener('DOMContentLoaded', () => {

    // 13. Custom Dynamic Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.style.left = `${e.clientX}px`;
        cursorOutline.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll('a, button, .interactive, .accordion-header').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hover-cursor'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover-cursor'));
    });

    // 15. Hero Particle Network
    if(window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#4ade80" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#3b82f6", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }

    // 12. Typing Animation
    const text = "Applying advanced Data Science to HCI and Agile Software Metrics.";
    const typingEl = document.getElementById("typewriter-text");
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typingEl.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    setTimeout(typeWriter, 1000);

    // 10. Parallax Background Scroll & 5. Sticky Nav & Scroll Spy
    const blobs = document.querySelectorAll('.blob');
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-item');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        
        // Parallax
        blobs.forEach(blob => {
            const speed = blob.getAttribute('data-speed');
            blob.style.transform = `translateY(${scrollY * speed * 0.1}px)`;
        });

        // Sticky Nav
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Spy
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });

        // Back to top
        if(scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Seamless Theme Transition on Scroll
        // Calculate scroll percentage
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = scrollY / maxScroll;
        
        // Transition to light mode when scrolled past 25% of the page
        if (scrollPercent > 0.25) {
            document.body.classList.add('light-mode');
            if (window.particlesJS && window.pJSDom && window.pJSDom.length > 0) {
                // Optional: change particle colors for light mode
            }
        } else {
            document.body.classList.remove('light-mode');
        }
    });

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // 11. Intersection Observer Fade-ins & 4. Animated Counters
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counters
                if(entry.target.classList.contains('stats-bar')) {
                    document.querySelectorAll('.counter').forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const updateCount = () => {
                            const c = +counter.innerText;
                            const increment = target / 50;
                            if(c < target) {
                                counter.innerText = Math.ceil(c + increment);
                                setTimeout(updateCount, 30);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCount();
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-el').forEach(el => observer.observe(el));

    // 2. Expandable Scrum Accordions
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const accordion = header.parentElement;
            accordion.classList.toggle('active');
        });
    });
});

// 3. Carousel Logic
let currentSlide = 0;
function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// 14. Modals Logic
const profiles = {
    'abdullah': { name: 'Muhammad Abdullah Zafar', title: 'Lead Developer', desc: 'Abdullah focuses on front-end architecture and ensuring the web interface meets modern HCI principles.', img: 'assets/Abdullah.jpeg' },
    'prof': { name: 'Prof. Qamar Abbas Arbie', title: 'Product Owner / Supervisor', desc: 'Prof. Arbie oversees the Agile project trajectory, prioritizing the product backlog and ensuring academic rigor.', img: 'assets/Professor.jpg' },
    'hamdan': { name: 'Muhammad Hamdan Amir', title: 'Scrum Master', desc: 'Hamdan facilitates daily scrums, removes blockers, and ensures the team adheres strictly to the Scrum methodology.', img: 'assets/hamdan.jpeg' }
};

const modal = document.getElementById('roleModal');
function openModal(id) {
    const profile = profiles[id];
    document.getElementById('modalName').innerText = profile.name;
    document.getElementById('modalTitle').innerText = profile.title;
    document.getElementById('modalDesc').innerText = profile.desc;
    document.getElementById('modalImg').src = profile.img;
    modal.classList.add('active');
}
function closeModal() {
    modal.classList.remove('active');
}
window.onclick = function(event) {
    if (event.target == modal) closeModal();
}
