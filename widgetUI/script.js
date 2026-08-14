const triggerBtn = document.getElementById('chatTrigger');
const popup = document.getElementById('chatPopup');
const closeBtn = document.getElementById('closeBtn');
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const chatBody = document.getElementById('chatBody');

// Toggle popup
triggerBtn.addEventListener('click', () => {
  popup.classList.toggle('active');
});

// Close popup
closeBtn.addEventListener('click', () => {
  popup.classList.remove('active');
});

// Basic Send Functionality
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  // Append user message
  const userMsg = document.createElement('div');
  userMsg.className = 'message user-message';
  userMsg.textContent = text;
  chatBody.appendChild(userMsg);

  chatInput.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // Simulated bot response
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'message bot-message';
    botMsg.textContent = "Thanks for reaching out! We'll connect you shortly.";
    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 1000);
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});