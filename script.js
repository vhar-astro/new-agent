const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatReset = document.getElementById('chat-reset');
const leadForm = document.getElementById('lead-form');
const isEn = document.documentElement.lang === 'en';

function track(event, payload = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

if (chatForm && chatInput && chatMessages) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    chatMessages.insertAdjacentHTML('beforeend', `<div class="msg user">${text}</div>`);
    chatMessages.insertAdjacentHTML(
      'beforeend',
      `<div class="msg agent">${isEn ? 'Thanks! I can show integration examples and estimate pricing.' : 'Спасибо! Могу показать пример интеграции и рассчитать тариф.'}</div>`
    );
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    track('chat_message_sent');
  });
}

if (chatReset && chatMessages) {
  chatReset.addEventListener('click', () => {
    chatMessages.innerHTML = `<div class="msg agent">${isEn ? 'Hello! I can help you choose a plan and answer your questions.' : 'Здравствуйте! Я помогу подобрать тариф и отвечу на вопросы.'}</div>`;
    track('chat_reset');
  });
}

if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(leadForm);
    const payload = Object.fromEntries(formData.entries());
    track('lead_form_submit');

    try {
      await fetch('https://example.com/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (_) {
      // Static hosting fallback.
    }

    alert(isEn ? 'Thanks! We will contact you shortly.' : 'Спасибо! Мы свяжемся с вами в ближайшее время.');
    leadForm.reset();
  });
}
