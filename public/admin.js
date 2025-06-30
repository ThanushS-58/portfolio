// Admin panel JavaScript
let currentEditId = null;

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Activate nav button
    event.target.classList.add('active');
    
    // Load data for the section
    loadSectionData(sectionName);
}

// Load data for specific sections
async function loadSectionData(section) {
    switch(section) {
        case 'profile':
            await loadProfile();
            break;
        case 'education':
            await loadEducation();
            break;
        case 'experience':
            await loadExperience();
            break;
        case 'projects':
            await loadProjects();
            break;
        case 'skills':
            await loadSkills();
            break;
        case 'awards':
            await loadAwards();
            break;
    }
}

// API functions
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        showError(`Request failed: ${error.message}`);
        throw error;
    }
}

// Profile functions
async function loadProfile() {
    try {
        const profile = await apiRequest('/api/profile');
        if (profile) {
            populateForm('profileForm', profile);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Education functions
async function loadEducation() {
    try {
        const education = await apiRequest('/api/education');
        displayEducationList(education);
    } catch (error) {
        console.error('Error loading education:', error);
    }
}

function displayEducationList(education) {
    const list = document.getElementById('educationList');
    list.innerHTML = '';
    
    education.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div>
                <strong>${item.degree}</strong> - ${item.institution}
                <br><small>${item.duration} | ${item.grade || 'N/A'}</small>
            </div>
            <div class="item-actions">
                <button class="btn-small btn-edit" onclick="editEducation(${item.id})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteEducation(${item.id})">Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Experience functions
async function loadExperience() {
    try {
        const experience = await apiRequest('/api/experience');
        displayExperienceList(experience);
    } catch (error) {
        console.error('Error loading experience:', error);
    }
}

function displayExperienceList(experience) {
    const list = document.getElementById('experienceList');
    list.innerHTML = '';
    
    experience.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div>
                <strong>${item.title}</strong> - ${item.company}
                <br><small>${item.duration} | ${item.type}</small>
            </div>
            <div class="item-actions">
                <button class="btn-small btn-edit" onclick="editExperience(${item.id})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteExperience(${item.id})">Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Projects functions
async function loadProjects() {
    try {
        const projects = await apiRequest('/api/projects');
        displayProjectsList(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function displayProjectsList(projects) {
    const list = document.getElementById('projectsList');
    list.innerHTML = '';
    
    projects.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div>
                <strong>${item.title}</strong>
                <br><small>${item.technologies ? item.technologies.join(', ') : 'No technologies listed'}</small>
            </div>
            <div class="item-actions">
                <button class="btn-small btn-edit" onclick="editProject(${item.id})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteProject(${item.id})">Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Skills functions
async function loadSkills() {
    try {
        const skills = await apiRequest('/api/skills');
        displaySkillsList(skills);
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

function displaySkillsList(skills) {
    const list = document.getElementById('skillsList');
    list.innerHTML = '';
    
    skills.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div>
                <strong>${item.name}</strong> - ${item.level}
                <br><small>${item.category} | ${item.percentage}%</small>
            </div>
            <div class="item-actions">
                <button class="btn-small btn-edit" onclick="editSkill(${item.id})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteSkill(${item.id})">Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Awards functions
async function loadAwards() {
    try {
        const awards = await apiRequest('/api/awards');
        displayAwardsList(awards);
    } catch (error) {
        console.error('Error loading awards:', error);
    }
}

function displayAwardsList(awards) {
    const list = document.getElementById('awardsList');
    list.innerHTML = '';
    
    awards.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div>
                <strong>${item.title}</strong> - ${item.year}
                <br><small>${item.type} | ${item.event || item.issuer || 'N/A'}</small>
            </div>
            <div class="item-actions">
                <button class="btn-small btn-edit" onclick="editAward(${item.id})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteAward(${item.id})">Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Form handling functions
function populateForm(formId, data) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    
    for (let key in data) {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            if (Array.isArray(data[key])) {
                input.value = data[key].join('\n');
            } else {
                input.value = data[key] || '';
            }
        }
    }
}

function getFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (key === 'skills' || key === 'technologies' || key === 'features') {
            // Handle array fields
            data[key] = value.split('\n').filter(item => item.trim() !== '');
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

// Edit functions
async function editEducation(id) {
    try {
        const item = await apiRequest(`/api/education/${id}`);
        populateForm('educationForm', item);
        currentEditId = id;
        document.querySelector('#educationForm button[type="submit"]').textContent = 'Update Education';
    } catch (error) {
        console.error('Error loading education item:', error);
    }
}

async function editExperience(id) {
    try {
        const item = await apiRequest(`/api/experience/${id}`);
        populateForm('experienceForm', item);
        currentEditId = id;
        document.querySelector('#experienceForm button[type="submit"]').textContent = 'Update Experience';
    } catch (error) {
        console.error('Error loading experience item:', error);
    }
}

async function editProject(id) {
    try {
        const item = await apiRequest(`/api/projects/${id}`);
        populateForm('projectsForm', item);
        currentEditId = id;
        document.querySelector('#projectsForm button[type="submit"]').textContent = 'Update Project';
    } catch (error) {
        console.error('Error loading project item:', error);
    }
}

async function editSkill(id) {
    try {
        const item = await apiRequest(`/api/skills/${id}`);
        populateForm('skillsForm', item);
        currentEditId = id;
        document.querySelector('#skillsForm button[type="submit"]').textContent = 'Update Skill';
    } catch (error) {
        console.error('Error loading skill item:', error);
    }
}

async function editAward(id) {
    try {
        const item = await apiRequest(`/api/awards/${id}`);
        populateForm('awardsForm', item);
        currentEditId = id;
        document.querySelector('#awardsForm button[type="submit"]').textContent = 'Update Award';
    } catch (error) {
        console.error('Error loading award item:', error);
    }
}

// Delete functions
async function deleteEducation(id) {
    if (confirm('Are you sure you want to delete this education entry?')) {
        try {
            await apiRequest(`/api/education/${id}`, { method: 'DELETE' });
            showSuccess('Education entry deleted successfully');
            loadEducation();
        } catch (error) {
            console.error('Error deleting education:', error);
        }
    }
}

async function deleteExperience(id) {
    if (confirm('Are you sure you want to delete this experience entry?')) {
        try {
            await apiRequest(`/api/experience/${id}`, { method: 'DELETE' });
            showSuccess('Experience entry deleted successfully');
            loadExperience();
        } catch (error) {
            console.error('Error deleting experience:', error);
        }
    }
}

async function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            await apiRequest(`/api/projects/${id}`, { method: 'DELETE' });
            showSuccess('Project deleted successfully');
            loadProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    }
}

async function deleteSkill(id) {
    if (confirm('Are you sure you want to delete this skill?')) {
        try {
            await apiRequest(`/api/skills/${id}`, { method: 'DELETE' });
            showSuccess('Skill deleted successfully');
            loadSkills();
        } catch (error) {
            console.error('Error deleting skill:', error);
        }
    }
}

async function deleteAward(id) {
    if (confirm('Are you sure you want to delete this award?')) {
        try {
            await apiRequest(`/api/awards/${id}`, { method: 'DELETE' });
            showSuccess('Award deleted successfully');
            loadAwards();
        } catch (error) {
            console.error('Error deleting award:', error);
        }
    }
}

// Message functions
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Form submit handlers
document.addEventListener('DOMContentLoaded', function() {
    // Profile form
    document.getElementById('profileForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        try {
            const data = getFormData('profileForm');
            await apiRequest('/api/profile', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            showSuccess('Profile updated successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    });

    // Education form
    document.getElementById('educationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        try {
            const data = getFormData('educationForm');
            const method = currentEditId ? 'PUT' : 'POST';
            const url = currentEditId ? `/api/education/${currentEditId}` : '/api/education';
            
            await apiRequest(url, {
                method: method,
                body: JSON.stringify(data)
            });
            
            showSuccess(currentEditId ? 'Education updated successfully' : 'Education added successfully');
            this.reset();
            currentEditId = null;
            document.querySelector('#educationForm button[type="submit"]').textContent = 'Add Education';
            loadEducation();
        } catch (error) {
            console.error('Error saving education:', error);
        }
    });

    // Experience form
    document.getElementById('experienceForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        try {
            const data = getFormData('experienceForm');
            const method = currentEditId ? 'PUT' : 'POST';
            const url = currentEditId ? `/api/experience/${currentEditId}` : '/api/experience';
            
            await apiRequest(url, {
                method: method,
                body: JSON.stringify(data)
            });
            
            showSuccess(currentEditId ? 'Experience updated successfully' : 'Experience added successfully');
            this.reset();
            currentEditId = null;
            document.querySelector('#experienceForm button[type="submit"]').textContent = 'Add Experience';
            loadExperience();
        } catch (error) {
            console.error('Error saving experience:', error);
        }
    });

    // Projects form
    document.getElementById('projectsForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        try {
            const data = getFormData('projectsForm');
            const method = currentEditId ? 'PUT' : 'POST';
            const url = currentEditId ? `/api/projects/${currentEditId}` : '/api/projects';
            
            await apiRequest(url, {
                method: method,
                body: JSON.stringify(data)
            });
            
            showSuccess(currentEditId ? 'Project updated successfully' : 'Project added successfully');
            this.reset();
            currentEditId = null;
            document.querySelector('#projectsForm button[type="submit"]').textContent = 'Add Project';
            loadProjects();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    });

    // Skills form
    document.getElementById('skillsForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        try {
            const data = getFormData('skillsForm');
            const method = currentEditId ? 'PUT' : 'POST';
            const url = currentEditId ? `/api/skills/${currentEditId}` : '/api/skills';
            
            await apiRequest(url, {
                method: method,
                body: JSON.stringify(data)
            });
            
            showSuccess(currentEditId ? 'Skill updated successfully' : 'Skill added successfully');
            this.reset();
            currentEditId = null;
            document.querySelector('#skillsForm button[type="submit"]').textContent = 'Add Skill';
            loadSkills();
        } catch (error) {
            console.error('Error saving skill:', error);
        }
    });

    // Awards form
    document.getElementById('awardsForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        try {
            const data = getFormData('awardsForm');
            const method = currentEditId ? 'PUT' : 'POST';
            const url = currentEditId ? `/api/awards/${currentEditId}` : '/api/awards';
            
            await apiRequest(url, {
                method: method,
                body: JSON.stringify(data)
            });
            
            showSuccess(currentEditId ? 'Award updated successfully' : 'Award added successfully');
            this.reset();
            currentEditId = null;
            document.querySelector('#awardsForm button[type="submit"]').textContent = 'Add Award/Certification';
            loadAwards();
        } catch (error) {
            console.error('Error saving award:', error);
        }
    });

    // Load initial data
    loadProfile();
});