/* JOO V29: consent-based, opt-in admissions via Netlify Forms.
   WhatsApp is handled separately by site.js. No credentials in browser code. */
(() => {
  'use strict';
  const form = document.getElementById('enquiryForm');
  const save = document.getElementById('enquirySave');
  const feedback = document.getElementById('enquiryFeedback');
  if (!form || !save || !feedback) return;
  const words = {
    kk: {
      sending: 'Өтінім жіберіліп жатыр…',
      success: 'Өтінім қабылдау қызметіне жіберілді. Мектептің жауабын күтіңіз.',
      error: 'Өтінімді тіркеу мүмкін болмады. WhatsApp арқылы хабарласыңыз немесе кейінірек қайталаңыз.',
      phone: '10–15 цифрдан тұратын телефон нөмірін енгізіңіз.',
      consent: 'Өтінімді тіркеу үшін жеке деректерді өңдеуге келісім беріңіз.'
    },
    ru: {
      sending: 'Заявка отправляется…',
      success: 'Заявка отправлена в службу приёма. Ожидайте ответа школы.',
      error: 'Не удалось зарегистрировать заявку. Напишите в WhatsApp или повторите позже.',
      phone: 'Введите номер из 10–15 цифр.',
      consent: 'Для регистрации заявки подтвердите согласие на обработку данных.'
    },
    en: {
      sending: 'Sending application…',
      success: 'Your application was submitted to the admissions service. Please await a reply from the school.',
      error: 'The application could not be submitted. Contact us on WhatsApp or try again later.',
      phone: 'Enter a phone number with 10–15 digits.',
      consent: 'Please consent to data processing before saving your application.'
    }
  };
  let sending = false;
  const t = () => words[document.documentElement.lang] || words.kk;
  form.addEventListener('submit', async event => {
    if (event.submitter !== save) return;
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const phone = form.elements.namedItem('phone');
    const digits = String(phone?.value || '').replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      if (phone) { phone.setCustomValidity(t().phone); phone.reportValidity(); }
      return;
    }
    const consent = form.elements.namedItem('consent');
    if (!consent?.checked) {
      feedback.textContent = t().consent;
      consent?.focus();
      return;
    }
    if (form.elements.namedItem('bot-field')?.value) return;
    const payload = new URLSearchParams(new FormData(form));
    payload.set('form-name', 'joo-admissions');
    sending = true;
    save.disabled = true;
    save.setAttribute('aria-busy', 'true');
    feedback.textContent = t().sending;
    try {
      const response = await fetch(form.action || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
        credentials: 'same-origin',
        redirect: 'follow'
      });
      if (!response.ok) throw new Error('Submission status ' + response.status);
      feedback.textContent = t().success;
      form.reset();
      document.getElementById('enquiryPreview')?.replaceChildren();
    } catch (error) {
      console.warn('JOO admissions form submission failed:', error.message);
      feedback.textContent = t().error;
    } finally {
      sending = false;
      save.disabled = false;
      save.removeAttribute('aria-busy');
    }
  });
  form.elements.namedItem('phone')?.addEventListener('input', event => event.target.setCustomValidity(''));
})();
