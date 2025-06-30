// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Load portfolio data from API
async function loadPortfolioData() {
    try {
        const response = await fetch('/api/portfolio-data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Update profile data
        if (data.profile) {
            updateProfileData(data.profile);
        }
        
        // Update sections with data
        if (data.education) updateEducationSection(data.education);
        if (data.experience) updateExperienceSection(data.experience);
        if (data.projects) updateProjectsSection(data.projects);
        if (data.skills) updateSkillsSection(data.skills);
        if (data.awards) updateAwardsSection(data.awards);
        
    } catch (error) {
        console.log('Using static content - API not available');
        // Fallback to static content already in HTML
    }
}

function updateProfileData(profile) {
    // Update hero section if profile data exists
    if (profile.name) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = `Hi, I'm <span class="gradient-text">${profile.name}</span>`;
        }
    }
    
    if (profile.title) {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.textContent = profile.title;
        }
    }
    
    if (profile.professional_summary) {
        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) {
            heroDescription.textContent = profile.professional_summary;
        }
    }
}

function updateEducationSection(education) {
    const container = document.querySelector('.education-grid');
    if (!container || education.length === 0) return;
    
    container.innerHTML = education.map(edu => `
        <div class="education-card animate-on-scroll">
            <div class="education-details">
                <h3>${edu.degree}</h3>
                <span class="duration">${edu.duration}</span>
            </div>
            <h4>${edu.institution}</h4>
            ${edu.grade ? `<p class="grade">Grade: ${edu.grade}</p>` : ''}
            ${edu.description ? `<p>${edu.description}</p>` : ''}
        </div>
    `).join('');
}

function updateExperienceSection(experience) {
    const container = document.querySelector('.experience-grid');
    if (!container || experience.length === 0) return;
    
    container.innerHTML = experience.map(exp => `
        <div class="experience-card animate-on-scroll">
            <div class="experience-header">
                <h3>${exp.title}</h3>
                <h4>${exp.company}</h4>
                <span class="duration">${exp.duration}</span>
            </div>
            <p>${exp.description}</p>
            ${exp.skills ? `
                <div class="experience-skills">
                    ${exp.skills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function updateProjectsSection(projects) {
    const container = document.querySelector('.projects-grid');
    if (!container || projects.length === 0) return;
    
    container.innerHTML = projects.map(project => `
        <div class="project-card animate-on-scroll">
            <div class="project-header">
                <h3>${project.title}</h3>
                ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="project-link"><i class="fab fa-github"></i></a>` : ''}
            </div>
            <div class="project-content">
                <p>${project.description}</p>
                ${project.technologies ? `
                    <div class="project-tech">
                        ${project.technologies.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('')}
                    </div>
                ` : ''}
                ${project.features ? `
                    <div class="project-features">
                        <h4>Key Features:</h4>
                        <ul>
                            ${project.features.split(',').map(feature => `<li>${feature.trim()}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function updateSkillsSection(skills) {
    const container = document.querySelector('.skills-grid');
    if (!container || skills.length === 0) return;
    
    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
    }, {});
    
    container.innerHTML = Object.entries(skillsByCategory).map(([category, categorySkills]) => `
        <div class="skill-category">
            <h3>${category}</h3>
            <div class="skills-list">
                ${categorySkills.map(skill => `
                    <div class="skill-item animate-on-scroll">
                        <div class="skill-info">
                            <span class="skill-name">${skill.name}</span>
                            <span class="skill-level">${skill.level}</span>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: ${skill.percentage || 0}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function updateAwardsSection(awards) {
    const container = document.querySelector('.awards-grid');
    if (!container || awards.length === 0) return;
    
    container.innerHTML = awards.map(award => `
        <div class="award-item animate-on-scroll">
            <h3>${award.title}</h3>
            <h4>${award.event}</h4>
            <span class="award-year">${award.year}</span>
            ${award.description ? `<p>${award.description}</p>` : ''}
        </div>
    `).join('');
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add animation class to elements
document.addEventListener('DOMContentLoaded', () => {
    // Load portfolio data first
    loadPortfolioData().then(() => {
        // Then set up animations
        const animateElements = document.querySelectorAll('.education-card, .experience-card, .volunteer-card, .project-card, .skill-item, .award-item, .certification-item');
        
        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    });
});

// Skill bar animations
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBar = entry.target;
            const width = skillBar.style.width;
            skillBar.style.width = '0%';
            setTimeout(() => {
                skillBar.style.width = width;
            }, 300);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Create mailto link
        const mailtoLink = `mailto:thanush205s@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showNotification('Thank you! Your email client should open with the message ready to send.', 'success');
        
        // Reset form
        contactForm.reset();
    });
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    const closeBtn = notification.querySelector('button');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on load
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
});

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.education-card, .experience-card, .volunteer-card, .project-card, .award-item, .certification-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styles
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);