// Configuração da API
const API_BASE_URL = 'http://localhost:8080';

// Elementos DOM
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
    
    // Campos do formulário
    userId: document.getElementById('userId'),
    fullName: document.getElementById('fullName'),
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    document: document.getElementById('document'),
    userType: document.getElementById('userType')
};

// Estado da aplicação
let isEditing = false;

// Funções de utilidade
function showLoading() {
    elements.loadingUsers.classList.remove('d-none');
}

function hideLoading() {
    elements.loadingUsers.classList.add('d-none');
}

function showAlert(message, type = 'danger') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    elements.alerts.appendChild(alertDiv);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

function clearForm() {
    elements.userForm.reset();
    elements.userId.value = '';
    isEditing = false;
    elements.formTitle.textContent = 'Adicionar Usuário';
}

// Funções da API
async function fetchUsers() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
            throw new Error('Erro ao buscar usuários');
        }
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Erro:', error);
        showAlert(`Falha ao carregar usuários: ${error.message}`);
    } finally {
        hideLoading();
    }
}

async function searchUser(type, value) {
    if (!value) {
        fetchUsers();
        return;
    }
    
    showLoading();
    try {
        let url = `${API_BASE_URL}/users`;
        
        switch (type) {
            case 'id':
                url += `/${value}`;
                break;
            case 'username':
                url += `/username/${value}`;
                break;
            case 'email':
                url += `/email/${value}`;
                break;
            case 'document':
                url += `/document/${value}`;
                break;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Usuário não encontrado por ${type}`);
        }
        
        const user = await response.json();
        displayUsers(Array.isArray(user) ? user : [user]);
    } catch (error) {
        console.error('Erro:', error);
        showAlert(`Busca falhou: ${error.message}`);
        elements.userTableBody.innerHTML = '';
        elements.noUsers.classList.remove('d-none');
    } finally {
        hideLoading();
    }
}

async function saveUser(userData) {
    try {
        // Adiciona uma verificação e depuração
        console.log("Dados enviados:", JSON.stringify(userData));
        
        const url = isEditing 
            ? `${API_BASE_URL}/users/update/${userData.id}`
            : `${API_BASE_URL}/users`;
        
        const method = isEditing ? 'PUT' : 'POST';
        
        // Adicionando senha padrão para novos usuários (se o backend exigir)
        if (!isEditing) {
            userData.password = "1234"; // Adicione isso se o backend exigir uma senha
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include' // Incluir cookies, se necessário
        });
        
        // Depuração para verificar a resposta
        console.log("Status da resposta:", response.status);
        const responseData = await response.json();
        console.log("Resposta:", responseData);
        
        if (!response.ok) {
            throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} usuário: ${responseData.message || 'Erro desconhecido'}`);
        }
        
        showAlert(
            `Usuário ${isEditing ? 'atualizado' : 'criado'} com sucesso: ${responseData.fullName}`,
            'success'
        );
        
        clearForm();
        fetchUsers();
    } catch (error) {
        console.error('Erro completo:', error);
        showAlert(`Erro ao salvar usuário: ${error.message}`);
    }
}

async function deleteUser(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/delete/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Falha ao excluir usuário');
        }
        
        showAlert('Usuário excluído com sucesso!', 'success');
        fetchUsers();
    } catch (error) {
        console.error('Erro:', error);
        showAlert(`Erro ao excluir usuário: ${error.message}`);
    }
}

// Funções de manipulação da interface
function displayUsers(users) {
    elements.userTableBody.innerHTML = '';
    
    if (!users || users.length === 0) {
        elements.noUsers.classList.remove('d-none');
        return;
    }
    
    elements.noUsers.classList.add('d-none');
    
    const userTypeLabels = {
        'CUSTOMER': 'Cliente',
        'SELLER': 'Vendedor',
        'ADMIN': 'Administrador'
    };
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.fullName || '-'}</td>
            <td>${user.username || '-'}</td>
            <td>${user.email || '-'}</td>
            <td>${user.document || '-'}</td>
            <td>${userTypeLabels[user.userType] || user.userType || '-'}</td>
            <td class="action-buttons">
                <button class="btn btn-primary btn-xs edit-user" data-id="${user.id}">Editar</button>
                <button class="btn btn-danger btn-xs delete-user" data-id="${user.id}">Excluir</button>
            </td>
        `;
        elements.userTableBody.appendChild(row);
    });
    
    // Adicionar listeners para os botões de ação
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

async function loadUserForEdit(userId) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (!response.ok) {
            throw new Error('Usuário não encontrado');
        }
        
        const user = await response.json();
        
        elements.userId.value = user.id;
        elements.fullName.value = user.fullName || '';
        elements.username.value = user.username || '';
        elements.email.value = user.email || '';
        elements.phone.value = user.phone || '';
        elements.document.value = user.document || '';
        elements.userType.value = user.userType || 'CUSTOMER';
        
        isEditing = true;
        elements.formTitle.textContent = `Editar Usuário: ${user.username}`;
        
        // Rolar para o formulário
        elements.formTitle.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erro:', error);
        showAlert(`Erro ao carregar usuário: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar a aplicação
    fetchUsers();
    
    // Listener para busca
    elements.searchButton.addEventListener('click', () => {
        const type = elements.searchType.value;
        const value = elements.searchValue.value.trim();
        searchUser(type, value);
    });
    
    // Listener para listar todos
    elements.listAllButton.addEventListener('click', () => {
        elements.searchValue.value = '';
        fetchUsers();
    });
    
    // Listener para o formulário
    elements.userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userData = {
            fullName: elements.fullName.value.trim(),
            username: elements.username.value.trim(),
            email: elements.email.value.trim(),
            phone: elements.phone.value.trim(),
            document: elements.document.value.trim(),
            userType: elements.userType.value
        };
        
        if (isEditing) {
            userData.id = parseInt(elements.userId.value);
        }
        
        saveUser(userData);
    });
    
    // Listener para cancelar
    elements.cancelButton.addEventListener('click', clearForm);
    
    // Permitir busca ao pressionar Enter no campo de busca
    elements.searchValue.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            elements.searchButton.click();
        }
    });
});