/**
 * User Models
 * Matching strict schema specifications
 */

class User {
    constructor(uid, email, role, profileData) {
        this.uid = uid;
        this.role = role; // 'researcher' | 'hospital' | 'admin'
        this.name = profileData.name || '';
        this.email = email;
        this.phone = profileData.phone || '';
        this.createdAt = new Date(); // timestamp

        // Specific profile fields based on role
        if (role === 'researcher') {
            this.institutionName = profileData.institutionName || '';
            this.department = profileData.department || '';
            this.projectTitle = profileData.projectTitle || '';
            this.projectDescription = profileData.projectDescription || '';
            this.researchFocus = profileData.researchFocus || []; // Array of strings e.g. ["breast cancer", "lung cancer"]
        } else if (role === 'hospital') {
            this.hospitalName = profileData.hospitalName || '';
            this.specialists = profileData.specialists || []; // Array of strings ["Dr. Name"]
            this.proName = profileData.proName || '';
            this.location = profileData.location || { city: '', state: '' };
        }
    }

    toJSON() {
        // Remove undefined values
        const obj = {
            role: this.role,
            name: this.name,
            email: this.email,
            phone: this.phone,
            createdAt: this.createdAt,
        };

        if (this.role === 'researcher') {
            obj.institutionName = this.institutionName;
            obj.department = this.department;
            obj.projectTitle = this.projectTitle;
            obj.projectDescription = this.projectDescription;
            obj.researchFocus = this.researchFocus;
        } else if (this.role === 'hospital') {
            obj.hospitalName = this.hospitalName;
            obj.specialists = this.specialists;
            obj.proName = this.proName;
            obj.location = this.location;
        }

        return obj;
    }
}

module.exports = { User };
