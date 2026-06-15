// Banco de dados inicial (caso o LocalStorage esteja vazio)
const produtosIniciais = [
    { id: 1, marca: 'nike', categoria: 'tenis', titulo: "Air Force branco classico", preco: 759.99, img: "https://imgnike-a.akamaihd.net/768x768/01113751A2.jpg", keywords: "nike tenis branco casual air force 1 masculino feminino", tamanhos: ["39","40","41"], estoque: 10 },
    { id: 2, marca: 'nike', categoria: 'roupa', titulo: "Moletom Sportswear Club", preco: 284.99, img: "https://imgnike-a.akamaihd.net/1024x1024/0957727TA2.jpg", keywords: "nike moletom blusa frio preto esporte roupa", tamanhos: ["P","M","G"], estoque: 5 },
    { id: 3, marca: 'adidas', categoria: 'tenis', titulo: "Tênis ULTRABOOST 5", preco: 1099.99, img: "https://assets.adidas.com/images/w_600,f_auto,q_auto/a284c05789e64be281506dbda3204ed0_9366/Tenis_Ultraboost_5_Turquesa_JQ2911_HM1.jpg", keywords: "adidas ultraboost corrida azul", tamanhos: ["38","40","42"], estoque: 8 },
    { id: 4, marca: 'shein', categoria: 'roupa', titulo: "Vestido Floral Casual", preco: 159.99, img: "https://images.unsplash.com/photo-1572804013307-a9a11117bb41?q=80&w=400", keywords: "shein vestido floral casual feminino moda", tamanhos: ["P","M"], estoque: 12 }
];

let produtos = JSON.parse(localStorage.getItem('sf_produtos')) || produtosIniciais;
let usuarios = JSON.parse(localStorage.getItem('sf_usuarios')) || [];
let carrinho = JSON.parse(localStorage.getItem('sf_cart_v3')) || [];
let valorFrete = 0;
let filtroAtual = 'todos';
let isSignUpMode = false;

// Salva dados iniciais se não existirem
if(!localStorage.getItem('sf_produtos')) {
    localStorage.setItem('sf_produtos', JSON.stringify(produtos));
}

// --- SISTEMA DE LOGIN / CADASTRO ---
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('authTitle').innerText = isSignUpMode ? "Criar Nova Conta" : "Acessar Conta";
    document.getElementById('authName').style.display = isSignUpMode ? "block" : "none";
    document.getElementById('toggleAuthText').innerText = isSignUpMode ? "Já tem conta? Entre aqui" : "Não tem conta? Cadastre-se aqui";
}

function handleAuth(e) {
    e.preventDefault();
    const name = document.getElementById('authName').value;
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const role = document.getElementById('authRole').value;

    if (isSignUpMode) {
        // Fluxo de Cadastro
        if(usuarios.find(u => u.email === email)) {
            alert("Este e-mail já está cadastrado!");
            return;
        }
        usuarios.push({ name, email, password, role });
        localStorage.setItem('sf_usuarios', JSON.stringify(usuarios));
        alert("Cadastro realizado com sucesso!");
        toggleAuthMode();
    } else {
        // Fluxo de Login
        const user = usuarios.find(u => u.email === email && u.password === password && u.role === role);
        
        // Conta mestre padrão para testes caso não queira cadastrar
        if(email === "admin@admin.com" && password === "123" && role === "admin") {
            showPanel("admin", "Administrador Teste");
            return;
        }

        if(user) {
            showPanel(user.role, user.name || user.email);
        } else {
            alert("Dados incorretos ou perfil errado!");
        }
    }
}

function showPanel(role, name) {
    document.getElementById('authScreen').style.display = 'none';
    if(role === 'admin') {
        document.getElementById('adminPanel').style.display = 'block';
        renderAdminInventory();
    } else {
        document.getElementById('clientStore').style.display = 'block';
        document.getElementById('welcomeUser').innerText = `Olá, ${name}!`;
        render();
    }
}

function logout() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('clientStore').style.display = 'none';
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('authForm').reset();
}

// --- CONTROLE DO ADMINISTRADOR ---
function handleCreateProduct(e) {
    e.preventDefault();
    const novoProd = {
        id: Date.now(),
        titulo: document.getElementById('prodTitulo').value,
        preco: parseFloat(document.getElementById('prodPreco').value),
        img: document.getElementById('prodImg').value,
        marca: document.getElementById('prodMarca').value.toLowerCase(),
        categoria: document.getElementById('prodCategoria').value,
        keywords: document.getElementById('prodKeywords').value,
        tamanhos: document.getElementById('prodTamanhos').value.split(',').map(t => t.trim()),
        estoque: parseInt(document.getElementById('prodEstoque').value)
    };

    produtos.push(novoProd);
    localStorage.setItem('sf_produtos', JSON.stringify(produtos));
    e.target.reset();
    renderAdminInventory();
    alert("Produto adicionado com sucesso ao estoque!");
}

function renderAdminInventory() {
    const container = document.getElementById('adminInventory');
    container.innerHTML = '';
    produtos.forEach(p => {
        container.innerHTML += `
            <div class="inventory-item">
                <div>
                    <strong>${p.titulo}</strong> <br>
                    <small>Cat: ${p.categoria.toUpperCase()} | Marca: ${p.marca.toUpperCase()}</small>
                </div>
                <div>
                    <span style="badge; background: ${p.estoque > 0 ? '#10b981' : '#ef4444'}; color:white; padding:4px 8px; border-radius:6px;">
                        Estoque: ${p.estoque} u.
                    </span>
                </div>
            </div>
        `;
    });
}

// --- VISÃO DO CLIENTE (LOJA) ---
function render() {
    const main = document.getElementById('mainContainer');
    main.innerHTML = '';
    const marcas = [...new Set(produtos.map(p => p.marca))]; // Pega todas as marcas existentes dinamicamente

    marcas.forEach(marca => {
        const section = document.createElement('section');
        section.className = 'brand-section';
        section.setAttribute('data-brand', marca);
        section.innerHTML = `
            <h2 class="section-title">${marca.toUpperCase()} Collection</h2>
            <div class="product-grid" id="grid-${marca}"></div>
        `;
        main.appendChild(section);

        const grid = document.getElementById(`grid-${marca}`);
        produtos.filter(p => p.marca === marca).forEach(p => {
            const foraDeEstoque = p.estoque <= 0;
            grid.innerHTML += `
                <article class="product-card" data-keywords="${p.keywords} ${p.titulo} ${p.categoria}">
                    <div class="img-container">
                        <img src="${p.img}" alt="${p.titulo}" onerror="this.src='https://via.placeholder.com/300?text=Produto'">
                        ${foraDeEstoque ? '<div style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); color:white; display:flex; justify-content:center; align-items:center; font-weight:800;">ESGOTADO</div>' : ''}
                    </div>
                    <div class="product-info">
                        <small>${p.marca.toUpperCase()} | ${p.categoria.toUpperCase()}</small>
                        <h3>${p.titulo}</h3>
                        <div style="font-size:0.8rem; color: var(--secondary)">Tam. Disponíveis: ${p.tamanhos.join(', ')}</div>
                        <div class="product-price">R$ ${p.preco.toFixed(2).replace('.', ',')}</div>
                        <div class="card-buttons">
                            <button class="btn-add" onclick="addToCart(${p.id})" ${foraDeEstoque ? 'disabled style="background:#64748b;"' : ''}>
                                ${foraDeEstoque ? 'Indisponível' : 'Adicionar ao Carrinho'}
                            </button>
                        </div>
                    </div>
                </article>`;
        });
    });
    updateCartUI();
}

// --- LOGICA DO CARRINHO COM ATUALIZAÇÕES ---
function addToCart(id) {
    const prod = produtos.find(p => p.id === id);
    
    // Verifica se ainda tem estoque antes de adicionar mais um
    const itemNoCarrinho = carrinho.find(i => i.id === id);
    const qtdAtual = itemNoCarrinho ? itemNoCarrinho.qtd : 0;

    if (qtdAtual >= prod.estoque) {
        alert("Desculpe, não há mais unidades deste item em estoque!");
        return;
    }

    if(itemNoCarrinho) {
        itemNoCarrinho.qtd++;
    } else {
        carrinho.push({...prod, qtd: 1});
    }
    
    localStorage.setItem('sf_cart_v3', JSON.stringify(carrinho));
    updateCartUI();
    showToast();
}

function changeQty(index, change) {
    const item = carrinho[index];
    const prodOriginal = produtos.find(p => p.id === item.id);

    if (change > 0 && item.qtd >= prodOriginal.estoque) {
        alert("Limite de estoque atingido para este produto!");
        return;
    }

    item.qtd += change;

    if (item.qtd <= 0) {
        carrinho.splice(index, 1);
    }

    localStorage.setItem('sf_cart_v3', JSON.stringify(carrinho));
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    container.innerHTML = '';
    let subtotal = 0;
    let count = 0;

    if(carrinho.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--secondary); padding: 20px;">Seu carrinho está vazio 🛒</p>';
        document.getElementById('summary').style.display = 'none';
        document.getElementById('cartCount').innerText = 0;
        return;
    }

    document.getElementById('summary').style.display = 'block';

    carrinho.forEach((item, index) => {
        subtotal += (item.preco * item.qtd);
        count += item.qtd;
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}">
                <div style="flex-grow:1">
                    <div style="font-weight:600; font-size:0.8rem">${item.titulo}</div>
                    <div class="quantity-control">
                        <button class="btn-qty" onclick="changeQty(${index}, -1)">-</button>
                        <span style="font-size:0.85rem">${item.qtd}</span>
                        <button class="btn-qty" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                    <div style="color:var(--accent); font-weight:800">R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</div>
                </div>
                <button onclick="changeQty(${index}, -${item.qtd})" style="border:none; background:none; cursor:pointer; font-size:1.1rem">🗑️</button>
            </div>`;
    });

    const totalFinal = subtotal + valorFrete;
    document.getElementById('cartCount').innerText = count;
    document.getElementById('subtotalValue').innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('shippingValue').innerText = `R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
    document.getElementById('cartTotal').innerText = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
}

// --- BAIXA DE ESTOQUE (FINALIZAR COMPRA) ---
function checkout() {
    // Diminui o estoque dos produtos originais de acordo com as vendas
    carrinho.forEach(itemCarrinho => {
        const produtoOriginal = produtos.find(p => p.id === itemCarrinho.id);
        if (produtoOriginal) {
            produtoOriginal.estoque -= itemCarrinho.qtd;
        }
    });

    // Salva o novo estoque modificado no LocalStorage
    localStorage.setItem('sf_produtos', JSON.stringify(produtos));
    
    // Limpa o carrinho
    carrinho = [];
    localStorage.setItem('sf_cart_v3', JSON.stringify(carrinho));
    
    toggleCart();
    render(); // Recarrega a vitrine com o novo estoque atualizado
    alert("Compra realizada com sucesso! O estoque foi atualizado. 🚀");
}

// --- CEP, TEMAS E FILTROS ---
document.getElementById('cepInput').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    e.target.value = value;
});

function calculateShipping() {
    const cep = document.getElementById('cepInput').value.replace(/\D/g, '');
    const resultDiv = document.getElementById('shippingResult');
    if (cep.length !== 8) {
        resultDiv.innerText = "CEP inválido!"; resultDiv.style.color = "#ef4444"; return;
    }
    valorFrete = cep.startsWith('0') || cep.startsWith('1') ? 15.00 : 35.00;
    resultDiv.innerText = valorFrete === 15.00 ? "Entrega Expressa: 2 dias" : "Entrega Padrão: 5 a 7 dias";
    resultDiv.style.color = "var(--accent)";
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cartDrawer').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

function showToast() {
    const t = document.getElementById('toast'); t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

function toggleTheme() { document.body.classList.toggle('dark-theme'); }

document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
        const matchesSearch = card.getAttribute('data-keywords').toLowerCase().includes(term);
        const section = card.closest('.brand-section');
        const matchesFilter = (filtroAtual === 'todos' || section.getAttribute('data-brand') === filtroAtual);
        card.style.display = (matchesSearch && matchesFilter) ? 'flex' : 'none';
    });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroAtual = btn.dataset.filter;
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('.brand-section').forEach(sec => {
            if (filtroAtual === 'todos' || sec.dataset.brand === filtroAtual) {
                sec.style.display = 'block';
                sec.querySelectorAll('.product-card').forEach(c => c.style.display = 'flex');
            } else { sec.style.display = 'none'; }
        });
    });
});
