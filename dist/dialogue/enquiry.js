(() => {
  'use strict';
  const form = document.querySelector('#enquiry-form');
  const result = document.querySelector('#enquiry-result');
  const submit = form.querySelector('[type=submit]');
  const email = form.elements.email;
  const whatsapp = form.elements.whatsapp;
  const name = form.elements.name;
  const contactError = document.querySelector('#contact-error');
  const topicError = document.querySelector('#topic-error');
  const title = document.querySelector('#result-title');
  const message = document.querySelector('#result-message');
  const consentVersion = '2026-11-09';
  // Recipient activated by the owner on 2026-11-09.
  const delivery = Object.freeze({ready: true, endpoint: 'https://formsubmit.co/ajax/mobiechow@gmail.com'});
  let sending = false;
  submit.disabled = false;
  function clearErrors() {
    contactError.hidden = true;
    topicError.hidden = true;
    email.removeAttribute('aria-invalid');
    whatsapp.removeAttribute('aria-invalid');
    name.setCustomValidity('');
    whatsapp.setCustomValidity('');
  }
  form.addEventListener('input', clearErrors);
  function showResult(heading, text, success) {
    title.textContent = heading;
    message.textContent = text;
    result.hidden = false;
    result.dataset.success = String(success);
    if (success) form.hidden = true;
    result.focus();
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    clearErrors();
    if (!name.value.trim()) {
      name.setCustomValidity('請填寫你的姓名。');
      name.reportValidity();
      return;
    }
    const address = email.value.trim();
    const phone = whatsapp.value.trim();
    if (!address && !phone) {
      contactError.textContent = '請填寫電郵或 WhatsApp，至少一項。';
      contactError.hidden = false;
      email.setAttribute('aria-invalid', 'true');
      whatsapp.setAttribute('aria-invalid', 'true');
      email.focus();
      return;
    }
    if (phone && (!/^\+?[\d\s()-]{6,32}$/.test(phone) || phone.replace(/\D/g, '').length < 6 || phone.replace(/\D/g, '').length > 15)) {
      whatsapp.setCustomValidity('請填寫有效的 WhatsApp 號碼，可加地區編號。');
      whatsapp.reportValidity();
      return;
    }
    const topics = [...form.querySelectorAll('[name="topic"]:checked')].map(input => input.value);
    if (!topics.length) {
      topicError.textContent = '請選擇至少一個查詢項目。';
      topicError.hidden = false;
      form.querySelector('[name="topic"]').focus();
      return;
    }
    if (!form.reportValidity()) return;
    if (!delivery.ready || !delivery.endpoint) {
      showResult('查詢服務準備中', '暫時未能提交查詢。你填寫的內容尚未寄出，請稍後再試。', false);
      return;
    }
    const payload = {
      name: name.value.trim(),
      WhatsApp: phone || '未提供',
      '查詢項目': topics.join('、'),
      message: form.elements.message.value.trim() || '未有補充',
      '私隱政策及收集聲明': '已閱讀並同意',
      '傳家寶跟進同意': '我同意將上述姓名、聯絡方法及查詢內容提供予合作機構「傳家寶」，以聯絡我及跟進本次查詢。',
      '聲明版本': consentVersion,
      _subject: '一屋三代放暑假｜' + topics.join('、') + '查詢',
      _template: 'table',
      _honey: form.elements.website.value
    };
    if (address) payload.email = address;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    sending = true;
    submit.disabled = true;
    submit.textContent = '正在提交…';
    form.setAttribute('aria-busy', 'true');
    result.hidden = true;
    try {
      const response = await fetch(delivery.endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(payload),
        signal: controller.signal,
        credentials: 'omit'
      });
      const data = await response.json();
      if (!response.ok || !(data.success === true || data.success === 'true')) throw new Error('submission_rejected');
      form.reset();
      showResult('查詢已提交', '多謝你的查詢。傳家寶會按你提供的聯絡方法跟進。', true);
    } catch (error) {
      showResult('未能確認提交結果', error.name === 'AbortError' ? '連線逾時，未能確認是否已收到。你的填寫內容仍然保留在此頁，請稍後再試；重試可能產生重複查詢。' : '暫時未能確認提交結果。你的填寫內容仍然保留在此頁，請檢查網絡後再試。', false);
    } finally {
      clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      submit.textContent = '提交查詢 ↗';
      form.removeAttribute('aria-busy');
    }
  });
  document.querySelector('#new-enquiry').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    name.focus();
  });
})();
