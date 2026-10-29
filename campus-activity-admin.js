(() => {
  const toast = document.querySelector('[data-toast-region]');
  let toastTimer;
  const notify = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  };
  const openDialog = (id) => document.getElementById(id)?.showModal();
  const closeDialog = (id) => document.getElementById(id)?.close();

  document.querySelectorAll('[data-open-activity-dialog]').forEach((button) => {
    button.addEventListener('click', () => {
      button.closest('dialog')?.close();
      openDialog(button.dataset.openActivityDialog);
    });
  });
  document.querySelectorAll('[data-close-activity-dialog]').forEach((button) => {
    button.addEventListener('click', () => closeDialog(button.dataset.closeActivityDialog));
  });

  document.querySelectorAll('[data-activity-filter-root]').forEach((root) => {
    const buttons = [...root.querySelectorAll('[data-activity-filter]')];
    const rows = [...root.querySelectorAll('[data-activity-row]')];
    const apply = (filter) => {
      buttons.forEach((button) => button.classList.toggle('active', button.dataset.activityFilter === filter));
      rows.forEach((row) => {
        const states = (row.dataset.activityState || '').split(',');
        row.hidden = filter !== 'all' && !states.includes(filter);
      });
    };
    buttons.forEach((button) => button.addEventListener('click', () => apply(button.dataset.activityFilter)));
    root.querySelector('[data-activity-search]')?.addEventListener('input', (event) => {
      const query = event.target.value.trim().toLowerCase();
      rows.forEach((row) => { row.hidden = Boolean(query) && !row.textContent.toLowerCase().includes(query); });
    });
  });

  document.querySelectorAll('[data-activity-person]').forEach((button) => {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.activityPerson);
      if (!dialog) return;
      dialog.querySelector('[data-person-name]')?.replaceChildren(button.dataset.personName || '活动参与者');
      dialog.querySelector('[data-person-status]')?.replaceChildren(button.dataset.personStatus || '—');
      dialog.querySelector('[data-person-meta]')?.replaceChildren(button.dataset.personMeta || '—');
      dialog.querySelector('[data-person-extra]')?.replaceChildren(button.dataset.personExtra || '—');
      dialog.querySelector('[data-person-row-id]')?.setAttribute('value', button.dataset.personRowId || '');
      const chat = dialog.querySelector('[data-person-chat]');
      if (chat && button.dataset.personChat) chat.href = button.dataset.personChat;
      dialog.showModal();
    });
  });

  document.querySelectorAll('[data-activity-export]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.disabled) return;
      const original = button.textContent;
      button.disabled = true;
      button.textContent = '正在生成…';
      window.setTimeout(() => {
        button.textContent = '已生成 CSV';
        notify(button.dataset.activityExport || '导出文件已生成，下载记录已写入审计');
        window.setTimeout(() => { button.disabled = false; button.textContent = original; }, 1800);
      }, 520);
    });
  });

  document.querySelectorAll('form[data-activity-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('[type="submit"]');
      const original = button?.textContent;
      if (button) { button.disabled = true; button.textContent = '处理中…'; }
      window.setTimeout(() => {
        const target = form.dataset.activityTarget;
        const value = form.dataset.activityValue;
        if (target && value) document.querySelector(target)?.replaceChildren(value);
        notify(form.dataset.activityMessage || '操作已提交，状态已同步');
        form.closest('dialog')?.close();
        if (button) { button.disabled = false; button.textContent = original; }
      }, 420);
    });
  });

  document.querySelectorAll('[data-activity-person-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.activityPersonAction === 'current'
        ? button.closest('dialog')?.querySelector('[data-person-row-id]')?.value
        : button.dataset.activityPersonAction;
      const row = id ? document.querySelector(`[data-person-row-id="${id}"]`) : null;
      if (row) {
        row.dataset.activityState = 'removed';
        row.querySelector('[data-person-status-cell]')?.replaceChildren('已移除');
      }
      button.closest('dialog')?.close();
      notify('已移出活动名单，原因和操作人已写入活动审计');
    });
  });
})();
