const products = [
  {
    id: 1,
    name: "Buquê Encanto",
    price: 189.9,
    category: "Buquês",
    occasion: "Amor",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=85",
    description: "Rosas em tons suaves, folhagens delicadas e acabamento premium em papel texturizado.",
    available: true,
  },
  {
    id: 2,
    name: "Cesta Café Romântico",
    price: 249.9,
    category: "Café",
    occasion: "Aniversário",
    rating: 5,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=85",
    description: "Café especial, pães artesanais, geleias, frutas e flores para uma manhã memorável.",
    available: true,
  },
  {
    id: 3,
    name: "Arranjo Rosa Vintage",
    price: 159.9,
    category: "Arranjos",
    occasion: "Casamento",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=85",
    description: "Arranjo em vaso claro com flores rosadas, perfeito para decorar e presentear.",
    available: true,
  },
  {
    id: 4,
    name: "Presente Completo Amor",
    price: 329.9,
    category: "Presentes",
    occasion: "Amor",
    rating: 5,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85",
    description: "Flores, chocolate, cartão personalizado e mimo especial em uma composição elegante.",
    available: true,
  },
  {
    id: 5,
    name: "Cesta Doce Manhã",
    price: 219.9,
    category: "Cestas",
    occasion: "Maternidade",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85",
    description: "Cesta acolhedora com doces finos, bolinhos, café e detalhes florais.",
    available: true,
  },
  {
    id: 6,
    name: "Buquê Primavera",
    price: 179.9,
    category: "Buquês",
    occasion: "Formatura",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85",
    description: "Mix colorido e sofisticado com flores da estação para celebrar conquistas.",
    available: true,
  },
  {
    id: 7,
    name: "Box Chocolates & Flores",
    price: 199.9,
    category: "Chocolates",
    occasion: "Aniversário",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=800&q=85",
    description: "Caixa presenteável com bombons selecionados e mini arranjo floral.",
    available: true,
  },
  {
    id: 8,
    name: "Balão Surpresa Afeto",
    price: 139.9,
    category: "Balões",
    occasion: "Amor",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=85",
    description: "Balão bubble com flores secas, frase personalizada e fita de cetim.",
    available: true,
  },
];

const categories = ["Buquês", "Arranjos", "Cestas", "Café", "Presentes", "Chocolates"];
const catalogCategories = ["Todos", "Flores", "Buquês", "Arranjos", "Cestas", "Café", "Chocolates", "Presentes", "Balões", "Pelúcias"];
const occasions = ["Amor", "Aniversário", "Casamento", "Maternidade", "Formatura", "Condolências"];
const orderStatuses = ["Pedido recebido", "Em preparo", "Saiu para entrega", "Entregue", "Cancelado"];
const adminStatuses = ["Pedido recebido", "Em preparo", "Pronto para retirada", "Saiu para entrega", "Entregue", "Cancelado"];

const state = {
  view: "home",
  category: "Todos",
  occasion: "Todos",
  price: "Todos",
  search: "",
  filtersOpen: false,
  selectedProduct: products[0],
  qty: 1,
  cart: [
    { productId: 2, qty: 1, message: "Com amor, para começar o dia sorrindo." },
  ],
  checkoutStep: 1,
  deliveryType: "Entrega",
  payment: "Pix",
  orders: [
    { id: "PED-2407", tracking: "AB7K92", date: "Hoje, 10:30", value: 249.9, status: "Em preparo", items: [2], type: "Entrega" },
    { id: "PED-2388", tracking: "ZX4M18", date: "Ontem, 15:00", value: 189.9, status: "Entregue", items: [1], type: "Retirada" },
  ],
  lastOrder: null,
  trackingQuery: "",
  trackedOrder: null,
  adminTab: "dashboard",
  adminLoggedIn: false,
};

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const $ = (selector) => document.querySelector(selector);
const byId = (id) => products.find((product) => product.id === id);

function pixPrice(price) {
  return price * 0.95;
}

function cartTotal() {
  return state.cart.reduce((total, item) => total + byId(item.productId).price * item.qty, 0);
}

function cartItemsCount() {
  return state.cart.reduce((total, item) => total + item.qty, 0);
}

function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

function mount() {
  const initialView = getInitialView();
  const validViews = ["home", "catalog", "product", "cart", "checkout", "confirmation", "orders", "contact", "admin-login", "admin"];
  if (validViews.includes(initialView)) state.view = initialView;
  renderHome();
  renderCatalog();
  renderProduct();
  renderCart();
  renderCheckout();
  renderConfirmation();
  renderOrders();
  renderContact();
  renderAdminLogin();
  renderAdmin();
  bindGlobalEvents();
  showView(state.view);
  refreshIcons();
}

function getInitialView() {
  const path = location.pathname.replace(/\/+$/, "");
  if (path === "/admin/login") return "admin-login";
  if (path === "/admin") return "admin";

  const hashView = location.hash.replace("#", "");
  if (hashView === "admin/login") return "admin-login";
  return hashView;
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function bindGlobalEvents() {
  document.body.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-view]");
    const action = event.target.closest("[data-action]");
    if (nav) showView(nav.dataset.view);
    if (action) handleAction(action);
  });

  document.body.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("[data-filter]")) {
      state[target.dataset.filter] = target.value;
      renderCatalog();
    }
    if (target.matches("[data-admin-status]")) {
      target.closest(".admin-block").querySelector(".status-pill").textContent = target.value;
    }
  });

  document.body.addEventListener("input", (event) => {
    const target = event.target;
    if (target.matches("[data-search]")) {
      state.search = target.value;
      renderCatalog();
      const nextSearch = document.querySelector("[data-search]");
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.setSelectionRange(state.search.length, state.search.length);
      }
    }
  });
}

function showView(view) {
  if (view === "admin" && !state.adminLoggedIn) {
    view = "admin-login";
  }
  state.view = view;
  const nextUrl = adminUrlFor(view);
  if (`${location.pathname}${location.hash}` !== nextUrl) {
    history.replaceState(null, "", nextUrl);
  }
  document.querySelectorAll(".view").forEach((section) => section.classList.remove("active"));
  $(`#${view}-view`).classList.add("active");
  document.querySelectorAll(".nav-link, .rail-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  refreshIcons();
}

function adminUrlFor(view) {
  if (view === "admin-login") return "/admin/login";
  if (view === "admin") return "/admin";
  return `/#${view}`;
}

function handleAction(button) {
  const { action, id } = button.dataset;
  if (action === "occasions") {
    showView("home");
    requestAnimationFrame(() => {
      document.querySelector("#occasions-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  if (action === "category") {
    state.category = button.dataset.value;
    showView("catalog");
    renderCatalog();
  }
  if (action === "open-filters") {
    state.filtersOpen = true;
    renderCatalog();
  }
  if (action === "close-filters") {
    state.filtersOpen = false;
    renderCatalog();
  }
  if (action === "reset-filters") {
    state.category = "Todos";
    state.occasion = "Todos";
    state.price = "Todos";
    renderCatalog();
  }
  if (action === "detail") {
    state.selectedProduct = byId(Number(id));
    state.qty = 1;
    renderProduct();
    showView("product");
  }
  if (action === "add") {
    addToCart(Number(id), Number(button.dataset.qty || 1));
  }
  if (action === "buy") {
    addToCart(Number(id), 1, false);
    renderCart();
    showView("cart");
  }
  if (action === "cart") showView("cart");
  if (action === "qty") updateCartQty(Number(id), Number(button.dataset.delta));
  if (action === "remove") removeCartItem(Number(id));
  if (action === "product-qty") {
    state.qty = Math.max(1, state.qty + Number(button.dataset.delta));
    renderProduct();
  }
  if (action === "checkout") showView("checkout");
  if (action === "checkout-next") {
    state.checkoutStep = Math.min(4, state.checkoutStep + 1);
    renderCheckout();
  }
  if (action === "checkout-prev") {
    state.checkoutStep = Math.max(1, state.checkoutStep - 1);
    renderCheckout();
  }
  if (action === "delivery") {
    state.deliveryType = button.dataset.value;
    renderCheckout();
  }
  if (action === "payment") {
    state.payment = button.dataset.value;
    renderCheckout();
  }
  if (action === "track-order") {
    const input = document.querySelector("[data-track-input]");
    state.trackingQuery = input?.value.trim() || "";
    const query = state.trackingQuery.toLowerCase();
    state.trackedOrder = state.orders.find((order) => order.id.toLowerCase() === query || order.tracking.toLowerCase() === query) || null;
    renderOrders();
  }
  if (action === "admin-login") {
    state.adminLoggedIn = true;
    renderAdminLogin();
    showView("admin");
  }
  if (action === "confirm-order") {
    const orderNumber = `PED-${Math.floor(1000 + Math.random() * 9000)}`;
    const tracking = Math.random().toString(36).slice(2, 8).toUpperCase();
    state.orders.unshift({
      id: orderNumber,
      tracking,
      date: "Entrega: 12/07, 15:30",
      value: cartTotal() + 18,
      status: "Pedido recebido",
      items: state.cart.map((item) => item.productId),
      type: state.deliveryType,
    });
    state.lastOrder = state.orders[0];
    state.checkoutStep = 1;
    state.cart = [];
    renderAllDynamic();
    showView("confirmation");
  }
  if (action === "admin-tab") {
    state.adminTab = button.dataset.value;
    renderAdmin();
  }
}

function addToCart(productId, qty = 1, rerender = true) {
  const existing = state.cart.find((item) => item.productId === productId);
  if (existing) existing.qty += qty;
  else state.cart.push({ productId, qty, message: "" });
  if (rerender) renderAllDynamic();
}

function updateCartQty(productId, delta) {
  const item = state.cart.find((cartItem) => cartItem.productId === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) state.cart = state.cart.filter((cartItem) => cartItem.productId !== productId);
  renderCart();
  renderHome();
}

function removeCartItem(productId) {
  state.cart = state.cart.filter((item) => item.productId !== productId);
  renderCart();
  renderHome();
}

function renderAllDynamic() {
  renderHome();
  renderCatalog();
  renderCart();
  renderOrders();
  renderContact();
  renderAdmin();
}

function header(title, subtitle = "", right = true) {
  return `
    <div class="screen-head mobile-header">
      <button class="mobile-menu" aria-label="Abrir menu">${icon("menu")}</button>
      <div class="mobile-brand">
        <img class="mobile-brand-icon" src="assets/amor-cafe-brand-icon.png" alt="" aria-hidden="true" />
        <span class="mobile-brand-text"><span class="amor">Amor</span> <span class="resto">Café e Flor</span></span>
      </div>
      ${right ? `<button class="mobile-cart mini-cart" data-action="cart" aria-label="Abrir carrinho">${icon("shopping-cart")}<span class="cart-count">${cartItemsCount()}</span></button>` : `<span class="mobile-cart-spacer"></span>`}
    </div>
  `;
}

function renderHome() {
  $("#home-view").innerHTML = `
    ${header("Amor Café e Flor", "Presentes que acolhem, detalhes que encantam.")}
    <div class="hello">
      <h2>O que deseja presentear hoje?</h2>
    </div>
    <label class="home-search" aria-label="Pesquisar presentes">
      ${icon("search")}
      <input placeholder="Buscar flores, cafés, cestas..." />
    </label>
    <section class="hero">
      <div class="hero-copy">
        <h1>Presentes que acolhem,<br />detalhes que encantam.</h1>
        <button class="button" data-view="catalog">🌸 Comprar agora</button>
      </div>
    </section>
    <div class="social-proof">
      <span>⭐ 4,9 • Mais de 500 pedidos entregues</span>
      <span>🚚 Entrega rápida em Curitiba</span>
      <span>🎁 Cartão personalizado incluso</span>
    </div>
    <section class="section" id="occasions-section">
      <div class="section-row">
        <h2 class="section-title">Categorias</h2>
        <button class="text-link" data-view="catalog">Ver tudo</button>
      </div>
      <div class="category-grid">
        ${categories.map((category) => `
          <button class="category-card" data-action="category" data-value="${category}">
            ${icon(categoryIcon(category))}
            <span>${category}</span>
          </button>
        `).join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-row">
        <h2 class="section-title">Comprar por ocasião</h2>
      </div>
      <div class="occasion-grid occasion-chips">
        ${[
          ["❤️", "Amor"],
          ["🎂", "Aniversário"],
          ["👶", "Maternidade"],
          ["💍", "Casamento"],
          ["🎓", "Formatura"],
          ["🙏", "Condolências"],
        ].map(([emoji, occasion]) => `<button class="occasion-card" data-action="category" data-value="Todos"><span>${emoji} ${occasion}</span></button>`).join("")}
      </div>
    </section>
    ${homeProductRail("Mais vendidos", products.slice(0, 4))}
    ${homeProductRail("Lançamentos", [products[5], products[2], products[7], products[6]])}
    ${homeProductRail("Cestas especiais", [products[1], products[4], products[3]])}
  `;
  refreshIcons();
}

function homeProductRail(title, items) {
  return `
    <section class="section home-product-section">
      <div class="section-row">
        <h2 class="section-title">${title}</h2>
        <button class="text-link" data-view="catalog">Ver todos</button>
      </div>
      <div class="home-product-rail">${items.map(productCard).join("")}</div>
    </section>
  `;
}

function categoryIcon(category) {
  return {
    Buquês: "flower-2",
    Arranjos: "sprout",
    Cestas: "gift",
    Café: "coffee",
    Presentes: "package-heart",
    Chocolates: "dessert",
  }[category] || "flower";
}

function productCard(product) {
  return `
    <article class="product-card">
      <div class="product-media" data-action="detail" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-body">
        <p class="product-name">${product.name}</p>
        <p class="product-desc">${product.category} • ${product.occasion}</p>
        <div class="price-line">
          <span class="price">${brl.format(product.price)}</span>
          <span class="rating">★ ${product.rating.toFixed(1)}</span>
        </div>
        <span class="pix">${brl.format(pixPrice(product.price))} no Pix</span>
        <span class="installments">ou 3x de ${brl.format(product.price / 3)} no cartão</span>
        <div class="card-actions">
          <button class="buy-button" data-action="buy" data-id="${product.id}">Comprar</button>
          <button class="cart-button" data-action="add" data-id="${product.id}" aria-label="Adicionar ao carrinho">${icon("shopping-cart")}</button>
        </div>
      </div>
    </article>
  `;
}

function renderCatalog() {
  const query = state.search.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const categoryMatch = state.category === "Todos" || product.category === state.category || (state.category === "Flores" && ["Buquês", "Arranjos"].includes(product.category));
    const occasionMatch = state.occasion === "Todos" || product.occasion === state.occasion;
    const priceMatch =
      state.price === "Todos" ||
      (state.price === "Até R$ 180" && product.price <= 180) ||
      (state.price === "R$ 181 a R$ 250" && product.price > 180 && product.price <= 250) ||
      (state.price === "Acima de R$ 250" && product.price > 250);
    const searchMatch = !query || `${product.name} ${product.category} ${product.occasion} ${product.description}`.toLowerCase().includes(query);
    return categoryMatch && occasionMatch && priceMatch && searchMatch;
  });

  $("#catalog-view").innerHTML = `
    ${header("Produtos", "Flores, cafés, cestas e presentes especiais.")}
    <div class="catalog-discovery">
      <label class="search-box" aria-label="Pesquisar produtos">
        ${icon("search")}
        <input data-search value="${state.search}" placeholder="Buscar buquês, cafés, cestas..." />
      </label>
      <button class="filter-trigger" data-action="open-filters" aria-label="Abrir filtros">
        ${icon("sliders-horizontal")}
        <span>Filtros</span>
      </button>
    </div>
    <div class="chip-row catalog-chips" aria-label="Categorias">
      ${catalogCategories.map((category) => `<button class="chip ${state.category === category ? "active" : ""}" data-action="category" data-value="${category}">${category}</button>`).join("")}
    </div>
    <div class="active-filter-line">
      <span>${filtered.length} presentes encontrados</span>
      <span>${activeFilterSummary()}</span>
    </div>
    <section class="section">
      <div class="product-grid">${filtered.map(productCard).join("") || `<div class="empty">Nenhum produto encontrado para estes filtros.</div>`}</div>
    </section>
    ${filterSheet()}
  `;
  refreshIcons();
}

function activeFilterSummary() {
  const filters = [state.category, state.occasion, state.price].filter((item) => item !== "Todos");
  return filters.length ? filters.join(" • ") : "Filtros leves, compra rápida";
}

function filterSheet() {
  return `
    <div class="sheet-backdrop ${state.filtersOpen ? "open" : ""}" data-action="close-filters" aria-hidden="${state.filtersOpen ? "false" : "true"}"></div>
    <aside class="filter-sheet ${state.filtersOpen ? "open" : ""}" aria-label="Filtros de produtos">
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <div>
          <h2 class="section-title">Filtros</h2>
          <p class="brand-subtitle">Encontre o presente ideal com poucos toques.</p>
        </div>
        <button class="icon-button" data-action="close-filters" aria-label="Fechar filtros">${icon("x")}</button>
      </div>
      <div class="sheet-grid">
        <label class="filter-field">
          <span>Categoria</span>
          <select class="filter-select" data-filter="category">
            ${catalogCategories.map((category) => `<option ${state.category === category ? "selected" : ""}>${category}</option>`).join("")}
          </select>
        </label>
        <label class="filter-field">
          <span>Ocasião</span>
          <select class="filter-select" data-filter="occasion">
            ${["Todos", ...occasions].map((occasion) => `<option ${state.occasion === occasion ? "selected" : ""}>${occasion}</option>`).join("")}
          </select>
        </label>
        <label class="filter-field">
          <span>Faixa de preço</span>
          <select class="filter-select" data-filter="price">
            ${["Todos", "Até R$ 180", "R$ 181 a R$ 250", "Acima de R$ 250"].map((range) => `<option ${state.price === range ? "selected" : ""}>${range}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="sheet-actions">
        <button class="button secondary" data-action="reset-filters">Limpar</button>
        <button class="button full" data-action="close-filters">Ver produtos</button>
      </div>
    </aside>
  `;
}

function renderProduct() {
  const product = state.selectedProduct;
  $("#product-view").innerHTML = `
    <div class="topbar">
      <button class="icon-button" data-view="catalog" aria-label="Voltar">${icon("arrow-left")}</button>
      <button class="mini-cart" data-action="cart" aria-label="Abrir carrinho">${icon("shopping-cart")}<span class="cart-count">${cartItemsCount()}</span></button>
    </div>
    <div class="detail-layout">
      <div class="detail-media"><img src="${product.image}" alt="${product.name}" /></div>
      <article class="detail-panel">
        <h1 class="page-title">${product.name}</h1>
        <div class="price-line">
          <span class="rating">★ ${product.rating.toFixed(1)} avaliação premium</span>
          <span class="price">${brl.format(product.price)}</span>
        </div>
        <span class="pix">${brl.format(pixPrice(product.price))} no Pix com 5% off</span>
        <span class="installments">ou 3x de ${brl.format(product.price / 3)} no cartão</span>
        <div class="availability">${icon("badge-check")} Disponível para hoje</div>
        <p class="muted">${product.description}</p>
        <div class="qty-row">
          <strong>Quantidade</strong>
          <div class="qty-control">
            <button class="qty-button" data-action="product-qty" data-delta="-1">-</button>
            <strong>${state.qty}</strong>
            <button class="qty-button" data-action="product-qty" data-delta="1">+</button>
          </div>
        </div>
        <div class="form-grid">
          <textarea class="textarea" placeholder="Mensagem personalizada para o cartão"></textarea>
          <select class="filter-select">
            ${occasions.map((occasion) => `<option ${product.occasion === occasion ? "selected" : ""}>${occasion}</option>`).join("")}
          </select>
          <button class="button full" data-action="add" data-id="${product.id}" data-qty="${state.qty}">${icon("shopping-cart")} Adicionar ao carrinho</button>
        </div>
      </article>
    </div>
  `;
  refreshIcons();
}

function renderCart() {
  const subtotal = cartTotal();
  const delivery = state.cart.length ? 18 : 0;
  $("#cart-view").innerHTML = `
    ${header("Carrinho", "Revise os presentes antes de finalizar.")}
    <div class="cart-layout">
      <div class="cart-list">
        ${state.cart.length ? state.cart.map((item) => cartItem(item)).join("") : `<div class="empty">Seu carrinho está aguardando um presente especial.</div>`}
      </div>
      <aside class="summary-panel">
        <h2 class="section-title">Resumo</h2>
        <div class="summary-line"><span>Subtotal</span><strong>${brl.format(subtotal)}</strong></div>
        <div class="summary-line"><span>Taxa de entrega</span><strong>${brl.format(delivery)}</strong></div>
        <div class="summary-line total"><span>Total</span><span>${brl.format(subtotal + delivery)}</span></div>
        <button class="button full" data-action="checkout" ${state.cart.length ? "" : "disabled"}>${icon("credit-card")} Finalizar pedido</button>
      </aside>
    </div>
  `;
  refreshIcons();
}

function cartItem(item) {
  const product = byId(item.productId);
  return `
    <article class="cart-item">
      <img class="cart-image" src="${product.image}" alt="${product.name}" />
      <div class="cart-details">
        <h3>${product.name}</h3>
        <p class="cart-meta">${brl.format(product.price)} un. • ${product.category}</p>
        <div class="cart-controls">
          <div class="qty-control">
            <button class="qty-button" data-action="qty" data-id="${product.id}" data-delta="-1">-</button>
            <strong>${item.qty}</strong>
            <button class="qty-button" data-action="qty" data-id="${product.id}" data-delta="1">+</button>
          </div>
          <button class="remove-button" data-action="remove" data-id="${product.id}" aria-label="Remover">${icon("trash-2")}</button>
        </div>
      </div>
    </article>
  `;
}

function renderCheckout() {
  $("#checkout-view").innerHTML = `
    ${header("Checkout", "Etapa ${state.checkoutStep} de 4")}
    <div class="checkout-layout">
      <section class="checkout-panel">
        <div class="steps">${[1, 2, 3, 4].map((step) => `<span class="step-dot ${step <= state.checkoutStep ? "active" : ""}"></span>`).join("")}</div>
        ${checkoutStepTemplate()}
        <div class="checkout-actions">
          ${state.checkoutStep > 1 ? `<button class="button secondary" data-action="checkout-prev">Voltar</button>` : ""}
          ${
            state.checkoutStep < 4
              ? `<button class="button full" data-action="checkout-next">Continuar</button>`
              : `<button class="button full" data-action="confirm-order">${icon("check")} Confirmar pedido</button>`
          }
        </div>
      </section>
      <aside class="summary-panel">
        <h2 class="section-title">Pedido</h2>
        <div class="summary-line"><span>Itens</span><strong>${cartItemsCount()}</strong></div>
        <div class="summary-line"><span>Entrega</span><strong>${state.deliveryType}</strong></div>
        <div class="summary-line"><span>Pagamento</span><strong>${state.payment}</strong></div>
        <div class="summary-line total"><span>Total</span><span>${brl.format(cartTotal() + 18)}</span></div>
      </aside>
    </div>
  `;
  refreshIcons();
}

function checkoutStepTemplate() {
  if (state.checkoutStep === 1) {
    return `
      <h1 class="page-title">Dados do comprador</h1>
      <div class="form-grid">
        <input class="input" placeholder="Nome completo" />
        <input class="input" placeholder="WhatsApp" />
        <input class="input" placeholder="E-mail" />
      </div>
    `;
  }
  if (state.checkoutStep === 2) {
    return `
      <h1 class="page-title">Destinatário e mensagem</h1>
      <div class="form-grid">
        <input class="input" placeholder="Nome de quem recebe" />
        <input class="input" placeholder="Telefone opcional" />
        <textarea class="textarea" placeholder="Mensagem personalizada para o cartão"></textarea>
      </div>
    `;
  }
  if (state.checkoutStep === 3) {
    return `
      <h1 class="page-title">Entrega ou retirada</h1>
      <div class="option-grid">
        ${["Entrega", "Retirada na loja"].map((type) => `<button class="option-card ${state.deliveryType === type ? "active" : ""}" data-action="delivery" data-value="${type}">${type}</button>`).join("")}
      </div>
      <div class="form-grid">
        ${state.deliveryType === "Entrega" ? `<input class="input" placeholder="Endereço de entrega" />` : `<input class="input" value="Retirada: loja Amor Café e Flor" readonly />`}
        <input class="input" type="date" value="2026-07-12" />
        <input class="input" type="time" value="15:30" />
      </div>
    `;
  }
  return `
    <h1 class="page-title">Pagamento</h1>
    <div class="option-grid">
      ${["Pix", "Cartão"].map((payment) => `<button class="option-card ${state.payment === payment ? "active" : ""}" data-action="payment" data-value="${payment}">${payment}</button>`).join("")}
    </div>
    <p class="muted">Compra como visitante. Você receberá o número do pedido e código de rastreamento na confirmação.</p>
  `;
}

function renderConfirmation() {
  const order = state.lastOrder || state.orders[0];
  $("#confirmation-view").innerHTML = `
    ${header("Confirmação", "", false)}
    <section class="confirmation-panel">
      <div class="success-icon">${icon("check")}</div>
      <h1 class="page-title">Pedido realizado com sucesso!</h1>
      <p class="muted">Número do pedido: <strong>${order.id}</strong></p>
      <p class="muted">Código de rastreamento: <strong>${order.tracking}</strong></p>
      <div class="summary-line"><span>Data e horário</span><strong>12/07 às 15:30</strong></div>
      <div class="summary-line"><span>Pagamento</span><strong>${state.payment}</strong></div>
      <div class="status-pill">Pedido recebido</div>
      <div class="checkout-actions">
        <button class="button full" data-view="orders">Acompanhar pedido</button>
        <button class="button secondary full" data-view="home">Voltar ao início</button>
      </div>
    </section>
  `;
  refreshIcons();
}

function renderOrders() {
  const order = state.trackedOrder;
  $("#orders-view").innerHTML = `
    ${header("Acompanhar pedido", "Consulte sem login.")}
    <section class="summary-panel">
      <h1 class="page-title">Acompanhar pedido</h1>
      <p class="muted">Digite o número ou código do seu pedido para ver o status.</p>
      <div class="form-grid">
        <input class="input" data-track-input placeholder="Ex: PED-1024 ou AB7K92" value="${state.trackingQuery}" />
        <button class="button full" data-action="track-order">${icon("search")} Ver status</button>
      </div>
    </section>
    <div class="orders-list section">
      ${order ? orderCard(order) : state.trackingQuery ? `<div class="empty">Nenhum pedido encontrado com esse número ou código.</div>` : `<div class="empty">Informe o número do pedido ou código de rastreamento para acompanhar.</div>`}
    </div>
  `;
  refreshIcons();
}

function orderCard(order) {
  return `
    <article class="order-card">
      <div class="order-top">
        <div>
          <h3>${order.id}</h3>
          <p class="order-meta">${order.date} • ${brl.format(order.value)}</p>
        </div>
        <span class="status-pill">${order.status}</span>
      </div>
      <div class="status-track">
        ${orderStatuses.map((status) => `<span class="status-step ${statusReached(order.status, status) ? "done" : ""}">${status}</span>`).join("")}
      </div>
      <div class="order-products">
        ${order.items.map((id) => `<img class="order-product-img" src="${byId(id).image}" alt="${byId(id).name}" />`).join("")}
      </div>
    </article>
  `;
}

function statusReached(current, status) {
  return orderStatuses.indexOf(status) <= Math.max(0, orderStatuses.indexOf(current));
}

function renderContact() {
  $("#contact-view").innerHTML = `
    ${header("Contato", "Fale com a Amor Café e Flor.")}
    <section class="summary-panel">
      <h1 class="page-title">Contato da loja</h1>
      <div class="profile-list">
        <div class="profile-row"><span>${icon("message-circle")} WhatsApp</span><strong>(41) 99999-1234</strong></div>
        <div class="profile-row"><span>${icon("map-pin")} Endereço</span><strong>Rua das Flores, 120 - Curitiba</strong></div>
        <div class="profile-row"><span>${icon("clock")} Horário</span><strong>Seg a sáb, 8h às 19h</strong></div>
        <div class="profile-row"><span>${icon("instagram")} Instagram</span><strong>@amorcafeeflor</strong></div>
      </div>
      <button class="button full contact-whatsapp">${icon("send")} Falar no WhatsApp</button>
    </section>
  `;
  refreshIcons();
}

function renderAdminLogin() {
  $("#admin-login-view").innerHTML = `
    ${header("Admin", "Acesso restrito.", false)}
    <section class="checkout-panel">
      <h1 class="page-title">Login administrativo</h1>
      <p class="muted">Área exclusiva da loja. Entre para acessar dashboard, produtos, pedidos, agenda e configurações.</p>
      <div class="form-grid">
        <input class="input" placeholder="E-mail do admin" />
        <input class="input" type="password" placeholder="Senha" />
        <button class="button full" data-action="admin-login">${icon("lock-keyhole")} Entrar</button>
      </div>
    </section>
  `;
  refreshIcons();
}

function renderAdmin() {
  if (!state.adminLoggedIn) {
    renderAdminLogin();
    return;
  }
  $("#admin-view").innerHTML = `
    ${header("Admin", "Gestão da Amor Café e Flor.")}
    <div class="admin-tabs">
      ${["dashboard", "produtos", "pedidos", "agenda", "configuracoes"].map((tab) => `<button class="admin-tab ${state.adminTab === tab ? "active" : ""}" data-action="admin-tab" data-value="${tab}">${tabLabel(tab)}</button>`).join("")}
    </div>
    ${adminTemplate()}
  `;
  refreshIcons();
}

function tabLabel(tab) {
  return { dashboard: "Dashboard", produtos: "Produtos", pedidos: "Pedidos", agenda: "Agenda", configuracoes: "Configurações" }[tab];
}

function adminTemplate() {
  if (state.adminTab === "dashboard") {
    return `
      <div class="stats-grid">
        <article class="stat-card"><span>Pedidos de hoje</span><strong>18</strong></article>
        <article class="stat-card"><span>Pendentes</span><strong>7</strong></article>
        <article class="stat-card"><span>Entregas de hoje</span><strong>11</strong></article>
        <article class="stat-card"><span>Faturamento estimado</span><strong>${brl.format(4260)}</strong></article>
      </div>
    `;
  }
  if (state.adminTab === "produtos") {
    return `
      <div class="admin-layout">
        <section class="admin-block">
          <h3>Cadastrar produto</h3>
          <div class="admin-form">
            <input class="input" placeholder="Nome" />
            <input class="input" placeholder="Preço" />
            <textarea class="textarea" placeholder="Descrição"></textarea>
            <select class="filter-select">${catalogCategories.slice(1).map((category) => `<option>${category}</option>`).join("")}</select>
            <input class="input" placeholder="URL da foto" />
            <select class="filter-select"><option>Disponível</option><option>Indisponível</option></select>
          </div>
          <button class="button full">${icon("plus")} Salvar produto</button>
        </section>
        <section class="admin-list">
          ${products.slice(0, 5).map((product) => `
            <article class="admin-block">
              <div class="admin-top">
                <div><h3>${product.name}</h3><p class="admin-meta">${product.category} • ${brl.format(product.price)}</p></div>
                <span class="status-pill">Disponível</span>
              </div>
              <div class="checkout-actions"><button class="button secondary">Editar</button><button class="button secondary">Excluir</button></div>
            </article>
          `).join("")}
        </section>
      </div>
    `;
  }
  if (state.adminTab === "pedidos") {
    return `
      <div class="admin-list">
        ${state.orders.map((order, index) => `
          <article class="admin-block">
            <div class="admin-top">
              <div>
                <h3>${order.id} • Ana Clara</h3>
                <p class="admin-meta">Destinatário: Marina • ${order.type} • ${order.date} • ${brl.format(order.value)}</p>
                <p class="admin-meta">Pagamento: ${index === 0 ? "Pix aprovado" : "Cartão aprovado"} • Mensagem: "Que seu dia floresça."</p>
              </div>
              <span class="status-pill">${order.status}</span>
            </div>
            <div class="form-grid">
              <select class="filter-select" data-admin-status>
                ${adminStatuses.map((status) => `<option ${status === order.status ? "selected" : ""}>${status}</option>`).join("")}
              </select>
              <textarea class="textarea" placeholder="Observações do pedido">Endereço: Rua das Flores, 120. Produtos: ${order.items.map((id) => byId(id).name).join(", ")}.</textarea>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }
  if (state.adminTab === "configuracoes") {
    return `
      <section class="admin-block">
        <h3>Configurações da loja</h3>
        <div class="admin-form">
          <input class="input" value="Amor Café e Flor" />
          <input class="input" value="(41) 99999-1234" />
          <input class="input" value="Rua das Flores, 120 - Curitiba" />
          <select class="filter-select"><option>Loja aberta</option><option>Loja pausada</option></select>
        </div>
        <button class="button full">${icon("save")} Salvar configurações</button>
      </section>
    `;
  }
  return `
    <div class="schedule-list">
      ${[
        ["09:00", "Cesta Doce Manhã", "Retirada na loja"],
        ["10:30", "Cesta Café Romântico", "Entrega - Batel"],
        ["15:30", "Buquê Encanto", "Entrega - Centro"],
        ["17:00", "Presente Completo Amor", "Entrega - Água Verde"],
      ].map(([time, title, meta]) => `
        <article class="schedule-item">
          <div class="schedule-top">
            <div><h3>${time} • ${title}</h3><p class="admin-meta">${meta}</p></div>
            <span class="status-pill">Organizado</span>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", mount);
