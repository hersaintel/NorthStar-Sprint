(function () {

  const triggerBtn = document.getElementById("chatTrigger");
  const popup = document.getElementById("chatPopup");
  const closeBtn = document.getElementById("closeBtn");
  const sendBtn = document.getElementById("sendBtn");
  const chatInput = document.getElementById("chatInput");
  const chatBody = document.getElementById("chatBody");

  let orders = [];
  let returnsData = {};
  let stockData = [];
  let conversationStarted = false;

  // What the next typed message should be interpreted as.
  // null = generic fallback, "orderId" = order status lookup,
  // "returnOrderId" = returns status lookup
  let awaitingInput = null;

  // -----------------------------
  // Widget controls
  // -----------------------------

  triggerBtn.addEventListener("click", () => {
    const isOpening = !popup.classList.contains("active");
    popup.classList.toggle("active");
    popup.setAttribute("aria-hidden", isOpening ? "false" : "true");
    triggerBtn.setAttribute("aria-expanded", isOpening ? "true" : "false");

    if (isOpening && !conversationStarted) {
      conversationStarted = true;
      startConversation();
    }
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    popup.setAttribute("aria-hidden", "true");
    triggerBtn.setAttribute("aria-expanded", "false");
  });

  sendBtn.addEventListener("click", sendMessage);

  chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    showMessage(text, "user");
    chatInput.value = "";

    if (awaitingInput === "orderId") {
      awaitingInput = null;
      handleOrderIdLookup(text);
      return;
    }

    if (awaitingInput === "returnOrderId") {
      awaitingInput = null;
      handleReturnLookup(text);
      return;
    }

    setTimeout(() => {
      showMessage(
        "Please use one of the support options above so I can give you the correct information."
      );
    }, 400);
  }

  // -----------------------------
  // Data
  // -----------------------------

  async function loadData() {
    try {
      const [ordersResponse, returnsResponse, stockResponse] = await Promise.all([
        fetch("data/orders.json"),
        fetch("data/returns.json"),
        fetch("data/stock.json")
      ]);

      if (!ordersResponse.ok || !returnsResponse.ok || !stockResponse.ok) {
        throw new Error("Could not load support data");
      }

      const ordersData = await ordersResponse.json();
      returnsData = await returnsResponse.json();
      const stockJson = await stockResponse.json();

      orders = ordersData.orders;
      stockData = stockJson.products;

      return true;
    } catch (error) {
      console.error("Data loading error:", error);
      showMessage("Sorry, I'm having trouble loading support information right now.");
      return false;
    }
  }

  // -----------------------------
  // Message helpers
  // -----------------------------

  function showMessage(text, sender = "bot") {
    const message = document.createElement("div");
    message.className = sender === "user" ? "message user-message" : "message bot-message";
    message.textContent = text;
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;
    return message;
  }

  // -----------------------------
  // Button menu
  // -----------------------------

  function renderMenu(options, onSelect) {
    const menu = document.createElement("div");
    menu.className = "support-menu";

    options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option.label;

      button.addEventListener("click", () => {
        [...menu.querySelectorAll("button")].forEach((btn) => (btn.disabled = true));
        showMessage(option.label, "user");
        onSelect(option.value);
      });

      menu.appendChild(button);
    });

    chatBody.appendChild(menu);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // -----------------------------
  // Main conversation
  // -----------------------------

  async function startConversation() {
    showMessage("Hi! 👋 What can I help you with today?");
    const loaded = await loadData();
    if (!loaded) return;
    showMainMenu();
  }

  function showMainMenu() {
    showMessage("Choose a support topic:");

    renderMenu(
      [
        { label: "📦 Order Status", value: "order_status" },
        { label: "↩️ Returns & Refunds", value: "returns" },
        { label: "🔍 Stock Availability", value: "stock" }
      ],
      (choice) => {
        if (choice === "order_status") showOrderStatus();
        if (choice === "returns") showReturnsMenu();
        if (choice === "stock") showStockMenu();
      }
    );
  }

  // -----------------------------
  // Order status — typed input, no order IDs shown on screen
  // -----------------------------

  function showOrderStatus() {
    showMessage("Please type your order ID below (e.g. NS-1005) and hit Send.");
    awaitingInput = "orderId";
    chatInput.focus();
  }

  function handleOrderIdLookup(rawInput) {
    const orderId = rawInput.trim().toUpperCase();
    const order = orders.find((item) => item.orderId.toUpperCase() === orderId);

    if (!order) {
      showMessage("I couldn't find that order. Please check the order number and try again.");
    } else {
      let response = `Order ${order.orderId} is ${order.status}.`;
      if (order.eta) response += ` Estimated arrival: ${order.eta}.`;
      response += ` Item: ${order.items.join(", ")}.`;
      showMessage(response);
    }

    showFollowUp();
  }

  // -----------------------------
  // Returns & refunds
  // -----------------------------

  function showReturnsMenu() {
    showMessage("What do you need help with?");

    renderMenu(
      [
        { label: "Check return/refund status", value: "status" },
        { label: "Start a return", value: "start" },
        { label: "Return policy", value: "policy" }
      ],
      (choice) => {
        if (choice === "status") checkReturnStatus();
        if (choice === "start") startReturn();
        if (choice === "policy") showReturnPolicy();
      }
    );
  }

  function checkReturnStatus() {
    showMessage("Please type the order ID linked to your return, then hit Send.");
    awaitingInput = "returnOrderId";
    chatInput.focus();
  }

  function handleReturnLookup(rawInput) {
    const orderId = rawInput.trim().toUpperCase();
    const cases = returnsData.sampleCases || [];
    const returnCase = cases.find((item) => item.orderId.toUpperCase() === orderId);

    if (!returnCase) {
      showMessage(returnsData.notFoundMessage);
    } else {
      let response = `Return ${returnCase.caseId} is currently "${returnCase.status}".`;
      if (returnCase.refundAmount !== null) {
        response += ` Refund amount: KSh ${returnCase.refundAmount.toLocaleString()}.`;
      }
      if (returnCase.rejectionNote) {
        response += ` Reason: ${returnCase.rejectionNote}`;
      }
      showMessage(response);
    }

    showFollowUp();
  }

  function startReturn() {
    showMessage("What is the reason for your return?");

    renderMenu(
      returnsData.returnReasons.map((reason) => ({
        label: reason.label,
        value: reason.reasonCode
      })),
      (reasonCode) => {
        const reason = returnsData.returnReasons.find((item) => item.reasonCode === reasonCode);
        showMessage(`${reason.resolution} A support agent can help you complete the return request.`);
        showFollowUp();
      }
    );
  }

  function showReturnPolicy() {
    showMessage(
      "General return policy: Items can be returned within 30 days of delivery if unused and in original packaging."
    );
    showMessage(
      "Electronics have a 14-day return window. Clothing and footwear have a 30-day window. Furniture has a 7-day window. Final Sale items cannot be returned or refunded."
    );
    showFollowUp();
  }

  // -----------------------------
  // Stock availability
  // -----------------------------

  function showStockMenu() {
    showMessage("Which product would you like to check?");

    renderMenu(
      stockData.map((product) => ({ label: product.name, value: product.name })),
      (productName) => {
        const product = stockData.find((item) => item.name === productName);

        if (product.stock > 0) {
          showMessage(
            `Yes, ${product.name} is currently in stock. We have approximately ${product.stock} available.`
          );
        } else {
          showMessage(`${product.name} is currently out of stock.`);
        }

        showFollowUp();
      }
    );
  }

  // -----------------------------
  // Follow-up navigation
  // -----------------------------

  function showFollowUp() {
    showMessage("Is there anything else I can help you with?");

    renderMenu(
      [
        { label: "Main menu", value: "main" },
        { label: "Close support", value: "close" }
      ],
      (choice) => {
        if (choice === "main") showMainMenu();
        if (choice === "close") {
          popup.classList.remove("active");
          popup.setAttribute("aria-hidden", "true");
          triggerBtn.setAttribute("aria-expanded", "false");
        }
      }
    );
  }

  // index.html injects this script AFTER injecting widgetUI/index.html's
  // markup into #chatbot-container, so the DOM nodes already exist.

})();