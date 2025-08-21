// =============================================================================
// Importing Dependencies and elements
// =============================================================================
import {
    animateOrderCards,
    animateOrderStatus,
    animateSectionTransition,
    animateProductCard,
    animateModal,
    animateModalItem,
    setupButtonAnimations,
    createBackgroundAnimations
} from './animation.js';

// =============================================================================
// Configuration and State
// =============================================================================
const apiUrl = "http://localhost:4000";
let currentEditingOrder = null;
let currentOrder = {
  items: [],
  subtotal: 0,
  tax: 0,
  tip: 20,
  tipAmount: 0,
  total: 0,
};

// =============================================================================
// DOM Elements
// =============================================================================
const sections = {
  orders: document.getElementById("orders-section"),
  newOrder: document.getElementById("new-order-section"),
  analytics: document.getElementById("analytics-section"),
  history: document.getElementById("history-section"),
};

const navLinks = {
  orders: document.getElementById("orders-link"),
  newOrder: document.getElementById("new-order-link"),
  analytics: document.getElementById("analytics-link"),
  history: document.getElementById("history-link"),
  mobileOrders: document.getElementById("mobile-orders-link"),
  mobileNewOrder: document.getElementById("mobile-new-order-link"),
  mobileAnalytics: document.getElementById("mobile-analytics-link"),
  mobileHistory: document.getElementById("mobile-history-link"),
};

const elements = {
  productsGrid: document.querySelector(".products-grid"),
  orderItemsList: document.getElementById("order-items"),
  subtotalEl: document.getElementById("subtotal"),
  taxEl: document.getElementById("tax"),
  tipAmountEl: document.getElementById("tip-amount"),
  orderTotalEl: document.getElementById("order-total"),
  editModal: document.getElementById("edit-modal"),
  editOrderId: document.getElementById("edit-order-id"),
  modalSubtotal: document.getElementById("modal-subtotal"),
  modalTax: document.getElementById("modal-tax"),
  modalTipAmount: document.getElementById("modal-tip-amount"),
  modalTotal: document.getElementById("modal-total"),
  themeToggle: document.getElementById("theme-toggle"),
};

// =============================================================================
// Initialization
// =============================================================================
function init() {
  // Set initial theme
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark-theme", savedTheme === "dark");
  updateThemeIcon(savedTheme);

  renderProducts();
  setupEventListeners();
  createBackgroundAnimations();
  updateActiveOrders();
  setActiveSection(sections.orders, navLinks.orders, navLinks.mobileOrders);
  checkProductCategories();
  setupButtonAnimations();
}

// =============================================================================
// Theme Toggle
// =============================================================================
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-theme");
  const theme = isDark ? "dark" : "light";
  localStorage.setItem("theme", theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const icon = elements.themeToggle.querySelector("i");
  icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

// =============================================================================
// Product Management
// =============================================================================
function renderProducts() {
  elements.productsGrid.innerHTML = "";
  fetch(apiUrl + "/food")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((product, index) => {
        const delay = index % 4;
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.category = product.category;
        card.style.setProperty("--delay", delay);

        card.innerHTML = `
                            <div class="product-image">
                                <i class="fas ${product.icon}"></i>
                            </div>
                            <div class="product-info">
                                <h4 id="${product.id}">${product.name}</h4>
                                <div class="product-price">
                                    <span>$${product.price.toFixed(2)}</span>
                                    <button class="add-btn"><i class="fas fa-plus"></i></button>
                                </div>
                            </div>
                        `;
        elements.productsGrid.appendChild(card);
        animateProductCard(card, index);
      });
      setupProductEventListeners();
    })
    .catch((error) => console.error("Error fetching products:", error));
}

// =============================================================================
// Order Management
// =============================================================================
function addProductToOrder(name, price, id) {
  const existingItem = currentOrder.items.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    currentOrder.items.push({
      name: name,
      price: price,
      quantity: 1,
      id: id,
    });
  }

  updateOrderSummary();
}

function updateOrderSummary() {
  elements.orderItemsList.innerHTML = "";

  currentOrder.subtotal = currentOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  currentOrder.items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "summary-item";
    li.innerHTML = `
                    <div class="item-info">
                        <strong>${item.name}</strong>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="item-actions">
                        <button class="decrease" data-id="${
                          item.id
                        }"><i class="fas fa-minus"></i></button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="increase" data-id="${
                          item.id
                        }"><i class="fas fa-plus"></i></button>
                        <span class="remove-item" data-id="${
                          item.id
                        }"><i class="fas fa-times"></i></span>
                    </div>
                `;
    elements.orderItemsList.appendChild(li);
  });

  calculateOrderTotal();
  setupOrderItemEventListeners();
}

function calculateOrderTotal() {
  currentOrder.tax = currentOrder.subtotal * 0.1;

  if (currentOrder.tip && !currentOrder.tipAmount) {
    currentOrder.tipAmount = currentOrder.subtotal * (currentOrder.tip / 100);
  }

  currentOrder.total =
    currentOrder.subtotal + currentOrder.tax + currentOrder.tipAmount;

  if (elements.subtotalEl)
    elements.subtotalEl.textContent = `$${currentOrder.subtotal.toFixed(2)}`;
  if (elements.taxEl)
    elements.taxEl.textContent = `$${currentOrder.tax.toFixed(2)}`;
  if (elements.tipAmountEl)
    elements.tipAmountEl.textContent = `$${currentOrder.tipAmount.toFixed(2)}`;
  if (elements.orderTotalEl)
    elements.orderTotalEl.textContent = `$${currentOrder.total.toFixed(2)}`;
}

function clearCurrentOrder() {
  currentOrder = {
    items: [],
    subtotal: 0,
    tax: 0,
    tip: 20,
    tipAmount: 0,
    total: 0,
  };
  elements.orderItemsList.innerHTML = "";
  calculateOrderTotal();
}

function submitOrder() {
  if (currentOrder.items.length === 0) {
    alert("Your order is empty!");
    return;
  }

  const orderData = {
    items: currentOrder.items,
    subtotal: currentOrder.subtotal,
    tax: currentOrder.tax,
    tip: currentOrder.tip,
    tipAmount: currentOrder.tipAmount,
    total: currentOrder.total,
    id: Math.random().toString(36).substring(2, 6),
    status: "Pending",
  };

  fetch(apiUrl + "/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((data) => {
      clearCurrentOrder();
      updateActiveOrders();
      setActiveSection(sections.orders, navLinks.orders, navLinks.mobileOrders);
    })
    .catch((error) => console.error("Error submitting order:", error));
}

// =============================================================================
// Active Orders Management
// =============================================================================
function updateActiveOrders() {
  const activeOrdersList = sections.orders.querySelector(".orders-grid");
  activeOrdersList.innerHTML = "";

  fetch(apiUrl + "/submit")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((order) => {
        const orderCard = createOrderCard(order);
        activeOrdersList.appendChild(orderCard);
      });
      setTimeout(() => {
        animateOrderCards();
      }, 10);
      setupOrderCardEventListeners();
    })
    .catch((error) => console.error("Error fetching active orders:", error));
}

function createOrderCard(order) {
  const orderCard = document.createElement("div");
  orderCard.className = "order-card";

  let statusClass = "status-pending";
  if (order.status.toLowerCase() === "preparing") {
    statusClass = "status-preparing";
  } else if (order.status.toLowerCase() === "ready") {
    statusClass = "status-ready";
  }

  orderCard.innerHTML = `
                <div class="order-header">
                    <h3><i class="fas fa-receipt"></i> Order #${order.id}</h3>
                    <span class="order-status ${statusClass}">${
    order.status
  }</span>
                </div>
                <div class="order-body">
                    <ul class="order-items">
                        ${order.items
                          .map(
                            (item) => `
                            <li>
                                <span>${item.name}</span>
                                <span>$${(item.quantity * item.price).toFixed(
                                  2
                                )}</span>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                    <div class="order-total">
                        <span>Total:</span>
                        <span>$${order.total.toFixed(2)}</span>
                    </div>
                </div>
                <div class="order-actions">
                    <button class="btn btn-outline edit-order" data-id="${
                      order.id
                    }">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-primary complete-order" data-id="${
                      order.id
                    }">
                        <i class="fas fa-check"></i> Complete
                    </button>
                </div>
            `;

  return orderCard;
}

// =============================================================================
// Edit Order Modal
// =============================================================================
function editOrder(orderId) {
  fetch(apiUrl + `/submit`)
    .then((response) => response.json())
    .then((data) => {
      const order = data.find((o) => o.id === orderId);
      if (order) {
        currentEditingOrder = order;
        if (elements.editOrderId) elements.editOrderId.textContent = order.id;

        updateEditModalList(currentEditingOrder);
        updateModalTotals(currentEditingOrder);
        displayCurrentStatusInModal(order.status);

        // Cargar productos en el modal
        loadProductsInModal();


        elements.editModal.classList.add("active");
        animateModal(document.querySelector(".modal-content"));
      } else {
        alert("Order not found!");
      }
    });
}

function updateEditModalList(order) {
  const orderItemsList = document.querySelector(".modal-items-list");
  if (!orderItemsList) return;

  orderItemsList.innerHTML = "";

  order.items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "modal-item";
    li.innerHTML = `
                    <div class="item-info">
                        <strong>${item.name}</strong>
                        <p>$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div class="modal-item-actions">
                        <button class="decrease" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="increase" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                        <span class="remove-item" data-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </span>
                    </div>
                `;
    orderItemsList.appendChild(li);
  });

  setupModalItemEventListeners();
}

function updateModalTotals(order) {
  // Calculate values if they don't exist (for backward compatibility)
  if (typeof order.subtotal === "undefined") {
    order.subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  if (typeof order.tax === "undefined") {
    order.tax = order.subtotal * 0.1;
  }

  if (typeof order.tipAmount === "undefined" && order.tip) {
    order.tipAmount = order.subtotal * (order.tip / 100);
  } else if (typeof order.tipAmount === "undefined") {
    order.tipAmount = 0;
  }

  if (typeof order.total === "undefined") {
    order.total = order.subtotal + order.tax + order.tipAmount;
  }

  // Update the UI only if elements exist
  if (elements.modalSubtotal)
    elements.modalSubtotal.textContent = `$${order.subtotal.toFixed(2)}`;
  if (elements.modalTax)
    elements.modalTax.textContent = `$${order.tax.toFixed(2)}`;
  if (elements.modalTipAmount)
    elements.modalTipAmount.textContent = `$${order.tipAmount.toFixed(2)}`;
  if (elements.modalTotal)
    elements.modalTotal.textContent = `$${order.total.toFixed(2)}`;
}

function recalculateOrderTotals(order) {
  // Calcular subtotal
  order.subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calcular impuesto (10%)
  order.tax = order.subtotal * 0.1;

  // Calcular propina si es basada en porcentaje
  if (order.tip && order.tip > 0) {
    order.tipAmount = order.subtotal * (order.tip / 100);
  }

  // Calcular total
  order.total = order.subtotal + order.tax + (order.tipAmount || 0);
}

function updateDb(order) {
  recalculateOrderTotals(order);

  fetch(`${apiUrl}/submit/${order.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  })
    .then((response) => {
      if (response.ok) {
        currentEditingOrder = null;
        updateActiveOrders();
      }
    })
    .catch((error) => {
      console.error("Error updating order:", error);
    });
}
// =============================================================================
// New Funtions
// =============================================================================
// Función para cargar productos en el modal de edición
function loadProductsInModal() {
  const modalProductsGrid = document.querySelector(".modal-products-grid");
  if (!modalProductsGrid) return;

  modalProductsGrid.innerHTML = "";

  fetch(apiUrl + "/food")
    .then((response) => response.json())
    .then((products) => {
      products.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.className = "modal-product-item";
        productElement.innerHTML = `
                    <div class="modal-product-image">
                        <i class="fas ${product.icon}"></i>
                    </div>
                    <h5>${product.name}</h5>
                    <p>$${product.price.toFixed(2)}</p>
                `;

        productElement.addEventListener("click", () => {
          addProductToEditingOrder(product);
        });

        modalProductsGrid.appendChild(productElement);
      });
    })
    .catch((error) =>
      console.error("Error loading products for modal:", error)
    );
}

// Función para agregar producto a la orden en edición
function addProductToEditingOrder(product) {
  // Verificar si el producto ya existe en la orden
  const existingItem = currentEditingOrder.items.find(
    (item) => item.id === product.id
  );

  if (existingItem) {
    existingItem.quantity++;
  } else {
    currentEditingOrder.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  // Recalcular totales
  recalculateOrderTotals(currentEditingOrder);

  // Actualizar la interfaz
  updateEditModalList(currentEditingOrder);
  updateModalTotals(currentEditingOrder);
}

// Función para buscar productos en el modal
function setupModalProductSearch() {
  const searchInput = document.getElementById("modal-product-search");
  const searchButton = document.getElementById("modal-search-btn");

  if (!searchInput || !searchButton) return;

  const performSearch = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const productItems = document.querySelectorAll(".modal-product-item");

    productItems.forEach((item) => {
      const productName = item.querySelector("h5").textContent.toLowerCase();
      if (productName.includes(searchTerm)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  };

  searchInput.addEventListener("input", performSearch);
  searchButton.addEventListener("click", performSearch);
}

// =============================================================================
// Event Listeners Setup
// =============================================================================
function setupEventListeners() {
  setupModalProductSearch();
  // Navigation
  navLinks.orders.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveSection(sections.orders, navLinks.orders, navLinks.mobileOrders);
  });

  navLinks.newOrder.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveSection(
      sections.newOrder,
      navLinks.newOrder,
      navLinks.mobileNewOrder
    );
  });

  navLinks.analytics.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveSection(
      sections.analytics,
      navLinks.analytics,
      navLinks.mobileAnalytics
    );
  });

  navLinks.history.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveSection(
      sections.history,
      navLinks.history,
      navLinks.mobileHistory
    );
  });

  // Mobile navigation
  navLinks.mobileOrders.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveSection(sections.orders, navLinks.orders, navLinks.mobileOrders);
  });

  navLinks.mobileNewOrder.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveSection(
      sections.newOrder,
      navLinks.newOrder,
      navLinks.mobileNewOrder
    );
  });

  navLinks.mobileAnalytics.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveSection(
      sections.analytics,
      navLinks.analytics,
      navLinks.mobileAnalytics
    );
  });

  navLinks.mobileHistory.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveSection(
      sections.history,
      navLinks.history,
      navLinks.mobileHistory
    );
  });

  // Buttons
  document.getElementById("create-order-btn").addEventListener("click", () => {
    setActiveSection(
      sections.newOrder,
      navLinks.newOrder,
      navLinks.mobileNewOrder
    );
  });

  document.getElementById("back-to-orders").addEventListener("click", () => {
    setActiveSection(sections.orders, navLinks.orders, navLinks.mobileOrders);
  });

  document.getElementById("floating-action").addEventListener("click", () => {
    setActiveSection(
      sections.newOrder,
      navLinks.newOrder,
      navLinks.mobileNewOrder
    );
  });

  document.querySelector(".close-modal").addEventListener("click", () => {
    elements.editModal.classList.remove("active");
  });

  elements.editModal.addEventListener("click", (e) => {
    if (e.target === elements.editModal) {
      elements.editModal.classList.remove("active");
    }
  });

  // Category filtering
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filterProducts(btn.dataset.category);
    });
  });

  // Order actions
  document.getElementById("clear-order").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this order?")) {
      clearCurrentOrder();
    }
  });

  document
    .getElementById("submit-order")
    .addEventListener("click", submitOrder);

  // Tip selection
  document.querySelectorAll(".tip-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".tip-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const tipPercentage = parseInt(btn.dataset.tip);
      currentOrder.tip = tipPercentage;
      currentOrder.tipAmount = 0;
      calculateOrderTotal();
    });
  });

  // Custom tip
  document.getElementById("apply-custom-tip").addEventListener("click", () => {
    const tipValue = parseFloat(
      document.getElementById("custom-tip-input").value
    );
    if (tipValue >= 0) {
      document
        .querySelectorAll(".tip-btn")
        .forEach((b) => b.classList.remove("active"));
      currentOrder.tipAmount = tipValue;
      currentOrder.tip = 0;
      calculateOrderTotal();
    }
  });

  // Status selection in modal
  document.querySelectorAll(".status-option").forEach((option) => {
    option.addEventListener("click", () => {
      document
        .querySelectorAll(".status-option")
        .forEach((o) => o.classList.remove("active"));
      option.classList.add("active");

      if (currentEditingOrder) {
        let newStatus = "";
        if (option.classList.contains("pending")) {
          newStatus = "Pending";
        } else if (option.classList.contains("preparing")) {
          newStatus = "Preparing";
        } else if (option.classList.contains("ready")) {
          newStatus = "Ready";
        }

        currentEditingOrder.status = newStatus;
      }
    });
  });

  // Cancel order
  document.getElementById("cancel-order-btn").addEventListener("click", () => {
    elements.editModal.classList.remove("active");
    if (currentEditingOrder) {
      fetch(`${apiUrl}/submit/${currentEditingOrder.id}`, {
        method: "DELETE",
      }).then((response) => {
        if (response.ok) {
          updateActiveOrders();
        }
        currentEditingOrder = null;
      });
    }
  });

  // Save changes
  document.getElementById("save-changes-btn").addEventListener("click", () => {
    if (currentEditingOrder) {
      updateDb(currentEditingOrder);
      elements.editModal.classList.remove("active");
    }
  });

  // Theme toggle
  elements.themeToggle.addEventListener("click", toggleTheme);
}

function setupProductEventListeners() {
  // Use event delegation for product cards
  elements.productsGrid.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".add-btn");
    if (addBtn) {
      const card = addBtn.closest(".product-card");
      const productName = card.querySelector("h4").textContent;
      const productId = card.querySelector("h4").id;
      const productPrice = parseFloat(
        card.querySelector(".product-price span").textContent.replace("$", "")
      );

      // Add animation
      anime({
        targets: addBtn,
        scale: [1, 1.2, 1],
        duration: 300,
        easing: "easeInOutSine",
      });

      addProductToOrder(productName, productPrice, parseInt(productId));
    }
  });
}

function setupOrderItemEventListeners() {
  // Use event delegation for order items
  elements.orderItemsList.addEventListener("click", (e) => {
    const target = e.target;
    const id = parseInt(target.closest("[data-id]")?.dataset.id);

    if (!id) return;

    if (target.closest(".decrease")) {
      modifyQuantity(id, false);
    } else if (target.closest(".increase")) {
      modifyQuantity(id, true);
    } else if (target.closest(".remove-item")) {
      deleteProduct(id);
    }
  });
}

function setupOrderCardEventListeners() {
  const ordersGrid = sections.orders.querySelector(".orders-grid");
  if (!ordersGrid) return;

  // Use event delegation for order cards
  ordersGrid.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-order");
    if (editBtn) {
      const orderId = editBtn.dataset.id;
      editOrder(orderId);
    }

    const completeBtn = e.target.closest(".complete-order");
    if (completeBtn) {
      const orderId = completeBtn.dataset.id;
      completeOrder(orderId);
    }
  });
}

function setupModalItemEventListeners() {
  const modalItemsList = document.querySelector(".modal-items-list");
  if (!modalItemsList) return;

  // Use event delegation for modal items
  modalItemsList.addEventListener("click", (e) => {
    const target = e.target;
    const id = parseInt(target.closest("[data-id]")?.dataset.id);

    if (!id) return;

    if (target.closest(".decrease")) {
      editQuantity(id, false);
    } else if (target.closest(".increase")) {
      editQuantity(id, true);
    } else if (target.closest(".remove-item")) {
      deleteProductInModal(id);
    }
  });
}

// =============================================================================
// Utility Functions
// =============================================================================
function setActiveSection(section, link, mobileLink) {
  Object.values(sections).forEach((sec) => (sec.style.display = "none"));
  section.style.display = "block";
  animateSectionTransition(section, () => {
    document
      .querySelectorAll("nav a")
      .forEach((a) => a.classList.remove("active"));
    document
      .querySelectorAll(".mobile-nav a")
      .forEach((a) => a.classList.remove("active"));

    link.classList.add("active");
    mobileLink.classList.add("active");

    // Animación para los enlaces activos
        anime({
            targets: [link, mobileLink],
            scale: [0.9, 1],
            duration: 900,
            easing: 'easeOutElastic(1, .8)'
        });
  });

  Object.values(navLinks).forEach((nav) => nav.classList.remove("active"));
  link.classList.add("active");
  mobileLink.classList.add("active");
}

// Función de filtrado mejorada con logs de depuración
function filterProducts(category) {
  console.log("Filtrando por categoría:", category);

  const productCards = document.querySelectorAll(".product-card");
  console.log("Número de productos encontrados:", productCards.length);

  let visibleCount = 0;

  productCards.forEach((card) => {
    const cardCategory = card.dataset.category;
    console.log(
      `Producto: ${
        card.querySelector("h4").textContent
      }, Categoría: ${cardCategory}`
    );

    if (category === "all" || cardCategory === category) {
      card.style.display = "block";
      visibleCount++;

      // Reiniciar animaciones para evitar conflictos
      anime.remove(card);
      anime({
        targets: card,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 300,
        easing: "easeOutExpo",
      });
    } else {
      card.style.display = "none";
    }
  });

  console.log("Productos visibles después de filtrar:", visibleCount);

  // Si no hay productos visibles, mostrar mensaje
  if (visibleCount === 0) {
    showNoProductsMessage(category);
  } else {
    hideNoProductsMessage();
  }
}
function showNoProductsMessage(category) {
  let message = document.getElementById("no-products-message");

  if (!message) {
    message = document.createElement("div");
    message.id = "no-products-message";
    message.style.textAlign = "center";
    message.style.padding = "20px";
    message.style.color = "var(--text-color)";
    document.querySelector(".products-grid").appendChild(message);
  }

  message.innerHTML = `
        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <h4>No products found in ${category} category</h4>
        <p>Try selecting a different category</p>
    `;
}

function hideNoProductsMessage() {
  const message = document.getElementById("no-products-message");
  if (message) {
    message.remove();
  }
}
// Función para verificar las categorías de productos
function checkProductCategories() {
  fetch(apiUrl + "/food")
    .then((response) => response.json())
    .then((products) => {
      console.group("Diagnóstico de Categorías de Productos");
      console.log("Total de productos:", products.length);

      const categories = {};
      products.forEach((product) => {
        if (!categories[product.category]) {
          categories[product.category] = 0;
        }
        categories[product.category]++;
      });

      console.log("Categorías encontradas:", categories);
      console.groupEnd();
    })
    .catch((error) => console.error("Error al verificar categorías:", error));
}

function modifyQuantity(id, increase) {
  const item = currentOrder.items.find((item) => item.id === id);
  if (item) {
    if (increase) {
      item.quantity++;
    } else {
      item.quantity--;
      if (item.quantity <= 0) {
        currentOrder.items = currentOrder.items.filter((i) => i.id !== id);
      }
    }
    calculateOrderTotal();
    updateOrderSummary();
  }
}

function deleteProduct(id) {
  currentOrder.items = currentOrder.items.filter((item) => item.id !== id);
  calculateOrderTotal();
  updateOrderSummary();
}

function editQuantity(id, increase) {
  const item = currentEditingOrder.items.find((item) => item.id === id);
  if (item) {
    if (increase) {
      item.quantity++;
    } else {
      item.quantity--;
      if (item.quantity <= 0) {
        currentEditingOrder.items = currentEditingOrder.items.filter(
          (i) => i.id !== id
        );
      }
    }

    recalculateOrderTotals(currentEditingOrder);
    updateEditModalList(currentEditingOrder);
    updateModalTotals(currentEditingOrder);
  }
}

function deleteProductInModal(id) {
  currentEditingOrder.items = currentEditingOrder.items.filter(
    (item) => item.id !== id
  );

  recalculateOrderTotals(currentEditingOrder);
  updateEditModalList(currentEditingOrder);
  updateModalTotals(currentEditingOrder);
}

function displayCurrentStatusInModal(status) {
  const statusOptions = document.querySelectorAll(".status-option");
  statusOptions.forEach((option) => option.classList.remove("active"));

  const statusMap = {
    pending: "pending",
    preparing: "preparing",
    ready: "ready",
  };

  if (statusMap[status.toLowerCase()]) {
    const activeOption = document.querySelector(
      `.status-option.${statusMap[status.toLowerCase()]}`
    );
    if (activeOption) {
      activeOption.classList.add("active");
    }
  }
}

function completeOrder(orderId) {
  fetch(`${apiUrl}/submit/${orderId}`)
    .then((response) => response.json())
    .then((order) => {
      order.status = "Completed";
      updateDb(order);
    });
}

// =============================================================================
// Initialize the application
// =============================================================================
document.addEventListener("DOMContentLoaded", init);
