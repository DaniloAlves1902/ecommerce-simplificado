// Configuração para o painel de estatísticas
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o HTML para o painel de estatísticas já existe
    if (!document.getElementById('statisticsPanel')) {
        createStatisticsPanel();
    }
    
    // Registrar um observador para atualizar as estatísticas quando a tabela de usuários mudar
    const observer = new MutationObserver(() => {
        updateStatistics();
    });
    
    // Observar mudanças na tabela de usuários
    const userTableBody = document.getElementById('userTableBody');
    observer.observe(userTableBody, { childList: true });
    
    // Também atualizar quando a página carregar
    updateStatistics();
});

// Função para criar o painel de estatísticas no HTML
function createStatisticsPanel() {
    // Criar o HTML para o painel de estatísticas
    const statisticsPanel = document.createElement('div');
    statisticsPanel.id = 'statisticsPanel';
    statisticsPanel.className = 'card mb-4';
    statisticsPanel.innerHTML = `
        <div class="card-header bg-info text-white">
            <h5 class="mb-0">Estatísticas dos Usuários</h5>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-3">
                    <div class="card text-white bg-primary mb-3">
                        <div class="card-body text-center">
                            <h3 id="totalUsers">0</h3>
                            <p class="mb-0">Total de Usuários</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-white bg-success mb-3">
                        <div class="card-body text-center">
                            <h3 id="totalCustomers">0</h3>
                            <p class="mb-0">Clientes</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-white bg-warning mb-3">
                        <div class="card-body text-center">
                            <h3 id="totalSellers">0</h3>
                            <p class="mb-0">Vendedores</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-white bg-danger mb-3">
                        <div class="card-body text-center">
                            <h3 id="totalAdmins">0</h3>
                            <p class="mb-0">Administradores</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Inserir o painel após o elemento "alerts" e antes do formulário de busca
    const alertsElement = document.getElementById('alerts');
    alertsElement.parentNode.insertBefore(statisticsPanel,  alertsElement.nextSibling);
}

// Função para atualizar as estatísticas com base nos usuários exibidos na tabela
function updateStatistics() {
    // Contar usuários na tabela
    const userRows = document.querySelectorAll('#userTableBody tr');
    const totalUsers = userRows.length;
    
    // Inicializar contadores para cada tipo de usuário
    let customers = 0;
    let sellers = 0;
    let admins = 0;
    
    // Contar cada tipo de usuário
    userRows.forEach(row => {
        const userType = row.cells[5].textContent.trim();
        
        if (userType === 'Cliente') {
            customers++;
        } else if (userType === 'Vendedor') {
            sellers++;
        } else if (userType === 'Administrador') {
            admins++;
        }
    });
    
    // Atualizar os elementos do DOM com as contagens
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalCustomers').textContent = customers;
    document.getElementById('totalSellers').textContent = sellers;
    document.getElementById('totalAdmins').textContent = admins;
}

// Função para obter estatísticas completas de todos os usuários do sistema, não apenas os exibidos
async function fetchCompleteStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
            throw new Error('Erro ao buscar usuários para estatísticas');
        }
        
        const users = await response.json();
        
        // Contar por tipo de usuário
        let totalUsers = users.length;
        let customers = users.filter(user => user.userType === 'CUSTOMER').length;
        let sellers = users.filter(user => user.userType === 'SELLER').length;
        let admins = users.filter(user => user.userType === 'ADMIN').length;
        
        // Atualizar os elementos do DOM com as contagens
        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('totalCustomers').textContent = customers;
        document.getElementById('totalSellers').textContent = sellers;
        document.getElementById('totalAdmins').textContent = admins;
        
    } catch (error) {
        console.error('Erro ao buscar estatísticas completas:', error);
    }
}