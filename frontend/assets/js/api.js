// API Configuration
const API_BASE_URL = 'http://localhost:8080';

/**
 * Validates a Brazilian CPF (individual taxpayer ID)
 * @param {string} cpf - The CPF to validate
 * @returns {boolean} True if the CPF is valid, false otherwise
 */
function validateCPF(cpf) {
    // Remove non-numeric characters
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Check if it has 11 digits
    if (cpf.length !== 11) {
        return false;
    }
    
    // Check if all digits are the same (invalid case)
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    // Validation of the first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cpf.charAt(9)) !== digit1) {
        return false;
    }
    
    // Validation of the second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cpf.charAt(10)) !== digit2) {
        return false;
    }
    
    return true;
}

/**
 * Validates a Brazilian CNPJ (business taxpayer ID)
 * @param {string} cnpj - The CNPJ to validate
 * @returns {boolean} True if the CNPJ is valid, false otherwise
 */
function validateCNPJ(cnpj) {
    // Remove non-numeric characters
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    // Check if it has 14 digits
    if (cnpj.length !== 14) {
        return false;
    }
    
    // Check if all digits are the same (invalid case)
    if (/^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }
    
    // Validation of the first check digit
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    let digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result != digits.charAt(0)) {
        return false;
    }
    
    // Validation of the second check digit
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result != digits.charAt(1)) {
        return false;
    }
    
    return true;
}

/**
 * Formats a CPF number to standard Brazilian format
 * @param {string} cpf - CPF to format
 * @returns {string} Formatted CPF (XXX.XXX.XXX-XX)
 */
function formatCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formats a CNPJ number to standard Brazilian format
 * @param {string} cnpj - CNPJ to format
 * @returns {string} Formatted CNPJ (XX.XXX.XXX/XXXX-XX)
 */
function formatCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, '');
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formats a Brazilian phone number based on its length
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
function formatPhone(phone) {
    phone = phone.replace(/[^\d]/g, '');
    
    // Mobile with 11 digits (with area code and 9 prefix)
    if (phone.length === 11) {
        return phone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    } 
    // Landline with 10 digits (with area code)
    else if (phone.length === 10) {
        return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    // Mobile with 9 digits (without area code)
    else if (phone.length === 9) {
        return phone.replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2-$3');
    }
    // Landline with 8 digits (without area code)
    else if (phone.length === 8) {
        return phone.replace(/(\d{4})(\d{4})/, '$1-$2');
    }
    
    // If it doesn't match any format, return as is
    return phone;
}

/**
 * Initialize the application when the DOM is fully loaded
 * Sets up event listeners and initial state
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements (using the ones already defined in the original code)
    const elements = {
        userTableBody: document.getElementById('userTableBody'),
        userForm: document.getElementById('userForm'),
        formTitle: document.getElementById('formTitle'),
        searchType: document.getElementById('searchType'),
        searchValue: document.getElementById('searchValue'),
        searchButton: document.getElementById('searchButton'),
        listAllButton: document.getElementById('listAllButton'),
        saveButton: document.getElementById('saveButton'),
        cancelButton: document.getElementById('cancelButton'),
        loadingUsers: document.getElementById('loadingUsers'),
        noUsers: document.getElementById('noUsers'),
        alerts: document.getElementById('alerts'),
        
        // Form fields
        userId: document.getElementById('userId'),
        fullName: document.getElementById('fullName'),
        username: document.getElementById('username'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        document: document.getElementById('document'),
        password: document.getElementById('password'),
        userType: document.getElementById('userType')
    };

    /**
     * Add real-time formatting for the document field (CPF/CNPJ)
     * Automatically formats as the user types
     */
    elements.document.addEventListener('input', function() {
        let value = this.value.replace(/[^\d]/g, '');
        
        if (value.length <= 11) {
            // CPF formatting
            if (value.length > 9) {
                this.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                this.value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                this.value = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
            } else {
                this.value = value;
            }
        } else {
            // CNPJ formatting
            if (value.length > 12) {
                this.value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
            } else if (value.length > 8) {
                this.value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
            } else if (value.length > 5) {
                this.value = value.replace(/(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
            } else if (value.length > 2) {
                this.value = value.replace(/(\d{2})(\d{0,3})/, '$1.$2');
            } else {
                this.value = value;
            }
        }
    });
    
    /**
     * Add real-time formatting for the phone field
     * Automatically formats as the user types
     */
    elements.phone.addEventListener('input', function() {
        let value = this.value.replace(/[^\d]/g, '');
        
        // Format according to the number of digits
        if (value.length > 10) { // Mobile with area code (11 digits)
            this.value = value.replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2 $3-$4');
        } else if (value.length > 6 && value.length <= 10) { // Landline with area code (10 digits)
            this.value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 4 && value.length <= 6) {
            this.value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
        } else if (value.length <= 4) {
            this.value = value;
        }
    });
    
    /**
     * Override the original submit listener to include validation
     * Validates form data before submission
     */
    const originalSubmitListener = elements.userForm.onsubmit;
    elements.userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous alerts
        elements.alerts.innerHTML = '';
        
        // Validate document (CPF/CNPJ)
        const documentValue = elements.document.value.replace(/[^\d]/g, '');
        let isValid = true;
        let errorMessage = '';
        
        // Document validation
        if (documentValue.length === 11) {
            if (!validateCPF(documentValue)) {
                isValid = false;
                errorMessage = 'Invalid CPF. Please verify the numbers entered.';
            }
        } else if (documentValue.length === 14) {
            if (!validateCNPJ(documentValue)) {
                isValid = false;
                errorMessage = 'Invalid CNPJ. Please verify the numbers entered.';
            }
        } else {
            isValid = false;
            errorMessage = 'Document must be CPF (11 digits) or CNPJ (14 digits).';
        }
        
        // If the document is invalid, show error and stop
        if (!isValid) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger alert-dismissible fade show';
            alertDiv.innerHTML = `
                ${errorMessage}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            elements.alerts.appendChild(alertDiv);
            
            // Scroll to top to see the error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Focus on the field with error
            elements.document.focus();
            return false;
        }
        
        // If validation passed, continue with original logic
        const isEditing = elements.userId.value !== '';
        
        const userData = {
            fullName: elements.fullName.value.trim(),
            username: elements.username.value.trim(),
            email: elements.email.value.trim(),
            phone: elements.phone.value.trim(),
            document: documentValue, // Send only numbers without formatting
            userType: elements.userType.value
        };
        
        // Add password only when provided or when it's a new user
        const passwordValue = elements.password.value.trim();
        if (passwordValue) {
            userData.password = passwordValue;
        } else if (!isEditing) {
            // Use default password only for new users when no password is provided
            userData.password = "1234";
        }
        
        if (isEditing) {
            userData.id = parseInt(elements.userId.value);
        }
        
        // Call function to save user
        saveUser(userData);
    });
    
    /**
     * Override the displayUsers function to format document and phone
     * @param {Array} users - The list of users to display
     */
    const originalDisplayUsers = window.displayUsers;
    window.displayUsers = function(users) {
        elements.userTableBody.innerHTML = '';
        
        if (!users || users.length === 0) {
            elements.noUsers.classList.remove('d-none');
            return;
        }
        
        elements.noUsers.classList.add('d-none');
        
        const userTypeLabels = {
            'CUSTOMER': 'Client',
            'SELLER': 'Seller',
            'ADMIN': 'Administrator'
        };
        
        users.forEach(user => {
            // Format document and phone for display
            const formattedDocument = user.document ? 
                (user.document.length <= 11 ? formatCPF(user.document) : formatCNPJ(user.document)) : 
                '-';
            
            const formattedPhone = user.phone ? formatPhone(user.phone) : '-';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.fullName || '-'}</td>
                <td>${user.username || '-'}</td>
                <td>${user.email || '-'}</td>
                <td>${formattedDocument}</td>
                <td>${userTypeLabels[user.userType] || user.userType || '-'}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-xs edit-user" data-id="${user.id}">Edit</button>
                    <button class="btn btn-danger btn-xs delete-user" data-id="${user.id}">Delete</button>
                </td>
            `;
            elements.userTableBody.appendChild(row);
        });
        
        // Add listeners for action buttons
        document.querySelectorAll('.edit-user').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.target.getAttribute('data-id');
                loadUserForEdit(userId);
            });
        });
        
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.target.getAttribute('data-id');
                deleteUser(userId);
            });
        });
    };
    
    /**
     * Override the loadUserForEdit function to format fields when loading
     * @param {number} userId - The ID of the user to edit
     */
    const originalLoadUserForEdit = window.loadUserForEdit;
    window.loadUserForEdit = async function(userId) {
        showLoading();
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`);
            if (!response.ok) {
                throw new Error('User not found');
            }
            
            const user = await response.json();
            
            elements.userId.value = user.id;
            elements.fullName.value = user.fullName || '';
            elements.username.value = user.username || '';
            elements.email.value = user.email || '';
            
            // Format phone if exists
            elements.phone.value = user.phone ? formatPhone(user.phone) : '';
            
            // Format document if exists
            const docValue = user.document || '';
            if (docValue) {
                elements.document.value = docValue.length <= 11 ? 
                    formatCPF(docValue) : formatCNPJ(docValue);
            } else {
                elements.document.value = '';
            }
            
            // Clear password field when editing
            elements.password.value = '';
            
            elements.userType.value = user.userType || 'CUSTOMER';
            
            isEditing = true;
            elements.formTitle.textContent = `Edit User: ${user.username}`;
            
            // Scroll to form
            elements.formTitle.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error:', error);
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger alert-dismissible fade show';
            alertDiv.innerHTML = `
                Error loading user: ${error.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            elements.alerts.appendChild(alertDiv);
        } finally {
            hideLoading();
        }
    };
    
    /**
     * Add handler for the cancel button
     * Clears the form
     */
    elements.cancelButton.addEventListener('click', () => {
        clearForm();
    });
    
    /**
     * Add handler for the search button
     * Validates search input and calls search function
     */
    elements.searchButton.addEventListener('click', () => {
        const searchType = elements.searchType.value;
        const searchValue = elements.searchValue.value.trim();
        
        if (!searchValue) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-warning alert-dismissible fade show';
            alertDiv.innerHTML = `
                Please enter a search value.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            elements.alerts.appendChild(alertDiv);
            return;
        }
        
        searchUsers(searchType, searchValue);
    });
    
    /**
     * Add handler for the list all button
     * Fetches all users
     */
    elements.listAllButton.addEventListener('click', () => {
        fetchUsers();
    });
    
    // Initialize the page by loading all users
    fetchUsers();
});

/**
 * Show loading indicator
 */
function showLoading() {
    document.getElementById('loadingUsers').classList.remove('d-none');
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    document.getElementById('loadingUsers').classList.add('d-none');
}

/**
 * Saves user data (creates or updates)
 * @param {object} userData - The user data to save
 */
async function saveUser(userData) {
    try {
        const isEditing = userData.id ? true : false;
        
        // Remove formatting from document and phone before sending
        if (userData.document) {
            userData.document = userData.document.replace(/[^\d]/g, '');
        }
        
        if (userData.phone) {
            userData.phone = userData.phone.replace(/[^\d]/g, '');
        }
        
        console.log("Data sent:", JSON.stringify(userData));
        
        const url = isEditing 
            ? `${API_BASE_URL}/users/update/${userData.id}`
            : `${API_BASE_URL}/users`;
        
        const method = isEditing ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include' // Include cookies if necessary
        });
        
        // Debug to check the response
        console.log("Response status:", response.status);
        const responseData = await response.json();
        console.log("Response:", responseData);
        
        if (!response.ok) {
            throw new Error(`Failed to ${isEditing ? 'update' : 'create'} user: ${responseData.message || 'Unknown error'}`);
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            User ${isEditing ? 'updated' : 'created'} successfully: ${responseData.fullName}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.getElementById('alerts').appendChild(alertDiv);
        
        clearForm();
        fetchUsers();
    } catch (error) {
        console.error('Complete error:', error);
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            Error saving user: ${error.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.getElementById('alerts').appendChild(alertDiv);
    }
}

/**
 * Clears the form fields and resets to "Add User" mode
 */
function clearForm() {
    const form = document.getElementById('userForm');
    form.reset();
    document.getElementById('userId').value = '';
    document.getElementById('formTitle').textContent = 'Add User';
}

/**
 * Searches users by a specific criterion
 * @param {string} searchType - The field to search by
 * @param {string} searchValue - The value to search for
 */
async function searchUsers(searchType, searchValue) {
    showLoading();
    try {
        let url = `${API_BASE_URL}/users`;
        
        // If searching by document, remove formatting
        if (searchType === 'document') {
            searchValue = searchValue.replace(/[^\d]/g, '');
        }
        
        // Add search parameter
        url += `/search?${searchType}=${encodeURIComponent(searchValue)}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error searching users');
        }
        
        const users = await response.json();
        displayUsers(Array.isArray(users) ? users : [users]); // Ensure it's an array
    } catch (error) {
        console.error('Error:', error);
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            Failed to search users: ${error.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.getElementById('alerts').appendChild(alertDiv);
        
        // Show empty table
        document.getElementById('userTableBody').innerHTML = '';
        document.getElementById('noUsers').classList.remove('d-none');
    } finally {
        hideLoading();
    }
}

/**
 * Deletes a user by ID
 * @param {number} userId - The ID of the user to delete
 */
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error deleting user');
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            User deleted successfully.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.getElementById('alerts').appendChild(alertDiv);
        
        // Reload user list
        fetchUsers();
    } catch (error) {
        console.error('Error:', error);
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            Failed to delete user: ${error.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.getElementById('alerts').appendChild(alertDiv);
    } finally {
        hideLoading();
    }
}

/**
 * Fetches all users from the API
 */
async function fetchUsers() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
            throw new Error('Error fetching users');
        }
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error:', error);
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            Failed to load users: ${error.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.getElementById('alerts').appendChild(alertDiv);
        
        // Show no users message
        document.getElementById('userTableBody').innerHTML = '';
        document.getElementById('noUsers').classList.remove('d-none');
    } finally {
        hideLoading();
    }
}

/**
 * Displays users in the table
 * @param {Array} users - The array of users to display
 */
function displayUsers(users) {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';
    
    if (!users || users.length === 0) {
        document.getElementById('noUsers').classList.remove('d-none');
        return;
    }
    
    document.getElementById('noUsers').classList.add('d-none');
    
    const userTypeLabels = {
        'CUSTOMER': 'Client',
        'SELLER': 'Seller',
        'ADMIN': 'Administrator'
    };
    
    users.forEach(user => {
        // Format document and phone for display
        const formattedDocument = user.document ? 
            (user.document.length <= 11 ? formatCPF(user.document) : formatCNPJ(user.document)) : 
            '-';
        
        const formattedPhone = user.phone ? formatPhone(user.phone) : '-';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.fullName || '-'}</td>
            <td>${user.username || '-'}</td>
            <td>${user.email || '-'}</td>
            <td>${formattedDocument}</td>
            <td>${userTypeLabels[user.userType] || user.userType || '-'}</td>
            <td class="action-buttons">
                <button class="btn btn-primary btn-xs edit-user" data-id="${user.id}">Edit</button>
                <button class="btn btn-danger btn-xs delete-user" data-id="${user.id}">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
    
    // Add listeners for action buttons
    document.querySelectorAll('.edit-user').forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-id');
            loadUserForEdit(userId);
        });
    });
    
    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-id');
            deleteUser(userId);
        });
    });
}