/* ==========================================================================
   GEO OEM Sales Pro — Upgraded Right-Pane Modules
   Keeps existing lean left sidebar & billing/quota deduction fully intact.
   ========================================================================== */
(function () {
  if (typeof document === 'undefined' || document.body.dataset.role !== '销售') return;

  const SPRO_INDUSTRIES = {
    '工业制造': ['工业设备', '仪器仪表', '材料与零部件', '新能源装备'],
    '商务服务': ['代理', '财税代办', '法律服务', '知识产权'],
    '消费品': ['家用电器', '数码家电', '个护美妆', '食品饮料'],
    '企业服务': ['企业软件', '咨询服务', '营销服务', '云与安全'],
    '家居建材': ['装修服务', '门窗与建材', '家具定制'],
    '医疗健康': ['生物医药', '医疗器械', '健康管理'],
    '生活服务': ['餐饮服务', '教育培训', '本地生活'],
    '其他': ['综合服务']
  };

  const SUFFIX_OPTIONS = ['推荐', '排名', '测评', '哪家好', '哪家靠谱'];
  const KW_PLATFORMS = ['Deepseek', '豆包', '千问', '文心一言', '智谱', '元宝', 'Kimi'];
  const BASE_PLATFORMS = ['豆包', 'Deepseek', '通义千问', 'Kimi', '元宝', '文心一言', '智谱'];
  const BASE_METRICS = ['品牌提及率', '榜一率', '排名前二率', '排名前三率', '平均排名', '中正率', '竞品指标'];
  const DIAG_TABS = [
    ['overview', '01 整体表现'],
    ['scene', '02 场景分析'],
    ['rival', '03 竞品对比'],
    ['sentiment', '04 品牌舆情'],
    ['source', '05 信源诊断'],
    ['opportunity', '06 优化机会'],
    ['cases', '07 案例参考'],
    ['evidence', '附录 诊断证据']
  ];

  // ---------- Storage Helpers ----------
  function kwQuotesKey() {
    return 'geo-oem-spro-quotes-v1-' + portalAccount + tenantSuffix;
  }
  function baseProKey() {
    return 'geo-oem-spro-baselines-v1-' + portalAccount + tenantSuffix;
  }
  function nowFullStr() {
    const d = new Date(), p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }
  function nowShortStr() {
    return nowFullStr().slice(0, 16);
  }
  function downloadCsv(filename, headers, rows) {
    const line = arr => arr.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',');
    const csv = '\uFEFF' + [line(headers), ...rows.map(line)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function seedRand(seedStr) {
    let h = 2166136261;
    for (let i = 0; i < seedStr.length; i++) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return () => {
      h += 0x6D2B79F5;
      let t = Math.imul(h ^ (h >>> 15), 1 | h);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- Default Seed Data ----------
  function defaultQuotes() {
    return [
      {
        id: 'Q-20261123-01',
        title: '远山智能工业视觉检测选词估价',
        company: '远山智能科技有限公司',
        industry: '工业制造-仪器仪表',
        mode: '品牌曝光',
        status: 'active',
        createdAt: '2026-11-23 15:26',
        competitors: ['基恩士', '康耐视', '海康机器人'],
        items: [
          {
            keyword: '工业视觉检测系统哪家好',
            type: '品类词',
            hard: true,
            basePrice: 4800,
            pcVol: '约1.8万/月',
            mobVol: '约6.4万/月',
            doubaoVol: '约18~30万/月',
            dsVol: '约10~20万/月',
            ybVol: '约5~10万/月',
            qwVol: '约10~25万/月',
            rankPlatforms: ['Deepseek', '豆包'],
            includePlatforms: ['Deepseek', '千问']
          },
          {
            keyword: '3C外观缺陷检测设备哪家靠谱',
            type: '意图词',
            hard: false,
            basePrice: 3600,
            pcVol: '约1.1万/月',
            mobVol: '约4.2万/月',
            doubaoVol: '约10~20万/月',
            dsVol: '约5~10万/月',
            ybVol: '约3~5万/月',
            qwVol: '约5~10万/月',
            rankPlatforms: ['Deepseek'],
            includePlatforms: ['Deepseek', '豆包']
          }
        ]
      },
      {
        id: 'Q-20260916-01',
        title: '义乌电商个体户执照代办1',
        company: '义乌启航商贸服务有限公司',
        industry: '商务服务-代理',
        mode: '品牌曝光',
        status: 'history',
        createdAt: '2026-09-16 19:58',
        competitors: ['企服宝', '快法务'],
        items: [
          {
            keyword: '个体工商户代办公司推荐',
            type: '品类词',
            hard: true,
            priceOverride: 5390,
            basePrice: 5390,
            pcVol: '约2.5万/月',
            mobVol: '约12.4万/月',
            doubaoVol: '约30~50万/月',
            dsVol: '约5~10万/月',
            ybVol: '约5~10万/月',
            qwVol: '约10~30万/月',
            rankPlatforms: [],
            includePlatforms: ['Deepseek']
          },
          {
            keyword: '个人个体工商户代办公司哪家靠谱',
            type: '品类词',
            hard: false,
            priceOverride: 10780,
            basePrice: 10780,
            pcVol: '约2.4万/月',
            mobVol: '约11.9万/月',
            doubaoVol: '约30~50万/月',
            dsVol: '约5~10万/月',
            ybVol: '约5~10万/月',
            qwVol: '约10~30万/月',
            rankPlatforms: ['Deepseek', '豆包'],
            includePlatforms: []
          }
        ]
      },
      {
        id: 'Q-20260916-02',
        title: '义乌电商个体户执照代办',
        company: '义乌启航商贸服务有限公司',
        industry: '商务服务-代理',
        mode: '品牌曝光',
        status: 'history',
        createdAt: '2026-09-16 19:58',
        competitors: ['企服宝', '快法务'],
        items: [
          {
            keyword: '个体工商户代办公司推荐',
            type: '品类词',
            hard: true,
            priceOverride: 5390,
            basePrice: 5390,
            pcVol: '约2.5万/月',
            mobVol: '约12.4万/月',
            doubaoVol: '约30~50万/月',
            dsVol: '约5~10万/月',
            ybVol: '约5~10万/月',
            qwVol: '约10~30万/月',
            rankPlatforms: [],
            includePlatforms: ['Deepseek']
          },
          {
            keyword: '个人个体工商户代办公司哪家靠谱',
            type: '品类词',
            hard: false,
            priceOverride: 10780,
            basePrice: 10780,
            pcVol: '约2.4万/月',
            mobVol: '约11.9万/月',
            doubaoVol: '约30~50万/月',
            dsVol: '约5~10万/月',
            ybVol: '约5~10万/月',
            qwVol: '约10~30万/月',
            rankPlatforms: ['Deepseek', '豆包'],
            includePlatforms: []
          }
        ]
      }
    ];
  }

  function calcItemPrice(item) {
    if (item.priceOverride != null && item._locked) return item.priceOverride;
    const rankCnt = (item.rankPlatforms || []).length;
    const incCnt = (item.includePlatforms || []).length;
    if (item.priceOverride != null && !item._edited) return item.priceOverride;
    return Math.max(1200, (item.basePrice || 2800) + rankCnt * 1890 + incCnt * 690);
  }
  function calcQuoteTotal(q) {
    return (q.items || []).reduce((sum, it) => sum + calcItemPrice(it), 0);
  }

  function buildMatrixRows(task) {
    if (Array.isArray(task.matrix) && task.matrix.length) return task.matrix;
    const rand = seedRand(task.id + task.customer);
    const rivals = task.competitors && task.competitors.length ? task.competitors : ['行业头部A', '行业头部B', '行业头部C'];
    const plats = task.platforms && task.platforms.length ? task.platforms : BASE_PLATFORMS;
    const groups = [];
    (task.words || []).forEach(w => {
      const pRows = plats.map(pl => {
        const mention = Math.round((20 + rand() * 80) * 10) / 10;
        const top1 = Math.round(Math.min(mention, rand() * 70) * 10) / 10;
        const top2 = Math.round(Math.min(mention, top1 + rand() * 30) * 10) / 10;
        const top3 = Math.round(Math.min(mention, top2 + rand() * 25) * 10) / 10;
        const avgPos = (1.3 + rand() * 3.4).toFixed(1);
        const neutral = (94 + rand() * 5.9).toFixed(1);
        const rivalStats = rivals.map(r => {
          const rm = Math.round((45 + rand() * 55) * 10) / 10;
          const r1 = Math.round(Math.min(rm, 20 + rand() * 55) * 10) / 10;
          const r2 = Math.round(Math.min(rm, r1 + rand() * 30) * 10) / 10;
          const r3 = Math.round(Math.min(rm, r2 + rand() * 20) * 10) / 10;
          const rn = (95 + rand() * 4.8).toFixed(1);
          return { name: r, mention: rm.toFixed(1), top1: r1.toFixed(1), top2: r2.toFixed(1), top3: r3.toFixed(1), neutral: rn };
        });
        return {
          platform: pl,
          mention: mention.toFixed(1),
          top1: top1.toFixed(1),
          top2: top2.toFixed(1),
          top3: top3.toFixed(1),
          avgPos,
          neutral,
          rivals: rivalStats
        };
      });
      groups.push({ word: w.text, type: w.type || '品类词', rows: pRows });
    });
    return groups;
  }

  function defaultBaselinePro() {
    return [
      {
        id: 'BL-20261120-01',
        customer: '深圳禾叶创新科技有限公司',
        aliases: '深圳禾叶创新科技有限公司，禾叶创新，徕芬扫振电动牙刷',
        isOpportunity: false,
        parentId: null,
        competitorMode: 'AI推演',
        competitors: ['飞利浦', '欧乐B', 'usmile'],
        words: [
          { text: '电动牙刷哪个牌子好', type: '品类词' },
          { text: '扫振电动牙刷推荐测评', type: '意图词' },
          { text: '声波电动牙刷性价比排名', type: '品类词' },
          { text: '禾叶电动牙刷怎么样', type: '品牌词' }
        ],
        platforms: ['豆包', 'Deepseek', '通义千问', 'Kimi', '元宝', '文心一言', '智谱'],
        cycle: '1天',
        samples: 3,
        metrics: [...BASE_METRICS],
        createdAt: '2026-11-20 16:38:58',
        status: '分析完成',
        progress: '100.0%',
        matrix: [
          {
            word: '电动牙刷哪个牌子好',
            type: '品类词',
            rows: [
              {
                platform: '豆包', mention: '90.0', top1: '10.0', top2: '30.0', top3: '60.0', avgPos: '3.2', neutral: '99.8',
                rivals: [
                  { name: '飞利浦', mention: '100.0', top1: '50.0', top2: '100.0', top3: '100.0', neutral: '97.9' },
                  { name: '欧乐B', mention: '90.0', top1: '50.0', top2: '90.0', top3: '90.0', neutral: '95.1' },
                  { name: 'usmile', mention: '100.0', top1: '50.0', top2: '60.0', top3: '80.0', neutral: '99.5' }
                ]
              },
              {
                platform: 'Deepseek', mention: '100.0', top1: '70.0', top2: '80.0', top3: '80.0', avgPos: '1.7', neutral: '99.7',
                rivals: [
                  { name: '飞利浦', mention: '90.0', top1: '50.0', top2: '80.0', top3: '90.0', neutral: '97.7' },
                  { name: '欧乐B', mention: '100.0', top1: '50.0', top2: '70.0', top3: '90.0', neutral: '96.3' },
                  { name: 'usmile', mention: '100.0', top1: '80.0', top2: '90.0', top3: '100.0', neutral: '99.2' }
                ]
              },
              {
                platform: '通义千问', mention: '100.0', top1: '10.0', top2: '30.0', top3: '30.0', avgPos: '4.3', neutral: '99.5',
                rivals: [
                  { name: '飞利浦', mention: '100.0', top1: '50.0', top2: '100.0', top3: '100.0', neutral: '99.3' },
                  { name: '欧乐B', mention: '100.0', top1: '40.0', top2: '60.0', top3: '90.0', neutral: '98.4' },
                  { name: 'usmile', mention: '100.0', top1: '70.0', top2: '90.0', top3: '100.0', neutral: '99.6' }
                ]
              },
              {
                platform: 'Kimi', mention: '11.1', top1: '0.0', top2: '0.0', top3: '0.0', avgPos: '4.8', neutral: '100.0',
                rivals: [
                  { name: '飞利浦', mention: '100.0', top1: '60.0', top2: '90.0', top3: '100.0', neutral: '98.8' },
                  { name: '欧乐B', mention: '88.9', top1: '30.0', top2: '66.7', top3: '88.9', neutral: '96.0' },
                  { name: 'usmile', mention: '77.8', top1: '20.0', top2: '55.6', top3: '77.8', neutral: '99.1' }
                ]
              }
            ]
          },
          {
            word: '扫振电动牙刷推荐测评',
            type: '意图词',
            rows: [
              {
                platform: '豆包', mention: '85.0', top1: '40.0', top2: '65.0', top3: '80.0', avgPos: '2.1', neutral: '99.2',
                rivals: [
                  { name: '飞利浦', mention: '70.0', top1: '20.0', top2: '45.0', top3: '65.0', neutral: '97.5' },
                  { name: '欧乐B', mention: '60.0', top1: '15.0', top2: '35.0', top3: '55.0', neutral: '95.8' },
                  { name: 'usmile', mention: '80.0', top1: '30.0', top2: '55.0', top3: '75.0', neutral: '98.9' }
                ]
              },
              {
                platform: 'Deepseek', mention: '95.0', top1: '60.0', top2: '85.0', top3: '95.0', avgPos: '1.5', neutral: '99.6',
                rivals: [
                  { name: '飞利浦', mention: '65.0', top1: '15.0', top2: '40.0', top3: '60.0', neutral: '97.2' },
                  { name: '欧乐B', mention: '55.0', top1: '10.0', top2: '30.0', top3: '50.0', neutral: '96.1' },
                  { name: 'usmile', mention: '75.0', top1: '25.0', top2: '50.0', top3: '70.0', neutral: '99.0' }
                ]
              }
            ]
          },
          {
            word: '禾叶电动牙刷怎么样',
            type: '品牌词',
            rows: [
              {
                platform: '豆包', mention: '100.0', top1: '90.0', top2: '100.0', top3: '100.0', avgPos: '1.1', neutral: '98.9',
                rivals: [
                  { name: '飞利浦', mention: '40.0', top1: '0.0', top2: '20.0', top3: '35.0', neutral: '98.0' },
                  { name: '欧乐B', mention: '30.0', top1: '0.0', top2: '15.0', top3: '25.0', neutral: '96.5' },
                  { name: 'usmile', mention: '50.0', top1: '10.0', top2: '30.0', top3: '45.0', neutral: '98.7' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'BL-20261120-02',
        customer: '远山智能科技有限公司',
        aliases: '远山智能，远山视觉，YS-Vision',
        isOpportunity: false,
        parentId: null,
        competitorMode: 'AI推演',
        competitors: ['基恩士', '康耐视', '海康机器人'],
        words: [
          { text: '工业视觉检测系统哪家好', type: '品类词' },
          { text: '3C外观缺陷检测设备推荐', type: '意图词' },
          { text: '远山智能视觉检测怎么样', type: '品牌词' },
          { text: '国产机器视觉品牌对比', type: '意图词' }
        ],
        platforms: ['豆包', 'Deepseek', '通义千问', 'Kimi', '元宝', '文心一言', '智谱'],
        cycle: '1天',
        samples: 3,
        metrics: [...BASE_METRICS],
        createdAt: '2026-11-20 16:38:54',
        status: '分析完成',
        progress: '100.0%'
      },
      {
        id: 'BL-20261120-03',
        customer: '北京派特博恩生物技术开发集团有限公司',
        aliases: '派特博恩，派特灵',
        isOpportunity: false,
        parentId: null,
        competitorMode: 'AI推演',
        competitors: ['乳酸菌阴道胶囊', '益君康', '脉君安片'],
        words: [
          { text: 'HPV护理生物制剂品牌推荐', type: '品类词' }
        ],
        platforms: ['豆包', 'Deepseek', '通义千问', 'Kimi', '元宝', '文心一言', '智谱'],
        cycle: '1天',
        samples: 3,
        metrics: [...BASE_METRICS],
        createdAt: '2026-11-20 16:37:50',
        status: '分析完成',
        progress: '100.0%'
      }
    ];
  }

  // Ensure flagship GEO diagnosis report sample exists (matching Screenshot 6)
  if (typeof reportTasks !== 'undefined' && Array.isArray(reportTasks) && !reportTasks.some(r => r.brand === '徕芬')) {
    reportTasks.unshift({
      name: '徕芬',
      brand: '徕芬',
      products: ['高速吹风机', '扫振电动牙刷'],
      competitors: ['小米', '戴尔', '戴森'],
      platforms: ['豆包', 'DeepSeek', '通义千问', 'Kimi', '元宝', '文心一言'],
      mode: '深度分析',
      industry: '家用电器 / 家用电器',
      reportDate: '2026-11-18',
      modules: ['整体表现', '场景分析', '竞品对比', '品牌舆情', '信源诊断', '优化机会', '案例参考', '诊断证据']
    });
  }

  // ---------- Component State ----------
  const state = {
    kwSubView: 'form', // 'form' | 'favorites'
    favTab: 'active',  // 'active' | 'history'
    activeQuoteId: null,
    kwDraft: {
      company: '',
      product: '',
      keyword: '',
      industry: '',
      subIndustry: '',
      suffixes: ['推荐', '哪家靠谱'],
      competitors: [],
      rivalInput: '',
      customOn: false,
      customInput: '',
      customKeywords: []
    },
    baseSubView: 'list', // 'list' | 'result'
    baseSelectedIds: new Set(),
    baseFilter: { search: '', status: '全部状态' },
    activeBaseId: null,
    baseResultType: '全部',
    wizStep: 1,
    wizDraft: null,
    diagSubView: 'list', // 'list' | 'viewer'
    activeDiagIdx: 0,
    diagTab: 'overview',
    diagEvidencePlat: '全部'
  };

  function getQuotes() {
    let list = load(kwQuotesKey(), null);
    if (!Array.isArray(list) || !list.length) {
      list = defaultQuotes();
      save(kwQuotesKey(), list);
    }
    return list;
  }
  function saveQuotes(list) {
    save(kwQuotesKey(), list);
  }
  function getBaselines() {
    let list = load(baseProKey(), null);
    if (!Array.isArray(list) || !list.length) {
      list = defaultBaselinePro();
      save(baseProKey(), list);
    }
    return list;
  }
  function saveBaselines(list) {
    save(baseProKey(), list);
  }

  // ==========================================================================
  // MODULE 1: 选词工具 (Screenshots 1 & 2)
  // ==========================================================================
  function renderKeywordTopbar(quotes) {
    const activeCnt = quotes.filter(q => q.status === 'active').length;
    const totalCnt = quotes.length;
    return `<div class="spro-topbar">
      <div>
        <h1>${esc(data.brand)}选词工具</h1>
        <p class="spro-sub">请输入客户基础信息，系统将自动推荐购买词条，并生成预估报价</p>
      </div>
      <div class="spro-head-actions">
        <button type="button" class="spro-btn-benefit" data-spro="kw-benefits">★ 权益</button>
        <button type="button" class="spro-btn-violet" data-spro="kw-open-fav">📑 估价收藏夹 (${totalCnt})</button>
        <button type="button" class="spro-btn-outline" data-spro="kw-new-form">＋ 新增企业选词估价</button>
      </div>
    </div>`;
  }

  function renderKeywordForm(quotes) {
    const d = state.kwDraft;
    const subOpts = SPRO_INDUSTRIES[d.industry] || [];
    const rivalOk = d.competitors.length >= 2;
    return renderKeywordTopbar(quotes) + `
      <section class="spro-kw-shell">
        <div class="spro-kw-head">
          <div class="spro-kw-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4Z"/><path d="M19 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"/></svg>
          </div>
          <div>
            <h2>客户信息录入</h2>
            <p>输入您的公司和产品信息，开始智能分析</p>
          </div>
        </div>
        <div class="spro-amber-alert">
          <span>ⓘ</span>
          <span>请填写真实信息，后续会有专人审核，若填写虚假信息，关键词或报价会被驳回。</span>
        </div>

        <form id="spro-kw-form">
          <div class="spro-form-group">
            <label class="spro-form-label" for="spro-company">公司名称 <span class="req">*</span></label>
            <input id="spro-company" name="company" class="spro-input" placeholder="请输入工商注册的公司全名" value="${esc(d.company)}" maxlength="100">
          </div>

          <div class="spro-form-group">
            <label class="spro-form-label" for="spro-product">产品/服务/业务名称（请填写一个） <span class="req">*</span></label>
            <input id="spro-product" name="product" class="spro-input" placeholder="请输入产品名称，例如玻璃钢管道" value="${esc(d.product)}" maxlength="80">
            <div class="spro-field-tip">ⓘ 请输入产品/服务业务名称，例如：工业视觉检测系统、全屋定制方案、净水滤芯</div>
          </div>

          <div class="spro-form-group">
            <label class="spro-form-label" for="spro-keyword">产品/服务/业务关键词（请填写一个） <span class="req">*</span></label>
            <input id="spro-keyword" name="keyword" class="spro-input" placeholder="请输入您的产品/服务/业务，例如设备管理系统、离婚律所、制冰机厂家、折叠屏手机" value="${esc(d.keyword)}" maxlength="80">
            <div class="spro-field-tip">ⓘ 请输入您的产品/服务/业务关键词，例如设备管理系统、离婚律所、制冰机厂家、折叠屏手机</div>
          </div>

          <div class="spro-industry-box">
            <div class="spro-industry-top">
              <span class="spro-form-label" style="margin:0">行业 <span class="req">*</span></span>
              <button type="button" class="spro-btn-violet-outline" style="padding:5px 11px;font-size:12px" data-spro="kw-identify">✦ 智能识别</button>
            </div>
            <div class="spro-industry-grid">
              <select name="industry" class="spro-select" aria-label="一级行业">
                <option value="">请选择一级行业</option>
                ${Object.keys(SPRO_INDUSTRIES).map(k => `<option value="${esc(k)}" ${d.industry === k ? 'selected' : ''}>${esc(k)}</option>`).join('')}
              </select>
              <select name="subIndustry" class="spro-select" aria-label="二级行业" ${d.industry ? '' : 'disabled'}>
                <option value="">${d.industry ? '请选择二级行业' : '请先选择一级行业'}</option>
                ${subOpts.map(k => `<option value="${esc(k)}" ${d.subIndustry === k ? 'selected' : ''}>${esc(k)}</option>`).join('')}
              </select>
            </div>
            <div class="spro-field-tip">ⓘ 可手动选择，也可根据公司名称、产品名称和产品关键词智能识别</div>
          </div>

          <div class="spro-form-group">
            <div class="spro-form-label">关键词语义后缀 <span class="req">*</span> <span class="sub">（必填，可多选）</span></div>
            <div class="spro-suffix-row">
              ${SUFFIX_OPTIONS.map(sf => `
                <button type="button" class="spro-suffix-pill ${d.suffixes.includes(sf) ? 'active' : ''}" data-spro="kw-toggle-suffix" data-val="${esc(sf)}">${esc(sf)}</button>
              `).join('')}
            </div>
            <div class="spro-field-tip warn">⏱ 至少选择1个；选择越多，生成和评估时间越长，全选会明显更慢。</div>
          </div>

          <div class="spro-form-group">
            <div class="spro-form-label">竞品 <span class="req">*</span> <span class="sub">（至少输入2个）</span></div>
            <div class="spro-rival-input-row">
              <input id="spro-rival-input" name="rivalInput" class="spro-input" placeholder="输入竞品名称后按回车添加" value="${esc(d.rivalInput)}" maxlength="40">
              <button type="button" class="spro-rival-add-btn" data-spro="kw-add-rival" title="添加竞品">＋</button>
            </div>
            ${d.competitors.length ? `<div class="spro-chip-list">${d.competitors.map((r, i) => `
              <span class="spro-chip violet">${esc(r)} <button type="button" data-spro="kw-del-rival" data-idx="${i}" aria-label="删除">×</button></span>
            `).join('')}</div>` : ''}
            <div class="spro-field-tip ${rivalOk ? 'ok' : ''}">
              ${rivalOk ? `✓ 已添加 ${d.competitors.length} 个竞品，满足分析要求` : `至少需要添加2个竞品（已添加 ${d.competitors.length} 个）`}
            </div>
          </div>

          <div class="spro-toggle-card">
            <div class="spro-toggle-head">
              <div>
                <b>自主选词</b>
                <small>客户已经指定关键词时开启，最多填写20个。</small>
              </div>
              <label class="spro-switch" aria-label="开启自主选词">
                <input type="checkbox" id="spro-custom-toggle" ${d.customOn ? 'checked' : ''}>
                <span class="spro-switch-slider"></span>
              </label>
            </div>
            ${d.customOn ? `<div class="spro-custom-kw-body">
              <div class="spro-rival-input-row">
                <input id="spro-custom-kw-input" name="customInput" class="spro-input" placeholder="输入客户指定的关键词（可用逗号分隔），按回车或点添加" value="${esc(d.customInput)}" maxlength="200">
                <button type="button" class="spro-btn-violet-outline" data-spro="kw-add-custom" style="white-space:nowrap">＋ 添加词条</button>
              </div>
              ${d.customKeywords.length ? `<div class="spro-chip-list">${d.customKeywords.map((kw, i) => `
                <span class="spro-chip">${esc(kw)} <button type="button" data-spro="kw-del-custom" data-idx="${i}">×</button></span>
              `).join('')}</div>` : ''}
              <div class="spro-field-tip">已添加 ${d.customKeywords.length} / 20 个自主指定关键词</div>
            </div>` : ''}
          </div>

          <button type="submit" class="spro-btn-violet spro-submit-full">✦ 开始分析</button>
        </form>
      </section>
    `;
  }

  function renderKeywordFavorites(quotes) {
    const activeList = quotes.filter(q => q.status === 'active');
    const historyList = quotes.filter(q => q.status !== 'active');
    const curList = state.favTab === 'active' ? activeList : historyList;
    const focusQuote = curList[0] || quotes[0];
    const isReadOnly = state.favTab === 'history';

    const quoteCardsHtml = curList.length ? curList.map(q => {
      const total = calcQuoteTotal(q);
      return `<article class="spro-quote-card">
        <div class="spro-quote-head">
          <div>
            <div class="spro-quote-title-row">
              <h3>${esc(q.title)}</h3>
              <span class="spro-tag-blue">▤ ${esc(q.mode || '品牌曝光')}</span>
              ${q.status === 'active' ? '<span class="spro-tag-green">可用</span>' : '<span class="spro-tag-muted">已过期</span>'}
            </div>
            <div class="spro-quote-time">🕒 ${esc(q.createdAt)} · 客户：${esc(q.company)} · 行业：${esc(q.industry)}</div>
          </div>
          <div class="spro-quote-right">
            <span class="spro-price-total">¥${total.toLocaleString('zh-CN')}</span>
            <button type="button" class="spro-btn-outline" style="padding:6px 12px;font-size:12.5px" data-spro="kw-reselect" data-qid="${esc(q.id)}">重新选词 ↗</button>
          </div>
        </div>
        <div class="spro-detail-label">词条明细</div>
        <div class="spro-kw-grid">
          ${q.items.map((it, idx) => {
            const p = calcItemPrice(it);
            return `<div class="spro-kw-item">
              <div class="spro-kw-item-head">
                <div class="spro-kw-name-wrap">
                  <span class="spro-kw-name ${it.hard ? 'hard' : ''}">${esc(it.keyword)}</span>
                  ${it.hard ? '<span class="spro-hard-badge">难</span>' : ''}
                  <span class="spro-cat-badge">${esc(it.type || '品类词')}</span>
                </div>
                <span class="spro-kw-price">¥${p.toLocaleString('zh-CN')}</span>
              </div>
              ${it.hard ? `<div class="spro-hard-tip">该关键词竞争及优化难度较高，下单后将以 50% 收录率为交付标准，请重点知悉；您也可选择适配度更高的关键词。</div>` : ''}
              <div class="spro-vol-grid">
                <div>PC搜索引擎搜索量<b>${esc(it.pcVol)}</b></div>
                <div>移动搜索引擎搜索量<b>${esc(it.mobVol)}</b></div>
                <div>豆包<b>${esc(it.doubaoVol)}</b></div>
                <div>DeepSeek<b>${esc(it.dsVol)}</b></div>
                <div>元宝<b>${esc(it.ybVol)}</b></div>
                <div>千问<b>${esc(it.qwVol)}</b></div>
              </div>
              <div class="spro-plat-row">
                <span class="spro-plat-label">排名平台 🏆</span>
                ${KW_PLATFORMS.map(pl => {
                  const on = (it.rankPlatforms || []).includes(pl);
                  return `<button type="button" class="spro-plat-chip ${on ? 'rank-on' : ''} ${isReadOnly ? 'readonly' : ''}"
                    ${isReadOnly ? 'disabled' : ''} data-spro="kw-toggle-plat" data-qid="${esc(q.id)}" data-idx="${idx}" data-kind="rank" data-plat="${esc(pl)}">${on ? '✓ ' : ''}${esc(pl)}</button>`;
                }).join('')}
              </div>
              <div class="spro-plat-row">
                <span class="spro-plat-label">收录平台 📑</span>
                ${KW_PLATFORMS.map(pl => {
                  const on = (it.includePlatforms || []).includes(pl);
                  return `<button type="button" class="spro-plat-chip ${on ? 'inc-on' : ''} ${isReadOnly ? 'readonly' : ''}"
                    ${isReadOnly ? 'disabled' : ''} data-spro="kw-toggle-plat" data-qid="${esc(q.id)}" data-idx="${idx}" data-kind="inc" data-plat="${esc(pl)}">${on ? '✓ ' : ''}${esc(pl)}</button>`;
                }).join('')}
              </div>
            </div>`;
          }).join('')}
        </div>
      </article>`;
    }).join('') : `<div class="panel pad" style="text-align:center;color:var(--muted);padding:40px">暂无该分类下的询价单，点击右上角「＋ 新增企业选词估价」生成。</div>`;

    return renderKeywordTopbar(quotes) + `
      <div class="spro-fav-context">
        <div class="spro-fav-meta">
          <button type="button" class="spro-btn-outline" style="padding:6px 12px;font-size:12.5px" data-spro="kw-back-form">← 返回选词录入</button>
          <span>公司名称<b>${esc(focusQuote ? focusQuote.company : '暂无')}</b></span>
          <span>行业<b>${esc(focusQuote ? focusQuote.industry : '—')}</b></span>
        </div>
        <button type="button" class="spro-btn-violet-outline" data-spro="kw-export-fav">⬇ 批量导出</button>
      </div>
      <div class="spro-fav-tabs-row">
        <div class="spro-seg">
          <button type="button" class="${state.favTab === 'active' ? 'active' : ''}" data-spro="kw-fav-tab" data-tab="active">当前可用询价单 ${activeList.length}</button>
          <button type="button" class="${state.favTab === 'history' ? 'active' : ''}" data-spro="kw-fav-tab" data-tab="history">历史询价单 ${historyList.length}</button>
        </div>
        <span class="spro-readonly-note">${isReadOnly ? '🔒 历史询价单只读，不支持编辑或估价' : '💡 点击当前可用询价单中的平台芯片可实时微调预估报价'}</span>
      </div>
      ${quoteCardsHtml}
    `;
  }

  function renderKeywordModule() {
    const quotes = getQuotes();
    const content = state.kwSubView === 'favorites' ? renderKeywordFavorites(quotes) : renderKeywordForm(quotes);
    return salesSimpleBar('keywords') + content;
  }

  // ==========================================================================
  // MODULE 2: 售前基线测算 (Screenshots 3, 4, 5)
  // ==========================================================================
  function renderBaselineList() {
    const all = getBaselines();
    const parents = all.filter(t => !t.parentId);
    const oppCount = all.filter(t => Boolean(t.parentId)).length;
    const runningCnt = all.filter(t => t.status === '进行中').length;
    const doneCnt = all.filter(t => t.status === '分析完成').length;

    const q = state.baseFilter.search.trim().toLowerCase();
    const stFilter = state.baseFilter.status;
    // Preserve parent-child relationship during filter
    const orderedRows = [];
    parents.forEach(p => {
      const children = all.filter(c => c.parentId === p.id);
      const matchTask = t => {
        const hitSearch = !q || t.customer.toLowerCase().includes(q) || (t.words || []).some(w => w.text.toLowerCase().includes(q));
        const hitStatus = stFilter === '全部状态' || t.status === stFilter;
        return hitSearch && hitStatus;
      };
      const pMatch = matchTask(p);
      const matchedChildren = children.filter(matchTask);
      if (pMatch || matchedChildren.length) {
        orderedRows.push(p);
        (pMatch ? children : matchedChildren).forEach(c => orderedRows.push(c));
      }
    });

    const selectedCount = [...state.baseSelectedIds].filter(id => all.some(t => t.id === id)).length;
    const allChecked = orderedRows.length > 0 && orderedRows.every(r => state.baseSelectedIds.has(r.id));

    return salesSimpleBar('baseline') + `
      <div class="spro-topbar">
        <div>
          <h1>售前基线测算任务列表</h1>
          <p class="spro-sub">机会词探索作为原任务的子项展示，每个任务最多测算2次</p>
        </div>
        <div class="spro-head-actions">
          <span class="spro-limit-pill">每人每日最多可新建5个首次测算任务，机会词探索不占用该次数。</span>
          <button type="button" class="spro-btn-blue" data-spro="base-open-wiz">＋ 新建测算</button>
        </div>
      </div>

      <div class="spro-summary-bar">
        <div class="spro-summary-stats">
          <div class="spro-stat-block">
            <strong>共 ${parents.length} 个客户任务</strong>
            <small>首次基线测算 + ${oppCount} 次机会词测算</small>
          </div>
          <div class="spro-stat-div"></div>
          <div class="spro-stat-block"><strong>${runningCnt}</strong> <span style="font-size:13px;color:var(--muted)">进行中</span></div>
          <div class="spro-stat-div"></div>
          <div class="spro-stat-block"><strong>${doneCnt}</strong> <span style="font-size:13px;color:var(--muted)">已完成</span></div>
        </div>
        <div class="spro-head-actions">
          <button type="button" class="spro-btn-outline" data-spro="base-refresh">↻ 刷新列表</button>
          <button type="button" class="spro-btn-outline" data-spro="base-export-selected">⬇ 导出已选 (${selectedCount})</button>
        </div>
      </div>

      <div class="spro-filter-bar">
        <div class="spro-filter-left">
          <input type="search" id="spro-base-search" placeholder="搜索客户名称或测算词" value="${esc(state.baseFilter.search)}">
          <select id="spro-base-status" aria-label="任务状态">
            ${['全部状态', '分析完成', '进行中'].map(s => `<option value="${s}" ${stFilter === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <button type="button" class="spro-btn-outline" style="padding:6px 12px" data-spro="base-apply-filter">筛选</button>
          <button type="button" class="link-button" data-spro="base-reset-filter">重置</button>
        </div>
        <small style="color:var(--subtle)">筛选时保留父子关系</small>
      </div>

      <section class="spro-table-card">
        <div class="scroll">
          <table>
            <thead>
              <tr>
                <th style="width:36px"><input type="checkbox" id="spro-base-check-all" ${allChecked ? 'checked' : ''} aria-label="全选"></th>
                <th>客户任务 / 测算子项</th>
                <th>指定竞品</th>
                <th>测算词</th>
                <th>AI平台</th>
                <th>监测周期</th>
                <th>创建时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${orderedRows.length ? orderedRows.map(t => {
                const isChild = Boolean(t.parentId);
                const visiblePlats = (t.platforms || []).slice(0, 4);
                const extraPlats = Math.max(0, (t.platforms || []).length - 4);
                const [dDate, dTime] = String(t.createdAt || '').split(' ');
                const oppChildCnt = all.filter(x => x.parentId === t.id).length;
                return `<tr class="${isChild ? 'spro-child-row' : ''}">
                  <td><input type="checkbox" class="spro-base-chk" data-id="${esc(t.id)}" ${state.baseSelectedIds.has(t.id) ? 'checked' : ''}></td>
                  <td>
                    <div class="${isChild ? 'spro-child-indent' : ''}">
                      <b>${esc(t.customer)}</b>
                      <div style="margin-top:3px;font-size:12px;color:var(--muted)">
                        ${isChild ? `<span class="spro-tag-blue" style="margin-right:4px">机会词探索</span>子项 #${esc(t.oppIndex || 1)}` : '首次基线测算'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="spro-rival-stack">
                      <span class="spro-ai-tag">${esc(t.competitorMode || 'AI推演')}</span>
                      ${(t.competitors || []).map(r => `<span class="spro-mini-chip">${esc(r)}</span>`).join('')}
                    </div>
                  </td>
                  <td style="white-space:nowrap"><b style="color:#2563eb;font-size:15px">${(t.words || []).length}</b> <span style="color:var(--muted);font-size:12.5px">个核心词</span></td>
                  <td>
                    <div class="spro-plat-wrap" title="${esc((t.platforms || []).join('、'))}">
                      ${visiblePlats.map(pl => `<span class="spro-mini-chip">${esc(pl)}</span>`).join('')}
                      ${extraPlats > 0 ? `<span class="spro-mini-chip">+${extraPlats}</span>` : ''}
                    </div>
                  </td>
                  <td style="white-space:nowrap;font-weight:600">${esc(t.cycle || '1天')}</td>
                  <td style="white-space:nowrap;color:var(--muted);font-size:12px">${esc(dDate || '')}<br>${esc(dTime || '')}</td>
                  <td style="white-space:nowrap">
                    <span class="spro-tag-green">${esc(t.status || '分析完成')}</span>
                    <div style="margin-top:4px;font-size:12px;color:var(--muted)">${esc(t.progress || '100.0%')}</div>
                  </td>
                  <td>
                    <div class="spro-action-col">
                      <button type="button" class="spro-act-link" data-spro="base-view" data-id="${esc(t.id)}">👁 查看结果</button>
                      ${!isChild ? `<button type="button" class="spro-act-link" data-spro="base-opp" data-id="${esc(t.id)}" ${oppChildCnt >= 2 ? 'disabled style="opacity:.45;cursor:not-allowed"' : ''}>✦ 探索机会词${oppChildCnt ? ` (${oppChildCnt}/2)` : ''}</button>` : ''}
                      <button type="button" class="spro-act-link" data-spro="base-copy" data-id="${esc(t.id)}">❐ 复制任务</button>
                      <button type="button" class="spro-act-link" data-spro="base-export-one" data-id="${esc(t.id)}">⬇ 导出结果</button>
                      <button type="button" class="spro-act-link danger" data-spro="base-delete" data-id="${esc(t.id)}">🗑 删除</button>
                    </div>
                  </td>
                </tr>`;
              }).join('') : `<tr><td colspan="9" class="empty">没有符合条件的基线测算任务</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderBaselineResult() {
    const all = getBaselines();
    const task = all.find(t => t.id === state.activeBaseId) || all[0];
    if (!task) { state.baseSubView = 'list'; return renderBaselineList(); }
    const matrix = buildMatrixRows(task);
    const filteredGroups = state.baseResultType === '全部'
      ? matrix
      : matrix.filter(g => g.type === state.baseResultType);

    return salesSimpleBar('baseline') + `
      <div class="spro-res-header">
        <div class="spro-res-back-wrap">
          <button type="button" class="spro-back-circle" data-spro="base-back" title="返回任务列表">←</button>
          <div>
            <h1 style="margin:0;font-size:21px;font-weight:750">售前基线测算结果</h1>
            <p class="spro-sub" style="margin:3px 0 0">${esc(task.customer)} · ${esc(task.cycle || '1天')} · ${(task.platforms || []).length}个AI平台</p>
          </div>
        </div>
        <div class="spro-head-actions">
          <button type="button" class="spro-btn-violet-outline" data-spro="base-opp" data-id="${esc(task.parentId || task.id)}">✦ 探索机会词</button>
          <button type="button" class="spro-btn-blue" data-spro="base-export-one" data-id="${esc(task.id)}">⬇ 导出结果</button>
        </div>
      </div>

      <div style="margin-bottom:16px">
        <span class="spro-tag-green" style="margin-bottom:8px">成功</span>
        <h2 style="margin:6px 0 4px;font-size:18px;font-weight:800;color:var(--ink)">${esc(task.customer)} AI基线测算报告</h2>
        <p style="margin:0;font-size:12.5px;color:var(--muted)">本报告展示核心词在各AI平台的测算明细。</p>
      </div>

      <section class="spro-matrix-card">
        <div class="spro-matrix-head">
          <div>
            <h3 style="margin:0;font-size:15px;font-weight:750">核心词在各AI平台的测算明细</h3>
            <small style="color:var(--muted)">仅展示本次创建任务时选择的指标。</small>
          </div>
          <div class="spro-type-pills">
            ${['全部', '品类词', '意图词', '品牌词'].map(tp => `
              <button type="button" class="spro-type-pill ${state.baseResultType === tp ? 'active' : ''}" data-spro="base-res-type" data-type="${tp}">${tp}</button>
            `).join('')}
          </div>
        </div>
        <div class="scroll">
          <table class="spro-matrix-table">
            <thead>
              <tr>
                <th>核心词</th>
                <th>词类型</th>
                <th>AI平台</th>
                <th>品牌提及率</th>
                <th>榜一率</th>
                <th>排名前二率</th>
                <th>排名前三率</th>
                <th>平均排名</th>
                <th>中正率</th>
                <th style="min-width:300px">竞品指标</th>
              </tr>
            </thead>
            <tbody>
              ${filteredGroups.length ? filteredGroups.map(g => g.rows.map((r, rIdx) => `
                <tr>
                  ${rIdx === 0 ? `<td class="kw-group-cell" rowspan="${g.rows.length}">${esc(g.word)}</td>` : ''}
                  ${rIdx === 0 ? `<td rowspan="${g.rows.length}" style="white-space:nowrap;color:var(--muted)">${esc(g.type)}</td>` : ''}
                  <td style="white-space:nowrap;font-weight:600">${esc(r.platform)}</td>
                  <td class="spro-num-blue">${esc(r.mention)}%</td>
                  <td>${esc(r.top1)}%</td>
                  <td>${esc(r.top2)}%</td>
                  <td>${esc(r.top3)}%</td>
                  <td>${esc(r.avgPos)}</td>
                  <td class="spro-num-blue">${esc(r.neutral)}%</td>
                  <td>
                    ${(r.rivals || []).map(rv => `
                      <div class="spro-rival-line">
                        <b>${esc(rv.name)}</b>提及 ${esc(rv.mention)}% · 榜一 ${esc(rv.top1)}% · 排名前二率 ${esc(rv.top2)}% · 排名前三率 ${esc(rv.top3)}% · 中正 ${esc(rv.neutral)}%
                      </div>
                    `).join('')}
                  </td>
                </tr>
              `).join('')).join('') : `<tr><td colspan="10" class="empty">该词类型下暂无测算明细</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderBaselineModule() {
    return state.baseSubView === 'result' ? renderBaselineResult() : renderBaselineList();
  }

  // ---------- 3-Step Baseline Wizard Modal (Screenshot 4) ----------
  function openBaselineWizard(prefillTask = null) {
    state.wizStep = 1;
    state.wizDraft = prefillTask ? {
      customer: prefillTask.customer,
      aliases: prefillTask.aliases || prefillTask.customer,
      competitors: [...(prefillTask.competitors || [])].slice(0, 3),
      words: (prefillTask.words || []).map(w => ({ ...w })),
      wordsPending: '',
      wordType: '品类词',
      platforms: [...(prefillTask.platforms || BASE_PLATFORMS)],
      cycle: prefillTask.cycle || '1天',
      samples: String(prefillTask.samples || 3),
      metrics: [...(prefillTask.metrics || BASE_METRICS)]
    } : {
      customer: '',
      aliases: '',
      competitors: [],
      words: [],
      wordsPending: '',
      wordType: '品类词',
      platforms: [...BASE_PLATFORMS],
      cycle: '1天',
      samples: '3',
      metrics: [...BASE_METRICS]
    };
    renderWizardModal();
  }

  function syncWizardInputsFromDom() {
    const form = $('#spro-wiz-form');
    if (!form || !state.wizDraft) return;
    const fd = new FormData(form);
    if (state.wizStep === 1) {
      state.wizDraft.customer = String(fd.get('customer') || '').trim();
      state.wizDraft.aliases = String(fd.get('aliases') || '').trim();
      state.wizDraft.competitors = fd.getAll('competitor').map(x => String(x).trim());
      state.wizDraft.wordsPending = String(fd.get('wordsPending') || '');
      state.wizDraft.wordType = String(fd.get('wordType') || '品类词');
    } else if (state.wizStep === 2) {
      state.wizDraft.platforms = fd.getAll('platform');
      state.wizDraft.cycle = String(fd.get('cycle') || '1天');
      state.wizDraft.samples = String(fd.get('samples') || '3');
    } else if (state.wizStep === 3) {
      state.wizDraft.metrics = fd.getAll('metric');
    }
  }

  function renderWizardModal(errorMsg = '') {
    const w = state.wizDraft;
    const step = state.wizStep;
    const stepNames = ['客户与词配置', '监测范围', '指标与确认'];
    const price = accGetHqRates(tenantId).baseline;
    const bal = accGetBalance(tenantId);

    let stepBody = '';
    if (step === 1) {
      stepBody = `
        <div style="margin-bottom:14px">
          <h3 style="margin:0 0 3px;font-size:15.5px;font-weight:750">先填写客户和要测的词</h3>
          <small style="color:var(--muted)">客户名称、品牌提及词和核心词都需要填写；指定竞品可选填</small>
        </div>
        <div class="spro-form-group">
          <label class="spro-form-label" for="wiz-cust">客户名称 <span class="req">*</span></label>
          <input id="wiz-cust" name="customer" class="spro-input" placeholder="请输入客户名称" value="${esc(w.customer)}" maxlength="80">
        </div>
        <div class="spro-form-group">
          <label class="spro-form-label" for="wiz-alias">品牌提及词 <span class="req">*</span> <span class="sub">请填写客户全称、简称、产品名；多个词可用逗号或换行分隔</span></label>
          <textarea id="wiz-alias" name="aliases" class="spro-textarea" rows="2" placeholder="例如：客户公司全称，客户简称，产品名称">${esc(w.aliases)}</textarea>
        </div>
        <div class="spro-form-group">
          <div class="spro-wiz-header-row">
            <span class="spro-form-label" style="margin:0">指定竞品品牌 <span class="spro-tag-muted">选填</span> <span class="sub">填写后，结果只输出这些竞品；不填写则由系统自动识别竞品</span></span>
            <span class="spro-wiz-count">已填写 ${w.competitors.filter(Boolean).length}/3 个竞品</span>
          </div>
          ${w.competitors.length ? `<div style="display:grid;gap:8px;margin-bottom:8px">${w.competitors.map((c, i) => `
            <div style="display:flex;gap:8px">
              <input name="competitor" class="spro-input" placeholder="输入竞品品牌名称 ${i + 1}" value="${esc(c)}" maxlength="40">
              <button type="button" class="spro-btn-outline" style="padding:0 12px" data-spro="wiz-del-rival" data-idx="${i}">×</button>
            </div>
          `).join('')}</div>` : ''}
          <button type="button" class="spro-dashed-btn" data-spro="wiz-add-rival" ${w.competitors.length >= 3 ? 'disabled style="opacity:.5"' : ''}>＋ 添加竞品</button>
          <div class="spro-field-tip">最多指定3个竞品品牌；指定但未被AI提及时，竞品指标显示为0%。</div>
        </div>
        <div class="spro-form-group" style="margin-bottom:6px">
          <div class="spro-wiz-header-row">
            <span class="spro-form-label" style="margin:0">核心词 <span class="req">*</span> <span class="sub">同一类型的词可以一次粘贴多个，用逗号或换行分隔</span></span>
            <span class="spro-wiz-count">已添加 ${w.words.length}/20 个核心词</span>
          </div>
          <div class="spro-kw-add-row">
            <textarea name="wordsPending" class="spro-textarea" rows="2" placeholder="请输入核心词；多个词可用逗号或换行分隔">${esc(w.wordsPending)}</textarea>
            <select name="wordType" class="spro-select" aria-label="核心词类型">
              ${['品类词', '意图词', '品牌词'].map(t => `<option value="${t}" ${w.wordType === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
            <button type="button" class="spro-btn-blue" style="height:40px" data-spro="wiz-add-words">＋ 添加核心词</button>
          </div>
          <div class="spro-field-tip">先选择本次词的类型，再点击“添加核心词”；每个任务最多添加20个。</div>
          ${w.words.length ? `<div class="spro-chip-list">${w.words.map((item, i) => `
            <span class="spro-chip violet">${esc(item.type)} · ${esc(item.text)} <button type="button" data-spro="wiz-del-word" data-idx="${i}">×</button></span>
          `).join('')}</div>` : ''}
        </div>
      `;
    } else if (step === 2) {
      stepBody = `
        <div style="margin-bottom:14px">
          <h3 style="margin:0 0 3px;font-size:15.5px;font-weight:750">选择监测范围与 AI 平台</h3>
          <small style="color:var(--muted)">勾选需要采样测算的 AI 平台与监测周期</small>
        </div>
        <div class="spro-form-group">
          <div class="spro-form-label">AI 平台 <span class="req">*</span> <span class="sub">已选 ${w.platforms.length} 个</span></div>
          <div class="spro-check-grid">
            ${BASE_PLATFORMS.map(pl => `
              <label class="spro-check-card">
                <input type="checkbox" name="platform" value="${esc(pl)}" ${w.platforms.includes(pl) ? 'checked' : ''}>
                <span>${esc(pl)}</span>
              </label>
            `).join('')}
          </div>
        </div>
        <div class="spro-industry-grid">
          <div class="spro-form-group">
            <label class="spro-form-label" for="wiz-cycle">监测周期</label>
            <select id="wiz-cycle" name="cycle" class="spro-select">
              ${['1天', '3天', '7天'].map(c => `<option value="${c}" ${w.cycle === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="spro-form-group">
            <label class="spro-form-label" for="wiz-samples">每词每平台抽样次数</label>
            <input id="wiz-samples" name="samples" type="number" min="1" max="10" class="spro-input" value="${esc(w.samples)}">
          </div>
        </div>
      `;
    } else {
      const totalCalls = w.words.length * w.platforms.length * Number(w.samples || 3);
      const lack = bal < price;
      stepBody = `
        <div style="margin-bottom:14px">
          <h3 style="margin:0 0 3px;font-size:15.5px;font-weight:750">选择指标并确认发起测算</h3>
          <small style="color:var(--muted)">确认后将自动从代理商账户余额扣除单次基线测算费</small>
        </div>
        <div class="spro-form-group">
          <div class="spro-form-label">输出测算指标 <span class="req">*</span></div>
          <div class="spro-check-grid">
            ${BASE_METRICS.map(m => `
              <label class="spro-check-card">
                <input type="checkbox" name="metric" value="${esc(m)}" ${w.metrics.includes(m) ? 'checked' : ''}>
                <span>${esc(m)}</span>
              </label>
            `).join('')}
          </div>
        </div>
        <div style="background:#f8fafd;border:1px solid var(--line);border-radius:12px;padding:14px 16px;font-size:13px;display:grid;gap:6px">
          <div><span style="color:var(--muted)">客户名称：</span><b>${esc(w.customer)}</b></div>
          <div><span style="color:var(--muted)">核心词数量：</span><b>${w.words.length} 个</b>（共计划采样 ${totalCalls} 次）</div>
          <div><span style="color:var(--muted)">监测平台：</span>${esc(w.platforms.join('、'))}（周期 ${esc(w.cycle)}）</div>
          <div><span style="color:var(--muted)">对比竞品：</span>${w.competitors.filter(Boolean).length ? esc(w.competitors.filter(Boolean).join('、')) : 'AI 自动推演 3 个头部竞品'}</div>
          <div style="margin-top:4px;padding-top:8px;border-top:1px dashed var(--line-strong);display:flex;justify-content:space-between;align-items:center">
            <span>本次测算扣费：<b style="color:#ef4444;font-size:15px">¥${price.toFixed(2)}</b></span>
            <span style="color:${lack ? '#be123c' : '#047857'};font-weight:600">${lack ? `余额不足（当前 ¥${bal.toFixed(2)}）` : `当前余额 ¥${bal.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`}</span>
          </div>
        </div>
      `;
    }

    wideModal('新建售前基线测算', `
      <p style="margin:-6px 0 12px;font-size:12.5px;color:var(--muted)">按步骤填写即可，带 <span style="color:#ef4444">*</span> 的内容必须填写</p>
      <div class="spro-stepper">
        ${stepNames.map((n, idx) => `
          <div class="spro-step-item ${idx + 1 === step ? 'active' : (idx + 1 < step ? 'done' : '')}">
            <i>${idx + 1 < step ? '✓' : idx + 1}</i><span>${n}</span>
          </div>
        `).join('')}
      </div>
      <form id="spro-wiz-form">
        ${stepBody}
        ${errorMsg ? `<p style="color:#e11d48;font-size:12.5px;font-weight:600;margin:10px 0 0">${esc(errorMsg)}</p>` : ''}
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:18px;padding-top:14px;border-top:1px solid var(--line)">
          <small style="color:var(--muted)">步骤 ${step} / 3</small>
          <div class="actions">
            <button type="button" class="spro-btn-outline" data-spro="${step === 1 ? 'wiz-cancel' : 'wiz-prev'}">${step === 1 ? '取消' : '上一步'}</button>
            <button type="submit" class="spro-btn-blue">${step === 3 ? '确认创建并扣费' : '下一步 >'}</button>
          </div>
        </div>
      </form>
    `);
  }

  // ==========================================================================
  // MODULE 3: 售前报告 + GEO品牌诊断报告 8-Tab 查看器 (Screenshot 6)
  // ==========================================================================
  function renderDiagnosisList() {
    const tasks = typeof reportTasks !== 'undefined' ? reportTasks : [];
    return salesSimpleBar('diagnosis') + `
      <div class="spro-topbar">
        <div>
          <h1>售前报告</h1>
          <p class="spro-sub">生成多平台 GEO 品牌诊断报告，覆盖整体表现、场景、竞品、舆情、信源与问答证据</p>
        </div>
        <button type="button" class="spro-btn-blue" data-sales-click="new-diagnosis">＋ 新建售前报告</button>
      </div>
      <section class="spro-table-card">
        <div class="scroll">
          <table>
            <thead>
              <tr>
                <th>企业 / 品牌</th>
                <th>核心产品 / 行业</th>
                <th>对比竞品</th>
                <th>监测 AI 平台</th>
                <th>分析模式</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${tasks.length ? tasks.map((t, i) => `
                <tr>
                  <td><b>${esc(t.name)}</b><br><small style="color:var(--muted)">品牌：${esc(t.brand)}</small></td>
                  <td>${esc((t.products || []).join('、'))}<br><small style="color:var(--muted)">${esc(t.industry || '—')}</small></td>
                  <td><div class="spro-plat-wrap">${(t.competitors || []).map(c => `<span class="spro-mini-chip">${esc(c)}</span>`).join('')}</div></td>
                  <td><div class="spro-plat-wrap">${(t.platforms || []).map(p => `<span class="spro-mini-chip">${esc(p)}</span>`).join('')}</div></td>
                  <td><span class="spro-tag-blue">${esc(t.mode || '深度分析')}</span></td>
                  <td><span class="spro-tag-green">诊断已就绪</span></td>
                  <td style="white-space:nowrap">
                    <button type="button" class="spro-act-link" data-spro="diag-view" data-idx="${i}">📊 查看诊断报告 →</button>
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="7" class="empty">暂无售前报告，点击右上角新建</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function buildDiagMetrics(t) {
    const isLaifen = t.brand === '徕芬';
    const rand = seedRand((t.brand || '') + (t.name || ''));
    const kpi = isLaifen
      ? { mention: '65%', top1: '18%', top3: '40%', neutral: '98.66%', avgPos: '第2.2位' }
      : {
          mention: Math.round(32 + rand() * 34) + '%',
          top1: Math.round(8 + rand() * 18) + '%',
          top3: Math.round(22 + rand() * 26) + '%',
          neutral: (95.4 + rand() * 3.8).toFixed(2) + '%',
          avgPos: '第' + (1.9 + rand() * 1.4).toFixed(1) + '位'
        };

    const plats = (t.platforms && t.platforms.length) ? t.platforms : ['豆包', 'DeepSeek', '通义千问', 'Kimi', '元宝', '文心一言'];
    const platRows = plats.map((pl, idx) => {
      if (isLaifen) {
        const preset = [
          ['豆包', '74%', '24%', '52%', '99.1%', '第1.9位', '高权重推荐'],
          ['DeepSeek', '78%', '28%', '56%', '98.9%', '第1.7位', '优势领先平台'],
          ['通义千问', '62%', '14%', '36%', '98.4%', '第2.4位', '中段稳步提升'],
          ['Kimi', '54%', '12%', '30%', '99.2%', '第2.6位', '缺少深度横评源'],
          ['元宝', '64%', '16%', '38%', '98.5%', '第2.3位', '公众号信源占比高'],
          ['文心一言', '58%', '14%', '28%', '97.9%', '第2.5位', '需补充百科与门户']
        ];
        const hit = preset.find(p => p[0] === pl);
        if (hit) return hit;
      }
      const m = Math.round(28 + rand() * 48);
      const t1 = Math.round(Math.min(m, 6 + rand() * 24));
      const t3 = Math.round(Math.min(m, t1 + 12 + rand() * 24));
      const neu = (95 + rand() * 4.5).toFixed(1) + '%';
      const pos = '第' + (1.7 + rand() * 1.8).toFixed(1) + '位';
      return [pl, m + '%', t1 + '%', t3 + '%', neu, pos, idx % 2 === 0 ? '核心突破平台' : '信源缺口待补'];
    });
    return { kpi, platRows };
  }

  function renderDiagTabContent(t, diagData) {
    const tab = state.diagTab;
    const brand = t.brand || t.name;
    const mainProd = (t.products && t.products[0]) || brand;
    const rivals = (t.competitors && t.competitors.length) ? t.competitors : ['竞品A', '竞品B', '竞品C'];

    if (tab === 'overview') {
      const k = diagData.kpi;
      return `
        <div class="spro-diag-sec-tag">01 · 整体表现</div>
        <h3>品牌在AI回答中的整体表现如何</h3>
        <p class="lead">从品牌可见度、推荐排名与品牌舆情三个维度，呈现品牌在AI回答中的整体表现。</p>
        <div class="spro-diag-kpis">
          <div class="spro-diag-kpi"><div class="idx">01</div><div class="lbl">品牌提及率 ⓘ</div><div class="val">${esc(k.mention)}</div></div>
          <div class="spro-diag-kpi"><div class="idx">02</div><div class="lbl">榜一率 ⓘ</div><div class="val">${esc(k.top1)}</div></div>
          <div class="spro-diag-kpi"><div class="idx">03</div><div class="lbl">前三率 ⓘ</div><div class="val">${esc(k.top3)}</div></div>
          <div class="spro-diag-kpi"><div class="idx">04</div><div class="lbl">中正率 ⓘ</div><div class="val">${esc(k.neutral)}</div></div>
          <div class="spro-diag-kpi"><div class="idx">05</div><div class="lbl">平均排名位置 ⓘ</div><div class="val">${esc(k.avgPos)}</div></div>
        </div>
        <div class="spro-diag-subcard">
          <div class="spro-diag-sec-tag" style="margin-bottom:2px">分平台对照</div>
          <h4>平台指标对照表</h4>
          <div class="scroll">
            <table class="spro-navy-table">
              <thead>
                <tr>
                  <th>AI平台</th>
                  <th>品牌提及率</th>
                  <th>榜一率</th>
                  <th>前三率</th>
                  <th>中正率</th>
                  <th>平均排名位置</th>
                  <th>平台诊断结论</th>
                </tr>
              </thead>
              <tbody>
                ${diagData.platRows.map(r => `
                  <tr>
                    <td><b>${esc(r[0])}</b></td>
                    <td><b style="color:#10243e">${esc(r[1])}</b></td>
                    <td>${esc(r[2])}</td>
                    <td>${esc(r[3])}</td>
                    <td>${esc(r[4])}</td>
                    <td><b>${esc(r[5])}</b></td>
                    <td><span class="spro-tag-blue">${esc(r[6])}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'scene') {
      const scenes = [
        ['选购对比决策', `${mainProd}哪个牌子性价比高`, '72%', '第 2.0 位', '高频成交意图，竞争最激烈'],
        ['技术参数测评', `${mainProd}核心参数与实测对比`, '58%', '第 2.5 位', '需补充结构化对比数据表'],
        ['口碑避坑查询', `${brand}值得买吗 / 有什么缺点`, '91%', '第 1.2 位', '品牌词基本盘稳固'],
        ['细分人群推荐', `适合家庭/专业场景的${mainProd}推荐`, '44%', '第 3.1 位', '细分长尾场景存在明显空位'],
        ['售后与质保关注', `${mainProd}耐用度与质保哪家靠谱`, '39%', '第 3.4 位', '建议增加真实用户案例与质保解读']
      ];
      return `
        <div class="spro-diag-sec-tag">02 · 场景分析</div>
        <h3>真实用户提问场景下的品牌可见度分布</h3>
        <p class="lead">基于 6 类目标用户画像与 18 个高频搜索场景，识别高转化空白机会。</p>
        <div class="scroll">
          <table class="spro-navy-table">
            <thead><tr><th>需求场景</th><th>代表性提问词</th><th>品牌提及率</th><th>平均顺位</th><th>场景机会洞察</th></tr></thead>
            <tbody>
              ${scenes.map(s => `<tr><td><b>${esc(s[0])}</b></td><td>${esc(s[1])}</td><td><b>${esc(s[2])}</b></td><td>${esc(s[3])}</td><td>${esc(s[4])}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (tab === 'rival') {
      const baseMention = parseInt(diagData.kpi.mention, 10) || 55;
      const bars = [
        { name: `${brand}（本品）`, mention: baseMention, top3: parseInt(diagData.kpi.top3, 10) || 40, self: true },
        { name: rivals[0] || '竞品A', mention: Math.min(92, baseMention + 16), top3: Math.min(82, baseMention + 8) },
        { name: rivals[1] || '竞品B', mention: Math.max(28, baseMention - 6), top3: Math.max(18, baseMention - 16) },
        { name: rivals[2] || '竞品C', mention: Math.min(88, baseMention + 9), top3: Math.min(76, baseMention - 2) }
      ];
      return `
        <div class="spro-diag-sec-tag">03 · 竞品对比</div>
        <h3>本品与核心竞品在 AI 推荐中的声量格局</h3>
        <p class="lead">围绕同批次 50 个正式问题横向对比本品与 ${esc(rivals.join('、'))} 的核心推荐指标。</p>
        <div class="spro-diag-two">
          <div class="spro-diag-subcard" style="margin-top:0">
            <h4 style="margin-top:0">综合品牌提及率对比</h4>
            ${bars.map(b => `
              <div style="margin-bottom:13px">
                <div style="display:flex;justify-content:space-between;font-size:13px">
                  <b style="${b.self ? 'color:#b4862c' : ''}">${esc(b.name)}</b>
                  <b>${b.mention}%</b>
                </div>
                <div class="spro-bar-track"><div class="spro-bar-fill" style="width:${b.mention}%;${b.self ? '' : 'background:#94a3b8'}"></div></div>
              </div>
            `).join('')}
          </div>
          <div class="spro-diag-subcard" style="margin-top:0">
            <h4 style="margin-top:0">前三位强推荐占比对比</h4>
            ${bars.map(b => `
              <div style="margin-bottom:13px">
                <div style="display:flex;justify-content:space-between;font-size:13px">
                  <b style="${b.self ? 'color:#b4862c' : ''}">${esc(b.name)}</b>
                  <b>${b.top3}%</b>
                </div>
                <div class="spro-bar-track"><div class="spro-bar-fill" style="width:${b.top3}%;${b.self ? '' : 'background:#cbd5e1'}"></div></div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (tab === 'sentiment') {
      return `
        <div class="spro-diag-sec-tag">04 · 品牌舆情</div>
        <h3>AI 回答中品牌情感倾向与认知标签</h3>
        <p class="lead">监测主流模型在提及 ${esc(brand)} 时的语义情感极性与核心卖点复述准确度。</p>
        <div class="spro-diag-kpis" style="grid-template-columns:repeat(3,minmax(0,1fr))">
          <div class="spro-diag-kpi"><div class="idx">POSITIVE</div><div class="lbl">正向推荐占比</div><div class="val" style="color:#047857">76.4%</div></div>
          <div class="spro-diag-kpi"><div class="idx">NEUTRAL</div><div class="lbl">客观中立占比</div><div class="val">22.26%</div></div>
          <div class="spro-diag-kpi"><div class="idx">NEGATIVE</div><div class="lbl">负面/质疑占比</div><div class="val" style="color:#be123c">1.34%</div></div>
        </div>
        <div class="spro-diag-two">
          <div class="spro-diag-subcard" style="margin-top:0">
            <h4 style="margin-top:0">AI 高频正向认知标签</h4>
            <div class="spro-chip-list">
              <span class="spro-tag-green">核心性能参数突出</span>
              <span class="spro-tag-green">国货技术标杆</span>
              <span class="spro-tag-green">高性价比替代方案</span>
              <span class="spro-tag-green">用户复购口碑好</span>
              <span class="spro-tag-green">设计质感在线</span>
            </div>
          </div>
          <div class="spro-diag-subcard" style="margin-top:0">
            <h4 style="margin-top:0">需持续纠偏与弱化的表述</h4>
            <p style="font-size:13px;color:var(--muted);line-height:1.7;margin:0">
              少数老旧帖子导致部分模型在回答「长期耐用性 / 售后响应」时引用了 2024 年早期评论；建议通过权威科技媒体与最新质保政策专题稿刷新模型语料权重。
            </p>
          </div>
        </div>
      `;
    }

    if (tab === 'source') {
      const sources = [
        ['垂直科技 / 行业门户媒体', '34%', 'DeepSeek、豆包、通义千问', '引用权重最高，决定榜单顺位'],
        ['知乎深度对比测评', '24%', 'DeepSeek、Kimi', '强影响「怎么选 / 对比」类长尾问题'],
        ['百家号 / 搜狐号资讯', '18%', '文心一言、豆包', '高频贡献产品参数与新品发布信息'],
        ['微信公众号深度文章', '14%', '元宝、豆包', '腾讯系模型核心引用底座'],
        ['权威百科与资质词条', '10%', '全平台通用', '提供官方参数与品牌实体校验']
      ];
      return `
        <div class="spro-diag-sec-tag">05 · 信源诊断</div>
        <h3>AI 回答高频引用信源结构拆解</h3>
        <p class="lead">识别驱动本行业 AI 推荐排名的关键信源渠道，精准指导 GEO 媒体投放预算。</p>
        <div class="scroll">
          <table class="spro-navy-table">
            <thead><tr><th>信源渠道类型</th><th>引用占比</th><th>主要影响 AI 平台</th><th>GEO 投放价值说明</th></tr></thead>
            <tbody>
              ${sources.map(s => `<tr><td><b>${esc(s[0])}</b></td><td><b>${esc(s[1])}</b></td><td>${esc(s[2])}</td><td>${esc(s[3])}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (tab === 'opportunity') {
      const opps = [
        ['P0 · 抢占核心对比词首屏推荐位', `围绕「${mainProd}哪家好」「${brand} vs ${rivals[0]}」等高转化选型词，输出带实测数据与对比表的结构化深度评测，重点覆盖 DeepSeek 与通义千问引用源。`],
        ['P1 · 补齐细分场景与长尾痛点词矩阵', `针对当前提及率低于 45% 的细分人群与质保耐用场景，搭建 30+ 篇场景化问答文章，覆盖豆包、元宝及 Kimi 常用信源池。`],
        ['P2 · 沉淀企业专属防串味知识底座', `将官方核心技术参数、专利背书、标杆案例与售后服务标准统一写入企业知识库，确保各平台 AI 回答口径准确一致。`]
      ];
      return `
        <div class="spro-diag-sec-tag">06 · 优化机会</div>
        <h3>GEO 增长行动路线图与落地优先级</h3>
        <p class="lead">结合诊断短板与高权重信源分布，规划 4～8 周可量化的排名跃迁方案。</p>
        ${opps.map(o => `<div class="spro-opp-card"><b style="display:block;font-size:14.5px;margin-bottom:5px;color:#0f172a">${esc(o[0])}</b><p style="margin:0;font-size:13px;color:#475569;line-height:1.65">${esc(o[1])}</p></div>`).join('')}
      `;
    }

    if (tab === 'cases') {
      return `
        <div class="spro-diag-sec-tag">07 · 案例参考</div>
        <h3>同行业标杆客户 GEO 优化成效参考</h3>
        <p class="lead">基于 ${esc(t.industry || '同行业')} 真实 GEO 交付周期（8 周）的可见度提升基准。</p>
        <div class="spro-diag-two">
          <div class="spro-diag-subcard" style="margin-top:0">
            <span class="spro-tag-green">交付周期：6 周</span>
            <h4 style="margin-top:8px">某消费电子新锐品牌</h4>
            <p style="font-size:13px;color:var(--muted);line-height:1.65">聚焦 12 个核心品类对比词与 25 篇垂直测评信源，DeepSeek 与豆包综合提及率由 <b>28% → 76%</b>，前三率提升 <b>+38%</b>。</p>
          </div>
          <div class="spro-diag-subcard" style="margin-top:0">
            <span class="spro-tag-blue">交付周期：8 周</span>
            <h4 style="margin-top:8px">某细分行业制造领军企业</h4>
            <p style="font-size:13px;color:var(--muted);line-height:1.65">围绕选型对比与行业方案词搭建企业知识底座，6 大主流 AI 平台品牌首推率由 <b>9% → 34%</b>，AI 渠道高意向询盘增长 <b>2.1 倍</b>。</p>
          </div>
        </div>
      `;
    }

    // Appendix: Evidence
    const evList = [
      { plat: 'DeepSeek', q: `${mainProd}哪个牌子性价比高？`, hit: '第 1 位', src: '垂直科技评测网 / 知乎专业答主', txt: `综合性能参数、核心技术自研程度与真实用户反馈，优先推荐关注【${brand}】（核心优势突出、性价比高），其次可对比 ${rivals[0]} 与 ${rivals[1]}……` },
      { plat: '豆包', q: `2026年${mainProd}推荐榜单`, hit: '第 2 位', src: '行业消费指南 / 百家号', txt: `主流热门品牌梯队中，${rivals[0]} 与【${brand}】在用户口碑与销量表现均位居前列，其中 ${brand} 在核心性能与设计体验方面认可度较高……` },
      { plat: '通义千问', q: `${brand}和${rivals[0]}怎么选？`, hit: '第 2 位', src: '科技资讯门户 / 官方参数页', txt: `如果更看重核心性能与综合性价比，建议优先选择【${brand}】；若预算充足且偏好传统国际大牌，可对比 ${rivals[0]} 相关系列……` },
      { plat: 'Kimi', q: `家用/企业级${mainProd}实测横评`, hit: '第 3 位', src: '知乎深度对比文', txt: `在近期多组横评实测中，${rivals[0]}、${rivals[2] || rivals[1]} 与【${brand}】表现稳健，建议结合具体预算与售后需求挑选……` }
    ];
    const shownEv = state.diagEvidencePlat === '全部' ? evList : evList.filter(e => e.plat === state.diagEvidencePlat);
    return `
      <div class="spro-diag-sec-tag">附录 · 诊断证据</div>
      <h3>AI 平台真实抽检问答原文证据</h3>
      <p class="lead">支持按平台抽查本次 290 次提问中的典型回答原文与引用信源。</p>
      <div class="spro-type-pills" style="margin-bottom:14px">
        ${['全部', 'DeepSeek', '豆包', '通义千问', 'Kimi'].map(pl => `
          <button type="button" class="spro-type-pill ${state.diagEvidencePlat === pl ? 'active' : ''}" data-spro="diag-ev-plat" data-plat="${pl}">${pl}</button>
        `).join('')}
      </div>
      ${shownEv.map(e => `
        <div class="spro-evidence-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px">
            <b>提问：${esc(e.q)}</b>
            <div style="display:flex;gap:6px"><span class="spro-tag-blue">${esc(e.plat)}</span><span class="spro-tag-green">命中 ${esc(e.hit)}</span></div>
          </div>
          <p style="margin:0 0 6px;font-size:13px;color:#334155;line-height:1.65">${esc(e.txt)}</p>
          <small style="color:var(--subtle)">引用信源：${esc(e.src)}</small>
        </div>
      `).join('')}
    `;
  }

  function renderDiagnosisViewer() {
    const tasks = typeof reportTasks !== 'undefined' ? reportTasks : [];
    const t = tasks[state.activeDiagIdx] || tasks[0];
    if (!t) { state.diagSubView = 'list'; return renderDiagnosisList(); }
    const diagData = buildDiagMetrics(t);
    const platCount = (t.platforms || []).length || 6;

    return `
      <div class="spro-diag-toolbar">
        <div class="spro-res-back-wrap">
          <button type="button" class="spro-back-circle" data-spro="diag-back" title="返回售前报告列表">←</button>
          <div>
            <b style="font-size:15px">${esc(t.brand || t.name)} · GEO品牌诊断报告</b>
            <div style="font-size:12px;color:var(--muted)">所属客户：${esc(t.name)} · ${esc(t.mode || '深度分析')}</div>
          </div>
        </div>
        <button type="button" class="spro-btn-outline" data-spro="diag-export">⬇ 导出报告摘要</button>
      </div>

      <section class="spro-diag-shell">
        <header class="spro-diag-hero">
          <div class="spro-diag-kicker">${esc(data.brand)} · AI搜索品牌机会洞察</div>
          <h2>GEO品牌诊断报告</h2>
          <p>基于真实用户需求场景，识别品牌在主流AI平台中的进入、推荐、舆情与信源表现。</p>
          <div class="spro-diag-meta-box">
            <div class="spro-diag-meta-cell"><span>企业/品牌</span><b>${esc(t.brand || t.name)}</b></div>
            <div class="spro-diag-meta-cell"><span>产品/服务</span><b>${esc((t.products || [t.brand]).join('、'))}</b></div>
            <div class="spro-diag-meta-cell"><span>所属行业</span><b>${esc(t.industry || '通用行业')}</b></div>
          </div>
          <div class="spro-diag-meta-foot">
            <div><span>对比竞品</span><b>${esc((t.competitors || []).join('、') || '行业头部竞品')}</b></div>
            <div><span>诊断平台</span><b>${esc((t.platforms || []).join('、'))}</b></div>
            <div class="spro-diag-summary-right">
              <div>6个用户画像 · 18个搜索场景 · 50个正式问题 · ${platCount}个平台 · ${platCount * 48 + 2}次提问</div>
              <div>分析模式：${esc(t.mode || '深度分析')} · 报告时间：${esc(t.reportDate || '2026-11-23')}</div>
            </div>
          </div>
        </header>

        <nav class="spro-diag-nav" role="tablist">
          ${DIAG_TABS.map(([id, label]) => `
            <button type="button" role="tab" class="spro-diag-tab ${state.diagTab === id ? 'active' : ''}" data-spro="diag-tab" data-tab="${id}">${label}</button>
          `).join('')}
        </nav>

        <div class="spro-diag-body">
          <div class="spro-diag-paper">
            ${renderDiagTabContent(t, diagData)}
          </div>
        </div>
      </section>
    `;
  }

  function renderDiagnosisModule() {
    return state.diagSubView === 'viewer' ? renderDiagnosisViewer() : renderDiagnosisList();
  }

  // ---------- Hook into sales.html salesFeaturePage ----------
  window.salesFeaturePage = function (view) {
    if (view === 'keywords') return renderKeywordModule();
    if (view === 'baseline') return renderBaselineModule();
    if (view === 'diagnosis') return renderDiagnosisModule();
    if (view === 'orders') return followOrdersPage();
    return staffAccount('sales', portalAccount);
  };

  // Reset sub-views when switching left sidebar tabs or sales accounts
  document.addEventListener('click', e => {
    const navBtn = e.target.closest('[data-work-view]');
    if (navBtn) {
      state.kwSubView = 'form';
      state.baseSubView = 'list';
      state.diagSubView = 'list';
    }
  }, true);

  document.addEventListener('change', e => {
    if (e.target.id === 'switchSalesAccount') {
      state.kwSubView = 'form';
      state.baseSubView = 'list';
      state.diagSubView = 'list';
      state.baseSelectedIds.clear();
    }
    if (e.target.id === 'spro-custom-toggle') {
      state.kwDraft.customOn = e.target.checked;
      render();
      return;
    }
    if (e.target.closest('#spro-kw-form') && e.target.name === 'industry') {
      state.kwDraft.industry = e.target.value;
      state.kwDraft.subIndustry = '';
      render();
      return;
    }
    if (e.target.closest('#spro-kw-form') && e.target.name === 'subIndustry') {
      state.kwDraft.subIndustry = e.target.value;
      return;
    }
    if (e.target.id === 'spro-base-check-all') {
      const checked = e.target.checked;
      document.querySelectorAll('.spro-base-chk').forEach(chk => {
        if (checked) state.baseSelectedIds.add(chk.dataset.id);
        else state.baseSelectedIds.delete(chk.dataset.id);
      });
      render();
      return;
    }
    if (e.target.classList.contains('spro-base-chk')) {
      if (e.target.checked) state.baseSelectedIds.add(e.target.dataset.id);
      else state.baseSelectedIds.delete(e.target.dataset.id);
      render();
      return;
    }
    if (e.target.id === 'spro-base-status') {
      state.baseFilter.status = e.target.value;
      render();
      return;
    }
  });

  document.addEventListener('input', e => {
    if (e.target.closest('#spro-kw-form')) {
      const n = e.target.name;
      if (['company', 'product', 'keyword', 'rivalInput', 'customInput'].includes(n)) {
        state.kwDraft[n] = e.target.value;
      }
    }
    if (e.target.id === 'spro-base-search') {
      state.baseFilter.search = e.target.value;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.id === 'spro-rival-input') {
      e.preventDefault();
      addDraftRival();
    }
    if (e.key === 'Enter' && e.target.id === 'spro-custom-kw-input') {
      e.preventDefault();
      addDraftCustomKeywords();
    }
  });

  function addDraftRival() {
    const val = (state.kwDraft.rivalInput || '').trim();
    if (!val) return;
    const items = val.split(/[,，、;\n]+/).map(s => s.trim()).filter(Boolean);
    items.forEach(item => {
      if (!state.kwDraft.competitors.includes(item) && state.kwDraft.competitors.length < 10) {
        state.kwDraft.competitors.push(item);
      }
    });
    state.kwDraft.rivalInput = '';
    render();
    setTimeout(() => $('#spro-rival-input')?.focus(), 0);
  }

  function addDraftCustomKeywords() {
    const val = (state.kwDraft.customInput || '').trim();
    if (!val) return;
    const items = val.split(/[,，、;\n]+/).map(s => s.trim()).filter(Boolean);
    for (const item of items) {
      if (state.kwDraft.customKeywords.length >= 20) {
        toast('自主选词最多填写 20 个关键词');
        break;
      }
      if (!state.kwDraft.customKeywords.includes(item)) {
        state.kwDraft.customKeywords.push(item);
      }
    }
    state.kwDraft.customInput = '';
    render();
    setTimeout(() => $('#spro-custom-kw-input')?.focus(), 0);
  }

  // ---------- Unified Click Delegation ----------
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-spro]');
    if (!btn) return;
    const act = btn.dataset.spro;

    // --- Keyword Module ---
    if (act === 'kw-benefits') {
      const q = accGetSellerQuota(tenantId, portalAccount);
      const rate = accGetHqRates(tenantId).keywordTool;
      modal('选词工具权益说明', details([
        ['适用模式', '品牌曝光（支持 AI 语义拓展、语义后缀组合与客户自主指定词）'],
        ['本月个人额度', `已使用 ${q.keywords.used} / ${q.keywords.limit} 次`],
        ['单次计费标准', `¥${rate.toFixed(2)} / 次（从代理商余额实时扣减）`],
        ['报价包含维度', 'PC/移动搜索量、4 大 AI 平台月提问量、7 大平台排名/收录预估报价']
      ]));
      return;
    }
    if (act === 'kw-open-fav') {
      state.kwSubView = 'favorites';
      render();
      return;
    }
    if (act === 'kw-back-form') {
      state.kwSubView = 'form';
      render();
      return;
    }
    if (act === 'kw-new-form') {
      state.kwSubView = 'form';
      state.kwDraft = {
        company: '', product: '', keyword: '', industry: '', subIndustry: '',
        suffixes: ['推荐', '哪家靠谱'], competitors: [], rivalInput: '',
        customOn: false, customInput: '', customKeywords: []
      };
      render();
      return;
    }
    if (act === 'kw-identify') {
      const text = [state.kwDraft.company, state.kwDraft.product, state.kwDraft.keyword].join(' ').trim();
      if (!text) { toast('请先填写公司名称、产品名称或关键词'); return; }
      const rules = [
        [/视觉|检测|仪器|传感|仪表/, '工业制造', '仪器仪表'],
        [/管道|机械|设备|制造|工厂|制冰/, '工业制造', '工业设备'],
        [/执照|代办|财税|工商|代理/, '商务服务', '代理'],
        [/律所|律师|法律/, '商务服务', '法律服务'],
        [/吹风机|牙刷|家电|电器/, '消费品', '家用电器'],
        [/手机|数码|电子/, '消费品', '数码家电'],
        [/门窗|建材|全屋|家居|装修/, '家居建材', '家具定制'],
        [/软件|系统|SaaS|平台|ERP|MES/i, '企业服务', '企业软件'],
        [/生物|医药|胶囊|医疗/, '医疗健康', '生物医药']
      ];
      const hit = rules.find(([re]) => re.test(text));
      if (hit) {
        state.kwDraft.industry = hit[1];
        state.kwDraft.subIndustry = hit[2];
        render();
        toast(`已智能识别为「${hit[1]} / ${hit[2]}」`);
      } else {
        state.kwDraft.industry = '企业服务';
        state.kwDraft.subIndustry = '咨询服务';
        render();
        toast('已匹配相近行业，可手动微调');
      }
      return;
    }
    if (act === 'kw-toggle-suffix') {
      const val = btn.dataset.val;
      const idx = state.kwDraft.suffixes.indexOf(val);
      if (idx >= 0) state.kwDraft.suffixes.splice(idx, 1);
      else state.kwDraft.suffixes.push(val);
      render();
      return;
    }
    if (act === 'kw-add-rival') { addDraftRival(); return; }
    if (act === 'kw-del-rival') {
      state.kwDraft.competitors.splice(Number(btn.dataset.idx), 1);
      render();
      return;
    }
    if (act === 'kw-add-custom') { addDraftCustomKeywords(); return; }
    if (act === 'kw-del-custom') {
      state.kwDraft.customKeywords.splice(Number(btn.dataset.idx), 1);
      render();
      return;
    }
    if (act === 'kw-fav-tab') {
      state.favTab = btn.dataset.tab;
      render();
      return;
    }
    if (act === 'kw-toggle-plat') {
      const quotes = getQuotes();
      const q = quotes.find(x => x.id === btn.dataset.qid);
      if (!q || q.status !== 'active') return;
      const it = q.items[Number(btn.dataset.idx)];
      if (!it) return;
      const field = btn.dataset.kind === 'rank' ? 'rankPlatforms' : 'includePlatforms';
      const pl = btn.dataset.plat;
      const arr = it[field] || [];
      const pos = arr.indexOf(pl);
      if (pos >= 0) arr.splice(pos, 1);
      else arr.push(pl);
      it[field] = arr;
      it._edited = true;
      saveQuotes(quotes);
      render();
      return;
    }
    if (act === 'kw-reselect') {
      const q = getQuotes().find(x => x.id === btn.dataset.qid);
      if (q) {
        const [ind, sub] = String(q.industry || '').split(/[-/]/).map(s => s.trim());
        state.kwDraft.company = q.company || '';
        state.kwDraft.product = q.title || '';
        state.kwDraft.keyword = (q.items[0]?.keyword || '').replace(/(推荐|排名|测评|哪家好|哪家靠谱)$/, '');
        state.kwDraft.industry = SPRO_INDUSTRIES[ind] ? ind : '';
        state.kwDraft.subIndustry = (SPRO_INDUSTRIES[ind] || []).includes(sub) ? sub : '';
        state.kwDraft.competitors = [...(q.competitors || [])];
      }
      state.kwSubView = 'form';
      render();
      toast('已回填该询价单信息，可修改后重新选词');
      return;
    }
    if (act === 'kw-export-fav') {
      const quotes = getQuotes().filter(q => state.favTab === 'active' ? q.status === 'active' : q.status !== 'active');
      if (!quotes.length) { toast('当前列表没有可导出的询价单'); return; }
      const rows = [];
      quotes.forEach(q => {
        q.items.forEach(it => {
          rows.push([
            q.title, q.company, q.industry, q.status === 'active' ? '可用' : '已过期',
            it.keyword, it.type, it.hard ? '难' : '常规', calcItemPrice(it),
            it.pcVol, it.mobVol, it.doubaoVol, it.dsVol,
            (it.rankPlatforms || []).join('/'), (it.includePlatforms || []).join('/')
          ]);
        });
      });
      downloadCsv(`选词估价收藏夹-${state.favTab}.csv`,
        ['询价单', '公司名称', '行业', '状态', '关键词', '词类型', '难度', '预估价(元)', 'PC搜索量', '移动搜索量', '豆包提问量', 'DeepSeek提问量', '排名平台', '收录平台'], rows);
      toast(`已导出 ${rows.length} 条词条明细 CSV`);
      return;
    }

    // --- Baseline Module ---
    if (act === 'base-open-wiz') { openBaselineWizard(null); return; }
    if (act === 'base-refresh') { render(); toast('已刷新基线测算任务列表'); return; }
    if (act === 'base-apply-filter') { render(); return; }
    if (act === 'base-reset-filter') {
      state.baseFilter = { search: '', status: '全部状态' };
      render();
      return;
    }
    if (act === 'base-view') {
      state.activeBaseId = btn.dataset.id;
      state.baseResultType = '全部';
      state.baseSubView = 'result';
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (act === 'base-back') {
      state.baseSubView = 'list';
      render();
      return;
    }
    if (act === 'base-res-type') {
      state.baseResultType = btn.dataset.type;
      render();
      return;
    }
    if (act === 'base-copy') {
      const t = getBaselines().find(x => x.id === btn.dataset.id);
      if (t) openBaselineWizard(t);
      return;
    }
    if (act === 'base-opp') {
      const list = getBaselines();
      const parent = list.find(x => x.id === btn.dataset.id);
      if (!parent) return;
      const existingOpps = list.filter(x => x.parentId === parent.id);
      if (existingOpps.length >= 2) {
        toast('每个客户任务最多可进行 2 次机会词探索');
        return;
      }
      const nextIdx = existingOpps.length + 1;
      const baseWord = (parent.words[0]?.text || parent.customer).replace(/(哪家好|推荐|怎么样|对比)$/, '');
      const oppTask = {
        id: 'BL-OPP-' + Date.now(),
        customer: parent.customer,
        aliases: parent.aliases,
        isOpportunity: true,
        parentId: parent.id,
        oppIndex: nextIdx,
        competitorMode: parent.competitorMode || 'AI推演',
        competitors: [...(parent.competitors || [])],
        words: [
          { text: `${baseWord}真实测评对比`, type: '意图词' },
          { text: `${baseWord}源头厂家哪家靠谱`, type: '品类词' },
          { text: `${parent.customer.slice(0, 4)}方案优势分析`, type: '品牌词' }
        ],
        platforms: [...(parent.platforms || BASE_PLATFORMS)],
        cycle: parent.cycle || '1天',
        samples: parent.samples || 3,
        metrics: [...(parent.metrics || BASE_METRICS)],
        createdAt: nowFullStr(),
        status: '分析完成',
        progress: '100.0%'
      };
      list.push(oppTask);
      saveBaselines(list);
      if (state.baseSubView === 'result') {
        state.activeBaseId = oppTask.id;
      }
      render();
      toast(`已为「${parent.customer}」生成机会词探索 #${nextIdx}（不占用每日首次测算额度）`);
      return;
    }
    if (act === 'base-delete') {
      const list = getBaselines();
      const targetId = btn.dataset.id;
      const next = list.filter(x => x.id !== targetId && x.parentId !== targetId);
      state.baseSelectedIds.delete(targetId);
      saveBaselines(next);
      render();
      toast('已删除该测算任务');
      return;
    }
    if (act === 'base-export-one' || act === 'base-export-selected') {
      const list = getBaselines();
      const targets = act === 'base-export-one'
        ? list.filter(x => x.id === btn.dataset.id)
        : list.filter(x => state.baseSelectedIds.has(x.id));
      if (!targets.length) { toast('请先勾选需要导出的测算任务'); return; }
      const rows = [];
      targets.forEach(t => {
        buildMatrixRows(t).forEach(g => {
          g.rows.forEach(r => {
            rows.push([
              t.customer, t.parentId ? `机会词探索#${t.oppIndex}` : '首次基线测算',
              g.word, g.type, r.platform, r.mention + '%', r.top1 + '%', r.top2 + '%', r.top3 + '%', r.avgPos, r.neutral + '%',
              (r.rivals || []).map(rv => `${rv.name}(提及${rv.mention}%/榜一${rv.top1}%)`).join(' ; ')
            ]);
          });
        });
      });
      downloadCsv('售前基线测算结果.csv',
        ['客户任务', '任务类型', '核心词', '词类型', 'AI平台', '品牌提及率', '榜一率', '排名前二率', '排名前三率', '平均排名', '中正率', '竞品指标'], rows);
      toast(`已导出 ${targets.length} 个任务的测算结果明细`);
      return;
    }

    // --- Baseline Wizard Actions ---
    if (act === 'wiz-cancel') { $('#dialog').close(); return; }
    if (act === 'wiz-prev') {
      syncWizardInputsFromDom();
      state.wizStep = Math.max(1, state.wizStep - 1);
      renderWizardModal();
      return;
    }
    if (act === 'wiz-add-rival') {
      syncWizardInputsFromDom();
      if (state.wizDraft.competitors.length < 3) state.wizDraft.competitors.push('');
      renderWizardModal();
      return;
    }
    if (act === 'wiz-del-rival') {
      syncWizardInputsFromDom();
      state.wizDraft.competitors.splice(Number(btn.dataset.idx), 1);
      renderWizardModal();
      return;
    }
    if (act === 'wiz-add-words') {
      syncWizardInputsFromDom();
      const pending = state.wizDraft.wordsPending.split(/[\n,，、；;]+/).map(s => s.trim()).filter(Boolean);
      if (!pending.length) { renderWizardModal('请先在输入框中输入核心词。'); return; }
      const added = pending.filter(txt => !state.wizDraft.words.some(w => w.text === txt));
      if (!added.length) { renderWizardModal('输入的核心词已存在列表中。'); return; }
      if (state.wizDraft.words.length + added.length > 20) { renderWizardModal('每个任务最多添加 20 个核心词。'); return; }
      added.forEach(txt => state.wizDraft.words.push({ text: txt, type: state.wizDraft.wordType || '品类词' }));
      state.wizDraft.wordsPending = '';
      renderWizardModal();
      return;
    }
    if (act === 'wiz-del-word') {
      syncWizardInputsFromDom();
      state.wizDraft.words.splice(Number(btn.dataset.idx), 1);
      renderWizardModal();
      return;
    }

    // --- Diagnosis Report Module ---
    if (act === 'diag-view') {
      state.activeDiagIdx = Number(btn.dataset.idx) || 0;
      state.diagTab = 'overview';
      state.diagEvidencePlat = '全部';
      state.diagSubView = 'viewer';
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (act === 'diag-back') {
      state.diagSubView = 'list';
      render();
      return;
    }
    if (act === 'diag-tab') {
      state.diagTab = btn.dataset.tab;
      render();
      return;
    }
    if (act === 'diag-ev-plat') {
      state.diagEvidencePlat = btn.dataset.plat;
      render();
      return;
    }
    if (act === 'diag-export') {
      const t = (reportTasks || [])[state.activeDiagIdx];
      if (!t) return;
      const d = buildDiagMetrics(t);
      downloadCsv(`${t.brand || t.name}-GEO品牌诊断报告.csv`,
        ['AI平台', '品牌提及率', '榜一率', '前三率', '中正率', '平均排名位置', '平台诊断结论'],
        d.platRows);
      toast('已导出 GEO 品牌诊断报告分平台指标摘要');
      return;
    }
  });

  // ---------- Unified Form Submit Delegation ----------
  document.addEventListener('submit', e => {
    const form = e.target;
    if (form.id === 'spro-kw-form') {
      e.preventDefault();
      const d = state.kwDraft;
      if (!d.company.trim() || !d.product.trim() || !d.keyword.trim() || !d.industry || !d.subIndustry) {
        toast('请完整填写公司名称、产品名称、关键词并选择所属行业');
        return;
      }
      if (!d.suffixes.length) {
        toast('请至少选择 1 个关键词语义后缀');
        return;
      }
      if (d.competitors.length < 2) {
        toast('请至少添加 2 个竞品名称后再开始分析');
        return;
      }
      const q = accGetSellerQuota(tenantId, portalAccount);
      if (q.keywords.used >= q.keywords.limit) {
        toast('您本月选词工具次数已用完，请联系管理员在销售管理中调高上限');
        return;
      }
      const price = accGetHqRates(tenantId).keywordTool;
      const res = accDeduct(tenantId, '选词工具', `销售「${portalAccount}」为「${d.company.trim()}」使用选词工具 × 1 次（¥${price.toFixed(2)}/次）`, price);
      if (!res.ok) { toast(res.msg); return; }
      q.keywords.used += 1;
      accSaveSellerLim(tenantId, portalAccount, q);

      const kwBase = d.keyword.trim();
      const generatedWords = [];
      d.suffixes.slice(0, 4).forEach((sf, i) => {
        generatedWords.push({
          keyword: `${kwBase}${sf}`,
          type: i === 0 ? '品类词' : '意图词',
          hard: i === 0
        });
      });
      if (d.customOn && d.customKeywords.length) {
        d.customKeywords.slice(0, 4).forEach(ck => {
          if (!generatedWords.some(g => g.keyword === ck)) {
            generatedWords.push({ keyword: ck, type: '自主词', hard: false });
          }
        });
      }
      const rand = seedRand(d.company + kwBase + Date.now());
      const newQuote = {
        id: 'Q-' + Date.now(),
        title: `${d.product.trim()}选词估价`,
        company: d.company.trim(),
        industry: `${d.industry}-${d.subIndustry}`,
        mode: '品牌曝光',
        status: 'active',
        createdAt: nowShortStr(),
        competitors: [...d.competitors],
        items: generatedWords.map((w, idx) => ({
          keyword: w.keyword,
          type: w.type,
          hard: w.hard,
          basePrice: w.hard ? 4200 : 3200,
          pcVol: `约${(1.2 + rand() * 3.1).toFixed(1)}万/月`,
          mobVol: `约${(4.5 + rand() * 10.5).toFixed(1)}万/月`,
          doubaoVol: `约${idx === 0 ? '30~50' : '10~30'}万/月`,
          dsVol: `约${idx === 0 ? '10~20' : '5~10'}万/月`,
          ybVol: '约5~10万/月',
          qwVol: `约${idx === 0 ? '10~30' : '5~15'}万/月`,
          rankPlatforms: idx % 2 === 0 ? ['Deepseek', '豆包'] : ['Deepseek'],
          includePlatforms: ['Deepseek', '千问']
        }))
      };
      const quotes = getQuotes();
      quotes.unshift(newQuote);
      saveQuotes(quotes);
      state.kwSubView = 'favorites';
      state.favTab = 'active';
      render();
      toast(`选词分析完成并已存入可用询价单，从余额扣除 ¥${price.toFixed(2)}（余额 ¥${res.balance.toFixed(2)}）`);
      return;
    }

    if (form.id === 'spro-wiz-form') {
      e.preventDefault();
      syncWizardInputsFromDom();
      const w = state.wizDraft;
      if (state.wizStep === 1) {
        if (!w.customer || !w.aliases || !w.words.length) {
          renderWizardModal('请填写客户名称、品牌提及词，并点击「＋ 添加核心词」至少添加 1 个核心词。');
          return;
        }
        state.wizStep = 2;
        renderWizardModal();
        return;
      }
      if (state.wizStep === 2) {
        if (!w.platforms.length) {
          renderWizardModal('请至少勾选 1 个 AI 监测平台。');
          return;
        }
        state.wizStep = 3;
        renderWizardModal();
        return;
      }
      if (!w.metrics.length) {
        renderWizardModal('请至少勾选 1 项测算指标。');
        return;
      }
      const q = accGetSellerQuota(tenantId, portalAccount);
      if (q.baseline.used >= q.baseline.limit) {
        renderWizardModal('您本月售前基线测算次数已用完，请联系管理员在销售管理中调高上限。');
        return;
      }
      const price = accGetHqRates(tenantId).baseline;
      const res = accDeduct(tenantId, '售前基线测算', `销售「${portalAccount}」发起「${w.customer}」售前基线测算 × 1 次（¥${price.toFixed(2)}/次）`, price);
      if (!res.ok) { renderWizardModal(res.msg); return; }
      q.baseline.used += 1;
      accSaveSellerLim(tenantId, portalAccount, q);

      const cleanRivals = w.competitors.map(s => s.trim()).filter(Boolean).slice(0, 3);
      const newTask = {
        id: 'BL-' + Date.now(),
        customer: w.customer,
        aliases: w.aliases,
        isOpportunity: false,
        parentId: null,
        competitorMode: cleanRivals.length ? '手动指定' : 'AI推演',
        competitors: cleanRivals.length ? cleanRivals : ['行业头部A', '行业头部B', '行业头部C'],
        words: w.words.map(x => ({ ...x })),
        platforms: [...w.platforms],
        cycle: w.cycle || '1天',
        samples: Number(w.samples || 3),
        metrics: [...w.metrics],
        createdAt: nowFullStr(),
        status: '分析完成',
        progress: '100.0%'
      };
      const list = getBaselines();
      list.unshift(newTask);
      saveBaselines(list);
      $('#dialog').close();
      state.activeBaseId = newTask.id;
      state.baseSubView = 'list';
      render();
      toast(`售前基线测算已创建并完成采样，扣除 ¥${price.toFixed(2)}（剩余余额 ¥${res.balance.toFixed(2)}）`);
      return;
    }
  });

  // Optional URL sub-view hook for direct deep-linking & verification
  const subParam = portalParams.get('sub');
  if (portalView === 'keywords' && subParam === 'favorites') {
    state.kwSubView = 'favorites';
    if (portalParams.get('tab')) state.favTab = portalParams.get('tab');
  }
  if (portalView === 'baseline' && subParam === 'result') {
    const firstB = getBaselines()[0];
    if (firstB) { state.activeBaseId = firstB.id; state.baseSubView = 'result'; }
  }
  if (portalView === 'diagnosis' && subParam === 'viewer') {
    state.activeDiagIdx = 0;
    state.diagSubView = 'viewer';
  }

  // Trigger initial upgraded render
  render();
})();
