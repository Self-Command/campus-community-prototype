(() => {
  const templates = {
    NORMAL_TEXT: {
      title: '关于图书馆自习区静音提示的建议',
      summary: '晚间高峰时段，靠近打印区的讨论声会影响自习。建议明确静音区与讨论区的边界，并在入口提示。',
      fullText: '晚间高峰时段，靠近打印区的讨论声会影响自习。建议明确静音区与讨论区的边界，并在入口提示。\n\n我观察到很多同学并非有意打扰，而是不清楚哪里可以讨论。若能在入口、打印区和楼层导视中同步提示，再保留一个可短时交流的区域，既能减少冲突，也能让需要讨论的同学有明确去处。',
      topics: ['校园建议', '图书馆']
    },
    NORMAL_GALLERY: {
      title: '从南门到湖边的无障碍通行路线',
      summary: '把坡道、低台阶和临时施工围挡标在图里，第一次来校园的同学可按这条路线通行。',
      fullText: '把坡道、低台阶和临时施工围挡标在图里，第一次来校园的同学可按这条路线通行。\n\n路线从南门开始，依次经过行政楼东侧坡道、主图书馆外环道和湖边连廊。施工路段会随进度调整，建议出发前留意当日公告。',
      topics: ['校园生活', '无障碍'],
      media: ['南门入口', '行政楼坡道', '图书馆外环', '湖边连廊', '施工绕行', '终点导视', '休息点', '夜间照明', '紧急求助点', '备用路线']
    },
    NORMAL_LINK: {
      title: '本周校园学术讲座时间汇总',
      summary: '按院系和地点整理了本周公开讲座入口；报名、座位和临时变更以院系公告为准。',
      fullText: '按院系和地点整理了本周公开讲座入口；报名、座位和临时变更以院系公告为准。\n\n建议在参加前打开来源页确认门禁与入场要求。页面只做索引，不替代主办方通知。',
      topics: ['学术活动', '讲座'],
      link: { title: '校内学术活动日历', domain: 'academic.example.edu.cn', url: '#' }
    },
    NORMAL_VIDEO: {
      title: '社团招新说明会回放与问题汇总',
      summary: '包含报名条件、面试安排和常见问题。视频只在认证频道内发布，观看范围由频道规则决定。',
      fullText: '包含报名条件、面试安排和常见问题。视频只在认证频道内发布，观看范围由频道规则决定。\n\n回放中已标记报名截止时间和咨询入口；如规则变更，以频道置顶公告为准。',
      topics: ['社团招新', '说明会'],
      video: { duration: '18:42', status: '认证频道视频' }
    },
    ACTIVITY: {
      title: '毕业季旧物交换：把闲置物品留在校园',
      summary: '面向全校同学开放。请提前准备需要交换的物品，现场可登记捐赠去向。',
      fullText: '面向全校同学开放。请提前准备需要交换的物品，现场可登记捐赠去向。\n\n报名成功后会收到入场提醒。候补、取消和签到规则以本活动页面的实时状态为准。',
      topics: ['毕业季', '旧物交换'],
      activity: { time: '6 月 28 日 14:00–17:00', location: '大学生活动中心一楼', signed: 0, capacity: 200, status: '报名中', viewerStatus: '未报名', eligibility: '全校学生、教职工均可报名' }
    },
    VOTE: {
      title: '图书馆期末周是否延长开放至 23:00？',
      summary: '请在截止前投出你的选择，结果将作为开放时间调整的参考意见。',
      fullText: '请在截止前投出你的选择，结果将作为开放时间调整的参考意见。\n\n这是单选投票。MVP 规则为投票提交后不可修改；结果是否可见遵循本投票的结果可见范围。',
      topics: ['期末周', '图书馆'],
      vote: { deadline: '距截止还有 2 天', participants: 0, status: '进行中', allowChange: false, resultVisibility: '投票后可见', options: [{ label: '支持延长', percent: 0 }, { label: '维持现状', percent: 0 }, { label: '希望 24 小时开放', percent: 0 }] }
    }
  };

  const profiles = [
    { key: 'STUDENT_MEMBER', label: '学生（MEMBER）', initial: '林', avatarTone: 'warm', displayName: '林间月', role: '学生', gender: '♀', metaLine: '计算机学院 · 软件工程 · 18 分钟前', channel: '校园生活', allowedKinds: ['NORMAL_TEXT', 'NORMAL_GALLERY', 'NORMAL_LINK'] },
    { key: 'FACULTY_MEMBER', label: '教职工（MEMBER）', initial: '周', avatarTone: 'green', displayName: '周若晴', role: '老师', gender: '♀', metaLine: '计算机学院 · 副教授 · 26 分钟前', channel: '教学交流', allowedKinds: ['NORMAL_TEXT', 'NORMAL_GALLERY', 'NORMAL_LINK'] },
    { key: 'STAFF_MEMBER', label: '后勤工作人员（MEMBER）', initial: '严', avatarTone: 'blue', displayName: '严师傅', role: '工作人员', gender: '♂', metaLine: '后勤保障处 · 维修岗 · 38 分钟前', channel: '校园服务', allowedKinds: ['NORMAL_TEXT', 'NORMAL_GALLERY', 'NORMAL_LINK'] },
    { key: 'CHANNEL_MEMBER', label: '普通频道成员（CHANNEL_MEMBER）', initial: '沈', avatarTone: 'violet', displayName: '雾岛同学', role: '学生', gender: '♂', metaLine: '建筑学院 · 城乡规划 · 1 小时前', channel: '建筑社', channelTitle: '成员', visibility: 'CHANNEL_ONLY', allowedKinds: ['NORMAL_TEXT', 'NORMAL_GALLERY', 'NORMAL_LINK'] },
    { key: 'CERTIFIED_CHANNEL_MEMBER', label: '认证频道成员（CHANNEL_MEMBER）', initial: '陆', avatarTone: 'green', displayName: '陆清禾', role: '学生', gender: '♀', metaLine: '校学生会 · 志愿服务部 · 1 小时前', channel: '校学生会', channelTitle: '志愿服务部成员', verified: { type: '学生会', label: '校学生会' }, allowedKinds: ['NORMAL_TEXT', 'NORMAL_GALLERY', 'NORMAL_LINK', 'NORMAL_VIDEO'] },
    { key: 'CHANNEL_ADMIN', label: '认证频道管理员（CHANNEL_ADMIN）', initial: '苏', avatarTone: 'blue', displayName: '苏澜', role: '学生', gender: '♀', metaLine: '校学生会 · 文体部 · 2 小时前', channel: '校学生会', channelTitle: '文体部管理员', verified: { type: '学生会', label: '校学生会' }, allowedKinds: ['NORMAL_TEXT', 'NORMAL_GALLERY', 'NORMAL_LINK', 'NORMAL_VIDEO', 'ACTIVITY', 'VOTE'] },
    { key: 'CHANNEL_CREATOR', label: '认证频道创建者（CHANNEL_CREATOR）', initial: '陈', avatarTone: 'warm', displayName: '陈老师', role: '老师', gender: '♂', metaLine: '学生工作处 · 辅导员 · 2 小时前', channel: '学生事务中心', channelTitle: '频道创建者', verified: { type: '学院/学校部门', label: '学生工作处' }, allowedKinds: ['NORMAL_TEXT', 'NORMAL_GALLERY', 'NORMAL_LINK', 'NORMAL_VIDEO', 'ACTIVITY', 'VOTE'] },
    { key: 'PLATFORM_ADMIN', label: '平台管理员（PLATFORM_ADMIN）', initial: '校', avatarTone: 'blue', displayName: '校园社区运营', role: '管理员', gender: '', metaLine: '校园社区平台 · 内容治理 · 3 小时前', channel: '校园社区官方', channelTitle: '平台管理员', verified: { type: '学院/学校部门', label: '校园社区官方' }, allowedKinds: ['NORMAL_TEXT', 'NORMAL_GALLERY', 'NORMAL_LINK', 'NORMAL_VIDEO', 'ACTIVITY', 'VOTE'] }
  ];

  const mediaFrom = (items = []) => items.map((label, index) => ({ label, tone: ['','alt','violet','warm'][index % 4] }));
  const makePost = (profile, kind, index) => {
    const source = templates[kind];
    const isNormal = kind.startsWith('NORMAL_');
    const postType = isNormal ? 'NORMAL' : kind;
    const contentVariant = isNormal ? kind.replace('NORMAL_', '') : null;
    const capabilities = ['post.comment', 'post.repost', 'post.favorite'];
    if (kind === 'ACTIVITY') capabilities.push('activity.signup', 'activity.remind');
    if (kind === 'VOTE') capabilities.push('vote.submit');
    const activity = source.activity ? { ...source.activity, signed: 24 + index, viewerStatus: index % 2 ? '未报名' : '已设提醒' } : undefined;
    const vote = source.vote ? { ...source.vote, participants: 82 + index, options: source.vote.options.map((item, optionIndex) => ({ ...item, percent: [62, 23, 15][optionIndex] })) } : undefined;
    return {
      id: `spec-${profile.key.toLowerCase()}-${kind.toLowerCase()}`,
      specimen: { profileKey: profile.key, profileLabel: profile.label, kind },
      kind,
      postType,
      contentVariant,
      groups: ['specimen', profile.key.toLowerCase()],
      author: { profileId: profile.key, initial: profile.initial, avatarTone: profile.avatarTone },
      displayIdentity: { displayName: profile.displayName, role: profile.role, gender: profile.gender, metaLine: profile.metaLine, verified: profile.verified || null, channelTitle: profile.channelTitle || null },
      lifecycle: { state: 'APPROVED' },
      visibility: profile.visibility || 'PUBLIC',
      summary: { title: source.title, text: source.summary, topics: source.topics },
      content: { title: source.title, summary: source.summary, fullText: source.fullText, topics: source.topics },
      media: source.media ? mediaFrom(source.media) : [],
      link: source.link,
      video: source.video,
      activity,
      vote,
      channel: { name: profile.channel, certified: Boolean(profile.verified) },
      publishedAt: '2026-06-21 10:30',
      metrics: { like: index, comment: index % 5, repost: 0, favorite: index % 3, view: 20 + index },
      viewerState: { liked: false, favorited: false, capabilities }
    };
  };

  const all = profiles.flatMap((profile) => profile.allowedKinds.map((kind, index) => makePost(profile, kind, index + 1)));
  const byId = Object.fromEntries(all.map((post) => [post.id, post]));
  Object.assign(byId, {
    'post-campus-photo-01': all.find((post) => post.id === 'spec-student_member-normal_gallery'),
    'post-activity-01': all.find((post) => post.id === 'spec-channel_admin-activity'),
    'post-vote-01': all.find((post) => post.id === 'spec-channel_creator-vote')
  });
  const stateExamples = [
    { id: 'state-pending', baseId: all[0].id, state: 'PENDING', reason: '等待内容审核结果' },
    { id: 'state-rejected', baseId: all[1].id, state: 'REJECTED', reason: '图片说明需要补充来源' },
    { id: 'state-deleted', baseId: all[2].id, state: 'DELETED', reason: '发布者已删除内容' },
    { id: 'state-forbidden', baseId: all[3].id, state: 'NO_PERMISSION', reason: '当前用户不在内容可见范围内' }
  ].map((sample) => ({ ...byId[sample.baseId], id: sample.id, lifecycle: { state: sample.state, reason: sample.reason }, specimen: { profileLabel: '页面状态样本', kind: sample.state } }));

  window.CampusPostFixtures = Object.freeze({ all, byId: { ...byId, ...Object.fromEntries(stateExamples.map((post) => [post.id, post])) }, profiles, stateExamples });
})();
