// Simple admin panel for portfolio management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel loaded');

    // Simple login check (for demo purposes)
    const loginButton = document.querySelector('#login-btn');
    const adminContent = document.querySelector('#admin-content');
    const loginForm = document.querySelector('#login-form');

    if (loginButton) {
        loginButton.addEventListener('click', function() {
            const username = document.querySelector('#username').value;
            const password = document.querySelector('#password').value;

            // Simple demo authentication
            if (username === 'admin' && password === 'portfolio123') {
                if (loginForm) loginForm.style.display = 'none';
                if (adminContent) adminContent.style.display = 'block';
            } else {
                alert('Invalid credentials. Use admin/portfolio123 for demo.');
            }
        });
    }

    // Portfolio management functions (demo)
    const addProjectBtn = document.querySelector('#add-project');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function() {
            alert('Project management feature - demo only');
        });
    }

    const updateSkillsBtn = document.querySelector('#update-skills');
    if (updateSkillsBtn) {
        updateSkillsBtn.addEventListener('click', function() {
            alert('Skills update feature - demo only');
        });
    }
});