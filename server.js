const express = require('express');
const path = require('path');
// Database setup
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const ws = require("ws");

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

// Simple table references for direct SQL operations
const tableNames = {
    profile: 'profile',
    education: 'education', 
    experience: 'experience',
    projects: 'projects',
    skills: 'skills',
    awards: 'awards'
};
const { eq } = require('drizzle-orm');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API Routes

// Profile routes
app.get('/api/profile', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM profile LIMIT 1');
        const profileData = result.rows[0] || {};
        res.json(profileData);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

app.post('/api/profile', async (req, res) => {
    try {
        const existingResult = await pool.query('SELECT * FROM profile LIMIT 1');
        
        if (existingResult.rows.length > 0) {
            // Update existing profile
            const { name, title, email, phone, location, birthDate, careerObjective, professionalSummary, profileImageUrl, linkedinUrl, githubUrl } = req.body;
            const updateResult = await pool.query(
                `UPDATE profile SET 
                name = $1, title = $2, email = $3, phone = $4, location = $5, 
                birth_date = $6, career_objective = $7, professional_summary = $8, 
                profile_image_url = $9, linkedin_url = $10, github_url = $11, updated_at = NOW()
                WHERE id = $12 RETURNING *`,
                [name, title, email, phone, location, birthDate, careerObjective, professionalSummary, profileImageUrl, linkedinUrl, githubUrl, existingResult.rows[0].id]
            );
            res.json(updateResult.rows[0]);
        } else {
            // Create new profile
            const { name, title, email, phone, location, birthDate, careerObjective, professionalSummary, profileImageUrl, linkedinUrl, githubUrl } = req.body;
            const insertResult = await pool.query(
                `INSERT INTO profile (name, title, email, phone, location, birth_date, career_objective, professional_summary, profile_image_url, linkedin_url, github_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
                [name, title, email, phone, location, birthDate, careerObjective, professionalSummary, profileImageUrl, linkedinUrl, githubUrl]
            );
            res.json(insertResult.rows[0]);
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ error: 'Failed to save profile' });
    }
});

// Education routes
app.get('/api/education', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM education ORDER BY start_year, created_at');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching education:', error);
        res.status(500).json({ error: 'Failed to fetch education' });
    }
});

app.get('/api/education/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM education WHERE id = $1', [parseInt(req.params.id)]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Education not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching education item:', error);
        res.status(500).json({ error: 'Failed to fetch education item' });
    }
});

app.post('/api/education', async (req, res) => {
    try {
        const { degree, institution, duration, grade, description, startYear, endYear } = req.body;
        const result = await pool.query(
            'INSERT INTO education (degree, institution, duration, grade, description, start_year, end_year) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [degree, institution, duration, grade, description, startYear, endYear]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating education:', error);
        res.status(500).json({ error: 'Failed to create education' });
    }
});

app.put('/api/education/:id', async (req, res) => {
    try {
        const { degree, institution, duration, grade, description, startYear, endYear } = req.body;
        const result = await pool.query(
            'UPDATE education SET degree = $1, institution = $2, duration = $3, grade = $4, description = $5, start_year = $6, end_year = $7 WHERE id = $8 RETURNING *',
            [degree, institution, duration, grade, description, startYear, endYear, parseInt(req.params.id)]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating education:', error);
        res.status(500).json({ error: 'Failed to update education' });
    }
});

app.delete('/api/education/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM education WHERE id = $1', [parseInt(req.params.id)]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting education:', error);
        res.status(500).json({ error: 'Failed to delete education' });
    }
});

// Experience routes
app.get('/api/experience', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM experience ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching experience:', error);
        res.status(500).json({ error: 'Failed to fetch experience' });
    }
});

app.get('/api/experience/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM experience WHERE id = $1', [parseInt(req.params.id)]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Experience not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching experience item:', error);
        res.status(500).json({ error: 'Failed to fetch experience item' });
    }
});

app.post('/api/experience', async (req, res) => {
    try {
        const { title, company, duration, description, skills, type } = req.body;
        const result = await pool.query(
            'INSERT INTO experience (title, company, duration, description, skills, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, company, duration, description, skills, type || 'work']
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating experience:', error);
        res.status(500).json({ error: 'Failed to create experience' });
    }
});

app.put('/api/experience/:id', async (req, res) => {
    try {
        const { title, company, duration, description, skills, type } = req.body;
        const result = await pool.query(
            'UPDATE experience SET title = $1, company = $2, duration = $3, description = $4, skills = $5, type = $6 WHERE id = $7 RETURNING *',
            [title, company, duration, description, skills, type, parseInt(req.params.id)]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating experience:', error);
        res.status(500).json({ error: 'Failed to update experience' });
    }
});

app.delete('/api/experience/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM experience WHERE id = $1', [parseInt(req.params.id)]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting experience:', error);
        res.status(500).json({ error: 'Failed to delete experience' });
    }
});

// Projects routes
app.get('/api/projects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.get('/api/projects/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects WHERE id = $1', [parseInt(req.params.id)]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching project item:', error);
        res.status(500).json({ error: 'Failed to fetch project item' });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const { title, description, technologies, features, projectUrl, githubUrl } = req.body;
        const result = await pool.query(
            'INSERT INTO projects (title, description, technologies, features, project_url, github_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, technologies, features, projectUrl, githubUrl]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    try {
        const { title, description, technologies, features, projectUrl, githubUrl } = req.body;
        const result = await pool.query(
            'UPDATE projects SET title = $1, description = $2, technologies = $3, features = $4, project_url = $5, github_url = $6 WHERE id = $7 RETURNING *',
            [title, description, technologies, features, projectUrl, githubUrl, parseInt(req.params.id)]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM projects WHERE id = $1', [parseInt(req.params.id)]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Skills routes
app.get('/api/skills', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM skills ORDER BY category, name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

app.get('/api/skills/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM skills WHERE id = $1', [parseInt(req.params.id)]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching skill item:', error);
        res.status(500).json({ error: 'Failed to fetch skill item' });
    }
});

app.post('/api/skills', async (req, res) => {
    try {
        const { name, level, category, percentage } = req.body;
        const result = await pool.query(
            'INSERT INTO skills (name, level, category, percentage) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, level, category, percentage || 0]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({ error: 'Failed to create skill' });
    }
});

app.put('/api/skills/:id', async (req, res) => {
    try {
        const { name, level, category, percentage } = req.body;
        const result = await pool.query(
            'UPDATE skills SET name = $1, level = $2, category = $3, percentage = $4 WHERE id = $5 RETURNING *',
            [name, level, category, percentage, parseInt(req.params.id)]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({ error: 'Failed to update skill' });
    }
});

app.delete('/api/skills/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM skills WHERE id = $1', [parseInt(req.params.id)]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ error: 'Failed to delete skill' });
    }
});

// Awards routes
app.get('/api/awards', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM awards ORDER BY year DESC, title');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching awards:', error);
        res.status(500).json({ error: 'Failed to fetch awards' });
    }
});

app.get('/api/awards/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM awards WHERE id = $1', [parseInt(req.params.id)]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Award not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching award item:', error);
        res.status(500).json({ error: 'Failed to fetch award item' });
    }
});

app.post('/api/awards', async (req, res) => {
    try {
        const { title, event, year, description, type, issuer } = req.body;
        const result = await pool.query(
            'INSERT INTO awards (title, event, year, description, type, issuer) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, event, year, description, type || 'award', issuer]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating award:', error);
        res.status(500).json({ error: 'Failed to create award' });
    }
});

app.put('/api/awards/:id', async (req, res) => {
    try {
        const { title, event, year, description, type, issuer } = req.body;
        const result = await pool.query(
            'UPDATE awards SET title = $1, event = $2, year = $3, description = $4, type = $5, issuer = $6 WHERE id = $7 RETURNING *',
            [title, event, year, description, type, issuer, parseInt(req.params.id)]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating award:', error);
        res.status(500).json({ error: 'Failed to update award' });
    }
});

app.delete('/api/awards/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM awards WHERE id = $1', [parseInt(req.params.id)]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting award:', error);
        res.status(500).json({ error: 'Failed to delete award' });
    }
});

// Portfolio data API for frontend
app.get('/api/portfolio-data', async (req, res) => {
    try {
        const profileResult = await pool.query('SELECT * FROM profile LIMIT 1');
        const educationResult = await pool.query('SELECT * FROM education ORDER BY start_year');
        const experienceResult = await pool.query('SELECT * FROM experience ORDER BY created_at DESC');
        const projectsResult = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
        const skillsResult = await pool.query('SELECT * FROM skills ORDER BY category, name');
        const awardsResult = await pool.query('SELECT * FROM awards ORDER BY year DESC, title');

        res.json({
            profile: profileResult.rows[0] || {},
            education: educationResult.rows,
            experience: experienceResult.rows,
            projects: projectsResult.rows,
            skills: skillsResult.rows,
            awards: awardsResult.rows
        });
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio data' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running on port ${PORT}`);
    console.log(`Admin panel available at: http://localhost:${PORT}/admin`);
});