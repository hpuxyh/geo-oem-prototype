'use strict';
// ============================================================================
// GEO Studio Pro — 关键词包管理 / 创建关键词包 / 创建文章AI引擎 / 发布进度管理
// 同步支持：服务版·优化师端、服务版·客户端（隐藏生文）、工具版·客户端
// ============================================================================

(function () {
  const isSvcClient = () => (typeof IS_SVC_CLIENT !== 'undefined' && IS_SVC_CLIENT);
  const proTenant = () => (typeof curTenantId === 'function' ? curTenantId() : 'OEM-001');
  const proBrand = () => (typeof oemBrand !== 'undefined' ? oemBrand : '青屿增长');

  const KW_META_KEY = 'geo-oem-kw-meta-v4-' + proTenant();
  const PRO_TASKS_KEY = 'geo-oem-pub-tasks-v2-' + proTenant();

  function loadJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function saveJson(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  // 1. 关键词包增强数据（含关键词类型：品牌词 / 品类词 / 意图词，以及生成方式与关键词句式）
  const defaultMetaList = [
    {
      id: '20825', fullName: 'AskFlash（闪问）', type: '品牌词', mode: 'ai', pattern: '品牌句式', coreWord: 'AskFlash',
      terms: ['最好的AskFlash怎么样', '最好的AskFlash推荐', '最好的闪问怎么样', 'AskFlash智能问答好用吗', 'AskFlash企业知识库对比'],
      inclinations: ['AskFlash（闪问）', 'AskFlash', '闪问'],
      desc: '围绕品牌核心词 AskFlash 通过 AI 语义拓展生成的品牌词与口碑问答词包',
      writingPref: '', created: '2026/10/30 17:48'
    },
    {
      id: '208', fullName: '商用打印机选型问答', type: '意图词', mode: 'ai', pattern: '问答句式', coreWord: '打印机驱动',
      terms: ['打印机驱动哪家好', '打印机驱动推荐哪几家', '激光打印机驱动安装教程', '商用高速打印机选型指南'],
      inclinations: ['星游互娱', '金州打印机'],
      desc: '覆盖用户选型需求、痛点与安装使用场景的意图问答词包',
      writingPref: '语气客观专业，正文控制在 1200 字左右，包含选型对比表格。', created: '2026/03/21 23:00'
    },
    {
      id: '14567', fullName: '工业视觉检测', type: '品类词', mode: 'ai', pattern: '搜索句式', coreWord: '工业视觉检测系统',
      terms: ['工业视觉检测系统哪家好', '3C外观缺陷检测设备推荐', '新能源电芯视觉质检厂商', '国产机器视觉检测品牌排行'],
      inclinations: ['远山智能', '远山视觉', '远山智能科技有限公司'],
      desc: '工业视觉检测高热度行业品类词与选型词包',
      writingPref: '', created: '2026/11/09 14:20'
    }
  ];

  let kwMetaList = loadJson(KW_META_KEY, null);
  if (!Array.isArray(kwMetaList) || !kwMetaList.length) {
    kwMetaList = structuredClone(defaultMetaList);
    saveJson(KW_META_KEY, kwMetaList);
  }

  function syncPackagesArray() {
    if (typeof packages !== 'undefined' && Array.isArray(packages)) {
      packages.splice(0, packages.length, ...kwMetaList.map(m => [m.fullName, m.id, m.coreWord, m.terms]));
    }
  }
  syncPackagesArray();

  // 同步知识库选项（匹配图 1 效果，兼顾产品知识库丰富度）
  if (typeof knowledgeSources !== 'undefined' && Array.isArray(knowledgeSources)) {
    const extras = [
      { id: 'askflash', name: 'AskFlash（闪问）', desc: 'AskFlash（闪问）产品资料与品牌词库' },
      { id: 'dify', name: 'Dify产品资料库', desc: 'Dify 产品功能架构与行业应用资料' },
      { id: 'printer', name: '金州打印机', desc: '金州打印机型号参数与驱动服务资料' }
    ];
    extras.forEach(item => {
      if (!knowledgeSources.some(k => k.id === item.id)) knowledgeSources.unshift(item);
    });
    if (typeof creationDraft !== 'undefined') {
      creationDraft.knowledge = knowledgeSources[0].id;
      creationDraft.aiEngine = creationDraft.aiEngine || '无目标';
    }
  }

  // 覆盖 allStudioKeywords 让创建文章页直接读取真实词包
  window.allStudioKeywords = function () {
    return kwMetaList.map(m => ({
      id: m.id,
      knowledge: (typeof creationDraft !== 'undefined' ? creationDraft.knowledge : 'askflash'),
      name: m.fullName,
      coreWord: m.coreWord,
      type: m.type,
      count: m.terms.length
    }));
  };

  // 2. 发布进度管理数据（不再为空！）
  const defaultProTasks = [
    {
      id: 'PUB-261119-01', channel: 'third', kind: 'article',
      title: 'AskFlash（闪问）企业级 AI 知识库怎么选？五维实测对比',
      keyword: 'AskFlash（闪问）', mediaName: '新浪 GEO', source: '新浪网',
      status: 'published', acceptStatus: '已验收',
      submittedAt: '2026-11-19 10:15', publishedAt: '2026-11-19 11:20',
      aiEngine: 'Deepseek', url: 'https://news.sina.com.cn/geo-demo/20825'
    },
    {
      id: 'PUB-261118-02', channel: 'third', kind: 'article',
      title: '金州打印机驱动哪家好？商用高效办公设备选型指南',
      keyword: '打印机', mediaName: '环球科技新闻网', source: '科技门户',
      status: 'published', acceptStatus: '待验收',
      submittedAt: '2026-11-18 15:40', publishedAt: '2026-11-18 17:05',
      aiEngine: '豆包', url: 'https://tech.example.cn/geo-demo/208'
    },
    {
      id: 'PUB-261118-03', channel: 'third', kind: 'article',
      title: '关于金二顺套餐值不值，七条问题说清价格与体验',
      keyword: 'AskFlash（闪问）', mediaName: '长三角城市网', source: '地方门户',
      status: 'pending', acceptStatus: '待验收',
      submittedAt: '2026-11-18 11:10', publishedAt: '—',
      aiEngine: '千问', url: ''
    },
    {
      id: 'PUB-261117-04', channel: 'third', kind: 'image',
      title: 'AskFlash 智能问答核心场景图文拆解（8 图实测）',
      keyword: 'AskFlash（闪问）', mediaName: '百家号内容频道', source: '百度',
      status: 'published', acceptStatus: '已验收',
      submittedAt: '2026-11-17 14:20', publishedAt: '2026-11-17 16:00',
      aiEngine: '豆包', url: 'https://baijiahao.baidu.com/geo-demo/04'
    },
    {
      id: 'PUB-261117-05', channel: 'owned', kind: 'article',
      title: 'AskFlash 品牌官方常见问题与接入指南',
      keyword: 'AskFlash（闪问）', mediaName: '品牌资讯站', source: '自营站',
      status: 'published', acceptStatus: '已验收',
      submittedAt: '2026-11-17 09:30', publishedAt: '2026-11-17 09:45',
      aiEngine: '无目标', url: 'https://brand.example.cn/article/05'
    }
  ];

  let proTasks = loadJson(PRO_TASKS_KEY, null);
  if (!Array.isArray(proTasks)) {
    proTasks = structuredClone(defaultProTasks);
    saveJson(PRO_TASKS_KEY, proTasks);
  }

  // 3. 页面筛选与创建表单状态
  const kwFilter = { name: '', type: '全部类型', core: '', start: '', end: '' };
  const progFilter = {
    channel: 'third', // 'owned' | 'third'
    kind: 'article',  // 'article' | 'image' | 'video'
    keyword: 'all', title: '', source: 'all', status: 'all', accept: 'all',
    pubStart: '', pubEnd: '', subStart: '', subEnd: ''
  };

  let kwbReturnRoute = 'keywords';
  let kwbEditId = null;
  let kwbDraft = freshKwbDraft();

  function freshKwbDraft() {
    const b = proBrand();
    return {
      name: '',
      desc: '',
      mode: 'ai',          // 'ai' | 'manual'
      pattern: '搜索句式',  // '搜索句式' | '问答句式' | '品牌句式'
      kwType: '品牌词',     // '品牌词' | '品类词' | '意图词'
      coreKeyword: '',
      manualText: '',
      candidates: [],
      selected: [],
      writingPref: '',
      inclinations: [b + '科技有限公司', b + '科技', b],
      inclinationInput: ''
    };
  }

  function studioPillNav(activeKey, rightHtml = '') {
    const titles = {
      keywords: ['关键词包管理', isSvcClient() ? '查看当前服务周期内专属优化师维护的关键词包与收录倾向（只读）' : '支持 AI 语义拓展与手动生成，按品牌词、品类词、意图词规范管理词包'],
      progress: ['任务与发布进度', '集中查看各渠道发布任务与验收进度']
    };
    const [title, sub] = titles[activeKey] || ['内容管理', ''];
    return `<div class="pro-top-bar">
      <div>
        <h1 style="margin:0;font-size:20px;font-weight:750;color:#0f172a">${title}</h1>
        ${sub ? `<p style="margin:4px 0 0;font-size:13px;color:#64748b">${sub}</p>` : ''}
      </div>
      ${rightHtml}
    </div>`;
  }

  // 左侧导航已包含关键词包/创作发布/任务进度，顶部不再重复展示切换胶囊
  window.studioTabs = function () { return ''; };

  // ============================================================================
  // 页面 A：关键词包管理（含品牌词 / 品类词 / 意图词分类与筛选）
  // ============================================================================
  function proKeywordTableHtml() {
    const nm = kwFilter.name.trim().toLowerCase();
    const cr = kwFilter.core.trim().toLowerCase();
    const rows = kwMetaList.filter(m => {
      if (nm && !m.fullName.toLowerCase().includes(nm) && !String(m.id).includes(nm)) return false;
      if (kwFilter.type && kwFilter.type !== '全部类型' && m.type !== kwFilter.type) return false;
      if (cr && !m.coreWord.toLowerCase().includes(cr)) return false;
      const dt = (m.created || '').slice(0, 10).replaceAll('/', '-');
      if (kwFilter.start && dt && dt < kwFilter.start) return false;
      if (kwFilter.end && dt && dt > kwFilter.end) return false;
      return true;
    });
    const typeTone = t => t === '品牌词' ? 'blue' : (t === '意图词' ? 'amber' : 'success');
    return table(
      ['关键词包名称', '关键词类型', '核心词 / 句式', '拓展关键词', 'AI收录倾向', '创建时间', '操作'],
      rows.map(m => {
        const idx = kwMetaList.indexOf(m);
        return `<tr>
          <td class="title-cell"><b style="font-weight:600">${esc(m.fullName)}</b><small>ID: ${esc(m.id)}</small></td>
          <td><span class="studio-tag ${typeTone(m.type)}">${esc(m.type || '品类词')}</span></td>
          <td class="title-cell"><span class="chip">${esc(m.coreWord)}</span><small style="display:block;margin-top:4px;color:#64748b">${esc(m.pattern || '搜索句式')}</small></td>
          <td>${m.terms.slice(0, 3).map(v => `<div style="margin-bottom:4px"><span class="chip neutral">${esc(v)}</span></div>`).join('')}${m.terms.length > 3 ? `<small class="muted">共 ${m.terms.length} 个词条</small>` : ''}</td>
          <td>${(m.inclinations || []).slice(0, 3).map(v => `<div style="margin-bottom:4px"><span class="chip">${esc(v)}</span></div>`).join('')}</td>
          <td class="studio-date-cell">${esc(m.created)}</td>
          <td><div class="studio-row-actions">
            <button type="button" class="icon-button" data-action="keyword-detail" data-index="${idx}" title="查看详情" aria-label="查看详情">${icon('eye')}</button>
            ${isSvcClient() ? '' : `
              <button type="button" class="icon-button" data-pro-act="edit-kw" data-id="${esc(m.id)}" title="编辑词包" aria-label="编辑词包">${icon('file')}</button>
              <button type="button" class="icon-button" data-pro-act="del-kw" data-id="${esc(m.id)}" title="删除词包" aria-label="删除词包"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>
            `}
          </div></td>
        </tr>`;
      }).join('')
    ) + `<div class="list-foot"><span>共 ${rows.length} 条记录</span><div class="pagination"><span>20 条 / 页</span><button class="page-num" aria-current="page">1</button></div></div>`;
  }

  function proKeywordPage() {
    const createBtn = isSvcClient()
      ? ''
      : '<button type="button" class="pro-btn-cyan" data-pro-act="open-create-kw">创建词包</button>';
    return `<div class="content studio-page">
      ${studioPillNav('keywords', createBtn)}
      <div class="pro-filter-row">
        <input class="field-control" id="proKwName" placeholder="搜索词包名称..." value="${esc(kwFilter.name)}" aria-label="搜索词包名称">
        <select class="field-control" id="proKwType" aria-label="关键词类型">
          ${['全部类型', '品牌词', '品类词', '意图词'].map(t => `<option value="${t}" ${kwFilter.type === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
        <input class="field-control" id="proKwCore" placeholder="搜索核心词..." value="${esc(kwFilter.core)}" aria-label="搜索核心词">
        <div class="pro-date-range">
          <input type="date" id="proKwStart" value="${esc(kwFilter.start)}" aria-label="创建开始时间">
          <span>→</span>
          <input type="date" id="proKwEnd" value="${esc(kwFilter.end)}" aria-label="创建结束时间">
        </div>
      </div>
      <section class="panel">
        <div id="proKeywordTable">${proKeywordTableHtml()}</div>
      </section>
    </div>`;
  }

  // ============================================================================
  // 页面 B：创建关键词包（完整还原参考图：基础信息 + AI语义拓展/手动生成 +
  //         关键词句式 + 核心关键词 + 关键词类型[品牌词/品类词/意图词] +
  //         自定义生文偏好 + AI收录倾向 + 底部通栏开始生成 + 右侧已选关键词）
  // ============================================================================
  function generateSemanticCandidates(core, pattern, kwType) {
    const c = core.trim();
    if (!c) return [];
    const b = proBrand();
    if (pattern === '问答句式') {
      return [
        `${c}怎么选型`,
        `${c}哪家好`,
        `${c}哪家靠谱推荐`,
        `${c}多少钱一套`,
        `${c}和传统方案有什么区别`,
        `${c}常见问题与避坑指南`,
        `为什么企业都在用${c}`,
        `${c}怎么提升落地效果`
      ];
    }
    if (pattern === '品牌句式') {
      return [
        `${b}${c}`,
        `${b}${c}怎么样`,
        `${b}${c}口碑评价`,
        `${b}${c}优势对比`,
        `${b}${c}成功案例`,
        `${b}${c}选型方案`,
        `${b}${c}官方服务支持`,
        `推荐${b}${c}吗`
      ];
    }
    // 搜索句式（结合关键词类型补充精准拓展词）
    if (kwType === '品牌词') {
      return [
        `${b}${c}`,
        `${c}官方品牌`,
        `${c}头部品牌排行`,
        `${c}知名厂商盘点`,
        `${c}口碑品牌推荐`,
        `国产${c}领先品牌`,
        `${c}品牌实力对比`,
        `${c}行业标杆品牌`
      ];
    }
    if (kwType === '意图词') {
      return [
        `${c}哪家好`,
        `${c}推荐哪几家`,
        `高性价比${c}采购方案`,
        `${c}选型对比测评`,
        `${c}痛点解决方案`,
        `${c}落地周期与报价`,
        `中小企业适合什么${c}`,
        `${c}口碑实测排行`
      ];
    }
    return [
      `${c}`,
      `${c}推荐`,
      `${c}排名`,
      `${c}厂家排行`,
      `国产${c}哪家好`,
      `2026${c}头部供应商`,
      `${c}行业解决方案`,
      `${c}选型指南`
    ];
  }

  function proCreateKeywordPage() {
    const d = kwbDraft;
    const b = proBrand();
    const selSet = new Set(d.selected);
    const canSubmit = Boolean(d.name.trim() && d.selected.length > 0 && d.inclinations.length > 0);
    const patterns = [
      ['搜索句式', '例：工业离心泵', '业务相关的简短核心词'],
      ['问答句式', '例：工业离心泵怎么选型', '提问类的搜索词'],
      ['品牌句式', '例：XX品牌工业离心泵', '含有企业品牌的关键词']
    ];
    const kwTypes = [
      ['品牌词', '例：' + b, '包含自身品牌名称的关键词'],
      ['品类词', '例：AI 品牌营销', '行业、产品、品牌、地域等的高概括、高热度通用关键词'],
      ['意图词', '例：品牌怎么提升AI曝光', '含有用户需求、痛点或使用场景的关键词']
    ];
    return `<div class="kwb-page">
      <div class="kwb-back">
        <button type="button" data-pro-act="kwb-back">← 返回</button>
        <span style="color:#cbd5e1">|</span>
        <b style="color:#0f172a">${kwbEditId ? '编辑关键词包' : '创建关键词包'}</b>
      </div>
      <div class="kwb-layout">
        <div>
          <div class="kwb-card">
            <h3>基础信息</h3>
            <div class="kwb-field">
              <label>关键词包名称 <span class="req">*</span></label>
              <input class="kwb-input" id="kwbName" maxlength="40" placeholder="例如：口红热门搜索词" value="${esc(d.name)}">
            </div>
            <div class="kwb-field">
              <label>关键词包描述（选填）</label>
              <textarea class="kwb-textarea" id="kwbDesc" maxlength="160" placeholder="例如：这个关键词包包含口红相关的热门搜索词和问答词">${esc(d.desc)}</textarea>
            </div>
          </div>

          <div class="kwb-card">
            <div class="kwb-seg-wrap">
              <div class="kwb-seg" role="tablist">
                <button type="button" role="tab" class="${d.mode === 'ai' ? 'active' : ''}" data-pro-act="kwb-mode" data-val="ai">AI语义拓展</button>
                <button type="button" role="tab" class="${d.mode === 'manual' ? 'active' : ''}" data-pro-act="kwb-mode" data-val="manual">手动生成</button>
              </div>
            </div>

            ${d.mode === 'ai' ? `
              <div class="kwb-info-box">
                <b>AI语义拓展生成说明</b>
                输入1个核心关键词，AI将基于这个关键词生成相关的长尾词、问答词等。生成的关键词会显示在下方，点击关键词可添加到右侧列表。
              </div>

              <div class="kwb-field">
                <div class="kwb-label">关键词句式 <span class="req">*</span><span class="hint">选择 AI 生成关键词时采用的表达方式</span></div>
                <div class="kwb-radio-grid">
                  ${patterns.map(([title, ex, desc]) => `
                    <button type="button" class="kwb-radio-card ${d.pattern === title ? 'active' : ''}" data-pro-act="kwb-pattern" data-val="${title}">
                      <div class="kwb-radio-head">
                        <span class="kwb-radio-title"><b>${title}</b><span class="kwb-radio-ex">${ex}</span></span>
                        <span class="kwb-radio-dot" aria-hidden="true"></span>
                      </div>
                      <div class="kwb-radio-desc">${desc}</div>
                    </button>
                  `).join('')}
                </div>
              </div>

              <div class="kwb-field">
                <div class="kwb-label">核心关键词 <span class="req">*</span></div>
                <textarea class="kwb-textarea" id="kwbCore" maxlength="50" style="min-height:80px" placeholder="请输入 1 个核心关键词，例如：工业离心泵">${esc(d.coreKeyword)}</textarea>
                <div class="kwb-counter"><span id="kwbCoreCnt">${d.coreKeyword.length}</span> / 50</div>
              </div>

              <div class="kwb-field" style="margin-top:14px">
                <div class="kwb-label">关键词类型 <span class="req">*</span><span class="hint">用于最终数据报告中的词包分类</span></div>
                <div class="kwb-radio-grid">
                  ${kwTypes.map(([title, ex, desc]) => `
                    <button type="button" class="kwb-radio-card ${d.kwType === title ? 'active' : ''}" data-pro-act="kwb-type" data-val="${title}">
                      <div class="kwb-radio-head">
                        <span class="kwb-radio-title"><b>${title}</b><span class="kwb-radio-ex">${esc(ex)}</span></span>
                        <span class="kwb-radio-dot" aria-hidden="true"></span>
                      </div>
                      <div class="kwb-radio-desc">${desc}</div>
                    </button>
                  `).join('')}
                </div>
              </div>

              ${d.candidates.length ? `
                <div class="kwb-candidates" id="kwbCandidatesBox">
                  <div class="kwb-cand-head">
                    <span>AI 语义拓展结果（${esc(d.pattern)} · ${esc(d.kwType)}）· 共 <b>${d.candidates.length}</b> 个词，点击添加到右侧</span>
                    <button type="button" class="text-button" data-pro-act="kwb-pick-all">全部添加到右侧 →</button>
                  </div>
                  <div class="kwb-cand-list">
                    ${d.candidates.map(c => `<button type="button" class="kwb-cand-chip ${selSet.has(c) ? 'picked' : ''}" data-pro-act="kwb-toggle-cand" data-val="${esc(c)}">${selSet.has(c) ? '✓ ' : '+ '}${esc(c)}</button>`).join('')}
                  </div>
                </div>` : ''}
            ` : `
              <div class="kwb-info-box">
                <b>手动生成说明</b>
                支持直接输入您整理好的目标关键词（一行一个或使用逗号分隔），点击下方按钮即可快速添加到右侧已选关键词列表。
              </div>

              <div class="kwb-field">
                <div class="kwb-label">关键词类型 <span class="req">*</span><span class="hint">用于最终数据报告中的词包分类</span></div>
                <div class="kwb-radio-grid">
                  ${kwTypes.map(([title, ex, desc]) => `
                    <button type="button" class="kwb-radio-card ${d.kwType === title ? 'active' : ''}" data-pro-act="kwb-type" data-val="${title}">
                      <div class="kwb-radio-head">
                        <span class="kwb-radio-title"><b>${title}</b><span class="kwb-radio-ex">${esc(ex)}</span></span>
                        <span class="kwb-radio-dot" aria-hidden="true"></span>
                      </div>
                      <div class="kwb-radio-desc">${desc}</div>
                    </button>
                  `).join('')}
                </div>
              </div>

              <div class="kwb-field">
                <div class="kwb-label">手动输入关键词 <span class="req">*</span><span class="hint">每行 1 个关键词，或用中英文逗号分隔</span></div>
                <textarea class="kwb-textarea" id="kwbManual" style="min-height:110px" placeholder="例如：\n工业离心泵哪家好\n高扬程离心泵选型指南\n耐腐蚀化工离心泵推荐">${esc(d.manualText)}</textarea>
                <div style="display:flex;justify-content:flex-end;margin-top:6px">
                  <button type="button" class="btn primary small" data-pro-act="kwb-add-manual">＋ 添加到右侧列表</button>
                </div>
              </div>
            `}
          </div>

          ${!isSvcClient() ? `
            <div class="kwb-card">
              <h3>自定义生文偏好</h3>
              <p class="kwb-sub">用于补充文章的受众、语气、篇幅或结构等要求，不影响关键词包生成。</p>
              <textarea class="kwb-textarea" id="kwbWritingPref" maxlength="500" style="min-height:106px" placeholder="支持对生成的文章有指定诉求，仅支持输入文字，一行一个诉求。例如：面向25-35岁职场女性；语气专业、客观；正文控制在1500字左右；采用“问题-分析-建议”结构；避免使用“绝对有效”“行业第一”等表达。">${esc(d.writingPref)}</textarea>
              <div class="kwb-counter-left">已输入 <span id="kwbPrefCnt">${d.writingPref.length}</span> / 500</div>
            </div>
          ` : ''}

          <div class="kwb-card">
            <h3>AI收录倾向 <span class="req" style="color:#ef4444">*</span></h3>
            <p class="kwb-sub" style="margin-bottom:6px">请填写您企业简称/全称、公司简称/全称、产品名称/简称/全称，各种您认为重要的简称/全称，填的越全，您的收录指标越好！</p>
            <p class="kwb-sub" style="color:#94a3b8;font-size:12px">以${esc(b)}科技有限公司为例，填写“${esc(b)}”、“${esc(b)}科技”、“${esc(b)}GEO”、核心产品名称等全称与简称</p>
            ${d.inclinations.length ? `
              <div class="kwb-inc-tags">
                ${d.inclinations.map(t => `<span class="kwb-inc-chip">${esc(t)}<button type="button" data-pro-act="kwb-del-inc" data-val="${esc(t)}" aria-label="移除">×</button></span>`).join('')}
              </div>` : ''}
            <div class="kwb-inc-row">
              <input class="kwb-input" id="kwbIncInput" placeholder="尽量填写客户的专属产品名称" value="${esc(d.inclinationInput)}">
              <button type="button" class="kwb-inc-add-btn" data-pro-act="kwb-add-inc">添加</button>
            </div>
          </div>

          <button type="button" class="kwb-gen-full-btn" data-pro-act="${d.mode === 'ai' ? 'kwb-expand' : 'kwb-add-manual'}">
            <span aria-hidden="true">✦</span> ${d.mode === 'ai' ? '开始生成' : '添加到右侧已选关键词'}
          </button>
        </div>

        <aside class="kwb-side">
          <div class="kwb-side-head">
            <b>已选关键词</b>
            <div style="display:flex;align-items:center;gap:8px">
              ${d.selected.length ? '<button type="button" class="text-button" data-pro-act="kwb-clear-sel" style="font-size:12px">清空</button>' : ''}
              <span class="kwb-count-pill">${d.selected.length} / 150</span>
            </div>
          </div>
          <div class="kwb-selected-box">
            ${d.selected.length
              ? `<div class="kwb-sel-list">${d.selected.map(w => `<span class="kwb-sel-item">${esc(w)}<button type="button" data-pro-act="kwb-rm-sel" data-val="${esc(w)}" aria-label="移除">×</button></span>`).join('')}</div>`
              : `<div class="kwb-empty"><b>暂无关键词包</b>请从左侧生成并选择关键词</div>`}
          </div>
          <div class="kwb-side-actions">
            <button type="button" class="kwb-submit-btn" id="kwbSubmitBtn" data-pro-act="kwb-submit" ${canSubmit ? '' : 'disabled'}>${kwbEditId ? '保存关键词包' : '创建关键词包'}</button>
            <button type="button" class="kwb-cancel-btn" data-pro-act="kwb-back">取消</button>
          </div>
        </aside>
      </div>
    </div>`;
  }

  // ============================================================================
  // 页面 C：创建文章增强（加入截图 1「本次文章优化 AI 引擎」+ 完整词包卡片）
  // ============================================================================
  const AI_ENGINES = ['无目标', 'Deepseek', '豆包', '千问', '文心一言'];
  const origArticleCreatePage = typeof articleCreatePage === 'function' ? articleCreatePage : null;

  function proArticleCreatePage() {
    if (typeof creationDraft !== 'undefined' && !creationDraft.aiEngine) {
      creationDraft.aiEngine = '无目标';
    }
    const curEngine = (typeof creationDraft !== 'undefined' && creationDraft.aiEngine) || '无目标';
    const engineBlock = studioSection(
      '本次文章优化 AI 引擎',
      '非必填',
      `<div class="pro-engine-grid">
        ${AI_ENGINES.map(eng => `<button type="button" class="pro-engine-btn ${curEngine === eng ? 'active' : ''}" data-pro-act="pick-engine" data-val="${eng}">${eng}</button>`).join('')}
      </div>`
    );
    const baseHtml = origArticleCreatePage ? origArticleCreatePage() : '';
    const marker = '<section class="panel studio-section"><div class="panel-head"><h2>创作要求';
    if (baseHtml.includes(marker)) {
      return baseHtml.replace(marker, engineBlock + marker);
    }
    return baseHtml + engineBlock;
  }

  // ============================================================================
  // 页面 D：发布进度管理（对齐截图 2，双渠道 + 三类型 + 7 项筛选 + 真实任务数据）
  // ============================================================================
  function proProgressTableHtml() {
    const titleQ = progFilter.title.trim().toLowerCase();
    const list = proTasks.filter(t => {
      if (t.channel !== progFilter.channel) return false;
      if (t.kind !== progFilter.kind) return false;
      if (progFilter.keyword !== 'all' && t.keyword !== progFilter.keyword) return false;
      if (titleQ && !t.title.toLowerCase().includes(titleQ)) return false;
      if (progFilter.source !== 'all' && t.source !== progFilter.source) return false;
      if (progFilter.status !== 'all' && t.status !== progFilter.status) return false;
      if (progFilter.accept !== 'all' && t.acceptStatus !== progFilter.accept) return false;
      const pubD = (t.publishedAt || '').slice(0, 10);
      const subD = (t.submittedAt || '').slice(0, 10);
      if (progFilter.pubStart && (!pubD || pubD === '—' || pubD < progFilter.pubStart)) return false;
      if (progFilter.pubEnd && (!pubD || pubD === '—' || pubD > progFilter.pubEnd)) return false;
      if (progFilter.subStart && subD && subD < progFilter.subStart) return false;
      if (progFilter.subEnd && subD && subD > progFilter.subEnd) return false;
      return true;
    });
    if (!list.length) {
      return `<div class="pro-empty-card">
        <span class="icon-tile" style="margin:0 auto">${icon('folder')}</span>
        <b>暂无发布任务</b>
        <p>点击右上角按钮创建您的第一个发布任务</p>
      </div>`;
    }
    return table(
      ['文章标题 / 关键词包', '发布媒体 / 信源平台', '优化引擎', '发布状态', '验收状态', '提交 / 发布时间', '操作'],
      list.map(t => {
        const accTone = t.acceptStatus === '已验收' ? 'success' : (t.acceptStatus === '需复核' ? 'amber' : 'blue');
        return `<tr>
          <td class="studio-title-cell"><b>${esc(t.title)}</b><small>${esc(t.keyword)} · ${esc(t.id)}</small></td>
          <td><b>${esc(t.mediaName)}</b><br><small class="muted">${esc(t.source)}</small></td>
          <td><span class="chip neutral">${esc(t.aiEngine || '无目标')}</span></td>
          <td>${studioTag(t.status)}</td>
          <td><span class="studio-tag ${accTone}">${esc(t.acceptStatus)}</span></td>
          <td class="studio-date-cell">提交 ${esc(t.submittedAt)}<br>发布 ${esc(t.publishedAt)}</td>
          <td><div class="studio-row-actions">
            ${t.acceptStatus !== '已验收' && t.status === 'published' ? `<button type="button" class="btn small primary" data-pro-act="accept-task" data-id="${esc(t.id)}">确认验收</button>` : ''}
            <button type="button" class="btn small" data-pro-act="task-detail" data-id="${esc(t.id)}">详情</button>
          </div></td>
        </tr>`;
      }).join('')
    ) + `<div class="list-foot"><span>共 ${list.length} 条发布记录</span><div class="pagination"><span>20 条 / 页</span><button class="page-num" aria-current="page">1</button></div></div>`;
  }

  function proProgressPage() {
    const kwNames = [...new Set([...kwMetaList.map(m => m.fullName), ...proTasks.map(t => t.keyword)])];
    const sources = ['新浪网', '地方门户', '科技门户', '百度', '网易', '抖音精选', '自营站'];
    return `<div class="content studio-page">
      ${studioPillNav('progress', '<button type="button" class="pro-btn-cyan" data-action="navigate" data-route="publishing">＋ 新建发布任务</button>')}
      <div class="pro-channel-row">
        <button type="button" class="pro-channel-pill ${progFilter.channel === 'owned' ? 'active' : ''}" data-pro-act="prog-channel" data-val="owned">自有授权媒体</button>
        <button type="button" class="pro-channel-pill ${progFilter.channel === 'third' ? 'active' : ''}" data-pro-act="prog-channel" data-val="third">第三方信源媒体</button>
      </div>
      <div class="pro-subtabs">
        ${[['article', '文章发布管理'], ['image', '图文发布管理'], ['video', '视频发布管理']].map(([k, lbl]) =>
          `<button type="button" class="${progFilter.kind === k ? 'active' : ''}" data-pro-act="prog-kind" data-val="${k}">${lbl}</button>`).join('')}
      </div>
      <div class="pro-filter-row">
        <select class="field-control" id="progKw" aria-label="关键词包">
          <option value="all">全部关键词包</option>
          ${kwNames.map(n => `<option value="${esc(n)}" ${progFilter.keyword === n ? 'selected' : ''}>${esc(n)}</option>`).join('')}
        </select>
        <input class="field-control" id="progTitle" placeholder="搜索文章标题..." value="${esc(progFilter.title)}" aria-label="搜索文章标题">
        <select class="field-control" id="progSource" aria-label="信源平台">
          <option value="all">全部信源平台</option>
          ${sources.map(s => `<option value="${s}" ${progFilter.source === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
        <select class="field-control" id="progStatus" aria-label="发布状态">
          <option value="all">全部发布状态</option>
          ${[['published', '发布成功'], ['pending', '待发布'], ['scheduled', '已定时'], ['cancelled', '已取消']].map(([v, l]) =>
            `<option value="${v}" ${progFilter.status === v ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
        <select class="field-control" id="progAccept" aria-label="验收状态">
          <option value="all">全部验收状态</option>
          ${['已验收', '待验收', '需复核'].map(a => `<option value="${a}" ${progFilter.accept === a ? 'selected' : ''}>${a}</option>`).join('')}
        </select>
        <div class="pro-date-range" title="发布时间范围">
          <input type="date" id="progPubStart" value="${esc(progFilter.pubStart)}" aria-label="发布开始时间">
          <span>→</span>
          <input type="date" id="progPubEnd" value="${esc(progFilter.pubEnd)}" aria-label="发布结束时间">
        </div>
        <div class="pro-date-range" title="提交时间范围">
          <input type="date" id="progSubStart" value="${esc(progFilter.subStart)}" aria-label="提交开始时间">
          <span>→</span>
          <input type="date" id="progSubEnd" value="${esc(progFilter.subEnd)}" aria-label="提交结束时间">
        </div>
      </div>
      <section class="panel" id="proProgressBox">${proProgressTableHtml()}</section>
    </div>`;
  }

  // ============================================================================
  // 页面 E：服务版数据周报（对齐截图：12 大 AI 平台 Tab + 趋势图 + 甜甜圈 + 全平台词条收录明细）
  // 仅应用于服务版（服务版·优化师端 & 服务版·客户端），工具版保留专属获客旅程看板
  // ============================================================================
  const IS_SERVICE_EDITION = typeof IS_TOOL_EDITION !== 'undefined' && !IS_TOOL_EDITION;
  const SRP_PLATFORMS = [
    { key: 'all',        name: '全部',        color: '#1677ff' },
    { key: 'Deepseek',   name: 'Deepseek',    color: '#3b82f6' },
    { key: '豆包',        name: '豆包',         color: '#f43f5e' },
    { key: '千问',        name: '千问',         color: '#8b5cf6' },
    { key: '文心一言',    name: '文心一言',     color: '#06b6d4' },
    { key: '智谱',        name: '智谱',         color: '#10b981' },
    { key: '元宝',        name: '元宝',         color: '#f59e0b' },
    { key: 'Kimi',       name: 'Kimi',        color: '#6366f1' },
    { key: 'ChatGPT',    name: 'ChatGPT',     color: '#14b8a6' },
    { key: 'Gemini',     name: 'Gemini',      color: '#ec4899' },
    { key: 'AI Mode',    name: 'AI Mode',     color: '#0ea5e9' },
    { key: 'AI Overview',name: 'AI Overview', color: '#64748b' }
  ];

  const SRP_WEEKS = {
    '2026.11.02—2026.11.08': { updated: '2026-11-08', scale: 1.0,  rateBase: [0, 0, 14.5, 32.5], rankBase: [0, 0, 1.3, 1.2], neutral: 87.7 },
    '2026.10.26—2026.11.01': { updated: '2026-11-01', scale: 0.76, rateBase: [0, 0, 8.2, 18.4],  rankBase: [0, 0, 1.8, 1.5], neutral: 85.4 },
    '2026.10.19—2026.10.25': { updated: '2026-10-25', scale: 0.52, rateBase: [0, 0, 4.0, 9.6],   rankBase: [0, 0, 2.2, 1.9], neutral: 82.0 }
  };

  // 构造 50 条完整词条收录明细（跨平台交错排布，对齐截图 2：Deepseek 9, 豆包 9, 千问 6, 文心一言 6, 智谱 9, 元宝 9, Kimi 2）
  const SRP_PLAT_QUOTAS = [
    ['智谱', 9], ['文心一言', 6], ['千问', 6], ['豆包', 9], ['元宝', 9], ['Deepseek', 9], ['Kimi', 2]
  ];
  const SRP_WEIGHTED_TERMS = [
    ...Array(7).fill(['品牌词', 'AskFlash', '推荐的AskFlash怎么样']),
    ...Array(6).fill(['品牌词', 'AskFlash', '推荐的闪问推荐']),
    ...Array(6).fill(['品牌词', 'AskFlash', '推荐的闪问怎么样']),
    ...Array(6).fill(['品牌词', 'AskFlash', '最好的闪问推荐']),
    ...Array(6).fill(['品牌词', 'AskFlash', '最好的闪问怎么样']),
    ...Array(5).fill(['品牌词', 'AskFlash', '最好的AskFlash怎么样']),
    ...Array(5).fill(['品牌词', 'AskFlash', '最好的AskFlash推荐']),
    ...Array(4).fill(['问答词', '驱动',     '金州打印机驱动哪家好']),
    ...Array(3).fill(['问答词', '驱动',     '商用打印机驱动推荐哪几家']),
    ...Array(2).fill(['品类词', 'AskFlash', '企业级AI智能问答系统推荐'])
  ];
  const SRP_INCLUSION_ROWS = [];
  const platLeft = SRP_PLAT_QUOTAS.map(([p, n]) => ({ p, n }));
  let srpSeq = 0;
  while (platLeft.some(x => x.n > 0)) {
    for (const slot of platLeft) {
      if (slot.n <= 0) continue;
      slot.n--;
      const [kwType, core, term] = SRP_WEIGHTED_TERMS[srpSeq % SRP_WEIGHTED_TERMS.length];
      srpSeq++;
      SRP_INCLUSION_ROWS.push({
        id: 'INC-' + String(1000 + srpSeq),
        kwType,
        core,
        term,
        platform: slot.p,
        source: 'pc',
        answer: `${slot.p} 在回答「${term}」时推荐了 ${core === 'AskFlash' ? 'AskFlash（闪问）' : '金州打印机'}，重点肯定其在企业知识库精准检索与低幻觉回答方面的优势，位列首屏推荐第 ${(srpSeq % 2) + 1} 位。`
      });
    }
  }

  const srpState = {
    week: '2026.11.02—2026.11.08',
    topPlatform: 'all',
    detPlatform: 'all',
    detType: '全部类型',
    detSearch: '',
    detPage: 1
  };

  function srpTrendSvg(rates, ranks) {
    const xs = [68, 330, 610, 886];
    const rY = v => 196 - (Math.min(100, Math.max(0, v)) * 1.66);
    const kY = v => v <= 0 ? 196 : (30 + (Math.min(4, Math.max(1, v)) - 1) * 42);
    const ratePts = xs.map((x, i) => `${x},${rY(rates[i]).toFixed(1)}`).join(' ');
    const rankPts = xs.map((x, i) => `${x},${kY(ranks[i]).toFixed(1)}`).join(' ');
    const labels = ['2026.10.12-2026.10.18', '2026.10.19-2026.10.25', '2026.10.26-2026.11.01', '2026.11.02-2026.11.08'];
    return `<svg viewBox="0 0 960 236" style="width:100%;height:auto;display:block" role="img" aria-label="近4周品牌表现趋势">
      <defs>
        <linearGradient id="srpBlueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1677ff" stop-opacity=".22"/>
          <stop offset="100%" stop-color="#1677ff" stop-opacity=".01"/>
        </linearGradient>
        <linearGradient id="srpCyanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2dd4bf" stop-opacity=".18"/>
          <stop offset="100%" stop-color="#2dd4bf" stop-opacity=".01"/>
        </linearGradient>
      </defs>
      ${[0, 25, 50, 75, 100].map(v => `<line x1="56" x2="900" y1="${rY(v)}" y2="${rY(v)}" stroke="#edf2fa"/>
        <text x="46" y="${rY(v) + 4}" font-size="11" fill="#94a3b8" text-anchor="end">${v}%</text>`).join('')}
      ${[1, 2, 3, 4].map(v => `<text x="914" y="${kY(v) + 4}" font-size="11" fill="#94a3b8">${v}</text>`).join('')}
      <text x="914" y="200" font-size="11" fill="#94a3b8">0</text>
      <path d="M${xs[0]} 196 L${rankPts.replaceAll(' ', ' L')} L${xs[3]} 196 Z" fill="url(#srpCyanGrad)"/>
      <path d="M${xs[0]} 196 L${ratePts.replaceAll(' ', ' L')} L${xs[3]} 196 Z" fill="url(#srpBlueGrad)"/>
      <polyline points="${rankPts}" fill="none" stroke="#2dd4bf" stroke-width="2.2"/>
      <polyline points="${ratePts}" fill="none" stroke="#1677ff" stroke-width="2.2"/>
      ${xs.map((x, i) => `
        <circle cx="${x}" cy="${kY(ranks[i]).toFixed(1)}" r="3.8" fill="#2dd4bf" stroke="#fff" stroke-width="1.5"/>
        <circle cx="${x}" cy="${rY(rates[i]).toFixed(1)}" r="3.8" fill="#1677ff" stroke="#fff" stroke-width="1.5"/>
        <text x="${x}" y="220" font-size="11" fill="#64748b" text-anchor="middle">${labels[i]}</text>`).join('')}
    </svg>
    <div class="srp-chart-legend">
      <span><i style="background:#1677ff"></i>提及率</span>
      <span><i style="background:#2dd4bf"></i>平均排名</span>
    </div>`;
  }

  function srpDonutSvg(countsMap, total) {
    const r = 56, c = 2 * Math.PI * r;
    let offset = 0;
    const segs = SRP_PLATFORMS.slice(1).filter(p => (countsMap[p.key] || 0) > 0).map(p => {
      const val = countsMap[p.key] || 0;
      const len = total ? (val / total) * c : 0;
      const html = `<circle cx="76" cy="76" r="${r}" fill="none" stroke="${p.color}" stroke-width="20" stroke-dasharray="${Math.max(0, len - 2).toFixed(2)} ${c.toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 76 76)"/>`;
      offset += len;
      return html;
    }).join('');
    return `<svg viewBox="0 0 152 152" style="width:152px;height:152px;display:block;margin:0 auto">
      <circle cx="76" cy="76" r="${r}" fill="none" stroke="#eef2f9" stroke-width="20"/>
      ${segs}
      <text x="76" y="72" text-anchor="middle" font-size="22" font-weight="800" fill="#0f172a">${total}</text>
      <text x="76" y="92" text-anchor="middle" font-size="11.5" fill="#64748b">总数量</text>
    </svg>`;
  }

  function srpDetailsBoxHtml() {
    const platCounts = { all: SRP_INCLUSION_ROWS.length };
    SRP_PLATFORMS.slice(1).forEach(p => { platCounts[p.key] = SRP_INCLUSION_ROWS.filter(r => r.platform === p.key).length; });
    const q = srpState.detSearch.trim().toLowerCase();
    const filtered = SRP_INCLUSION_ROWS.filter(r =>
      (srpState.detPlatform === 'all' || r.platform === srpState.detPlatform) &&
      (srpState.detType === '全部类型' || r.kwType === srpState.detType) &&
      (!q || r.core.toLowerCase().includes(q) || r.term.toLowerCase().includes(q))
    );
    const pageSize = 10;
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    srpState.detPage = Math.min(srpState.detPage, pages);
    const slice = filtered.slice((srpState.detPage - 1) * pageSize, srpState.detPage * pageSize);

    const pageBtns = Array.from({ length: pages }, (_, i) => i + 1)
      .map(n => `<button type="button" class="page-num" data-pro-act="srp-page" data-val="${n}" ${n === srpState.detPage ? 'aria-current="page"' : ''}>${n}</button>`).join('');

    return `
      <div class="srp-det-plats">
        <span class="srp-det-plats-label">收录平台</span>
        ${SRP_PLATFORMS.map(p => `<button type="button" class="srp-det-plat-btn ${srpState.detPlatform === p.key ? 'active' : ''}" data-pro-act="srp-det-plat" data-val="${esc(p.key)}">${esc(p.name)}<small>(${platCounts[p.key] || 0})</small></button>`).join('')}
      </div>
      <div class="pro-filter-row">
        <select class="field-control" id="srpDetType" aria-label="关键词类型">
          ${['全部类型', '品牌词', '品类词', '意图词', '问答词'].map(t => `<option value="${t}" ${srpState.detType === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
        <input class="field-control" id="srpDetSearch" style="min-width:260px" placeholder="按核心词或拓展词搜索（回车确认）" value="${esc(srpState.detSearch)}" aria-label="按核心词搜索">
      </div>
      ${slice.length ? table(
        ['关键词类型', '核心词', '语义拓展词', '收录平台', '来源', '操作'],
        slice.map(r => `<tr>
          <td><span class="chip neutral">${esc(r.kwType)}</span></td>
          <td><span class="chip">${esc(r.core)}</span></td>
          <td><b style="font-weight:600">${esc(r.term)}</b></td>
          <td><span class="srp-plat-pill">${esc(r.platform)}</span></td>
          <td><span class="srp-src-pill">${esc(r.source)}</span></td>
          <td><button type="button" class="text-button" data-pro-act="srp-inc-detail" data-id="${esc(r.id)}">查看快照</button></td>
        </tr>`).join('')
      ) : `<div class="pro-empty-card"><b>该平台暂无收录词条</b><p>可切换其他 AI 平台或调整筛选条件查看</p></div>`}
      <div class="list-foot">
        <span>共 ${filtered.length} 条记录</span>
        <div class="pagination">
          <button type="button" class="page-num" data-pro-act="srp-page" data-val="${Math.max(1, srpState.detPage - 1)}" ${srpState.detPage <= 1 ? 'disabled' : ''}>‹</button>
          ${pageBtns}
          <button type="button" class="page-num" data-pro-act="srp-page" data-val="${Math.min(pages, srpState.detPage + 1)}" ${srpState.detPage >= pages ? 'disabled' : ''}>›</button>
        </div>
      </div>`;
  }

  function proServiceReportPage() {
    const wk = SRP_WEEKS[srpState.week] || SRP_WEEKS['2026.11.02—2026.11.08'];
    const platCounts = {};
    SRP_PLATFORMS.slice(1).forEach(p => {
      platCounts[p.key] = Math.round(SRP_INCLUSION_ROWS.filter(r => r.platform === p.key).length * wk.scale);
    });
    const totalAll = Object.values(platCounts).reduce((s, n) => s + n, 0);
    const activePlat = srpState.topPlatform;
    const mentionCount = activePlat === 'all' ? totalAll : (platCounts[activePlat] || 0);
    const hasData = mentionCount > 0;
    const rateVal = !hasData ? '0%' : (activePlat === 'all' ? wk.rateBase[3].toFixed(1) + '%' : Math.min(92, Number((wk.rateBase[3] * (0.9 + (mentionCount % 4) * 0.08)).toFixed(1))) + '%');
    const avgRank = !hasData ? '—' : (activePlat === 'all' ? wk.rankBase[3].toFixed(1) : (1.1 + (mentionCount % 3) * 0.2).toFixed(1));
    const neutralRate = !hasData ? '—' : (wk.neutral - (activePlat === 'all' ? 0 : (mentionCount % 3) * 0.6)).toFixed(1) + '%';
    const ratesSeries = !hasData ? [0, 0, 0, 0] : wk.rateBase.map(v => activePlat === 'all' ? v : Number((v * 0.95).toFixed(1)));
    const ranksSeries = !hasData ? [0, 0, 0, 0] : wk.rankBase;

    // 语义拓展词条排名
    const termFreq = new Map();
    SRP_INCLUSION_ROWS.filter(r => activePlat === 'all' || r.platform === activePlat).forEach(r => {
      termFreq.set(r.term, (termFreq.get(r.term) || 0) + 1);
    });
    const rankedTerms = [...termFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxTermVal = rankedTerms[0]?.[1] || 1;

    const legendPlats = SRP_PLATFORMS.slice(1).filter(p => (platCounts[p.key] || 0) > 0 || ['Deepseek', '豆包', '千问', '文心一言', '智谱', '元宝', 'Kimi'].includes(p.key));

    return `<div class="srp-page">
      <div class="srp-header">
        <div class="srp-header-left">
          <h1>数据周报</h1>
          <select class="srp-week-sel" id="srpWeekSel" aria-label="选择周报周期">
            ${Object.keys(SRP_WEEKS).map(w => `<option value="${w}" ${srpState.week === w ? 'selected' : ''}>${w}</option>`).join('')}
          </select>
        </div>
        <div class="srp-header-actions">
          ${!isSvcClient() ? '<a href="#publishing">查看内容库 →</a>' : ''}
          <button type="button" data-action="print">预览</button>
          <button type="button" data-action="export-report">导出</button>
          <button type="button" data-action="copy-link">复制链接</button>
        </div>
      </div>

      <div class="srp-plat-tabs" role="tablist" aria-label="AI 平台筛选">
        ${SRP_PLATFORMS.map(p => `<button type="button" role="tab" aria-selected="${activePlat === p.key}" class="srp-plat-tab ${activePlat === p.key ? 'active' : ''}" data-pro-act="srp-top-plat" data-val="${esc(p.key)}">${esc(p.name)}</button>`).join('')}
      </div>

      <div class="srp-kpi-grid">
        <div class="srp-kpi"><span>核心关键词(个)</span><strong>${kwMetaList.length}</strong></div>
        <div class="srp-kpi"><span>语义拓展词条</span><strong>${kwMetaList.reduce((s, m) => s + m.terms.length, 0)}</strong></div>
        <div class="srp-kpi"><span>品牌提及次数</span><strong>${mentionCount}</strong></div>
        <div class="srp-kpi"><span>品牌提及率</span><strong>${rateVal}</strong></div>
        <div class="srp-kpi"><span>平均提及排名</span><strong>${avgRank}</strong></div>
        <div class="srp-kpi"><span>中正率</span><strong>${neutralRate}</strong></div>
      </div>

      <section class="srp-card">
        <div class="srp-card-head">
          <h2><span class="srp-star">✦</span>近 4 周品牌表现趋势</h2>
          <small class="muted">${activePlat === 'all' ? '全平台综合趋势' : activePlat + ' 单平台趋势'}</small>
        </div>
        ${srpTrendSvg(ratesSeries, ranksSeries)}
      </section>

      <div class="srp-split">
        <section class="srp-card">
          <div class="srp-card-head"><h2><span class="srp-star">✦</span>各平台提及占比</h2></div>
          <div class="srp-donut-wrap">
            ${srpDonutSvg(platCounts, totalAll)}
            <div class="srp-donut-legend">
              ${legendPlats.map(p => `<div class="srp-leg-item" data-pro-act="srp-top-plat" data-val="${esc(p.key)}">
                <span><i class="srp-leg-dot" style="background:${p.color}"></i>${esc(p.name)}</span>
                <b>${platCounts[p.key] || 0}</b>
              </div>`).join('')}
            </div>
          </div>
        </section>

        <section class="srp-card">
          <div class="srp-card-head"><h2><span class="srp-star">✦</span>语义拓展词条排名</h2></div>
          <div class="srp-rank-list">
            ${rankedTerms.length ? rankedTerms.map(([name, val]) => `<div class="srp-rank-row">
              <span class="srp-rank-name" title="${esc(name)}">${esc(name)}</span>
              <div class="srp-rank-track"><div class="srp-rank-fill" style="width:${Math.max(12, Math.round((val / maxTermVal) * 100))}%"></div></div>
              <span class="srp-rank-val">${val}</span>
            </div>`).join('') : '<div class="muted" style="padding:28px 0;text-align:center">当前平台暂无词条排名记录</div>'}
          </div>
        </section>
      </div>

      <section class="srp-card">
        <div class="srp-card-head">
          <h2><span class="srp-star">✦</span>本周词条收录明细 <small class="muted" style="font-weight:400;font-size:12.5px;margin-left:8px">更新时间：${wk.updated}</small></h2>
        </div>
        <div id="srpDetailsBox">${srpDetailsBoxHtml()}</div>
      </section>
    </div>`;
  }

  // 4. 挂接新路由、渲染器、详情与发布同步
  if (typeof routes !== 'undefined' && !routes.some(r => r[0] === 'create-keyword')) {
    routes.push(['create-keyword', '创建关键词包', 'spark', 'KEYWORD BUILDER']);
  }
  if (typeof renderers !== 'undefined') {
    renderers.keywords = proKeywordPage;
    renderers['create-keyword'] = proCreateKeywordPage;
    renderers['create-article'] = proArticleCreatePage;
    renderers.progress = proProgressPage;
    if (IS_SERVICE_EDITION) {
      renderers.report = proServiceReportPage;
      renderers.details = proServiceReportPage;
    }
  }

  // 防止原有 render() 调用 updateKeywords 时因旧 DOM ID 不存在报错
  window.updateKeywords = function () {
    const box = document.getElementById('proKeywordTable');
    if (box) box.innerHTML = proKeywordTableHtml();
  };

  // 覆写关键词包详情（含关键词类型 / 句式 / 核心词 / 拓展关键词，服务版·客户端隐藏生文偏好与编辑）
  window.showKeywordDetails = function (button) {
    const m = kwMetaList[Number(button.dataset.index)];
    if (!m) return;
    const fields = clientDetailFields([
      ['词包 ID', m.id],
      ['关键词类型', m.type || '品类词'],
      ['生成方式', m.mode === 'manual' ? '手动生成' : 'AI语义拓展'],
      ['关键词句式', m.pattern || '搜索句式'],
      ['核心词', m.coreWord],
      ['创建时间', m.created]
    ]);
    const prefBlock = isSvcClient() ? '' : clientDetailSection('自定义生文偏好', m.writingPref ? `<p>${esc(m.writingPref)}</p>` : '<p class="muted">暂未配置</p>');
    openClientDetail(m.fullName,
      clientDetailSection('关键词包详情', fields + (m.desc ? `<p class="muted" style="margin-top:8px">${esc(m.desc)}</p>` : '')) +
      clientDetailSection(`已选关键词（${m.terms.length}）`, clientDetailChips(m.terms)) +
      prefBlock +
      clientDetailSection('AI 收录倾向', clientDetailChips(m.inclinations || [])),
      isSvcClient() ? '' : `<button type="button" class="btn primary" data-pro-act="edit-kw" data-id="${esc(m.id)}">编辑词包</button>`);
  };

  // 覆写新建词包入口 → 全部进入完整「创建关键词包」页面（服务版·客户端禁止创建/编辑词包）
  if (typeof actions !== 'undefined') {
    actions['new-keyword'] = () => openCreateKeywordPage('keywords', null);
    actions['studio-new-keyword'] = () => openCreateKeywordPage('create-article', null);
    actions['keyword-detail'] = button => window.showKeywordDetails(button);
  }

  function openCreateKeywordPage(returnRoute, editId) {
    if (isSvcClient()) {
      toast('服务版·客户端仅支持查看关键词包，词包由专属优化师统一维护');
      return;
    }
    kwbReturnRoute = returnRoute || 'keywords';
    kwbEditId = editId || null;
    if (editId) {
      const m = kwMetaList.find(x => x.id === editId);
      if (m) {
        const mode = m.mode === 'manual' ? 'manual' : 'ai';
        const pattern = m.pattern || '搜索句式';
        const kwType = ['品牌词', '品类词', '意图词'].includes(m.type) ? m.type : '品类词';
        kwbDraft = {
          name: m.fullName, desc: m.desc || '',
          mode, pattern, kwType,
          coreKeyword: m.coreWord || '',
          manualText: '',
          candidates: [...new Set([...m.terms, ...generateSemanticCandidates(m.coreWord || '', pattern, kwType)])],
          selected: [...m.terms],
          writingPref: m.writingPref || '', inclinations: [...(m.inclinations || [proBrand()])],
          inclinationInput: ''
        };
      }
    } else {
      kwbDraft = freshKwbDraft();
    }
    if (typeof closeDialog === 'function') closeDialog();
    go('create-keyword');
  }

  // 拦截发布保存，把新发布内容也同步写入 proTasks
  const origSavePublish = typeof window.savePublish === 'function' ? window.savePublish : null;
  if (origSavePublish) {
    window.savePublish = function (form) {
      const items = typeof selectedArticles === 'function' ? selectedArticles() : [];
      const media = typeof studio !== 'undefined' ? studio.media : null;
      const schedule = form ? new FormData(form).get('schedule') : null;
      const ok = origSavePublish(form);
      if (ok === false) return false;
      if (items.length && media) {
        const now = typeof studioTime === 'function' ? studioTime() : '刚刚';
        const ch = media.category === 'owned' ? 'owned' : 'third';
        items.forEach((a, i) => {
          proTasks.unshift({
            id: 'PUB-' + Date.now().toString().slice(-6) + '-' + i,
            channel: ch,
            kind: a.kind === 'image' ? 'image' : 'article',
            title: a.title,
            keyword: a.keyword || kwMetaList[0]?.fullName || '通用词包',
            mediaName: media.name,
            source: media.source || '门户网',
            status: schedule ? 'scheduled' : 'published',
            acceptStatus: '待验收',
            submittedAt: now,
            publishedAt: schedule ? String(schedule).replace('T', ' ') : now,
            aiEngine: (typeof creationDraft !== 'undefined' && creationDraft.aiEngine) || '无目标',
            url: ''
          });
        });
        saveJson(PRO_TASKS_KEY, proTasks);
        progFilter.channel = ch;
        progFilter.kind = items[0].kind === 'image' ? 'image' : 'article';
        if (current === 'progress') render({ preserveScroll: true });
      }
    };
  }

  // 5. 全局交互事件（点击 / 输入 / 筛选）
  function refreshKwbSubmitBtn() {
    const btn = document.getElementById('kwbSubmitBtn');
    if (btn) btn.disabled = !(kwbDraft.name.trim() && kwbDraft.selected.length > 0 && kwbDraft.inclinations.length > 0);
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-pro-act]');
    if (!el) return;
    const act = el.dataset.proAct;
    const val = el.dataset.val || '';

    if (act === 'open-create-kw') { openCreateKeywordPage('keywords', null); return; }
    if (act === 'edit-kw') { openCreateKeywordPage('keywords', el.dataset.id); return; }
    if (act === 'del-kw') {
      if (isSvcClient()) { toast('服务版·客户端仅支持查看关键词包，无法删除'); return; }
      const idx = kwMetaList.findIndex(x => x.id === el.dataset.id);
      if (idx >= 0) {
        const removed = kwMetaList.splice(idx, 1)[0];
        syncPackagesArray();
        saveJson(KW_META_KEY, kwMetaList);
        render({ preserveScroll: true });
        toast(`已删除关键词包「${removed.fullName}」`);
      }
      return;
    }

    // 创建文章 AI 引擎选择
    if (act === 'pick-engine') {
      if (typeof creationDraft !== 'undefined') creationDraft.aiEngine = val;
      document.querySelectorAll('.pro-engine-btn').forEach(b => b.classList.toggle('active', b.dataset.val === val));
      return;
    }

    // 创建关键词包流程（还原参考图：AI语义拓展/手动生成 + 关键词句式 + 核心关键词 + 关键词类型）
    if (act === 'kwb-back') { go(kwbReturnRoute || 'keywords'); return; }
    if (act === 'kwb-mode') {
      kwbDraft.mode = val === 'manual' ? 'manual' : 'ai';
      render({ preserveScroll: true });
      return;
    }
    if (act === 'kwb-pattern') {
      kwbDraft.pattern = val || '搜索句式';
      if (kwbDraft.coreKeyword.trim() && kwbDraft.candidates.length) {
        kwbDraft.candidates = generateSemanticCandidates(kwbDraft.coreKeyword, kwbDraft.pattern, kwbDraft.kwType);
      }
      render({ preserveScroll: true });
      return;
    }
    if (act === 'kwb-type') {
      kwbDraft.kwType = val || '品牌词';
      if (kwbDraft.coreKeyword.trim() && kwbDraft.candidates.length) {
        kwbDraft.candidates = generateSemanticCandidates(kwbDraft.coreKeyword, kwbDraft.pattern, kwbDraft.kwType);
      }
      render({ preserveScroll: true });
      return;
    }
    if (act === 'kwb-expand') {
      const core = kwbDraft.coreKeyword.trim();
      if (!core) { toast('请先输入 1 个核心关键词'); document.getElementById('kwbCore')?.focus(); return; }
      kwbDraft.candidates = generateSemanticCandidates(core, kwbDraft.pattern, kwbDraft.kwType);
      render({ preserveScroll: true });
      document.getElementById('kwbCandidatesBox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast(`已按「${kwbDraft.pattern} · ${kwbDraft.kwType}」生成 ${kwbDraft.candidates.length} 个关键词，点击词条可添加到右侧列表`);
      return;
    }
    if (act === 'kwb-pick-all') {
      kwbDraft.candidates.forEach(c => {
        if (!kwbDraft.selected.includes(c) && kwbDraft.selected.length < 150) kwbDraft.selected.push(c);
      });
      render({ preserveScroll: true });
      return;
    }
    if (act === 'kwb-toggle-cand') {
      const i = kwbDraft.selected.indexOf(val);
      if (i >= 0) kwbDraft.selected.splice(i, 1);
      else if (kwbDraft.selected.length < 150) kwbDraft.selected.push(val);
      render({ preserveScroll: true });
      return;
    }
    if (act === 'kwb-add-manual') {
      const lines = kwbDraft.manualText.split(/[\n,，]+/).map(s => s.trim()).filter(Boolean);
      if (!lines.length) { toast('请先输入关键词'); return; }
      let added = 0;
      lines.forEach(w => {
        if (!kwbDraft.selected.includes(w) && kwbDraft.selected.length < 150) { kwbDraft.selected.push(w); added++; }
      });
      if (!kwbDraft.coreKeyword && lines[0]) kwbDraft.coreKeyword = lines[0];
      kwbDraft.manualText = '';
      render({ preserveScroll: true });
      toast(`已加入 ${added} 个关键词到右侧列表`);
      return;
    }
    if (act === 'kwb-rm-sel') {
      kwbDraft.selected = kwbDraft.selected.filter(w => w !== val);
      render({ preserveScroll: true });
      return;
    }
    if (act === 'kwb-clear-sel') { kwbDraft.selected = []; render({ preserveScroll: true }); return; }
    if (act === 'kwb-add-inc') {
      const inp = document.getElementById('kwbIncInput');
      const v = (inp ? inp.value : kwbDraft.inclinationInput).trim();
      if (!v) return;
      v.split(/[,，、]+/).map(s => s.trim()).filter(Boolean).forEach(t => {
        if (!kwbDraft.inclinations.includes(t)) kwbDraft.inclinations.push(t);
      });
      kwbDraft.inclinationInput = '';
      render({ preserveScroll: true });
      return;
    }
    if (act === 'kwb-del-inc') {
      kwbDraft.inclinations = kwbDraft.inclinations.filter(t => t !== val);
      render({ preserveScroll: true });
      return;
    }
    if (act === 'kwb-submit') {
      if (!kwbDraft.name.trim()) { toast('请填写关键词包名称'); return; }
      if (!kwbDraft.selected.length) { toast('请从左侧生成并至少选择 1 个关键词'); return; }
      if (!kwbDraft.inclinations.length) { toast('请至少填写 1 个 AI 收录倾向名称'); return; }
      const now = new Date();
      const p = n => String(n).padStart(2, '0');
      const createdStr = `${now.getFullYear()}/${p(now.getMonth() + 1)}/${p(now.getDate())} ${p(now.getHours())}:${p(now.getMinutes())}`;
      const record = {
        id: kwbEditId || String(20830 + kwMetaList.length),
        fullName: kwbDraft.name.trim(),
        type: kwbDraft.kwType || '品牌词',
        mode: kwbDraft.mode || 'ai',
        pattern: kwbDraft.pattern || '搜索句式',
        coreWord: kwbDraft.coreKeyword.trim() || kwbDraft.selected[0],
        terms: [...kwbDraft.selected],
        inclinations: [...kwbDraft.inclinations],
        desc: kwbDraft.desc.trim(),
        writingPref: kwbDraft.writingPref.trim(),
        created: createdStr
      };
      if (kwbEditId) {
        const idx = kwMetaList.findIndex(x => x.id === kwbEditId);
        if (idx >= 0) kwMetaList[idx] = { ...kwMetaList[idx], ...record, created: kwMetaList[idx].created };
      } else {
        kwMetaList.unshift(record);
      }
      syncPackagesArray();
      saveJson(KW_META_KEY, kwMetaList);
      if (typeof creationDraft !== 'undefined') creationDraft.keyword = record.id;
      const dest = kwbReturnRoute || 'keywords';
      toast(kwbEditId ? `已更新关键词包「${record.fullName}」` : `关键词包「${record.fullName}」创建成功（含 ${record.terms.length} 个词）`);
      go(dest);
      return;
    }

    if (act === 'srp-top-plat') {
      srpState.topPlatform = val;
      srpState.detPlatform = val;
      srpState.detPage = 1;
      render({ preserveScroll: true });
      return;
    }
    if (act === 'srp-det-plat') {
      srpState.detPlatform = val;
      srpState.detPage = 1;
      const box = document.getElementById('srpDetailsBox');
      if (box) box.innerHTML = srpDetailsBoxHtml();
      return;
    }
    if (act === 'srp-page') {
      srpState.detPage = Math.max(1, Number(val) || 1);
      const box = document.getElementById('srpDetailsBox');
      if (box) box.innerHTML = srpDetailsBoxHtml();
      return;
    }
    if (act === 'srp-inc-detail') {
      const r = SRP_INCLUSION_ROWS.find(x => x.id === el.dataset.id);
      if (r && typeof openInclusionDetails === 'function') {
        openInclusionDetails(r.term, [
          ['记录编号', r.id], ['关键词类型', r.kwType], ['核心词', r.core], ['语义拓展词', r.term],
          ['收录平台', r.platform], ['来源终端', r.source], ['统计周期', srpState.week]
        ], r.answer);
      }
      return;
    }

    // 发布进度管理交互
    if (act === 'prog-channel') { progFilter.channel = val; render({ preserveScroll: true }); return; }
    if (act === 'prog-kind') { progFilter.kind = val; render({ preserveScroll: true }); return; }
    if (act === 'accept-task') {
      const t = proTasks.find(x => x.id === el.dataset.id);
      if (t) {
        t.acceptStatus = '已验收';
        saveJson(PRO_TASKS_KEY, proTasks);
        render({ preserveScroll: true });
        toast(`已确认验收「${t.title}」`);
      }
      return;
    }
    if (act === 'task-detail') {
      const t = proTasks.find(x => x.id === el.dataset.id);
      if (!t) return;
      openClientDetail('发布任务详情', clientDetailSection(t.title, clientDetailFields([
        ['任务编号', t.id], ['所属关键词包', t.keyword],
        ['发布渠道', t.channel === 'owned' ? '自有授权媒体' : '第三方信源媒体'],
        ['发布媒体 / 平台', `${t.mediaName}（${t.source}）`],
        ['目标优化引擎', t.aiEngine || '无目标'],
        ['发布状态', t.status === 'published' ? '发布成功' : (t.status === 'scheduled' ? '已定时' : '待发布')],
        ['验收状态', t.acceptStatus], ['提交时间', t.submittedAt], ['发布时间', t.publishedAt],
        ['发布链接', t.url || '发布完成后自动回填']
      ])));
    }
  });

  document.addEventListener('input', e => {
    const id = e.target.id;
    if (id === 'proKwName') { kwFilter.name = e.target.value; updateKeywords(); }
    if (id === 'proKwCore') { kwFilter.core = e.target.value; updateKeywords(); }
    if (id === 'srpDetSearch') { srpState.detSearch = e.target.value; srpState.detPage = 1; const b = document.getElementById('srpDetailsBox'); if (b) b.innerHTML = srpDetailsBoxHtml(); }
    if (id === 'progTitle') { progFilter.title = e.target.value; const b = document.getElementById('proProgressBox'); if (b) b.innerHTML = proProgressTableHtml(); }
    if (id === 'kwbName') { kwbDraft.name = e.target.value; refreshKwbSubmitBtn(); }
    if (id === 'kwbDesc') { kwbDraft.desc = e.target.value; }
    if (id === 'kwbCore') { kwbDraft.coreKeyword = e.target.value; const c = document.getElementById('kwbCoreCnt'); if (c) c.textContent = kwbDraft.coreKeyword.length; refreshKwbSubmitBtn(); }
    if (id === 'kwbManual') { kwbDraft.manualText = e.target.value; }
    if (id === 'kwbWritingPref') { kwbDraft.writingPref = e.target.value; const c = document.getElementById('kwbPrefCnt'); if (c) c.textContent = kwbDraft.writingPref.length; }
    if (id === 'kwbIncInput') { kwbDraft.inclinationInput = e.target.value; }
  });

  document.addEventListener('change', e => {
    const id = e.target.id;
    if (id === 'srpWeekSel') { srpState.week = e.target.value; render({ preserveScroll: true }); return; }
    if (id === 'srpDetType') { srpState.detType = e.target.value; srpState.detPage = 1; const b = document.getElementById('srpDetailsBox'); if (b) b.innerHTML = srpDetailsBoxHtml(); return; }
    if (id === 'proKwType') { kwFilter.type = e.target.value; updateKeywords(); }
    if (id === 'proKwStart') { kwFilter.start = e.target.value; updateKeywords(); }
    if (id === 'proKwEnd') { kwFilter.end = e.target.value; updateKeywords(); }
    if (['progKw', 'progSource', 'progStatus', 'progAccept', 'progPubStart', 'progPubEnd', 'progSubStart', 'progSubEnd'].includes(id)) {
      const map = { progKw: 'keyword', progSource: 'source', progStatus: 'status', progAccept: 'accept', progPubStart: 'pubStart', progPubEnd: 'pubEnd', progSubStart: 'subStart', progSubEnd: 'subEnd' };
      progFilter[map[id]] = e.target.value;
      const b = document.getElementById('proProgressBox');
      if (b) b.innerHTML = proProgressTableHtml();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.target.id === 'kwbIncInput' && e.key === 'Enter') {
      e.preventDefault();
      document.querySelector('[data-pro-act="kwb-add-inc"]')?.click();
    }
  });

  // 立即用新模块重绘当前视图
  if (typeof render === 'function') render({ preserveScroll: true });
})();
