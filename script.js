const produtos = [
    { id: 1, marca: 'nike', titulo: "Air Force branco classico", preco: 759.99, img: "https://imgnike-a.akamaihd.net/768x768/01113751A2.jpg", keywords: "nike tenis branco casual air force 1 masculino feminino", link: "https://www.nike.com.br/tenis-nike-air-force-1-07-masculino-011137.html" },
    { id: 2, marca: 'nike', titulo: "Moletom Sportswear Club", preco: 284.99, img: "https://imgnike-a.akamaihd.net/1024x1024/0957727TA2.jpg", keywords: "nike moletom blusa frio preto esporte roupa", link: "https://www.nike.com.br/blusao-nike-park-fleece-infantil-095772.html?cor=7T" },
    { id: 3, marca: 'nike', titulo: "Dunk Low 'Panda'", preco: 854.99, img: "https://imgnike-a.akamaihd.net/1920x1920/05847553A2.jpg", keywords: "nike tenis dunk low preto e branco panda casual", link: "https://www.nike.com.br/tenis-nike-dunk-low-retro-panda-masculino-058475.html?cor=53" },
    { id: 4, marca: 'nike', titulo: "tenis TN Blue", preco: 1329.99, img: "https://imgnike-a.akamaihd.net/768x768/022147IHA2.jpg", keywords: "nike TN corrida esporte azul", link: "https://www.nike.com.br/tenis-nike-air-max-plus-masculino-022147.html?cor=IH" },
    { id: 5, marca: 'adidas', titulo: "Tênis ULTRABOOST 5", preco: 1099.99, img: "https://assets.adidas.com/images/w_600,f_auto,q_auto/a284c05789e64be281506dbda3204ed0_9366/Tenis_Ultraboost_5_Turquesa_JQ2911_HM1.jpg", keywords: "adidas ultraboost corrida azul", link: "https://www.adidas.com.br/tenis-ultraboost-5/JQ2911.html" },
    { id: 6, marca: 'adidas', titulo: "Superstar Originals", preco: 599.99, img: "https://assets.adidas.com/images/w_600,f_auto,q_auto/19bb876160da48f9b261741f4512ea9f_9366/Tenis_SUPERSTAR_ST_Cinza_KI4208_00_plp_standard.jpg", keywords: "adidas tenis branco superstar classico casual", link: "https://www.adidas.com.br/tenis-superstar-st/KI4208.html" },
    { id: 7, marca: 'adidas', titulo: "Camisa Real Madrid 25/26", preco: 399.99, img: "https://assets.adidas.com/images/h_2000,f_auto,q_auto/6781a185b37a4e508590bf5c35993725_9366/Camisa_III_Real_Madrid_25-26_Azul_JV5845_01_laydown.jpg", keywords: "adidas camisa real madrid futebol esporte azul", link: "https://www.adidas.com.br/camisa-iii-real-madrid-25-26/JV5845.html" },
    { id: 8, marca: 'lacoste', titulo: "Camisa Polo Original", preco: 699.00, img: "https://imagesa1.lacoste.com/dw/image/v2/BCWL_PRD/on/demandware.static/-/Sites-master/default/dwc5ccbfaf/L1212_HBP_24.jpg?imwidth=960", keywords: "lacoste camisa polo verde casual roupa", link: "https://www.lacoste.com/br" },
    { id: 9, marca: 'lacoste', titulo: "Tênis Masculino Lineshot", preco: 929.00, img: "https://imagesa1.lacoste.com/dw/image/v2/BCWL_PRD/on/demandware.static/-/Sites-master/default/dweba3204a/48SMA0026_AAT_01.jpg?imwidth=960", keywords: "lacoste tenis branco couro casual", link: "https://www.lacoste.com/br" },
    { id: 10, marca: 'penalty', titulo: "Bola Penalty S11", preco: 599.99, img: "https://cambuci.vtexassets.com/arquivos/ids/1505567-1200-auto", keywords: "penalty bola futebol campo esporte equipamento", link: "https://www.penalty.com.br" },
    { id: 11, marca: 'penalty', titulo: "Chuteira Society Storm", preco: 269.99, img: "https://cambuci.vtexassets.com/arquivos/ids/1555564-1200-auto", keywords: "penalty chuteira society salao quadra laranja", link: "https://www.penalty.com.br" },
    { id: 12, marca: 'shein', titulo: "Vestido Floral Casual", preco: 159.99, img: "https://images.unsplash.com/photo-1572804013307-a9a11117bb41?q=80&w=400", keywords: "shein vestido floral casual feminino moda", link: "https://www.shein.com.br" },
    { id: 13, marca: 'shein', titulo: "Blusa Cropped Manga Longa", preco: 89.99, img: "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=400", keywords: "shein blusa cropped manga longa feminina", link: "https://www.shein.com.br" },
    { id: 14, marca: 'shein', titulo: "Tênis Chunky Branco", preco: 199.99, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400", keywords: "shein tenis branco chunky casual feminino", link: "https://www.shein.com.br" }
];

let carrinho = JSON.parse(localStorage.getItem('sf_cart_v3')) || [];
let valorFrete = 0;
let filtroAtual = 'todos';

function render() {
    const main = document.getElementById('mainContainer');
    main.innerHTML = '';
    const marcas = ['nike', 'adidas', 'lacoste', 'penalty', 'shein'];

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
            grid.innerHTML += `
                <article class="product-card" data-keywords="${p.keywords} ${p.titulo}">
                    <div class="img-container"><img src="${p.img}" alt="${p.titulo}" onerror="this.src='https://via.placeholder.com/300?text=Produto'"></div>
                    <div class="product-info">
                        <small>${p.marca.toUpperCase()}</small>
                        <h3>${p.titulo}</h3>
                        <div class="product-price">R$ ${p.preco.toFixed(2).replace('.', ',')}</div>
                        <div class="card-buttons">
                            <button class="btn-add" onclick="addToCart(${p.id})">Adicionar ao Carrinho</button>
                            <a href="${p.link}" target="_blank" class="btn-store">Ver na Loja Oficial</a>
                        </div>
                    </div>
                </article>`;
        });
    });
    updateCartUI();
}

// Máscara de CEP automática (00000-000)
document.getElementById('cepInput').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = value;
});

function calculateShipping() {
    const cep = document.getElementById('cepInput').value.replace(/\D/g, '');
    const resultDiv = document.getElementById('shippingResult');
    
    if (cep.length !== 8) {
        resultDiv.innerText = "CEP inválido! Digite 8 números.";
        resultDiv.style.color = "#ef4444";
        return;
    }

    if (cep.startsWith('0') || cep.startsWith('1')) {
        valorFrete = 15.00;
        resultDiv.innerText = "Entrega Expressa: 2 dias úteis";
    } else {
        valorFrete = 35.00;
        resultDiv.innerText = "Entrega Padrão: 5 a 7 dias úteis";
    }
    
    resultDiv.style.color = "var(--accent)";
    updateCartUI();
}

function addToCart(id) {
    const prod = produtos.find(p => p.id === id);
    const itemExistente = carrinho.find(i => i.id === id);
    if(itemExistente) itemExistente.qtd++;
    else carrinho.push({...prod, qtd: 1});
    
    localStorage.setItem('sf_cart_v3', JSON.stringify(carrinho));
    updateCartUI();
    showToast();
}

function removeFromCart(index) {
    if(carrinho[index].qtd > 1) carrinho[index].qtd--;
    else carrinho.splice(index, 1);
    localStorage.setItem('sf_cart_v3', JSON.stringify(carrinho));
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    container.innerHTML = '';
    let subtotal = 0;
    let count = 0;

    carrinho.forEach((item, index) => {
        subtotal += (item.preco * item.qtd);
        count += item.qtd;
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}">
                <div style="flex-grow:1">
                    <div style="font-weight:600; font-size:0.8rem">${item.titulo}</div>
                    <div style="color:var(--secondary); font-size:0.75rem">Qtd: ${item.qtd}</div>
                    <div style="color:var(--accent); font-weight:800">R$ ${item.preco.toFixed(2)}</div>
                </div>
                <button onclick="removeFromCart(${index})" style="border:none; background:none; cursor:pointer">🗑️</button>
            </div>`;
    });

    const totalFinal = subtotal + valorFrete;

    document.getElementById('cartCount').innerText = count;
    document.getElementById('subtotalValue').innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('shippingValue').innerText = `R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
    document.getElementById('cartTotal').innerText = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
}

function toggleCart() {
    document.getElementById('cartDrawer').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

function showToast() {
    const t = document.getElementById('toast');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

// Lógica corrigida de Busca Combinada com Filtro de Marca
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    
    document.querySelectorAll('.product-card').forEach(card => {
        const matchesSearch = card.getAttribute('data-keywords').toLowerCase().includes(term);
        const section = card.closest('.brand-section');
        const brand = section.getAttribute('data-brand');
        const matchesFilter = (filtroAtual === 'todos' || brand === filtroAtual);

        if (matchesSearch && matchesFilter) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        filtroAtual = btn.dataset.filter;
        
        // Limpa a busca ao trocar de marca para evitar bugs visuais
        document.getElementById('searchInput').value = '';

        document.querySelectorAll('.brand-section').forEach(sec => {
            if (filtroAtual === 'todos' || sec.dataset.brand === filtroAtual) {
                sec.style.display = 'block';
                // Garante que os cards internos voltem a aparecer
                sec.querySelectorAll('.product-card').forEach(card => card.style.display = 'flex');
            } else {
                sec.style.display = 'none';
            }
        });
    });
});

// Inicialização
render();
