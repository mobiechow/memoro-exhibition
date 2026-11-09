(() => {
  'use strict';
  const form = document.querySelector('#enquiry-form');
  const preview = document.querySelector('#enquiry-preview');
  const email = form.elements.email;
  const whatsapp = form.elements.whatsapp;
  const name = form.elements.name;
  const contactError = document.querySelector('#contact-error');
  const topicError = document.querySelector('#topic-error');
  const body = document.querySelector('#enquiry-body');
  const status = document.querySelector('#copy-status');
  const consentVersion = '2026-11-09';
  form.querySelector('[type=submit]').disabled = false;
  function resetErrors() {
    contactError.hidden = true;
    topicError.hidden = true;
    email.removeAttribute('aria-invalid');
    whatsapp.removeAttribute('aria-invalid');
    name.setCustomValidity('');
    whatsapp.setCustomValidity('');
  }
  form.addEventListener('input', resetErrors);
  form.addEventListener('submit', event => {
    event.preventDefault();
    resetErrors();
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
    const text = [
      '你好，我想查詢「一屋三代放暑假」的相關項目。', '',
      `姓名：${name.value.trim()}`,
      `電郵：${address || '未提供'}`,
      `WhatsApp：${phone || '未提供'}`,
      `查詢項目：${topics.join('、')}`, '',
      '想了解的內容：', form.elements.message.value.trim() || '未有補充', '',
      '我已閱讀並同意網站私隱政策及個人資料收集聲明。',
      '我同意將上述姓名、聯絡方法及查詢內容提供予合作機構「傳家寶」，以聯絡我及跟進本次查詢。',
      '本次查詢資料以電郵保存，保存期限至2026年12月12日；可電郵聯絡傳家寶要求查閱、更正或刪除。',
      `聲明版本：${consentVersion}`
    ].join('\n');
    body.textContent = text;
    document.querySelector('#email-link').href = 'mailto:mobiechow@gmail.com?subject=' + encodeURIComponent('一屋三代放暑假｜' + topics.join('、') + '查詢') + '&body=' + encodeURIComponent(text);
    status.textContent = '';
    form.hidden = true;
    preview.hidden = false;
    preview.focus();
    preview.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
  document.querySelector('#edit-enquiry').addEventListener('click', () => {
    preview.hidden = true;
    form.hidden = false;
    body.textContent = '';
    document.querySelector('#email-link').href = 'mailto:mobiechow@gmail.com';
    name.focus();
  });
  document.querySelector('#copy-enquiry').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('主旨：一屋三代放暑假｜項目查詢\n\n' + body.textContent);
      status.textContent = '已複製。請貼到電郵，核對後寄出。';
    } catch {
      status.textContent = '未能自動複製，請選取上方內容，手動複製到電郵。';
    }
  });
})();
