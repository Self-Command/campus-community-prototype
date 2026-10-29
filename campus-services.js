(() => {
  const notify = (message) => {
    const region = document.querySelector('[data-toast-region]');
    if (!region) return;
    region.textContent = message;
    region.classList.add('show');
    window.setTimeout(() => region.classList.remove('show'), 2100);
  };

  document.querySelectorAll('[data-service-filter-group]').forEach((group) => {
    const target = document.querySelector(group.dataset.serviceFilterTarget);
    if (!target) return;
    group.addEventListener('click', (event) => {
      const button = event.target.closest('[data-service-filter]');
      if (!button) return;
      const value = button.dataset.serviceFilter;
      group.querySelectorAll('[data-service-filter]').forEach((item) => item.classList.toggle('active', item === button));
      target.querySelectorAll('[data-service-item]').forEach((item) => {
        const values = (item.dataset.serviceItem || '').split(/\s+/);
        item.hidden = value !== 'all' && !values.includes(value);
      });
    });
  });

  document.querySelectorAll('[data-choice-group]').forEach((group) => {
    group.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      group.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
      const boundInput = group.dataset.choiceInput && document.querySelector(group.dataset.choiceInput);
      if (boundInput) boundInput.value = button.dataset.value || button.textContent.trim();
    });
  });

  document.querySelectorAll('[data-media-picker]').forEach((picker) => {
    const input = picker.querySelector('input[type="file"]');
    const addButton = picker.querySelector('[data-open-media-picker]');
    const slots = [...picker.querySelectorAll('[data-media-slot]')];
    if (!input) return;
    addButton?.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      [...input.files].slice(0, slots.length).forEach((file, index) => {
        const slot = slots[index];
        if (!slot) return;
        const url = URL.createObjectURL(file);
        slot.innerHTML = `<img src="${url}" alt="已选择的图片：${file.name}">`;
        slot.hidden = false;
      });
      if (input.files.length) notify(`已添加 ${input.files.length} 张图片`);
    });
  });

  document.addEventListener('click', (event) => {
    const reveal = event.target.closest('[data-reveal-contact]');
    if (reveal) {
      const target = document.querySelector(reveal.dataset.revealContact);
      if (target && target.dataset.full) {
        target.textContent = target.dataset.full;
        reveal.textContent = '已显示';
        reveal.disabled = true;
        notify('已显示联系方式，并记录本次查看');
      }
      return;
    }
    const interest = event.target.closest('[data-interest]');
    if (interest) {
      interest.textContent = '已通知发布者';
      interest.disabled = true;
      notify('已通知发布者你对该信息感兴趣');
    }
  });

  document.querySelectorAll('[data-home-banner]').forEach((banner) => {
    const track = banner.querySelector('.home-banner-track');
    const dots = [...banner.querySelectorAll('[data-banner-slide]')];
    if (!track || !dots.length) return;
    const go = (index) => {
      const next = (index + dots.length) % dots.length;
      track.style.transform = `translateX(-${next * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === next;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-current', String(active));
      });
    };
    dots.forEach((dot, index) => dot.addEventListener('click', () => go(index)));
  });
})();
