(() => {
  const channels = {
    csu: {
      id: 'csu',
      name: '校学生会',
      avatar: '学',
      type: '垂直频道',
      certification: '学生会认证',
      joinRule: '申请审核',
      memberCount: '1,428',
      postCount: '567',
      admins: '7 / 10',
      pending: '4',
      createdAt: '2023-09',
      category: '学生组织',
      owner: '陈老师',
      contact: '周老师 / 138-0000-1208',
      summary: '负责学生事务、志愿服务、活动报名、意见收集和校园公告发布。',
      announcement: '迎新活动志愿者报名今晚 22:00 截止，最终名单与签到说明将在活动帖统一更新。',
      note: '成员通过审核后可发布普通帖；管理员可发布活动和投票。'
    },
    photo: {
      id: 'photo',
      name: '校园摄影',
      avatar: '摄',
      type: '公开频道',
      certification: '未认证',
      joinRule: '直接加入',
      memberCount: '367',
      postCount: '85',
      admins: '4 / 10',
      pending: '1',
      createdAt: '2024-03',
      category: '兴趣社团',
      owner: '江言',
      contact: '摄影协会值班号 / 138-0000-0881',
      summary: '校园活动摄影、作品分享和设备交流，公开展示频道动态。',
      announcement: '毕业季影像征集开放投稿，请在周五前带话题发布，优秀作品会进入频道精选。',
      note: '公开频道支持浏览和直接加入，活动与投票仍需管理员发起。'
    },
    volunteer: {
      id: 'volunteer',
      name: '志愿服务中心',
      avatar: '志',
      type: '垂直频道',
      certification: '学校部门认证',
      joinRule: '申请审核',
      memberCount: '812',
      postCount: '216',
      admins: '6 / 10',
      pending: '0',
      createdAt: '2022-11',
      category: '学校部门',
      owner: '王老师',
      contact: '志愿服务中心办公室 / 138-0000-7712',
      summary: '志愿活动报名、签到、服务时长与外联协作入口。',
      announcement: '本月服务时长证明将在月底统一导出，缺少签到记录请先在活动帖内补充说明。',
      note: '频道成员采用实名展示，活动报名和签到数据保留后台审计。'
    },
    run: {
      id: 'run',
      name: '校园跑步团',
      avatar: '跑',
      type: '公开频道',
      certification: '未认证',
      joinRule: '直接加入',
      memberCount: '584',
      postCount: '129',
      admins: '2 / 10',
      pending: '1',
      createdAt: '2024-04',
      category: '校园兴趣',
      owner: '林舟',
      contact: '跑步团值班号 / 138-0000-2291',
      summary: '晨跑招募、路线分享、打卡挑战和赛事通知。',
      announcement: '本周六晨跑集合点改为西操场看台入口，迟到 10 分钟后不再等待。',
      note: '公开频道，支持浏览与直接加入；高频活动内容由管理员置顶。'
    }
  };

  const roles = {
    admin: {
      id: 'admin',
      label: '频道管理员',
      note: '可处理成员、内容、发布权限和频道资料；不可转让创建者或申请解散频道。'
    },
    creator: {
      id: 'creator',
      label: '频道创建者',
      note: '拥有该频道全部权限，并额外拥有转让创建者和申请解散频道两项高危权限。'
    },
    platform: {
      id: 'platform',
      label: '平台总管理员',
      note: '无需加入频道即可管理所有频道，拥有全部设置页和审计能力。'
    }
  };

  const applications = [
    {
      id: 'join-1',
      channelId: 'csu',
      kind: '入群申请',
      status: '待处理',
      applicant: '罗雨薇',
      title: '宣传组入群申请',
      summary: '软件工程 2024 级，希望参与迎新活动执行与文案发布。',
      detail: '已完成实名认证和资料完善，无违规记录。申请说明中附带过往公众号排版与摄影经历。',
      tags: ['申请原因完整', '无违规记录', '宣传组']
    },
    {
      id: 'report-1',
      channelId: 'csu',
      kind: '内容举报',
      status: '需复核',
      applicant: '匿名举报',
      title: '迎新志愿者报名提醒',
      summary: '举报正文中的报名截止时间与置顶公告不一致。',
      detail: '需要结合置顶公告、帖子正文和评论区问询一起核对。处理动作进入帖子审核详情页完成。',
      tags: ['帖子举报', '时间冲突', '需看正文']
    },
    {
      id: 'cert-1',
      channelId: 'csu',
      kind: '认证补件',
      status: '补件中',
      applicant: '陈老师',
      title: '学生会认证材料补充',
      summary: '平台要求补齐盖章授权页和指导老师联系方式。',
      detail: '补件完成后进入平台复核，认证结果会影响前台认证标识和默认视频发布模板。',
      tags: ['认证主体', '盖章授权', '联系人']
    }
  ];

  const tickets = {
    'join-1': {
      id: 'join-1',
      channelId: 'csu',
      kind: '入群申请',
      status: '待处理',
      title: '罗雨薇 · 宣传组入群申请',
      summary: '软件工程 2024 级，希望参与迎新活动执行与文案发布。',
      detail: '已完成实名认证，过去无违规记录。申请说明包含以往公众号排版、活动摄影和迎新现场执行经历。',
      fields: [
        ['申请人', '罗雨薇 · 软件工程 2024 级'],
        ['目标分组', '宣传组'],
        ['申请原因', '参与迎新活动执行与文案发布，负责海报、公众号和现场拍摄。'],
        ['实名状态', '已完成实名认证'],
        ['历史记录', '过去 180 天无违规记录']
      ],
      primary: '通过申请',
      secondary: '拒绝并填写原因'
    },
    'join-2': {
      id: 'join-2',
      channelId: 'csu',
      kind: '入群申请',
      status: '补充说明',
      title: '乔语 · 运营组入群申请',
      summary: '申请理由过于简短，缺少学院、时间安排与过往活动经历。',
      detail: '适合先要求补充材料，而不是直接拒绝。补充后仍由管理员再次判断。',
      fields: [
        ['申请人', '乔语 · 数媒学院'],
        ['当前问题', '申请原因仅写“想加入学生会”'],
        ['缺少字段', '学院、可参与时间、过往活动经历'],
        ['实名状态', '已完成实名认证']
      ],
      primary: '要求补充',
      secondary: '直接拒绝'
    },
    'cert-1': {
      id: 'cert-1',
      channelId: 'csu',
      kind: '认证补件',
      status: '补件中',
      title: '学生会认证材料补充',
      summary: '平台要求补齐盖章授权页和指导老师联系方式。',
      detail: '补件完成后进入平台复核，认证结果会影响前台认证标识和视频发布默认模板。',
      fields: [
        ['认证主体', '校学生会'],
        ['缺少材料', '盖章授权页、指导老师联系方式'],
        ['当前联系人', '周老师 / 138-0000-1208'],
        ['最近处理', '平台管理员要求 48 小时内补齐']
      ],
      primary: '提交平台复核',
      secondary: '继续补件'
    }
  };

  const reviewCases = [
    {
      id: 'content-1',
      channelId: 'csu',
      postId: 'spec-student-normal_text',
      status: '待审核',
      title: '迎新志愿者报名提醒',
      author: '苏澜',
      excerpt: '下周迎新志愿者报名开启，服务时段覆盖 6 月 27 日到 6 月 28 日。',
      report: '正文中的截止时间与频道置顶公告不一致，需要进入帖子审核详情页核正文与附件。',
      evidence: ['正文写“6 月 24 日截止”', '置顶公告写“6 月 22 日截止”', '评论区已有 3 条追问'],
      tags: ['普通帖', '3 张图片', '同步公共信息流']
    },
    {
      id: 'content-2',
      channelId: 'csu',
      postId: 'spec-channel_admin-activity',
      status: '举报中',
      title: '毕业晚会志愿者现场签到安排',
      author: '苏澜',
      excerpt: '活动帖包含报名人数、签到时间和现场分工说明。',
      report: '举报人认为报名时间与活动页公告冲突，需要复核活动规则和报名状态。',
      evidence: ['活动卡片时间 6 月 28 日 14:00-17:00', '置顶公告写 6 月 27 日 18:00 截止', '已有 144 人报名'],
      tags: ['活动帖', '报名中', '管理员发布']
    },
    {
      id: 'content-3',
      channelId: 'csu',
      postId: 'spec-channel_creator-vote',
      status: '置顶建议',
      title: '图书馆期末周是否延长开放至 23:00？',
      author: '陈老师',
      excerpt: '投票帖，结果设置为“投票后可见”，评论区反馈活跃。',
      report: '当前无举报，但需要判断是否置顶到频道首页和同步公告区。',
      evidence: ['已投票人数 1000+', '评论区 47 条反馈', '结果可见性：投票后可见'],
      tags: ['投票帖', '已通过', '可置顶']
    }
  ];

  const memberRows = [
    {
      id: 'member-1',
      channelId: 'csu',
      name: '陈老师',
      role: '创建者',
      note: '计算机学院团委老师 · 可任命管理员、转让创建者、申请解散频道',
      badge: '创建者'
    },
    {
      id: 'member-2',
      channelId: 'csu',
      name: '苏澜',
      role: '管理员',
      note: '文体部 · 可审批成员、处理内容、发布活动与投票',
      badge: '管理员'
    },
    {
      id: 'member-3',
      channelId: 'csu',
      name: '陆清禾',
      role: '成员',
      note: '志愿服务部成员 · 当前可发布普通帖与评论',
      badge: '成员'
    }
  ];

  const auditRows = [
    {
      title: '林墨通过入群申请',
      detail: '对象：罗雨薇 · 结果：建立成员关系 · 2026-06-21 10:12'
    },
    {
      title: '江言处理内容举报',
      detail: '对象：迎新志愿者报名提醒 · 结果：保留内容并要求补充说明 · 2026-06-20 17:04'
    },
    {
      title: '陈老师调整加入规则',
      detail: '变更：直接加入 → 申请审核 · 原因：迎新期间成员核验 · 2026-06-18 09:30'
    }
  ];

  const getContext = (search = window.location.search) => {
    const params = new URLSearchParams(search);
    const channelId = params.get('channelId') || 'csu';
    const roleId = params.get('role') || 'admin';
    return {
      channelId,
      roleId,
      channel: channels[channelId] || channels.csu,
      role: roles[roleId] || roles.admin
    };
  };

  const getTicket = (ticketId) => tickets[ticketId] || tickets['join-1'];

  const getReviewCase = (caseId) => reviewCases.find((item) => item.id === caseId) || reviewCases[0];

  const applyContext = (root = document, ctx = getContext()) => {
    root.querySelectorAll('[data-channel-name]').forEach((node) => { node.textContent = ctx.channel.name; });
    root.querySelectorAll('[data-channel-avatar]').forEach((node) => { node.textContent = ctx.channel.avatar; });
    root.querySelectorAll('[data-channel-type]').forEach((node) => { node.textContent = ctx.channel.type; });
    root.querySelectorAll('[data-channel-certification]').forEach((node) => { node.textContent = ctx.channel.certification; });
    root.querySelectorAll('[data-channel-cert-badge]').forEach((node) => {
      node.dataset.certBadge = ctx.channel.certification;
      node.setAttribute('aria-label', ctx.channel.certification);
    });
    root.querySelectorAll('[data-channel-join-rule]').forEach((node) => { node.textContent = ctx.channel.joinRule; });
    root.querySelectorAll('[data-channel-members]').forEach((node) => { node.textContent = ctx.channel.memberCount; });
    root.querySelectorAll('[data-channel-post-count]').forEach((node) => { node.textContent = ctx.channel.postCount; });
    root.querySelectorAll('[data-channel-admins]').forEach((node) => { node.textContent = ctx.channel.admins; });
    root.querySelectorAll('[data-channel-pending]').forEach((node) => { node.textContent = ctx.channel.pending; });
    root.querySelectorAll('[data-channel-created]').forEach((node) => { node.textContent = ctx.channel.createdAt || '2023-09'; });
    root.querySelectorAll('[data-channel-category]').forEach((node) => { node.textContent = ctx.channel.category; });
    root.querySelectorAll('[data-channel-owner]').forEach((node) => { node.textContent = ctx.channel.owner; });
    root.querySelectorAll('[data-channel-contact]').forEach((node) => { node.textContent = ctx.channel.contact; });
    root.querySelectorAll('[data-channel-summary]').forEach((node) => { node.textContent = ctx.channel.summary; });
    root.querySelectorAll('[data-channel-announcement]').forEach((node) => { node.textContent = ctx.channel.announcement || ''; });
    root.querySelectorAll('[data-channel-note]').forEach((node) => { node.textContent = ctx.channel.note; });
    root.querySelectorAll('[data-role-label]').forEach((node) => { node.textContent = ctx.role.label; });
    root.querySelectorAll('[data-role-note]').forEach((node) => { node.textContent = ctx.role.note; });

    root.querySelectorAll('[data-channel-link]').forEach((node) => {
      const href = node.getAttribute('data-channel-link');
      if (!href) return;
      const target = `${href}?channelId=${ctx.channelId}&role=${ctx.roleId}`;
      if (node.tagName === 'A') {
        node.setAttribute('href', target);
      } else {
        node.setAttribute('data-nav', target);
      }
    });

    root.querySelectorAll('[data-review-link]').forEach((node) => {
      const caseId = node.getAttribute('data-review-link');
      if (!caseId) return;
      const target = `campus-post-review.html?channelId=${ctx.channelId}&role=${ctx.roleId}&case=${caseId}`;
      if (node.tagName === 'A') {
        node.setAttribute('href', target);
      } else {
        node.setAttribute('data-nav', target);
      }
    });

    root.querySelectorAll('[data-ticket-link]').forEach((node) => {
      const ticketId = node.getAttribute('data-ticket-link');
      if (!ticketId) return;
      const target = `campus-channel-ticket-detail.html?channelId=${ctx.channelId}&role=${ctx.roleId}&ticket=${ticketId}`;
      if (node.tagName === 'A') {
        node.setAttribute('href', target);
      } else {
        node.setAttribute('data-nav', target);
      }
    });

    root.querySelectorAll('[data-required-roles]').forEach((node) => {
      const required = (node.getAttribute('data-required-roles') || '')
        .split(/\s+/)
        .map((item) => item.trim())
        .filter(Boolean);
      if (!required.length) return;
      node.hidden = !required.includes(ctx.roleId);
    });
    window.CampusUI?.hydrateCertificationBadges?.(root);
  };

  window.CampusChannelAdminData = {
    channels,
    roles,
    applications,
    tickets,
    reviewCases,
    memberRows,
    auditRows,
    getContext,
    getTicket,
    getReviewCase,
    applyContext
  };
})();
