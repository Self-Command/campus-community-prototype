(() => {
  const icon = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.2-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.8-7 10-7 10Z"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v11H9l-4 3z"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M10 14 19 5M5 19h5v-5"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2"/></svg>',
    poll: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20V10m7 10V4m7 16v-7"/></svg>',
    channel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v10H5zM8 10h8M8 14h5"/></svg>'
  };

  const comments = [
    {
      id: 'c1',
      profileId: 'STUDENT_MEMBER',
      initial: '何',
      tone: 'warm',
      name: '何满',
      role: '学生',
      time: '12 分钟前',
      text: '这个建议很有用，尤其是把入口、打印区和导视分开说明，后端做字段时也能拆成位置提示和说明文本。',
      likes: 5,
      replies: [
        { id: 'r1', profileId: 'CHANNEL_MEMBER', initial: '陈', tone: 'blue', name: '陈同学', target: '何满', time: '8 分钟前', text: '我补充一下，晚高峰时打印区确实最容易被忽略。' },
        { id: 'r2', profileId: 'STUDENT_MEMBER', initial: '何', tone: 'warm', name: '何满', target: '陈同学', time: '5 分钟前', text: '对，入口提示和楼层导视一起更新会更清楚。' },
        { id: 'r3', profileId: 'FACULTY_MEMBER', initial: '周', tone: 'green', name: '周老师', target: '何满', time: '刚刚', text: '这类建议可以同步给图书馆值班台，我们会继续收集。' }
      ]
    },
    {
      id: 'c2',
      profileId: 'CHANNEL_MEMBER',
      initial: '梁',
      tone: 'green',
      name: '梁同学',
      role: '频道成员',
      time: '4 分钟前',
      text: '已收藏，等周末去的时候再对照路线走一遍。',
      likes: 2,
      replies: []
    },
    {
      id: 'c3',
      profileId: 'CHANNEL_ADMIN',
      initial: '苏',
      tone: 'blue',
      name: '苏澜',
      role: '频道管理员',
      time: '刚刚',
      text: '如果后续需要同步到频道公告，可以把这个帖子转成置顶引用。',
      likes: 0,
      replies: [
        { id: 'r4', profileId: 'STUDENT_MEMBER', initial: '林', tone: 'warm', name: '林间月', target: '苏澜', time: '刚刚', text: '可以，我整理完图片后再提交。' }
      ]
    }
  ];

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
  const compactNumber = (value = 0) => new Intl.NumberFormat('zh-CN', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
  const isRestricted = (post) => ['DELETED', 'NO_PERMISSION'].includes(post.lifecycle?.state);
  const profileIdFor = (post) => post.author?.profileId || post.specimen?.profileKey || post.displayIdentity?.displayName || 'unknown';
  const profileHref = (post) => `campus-user-home.html?userId=${encodeURIComponent(profileIdFor(post))}`;
  const commentProfileHref = (item) => `campus-user-home.html?userId=${encodeURIComponent(item.profileId || item.name || 'unknown')}`;

  const renderAuthor = (post) => {
    const identity = post.displayIdentity;
    const verified = identity.verified ? `<span class="detail-verified" aria-label="${escapeHtml(identity.verified.type)}认证：${escapeHtml(identity.verified.label)}">${icon.check}<span>${escapeHtml(identity.verified.label)}</span></span>` : '';
    const title = identity.channelTitle ? `<span class="detail-author-title">${escapeHtml(identity.channelTitle)}</span>` : '';
    return `<header class="detail-author" data-od-id="post-author-header">
      <a class="detail-author-link" href="${profileHref(post)}" aria-label="查看${escapeHtml(identity.displayName)}的个人主页">
        <span class="avatar ${escapeHtml(post.author.avatarTone || '')}" data-gender="${escapeHtml(identity.gender || '')}">${escapeHtml(post.author.initial)}</span>
        <div class="detail-author-copy">
          <div class="detail-author-name"><strong>${escapeHtml(identity.displayName)}</strong><span>${escapeHtml(identity.role)}</span>${verified}</div>
          <p>${escapeHtml(identity.metaLine)}${title ? ` · ${title}` : ''}</p>
        </div>
      </a>
      <button class="detail-follow" type="button" data-detail-follow>关注</button>
    </header>`;
  };

  const renderLifecycle = (post) => {
    const state = post.lifecycle?.state || 'APPROVED';
    const reason = post.lifecycle?.reason;
    if (state === 'PENDING') return `<aside class="detail-notice pending" role="status"><strong>待处理</strong><span>当前内容仅作者与审核员可见。完成处理后会按原可见范围进入信息流。</span></aside>`;
    if (state === 'REJECTED') return `<aside class="detail-notice rejected" role="alert"><strong>审核未通过</strong><span>${escapeHtml(reason || '请修改后重新提交。')}</span><a href="campus-publish-post.html">返回编辑</a></aside>`;
    return '';
  };

  const renderMedia = (post) => {
    if (post.kind === 'NORMAL_GALLERY') {
      const media = post.media || [];
      const total = media.length;
      const items = media.map((item, index) => `<button class="detail-media ${escapeHtml(item.tone || '')}" type="button" data-detail-media data-gallery-slide data-gallery-index="${index}" data-media-label="${escapeHtml(item.label)}" aria-label="第 ${index + 1} 张图片：${escapeHtml(item.label)}，轻触查看大图"><span>${index + 1} / ${total}</span><b>${escapeHtml(item.label)}</b></button>`).join('');
      const dots = media.map((item, index) => `<button class="detail-gallery-dot${index === 0 ? ' is-active' : ''}" type="button" data-gallery-dot="${index}" aria-label="查看第 ${index + 1} 张图片" aria-current="${index === 0 ? 'true' : 'false'}"></button>`).join('');
      return `<figure class="detail-gallery-shell" data-gallery data-gallery-count="${total}">
        <div class="detail-gallery-stage">
          <div class="detail-gallery" data-gallery-track tabindex="0" aria-label="图文内容，共 ${total} 张图片；左右滑动查看">${items}</div>
          ${total > 1 ? `<button class="detail-gallery-nav previous" type="button" data-gallery-prev aria-label="上一张图片">‹</button><button class="detail-gallery-nav next" type="button" data-gallery-next aria-label="下一张图片">›</button>` : ''}
        </div>
        ${total > 1 ? `<div class="detail-gallery-meta"><span class="detail-gallery-caption" data-gallery-caption>${escapeHtml(media[0]?.label || '图片 1')}</span><span data-gallery-counter aria-live="polite">1 / ${total}</span></div><div class="detail-gallery-dots" role="tablist" aria-label="图片分页">${dots}</div>` : ''}
      </figure>`;
    }
    if (post.kind === 'NORMAL_VIDEO') {
      return `<button class="detail-video" type="button" data-detail-media data-media-label="社团招新说明会回放" aria-label="播放视频"><span class="detail-video-play">▶</span><strong>社团招新说明会回放</strong><small>${escapeHtml(post.video?.duration || '00:00')} · ${escapeHtml(post.video?.status || '可播放')}</small></button>`;
    }
    if (post.kind === 'NORMAL_LINK') {
      return `<a class="detail-link" href="${escapeHtml(post.link?.url || '#')}" data-detail-link><span>↗</span><div><strong>${escapeHtml(post.link?.title || '链接内容')}</strong><small>${escapeHtml(post.link?.domain || '—')}</small></div></a>`;
    }
    return '';
  };

  const renderActivity = (post) => {
    if (post.kind !== 'ACTIVITY' || !post.activity) return '';
    const a = post.activity;
    const progress = Math.min(100, Math.round((a.signed / a.capacity) * 100));
    return `<section class="detail-business detail-business-activity" data-od-id="activity-detail-module">
      <div class="detail-business-heading"><span>${icon.calendar}</span><div><h2>活动</h2><p>${escapeHtml(a.status)} · ${escapeHtml(a.viewerStatus)}</p></div></div>
      <div class="detail-event-lines" aria-label="活动关键信息">
        <div><span>时间</span><strong>${escapeHtml(a.time)}</strong></div>
        <div><span>地点</span><strong>${escapeHtml(a.location)}</strong></div>
        <div><span>资格</span><strong>${escapeHtml(a.eligibility)}</strong></div>
      </div>
      <div class="detail-progress" aria-label="报名进度"><i style="--progress:${progress}%"></i><span>${a.signed} / ${a.capacity} 人</span></div>
      <div class="detail-business-actions"><a class="detail-business-link" href="campus-activity-detail.html?postId=${encodeURIComponent(post.id)}">查看活动详情</a><button class="detail-primary-action" type="button" data-detail-signup>${post.viewerState.capabilities.includes('activity.signup') ? '立即报名' : '查看报名状态'}</button></div>
    </section>`;
  };

  const renderVote = (post) => {
    if (post.kind !== 'VOTE' || !post.vote) return '';
    const v = post.vote;
    const options = v.options.map((option, index) => `<button class="detail-vote-option" type="button" data-detail-vote data-option-index="${index}" aria-pressed="false"><span class="detail-vote-radio"></span><span>${escapeHtml(option.label)}</span><b data-vote-percent>${option.percent ? `${option.percent}%` : '投票后可见'}</b></button>`).join('');
    return `<section class="detail-business detail-business-vote" data-od-id="vote-detail-module">
      <div class="detail-business-heading"><span>${icon.poll}</span><div><h2>投票</h2><p>${escapeHtml(v.deadline)} · ${escapeHtml(v.resultVisibility)}</p></div></div>
      <div class="detail-vote-options" data-detail-vote-group>${options}</div>
      <p class="detail-help">${compactNumber(v.participants)} 人已参与 · 单选 · 提交后不可修改</p>
      <button class="detail-primary-action" type="button" data-detail-vote-submit ${post.viewerState.capabilities.includes('vote.submit') ? '' : 'disabled'}>提交投票</button>
    </section>`;
  };

  const renderChannel = (post) => {
    if (!post.channel) return '';
    return `<a class="detail-channel-source" href="campus-channel-detail.html" aria-label="进入频道 ${escapeHtml(post.channel.name)}">${icon.channel}<span>来自 ${escapeHtml(post.channel.name)}</span>${post.channel.certified ? icon.check : ''}</a>`;
  };

  const renderMetaAndActions = (post, commentTotal) => `<section class="detail-meta"><p>${escapeHtml(post.publishedAt)}</p><div class="detail-action-bar" aria-label="帖子操作"><button type="button" data-detail-like>${icon.heart}<span data-detail-like-count>${compactNumber(post.metrics.like)}</span></button><a href="#comments">${icon.comment}<span>${compactNumber(commentTotal)}</span></a><button type="button" data-detail-share>${icon.share}<span>${compactNumber(post.metrics.repost)}</span></button><button type="button" data-detail-save>${icon.bookmark}<span data-detail-save-count>${compactNumber(post.metrics.favorite)}</span></button><span>${icon.eye}${compactNumber(post.metrics.view)}</span></div></section>`;

  const renderReply = (reply, index) => `<article class="detail-reply" ${index > 0 ? 'hidden data-reply-extra' : ''}>
    <a class="detail-comment-avatar" href="${commentProfileHref(reply)}" aria-label="查看${escapeHtml(reply.name)}的个人主页"><span class="avatar ${escapeHtml(reply.tone)}">${escapeHtml(reply.initial)}</span></a>
    <div><strong><a class="detail-comment-name-link" href="${commentProfileHref(reply)}">${escapeHtml(reply.name)}</a> <em>回复 ${escapeHtml(reply.target)}</em></strong><p>${escapeHtml(reply.text)}</p><div class="detail-reply-tools"><time>${escapeHtml(reply.time)}</time><button type="button" data-detail-reply data-detail-reply-to="${escapeHtml(reply.name)}">回复</button></div></div>
  </article>`;

  const renderComment = (comment) => {
    const extraCount = Math.max(0, comment.replies.length - 1);
    return `<article class="detail-comment" data-comment-id="${escapeHtml(comment.id)}">
      <a class="detail-comment-avatar" href="${commentProfileHref(comment)}" aria-label="查看${escapeHtml(comment.name)}的个人主页"><span class="avatar ${escapeHtml(comment.tone)}">${escapeHtml(comment.initial)}</span></a>
      <div>
        <div class="detail-comment-name"><a class="detail-comment-name-link" href="${commentProfileHref(comment)}"><strong>${escapeHtml(comment.name)}</strong></a><span>${escapeHtml(comment.role)} · ${escapeHtml(comment.time)}</span></div>
        <p>${escapeHtml(comment.text)}</p>
        <div class="detail-comment-tools"><button type="button" data-comment-like>${icon.heart}<span>${comment.likes}</span></button><button type="button" data-detail-reply data-detail-reply-to="${escapeHtml(comment.name)}">回复</button><button type="button" data-thread-collapse>折叠</button></div>
        ${comment.replies.length ? `<div class="detail-comment-replies">${comment.replies.map(renderReply).join('')}${extraCount ? `<button class="detail-thread-toggle" type="button" data-replies-toggle data-expanded="false">展开 ${extraCount} 条回复</button>` : ''}</div>` : ''}
      </div>
    </article>`;
  };

  const renderCommentState = (state, total) => {
    if (state === 'loading') return '<section class="detail-comment-empty" role="status" aria-busy="true"><strong>正在加载评论</strong><span>评论区不会影响正文阅读。</span></section>';
    if (state === 'empty') return '<section class="detail-comment-empty"><strong>还没有评论</strong><span>成为第一个回应的人。</span><button type="button" data-composer-open>写评论</button></section>';
    if (state === 'error') return '<section class="detail-comment-empty" role="alert"><strong>评论暂时无法加载</strong><span>网络连接或评论服务不可用，稍后可重试。</span><button type="button" data-comment-retry>重新加载</button></section>';
    return `<div data-comment-list>${comments.map(renderComment).join('')}<div class="detail-comment-empty"><strong>已展示 ${total} 条相关评论</strong><span>回复默认折叠，展开后仍保持在同一条评论线程内。</span></div></div>`;
  };

  const renderComments = (post, commentState = 'populated') => {
    const replyCount = comments.reduce((sum, item) => sum + item.replies.length, 0);
    const total = Math.max(post.metrics.comment || 0, comments.length + replyCount);
    return `<section class="detail-comments" id="comments" data-od-id="comment-thread">
      <div class="detail-comments-heading"><div><h2>评论 ${compactNumber(total)}</h2></div><button type="button" data-detail-sort>最新</button></div>
      ${renderCommentState(commentState, total)}
    </section>`;
  };

  const renderRestricted = (post) => {
    const missing = post.lifecycle?.state === 'NO_PERMISSION';
    return `<section class="detail-state ${missing ? 'forbidden' : 'deleted'}" data-od-id="post-detail-state"><h1>${missing ? '无法查看此内容' : '原帖已删除'}</h1><p>${missing ? '当前账号不满足该帖的可见范围，正文、媒体和互动统计不会展示。' : '发布者已删除该帖子。内容不再展示，系统仅保留必要的追溯上下文。'}</p><a href="campus-home.html">返回信息流</a></section>`;
  };

  const renderPostDetail = (post, options = {}) => {
    if (isRestricted(post)) return renderRestricted(post);
    const content = post.content || post.summary;
    const paragraphs = String(content.fullText || content.text || '').split('\n\n').filter(Boolean).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
    const topics = (content.topics || []).map((topic) => `<a href="campus-topic-detail.html">#${escapeHtml(topic)}</a>`).join('');
    const replyCount = comments.reduce((sum, item) => sum + item.replies.length, 0);
    const commentTotal = Math.max(post.metrics.comment || 0, comments.length + replyCount);
    const title = content.title ? `<h1>${escapeHtml(content.title)}</h1>` : '';
    return `<article class="detail-article detail-kind-${escapeHtml(post.kind.toLowerCase())}" data-post-kind="${escapeHtml(post.kind)}" data-od-id="post-detail">
      <div class="detail-content">
        ${renderAuthor(post)}
        ${renderLifecycle(post)}
        ${renderMedia(post)}
        <section class="detail-note-body" data-od-id="post-detail-body">${title}<div class="detail-body-copy">${paragraphs}</div>${topics ? `<div class="detail-topics">${topics}</div>` : ''}</section>
        ${renderActivity(post)}
        ${renderVote(post)}
        ${renderChannel(post)}
        ${renderMetaAndActions(post, commentTotal)}
      </div>
      ${renderComments(post, options.commentState)}
    </article>`;
  };

  const renderState = (state) => {
    const states = {
      loading: '<section class="detail-state loading" aria-busy="true"><i></i><i></i><i></i><p>正在加载帖子…</p></section>',
      empty: '<section class="detail-state"><h1>未找到帖子</h1><p>内容可能已被删除，或链接已失效。</p><a href="campus-home.html">返回信息流</a></section>',
      error: '<section class="detail-state"><h1>帖子暂时无法加载</h1><p>网络连接或内容服务暂时不可用。已保留当前链接，可重新尝试。</p><button type="button" data-detail-retry>重新加载</button></section>'
    };
    return states[state] || states.empty;
  };

  window.CampusPostDetail = Object.freeze({ renderPostDetail, renderState, renderCommentState, profileHref });
})();
