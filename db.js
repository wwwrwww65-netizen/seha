const API_BASE = 'api/';

const DB = {
    _currentUser: null,

    async init() {
        // Authenticate session via backend
        try {
            const res = await fetch(API_BASE + 'auth.php?action=me');
            const data = await res.json();
            if (data.status === 'success') {
                this._currentUser = data.user;
            } else {
                this._currentUser = null;
            }
        } catch(e) {
            this._currentUser = null;
        }
    },

    async requireAuth() {
        await this.init();
        if (!this._currentUser) {
            window.location.href = 'login';
        }
    },

    async redirectIfLoggedIn() {
        await this.init();
        if (this._currentUser) {
            window.location.href = 'dashboard';
        }
    },

    async login(username, password) {
        try {
            const res = await fetch(API_BASE + 'auth.php?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            return data.status; // 'success', 'inactive', 'error'
        } catch(e) {
            return 'error';
        }
    },

    async logout() {
        await fetch(API_BASE + 'auth.php?action=logout');
        this._currentUser = null;
    },

    getCurrentUser() {
        return this._currentUser;
    },

    hasPermission(permName) {
        if (!this._currentUser || !this._currentUser.permissions) return false;
        return this._currentUser.permissions[permName] === true || this._currentUser.permissions[permName] === 1;
    },

    async getUsers() {
        const res = await fetch(API_BASE + 'users.php?action=list');
        const data = await res.json();
        return data.data || [];
    },

    async addUser(username, password, role, permissions, status) {
        const res = await fetch(API_BASE + 'users.php?action=add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role, permissions, status })
        });
        const data = await res.json();
        if(data.status !== 'success') throw new Error(data.message);
    },

    async updateUser(id, updateData, oldPassword = null) {
        const res = await fetch(API_BASE + 'users.php?action=update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, data: updateData, oldPassword })
        });
        const data = await res.json();
        if(data.status !== 'success') throw new Error(data.message);
    },

    async deleteUser(id) {
        const res = await fetch(API_BASE + 'users.php?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if(data.status !== 'success') throw new Error(data.message);
    },

    async toggleUserStatus(id) {
        const res = await fetch(API_BASE + 'users.php?action=toggle_status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if(data.status !== 'success') throw new Error(data.message);
    },

    async getLeaves() {
        const res = await fetch(API_BASE + 'leaves.php?action=list');
        const data = await res.json();
        return data.data || [];
    },

    async getLeave(id) {
        const res = await fetch(API_BASE + 'leaves.php?action=get&id=' + id);
        const data = await res.json();
        if(data.status !== 'success') throw new Error('Not found');
        return data.data;
    },

    async saveLeave(leaveData) {
        // تحديد الإجراء: تعديل إذا كان هناك oldId، إضافة إذا لم يكن هناك id
        const action = leaveData.oldId ? 'edit' : (leaveData.id ? 'add' : 'add');
        const res = await fetch(API_BASE + 'leaves.php?action=' + action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leaveData)
        });
        const data = await res.json();
        if(data.status !== 'success') throw new Error(data.message || 'حدث خطأ غير متوقع');
    },

    async deleteLeave(id) {
        const res = await fetch(API_BASE + 'leaves.php?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if(data.status !== 'success') throw new Error(data.message);
    },

    async deleteMultipleLeaves(ids) {
        const res = await fetch(API_BASE + 'leaves.php?action=delete_multiple', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
        });
        const data = await res.json();
        if(data.status !== 'success') throw new Error(data.message);
    }
};
