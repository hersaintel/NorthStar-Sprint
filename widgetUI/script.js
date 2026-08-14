/* =========================================================================
   NETSANET'S SHELL (Task 6, PR #3) — open/close + input box, unchanged.
   ========================================================================= */
const triggerBtn = document.getElementById('chatTrigger');
const popup = document.getElementById('chatPopup');
const closeBtn = document.getElementById('closeBtn');
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const chatBody = document.getElementById('chatBody');

// Toggle popup
triggerBtn.addEventListener('click', () => {
  popup.classList.toggle('active');
  // Start the guided conversation the first time the widget opens.
  if (popup.classList.contains('active') && chatBody.children.length === 0) {
    startConversation();
  }
});

// Close popup
closeBtn.addEventListener('click', () => {
  popup.classList.remove('active');
});

// NOTE for the team: the project brief says buttons only, no free-text NLU.
// This text input still works as a fallback (flag with the group whether
// to keep, hide, or repurpose it) — it does not feed into the order lookup.
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  const userMsg = document.createElement('div');
  userMsg.className = 'message user-message';
  userMsg.textContent = text;
  chatBody.appendChild(userMsg);

  chatInput.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'message bot-message';
    botMsg.textContent = "For fastest help, please use the buttons above instead of typing.";
    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});


/* =========================================================================
   REAL DATA — from Maina Kennedy's PR #4 (data/orders.json).
   Field names: orderId, customerName, status, eta, items, lastUpdated.
   ========================================================================= */
const REAL_ORDERS = {
  "orders": [
    { "orderId": "NS-1001", "customerName": "A. Otieno", "status": "Delivered", "eta": null, "items": ["Wireless Earbuds"], "lastUpdated": "2026-08-05" },
    { "orderId": "NS-1002", "customerName": "B. Kimani", "status": "Shipped", "eta": "2026-08-14", "items": ["Running Shoes - Size 42"], "lastUpdated": "2026-08-10" },
    { "orderId": "NS-1003", "customerName": "C. Wanjiru", "status": "Processing", "eta": "2026-08-16", "items": ["Bluetooth Speaker"], "lastUpdated": "2026-08-11" },
    { "orderId": "NS-1004", "customerName": "D. Mutua", "status": "Delayed", "eta": "2026-08-20", "items": ["Office Chair"], "lastUpdated": "2026-08-10" },
    { "orderId": "NS-1005", "customerName": "E. Njoroge", "status": "Delivered", "eta": null, "items": ["Phone Case", "Screen Protector"], "lastUpdated": "2026-08-03" },
    { "orderId": "NS-1006", "customerName": "F. Achieng", "status": "Cancelled", "eta": null, "items": ["Backpack"], "lastUpdated": "2026-08-07" },
    { "orderId": "NS-1007", "customerName": "G. Mwangi", "status": "Shipped", "eta": "2026-08-13", "items": ["Laptop Stand"], "lastUpdated": "2026-08-09" },
    { "orderId": "NS-1008", "customerName": "H. Chebet", "status": "Processing", "eta": "2026-08-17", "items": ["Desk Lamp"], "lastUpdated": "2026-08-11" },
    { "orderId": "NS-1009", "customerName": "I. Odhiambo", "status": "Delivered", "eta": null, "items": ["Kitchen Blender"], "lastUpdated": "2026-08-01" },
    { "orderId": "NS-1010", "customerName": "J. Wafula", "status": "Out for Delivery", "eta": "2026-08-12", "items": ["Yoga Mat"], "lastUpdated": "2026-08-12" },
    { "orderId": "NS-1011", "customerName": "K. Nyambura", "status": "Shipped", "eta": "2026-08-15", "items": ["Wall Clock"], "lastUpdated": "2026-08-10" },
    { "orderId": "NS-1012", "customerName": "L. Barasa", "status": "Delayed", "eta": "2026-08-22", "items": ["Standing Desk"], "lastUpdated": "2026-08-09" },
    { "orderId": "NS-1013", "customerName": "M. Cherono", "status": "Processing", "eta": "2026-08-18", "items": ["Coffee Maker"], "lastUpdated": "2026-08-11" },
    { "orderId": "NS-1014", "customerName": "N. Kiptoo", "status": "Delivered", "eta": null, "items": ["Notebook Set"], "lastUpdated": "2026-08-04" },
    { "orderId": "NS-1015", "customerName": "O. Adhiambo", "status": "Shipped", "eta": "2026-08-14", "items": ["Table Lamp", "Extension Cord"], "lastUpdated": "2026-08-10" },
    { "orderId": "NS-1016", "customerName": "P. Wekesa", "status": "Cancelled", "eta": null, "items": ["Bluetooth Headphones"], "lastUpdated": "2026-08-06" }
  ],
  "possibleStatuses": ["Processing", "Shipped", "Out for Delivery", "Delivered", "Delayed", "Cancelled"],
  "notFoundMessage": "We couldn't find an order with that ID. Please double-check and try again, or contact support directly."
};

async function loadOrders() {
  // TEMP: real dataset hardcoded above (copied from PR #4, not yet merged).
  // LATER, once PR #4 merges into main:
  // const res = await fetch("../data/orders.json"); // adjust path once storefront (Task 11) embeds this
  // const data = await res.json();
  // return data.orders;
  return Promise.resolve(REAL_ORDERS.orders);
}


/* =========================================================================
   SWAP POINT (now filled in) — messages render into Netsanet's real
   #chatBody using her real .message / .bot-message / .user-message classes.
   ========================================================================= */
function showMessage(text, sender = "bot") {
  const bubble = document.createElement("div");
  bubble.className = sender === "user" ? "message user-message" : "message bot-message";
  bubble.textContent = text;
  chatBody.appendChild(bubble);
  chatBody.scrollTop = chatBody.scrollHeight;
  return bubble;
}


/* TASK 7 — generic, reusable button-menu component. */
function renderMenu(options, onSelect) {
  const wrap = document.createElement("div");
  wrap.className = "menu";

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.label;
    btn.onclick = () => {
      [...wrap.querySelectorAll("button")].forEach(b => b.disabled = true);
      showMessage(opt.label, "user");
      onSelect(opt.value);
    };
    wrap.appendChild(btn);
  });

  chatBody.appendChild(wrap);
  chatBody.scrollTop = chatBody.scrollHeight;
}


/* TASK 8 — Order Status lookup, wired to the real dataset. */
function getOrderStatus(orderId, orders) {
  const order = orders.find(o => o.orderId === orderId);
  if (!order) {
    return REAL_ORDERS.notFoundMessage;
  }
  const etaLine = order.eta ? ` Estimated arrival: ${order.eta}.` : "";
  const itemsLine = ` Item(s): ${order.items.join(", ")}.`;
  return `Order ${order.orderId} is currently "${order.status}".${etaLine}${itemsLine}`;
}


/* =========================================================================
   CONVERSATION FLOW — mirrors Task 1's flow map (best guess until the
   real flowchart is shared). Never clears chatBody — conversation stays
   continuous, no dead ends.
   ========================================================================= */
async function startConversation() {
  const orders = await loadOrders();
  showMessage("Hi there! 👋 What can we help you with today?");
  showMainMenu(orders);
}

function showMainMenu(orders) {
  renderMenu(
    [
      { label: "📦 Order Status", value: "order_status" },
      { label: "↩️ Returns", value: "returns" },
      { label: "🔎 Stock Availability", value: "stock" }
    ],
    (choice) => {
      if (choice === "order_status") {
        showOrderIdMenu(orders);
      } else if (choice === "returns") {
        showMessage("The Returns flow is owned by Collins Lagat (Task 9) — not wired in this demo.");
        showFollowUpMenu(orders);
      } else if (choice === "stock") {
        showMessage("The Stock Availability flow is owned by Collins Lagat (Task 10) — not wired in this demo.");
        showFollowUpMenu(orders);
      }
    }
  );
}

function showOrderIdMenu(orders) {
  showMessage("Sure — which order would you like to check? (showing recent orders)");
  const sorted = [...orders].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
  const recent = sorted.slice(0, 6);
  const options = recent.map(o => ({ label: o.orderId, value: o.orderId }));
  options.push({ label: "Show all orders", value: "__show_all__" });

  renderMenu(options, (orderId) => {
    if (orderId === "__show_all__") {
      showAllOrdersMenu(orders);
      return;
    }
    const answer = getOrderStatus(orderId, orders);
    showMessage(answer);
    showFollowUpMenu(orders);
  });
}

function showAllOrdersMenu(orders) {
  showMessage("Here are all orders:");
  const options = orders.map(o => ({ label: o.orderId, value: o.orderId }));

  renderMenu(options, (orderId) => {
    const answer = getOrderStatus(orderId, orders);
    showMessage(answer);
    showFollowUpMenu(orders);
  });
}

function showFollowUpMenu(orders) {
  showMessage("Anything else I can help with?");
  renderMenu(
    [
      { label: "🔁 Check another order", value: "another_order" },
      { label: "📋 Different topic", value: "main_menu" }
    ],
    (choice) => {
      if (choice === "another_order") {
        showOrderIdMenu(orders);
      } else {
        showMainMenu(orders);
      }
    }
  );
}


/* Self-tests — silent, logged to console only (F12 → Console). */
async function runSelfTests() {
  const orders = await loadOrders();
  const cases = ["NS-1001", "NS-1004", "NS-1010", "NS-1016", "NS-9999"];
  console.group("Task 7 & 8 self-test");
  cases.forEach(id => console.log(getOrderStatus(id, orders)));
  console.groupEnd();
}
runSelfTests();
