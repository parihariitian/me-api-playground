const API_BASE = "http://127.0.0.1:8000";
let currentProfile = null;

// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active');
        });
        
        // Add active class to clicked tab
        document.getElementById(tabName).classList.add('active');
        e.target.classList.add('active');
    });
});

// Fetch all profiles
async function fetchAllProfiles() {
    try {
        const response = await fetch(`${API_BASE}/profile`);
        const profiles = await response.json();
        
        const profilesList = document.getElementById('profilesList');
        profilesList.innerHTML = '';
        
        if (profiles.length === 0) {
            profilesList.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No profiles found</p>';
            return;
        }
        
        profiles.forEach(profile => {
            profilesList.innerHTML += createProfileCard(profile);
        });
        
        // Add click listeners to profile cards
        document.querySelectorAll('.profile-card').forEach(card => {
            card.addEventListener('click', () => {
                currentProfile = JSON.parse(card.dataset.profile);
                showProfileDetail(currentProfile);
            });
        });
    } catch (error) {
        showError('Error fetching profiles: ' + error.message);
    }
}

// Create profile card HTML
function createProfileCard(profile) {
    const skills = profile.skills.split(',').map(s => `<span class="skill-badge">${s.trim()}</span>`).join('');
    
    return `
        <div class="profile-card" data-profile='${JSON.stringify(profile)}'>
            <h3>${profile.name}</h3>
            <p class="email">📧 ${profile.email}</p>
            <p>📱 ${profile.phone}</p>
            <p>${profile.bio}</p>
            <div class="skills">${skills}</div>
        </div>
    `;
}

// Show profile detail in modal
function showProfileDetail(profile) {
    const detailContent = document.getElementById('detailContent');
    const skills = profile.skills.split(',').map(s => `<span class="skill-badge">${s.trim()}</span>`).join('');
    
    detailContent.innerHTML = `
        <h2>${profile.name}</h2>
        <div class="modal-detail">
            <p><label>ID:</label> ${profile.id}</p>
            <p><label>Email:</label> ${profile.email}</p>
            <p><label>Phone:</label> ${profile.phone}</p>
            <p><label>Bio:</label> ${profile.bio}</p>
            <p><label>Skills:</label></p>
            <div class="skills">${skills}</div>
            <p><label>Created:</label> ${new Date(profile.created_at).toLocaleString()}</p>
            <p><label>Updated:</label> ${new Date(profile.updated_at).toLocaleString()}</p>
        </div>
    `;
    
    document.getElementById('detailModal').style.display = 'block';
}

// Edit mode
function editMode() {
    document.getElementById('editId').value = currentProfile.id;
    document.getElementById('editName').value = currentProfile.name;
    document.getElementById('editPhone').value = currentProfile.phone;
    document.getElementById('editBio').value = currentProfile.bio;
    document.getElementById('editSkills').value = currentProfile.skills;
    
    closeModal();
    document.getElementById('editModal').style.display = 'block';
}

// Create new profile
async function createProfile(e) {
    e.preventDefault();
    
    const profileData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        bio: document.getElementById('bio').value,
        skills: document.getElementById('skills').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });
        
        if (response.ok) {
            showSuccess('Profile created successfully!');
            document.getElementById('createForm').reset();
            fetchAllProfiles();
        } else {
            const error = await response.json();
            showError(error.detail || 'Error creating profile');
        }
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

// Update profile
async function updateProfile(e) {
    e.preventDefault();
    
    const profileId = document.getElementById('editId').value;
    const updateData = {
        name: document.getElementById('editName').value,
        phone: document.getElementById('editPhone').value,
        bio: document.getElementById('editBio').value,
        skills: document.getElementById('editSkills').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/profile/${profileId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            showSuccess('Profile updated successfully!');
            closeEditModal();
            fetchAllProfiles();
        } else {
            showError('Error updating profile');
        }
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

// Delete profile
async function deleteProfile() {
    if (!confirm('Are you sure you want to delete this profile?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/profile/${currentProfile.id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showSuccess('Profile deleted successfully!');
            closeModal();
            fetchAllProfiles();
        } else {
            showError('Error deleting profile');
        }
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

// Search profiles
async function searchProfiles() {
    const query = document.getElementById('searchQuery').value;
    if (!query.trim()) {
        alert('Please enter a search term');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/profile/search?q=${encodeURIComponent(query)}`);
        const profiles = await response.json();
        
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';
        
        if (profiles.length === 0) {
            searchResults.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No results found</p>';
            return;
        }
        
        profiles.forEach(profile => {
            searchResults.innerHTML += createProfileCard(profile);
        });
        
        // Add click listeners
        document.querySelectorAll('.profile-card').forEach(card => {
            card.addEventListener('click', () => {
                currentProfile = JSON.parse(card.dataset.profile);
                showProfileDetail(currentProfile);
            });
        });
    } catch (error) {
        showError('Error searching profiles: ' + error.message);
    }
}

// Get top skills
async function getTopSkills() {
    const limit = document.getElementById('skillsLimit').value;
    console.log('Fetching top skills with limit:', limit);
    
    try {
        const url = `${API_BASE}/profile/skills/top?limit=${limit}`;
        console.log('API URL:', url);
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        const skills = await response.json();
        console.log('Skills data:', skills);
        
        const skillsList = document.getElementById('skillsList');
        skillsList.innerHTML = '';
        
        if (!skills || skills.length === 0) {
            skillsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No skills found</p>';
            return;
        }
        
        skills.forEach(skill => {
            skillsList.innerHTML += `
                <div class="skill-item">
                    <h3>${skill.skill}</h3>
                    <p>${skill.count} profile(s)</p>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error fetching skills:', error);
        showError('Error fetching skills: ' + error.message);
    }
}

// Modal functions
function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const detailModal = document.getElementById('detailModal');
    const editModal = document.getElementById('editModal');
    
    if (event.target === detailModal) {
        detailModal.style.display = 'none';
    }
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
}

// Show success message
function showSuccess(message) {
    const msgEl = document.getElementById('createMessage');
    msgEl.textContent = message;
    msgEl.classList.remove('error');
    msgEl.classList.add('success');
    setTimeout(() => msgEl.classList.remove('success'), 3000);
}

// Show error message
function showError(message) {
    const msgEl = document.getElementById('createMessage');
    msgEl.textContent = message;
    msgEl.classList.remove('success');
    msgEl.classList.add('error');
    setTimeout(() => msgEl.classList.remove('error'), 3000);
}

// Search on Enter key
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchQuery');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchProfiles();
        });
    }
});
