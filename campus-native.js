(() => {
  const toast = document.querySelector('[data-toast-region]');
  let toastTimer;
  const notify = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
  };
  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  const certificationIcon = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.7L16.5 9"/></svg>';
  const hydrateCertificationBadges = (root = document) => {
    root.querySelectorAll('[data-cert-badge]').forEach((node) => {
      const label = node.dataset.certBadge || node.getAttribute('aria-label') || '官方认证';
      const accessibleLabel = label === '未认证' ? '未认证频道' : label;
      node.classList.add('cert-badge');
      node.setAttribute('aria-label', accessibleLabel);
      node.innerHTML = `${certificationIcon}<span class="visually-hidden">${escapeHtml(accessibleLabel)}</span>`;
    });
  };
  window.CampusUI = Object.assign(window.CampusUI || {}, {
    hydrateCertificationBadges
  });
  hydrateCertificationBadges();
  const storageGet = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const storageSet = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* 预览环境禁用存储时，不阻断页面交互。 */
    }
  };
  const storageRemove = (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* 同上，存储不可用不应影响 UI。 */
    }
  };
  const ensureActionSheetStyles = () => {
    if (document.getElementById('campus-action-sheet-styles')) return;
    const style = document.createElement('style');
    style.id = 'campus-action-sheet-styles';
    style.textContent = `
.action-sheet{position:fixed;z-index:220;inset:0;display:grid;align-items:end;background:rgba(9,18,31,.34)}.action-sheet[hidden]{display:none}.action-sheet-panel{display:grid;gap:10px;padding:12px 14px calc(14px + env(safe-area-inset-bottom,0px));border-radius:22px 22px 0 0;background:var(--surface);box-shadow:0 -18px 44px rgba(12,22,39,.2)}.action-sheet-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.action-sheet-head strong{font-size:16px}.action-sheet-head button{width:36px;height:36px;display:grid;place-items:center;border-radius:999px;background:var(--surface-alt);color:var(--muted)}.action-sheet-list{display:grid;gap:1px;overflow:hidden;border:1px solid var(--line);border-radius:18px;background:var(--line)}.action-sheet-item{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:center;min-height:56px;padding:10px 12px;background:var(--surface);text-align:left;color:var(--ink)}.action-sheet-item i{width:34px;height:34px;display:grid;place-items:center;border-radius:12px;background:var(--surface-alt);font-style:normal;color:var(--blue);font-weight:850}.action-sheet-item strong{display:block;font-size:14px}.action-sheet-item span{display:block;margin-top:2px;color:var(--muted);font-size:11px;line-height:1.35}.action-sheet-item.danger strong,.action-sheet-item.danger i{color:var(--red)}.action-sheet-note{color:var(--muted);font-size:11px;line-height:1.45}`;
    document.head.append(style);
  };
  const moreMenuItems = {
    post: [
      ['转', '转发到动态', '保留原帖来源并进入发布器', 'campus-publish-post.html'],
      ['藏', '收藏', '保存到我的收藏'],
      ['链', '复制链接', '复制当前帖子链接'],
      ['屏', '不看该作者', '后续减少推荐此作者内容'],
      ['举', '举报帖子', '进入举报流程', null, 'danger']
    ],
    user: [
      ['私', '发私信', '进入与该用户的一对一会话', 'campus-chat-detail.html'],
      ['享', '分享主页', '复制个人主页链接'],
      ['屏', '屏蔽用户', '不再接收私信和推荐', null, 'danger'],
      ['举', '举报用户', '提交违规线索', null, 'danger']
    ],
    channel: [
      ['管', '频道设置', '进入该频道的设置总页，按权限显示设置项', 'campus-channel-manage.html'],
      ['享', '分享频道', '复制频道链接'],
      ['搜', '频道内搜索', '查找动态、成员、文件'],
      ['举', '举报频道', '提交频道违规线索', null, 'danger']
    ],
    service: [
      ['享', '分享', '复制当前页面链接'],
      ['藏', '收藏', '保存到我的收藏'],
      ['记', '查看访问记录', '联系方式访问会写入审计'],
      ['举', '举报', '提交内容违规线索', null, 'danger']
    ],
    publish: [
      ['文', '发布动态', '文字、图文、链接与话题', 'campus-publish-post.html'],
      ['活', '发布活动', '报名字段、候补与签到设置', 'campus-publish-activity.html'],
      ['投', '发布投票', '选项、匿名规则和结果可见性', 'campus-publish-vote.html']
    ],
    generic: [
      ['享', '分享', '复制当前页面链接'],
      ['链', '复制链接', '复制到剪贴板'],
      ['举', '举报', '提交问题反馈', null, 'danger']
    ]
  };
  let actionSheet;
  const inferMoreKind = (trigger) => {
    if (trigger.dataset.moreMenu) return trigger.dataset.moreMenu;
    if (trigger.hasAttribute('data-post-card-more')) return 'post';
    const path = window.location.pathname;
    const label = trigger.getAttribute('aria-label') || '';
    if (path.includes('user-home')) return 'user';
    if (path.includes('channel')) return 'channel';
    if (path.includes('secondhand') || path.includes('lost-found') || path.includes('help-detail') || path.includes('job-detail') || path.includes('activity-detail')) return 'service';
    if (label.includes('帖子')) return 'post';
    return 'generic';
  };
  const openActionSheet = (kind = 'generic', title = '更多操作') => {
    ensureActionSheetStyles();
    if (!actionSheet) {
      actionSheet = document.createElement('div');
      actionSheet.className = 'action-sheet';
      actionSheet.hidden = true;
      actionSheet.innerHTML = '<section class="action-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="action-sheet-title"><div class="action-sheet-head"><strong id="action-sheet-title">更多操作</strong><button type="button" data-action-sheet-close aria-label="关闭">×</button></div><div class="action-sheet-list" data-action-sheet-list></div><p class="action-sheet-note">这些操作会保留来源页面和对象 ID，提交后由服务端权限与风控策略裁决。</p></section>';
      document.body.append(actionSheet);
      actionSheet.addEventListener('click', (event) => {
        if (event.target === actionSheet || event.target.closest('[data-action-sheet-close]')) {
          actionSheet.hidden = true;
          return;
        }
        const item = event.target.closest('[data-action-sheet-item]');
        if (!item) return;
        const href = item.dataset.href;
        const message = item.dataset.message || '操作已记录';
        actionSheet.hidden = true;
        if (href) window.location.href = href;
        else notify(message);
      });
    }
    const items = moreMenuItems[kind] || moreMenuItems.generic;
    actionSheet.querySelector('#action-sheet-title').textContent = title;
    actionSheet.querySelector('[data-action-sheet-list]').innerHTML = items.map(([mark, label, note, href, tone]) => `<button class="action-sheet-item ${tone || ''}" type="button" data-action-sheet-item data-message="${label}已打开"${href ? ` data-href="${href}"` : ''}><i>${mark}</i><span><strong>${label}</strong><span>${note}</span></span></button>`).join('');
    actionSheet.hidden = false;
  };
  const globalStateCopy = {
    loading: {
      title: '正在加载页面',
      body: '正在获取最新数据。若超过 15 秒仍未完成，请检查网络后重试。',
      action: '取消加载'
    },
    empty: {
      title: '暂时没有内容',
      body: '当前筛选条件下没有可展示的数据，可以清空筛选或返回上一页。',
      action: '返回上一页'
    },
    error: {
      title: '页面暂时无法加载',
      body: '网络不可用或服务暂时繁忙，已保留你的当前入口。',
      action: '重新加载'
    },
    'no-permission': {
      title: '没有访问权限',
      body: '当前账号不满足该页面的角色、频道成员或可见范围要求。',
      action: '返回首页'
    }
  };
  const ensureGlobalStateStyles = () => {
    if (document.getElementById('global-state-styles')) return;
    const style = document.createElement('style');
    style.id = 'global-state-styles';
    style.textContent = '.global-state-panel{display:grid;place-items:center;align-content:center;min-height:58vh;padding:34px 18px;text-align:center}.global-state-mark{width:58px;height:58px;display:grid;place-items:center;margin:0 auto 14px;border-radius:20px;background:var(--surface);border:1px solid var(--line);color:var(--blue)}.global-state-panel[data-ui-state="error"] .global-state-mark{color:var(--red);background:var(--red-soft)}.global-state-panel[data-ui-state="no-permission"] .global-state-mark{color:var(--amber);background:var(--amber-soft)}.global-state-panel h2{margin:0;font-size:20px;letter-spacing:-.03em}.global-state-panel p{max-width:320px;margin:9px auto 18px;color:var(--muted);font-size:13px;line-height:1.6}.global-state-panel[data-ui-state="loading"] .global-state-mark{animation:statePulse 1.2s cubic-bezier(.2,0,0,1) infinite}@keyframes statePulse{50%{transform:scale(.94);opacity:.64}}@media (prefers-reduced-motion:reduce){.global-state-panel[data-ui-state="loading"] .global-state-mark{animation:none}}';
    document.head.append(style);
  };
  const ensureSystemStyles = () => {
    if (document.getElementById('campus-system-styles')) return;
    const style = document.createElement('style');
    style.id = 'campus-system-styles';
    style.textContent = `
.ops-dashboard{display:grid;gap:12px;margin:2px 0 16px;padding:14px;border:1px solid var(--line);border-radius:22px;background:var(--surface);box-shadow:var(--shadow)}.ops-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.ops-kicker{color:var(--blue);font-size:10px;font-weight:850;letter-spacing:.08em}.ops-head h2{margin:3px 0 5px;font-size:18px;letter-spacing:-.03em}.ops-head p{max-width:420px;margin:0;color:var(--muted);font-size:12px;line-height:1.55}.ops-head .button{min-height:36px;white-space:nowrap}.ops-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.ops-metrics button{display:grid;gap:2px;min-height:64px;padding:9px;border:1px solid var(--line);border-radius:15px;background:var(--surface-alt);text-align:left}.ops-metrics strong{font-size:21px;letter-spacing:-.04em;font-variant-numeric:tabular-nums}.ops-metrics span{color:var(--muted);font-size:11px}.ops-alert-list{display:grid;gap:8px}.ops-alert{display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:10px;align-items:center;min-height:60px;padding:9px;border:1px solid var(--line);border-radius:16px;background:var(--bg);text-align:left}.ops-alert b{display:block;font-size:13px}.ops-alert small{display:block;margin-top:2px;color:var(--muted);font-size:11px;line-height:1.35}.ops-alert em{font-style:normal;color:var(--muted);font-size:11px;white-space:nowrap}.managed-toolbar{display:grid;gap:2px;margin-bottom:10px}.managed-list{display:grid;gap:8px}.managed-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px 12px;padding:10px;border:1px solid var(--line);border-radius:18px;background:var(--surface)}.managed-main{display:flex;align-items:center;gap:11px;min-width:0;text-align:left}.managed-main span:last-child{min-width:0}.managed-main b{display:flex;align-items:center;gap:5px;font-size:14px;letter-spacing:-.02em}.managed-main small{display:block;margin-top:4px;color:var(--muted);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.managed-status{display:grid;justify-items:end;align-content:center;gap:5px}.managed-actions{grid-column:1/-1;display:grid;grid-template-columns:1fr;gap:7px}.managed-actions a{display:grid;place-items:center;min-height:34px;border-radius:11px;background:var(--surface-alt);color:var(--blue);font-size:12px;font-weight:750}.notice-detail-page{padding-bottom:calc(24px + env(safe-area-inset-bottom,0px))}.notice-article{display:grid;gap:14px}.notice-hero{padding:18px 0 14px;border-bottom:1px solid var(--line)}.notice-source{display:flex;align-items:center;gap:10px;margin-bottom:14px}.notice-source .avatar{width:42px;height:42px}.notice-source small{display:block;margin-top:2px;color:var(--muted);font-size:11px}.notice-hero h1{margin:0;font-size:25px;line-height:1.18;letter-spacing:-.045em}.notice-hero p{margin:10px 0 0;color:var(--ink-2);font-size:13px;line-height:1.65}.notice-meta-strip{display:flex;flex-wrap:wrap;gap:7px;margin-top:13px}.notice-body{padding:15px 0;border-bottom:1px solid var(--line)}.notice-body p{margin:0 0 13px;color:var(--ink);font-size:15px;line-height:1.78}.notice-body p:last-child{margin-bottom:0}.notice-section{padding:14px;border:1px solid var(--line);border-radius:18px;background:var(--surface)}.notice-section h2{margin:0 0 10px;font-size:15px}.notice-timeline{display:grid;gap:10px}.notice-step{display:grid;grid-template-columns:24px minmax(0,1fr);gap:9px}.notice-step i{width:24px;height:24px;display:grid;place-items:center;border-radius:50%;background:var(--blue-soft);color:var(--blue);font-size:11px;font-style:normal;font-weight:800}.notice-step b{display:block;font-size:13px}.notice-step span{display:block;margin-top:2px;color:var(--muted);font-size:11px}.notice-confirm{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border-radius:16px;background:var(--blue-soft);color:var(--blue)}.notice-confirm span{display:grid;gap:3px}.notice-confirm b{font-size:13px}.notice-confirm small{font-size:11px;line-height:1.35}.notice-confirm .button{min-height:36px}.native-select-source{position:absolute!important;width:1px!important;height:1px!important;opacity:.01!important;pointer-events:none!important}.native-select-trigger{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:0 10px;border:1px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink);font-size:13px;font-weight:750}.compose-field .native-select-trigger{width:100%;justify-content:space-between;min-height:44px;border-width:0 0 1px;border-radius:0;background:transparent;padding:0}.native-select-trigger:after{content:"";width:7px;height:7px;border-right:1.8px solid currentColor;border-bottom:1.8px solid currentColor;transform:rotate(45deg);opacity:.65}.select-sheet{position:fixed;z-index:160;inset:0;display:grid;align-items:end;background:rgba(10,18,32,.34)}.select-sheet[hidden]{display:none}.select-panel{max-height:min(74vh,560px);display:grid;grid-template-rows:auto auto minmax(0,1fr);gap:10px;padding:12px 14px calc(14px + env(safe-area-inset-bottom,0px));border-radius:22px 22px 0 0;background:var(--surface);box-shadow:0 -18px 44px rgba(12,22,39,.18)}.select-panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.select-panel-head strong{font-size:16px}.select-panel-head button{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:var(--muted);background:var(--surface-alt)}.select-search{height:42px;display:flex;align-items:center;gap:8px;padding:0 11px;border-radius:13px;background:var(--surface-alt);color:var(--muted)}.select-search input{min-width:0;flex:1;border:0;background:transparent;outline:0;color:var(--ink)}.select-options{display:grid;gap:1px;max-height:280px;overflow:auto;border:1px solid var(--line);border-radius:16px;background:var(--line)}.select-option{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:46px;padding:0 13px;background:var(--surface);text-align:left;font-size:14px}.select-option[aria-selected="true"]{color:var(--blue);font-weight:800}.select-option[hidden]{display:none}.select-empty{padding:18px;color:var(--muted);text-align:center;font-size:13px;background:var(--surface)}.publish-guidance{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0 2px}.publish-guidance span{display:grid;gap:4px;min-height:62px;padding:10px;border:1px solid var(--line);border-radius:14px;background:var(--surface-alt)}.publish-guidance b{font-size:12px}.publish-guidance small{color:var(--muted);font-size:11px;line-height:1.35}.compose-hero-card{display:flex;align-items:flex-start;gap:11px;margin:12px 0 4px;padding:13px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(135deg,var(--surface),var(--surface-alt))}.compose-hero-card .notice-icon{flex:none}.compose-hero-card h2{margin:0;font-size:16px;letter-spacing:-.02em}.compose-hero-card p{margin:5px 0 0;color:var(--muted);font-size:12px;line-height:1.55}@media (max-width:520px){.ops-head{display:grid}.ops-metrics{grid-template-columns:repeat(2,1fr)}.ops-alert{grid-template-columns:42px minmax(0,1fr)}.ops-alert em{grid-column:2}.managed-row{grid-template-columns:1fr}.managed-status{justify-items:start;display:flex}.publish-guidance{grid-template-columns:1fr}.notice-hero h1{font-size:22px}}`;
    document.head.append(style);
  };
  const ensureChannelAdminStyles = () => {
    if (document.getElementById('campus-channel-admin-styles')) return;
    const style = document.createElement('style');
    style.id = 'campus-channel-admin-styles';
    style.textContent = `
.channel-admin-shell{padding-bottom:calc(28px + env(safe-area-inset-bottom,0px))}.channel-admin-hero{display:grid;gap:12px;margin:2px 0 14px;padding:15px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(135deg,var(--surface),var(--surface-alt));box-shadow:var(--shadow)}.channel-admin-kicker{color:var(--blue);font-size:10px;font-weight:850;letter-spacing:.08em}.channel-admin-hero h2{margin:3px 0 4px;font-size:22px;letter-spacing:-.04em}.channel-admin-hero p{margin:0;color:var(--muted);font-size:12px;line-height:1.55}.channel-admin-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.channel-admin-stats a,.channel-admin-stats button{display:grid;gap:2px;min-height:66px;padding:9px;border:1px solid var(--line);border-radius:15px;background:var(--surface);text-align:left}.channel-admin-stats strong{font-size:21px;letter-spacing:-.04em;font-variant-numeric:tabular-nums}.channel-admin-stats span{color:var(--muted);font-size:11px}.channel-admin-grid{display:grid;gap:10px}.channel-admin-card{display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:10px;align-items:center;padding:13px;border:1px solid var(--line);border-radius:18px;background:var(--surface);text-align:left}.channel-admin-card h3{margin:0;font-size:15px}.channel-admin-card p{margin:4px 0 0;color:var(--muted);font-size:12px;line-height:1.45}.channel-admin-card .count-pill{align-self:center}.channel-admin-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:14px;background:var(--blue-soft);color:var(--blue)}.channel-admin-layout{display:grid;gap:12px}.channel-admin-toolbar{display:grid;gap:8px;margin:8px 0 12px}.channel-admin-search{min-height:42px;display:flex;align-items:center;gap:8px;padding:0 11px;border-radius:14px;background:var(--surface-alt);border:1px solid transparent;color:var(--muted)}.channel-admin-search input{min-width:0;flex:1;border:0;background:transparent;outline:0;color:var(--ink)}.channel-admin-filters{display:flex;gap:8px;overflow:auto;padding-bottom:3px;scrollbar-width:none}.channel-admin-filter{flex:none;min-height:34px;padding:0 12px;border:1px solid var(--line);border-radius:999px;background:var(--surface);color:var(--ink-2);font-size:12px;font-weight:700}.channel-admin-filter.active{background:var(--blue);border-color:var(--blue);color:#fff}.channel-admin-panel{display:grid;gap:1px;overflow:hidden;border:1px solid var(--line);border-radius:18px;background:var(--line)}.channel-admin-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:10px;align-items:center;min-height:68px;padding:11px 12px;background:var(--surface)}.channel-admin-row b{display:block;font-size:14px}.channel-admin-row small{display:block;margin-top:3px;color:var(--muted);font-size:11px;line-height:1.35}.channel-admin-actions{display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap}.channel-admin-actions button,.channel-admin-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:0 9px;border-radius:10px;background:var(--surface-alt);color:var(--blue);font-size:12px;font-weight:750}.channel-action-list{display:grid;gap:1px;overflow:hidden;border:1px solid var(--line);border-radius:18px;background:var(--line)}.channel-action-row{display:flex;align-items:center;gap:11px;min-height:58px;padding:12px 14px;background:var(--surface);text-align:left}.channel-action-row .menu-icon{flex:none}.channel-action-row .menu-copy{flex:1}.channel-action-row.danger .menu-copy strong,.channel-action-row.danger{color:var(--red)}.channel-admin-note{padding:12px;border-radius:16px;background:var(--blue-soft);color:var(--blue);font-size:12px;line-height:1.55}.channel-admin-warning{padding:12px;border-radius:16px;background:var(--amber-soft);color:var(--amber);font-size:12px;line-height:1.55}.channel-admin-form{display:grid;gap:12px}.channel-admin-form .compose-field{padding:0}.channel-audit-timeline{display:grid;gap:10px}.channel-audit-item{display:grid;grid-template-columns:24px minmax(0,1fr);gap:9px}.channel-audit-item i{width:24px;height:24px;border-radius:50%;background:var(--blue-soft)}.channel-audit-item b{font-size:13px}.channel-audit-item span{display:block;margin-top:2px;color:var(--muted);font-size:11px;line-height:1.35}
@media (min-width:780px){.channel-admin-shell{max-width:840px}.channel-admin-layout.two{grid-template-columns:minmax(0,1fr) 280px;align-items:start}.channel-admin-side{position:sticky;top:72px}}
@media (max-width:540px){.channel-admin-stats{grid-template-columns:repeat(2,1fr)}.channel-admin-card,.channel-admin-row{grid-template-columns:40px minmax(0,1fr)}.channel-admin-card .count-pill,.channel-admin-row .channel-admin-actions{grid-column:2}.channel-admin-actions{justify-content:flex-start}}
`;
    document.head.append(style);
  };
  const ensureChannelSplitStyles = () => {
    if (document.getElementById('campus-channel-split-styles')) return;
    const style = document.createElement('style');
    style.id = 'campus-channel-split-styles';
    style.textContent = `
.channel-admin-page{padding-bottom:calc(28px + env(safe-area-inset-bottom,0px))}.channel-admin-hero{display:grid;grid-template-columns:58px minmax(0,1fr);gap:12px;margin:2px 0 14px;padding:15px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(135deg,var(--surface),var(--surface-alt));box-shadow:var(--shadow)}.channel-admin-hero.compact{grid-template-columns:50px minmax(0,1fr);box-shadow:none}.channel-admin-hero h1{margin:3px 0 6px;font-size:22px;letter-spacing:-.04em}.channel-admin-hero p{margin:0;color:var(--muted);font-size:12px;line-height:1.55}.channel-admin-avatar{width:50px;height:50px;display:grid;place-items:center;border-radius:16px;background:var(--blue-soft);color:var(--blue);font-weight:850}.channel-admin-hero:not(.compact) .channel-admin-avatar{width:58px;height:58px;border-radius:18px}.channel-section-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}.channel-section-title h2{margin:0;font-size:16px}.channel-section-title span{color:var(--muted);font-size:12px}.review-list{display:grid;gap:8px}.review-row,.admin-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;padding:11px;border:1px solid var(--line);border-radius:16px;background:var(--surface)}.review-row strong,.admin-row strong{display:block;font-size:14px}.review-row small,.admin-row small{display:block;margin-top:3px;color:var(--muted);font-size:11px;line-height:1.45}.review-actions{display:flex;gap:7px}.review-actions .button{min-height:34px;padding:0 10px;font-size:12px}.tool-chip{min-height:32px;padding:0 10px;border-radius:10px;background:var(--surface-alt);color:var(--blue);font-size:12px;font-weight:750}.tool-chip.danger{color:var(--red);background:var(--red-soft)}.toolbar-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 12px}.policy-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.policy-grid span{display:grid;gap:4px;padding:10px;border:1px solid var(--line);border-radius:14px;background:var(--surface-alt)}.policy-grid b{font-size:12px}.policy-grid small{color:var(--muted);font-size:11px;line-height:1.35}.theme-setting-button{width:100%;justify-content:space-between;text-align:left}.theme-setting-button .switch{pointer-events:none}.appbar-right .button.secondary{min-height:36px;padding:0 11px;font-size:13px}.channel-console{display:grid;gap:14px;padding-bottom:calc(28px + env(safe-area-inset-bottom,0px))}.console-summary{display:grid;gap:12px;padding:14px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(135deg,var(--surface),var(--surface-alt));box-shadow:var(--shadow)}.console-channel{display:flex;align-items:center;gap:12px}.console-channel h2{margin:2px 0 4px;font-size:21px;letter-spacing:-.04em}.console-channel p{margin:0;color:var(--muted);font-size:12px;line-height:1.45}.console-status-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.console-status-row span{display:grid;gap:3px;padding:9px;border:1px solid var(--line);border-radius:14px;background:var(--surface)}.console-status-row b{font-size:12px}.console-status-row small{color:var(--muted);font-size:11px}.console-section{display:grid;gap:9px}.console-section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.console-section-head h2{margin:0;font-size:16px}.console-section-head p{margin:4px 0 0;color:var(--muted);font-size:12px;line-height:1.45}.console-queue{position:sticky;top:calc(58px + env(safe-area-inset-top,0px));z-index:5;padding:12px;border:1px solid var(--line);border-radius:20px;background:color-mix(in oklab,var(--surface) 92%,transparent);backdrop-filter:blur(18px);box-shadow:var(--shadow)}.queue-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:10px;align-items:center;min-height:60px;padding:9px;border:1px solid var(--line);border-radius:15px;background:var(--surface);color:var(--ink)}.queue-row.priority{border-color:color-mix(in oklab,var(--amber) 40%,var(--line))}.queue-row b{display:block;font-size:13px}.queue-row small{display:block;margin-top:2px;color:var(--muted);font-size:11px;line-height:1.35}.queue-row em{font-style:normal;color:var(--muted);font-size:11px}.console-module-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.console-module{position:relative;display:grid;align-content:start;gap:5px;min-height:86px;padding:11px;border:1px solid var(--line);border-radius:16px;background:var(--surface);color:var(--ink)}.console-module strong{font-size:14px}.console-module span{color:var(--muted);font-size:11px;line-height:1.35}.console-module i{position:absolute;right:9px;top:9px;min-width:20px;height:20px;display:grid;place-items:center;border-radius:999px;background:var(--blue-soft);color:var(--blue);font-style:normal;font-size:11px;font-weight:800}.console-filter-bar{display:grid;gap:8px}.console-channel-list{display:grid;gap:1px;overflow:hidden;border:1px solid var(--line);border-radius:18px;background:var(--line)}.console-channel-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;min-height:68px;padding:10px 12px;background:var(--surface)}.console-channel-row>button{display:flex;align-items:center;gap:10px;min-width:0;text-align:left}.console-channel-row b{display:block;font-size:14px}.console-channel-row small{display:block;margin-top:3px;color:var(--muted);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.console-channel-row>div{display:flex;gap:6px}.console-channel-row a{display:grid;place-items:center;min-height:32px;padding:0 9px;border-radius:10px;background:var(--surface-alt);color:var(--blue);font-size:12px;font-weight:750}.console-audit{padding:12px;border:1px solid var(--line);border-radius:18px;background:var(--surface)}
@media (max-width:520px){.review-row,.admin-row{grid-template-columns:auto minmax(0,1fr)}.review-actions{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr}.toolbar-grid,.policy-grid{grid-template-columns:1fr}.channel-admin-hero{grid-template-columns:50px minmax(0,1fr)}.console-status-row{grid-template-columns:1fr}.console-module-grid{grid-template-columns:repeat(2,1fr)}.queue-row,.console-channel-row{grid-template-columns:42px minmax(0,1fr)}.queue-row em{grid-column:2}.console-channel-row>button{grid-column:1/-1}.console-channel-row>div{grid-column:1/-1;justify-content:flex-start}.console-queue{position:static}}`;
    document.head.append(style);
  };
  const ensureEnterprisePolishStyles = () => {
    if (document.getElementById('campus-enterprise-polish-styles')) return;
    const style = document.createElement('style');
    style.id = 'campus-enterprise-polish-styles';
    style.textContent = `
:where(a,button,input,textarea,select):focus-visible{outline:2px solid color-mix(in srgb,var(--blue) 72%,white);outline-offset:2px}
:where(.menu-item,.list-item,.settings-row,.personal-row,.channel-row,.managed-channel-main,.service-shortcut,.category,.launcher-link):active{background:var(--surface-alt)}
:where(.menu-copy strong,.list-title,.channel-row-title,.channel-copy h3,.personal-copy h2,.settings-row strong){overflow-wrap:anywhere;text-wrap:pretty}
:where(.menu-copy span,.list-subtitle,.channel-row-sub,.personal-copy p,.settings-row small){overflow-wrap:anywhere}
:where(.button,.icon-button,.nav-item,.native-select-trigger,.action-sheet-item,.select-option){touch-action:manipulation}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}`;
    document.head.append(style);
  };
  ensureSystemStyles();
  ensureChannelAdminStyles();
  ensureChannelSplitStyles();
  ensureEnterprisePolishStyles();
  const renderGlobalState = () => {
    const state = new URLSearchParams(window.location.search).get('uiState');
    const copy = globalStateCopy[state];
    if (!copy) return;
    ensureGlobalStateStyles();
    const target = document.querySelector('[data-state-root]') || document.querySelector('.page') || document.querySelector('main');
    if (!target) return;
    target.innerHTML = `<section class="global-state-panel" data-ui-state="${state}" role="${state === 'error' ? 'alert' : 'status'}"><div class="global-state-mark" aria-hidden="true"><svg class="i" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01"/><circle cx="12" cy="12" r="9"/></svg></div><h2>${copy.title}</h2><p>${copy.body}</p><button class="button" type="button" data-global-state-action>${copy.action}</button></section>`;
  };
  renderGlobalState();
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-global-state-action]');
    if (!button) return;
    const state = button.closest('[data-ui-state]')?.dataset.uiState;
    if (state === 'error' || state === 'loading') window.location.href = window.location.pathname;
    else if (state === 'no-permission') window.location.href = 'campus-home.html';
    else history.length > 1 ? history.back() : (window.location.href = 'campus-home.html');
  });

  document.addEventListener('click', (event) => {
    const item = event.target.closest('[data-nav]');
    if (!item || item.disabled) return;
    const target = item.dataset.nav;
    if (!target) return;
    event.preventDefault();
    window.location.href = target;
  });

  document.addEventListener('click', (event) => {
    const item = event.target.closest('a[href="campus-home.html#publish"]');
    if (!item) return;
    event.preventDefault();
    openActionSheet('publish', '发布内容');
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-more-menu], [data-post-card-more], button[aria-label="更多"], button[aria-label="更多操作"], button[aria-label="更多帖子操作"]');
    if (!trigger || trigger.disabled) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const kind = inferMoreKind(trigger);
    const title = kind === 'post' ? '帖子操作' : kind === 'user' ? '用户操作' : kind === 'channel' ? '频道操作' : '更多操作';
    openActionSheet(kind, title);
  }, true);

  document.querySelectorAll('[data-open-dialog]').forEach((button) => {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.openDialog);
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  });
  document.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  document.querySelectorAll('[data-tab-group]').forEach((group) => {
    group.querySelectorAll('[data-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        group.querySelectorAll('[data-tab]').forEach((item) => item.classList.toggle('active', item === tab));
        const scope = group.closest('[data-tab-scope]') || document;
        const panels = scope.querySelectorAll('[data-tab-panel]');
        panels.forEach((panel) => {
          panel.hidden = panel.dataset.tabPanel !== tab.dataset.tab;
        });
        const filterTarget = group.dataset.filterTarget && document.querySelector(group.dataset.filterTarget);
        if (panels.length === 0 && filterTarget) {
          filterTarget.querySelectorAll('[data-feed-item]').forEach((item) => {
            const groups = item.dataset.feedItem.split(' ');
            item.hidden = tab.dataset.tab !== 'all' && !groups.includes(tab.dataset.tab);
          });
        }
      });
    });
  });

  document.querySelectorAll('[data-like]').forEach((button) => {
    button.addEventListener('click', () => {
      const count = button.querySelector('[data-count]');
      const isLiked = button.classList.toggle('liked');
      if (count) count.textContent = String(Number(count.textContent) + (isLiked ? 1 : -1));
      notify(isLiked ? '已点赞' : '已取消点赞');
    });
  });

  document.querySelectorAll('[data-save]').forEach((button) => {
    button.addEventListener('click', () => {
      const count = button.querySelector('[data-count]');
      const isSaved = button.classList.toggle('saved');
      if (count) count.textContent = String(Number(count.textContent) + (isSaved ? 1 : -1));
      notify(isSaved ? '已收藏到“我的收藏”' : '已取消收藏');
    });
  });

  document.querySelectorAll('[data-poll-option]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('[data-poll]');
      if (!card || card.dataset.voted === 'true') return;
      card.dataset.voted = 'true';
      card.querySelectorAll('[data-poll-option]').forEach((option) => option.classList.toggle('selected', option === button));
      const note = card.querySelector('[data-poll-note]');
      if (note) note.textContent = '已投票，不支持修改';
      notify('投票已提交');
    });
  });

  document.querySelectorAll('[data-refresh]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.refresh);
      if (!target) return;
      const label = button.textContent;
      target.setAttribute('aria-busy', 'true');
      target.style.opacity = '0.45';
      button.disabled = true;
      button.textContent = '刷新中…';
      window.setTimeout(() => {
        target.removeAttribute('aria-busy');
        target.style.opacity = '';
        button.disabled = false;
        button.textContent = label;
        notify('内容已更新');
      }, 620);
    });
  });

  document.querySelectorAll('[data-message-search]').forEach((field) => {
    field.addEventListener('input', () => {
      const query = field.value.trim().toLocaleLowerCase();
      const list = document.querySelector(field.dataset.messageSearch);
      const empty = document.querySelector('[data-search-empty]');
      if (!list) return;
      let matches = 0;
      list.querySelectorAll('[data-searchable]').forEach((item) => {
        const show = item.textContent.toLocaleLowerCase().includes(query);
        item.hidden = !show;
        if (show) matches += 1;
      });
      if (empty) empty.hidden = matches !== 0;
    });
  });

  document.querySelectorAll('[data-list-search]').forEach((field) => {
    field.addEventListener('input', () => {
      const list = document.querySelector(field.dataset.listSearch);
      const query = field.value.trim().toLocaleLowerCase();
      let matches = 0;
      list?.querySelectorAll('[data-searchable], [data-detail-href]').forEach((item) => {
        const show = item.textContent.toLocaleLowerCase().includes(query);
        item.hidden = !show;
        if (show) matches += 1;
      });
      let empty = field.dataset.emptyTarget && document.querySelector(field.dataset.emptyTarget);
      if (!empty && list) {
        empty = list.parentElement?.querySelector('[data-generated-search-empty]');
        if (!empty) {
          empty = document.createElement('div');
          empty.className = 'center-empty';
          empty.dataset.generatedSearchEmpty = 'true';
          empty.hidden = true;
          empty.innerHTML = '<h3>没有匹配结果</h3><p>换一个关键词，或清空搜索条件后再试。</p>';
          list.after(empty);
        }
      }
      if (empty) empty.hidden = matches !== 0 || query.length === 0;
    });
  });

  const selectSheet = document.createElement('div');
  selectSheet.className = 'select-sheet';
  selectSheet.hidden = true;
  selectSheet.innerHTML = '<div class="select-panel" role="dialog" aria-modal="true"><div class="select-panel-head"><strong data-select-title>选择</strong><button type="button" data-select-close aria-label="关闭">×</button></div><label class="select-search"><svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg><input data-select-search placeholder="搜索选项"></label><div class="select-options" data-select-options></div></div>';
  document.body.append(selectSheet);
  const selectTitle = selectSheet.querySelector('[data-select-title]');
  const selectSearch = selectSheet.querySelector('[data-select-search]');
  const selectOptions = selectSheet.querySelector('[data-select-options]');
  let activeSelect = null;
  const closeSelectSheet = () => {
    selectSheet.hidden = true;
    activeSelect = null;
    selectSearch.value = '';
  };
  const renderSelectOptions = (query = '') => {
    if (!activeSelect) return;
    const normalized = query.trim().toLocaleLowerCase();
    const options = [...activeSelect.options].filter((option) => !option.disabled);
    let matched = 0;
    selectOptions.innerHTML = '';
    options.forEach((option) => {
      const visible = option.textContent.toLocaleLowerCase().includes(normalized);
      if (visible) matched += 1;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'select-option';
      button.hidden = !visible;
      button.dataset.value = option.value;
      button.setAttribute('aria-selected', String(option.selected));
      button.textContent = option.textContent;
      selectOptions.append(button);
    });
    if (!matched) {
      const empty = document.createElement('div');
      empty.className = 'select-empty';
      empty.textContent = '没有匹配选项';
      selectOptions.append(empty);
    }
  };
  const updateSelectTrigger = (select) => {
    const trigger = select.nextElementSibling?.classList.contains('native-select-trigger') ? select.nextElementSibling : null;
    if (trigger) trigger.textContent = select.selectedOptions[0]?.textContent || '请选择';
  };
  document.querySelectorAll('select:not([data-native-select-ready])').forEach((select) => {
    select.dataset.nativeSelectReady = 'true';
    select.classList.add('native-select-source');
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'native-select-trigger';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-label', select.getAttribute('aria-label') || select.name || '选择');
    trigger.textContent = select.selectedOptions[0]?.textContent || '请选择';
    select.after(trigger);
    trigger.addEventListener('click', () => {
      activeSelect = select;
      const label = select.closest('label')?.querySelector('span')?.textContent || select.getAttribute('aria-label') || '选择';
      selectTitle.textContent = label;
      renderSelectOptions();
      selectSheet.hidden = false;
      window.setTimeout(() => selectSearch.focus(), 20);
    });
    select.addEventListener('change', () => updateSelectTrigger(select));
  });
  selectSearch?.addEventListener('input', () => renderSelectOptions(selectSearch.value));
  selectSheet.querySelector('[data-select-close]')?.addEventListener('click', closeSelectSheet);
  selectSheet.addEventListener('click', (event) => {
    if (event.target === selectSheet) closeSelectSheet();
    const option = event.target.closest('.select-option');
    if (!option || !activeSelect) return;
    activeSelect.value = option.dataset.value;
    activeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    updateSelectTrigger(activeSelect);
    closeSelectSheet();
  });

  document.querySelectorAll('[data-switch]').forEach((button) => {
    const key = button.dataset.switch;
    const saved = storageGet(`campus-link:${key}`);
    if (saved === 'true') button.classList.add('on');
    button.setAttribute('aria-checked', String(button.classList.contains('on')));
    button.addEventListener('click', () => {
      const enabled = button.classList.toggle('on');
      button.setAttribute('aria-checked', String(enabled));
      storageSet(`campus-link:${key}`, String(enabled));
      notify(enabled ? '设置已开启' : '设置已关闭');
    });
  });

  document.querySelectorAll('[data-toggle-panel]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = document.querySelector(button.dataset.togglePanel);
      const open = panel?.classList.toggle('open');
      button.setAttribute('aria-expanded', String(Boolean(open)));
    });
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action-toast]');
    if (!button || button.disabled) return;
    notify(button.dataset.actionToast);
  });

  document.querySelectorAll('[data-toggle-password]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.togglePassword);
      if (!target) return;
      const isPassword = target.type === 'password';
      target.type = isPassword ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(isPassword));
      button.dataset.actionToast = isPassword ? '已显示密码' : '已隐藏密码';
      notify(button.dataset.actionToast);
    });
  });

  document.querySelectorAll('[data-countdown-seconds]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.disabled) return;
      const seconds = Number(button.dataset.countdownSeconds || 60);
      let remaining = seconds;
      button.disabled = true;
      button.textContent = `${remaining}s`;
      const timer = window.setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          window.clearInterval(timer);
          button.disabled = false;
          button.textContent = button.dataset.countdownLabel || '重新获取';
          return;
        }
        button.textContent = `${remaining}s`;
      }, 1000);
      notify(button.dataset.countdownToast || '验证码已发送');
    });
  });

  document.querySelectorAll('[data-stepper-root]').forEach((root) => {
    const panels = [...root.querySelectorAll('[data-step-panel]')];
    const indicators = [...root.querySelectorAll('[data-step-index]')];
    const setStep = (key) => {
      panels.forEach((panel, index) => {
        const active = panel.dataset.stepPanel === key;
        panel.hidden = !active;
        indicators[index]?.classList.toggle('active', active);
      });
      root.dataset.currentStep = key;
    };
    root.querySelectorAll('[data-step-next]').forEach((button) => {
      button.addEventListener('click', () => {
        const current = button.closest('[data-step-panel]');
        const required = [...current.querySelectorAll('[required]')];
        const invalid = required.find((field) => !field.value || (field.type === 'checkbox' && !field.checked));
        if (invalid) {
          invalid.reportValidity?.();
          invalid.focus?.();
          return;
        }
        setStep(button.dataset.stepNext);
      });
    });
    root.querySelectorAll('[data-step-prev]').forEach((button) => {
      button.addEventListener('click', () => setStep(button.dataset.stepPrev));
    });
  });

  document.querySelectorAll('[data-gate-group]').forEach((group) => {
    const target = document.querySelector(group.dataset.gateGroup);
    const refreshState = () => {
      const allChecked = [...group.querySelectorAll('input[type="checkbox"]')].every((field) => field.checked);
      if (target) target.disabled = !allChecked;
    };
    group.querySelectorAll('input[type="checkbox"]').forEach((field) => field.addEventListener('change', refreshState));
    refreshState();
  });

  document.querySelectorAll('[data-copy-text]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copyText;
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        notify(button.dataset.copySuccess || '已复制');
      } catch {
        notify('复制失败，请重试');
      }
    });
  });

  document.querySelectorAll('form[data-submit-message]:not([data-compose-root])').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelectorAll('[data-match]').forEach((field) => {
        const target = form.querySelector(field.dataset.match);
        const valid = !target || field.value === target.value;
        field.setCustomValidity(valid ? '' : (field.dataset.matchMessage || '两次输入不一致'));
      });
      if (!form.reportValidity()) return;
      const submitButton = form.querySelector('[type="submit"]');
      submitButton?.setAttribute('disabled', 'true');
      window.setTimeout(() => {
        submitButton?.removeAttribute('disabled');
        notify(form.dataset.submitMessage);
        const target = form.dataset.successNav;
        if (target) window.location.href = target;
      }, Number(form.dataset.submitDelay || 520));
    });
  });

  const composeRoots = document.querySelectorAll('[data-compose-root]');
  const composeError = (form, field, message) => {
    if (!field) return;
    field.setAttribute('aria-invalid', 'true');
    const slot = form.querySelector(`[data-error-for="${field.name}"]`);
    if (slot) slot.textContent = message;
  };
  const clearComposeError = (form, field) => {
    if (!field) return;
    field.removeAttribute('aria-invalid');
    const slot = form.querySelector(`[data-error-for="${field.name}"]`);
    if (slot) slot.textContent = '';
  };
  const validateComposeField = (form, field) => {
    if (!field || field.disabled || field.type === 'hidden' || field.type === 'file') return true;
    field.setCustomValidity('');
    clearComposeError(form, field);
    if (!field.checkValidity()) {
      composeError(form, field, field.validationMessage || '请完善此项');
      return false;
    }
    return true;
  };
  const makeVoteOption = (index) => {
    const row = document.createElement('div');
    row.className = 'vote-option';
    const order = document.createElement('span');
    order.className = 'option-order';
    order.textContent = String(index);
    const input = document.createElement('input');
    input.name = 'voteOption';
    input.maxLength = 50;
    input.required = true;
    input.placeholder = `选项 ${index}`;
    input.setAttribute('aria-label', `投票选项 ${index}`);
    const up = document.createElement('button');
    up.className = 'option-action';
    up.type = 'button';
    up.dataset.optionMove = 'up';
    up.setAttribute('aria-label', '上移选项');
    up.innerHTML = '<svg class="i" viewBox="0 0 24 24"><path d="m6 14 6-6 6 6"/></svg>';
    const remove = document.createElement('button');
    remove.className = 'option-action';
    remove.type = 'button';
    remove.dataset.optionRemove = '';
    remove.setAttribute('aria-label', '删除选项');
    remove.innerHTML = '<svg class="i" viewBox="0 0 24 24"><path d="M6 7h12m-8 4v5m4-5v5M9 7l1-2h4l1 2m-7 0 1 13h6l1-13"/></svg>';
    row.append(order, input, up, remove);
    return row;
  };
  const setupVoteOptions = (form) => {
    const list = form.querySelector('[data-vote-options]');
    if (!list) return;
    const count = form.querySelector('[data-option-count]');
    const add = form.querySelector('[data-option-add]');
    const sync = () => {
      const rows = [...list.querySelectorAll('.vote-option')];
      rows.forEach((row, index) => {
        const order = row.querySelector('.option-order');
        const input = row.querySelector('input[name="voteOption"]');
        const move = row.querySelector('[data-option-move]');
        const remove = row.querySelector('[data-option-remove]');
        if (order) order.textContent = String(index + 1);
        if (input) {
          input.placeholder = `选项 ${index + 1}`;
          input.setAttribute('aria-label', `投票选项 ${index + 1}`);
        }
        if (move) move.disabled = index === 0;
        if (remove) remove.disabled = rows.length <= 2;
      });
      if (count) count.textContent = `${rows.length} / 10`;
      if (add) add.disabled = rows.length >= 10;
      const max = form.querySelector('[name="maxSelections"]');
      if (max) max.max = String(rows.length);
    };
    form.addVoteOption = (value = '') => {
      if (list.querySelectorAll('.vote-option').length >= 10) return false;
      const row = makeVoteOption(list.querySelectorAll('.vote-option').length + 1);
      row.querySelector('input').value = value;
      list.append(row);
      sync();
      return true;
    };
    add?.addEventListener('click', () => {
      if (form.addVoteOption()) notify('已添加投票选项');
    });
    list.addEventListener('click', (event) => {
      const remove = event.target.closest('[data-option-remove]');
      const move = event.target.closest('[data-option-move]');
      const row = event.target.closest('.vote-option');
      if (!row) return;
      if (remove && list.querySelectorAll('.vote-option').length > 2) {
        row.remove();
        sync();
        return;
      }
      if (move) {
        const previous = row.previousElementSibling;
        if (previous) list.insertBefore(row, previous);
        sync();
      }
    });
    sync();
  };
  const restoreComposeDraft = (form) => {
    const key = form.dataset.draftKey;
    if (!key) return;
    try {
      const raw = storageGet(`campus-link:${key}`);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') return;
      if (Array.isArray(saved.voteOption) && form.addVoteOption) {
        while (form.querySelectorAll('[name="voteOption"]').length < saved.voteOption.length) form.addVoteOption();
      }
      Object.entries(saved).forEach(([name, value]) => {
        const fields = [...form.querySelectorAll(`[name="${name}"]`)];
        fields.forEach((field, index) => {
          if (field.type === 'file') return;
          if (field.type === 'checkbox') field.checked = Boolean(value);
          else if (Array.isArray(value)) field.value = value[index] || '';
          else field.value = value;
        });
      });
      form.querySelector('[data-draft-status]')?.replaceChildren('已恢复本地草稿');
      const savedLocation = form.querySelector('[data-context-field]')?.value;
      const context = form.querySelector('[data-compose-context]');
      if (context && savedLocation) {
        context.textContent = savedLocation;
        context.hidden = false;
        context.style.display = 'flex';
      }
      const selectedCheckin = form.querySelector('[name="checkinMethods"]')?.value.split(',').filter(Boolean) || [];
      form.querySelectorAll('[data-checkin-toggle]').forEach((button) => {
        button.setAttribute('aria-pressed', String(selectedCheckin.includes(button.dataset.checkinToggle)));
      });
      const checkinLocation = form.querySelector('[data-location-checkin]');
      if (checkinLocation) checkinLocation.hidden = !selectedCheckin.includes('LOCATION');
      const voteMode = form.querySelector('[name="voteMode"]')?.value;
      if (voteMode) {
        form.querySelectorAll('[data-vote-mode]').forEach((button) => {
          const active = button.dataset.voteMode === voteMode;
          button.classList.toggle('active', active);
          button.setAttribute('aria-pressed', String(active));
        });
        const maxChoice = form.querySelector('[data-max-choice]');
        if (maxChoice) maxChoice.hidden = voteMode !== 'multiple';
      }
      document.querySelector('[data-draft-status]')?.replaceChildren('已恢复本地草稿');
    } catch { /* 草稿读取失败不影响发布 */ }
  };
  const saveComposeDraft = (form) => {
    const key = form.dataset.draftKey;
    if (!key || form.classList.contains('is-submitted')) return;
    const data = {};
    form.querySelectorAll('[name]').forEach((field) => {
      if (field.type === 'file') return;
      const value = field.type === 'checkbox' ? field.checked : field.value;
      if (Object.prototype.hasOwnProperty.call(data, field.name)) {
        data[field.name] = Array.isArray(data[field.name]) ? data[field.name] : [data[field.name]];
        data[field.name].push(value);
      } else data[field.name] = value;
    });
    try {
      storageSet(`campus-link:${key}`, JSON.stringify(data));
      document.querySelector('[data-draft-status]')?.replaceChildren('草稿已保存 · 刚刚');
    } catch { /* 存储受限时保留当前表单，不阻止用户发布 */ }
  };
  const validateActivity = (form) => {
    const start = form.querySelector('[name="startAt"]');
    const end = form.querySelector('[name="endAt"]');
    const deadline = form.querySelector('[name="signupDeadline"]');
    if (start?.value && end?.value && new Date(end.value) <= new Date(start.value)) {
      end.setCustomValidity('结束时间必须晚于开始时间');
      composeError(form, end, end.validationMessage);
      return false;
    }
    if (start?.value && deadline?.value && new Date(deadline.value) >= new Date(start.value)) {
      deadline.setCustomValidity('报名截止必须早于开始时间');
      composeError(form, deadline, deadline.validationMessage);
      return false;
    }
    return true;
  };
  const validateVote = (form) => {
    const options = [...form.querySelectorAll('[name="voteOption"]')];
    const empty = options.find((field) => !field.value.trim());
    if (empty) {
      empty.setCustomValidity('请填写投票选项');
      composeError(form, empty, empty.validationMessage);
      return false;
    }
    const endAt = form.querySelector('[name="endAt"]');
    if (endAt?.value && new Date(endAt.value) <= new Date()) {
      endAt.setCustomValidity('截止时间必须晚于当前时间');
      composeError(form, endAt, endAt.validationMessage);
      return false;
    }
    const mode = form.querySelector('[name="voteMode"]')?.value;
    const max = form.querySelector('[name="maxSelections"]');
    if (mode === 'multiple' && max) {
      max.required = true;
      const maxNumber = Number(max.value);
      if (!maxNumber || maxNumber < 2 || maxNumber > options.length) {
        max.setCustomValidity(`请选择 2 到 ${options.length} 项`);
        composeError(form, max, max.validationMessage);
        return false;
      }
    }
    return true;
  };
  const validateComposeForm = (form) => {
    let valid = true;
    form.querySelectorAll('input,textarea,select').forEach((field) => {
      if (!validateComposeField(form, field)) valid = false;
    });
    if (form.dataset.composeKind === 'activity' && !validateActivity(form)) valid = false;
    if (form.dataset.composeKind === 'vote' && !validateVote(form)) valid = false;
    return valid;
  };
  composeRoots.forEach((form) => {
    setupVoteOptions(form);
    restoreComposeDraft(form);
    const editor = form.querySelector('[data-compose-content]');
    const counter = form.querySelector('[data-char-count]');
    const syncEditor = () => {
      if (!editor) return;
      editor.style.height = 'auto';
      editor.style.height = `${Math.max(editor.scrollHeight, 82)}px`;
      if (counter) counter.textContent = String(editor.value.length);
    };
    syncEditor();
    let draftTimer;
    const scheduleDraft = () => {
      window.clearTimeout(draftTimer);
      draftTimer = window.setTimeout(() => saveComposeDraft(form), 500);
    };
    const showSubmitError = () => {
      let panel = form.querySelector('[data-compose-submit-error]');
      if (!panel) {
        panel = document.createElement('div');
        panel.className = 'compose-submit-error';
        panel.dataset.composeSubmitError = '';
        panel.setAttribute('role', 'alert');
        const copy = document.createElement('p');
        copy.textContent = '网络不可用，已保留当前内容。恢复连接后可重试提交。';
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.textContent = '重试';
        retry.addEventListener('click', () => form.requestSubmit());
        panel.append(copy, retry);
        form.append(panel);
      }
      panel.hidden = false;
    };
    form.addEventListener('input', (event) => {
      if (event.target === editor) syncEditor();
      clearComposeError(form, event.target);
      scheduleDraft();
    });
    form.addEventListener('change', (event) => {
      clearComposeError(form, event.target);
      scheduleDraft();
    });
    form.addEventListener('focusout', (event) => validateComposeField(form, event.target));
    form.querySelectorAll('[data-compose-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const panel = form.querySelector(`#${button.dataset.composeToggle}`);
        if (!panel) return;
        panel.hidden = !panel.hidden;
        button.setAttribute('aria-expanded', String(!panel.hidden));
      });
    });
    form.querySelectorAll('[data-media-trigger]').forEach((button) => {
      button.addEventListener('click', () => document.getElementById(button.dataset.mediaTrigger)?.click());
    });
    form.querySelectorAll('[data-media-input]').forEach((input) => {
      input.addEventListener('change', () => {
        const preview = form.querySelector('[data-media-preview]');
        if (!preview) return;
        const limit = Number(input.dataset.mediaLimit || 9);
        const files = [...input.files].slice(0, limit);
        preview.replaceChildren();
        files.forEach((file) => {
          const figure = document.createElement('figure');
          const media = document.createElement(file.type.startsWith('video/') ? 'video' : 'img');
          media.src = URL.createObjectURL(file);
          if (media.tagName === 'VIDEO') media.controls = true;
          else media.alt = '已选择的媒体预览';
          const caption = document.createElement('figcaption');
          caption.textContent = file.name;
          figure.append(media, caption);
          preview.append(figure);
        });
        preview.hidden = files.length === 0;
        if (input.files.length > limit) notify(`最多可添加 ${limit} 个媒体文件`);
        scheduleDraft();
      });
    });
    form.querySelectorAll('[data-insert-topic]').forEach((button) => {
      button.addEventListener('click', () => {
        if (!editor) return;
        const topic = button.dataset.insertTopic || '';
        const start = editor.selectionStart || editor.value.length;
        const end = editor.selectionEnd || editor.value.length;
        editor.value = `${editor.value.slice(0, start)}${topic}${editor.value.slice(end)}`;
        editor.focus();
        editor.setSelectionRange(start + topic.length, start + topic.length);
        syncEditor();
        scheduleDraft();
      });
    });
    form.querySelectorAll('[data-set-context]').forEach((button) => {
      button.addEventListener('click', () => {
        const context = form.querySelector('[data-compose-context]');
        if (!context) return;
        context.textContent = button.dataset.setContext || '';
        context.hidden = !context.textContent;
        context.style.display = context.hidden ? '' : 'flex';
        const target = form.querySelector('[data-context-field]');
        if (target) target.value = context.textContent;
        scheduleDraft();
      });
    });
    const checkinRoot = form.querySelector('[data-checkin-methods]');
    if (checkinRoot) {
      checkinRoot.addEventListener('click', (event) => {
        const button = event.target.closest('[data-checkin-toggle]');
        if (!button) return;
        const pressed = button.getAttribute('aria-pressed') === 'true';
        button.setAttribute('aria-pressed', String(!pressed));
        const selected = [...checkinRoot.querySelectorAll('[aria-pressed="true"]')].map((item) => item.dataset.checkinToggle);
        const target = form.querySelector('[name="checkinMethods"]');
        if (target) target.value = selected.join(',');
        const location = form.querySelector('[data-location-checkin]');
        if (location) location.hidden = !selected.includes('LOCATION');
        scheduleDraft();
      });
    }
    const voteModes = form.querySelector('[data-vote-mode-group]');
    if (voteModes) {
      voteModes.addEventListener('click', (event) => {
        const button = event.target.closest('[data-vote-mode]');
        if (!button) return;
        voteModes.querySelectorAll('[data-vote-mode]').forEach((item) => {
          const active = item === button;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        const mode = button.dataset.voteMode;
        const field = form.querySelector('[name="voteMode"]');
        if (field) field.value = mode;
        const max = form.querySelector('[data-max-choice]');
        if (max) max.hidden = mode !== 'multiple';
        const maxInput = form.querySelector('[name="maxSelections"]');
        if (maxInput) maxInput.required = mode === 'multiple';
        scheduleDraft();
      });
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!validateComposeForm(form)) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        firstInvalid?.focus();
        return;
      }
      if (navigator.onLine === false) {
        showSubmitError();
        return;
      }
      const submitters = [...document.querySelectorAll(`[form="${form.id}"][type="submit"]`), ...form.querySelectorAll('[type="submit"]')];
      submitters.forEach((button) => {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = '发布中…';
      });
      document.querySelector('[data-draft-status]')?.replaceChildren('正在提交…');
      window.setTimeout(() => {
        storageRemove(`campus-link:${form.dataset.draftKey}`);
        form.classList.add('is-submitted');
        const result = form.parentElement?.querySelector('[data-publish-result]');
        if (result) {
          result.hidden = false;
          result.tabIndex = -1;
          result.focus();
        }
        notify('已提交审核');
      }, 560);
    });
  });
})();
