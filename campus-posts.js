(() => {
  const icon = {
    check: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    more: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
    heart: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.2-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.8-7 10-7 10Z"/></svg>',
    comment: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v11H9l-4 3z"/></svg>',
    share: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M10 14 19 5M5 19h5v-5"/></svg>',
    bookmark: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z"/></svg>',
    eye: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-3.5 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
    calendar: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
    pin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2"/></svg>',
    poll: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20V10m7 10V4m7 16v-7"/></svg>',
    channel: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v10H5zM8 10h8M8 14h5"/></svg>',
    link: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7.1l2-2a4 4 0 1 0-5.7-5.7l-1.1 1.1M14 10a4 4 0 0 0-5.7-.1l-2 2a4 4 0 1 0 5.7 5.7l1.1-1.1"/></svg>',
    back: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>'
  };

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const compactNumber = (value = 0) => new Intl.NumberFormat('zh-CN', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
  const byId = (id) => document.getElementById(id);

  // 后端应返回已裁决的 displayIdentity；此目录只验证前端插槽组合，不在客户端推导权限。
  const authorProfiles = [
    { id: 'student', initial: '周', avatarTone: 'warm', publicName: '拾光同学', name: '周予安', role: '学生', gender: '♂', meta: '计算机学院 · 软件工程', channelTitle: null },
    { id: 'teacher', initial: '陈', avatarTone: 'green', publicName: '陈老师', name: '陈书宁', role: '老师', gender: '♀', meta: '学生工作处 · 辅导员', channelTitle: null },
    { id: 'staff', initial: '林', avatarTone: 'blue', publicName: '林晓岚', name: '林晓岚', role: '工作人员', gender: '♀', meta: '后勤保障处 · 场馆服务', channelTitle: null },
    { id: 'admin', initial: '管', avatarTone: 'system', publicName: '校园社区管理员', name: '校园社区管理员', role: '管理员', gender: '', meta: '平台运营', channelTitle: null },
    { id: 'club_member', initial: '方', avatarTone: 'violet', publicName: '方知行', name: '方知行', role: '学生', gender: '♂', meta: '建筑学院 · 城乡规划', channelTitle: '摄影社社长', verified: { type: '社团', label: '摄影社' } },
    { id: 'union_member', initial: '李', avatarTone: 'blue', publicName: '李晨', name: '李晨', role: '学生', gender: '♀', meta: '学生会 · 宣传部', channelTitle: '宣传部部长', verified: { type: '学生会', label: '校学生会' } },
    { id: 'department_member', initial: '王', avatarTone: 'green', publicName: '王海宁', name: '王海宁', role: '工作人员', gender: '♂', meta: '图书馆 · 读者服务部', channelTitle: '馆务平台主管', verified: { type: '学院/学校部门', label: '图书馆' } }
  ];

  const postTemplates = {
    NORMAL_GALLERY: {
      title: '雨后的校园，适合慢一点走。',
      text: '傍晚六点，东门到湖边这条路的光线最好。把同一条散步路线拆成了几个镜头位，新生拍校园照也能直接参考。',
      detail: ['雨停以后，东区的风会先把路面的水吹干。沿着湖边往西走，树影和晚霞会在同一段路上出现。', '我把适合停下来的位置记在图片里，避开车道，也尽量不打扰正在上课和通行的同学。'],
      topics: ['校园生活', '随手拍'],
      media: [{ label: '东区湖边' }, { label: '林荫路', tone: 'alt' }, { label: '操场看台', tone: 'violet' }, { label: '西侧步道', tone: 'warm' }]
    },
    ACTIVITY: {
      title: '毕业季旧物交换：把闲置物品留在校园',
      text: '面向全校同学开放。请提前准备需要交换的物品，现场可登记捐赠去向。',
      detail: ['毕业不是清空，也可以是把还在使用期的物品交给下一位同学。现场分为交换、捐赠和咨询三个区域。', '请勿携带危险品、过期食品和无法正常使用的电器；志愿者会协助完成登记。'],
      topics: ['毕业季', '旧物交换'],
      activity: { time: '6 月 28 日 14:00–17:00', location: '大学生活动中心一楼', signed: 144, capacity: 200, status: '报名中', viewerStatus: '未报名' }
    },
    VOTE: {
      title: '图书馆期末周是否延长开放至 23:00？',
      text: '请在截止前投出你的选择，结果将作为开放时间调整的参考意见。',
      detail: ['图书馆正在汇总期末周延长开放的实际需求。投票结果会与座位使用率、馆员排班和安全保障条件一起评估。', '每个账号可投一票，截止时间前请确认自己的选择。'],
      topics: ['期末周', '图书馆'],
      vote: { deadline: '距截止还有 2 天', participants: 1028, status: '进行中', options: [{ label: '支持延长', percent: 64 }, { label: '维持现状', percent: 23 }, { label: '希望 24 小时开放', percent: 13 }] }
    }
  };

  const channelFor = (profile) => {
    if (profile.verified) return { id: `channel-${profile.id}`, name: profile.verified.label, certified: true };
    if (profile.id === 'teacher') return { id: 'channel-student-affairs', name: '学生事务中心', certified: true };
    if (profile.id === 'staff') return { id: 'channel-campus-service', name: '校园服务', certified: true };
    if (profile.id === 'admin') return { id: 'channel-platform', name: '校园社区', certified: true };
    return { id: 'channel-life', name: '校园生活', certified: false };
  };

  const makePost = (kind, profile, sourceScene = 'PUBLIC_FEED') => {
    const template = postTemplates[kind];
    const realNameRequired = sourceScene === 'CHANNEL_FEED' || profile.id !== 'student';
    const name = realNameRequired ? profile.name : profile.publicName;
    const channel = channelFor(profile);
    const shortKind = kind.replace('NORMAL_GALLERY', 'normal').replace('ACTIVITY', 'activity').replace('VOTE', 'vote');
    return {
      id: `post-${shortKind}-${profile.id}-${sourceScene.toLowerCase()}`,
      kind,
      sourceScene,
      groups: ['following', 'latest', 'hot', 'life'],
      author: { profileId: profile.id, initial: profile.initial, avatarTone: profile.avatarTone },
      displayIdentity: { displayName: name, role: profile.role, gender: profile.gender, metaLine: `${profile.meta} · ${kind === 'ACTIVITY' ? '18 分钟前' : kind === 'VOTE' ? '46 分钟前' : '2 小时前'}`, verified: profile.verified || null, channelTitle: profile.channelTitle },
      summary: { title: template.title, text: template.text, topics: template.topics },
      detail: template.detail,
      media: template.media ? template.media.map((item) => ({ ...item })) : null,
      activity: template.activity ? { ...template.activity } : null,
      vote: template.vote ? { ...template.vote, options: template.vote.options.map((item) => ({ ...item })) } : null,
      channel: sourceScene === 'PUBLIC_FEED' ? { ...channel, syncedToPublic: true } : { ...channel, syncedToPublic: false },
      metrics: kind === 'ACTIVITY' ? { like: 86, comment: 12, repost: 18, favorite: 34, view: 2418 } : kind === 'VOTE' ? { like: 128, comment: 47, repost: 9, favorite: 22, view: 3548 } : { like: 29, comment: 6, repost: 2, favorite: 11, view: 634 },
      viewerState: { liked: false, favorited: false, capabilities: kind === 'ACTIVITY' ? ['activity.signup', 'activity.remind', 'post.comment', 'post.repost', 'post.favorite'] : kind === 'VOTE' ? ['vote.submit', 'post.comment', 'post.repost', 'post.favorite'] : ['post.comment', 'post.repost', 'post.favorite'] }
    };
  };

  const catalogFixtures = ['PUBLIC_FEED', 'CHANNEL_FEED'].flatMap((scene) => Object.keys(postTemplates).flatMap((kind) => authorProfiles.map((profile) => makePost(kind, profile, scene))));
  const postCardFixtures = [
    makePost('NORMAL_GALLERY', authorProfiles[0]),
    makePost('ACTIVITY', authorProfiles[5]),
    makePost('VOTE', authorProfiles[1])
  ];
  const getPostById = (id) => catalogFixtures.find((post) => post.id === id) || postCardFixtures.find((post) => post.id === id) || postCardFixtures[0];
  const detailHref = (post) => `campus-post-detail.html?postId=${encodeURIComponent(post.id)}`;
  const profileIdFor = (post) => post.author?.profileId || post.specimen?.profileKey || post.displayIdentity?.displayName || 'unknown';
  const profileHref = (post) => `campus-user-home.html?userId=${encodeURIComponent(profileIdFor(post))}`;

  const renderAvatar = (post) => `<span class="avatar ${escapeHtml(post.author.avatarTone || '')}" data-gender="${escapeHtml(post.displayIdentity.gender || '')}">${escapeHtml(post.author.initial)}</span>`;
  const renderVerified = (identity) => identity.verified ? `<span class="post-card-verified" aria-label="${escapeHtml(identity.verified.type)}认证：${escapeHtml(identity.verified.label)}">${icon.check}</span>` : '';
  const renderAuthorLink = (post) => {
    const identity = post.displayIdentity;
    const title = identity.channelTitle ? `<span class="post-card-title">${escapeHtml(identity.channelTitle)}</span>` : '';
    return `<a class="post-card-author-link" href="${profileHref(post)}" aria-label="查看${escapeHtml(identity.displayName)}的个人主页">${renderAvatar(post)}<div class="post-card-author"><div class="post-card-name-row"><strong>${escapeHtml(identity.displayName)}</strong><span class="post-card-role">${escapeHtml(identity.role)}</span>${identity.gender ? `<span class="post-card-role gender">${escapeHtml(identity.gender)}</span>` : ''}${renderVerified(identity)}${title}</div><div class="post-card-author-meta">${escapeHtml(identity.metaLine)}</div></div></a>`;
  };
  const renderZoneA = (post) => {
    if (post.lifecycle?.state === 'NO_PERMISSION') return '<header class="post-card-zone post-card-zone-a" data-post-zone="A"><span class="avatar system">锁</span><div class="post-card-author"><div class="post-card-name-row"><strong>受保护内容</strong></div><div class="post-card-author-meta">身份、频道和发布时间均不向无权限用户返回</div></div></header>';
    return `<header class="post-card-zone post-card-zone-a" data-post-zone="A">${renderAuthorLink(post)}<button class="post-card-more" type="button" data-post-card-more aria-label="更多帖子操作">${icon.more}</button></header>`;
  };
  const renderZoneB = (post) => {
    const state = post.lifecycle?.state;
    const type = post.kind === 'ACTIVITY' ? '<span class="post-card-type">活动</span>' : post.kind === 'VOTE' ? '<span class="post-card-type">投票</span>' : '';
    if (state === 'PENDING') return `<div class="post-card-zone post-card-zone-b" data-post-zone="B">${type}<span class="post-card-state">审核中，仅作者与审核员可见</span></div>`;
    if (state === 'REJECTED') return `<div class="post-card-zone post-card-zone-b" data-post-zone="B">${type}<span class="post-card-state rejected">未通过：${escapeHtml(post.lifecycle.reason || '请修改后重试')}</span></div>`;
    if (state === 'DELETED') return `<div class="post-card-zone post-card-zone-b" data-post-zone="B">${type}<span class="post-card-state private">内容已删除</span></div>`;
    if (state === 'NO_PERMISSION') return `<div class="post-card-zone post-card-zone-b" data-post-zone="B">${type}<span class="post-card-state private">当前用户无查看权限</span></div>`;
    return type ? `<div class="post-card-zone post-card-zone-b" data-post-zone="B">${type}</div>` : '';
  };
  const renderGallery = (media = [], detail = false) => {
    const visible = media.slice(0, detail ? media.length : 9);
    const layout = visible.length === 1 ? 'one' : visible.length === 2 ? 'two' : 'grid';
    return `<section class="post-card-gallery ${detail ? 'is-detail-media' : ''}" data-layout="${layout}" aria-label="帖子图片，共 ${media.length} 张">${visible.map((item, index) => `<div class="post-card-media ${escapeHtml(item.tone || '')}"><span class="post-card-media-label">${escapeHtml(item.label || `图片 ${index + 1}`)}</span></div>`).join('')}</section>`;
  };
  const renderLinkPreview = (post) => `<a class="post-card-link-preview" href="${detailHref(post)}" aria-label="查看链接帖子详情"><span class="post-card-link-icon">${icon.link}</span><div class="post-card-link-copy"><strong>${escapeHtml(post.link?.title || '链接内容')}</strong><span>${escapeHtml(post.link?.domain || '—')}</span></div></a>`;
  const renderVideoPreview = (post) => `<a class="post-card-video-preview" href="${detailHref(post)}" aria-label="查看视频帖子详情"><span class="post-card-video-play">▶</span><span class="post-card-video-duration">${escapeHtml(post.video?.duration || '00:00')}</span><span class="post-card-video-status">${escapeHtml(post.video?.status || '可播放')}</span></a>`;
  const renderActivity = (post, detail = false) => {
    const activity = post.activity;
    const progress = Math.min(100, Math.round((activity.signed / activity.capacity) * 100));
    return `<section class="post-card-activity ${detail ? 'detail-module' : ''}" aria-label="活动信息"><div class="post-card-activity-head"><strong>${escapeHtml(activity.status)}</strong><span class="post-card-title">${escapeHtml(activity.viewerStatus)}</span></div><div class="post-card-activity-meta"><span>${icon.calendar}${escapeHtml(activity.time)}</span><span>${icon.pin}${escapeHtml(activity.location)}</span></div><div class="post-card-progress"><div class="post-card-progress-track"><i style="--progress:${progress}%"></i></div><span>${activity.signed} / ${activity.capacity} 人</span></div><div class="post-card-activity-actions"><button type="button" data-post-remind>设提醒</button><button class="primary" type="button" data-post-activity-action>${post.viewerState.capabilities.includes('activity.signup') ? '立即报名' : '查看详情'}</button></div></section>`;
  };
  const renderVote = (post, detail = false) => {
    const vote = post.vote;
    return `<section class="post-card-vote ${detail ? 'detail-module' : ''}" data-vote-card aria-label="投票"><div class="post-card-vote-head"><strong>${icon.poll}${escapeHtml(vote.status)}</strong><span class="post-card-title">${escapeHtml(vote.deadline)}</span></div><div class="post-card-vote-options">${vote.options.map((option, index) => `<button class="post-card-vote-option" type="button" data-vote-option data-option-index="${index}" style="--vote-progress:${option.percent}%"><i></i><span><b>${escapeHtml(option.label)}</b><b>${option.percent}%</b></span></button>`).join('')}</div><div class="post-card-vote-foot"><span>${compactNumber(vote.participants)} 人已参与</span><span data-vote-note>单选 · 投票后不可修改</span></div></section>`;
  };
  const renderZoneC = (post) => {
    if (post.lifecycle?.state === 'DELETED') return '<div class="post-card-zone post-card-zone-c" data-post-zone="C"><div class="post-card-copy"><h3>原帖已删除</h3><p>内容不再展示，保留删除状态与必要审计上下文。</p></div></div>';
    if (post.lifecycle?.state === 'NO_PERMISSION') return '<div class="post-card-zone post-card-zone-c" data-post-zone="C"><div class="post-card-copy"><h3>内容受访问规则保护</h3><p>当前账号不满足可见范围，正文、媒体和互动统计均不会返回。</p></div></div>';
    let preview = '';
    if (post.kind === 'NORMAL_GALLERY') preview = renderGallery(post.media);
    if (post.kind === 'NORMAL_LINK') preview = renderLinkPreview(post);
    if (post.kind === 'NORMAL_VIDEO') preview = renderVideoPreview(post);
    if (post.kind === 'ACTIVITY') preview = renderActivity(post);
    if (post.kind === 'VOTE') preview = renderVote(post);
    return `<div class="post-card-zone post-card-zone-c" data-post-zone="C"><div class="post-card-copy"><h3><a href="${detailHref(post)}">${escapeHtml(post.summary.title)}</a></h3><p>${escapeHtml(post.summary.text)}</p></div><div class="post-card-tags">${post.summary.topics.map((topic) => `<a href="campus-topic-detail.html">#${escapeHtml(topic)}</a>`).join('')}</div>${preview}</div>`;
  };
  const renderZoneD = (post) => post.lifecycle?.state !== 'NO_PERMISSION' && post.sourceScene !== 'CHANNEL_FEED' && post.channel ? `<div class="post-card-zone post-card-zone-d" data-post-zone="D"><a class="post-card-channel" href="campus-channel-detail.html" aria-label="来自频道 ${escapeHtml(post.channel.name)}">${icon.channel}<span class="post-card-channel-name">${escapeHtml(post.channel.name)}</span>${post.channel.certified ? icon.check : ''}</a></div>` : '';
  const renderZoneE = (post) => ['DELETED', 'NO_PERMISSION'].includes(post.lifecycle?.state) ? '' : `<div class="post-card-zone post-card-zone-e" data-post-zone="E"><div class="post-card-metrics" aria-label="互动数据"><span class="post-card-metric">${icon.eye}${compactNumber(post.metrics.view)}</span><span class="post-card-metric">${icon.heart}${compactNumber(post.metrics.like)}</span><span class="post-card-metric">${icon.comment}${compactNumber(post.metrics.comment)}</span><span class="post-card-metric">${icon.bookmark}${compactNumber(post.metrics.favorite)}</span></div></div>`;
  const action = (svg, label, attr, value, active = '') => `<button class="post-card-action ${active}" type="button" ${attr}>${svg}<span ${value !== undefined ? 'data-count' : ''}>${value !== undefined ? compactNumber(value) : escapeHtml(label)}</span></button>`;
  const renderZoneF = (post) => ['DELETED', 'NO_PERMISSION'].includes(post.lifecycle?.state) ? '' : `<footer class="post-card-zone post-card-zone-f" data-post-zone="F" aria-label="帖子操作">${action(icon.heart, '点赞', 'data-like', post.metrics.like, post.viewerState.liked ? 'liked' : '')}${post.viewerState.capabilities.includes('post.comment') ? `<a class="post-card-action" href="${detailHref(post)}#comments">${icon.comment}<span>${compactNumber(post.metrics.comment)}</span></a>` : ''}${post.viewerState.capabilities.includes('post.repost') ? action(icon.share, '转发', 'data-post-repost', post.metrics.repost) : ''}${post.viewerState.capabilities.includes('post.favorite') ? action(icon.bookmark, '收藏', 'data-save', post.metrics.favorite, post.viewerState.favorited ? 'saved' : '') : ''}</footer>`;
  const renderPostCard = (post) => `<article class="card post-card-shell kind-${escapeHtml(post.kind.toLowerCase())}" data-post-id="${escapeHtml(post.id)}" data-detail-href="${detailHref(post)}" data-source-scene="${escapeHtml(post.sourceScene)}" data-feed-item="${escapeHtml((post.groups || []).join(' '))}" data-searchable tabindex="0" role="link" aria-label="查看帖子详情：${escapeHtml(post.summary.title)}">${renderZoneA(post)}${renderZoneB(post)}${renderZoneC(post)}${renderZoneD(post)}${renderZoneE(post)}${renderZoneF(post)}</article>`;

  const feedStateMarkup = {
    loading: '<div class="post-feed-skeleton" aria-label="正在加载信息流" aria-busy="true"><i></i><i></i><i></i></div>',
    empty: '<section class="post-feed-state"><strong>这里还没有动态</strong><p>关注同学或加入频道后，最新内容会出现在这里。</p><button type="button" data-post-empty-action>去发现频道</button></section>',
    error: '<section class="post-feed-state"><strong>动态暂时没有加载成功</strong><p>网络不可用或内容服务暂时繁忙，当前筛选条件已保留。</p><button type="button" data-post-retry>重新加载</button></section>'
  };
  const renderFeed = (target, state = 'populated') => {
    if (!target) return;
    target.innerHTML = state === 'populated' ? postCardFixtures.map(renderPostCard).join('') : (feedStateMarkup[state] || feedStateMarkup.error);
    target.dataset.postState = state;
  };
  const renderPostList = (target) => {
    if (!target) return;
    const fixtureStore = window.CampusPostFixtures;
    const lookup = (id) => fixtureStore?.byId?.[id] || getPostById(id);
    const ids = (target.dataset.postIds || '').split(',').map((id) => id.trim()).filter(Boolean);
    let posts = ids.length ? ids.map(lookup).filter(Boolean) : [...(fixtureStore?.all || []), ...postCardFixtures];
    if (target.dataset.postKind) posts = posts.filter((post) => post.kind === target.dataset.postKind);
    if (target.dataset.postProfile) posts = posts.filter((post) => post.specimen?.profileKey === target.dataset.postProfile);
    if (target.dataset.limit) posts = posts.slice(0, Number(target.dataset.limit));
    target.innerHTML = posts.length ? posts.map(renderPostCard).join('') : '<section class="center-empty"><h3>暂无可展示内容</h3><p>当前筛选条件下没有已通过且有权访问的帖子。</p></section>';
  };

  const comments = [
    { id: 'c1', initial: '李', tone: 'warm', name: '李同学', role: '学生', time: '1 小时前', text: '确实很漂亮。我也去看了，五点半之后晚霞打在湖面和树影上，手机直出就很有层次。', likes: 5, replies: [{ initial: '王', name: '王五', target: '李同学', text: '收到，我周末也去看看西门那一段。', time: '48 分钟前' }, { initial: '李', name: '李同学', target: '王五', text: '树更密一点，傍晚人也相对少。', time: '39 分钟前' }] },
    { id: 'c2', initial: '赵', tone: 'green', name: '赵老师', role: '老师', time: '30 分钟前', text: '拍得很好。提醒大家取景时注意车道和通行，不要在路口长时间停留。', likes: 12, replies: [] }
  ];
  const renderComment = (comment) => `<article class="thread-item" data-comment-id="${escapeHtml(comment.id)}"><div class="thread-head"><span class="avatar ${escapeHtml(comment.tone)}">${escapeHtml(comment.initial)}</span><div class="thread-copy"><div class="thread-name"><strong>${escapeHtml(comment.name)}</strong><span>${escapeHtml(comment.role)}</span></div><p>${escapeHtml(comment.text)}</p><div class="thread-tools"><time>${escapeHtml(comment.time)}</time><button type="button" data-thread-like>${icon.heart}<span data-count>${comment.likes}</span></button><button type="button" data-reply-author="${escapeHtml(comment.name)}">回复</button></div></div></div>${comment.replies.length ? `<div class="thread-replies">${comment.replies.map((reply) => `<div class="thread-reply"><span class="avatar mini ${escapeHtml(comment.tone)}">${escapeHtml(reply.initial)}</span><div><strong>${escapeHtml(reply.name)} <em>回复 ${escapeHtml(reply.target)}</em></strong><p>${escapeHtml(reply.text)}</p><time>${escapeHtml(reply.time)}</time></div></div>`).join('')}</div>` : ''}</article>`;
  const renderCommentState = (state) => {
    if (state === 'loading') return '<div class="thread-loading" role="status">正在加载评论…</div>';
    if (state === 'empty') return '<section class="thread-empty"><strong>还没有评论</strong><p>第一个说说你的想法。</p></section>';
    if (state === 'error') return '<section class="thread-empty"><strong>评论暂时无法加载</strong><p>请检查网络后重试，当前帖子内容仍可阅读。</p><button type="button" data-comment-retry>重新加载</button></section>';
    return comments.map(renderComment).join('');
  };
  const renderDetailBody = (post) => {
    const special = post.kind === 'ACTIVITY' ? renderActivity(post, true) : post.kind === 'VOTE' ? renderVote(post, true) : '';
    const gallery = post.kind === 'NORMAL_GALLERY' ? renderGallery(post.media, true) : '';
    const type = post.kind === 'ACTIVITY' ? '<span class="detail-type">活动</span>' : post.kind === 'VOTE' ? '<span class="detail-type">投票</span>' : '';
    return `<article class="detail-post" data-post-id="${escapeHtml(post.id)}"><header class="detail-author"><a class="post-card-author-link detail-author-link" href="${profileHref(post)}" aria-label="查看${escapeHtml(post.displayIdentity.displayName)}的个人主页">${renderAvatar(post)}<div><div class="detail-name"><strong>${escapeHtml(post.displayIdentity.displayName)}</strong>${renderVerified(post.displayIdentity)}${type}</div><div>${escapeHtml(post.displayIdentity.role)} · ${escapeHtml(post.displayIdentity.metaLine)}</div></div></a><button class="post-card-more" type="button" data-post-card-more aria-label="更多帖子操作">${icon.more}</button></header><div class="detail-copy"><h1>${escapeHtml(post.summary.title)}</h1>${post.detail.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div><div class="detail-tags">${post.summary.topics.map((topic) => `<a href="campus-topic-detail.html">#${escapeHtml(topic)}</a>`).join('')}</div>${gallery}${special}${post.sourceScene === 'PUBLIC_FEED' ? `<a class="detail-channel" href="campus-channel-detail.html">${icon.channel}<span>来自 ${escapeHtml(post.channel.name)}</span>${post.channel.certified ? icon.check : ''}</a>` : ''}${renderZoneE(post)}${renderZoneF(post)}</article>`;
  };
  const renderDetailState = (state, post) => {
    if (state === 'loading') return '<section class="detail-state" role="status">正在加载帖子…</section>';
    if (state === 'error') return '<section class="detail-state"><strong>帖子暂时无法加载</strong><p>网络连接异常，已保留此链接。</p><button type="button" data-detail-retry>重新加载</button></section>';
    if (state === 'not-found') return '<section class="detail-state"><strong>帖子已不可用</strong><p>它可能已被删除、设为私密，或你没有查看权限。</p></section>';
    return renderDetailBody(post);
  };
  const renderPostDetail = (root) => {
    const query = new URLSearchParams(window.location.search);
    const post = getPostById(query.get('postId'));
    const postState = query.get('postState') || 'populated';
    const commentState = query.get('commentState') || 'populated';
    root.innerHTML = `<div class="post-detail-shell"><header class="post-detail-bar"><div class="side"><button class="icon-button" type="button" data-detail-back aria-label="返回">${icon.back}</button></div><div class="title">帖子</div><div class="side end"><button class="icon-button" type="button" data-post-card-more aria-label="更多帖子操作">${icon.more}</button></div></header><main class="post-detail-main">${renderDetailState(postState, post)}<section class="detail-comments" id="comments"><header class="detail-comments-head"><h2>评论 ${compactNumber(post.metrics.comment)}</h2><button type="button" data-comment-sort>最热</button></header><div class="thread-list" data-comment-list>${renderCommentState(commentState)}</div></section></main><form class="detail-composer" data-detail-composer><textarea required maxlength="200" placeholder="说点什么…" aria-label="评论输入框"></textarea><button class="button" type="submit">发送</button></form></div><div class="toast" data-toast-region role="status" aria-live="polite"></div>`;
  };
  const renderCatalog = (root) => {
    const groups = [{ key: 'PUBLIC_FEED', title: '公共频道信息流', note: '普通学生使用用户名；教师、工作人员、管理员和认证成员按身份展示规则输出。' }, { key: 'CHANNEL_FEED', title: '垂直频道信息流', note: '所有发布者使用真实姓名；频道来源在当前频道内不重复渲染。' }];
    root.innerHTML = `<header class="catalog-bar"><a href="index.html">校园社区</a><span>帖子组件目录</span></header><main class="catalog-main"><div class="catalog-intro"><h1>帖子卡片组合</h1><p>42 个可联调实例：3 种帖子类型 × 7 类发布者 × 2 个展示场景。点击任一标题或评论入口可进入对应详情。</p></div>${groups.map((group) => `<section class="catalog-group"><header><h2>${group.title}</h2><p>${group.note}</p></header><div class="catalog-type-grid">${Object.keys(postTemplates).map((kind) => `<section class="catalog-type"><h3>${kind === 'NORMAL_GALLERY' ? '普通图文帖' : kind === 'ACTIVITY' ? '活动帖' : '投票帖'}</h3><div class="catalog-posts">${catalogFixtures.filter((post) => post.sourceScene === group.key && post.kind === kind).map(renderPostCard).join('')}</div></section>`).join('')}</div></section>`).join('')}</main>`;
  };

  const announce = (message) => {
    const toast = document.querySelector('[data-toast-region]');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(announce.timer);
    announce.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
  };
  document.addEventListener('click', (event) => {
    const target = event.target.closest('button, a');
    if (!target) return;
    if (target.matches('[data-detail-back]')) { history.length > 1 ? history.back() : (window.location.href = 'campus-home.html'); return; }
    if (target.matches('[data-post-retry], [data-detail-retry]')) { window.location.reload(); return; }
    if (target.matches('[data-comment-retry]')) { const list = target.closest('[data-comment-list]'); if (list) list.innerHTML = renderCommentState('populated'); return; }
    if (target.matches('[data-post-empty-action]')) { window.location.href = 'campus-channels.html'; return; }
    if (target.matches('[data-post-card-more]')) { announce('可举报、分享、屏蔽或管理该帖子'); return; }
    if (target.matches('[data-post-repost]')) { announce('转发入口已打开'); return; }
    if (target.matches('[data-post-remind]')) { announce('活动提醒已保存'); return; }
    if (target.matches('[data-post-activity-action]')) { window.location.href = 'campus-activity-signup.html'; return; }
    if (target.matches('[data-vote-option]')) {
      const box = target.closest('[data-vote-card]');
      if (!box || box.dataset.voted === 'true') return;
      box.dataset.voted = 'true';
      box.querySelectorAll('[data-vote-option]').forEach((option) => option.classList.toggle('selected', option === target));
      const note = box.querySelector('[data-vote-note]'); if (note) note.textContent = '已投票，不支持修改';
      announce('投票已提交'); return;
    }
    if (target.matches('[data-reply-author]')) {
      const input = document.querySelector('[data-detail-composer] textarea');
      if (input) { input.value = `@${target.dataset.replyAuthor} `; input.focus(); }
      return;
    }
    if (target.matches('[data-thread-like]')) {
      const count = target.querySelector('[data-count]'); if (count) count.textContent = Number(count.textContent || 0) + 1;
      target.classList.add('liked'); return;
    }
  });
  document.addEventListener('click', (event) => {
    const card = event.target.closest?.('[data-detail-href]');
    if (!card || event.target.closest('button, a')) return;
    window.location.href = card.dataset.detailHref;
  });
  document.addEventListener('keydown', (event) => {
    if ((event.key !== 'Enter' && event.key !== ' ') || event.target?.getAttribute('role') !== 'link') return;
    const href = event.target.dataset?.detailHref;
    if (!href) return;
    event.preventDefault();
    window.location.href = href;
  });
  document.addEventListener('submit', (event) => {
    if (!event.target.matches('[data-detail-composer]')) return;
    event.preventDefault();
    const input = event.target.querySelector('textarea');
    if (!input.value.trim()) return;
    input.value = '';
    announce('评论已发布');
  });

  document.querySelectorAll('[data-post-feed]').forEach((feed) => renderFeed(feed, new URLSearchParams(window.location.search).get('postState') || feed.dataset.postState || 'populated'));
  document.querySelectorAll('[data-post-list]').forEach(renderPostList);
  document.querySelectorAll('[data-post-detail]').forEach(renderPostDetail);
  document.querySelectorAll('[data-post-catalog]').forEach(renderCatalog);

  window.CampusPosts = Object.freeze({ renderPostCard, renderFeed, renderPostList, renderPostDetail, renderCatalog, getPostById, profileHref, fixtures: postCardFixtures, catalogFixtures });
})();
