/* === Portfolio JavaScript === */

/* --- Header Button Functionality --- */
const showHeaderBtn = document.getElementById('show-header-btn');
const header = document.querySelector('.portfolio-header');
const headerContent = header.querySelector('.header-content');

function handleHeaderVisibility() {
    if (window.innerWidth <= 900) {
        if (!header.classList.contains('expanded')) {
            headerContent.style.display = 'none';
            headerContent.style.height = '0';
            headerContent.style.opacity = '0';
            showHeaderBtn.style.display = 'block';
            showHeaderBtn.classList.remove('bottom-position');
        }
    } else {
        header.classList.add('expanded');
        headerContent.style.display = 'flex';
        headerContent.style.height = 'auto';
        headerContent.style.opacity = '1';
        showHeaderBtn.style.display = 'none';
        showHeaderBtn.classList.remove('bottom-position');
    }
}

showHeaderBtn.addEventListener('click', () => {
    const isExpanded = header.classList.contains('expanded');
    if (isExpanded) {
        // Collapse the header
        gsap.timeline()
            .to(headerContent.querySelectorAll('h2, nav, .theme-slider'), {
                opacity: 0,
                y: -20,
                duration: 0.3,
                ease: 'power3.inOut',
                stagger: 0.05
            })
            .to(headerContent, {
                height: 0,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.inOut',
                onComplete: () => {
                    headerContent.style.display = 'none';
                    header.classList.remove('expanded');
                    showHeaderBtn.style.display = 'block';
                    showHeaderBtn.classList.remove('bottom-position');
                }
            });
    } else {
        // Expand the header
        header.classList.add('expanded');
        headerContent.style.display = 'flex';
        gsap.timeline()
            .fromTo(headerContent, {
                height: 0,
                opacity: 0
            }, {
                height: 'auto',
                opacity: 1,
                duration: 0.7,
                ease: 'power3.inOut',
                onStart: () => {
                    showHeaderBtn.style.display = 'block';
                    showHeaderBtn.classList.add('bottom-position');
                }
            })
            .fromTo(headerContent.querySelectorAll('h2, nav, .theme-slider'), {
                opacity: 0,
                y: 20
            }, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'power3.inOut',
                stagger: 0.05
            }, "-=0.4");
    }
});

window.addEventListener('resize', handleHeaderVisibility);
document.addEventListener('DOMContentLoaded', handleHeaderVisibility);

/* --- Theme Toggle Functionality --- */
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Load theme from localStorage
    if (localStorage.getItem('theme') === 'dark') {
        themeToggle.checked = true;
        body.classList.remove('light');
        body.classList.add('dark');
    } else {
        themeToggle.checked = false;
        body.classList.remove('dark');
        body.classList.add('light');
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.remove('light');
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark');
            body.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    });
});


/* --- 3D Particle Background with Asteroids --- */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Stars (particle effect)
const starCount = 12000;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
const starColors = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 76;
    starPositions[i + 1] = (Math.random() - 0.5) * 76;
    starPositions[i + 2] = (Math.random() - 0.5) * 76;
    starColors[i] = 0.8 + Math.random() * 0.2;
    starColors[i + 1] = 0.8 + Math.random() * 0.2;
    starColors[i + 2] = 1.0;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
const starMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    map: (() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        context.beginPath();
        context.arc(16, 16, 16, 0, Math.PI * 2);
        context.fillStyle = 'white';
        context.fill();
        return new THREE.CanvasTexture(canvas);
    })(),
    depthWrite: false
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Asteroids
const asteroidCount = 50;
const asteroids = [];
for (let i = 0; i < asteroidCount; i++) {
    const size = 0.5 + Math.random() * 2;
    const geometry = new THREE.IcosahedronGeometry(size, Math.floor(Math.random() * 2));
    const material = new THREE.MeshBasicMaterial({
        color: 0x666666,
        wireframe: true,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3
    });
    const asteroid = new THREE.Mesh(geometry, material);
    asteroid.position.set(
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 150
    );
    asteroid.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );
    asteroid.userData = {
        rotSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.005,
            (Math.random() - 0.5) * 0.005,
            (Math.random() - 0.5) * 0.005
        ),
        drift: new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        )
    };
    scene.add(asteroid);
    asteroids.push(asteroid);
}

camera.position.z = 50;

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animateBackground() {
    requestAnimationFrame(animateBackground);
    stars.rotation.y += 0.0002;
    asteroids.forEach(asteroid => {
        asteroid.rotation.x += asteroid.userData.rotSpeed.x;
        asteroid.rotation.y += asteroid.userData.rotSpeed.y;
        asteroid.rotation.z += asteroid.userData.rotSpeed.z;
        asteroid.position.add(asteroid.userData.drift);
        if (asteroid.position.length() > 100) {
            asteroid.position.set(
                (Math.random() - 0.5) * 150,
                (Math.random() - 0.5) * 150,
                (Math.random() - 0.5) * 150
            );
        }
    });
    gsap.to(stars.rotation, {
        x: mouseY * 0.1,
        y: mouseX * 0.1,
        duration: 1.2,
        ease: 'power2.out'
    });
    renderer.render(scene, camera);
}
animateBackground();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* --- Project Cards 3D Effects --- */
const projects = document.querySelectorAll('.project');
projects.forEach((projectCard, index) => {
    const canvas = projectCard.querySelector('.project-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true });
    const icosahedron = new THREE.Mesh(geometry, material);
    scene.add(icosahedron);
    camera.position.z = 5;

    function animateCard() {
        requestAnimationFrame(animateCard);
        icosahedron.rotation.x += 0.008;
        icosahedron.rotation.y += 0.008;
        renderer.render(scene, camera);
    }
    animateCard();

    projectCard.addEventListener('mousemove', (e) => {
        const rect = projectCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(icosahedron.rotation, {
            x: y * 0.6,
            y: x * 0.6,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
});

/* --- GSAP Scroll Animations --- */
gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray('section').forEach((section) => {
    gsap.to(section, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
        }
    });
});

/* --- Skills Progress Bars Animation --- */
const progressBars = document.querySelectorAll('.progress');
progressBars.forEach((bar) => {
    const percentage = bar.getAttribute('data-percentage');
    gsap.to(bar, {
        width: `${percentage}%`,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: bar,
            start: 'top 85%',
            toggleActions: 'play none none reset'
        }
    });
    gsap.to(bar.querySelector('span'), {
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: bar,
            start: 'top 85%',
            toggleActions: 'play none none reset'
        }
    });
});

/* --- Profile Picture Tilt Effect --- */
const profilePic = document.getElementById('profile-pic');
profilePic.addEventListener('mousemove', (e) => {
    const rect = profilePic.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(profilePic, {
        rotationY: x * 25,
        rotationX: -y * 25,
        ease: 'power3.out',
        duration: 0.6
    });
});
profilePic.addEventListener('mouseleave', () => {
    gsap.to(profilePic, {
        rotationY: 0,
        rotationX: 0,
        ease: 'power3.out',
        duration: 0.6
    });
});

/* --- Contact Form Handling --- */
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Form submitted! In a real application, this would send an email to the owner.');
    contactForm.reset();
});

/* --- Chatbox Functionality --- */
const chatbox = document.getElementById('chatbox');
const chatToggle = document.getElementById('chat-toggle');
const chatboxClose = document.getElementById('chatbox-close');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatboxBody = document.getElementById('chatbox-body');
const my_fullname = "Joy Sengupta";
const myDescription = "AIML Undergrad with a passion for exploring the intersection of technology and creativity. Profession: AIML Undergrad at NiT. Hobbies: Coding, Listening to Music, Photography and Playing Video Games , Problem Solving, Watching Movies ,  Logic Building. Skills: Python , C , C++ , HTML5 , CSS , MS Office , MS Excel. Projects: OPTIMUS a Virtual Assistant using python and API, Number Guessing Game, Snake-Water-Gun Game, Auto Chat Replier , Calculator , PDf Merger and so on in GitHub: https://github.com/Joy-S-07, Contact: joysengupta521@gmail.com, LinkedIn: https://www.linkedin.com/in/joy-sengupta-4469bb338/";
const GEMINI_API_KEY = "AIzaSyCDgC_VPd1oorXQ_4AD_1bCFOioaslQRy4"; // Replace with actual Gemini API key

function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    msg.innerText = text;
    msg.style.color = '#000000';
    chatboxBody.appendChild(msg);
    chatboxBody.scrollTop = chatboxBody.scrollHeight;
}

function showInitialMessage() {
    chatboxBody.innerHTML = '';
    appendMessage('bot', `Hi, I am ${my_fullname}'s Assistant. What do you want to know about Joy?`);
}

async function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage('user', text);
    chatInput.value = '';

    const typingMsg = document.createElement('div');
    typingMsg.className = 'chat-message bot';
    typingMsg.innerText = '...';
    chatboxBody.appendChild(typingMsg);
    chatboxBody.scrollTop = chatboxBody.scrollHeight;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `User_message:${text}. Reply naturally to the usermessage and if required then answer based on: ${myDescription} or just simply give friendly reply .and reply in a way that Joy Sengupta's Assistant is talking .reply in short sentences and remove the "Hey there" from the starting of each reply`
                    }]
                }]
            })
        });
        const data = await response.json();
        typingMsg.remove();
        let reply = "Sorry, I couldn't get a response.";
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
            reply = data.candidates[0].content.parts[0].text;
        }
        appendMessage('bot', reply);
    } catch (e) {
        typingMsg.remove();
        appendMessage('bot', "Sorry, there was an error...");
    }
}

chatToggle.addEventListener('click', () => {
    chatbox.style.display = 'flex';
    chatToggle.style.display = 'none';
    gsap.to(chatbox, {
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
        onStart: () => {
            chatbox.classList.add('active');
            showInitialMessage();
        }
    });
    setTimeout(() => chatInput.focus(), 200);
});

chatboxClose.addEventListener('click', () => {
    gsap.to(chatbox, {
        scale: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
            chatbox.style.display = 'none';
            chatToggle.style.display = 'block';
            chatbox.classList.remove('active');
        }
    });
});

chatSendBtn.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});

let lastScrollY = window.scrollY;

// Hide/show on scroll
window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > lastScrollY && window.scrollY > 80) {
        header.classList.add('hide-on-scroll');
        headerHidden = true;
    } else {
        header.classList.remove('hide-on-scroll');
        headerHidden = false;
    }
    lastScrollY = window.scrollY;
});

// Show header if mouse is near the top (when hidden)
document.addEventListener('mousemove', (e) => {
    if (headerHidden && e.clientY < 60) {
        header.classList.remove('hide-on-scroll');
        headerHidden = false;
    }
});


