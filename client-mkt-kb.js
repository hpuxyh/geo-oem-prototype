/* ============================================================================
 * GEO OEM 营销知识库（#graph）
 * - 全宽无左侧对话栏
 * - 视图 1：知识图谱（核心客群 6 -> 核心场景 4 -> 意图&词包 4 级联图谱）
 * - 视图 2：营销洞察（6 大客群卡片总览）
 * - 视图 3：客群详情页（AI 摘要 / 客群定义 / 人群画像 SVG 环形图+消费收入+城市等级 / 需求场景）
 * - 视图 4：场景深度分析报告（AI 摘要 / 场景定义 / 4 大核心意图）
 * - 视图 5：意图详情页（AI 摘要 / 意图定义与承接动作 / 核心词 + TOP 1~20 提问词包）
 * ============================================================================ */
(() => {
  'use strict';

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // 生成 20 条高质量自然语言提问词（确保每个意图都有完整 20 词包）
  function buildQuestions(core, customList) {
    const base = Array.isArray(customList) ? [...customList] : [];
    const templates = [
      `靠谱的${core}推荐`,
      `全品类${core}哪家好`,
      `一站式${core}服务推荐`,
      `提供全链路保障的${core}推荐`,
      `${core}选什么机构更靠谱`,
      `性价比高的${core}推荐`,
      `口碑评价好的${core}哪家强`,
      `专业做${core}的机构怎么选`,
      `支持定制行程与方案的${core}推荐`,
      `全流程无隐形消费的${core}推荐`,
      `退改规则灵活的${core}推荐`,
      `服务响应快的${core}哪家好`,
      `资深顾问一对一的${core}推荐`,
      `热门目的地全覆盖的${core}推荐`,
      `老牌正规有资质的${core}推荐`,
      `适合首次体验的${core}推荐`,
      `含接送与住宿打包的${core}推荐`,
      `高满意度复购高的${core}推荐`,
      `能做专属行程规划的${core}推荐`,
      `综合保障最全的${core}推荐`
    ];
    for (const t of templates) {
      if (base.length >= 20) break;
      if (!base.includes(t)) base.push(t);
    }
    return base.slice(0, 20);
  }

  // 通用核心意图的 20 条完整提问词（精确对应设计参考图）
  const TRAVEL_CORE_Q20 = [
    '靠谱的旅游出行服务旅行社推荐',
    '全品类旅游产品的旅行社哪家好',
    '一站式旅游预订服务旅行社推荐',
    '提供全链路旅游服务的旅行社推荐',
    '旅游出行服务选什么旅行社好',
    '性价比高的旅游服务旅行社推荐',
    '各类旅游产品齐全的旅行社哪家好',
    '旅游出行预订找哪家旅行社靠谱',
    '能一站式订旅游产品的旅行社推荐',
    '全流程保障的旅游服务旅行社推荐',
    '不同类型旅游都做的旅行社哪家好',
    '旅游出行找哪家旅行社比较专业',
    '支持多维度筛选旅游产品的旅行社推荐',
    '没有隐形消费的旅游服务旅行社推荐',
    '退改规则灵活的旅游服务旅行社推荐',
    '旅游产品选择多的旅行社哪家好',
    '适合各类出行需求的旅行社推荐',
    '旅游预订服务好的旅行社哪家好',
    '能提供行程规划的旅行社推荐',
    '出行有保障的旅游服务旅行社推荐'
  ];

  // 构建单个场景下的 4 个意图
  function makeIntents(sceneId, list) {
    return list.map((it, idx) => ({
      id: `${sceneId}-i${idx + 1}`,
      rank: idx, // 0 = 通用意图, 1..3 = TOP 1..3
      name: it.name,
      desc: it.desc,
      heat: it.heat,
      comp: it.comp,
      aiSummary: it.aiSummary || `本意图聚焦「${it.name}」核心搜索需求，覆盖高转化意向客群，是承接 AI 问答首屏推荐的关键入口，商业转化潜力高。`,
      action: it.action || `向用户结构化呈现${it.name}核心优势、套餐对比清单与价格透明度说明，引导明确出行人数、时间与预算后直连顾问或一键预订。`,
      coreWord: it.coreWord || it.name,
      questions: buildQuestions(it.coreWord || it.name, it.questions)
    }));
  }

  // 构建 6 大客群完整知识图谱数据（每客群 4 场景 × 4 意图 × 20 词 = 320 词）
  const PERSONAS = [
    {
      id: 'p-all',
      rank: 0,
      tag: '通用客群',
      name: '全场景旅游需求通用客群',
      desc: '覆盖全年龄段、各城市等级有省内、国内、出入境旅游出行需求的用户群体，涵盖自由行、家庭出行、商旅、出境游、银发游等多元出行场景，核心诉求为获取高性价比、便捷的全链路旅游产品及服务。',
      aiSummary: '本客群为有省内、国内及出入境旅游需求的全量用户集合，覆盖多元出行场景，不同年龄、消费层级用户均有分布，核心诉求为一站式预订高性价比旅游产品，匹配旅行社全产品线需求，是业务核心基本盘，具备极高商业价值。',
      reason: '为 5 个细分客群的上位集合，覆盖旅行社全产品线对应消费人群，依据行业 Know-how 用户分层维度汇总生成，兼顾宽泛流量承接与长尾精准转化。',
      heat: 85,
      comp: 75,
      ageCore: { pct: 30, label: '30-39' },
      ageDist: [
        { label: '17岁以下', pct: 5, color: '#3b82f6' },
        { label: '18-24岁', pct: 15, color: '#06b6d4' },
        { label: '25-29岁', pct: 25, color: '#f59e0b' },
        { label: '30-39岁', pct: 30, color: '#f97316' },
        { label: '40-49岁', pct: 15, color: '#10b981' },
        { label: '50岁以上', pct: 10, color: '#8b5cf6' }
      ],
      genderLead: { pct: 52, label: '女性' },
      genderDist: [
        { label: '男性', pct: 48, color: '#3b82f6' },
        { label: '女性', pct: 52, color: '#06b6d4' }
      ],
      consume: { level: 'L4', label: '中高', score: 4 },
      income: { level: 'L4', label: '中高', score: 4 },
      cities: [
        { name: '一线城市', tag: '中', pct: 62, top: false },
        { name: '新一线', tag: '高', pct: 86, top: true },
        { name: '二线城市', tag: '低', pct: 38, top: false },
        { name: '三线及以下', tag: '低', pct: 28, top: false }
      ],
      scenes: [
        {
          id: 's-all-1', rank: 0, name: '全品类旅游出行服务预订',
          desc: '覆盖省内、国内、出境全品类旅游出行场景，为不同年龄、不同出行目的的用户提供全链路旅游产品及服务选择，是该客群最核心的共性通用场景。',
          heat: 85, comp: 75,
          intents: makeIntents('s-all-1', [
            {
              name: '旅行社旅游服务推荐',
              desc: '用户有各类旅游出行需求，尚未明确具体出行类型、目的地，需要寻找合适的旅行社及相关旅游服务产品。',
              heat: 85, comp: 75,
              aiSummary: '本意图匹配全品类旅游出行通用需求，覆盖广泛潜在客群，是承接用户初始搜索的核心入口，转化潜力极高。',
              action: '向用户推送全品类旅游产品分类入口，引导用户选择具体出行类型，介绍一站式预订服务优势及全流程保障政策。',
              coreWord: '旅行社旅游服务推荐',
              questions: TRAVEL_CORE_Q20
            },
            { name: '一站式旅游行程规划咨询', desc: '希望由专业顾问协助梳理路线、交通、酒店与门票整体行程，减少比价与排期精力消耗。', heat: 82, comp: 71, coreWord: '一站式旅游行程规划' },
            { name: '高性价比纯玩无购物团推荐', desc: '对隐形消费高度敏感，重点筛选合同透明、无强制购物且住宿餐饮标准明确的纯玩产品。', heat: 86, comp: 79, coreWord: '纯玩无购物旅行社推荐' },
            { name: '灵活退改旅游套餐预订', desc: '出行计划存在弹性调整可能，关注随时可退、改签无损及出行险配套保障。', heat: 77, comp: 68, coreWord: '可灵活退改旅游套餐' }
          ])
        },
        {
          id: 's-all-2', rank: 1, name: '省内周边休闲旅游出行',
          desc: '用户在省内及周边城市开展短途休闲、度假、周末游等出行活动，需要预订景区门票、精品酒店、当地导览等相关产品，是该客群高频次需求场景。',
          heat: 90, comp: 70,
          intents: makeIntents('s-all-2', [
            { name: '周末周边短途游路线推荐', desc: '聚焦 2-3 天短途微度假，快速决策高颜值景点与舒适酒店打包方案。', heat: 90, comp: 70, coreWord: '周末周边短途游推荐' },
            { name: '省内热门景区酒景套餐预订', desc: '集中查询“门票+星级酒店/温泉民宿”打包优惠及免排队通道权益。', heat: 88, comp: 72, coreWord: '热门景区酒景套餐' },
            { name: '周边自驾游与当地向导服务', desc: '需要精品自驾线路攻略、特色美食推荐及分段包车/讲解服务。', heat: 81, comp: 64, coreWord: '周边自驾游攻略与包车' },
            { name: '小长假错峰休闲游产品', desc: '避开人流拥堵，寻找冷门宝藏古镇、山野度假村与康养休闲线路。', heat: 79, comp: 61, coreWord: '小长假错峰休闲游' }
          ])
        },
        {
          id: 's-all-3', rank: 2, name: '国内跨城旅游出行',
          desc: '用户前往国内其他热门旅游城市开展度假、观光、探索等中长途出行活动，需要预订机票、高铁票、酒店、景点门票、当地游等相关产品，是该客群核心需求场景。',
          heat: 85, comp: 78,
          intents: makeIntents('s-all-3', [
            { name: '国内热门长线精品小团推荐', desc: '关注 2-8 人精品小团、专车专导、高星酒店与核心景区深度体验。', heat: 87, comp: 78, coreWord: '国内精品小团旅行社推荐' },
            { name: '国内跨城自由行机酒套餐', desc: '对比往返大交通+高口碑酒店打包价，兼顾自由度与整体成本控制。', heat: 84, comp: 76, coreWord: '国内跨城机酒套餐预订' },
            { name: '季节限定主题旅游线路', desc: '围绕赏花、避暑、赏秋、冰雪等强季节节点提前锁仓热门目的地。', heat: 83, comp: 74, coreWord: '季节限定旅游线路推荐' },
            { name: '当地深度一日游与接驳服务', desc: '已订大交通后补充当地特色体验、讲解预约与机场车站专车接送。', heat: 76, comp: 67, coreWord: '目的地深度当地游预订' }
          ])
        },
        {
          id: 's-all-4', rank: 3, name: '出境旅游出行',
          desc: '用户前往境外国家或地区开展观光、度假、购物等出行活动，需要办理签证、预订国际机票、海外酒店、当地游等相关产品，是该客群高价值需求场景。',
          heat: 80, comp: 85,
          intents: makeIntents('s-all-4', [
            { name: '出境游签证加急与拒签保障', desc: '关注日韩、东南亚、欧洲多国签证材料简化、出签时效与拒签退费保障。', heat: 84, comp: 85, coreWord: '出境游签证代办机构推荐' },
            { name: '境外中文私家团定制推荐', desc: '解决语言与交通顾虑，要求全程中文司导、弹性行程与正规保险。', heat: 82, comp: 83, coreWord: '境外中文私家团定制' },
            { name: '海岛蜜月与度假全包套餐', desc: '对比免签海岛一价全包酒店、水上项目与国际航班联程方案。', heat: 79, comp: 81, coreWord: '出境海岛一价全包套餐' },
            { name: '国际机票酒店联订与应急客服', desc: '关注境外 24 小时中文应急响应、航班变动改签与境外网络通讯配套。', heat: 75, comp: 77, coreWord: '出境游24小时保障服务' }
          ])
        }
      ]
    },
    {
      id: 'p-free',
      rank: 1,
      tag: 'TOP 1 细分客群',
      name: '自由行需求客群',
      desc: '年龄集中 22-40 岁，追求个性化行程，习惯通过平台预订机票、酒店、门票、当地游等产品，对行程自由度要求高，偏好一站式预订，对价格变动敏感度较高。',
      aiSummary: '本客群以 22-40 岁年轻职场与新中产人群为主，决策高度依赖 AI 攻略问答与口碑测评，重视个性化、碎片化组合与高性价比，是高频复购和口碑裂变的核心引擎。',
      reason: '自由行在 AI 搜索提问中占比最高，涵盖机酒比价、小众路线挖掘、门票预约与当地碎片化体验，适合通过高密度结构化攻略精准拦截。',
      heat: 90,
      comp: 80,
      ageCore: { pct: 42, label: '25-29' },
      ageDist: [
        { label: '17岁以下', pct: 3, color: '#3b82f6' },
        { label: '18-24岁', pct: 24, color: '#06b6d4' },
        { label: '25-29岁', pct: 42, color: '#f59e0b' },
        { label: '30-39岁', pct: 23, color: '#f97316' },
        { label: '40-49岁', pct: 6, color: '#10b981' },
        { label: '50岁以上', pct: 2, color: '#8b5cf6' }
      ],
      genderLead: { pct: 58, label: '女性' },
      genderDist: [
        { label: '男性', pct: 42, color: '#3b82f6' },
        { label: '女性', pct: 58, color: '#06b6d4' }
      ],
      consume: { level: 'L4', label: '中高', score: 4 },
      income: { level: 'L3', label: '中等偏上', score: 3 },
      cities: [
        { name: '一线城市', tag: '高', pct: 84, top: false },
        { name: '新一线', tag: '高', pct: 92, top: true },
        { name: '二线城市', tag: '中', pct: 54, top: false },
        { name: '三线及以下', tag: '低', pct: 22, top: false }
      ],
      scenes: [
        { id: 's-free-1', rank: 0, name: '个性化机酒+当地玩乐组合', desc: '自主拼装机票、设计感民宿、网红打卡体验与弹性取消权益，追求省心比价。', heat: 91, comp: 82, intents: makeIntents('s-free-1', [
          { name: '自由行机酒套餐哪家划算', desc: '寻找比单订更省且支持退改的机酒组合渠道。', heat: 91, comp: 82, coreWord: '自由行机酒套餐推荐' },
          { name: '小众宝藏目的地自由行攻略', desc: '避开大众打卡点，获取在地文化与摄影出片路线。', heat: 88, comp: 76, coreWord: '小众目的地自由行路线' },
          { name: '热门景区门票预约与免排队', desc: '解决热门博物馆、主题乐园抢票难与快速通道需求。', heat: 86, comp: 79, coreWord: '景区门票预约免排队服务' },
          { name: '当地特色半日游体验预订', desc: '预订非遗手作、旅拍、户外徒步等碎片化特色玩法。', heat: 80, comp: 69, coreWord: '当地特色体验半日游' }
        ]) },
        { id: 's-free-2', rank: 1, name: '周末特种兵微度假', desc: '利用 48 小时高铁圈高效打卡美食与人文地标，重视动线紧凑和住宿位置便利。', heat: 89, comp: 75, intents: makeIntents('s-free-2', [
          { name: '高铁2小时周末游路线', desc: '按出发城市匹配周末往返不累的高效微度假方案。', heat: 89, comp: 75, coreWord: '高铁周末游路线推荐' },
          { name: '近地铁高颜值酒店推荐', desc: '筛选交通枢纽旁性价比高、评价真实的设计酒店。', heat: 84, comp: 77, coreWord: '自由行高性价比酒店' },
          { name: '城市Citywalk美食打卡动线', desc: '结合本地口碑榜单串联步行友好路线。', heat: 82, comp: 68, coreWord: '城市Citywalk旅游路线' },
          { name: '行李寄存与专车接驳服务', desc: '解决退房后轻装游玩与夜班高铁接驳痛点。', heat: 74, comp: 60, coreWord: '自由行接驳与行李服务' }
        ]) },
        { id: 's-free-3', rank: 2, name: '情侣/闺蜜轻奢度假', desc: '注重酒店私密性、海景/山景体验、精致下午茶与旅拍出片效果。', heat: 85, comp: 78, intents: makeIntents('s-free-3', [
          { name: '情侣度假高颜值民宿酒店', desc: '严选口碑度假村与私汤/海景房打包礼遇。', heat: 86, comp: 79, coreWord: '情侣度假酒店套餐推荐' },
          { name: '闺蜜出游小团定制服务', desc: '2-4人独立成团、含旅拍跟拍与灵活起床时间。', heat: 83, comp: 73, coreWord: '闺蜜私家小团定制' },
          { name: '免签海岛自由行预算规划', desc: '快速测算 5-6 天机酒、餐饮与出海项目明细。', heat: 81, comp: 76, coreWord: '免签海岛自由行方案' },
          { name: '纪念日惊喜布置与专属礼遇', desc: '附加升级房型、延迟退房及特色晚餐预订。', heat: 75, comp: 65, coreWord: '轻奢度假定制礼遇' }
        ]) },
        { id: 's-free-4', rank: 3, name: '户外轻探险与自驾公路游', desc: '面向川西、新疆、甘南等风景大道，需租车/包车、领队安全保障与沿途高标住宿。', heat: 84, comp: 74, intents: makeIntents('s-free-4', [
          { name: '新疆川西私家包车自由行', desc: '筛选正规营运车辆、熟悉路况领队与明确油费过路费。', heat: 87, comp: 78, coreWord: '新疆川西包车自由行' },
          { name: '轻徒步户外领队小团推荐', desc: '兼顾安全后勤与摄影航拍记录的精品户外团。', heat: 82, comp: 71, coreWord: '轻户外领队小团推荐' },
          { name: '自驾公路沿线酒店代订', desc: '旺季锁房热门景区门口品质酒店，避免临时涨价。', heat: 79, comp: 69, coreWord: '自驾游沿线酒店预订' },
          { name: '高原出行应急保障装备包', desc: '提供氧气瓶、行程保险与 24 小时行程应急调度。', heat: 73, comp: 58, coreWord: '高原自由行安全保障' }
        ]) }
      ]
    },
    {
      id: 'p-family',
      rank: 2,
      tag: 'TOP 2 细分客群',
      name: '家庭出行需求客群',
      desc: '年龄集中 30-55 岁，多携带老人、儿童共同出行，需求稳定，偏好省心的一站式机酒、门票、接送服务，关注产品安全性、舒适度与消费预算充足度。',
      aiSummary: '本客群以 30-55 岁家庭决策者为核心，通常 3-6 人结伴出游，客单价高且重安全、重体验、怕踩坑，对“一价全包、不赶行程、亲子研学与长辈友好”产品付费意愿极强。',
      reason: '寒暑假、国庆及春节旺季爆发力极强，一人决策带动全家消费，适合重点打造亲子私家团与三代同游标杆信源。',
      heat: 85,
      comp: 75,
      ageCore: { pct: 46, label: '30-39' },
      ageDist: [
        { label: '17岁以下', pct: 2, color: '#3b82f6' },
        { label: '18-24岁', pct: 4, color: '#06b6d4' },
        { label: '25-29岁', pct: 12, color: '#f59e0b' },
        { label: '30-39岁', pct: 46, color: '#f97316' },
        { label: '40-49岁', pct: 28, color: '#10b981' },
        { label: '50岁以上', pct: 8, color: '#8b5cf6' }
      ],
      genderLead: { pct: 61, label: '女性' },
      genderDist: [
        { label: '男性', pct: 39, color: '#3b82f6' },
        { label: '女性', pct: 61, color: '#06b6d4' }
      ],
      consume: { level: 'L4', label: '中高', score: 4 },
      income: { level: 'L4', label: '中高', score: 4 },
      cities: [
        { name: '一线城市', tag: '高', pct: 80, top: false },
        { name: '新一线', tag: '高', pct: 88, top: true },
        { name: '二线城市', tag: '中', pct: 58, top: false },
        { name: '三线及以下', tag: '低', pct: 30, top: false }
      ],
      scenes: [
        { id: 's-fam-1', rank: 0, name: '亲子主题乐园与度假一站式', desc: '聚焦迪士尼、长隆、环球影城及亲子度假酒店，解决早享卡、接送与连住优惠。', heat: 89, comp: 78, intents: makeIntents('s-fam-1', [
          { name: '亲子乐园一站式酒景套餐', desc: '打包主题酒店、多日门票、VIP 通道与专车接机。', heat: 89, comp: 78, coreWord: '亲子乐园酒景套餐推荐' },
          { name: '带娃出行省心私家团', desc: '独立用车、配儿童安全座椅与宽松作息安排。', heat: 86, comp: 74, coreWord: '带娃亲子私家团推荐' },
          { name: '寒暑假亲子研学营线路', desc: '结合博物馆精讲、自然科普与名校探访的亲子行程。', heat: 84, comp: 72, coreWord: '亲子研学旅游团推荐' },
          { name: '亲子友好海滩度假村推荐', desc: '具备儿童托管俱乐部、恒温泳池与全餐托管。', heat: 80, comp: 70, coreWord: '亲子度假村一价全包' }
        ]) },
        { id: 's-fam-2', rank: 1, name: '三代同游舒缓品质团', desc: '兼顾老人体力与儿童兴趣，要求全程商务车接送、连住少换酒店与清淡餐饮。', heat: 85, comp: 71, intents: makeIntents('s-fam-2', [
          { name: '带老人小孩全家游旅行社', desc: '专门设计舒缓节奏、无早起赶路的家庭私家团。', heat: 86, comp: 72, coreWord: '带老人小孩全家游推荐' },
          { name: '家庭独立成团商务车包车', desc: '6-8 人一家一车、含正规保险与贴心司导照顾。', heat: 83, comp: 69, coreWord: '家庭独立成团包车' },
          { name: '春节/国庆全家错峰度假', desc: '锁定稀缺连住房源，提供团圆宴与本地特色体验。', heat: 81, comp: 74, coreWord: '节假日全家度假套餐' },
          { name: '康养温泉与文化慢游线路', desc: '适合长辈与孩子共同放松的低强度自然文化线路。', heat: 76, comp: 64, coreWord: '家庭康养温泉慢游' }
        ]) },
        { id: 's-fam-3', rank: 2, name: '寒暑假长线科普研学游', desc: '围绕北京、西安、丝绸之路、热带雨林等文化自然目的地深度定制。', heat: 84, comp: 76, intents: makeIntents('s-fam-3', [
          { name: '暑期亲子深度研学团推荐', desc: '配备专业研学导师与深度博物馆私享讲解。', heat: 85, comp: 77, coreWord: '暑期亲子研学游推荐' },
          { name: '历史名城亲子讲解定制游', desc: '让孩子听得懂的故宫、兵马俑沉浸式互动讲解。', heat: 82, comp: 73, coreWord: '历史名城亲子定制游' },
          { name: '自然生态探秘亲子路线', desc: '版纳雨林、草原牧场、海洋科普安全体验行程。', heat: 79, comp: 68, coreWord: '自然科普亲子旅游团' },
          { name: '多家庭拼小团定制服务', desc: '2-3 组同学家庭结伴定制，均摊成本且社交氛围佳。', heat: 75, comp: 63, coreWord: '多家庭结伴定制小团' }
        ]) },
        { id: 's-fam-4', rank: 3, name: '家庭出境亲子轻度假', desc: '新加坡、日本、马来西亚等飞行时间短、治安好、亲子设施完善的目的地。', heat: 81, comp: 79, intents: makeIntents('s-fam-4', [
          { name: '新加坡/日本亲子私家团', desc: '含签证、中文专车接机与环球影城/乐园直通票。', heat: 83, comp: 80, coreWord: '新加坡日本亲子私家团' },
          { name: '出境游家庭签证一站办理', desc: '全家材料统一预审，提高老人与在读子女出签率。', heat: 79, comp: 75, coreWord: '家庭出境签证一站办理' },
          { name: '海外亲子邮轮航线预订', desc: '免去舟车劳顿，一船吃住玩全包的家庭邮轮度假。', heat: 78, comp: 74, coreWord: '家庭亲子邮轮旅游推荐' },
          { name: '境外亲子应急医疗与保险', desc: '覆盖儿童发烧门诊垫付、航班延误与中文客服协助。', heat: 72, comp: 65, coreWord: '境外亲子游保障服务' }
        ]) }
      ]
    },
    {
      id: 'p-outbound',
      rank: 3,
      tag: 'TOP 3 细分客群',
      name: '出境游需求客群',
      desc: '年龄集中 25-50 岁，有出境出行需求，需要签证办理、国际机票、海外酒店、当地游等一站式服务，对服务专业性要求高，消费能力强，客单价高。',
      aiSummary: '本客群具备极强消费力与高客单价特征，决策链路长、信任门槛高，极度看重正规出境资质、签证通过率、中文在地接待与突发应急兜底能力。',
      reason: '单笔订单利润率最高，在 AI 问答中对“正规出境旅行社、高通过率签证、境外定制私家团”检索意图极为明确。',
      heat: 80,
      comp: 85,
      ageCore: { pct: 38, label: '30-39' },
      ageDist: [
        { label: '17岁以下', pct: 2, color: '#3b82f6' },
        { label: '18-24岁', pct: 10, color: '#06b6d4' },
        { label: '25-29岁', pct: 26, color: '#f59e0b' },
        { label: '30-39岁', pct: 38, color: '#f97316' },
        { label: '40-49岁', pct: 18, color: '#10b981' },
        { label: '50岁以上', pct: 6, color: '#8b5cf6' }
      ],
      genderLead: { pct: 55, label: '女性' },
      genderDist: [
        { label: '男性', pct: 45, color: '#3b82f6' },
        { label: '女性', pct: 55, color: '#06b6d4' }
      ],
      consume: { level: 'L5', label: '高消费', score: 5 },
      income: { level: 'L5', label: '高收入', score: 5 },
      cities: [
        { name: '一线城市', tag: '高', pct: 92, top: true },
        { name: '新一线', tag: '高', pct: 84, top: false },
        { name: '二线城市', tag: '中', pct: 46, top: false },
        { name: '三线及以下', tag: '低', pct: 16, top: false }
      ],
      scenes: [
        { id: 's-out-1', rank: 0, name: '欧美澳长线深度定制游', desc: '10-15 天跨国连线行程，要求资深路线师定制、高星酒店、专车中文司导与全包透明报价。', heat: 83, comp: 87, intents: makeIntents('s-out-1', [
          { name: '欧洲多国高端定制旅行社', desc: '对比法意瑞、北欧极光等长线定制机构资质与真实案例。', heat: 84, comp: 88, coreWord: '欧洲高端定制旅行社推荐' },
          { name: '澳新自驾与包车私家团', desc: '含驾照翻译认证、精选景观酒店与中文司导陪同。', heat: 80, comp: 83, coreWord: '澳新私家定制游推荐' },
          { name: '出境长线纯玩无购物精品团', desc: '严控团员人数、含全部门票与高餐标特色美食。', heat: 81, comp: 84, coreWord: '出境长线纯玩精品团' },
          { name: '境外公务舱联程机酒定制', desc: '为高净值客群匹配优选航司公务舱与奢华酒店礼遇。', heat: 75, comp: 79, coreWord: '高净值出境奢华游定制' }
        ]) },
        { id: 's-out-2', rank: 1, name: '日韩东南亚高频出境度假', desc: '飞行 2-5 小时高复购出境目的地，需签证快办、精选酒店、地道美食与自由活动平衡。', heat: 86, comp: 85, intents: makeIntents('s-out-2', [
          { name: '日本关西/北海道定制小团', desc: '含温泉旅馆代订、米其林餐厅预约与专车接送。', heat: 87, comp: 86, coreWord: '日本高端私家小团推荐' },
          { name: '东南亚海岛奢华度假套餐', desc: '普吉、巴厘、仙本那等高评分度假村与出海包船。', heat: 84, comp: 84, coreWord: '东南亚海岛度假套餐' },
          { name: '日韩三年/五年多次签证代办', desc: '简化在职与资产证明，提升出签速度与通过率。', heat: 83, comp: 82, coreWord: '日本多次签证代办机构' },
          { name: '境外购物退税与中文包车', desc: '奥特莱斯/免税店专车接送及退税攻略贴心协助。', heat: 77, comp: 76, coreWord: '日韩中文包车旅游服务' }
        ]) },
        { id: 's-out-3', rank: 2, name: '全球签证与出境合规筹备', desc: '解决申根、美签、英签等复杂面签辅导、材料翻译与行程单/酒店预订单合规准备。', heat: 81, comp: 83, intents: makeIntents('s-out-3', [
          { name: '申根/美签专业辅导机构', desc: '提供 1v1 面签模拟、拒签再签诊断与加急预约。', heat: 82, comp: 84, coreWord: '申根美签专业代办机构' },
          { name: '白本护照高通过率签证方案', desc: '针对首次出境客群匹配稳妥材料清单与出签指导。', heat: 79, comp: 80, coreWord: '白本护照签证代办推荐' },
          { name: '出境游全险与紧急救援配套', desc: '满足申根保额要求并覆盖医疗转运与财物保障。', heat: 74, comp: 72, coreWord: '出境旅游保险与救援' },
          { name: '跨国多签一站式规划服务', desc: '多国联游签证先后顺序与有效期最优衔接。', heat: 72, comp: 70, coreWord: '多国联游签证规划' }
        ]) },
        { id: 's-out-4', rank: 3, name: '特色主题出境体验（邮轮/极光/游学）', desc: '高辨识度稀缺体验产品，重视成团确定性与专业领队服务。', heat: 77, comp: 81, intents: makeIntents('s-out-4', [
          { name: '北欧极光与玻璃屋定制游', desc: '锁仓旺季极光木屋、破冰船与专业摄影领队。', heat: 80, comp: 82, coreWord: '北欧极光定制旅游团' },
          { name: '国际豪华邮轮航线预订', desc: '覆盖地中海、阿拉斯加及日韩母港豪华邮轮套房。', heat: 78, comp: 80, coreWord: '豪华邮轮航线预订机构' },
          { name: '海外名校参访与轻游学', desc: '英国/美国/新加坡高校深度参访与官方交流课程。', heat: 76, comp: 79, coreWord: '海外名校游学定制机构' },
          { name: '海外赛事/演唱会观演打包', desc: '含官方门票、周边四五星酒店与接驳交通打包。', heat: 73, comp: 75, coreWord: '海外观赛观演旅游套餐' }
        ]) }
      ]
    },
    {
      id: 'p-biz',
      rank: 4,
      tag: 'TOP 4 细分客群',
      name: '商旅出行需求客群',
      desc: '年龄集中 25-50 岁，为企业出差员工及行政采购负责人，需要预订机票、酒店、会务团建等服务，需求频次高、决策周期短，对预订便捷性、差标匹配度与开票合规要求高。',
      aiSummary: '本客群代表高频刚需的 B 端企业差旅与 MICE 团建采购需求，决策高度聚焦合规增值税专票、差标管控、月结对账与应急退改响应，一旦签约即形成全年稳定复购。',
      reason: '单客年度 LTV 极高，包含企业差旅月结、年会会务与高管商务考察，适合用专业企服案例与透明对账能力在 AI 中建立首选心智。',
      heat: 75,
      comp: 70,
      ageCore: { pct: 44, label: '30-39' },
      ageDist: [
        { label: '17岁以下', pct: 0, color: '#3b82f6' },
        { label: '18-24岁', pct: 8, color: '#06b6d4' },
        { label: '25-29岁', pct: 26, color: '#f59e0b' },
        { label: '30-39岁', pct: 44, color: '#f97316' },
        { label: '40-49岁', pct: 18, color: '#10b981' },
        { label: '50岁以上', pct: 4, color: '#8b5cf6' }
      ],
      genderLead: { pct: 64, label: '男性' },
      genderDist: [
        { label: '男性', pct: 64, color: '#3b82f6' },
        { label: '女性', pct: 36, color: '#06b6d4' }
      ],
      consume: { level: 'L4', label: '中高', score: 4 },
      income: { level: 'L4', label: '中高', score: 4 },
      cities: [
        { name: '一线城市', tag: '高', pct: 90, top: true },
        { name: '新一线', tag: '高', pct: 82, top: false },
        { name: '二线城市', tag: '中', pct: 48, top: false },
        { name: '三线及以下', tag: '低', pct: 18, top: false }
      ],
      scenes: [
        { id: 's-biz-1', rank: 0, name: '企业差旅机酒月结托管', desc: '为成长型与中大型企业提供差标管控、统付月结、专票汇总与 7×24 改签支持。', heat: 78, comp: 72, intents: makeIntents('s-biz-1', [
          { name: '企业差旅管理服务商推荐', desc: '对比差旅托管平台与旅行社企服团队的费率、垫资与月结能力。', heat: 79, comp: 73, coreWord: '企业差旅服务商推荐' },
          { name: '差旅统付开专票合规方案', desc: '解决员工垫资报销繁琐、发票分散与税务合规难题。', heat: 76, comp: 69, coreWord: '企业差旅月结开票服务' },
          { name: '协议酒店与航司大客户价', desc: '降低企业年度商旅总支出 10%-18% 的集中采购资源。', heat: 75, comp: 71, coreWord: '企业协议酒店机票采购' },
          { name: '紧急出差极速出票与改签', desc: '保障高管临时行程变动 5 分钟内响应处理。', heat: 71, comp: 65, coreWord: '商旅24小时改签保障' }
        ]) },
        { id: 's-biz-2', rank: 1, name: '企业年会与百人团建策划', desc: '一站式承接 30-500 人企业团建、年度盛典、会议场地预订、交通与团队破冰执行。', heat: 81, comp: 74, intents: makeIntents('s-biz-2', [
          { name: '企业团建旅游定制旅行社', desc: '按人均预算快速输出 3 套可落地行程与明细报价。', heat: 82, comp: 75, coreWord: '企业团建定制旅行社' },
          { name: '百人会议酒店场地一站预订', desc: '统筹宴会厅、视听舞美、大巴接送与团体住宿。', heat: 79, comp: 72, coreWord: '企业年会会议场地预订' },
          { name: '经销商答谢奖励旅游方案', desc: '定制高规格海岛/出境激励游，提升渠道粘性。', heat: 76, comp: 70, coreWord: '企业奖励旅游定制方案' },
          { name: '团队出行保险与安全预案', desc: '配备全员高额意外险、专职领队与应急医疗预案。', heat: 70, comp: 62, coreWord: '企业团建安全合规保障' }
        ]) },
        { id: 's-biz-3', rank: 2, name: '商务考察与行业展会出行', desc: '组织标杆企业参访、海外国际展会观展及商务翻译接待服务。', heat: 73, comp: 68, intents: makeIntents('s-biz-3', [
          { name: '海外展会商旅一站式接待', desc: '覆盖展馆周边紧俏酒店锁房、商务车与展期翻译。', heat: 75, comp: 69, coreWord: '海外展会商旅接待服务' },
          { name: '标杆企业参访考察团定制', desc: '对接行业头部企业交流、会议安排与高端食宿。', heat: 73, comp: 67, coreWord: '企业商务考察团定制' },
          { name: '商务签证加急与邀请函协助', desc: '缩短紧急赴外商务洽谈的签证办理周期。', heat: 72, comp: 68, coreWord: '商务签证加急代办服务' },
          { name: '高管专车接机与礼宾服务', desc: '提供机场 VIP 通道、豪华商务车及双语随行。', heat: 69, comp: 63, coreWord: '高管商务礼宾接机服务' }
        ]) },
        { id: 's-biz-4', rank: 3, name: '党建/工会疗休养活动组织', desc: '符合政企工会采购合规标准的红色研学与职工疗休养路线执行。', heat: 74, comp: 66, intents: makeIntents('s-biz-4', [
          { name: '工会职工疗休养正规旅行社', desc: '严格匹配工会费用标准、正规合同与对公结算。', heat: 76, comp: 67, coreWord: '工会疗休养旅行社推荐' },
          { name: '红色党建研学路线定制', desc: '提供专业讲解、主题党课场地与全流程后勤保障。', heat: 74, comp: 65, coreWord: '红色党建研学路线定制' },
          { name: '政企采购招投标资质与案例', desc: '展示 AAA 信用等级、大型活动履约经验与透明报价。', heat: 71, comp: 64, coreWord: '政企团建采购合作旅行社' },
          { name: '职工家庭亲子日活动承办', desc: '一站式执行周边一日/两日企业家庭关怀活动。', heat: 68, comp: 60, coreWord: '企业家庭日活动承办' }
        ]) }
      ]
    },
    {
      id: 'p-silver',
      rank: 5,
      tag: 'TOP 5 细分客群',
      name: '银发休闲旅游需求客群',
      desc: '年龄集中 55-70 岁，为退休人群，时间充裕，偏好跟团游产品，关注行程舒适度、安全性与导游耐心服务，对价格敏感度中等，出行时间高度灵活。',
      aiSummary: '本客群时间充裕、错峰出游意愿极强，能够有效填补淡季运力，且老乡圈层转介绍率极高；核心转化抓手在于“慢节奏纯玩、适老食宿、贴心领队与子女放心”。',
      reason: '银发经济持续增长，且常由“子女替父母在 AI 搜索挑选靠谱旅行社”完成转化，建立无购物、适老化与安全口碑至关重要。',
      heat: 70,
      comp: 65,
      ageCore: { pct: 68, label: '50岁以上' },
      ageDist: [
        { label: '17岁以下', pct: 0, color: '#3b82f6' },
        { label: '18-24岁', pct: 2, color: '#06b6d4' },
        { label: '25-29岁', pct: 4, color: '#f59e0b' },
        { label: '30-39岁', pct: 12, color: '#f97316' },
        { label: '40-49岁', pct: 14, color: '#10b981' },
        { label: '50岁以上', pct: 68, color: '#8b5cf6' }
      ],
      genderLead: { pct: 54, label: '女性' },
      genderDist: [
        { label: '男性', pct: 46, color: '#3b82f6' },
        { label: '女性', pct: 54, color: '#06b6d4' }
      ],
      consume: { level: 'L3', label: '中等偏上', score: 3 },
      income: { level: 'L3', label: '稳定', score: 3 },
      cities: [
        { name: '一线城市', tag: '中', pct: 66, top: false },
        { name: '新一线', tag: '高', pct: 82, top: true },
        { name: '二线城市', tag: '中', pct: 68, top: false },
        { name: '三线及以下', tag: '低', pct: 34, top: false }
      ],
      scenes: [
        { id: 's-sil-1', rank: 0, name: '中老年纯玩慢游专列/跟团', desc: '严选 0 购物慢节奏线路，配全陪领队、适老餐饮与舒适大巴/旅游专列。', heat: 74, comp: 66, intents: makeIntents('s-sil-1', [
          { name: '适合父母的中老年纯玩团', desc: '子女重点核查无强制购物、慢节奏与好评率。', heat: 76, comp: 68, coreWord: '中老年纯玩跟团游推荐' },
          { name: '银发旅游专列线路预订', desc: '一铺到底、一线多游、随车医护保障的特色专列。', heat: 75, comp: 66, coreWord: '中老年旅游专列预订' },
          { name: '淡季错峰高性价比跟团游', desc: '春秋错峰高星酒店打包团，价格实惠体验佳。', heat: 72, comp: 64, coreWord: '淡季错峰跟团游推荐' },
          { name: '退休老友结伴包团定制', desc: '10-20 位同学老友独立成团，自由把控行程节奏。', heat: 69, comp: 60, coreWord: '退休老友结伴定制团' }
        ]) },
        { id: 's-sil-2', rank: 1, name: '季节候鸟康养旅居', desc: '冬季南下三亚/西双版纳、夏季北上避暑的 7-30 天轻旅居康养套餐。', heat: 72, comp: 64, intents: makeIntents('s-sil-2', [
          { name: '冬季避寒康养旅居基地', desc: '含三餐、健康监测与文娱活动的正规旅居套餐。', heat: 74, comp: 65, coreWord: '中老年康养旅居推荐' },
          { name: '夏季避暑山林康养慢游', desc: '气候凉爽、负氧离子高的半月度假休闲团。', heat: 71, comp: 62, coreWord: '中老年避暑康养路线' },
          { name: '温泉理疗与中医养生短途游', desc: '周边 3-5 天高品质温泉酒店与舒缓养生行程。', heat: 70, comp: 61, coreWord: '中老年温泉养生游' },
          { name: '旅居适老化住宿安全评测', desc: '关注电梯无障碍、就医便利度与 24 小时管家响应。', heat: 66, comp: 57, coreWord: '适老化旅居安全保障' }
        ]) },
        { id: 's-sil-3', rank: 2, name: '江河邮轮与山水慢观光', desc: '长江三峡游轮、江南水乡及名山缆车代步等低体力消耗观光产品。', heat: 71, comp: 65, intents: makeIntents('s-sil-3', [
          { name: '长江三峡豪华游轮老人团', desc: '免搬行李、一价全含、岸上轻松游览的经典线路。', heat: 73, comp: 67, coreWord: '三峡豪华游轮老人团' },
          { name: '名山大川免爬山轻松游', desc: '全程含景区环保车与往返索道，减轻膝盖负担。', heat: 70, comp: 63, coreWord: '中老年轻松山水游' },
          { name: '江南古镇文化慢游路线', desc: '住景区旁品质酒店、品地道苏杭徽菜的舒缓团。', heat: 69, comp: 62, coreWord: '江南文化慢游跟团' },
          { name: '摄影采风银发兴趣小团', desc: '面向爱好摄影的退休人群，留足黄金光线拍摄时间。', heat: 65, comp: 58, coreWord: '银发摄影采风小团' }
        ]) },
        { id: 's-sil-4', rank: 3, name: '子女代订安心保障服务', desc: '解决子女异地替父母报团的安心诉求，提供行程微信群直播与全流程透明反馈。', heat: 70, comp: 63, intents: makeIntents('s-sil-4', [
          { name: '子女帮父母报团哪家放心', desc: '重点评估旅行社口碑、全陪责任心与突发应急机制。', heat: 73, comp: 65, coreWord: '帮父母报团靠谱旅行社' },
          { name: '高龄老人参团保险与体检', desc: '明确 70 岁以上参团年龄政策、专项意外险保障。', heat: 70, comp: 62, coreWord: '高龄老人参团保险政策' },
          { name: '导游每日图文报平安服务', desc: '行程群实时同步位置、餐饮与合影，让子女更安心。', heat: 68, comp: 59, coreWord: '老人团行程报平安服务' },
          { name: '一对一接送站与协助值机', desc: '覆盖机场火车站专人举牌接送及协助办理登机。', heat: 66, comp: 58, coreWord: '老人出行接送协助服务' }
        ]) }
      ]
    }
  ];

  // 状态管理（默认进入知识图谱，点击顶部胶囊无缝切换营销洞察）
  const state = {
    mode: 'graph',          // 'graph' | 'insight'
    view: 'main',           // 'main' | 'persona' | 'scene' | 'intent'
    returnView: 'main',     // 返回栈：'main' | 'persona' | 'scene'
    personaId: PERSONAS[0].id,
    sceneId: PERSONAS[0].scenes[0].id,
    intentId: PERSONAS[0].scenes[0].intents[0].id,
    wordsExpanded: true
  };

  function getPersona(id = state.personaId) {
    return PERSONAS.find(p => p.id === id) || PERSONAS[0];
  }
  function getScene(persona = getPersona(), sid = state.sceneId) {
    return persona.scenes.find(s => s.id === sid) || persona.scenes[0];
  }
  function getIntent(scene = getScene(), iid = state.intentId) {
    return scene.intents.find(i => i.id === iid) || scene.intents[0];
  }

  function rankBadgeHtml(rank, kind = 'persona') {
    if (rank === 0) {
      if (kind === 'persona') {
        return `<span class="mkb-badge-icon blue" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>`;
      }
      if (kind === 'scene') {
        return `<span class="mkb-badge-icon gold-soft" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg></span>`;
      }
      return `<span class="mkb-badge-icon gold-soft" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg></span>`;
    }
    const cls = rank <= 2 ? `t${rank}` : (rank <= 4 ? `t${rank}` : 't5');
    return `<span class="mkb-top-badge ${cls}"><span>TOP</span><strong>${rank}</strong></span>`;
  }

  function metricsHtml(heat, comp, compact = false) {
    const hotHeat = heat >= 85;
    const hotComp = comp >= 85;
    return `
      <div class="mkb-metrics ${compact ? 'compact' : ''}">
        <div class="mkb-metric-item">
          <span class="mkb-metric-label">热度</span>
          <span class="mkb-metric-track"><span class="mkb-metric-fill ${hotHeat ? 'hot' : ''}" style="display:block;width:${Math.min(100, heat)}%"></span></span>
          <span class="mkb-metric-val ${hotHeat ? 'hot' : ''}">${heat}</span>
        </div>
        <div class="mkb-metric-item">
          <span class="mkb-metric-label">竞争</span>
          <span class="mkb-metric-track"><span class="mkb-metric-fill ${hotComp ? 'hot' : ''}" style="display:block;width:${Math.min(100, comp)}%"></span></span>
          <span class="mkb-metric-val ${hotComp ? 'hot' : ''}">${comp}</span>
        </div>
      </div>`;
  }

  // 生成高颜值 SVG 环形图
  function donutSvg(segments, centerTop, centerMid, centerSub) {
    const r = 52;
    const cx = 72;
    const cy = 72;
    const circ = 2 * Math.PI * r;
    const valid = segments.filter(s => s.pct > 0);
    const gap = valid.length > 1 ? 2.4 : 0;
    let offset = 0;
    const circles = valid.map(seg => {
      const len = Math.max(0, (seg.pct / 100) * circ - gap);
      const dashOffset = -offset;
      offset += (seg.pct / 100) * circ;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="18" stroke-dasharray="${len.toFixed(2)} ${(circ - len).toFixed(2)}" stroke-dashoffset="${dashOffset.toFixed(2)}" transform="rotate(-90 ${cx} ${cy})" />`;
    }).join('');
    return `
      <svg class="mkb-donut-svg" viewBox="0 0 144 144" role="img" aria-label="${esc(centerMid)} ${esc(centerTop)}">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f1f5f9" stroke-width="18" />
        ${circles}
        <text x="${cx}" y="63" text-anchor="middle" font-size="20" font-weight="800" fill="#0f172a">${esc(centerTop)}</text>
        <text x="${cx}" y="81" text-anchor="middle" font-size="12.5" font-weight="700" fill="#334155">${esc(centerMid)}</text>
        <text x="${cx}" y="97" text-anchor="middle" font-size="10.5" fill="#94a3b8">${esc(centerSub)}</text>
      </svg>`;
  }

  // 顶部模式切换条（无左侧对话栏）
  function topBarHtml() {
    const totalScenes = PERSONAS.reduce((s, p) => s + p.scenes.length, 0);
    const totalIntents = PERSONAS.reduce((s, p) => s + p.scenes.reduce((a, sc) => a + sc.intents.length, 0), 0);
    const totalWords = totalIntents * 20;
    return `
      <div class="mkb-topbar">
        <div class="mkb-mode-pills" role="tablist" aria-label="营销知识库视图切换">
          <button type="button" class="mkb-mode-pill ${state.mode === 'graph' ? 'active' : ''}" data-mkb-act="mode" data-val="graph" role="tab" aria-selected="${state.mode === 'graph'}">知识图谱</button>
          <button type="button" class="mkb-mode-pill ${state.mode === 'insight' ? 'active' : ''}" data-mkb-act="mode" data-val="insight" role="tab" aria-selected="${state.mode === 'insight'}">营销洞察</button>
        </div>
        <div class="mkb-summary-chips">
          <span class="mkb-summary-chip">核心客群 <b>${PERSONAS.length}</b> 个</span>
          <span class="mkb-summary-chip">需求场景 <b>${totalScenes}</b> 个</span>
          <span class="mkb-summary-chip">营销意图 <b>${totalIntents}</b> 个</span>
          <span class="mkb-summary-chip">意图词包 <b>${totalWords.toLocaleString('zh-CN')}</b> 词</span>
        </div>
      </div>`;
  }

  // 视图 A：知识图谱（3 列级联）
  function renderGraphView() {
    const curP = getPersona();
    const curS = getScene(curP);
    const curI = getIntent(curS);

    const personaCards = PERSONAS.map((p, idx) => {
      const divider = idx === 0
        ? `<div class="mkb-col-divider">通用客群</div>`
        : (idx === 1 ? `<div class="mkb-col-divider">细分客群</div>` : '');
      const active = p.id === curP.id;
      return `${divider}
        <div class="mkb-node-card ${active ? 'active' : ''}" data-mkb-act="select-persona" data-id="${esc(p.id)}">
          <div class="mkb-node-head">
            ${rankBadgeHtml(p.rank, 'persona')}
            <div class="mkb-node-title-wrap">
              <div class="mkb-node-title-row">
                <div class="mkb-node-title" title="${esc(p.name)}">${esc(p.name)}</div>
                <button type="button" class="mkb-insight-pill ${active ? 'primary' : ''}" data-mkb-act="open-persona" data-id="${esc(p.id)}">洞察</button>
              </div>
              <p class="mkb-node-desc">${esc(p.desc)}</p>
              ${metricsHtml(p.heat, p.comp, true)}
            </div>
          </div>
        </div>`;
    }).join('');

    const sceneCards = curP.scenes.map((sc, idx) => {
      const divider = idx === 0
        ? `<div class="mkb-col-divider">通用场景</div>`
        : (idx === 1 ? `<div class="mkb-col-divider">细分场景</div>` : '');
      const active = sc.id === curS.id;
      return `${divider}
        <div class="mkb-node-card ${active ? 'active' : ''}" data-mkb-act="select-scene" data-id="${esc(sc.id)}">
          <div class="mkb-node-head">
            ${rankBadgeHtml(sc.rank, 'scene')}
            <div class="mkb-node-title-wrap">
              <div class="mkb-node-title-row">
                <div class="mkb-node-title" title="${esc(sc.name)}">${esc(sc.name)}</div>
                <button type="button" class="mkb-insight-pill ${active ? 'primary' : ''}" data-mkb-act="open-scene" data-id="${esc(sc.id)}">洞察</button>
              </div>
              <p class="mkb-node-desc">${esc(sc.desc)}</p>
              ${metricsHtml(sc.heat, sc.comp, true)}
            </div>
          </div>
        </div>`;
    }).join('');

    const intentCards = curS.intents.map((it, idx) => {
      const divider = idx === 0
        ? `<div class="mkb-col-divider">通用意图</div>`
        : (idx === 1 ? `<div class="mkb-col-divider">细分意图</div>` : '');
      const active = it.id === curI.id;
      const wordsPanel = active ? `
        <div class="mkb-intent-words-box">
          <button type="button" class="mkb-intent-words-toggle" data-mkb-act="toggle-words">
            <span>意图词（共 ${it.questions.length} 词）</span>
            <span>${state.wordsExpanded ? '⌃ 收起' : '⌄ 展开'}</span>
          </button>
          ${state.wordsExpanded ? `
            <div class="mkb-intent-word-list">
              <div class="mkb-intent-word-row core">
                <span>${esc(it.coreWord)}</span>
                <span class="mkb-core-tag">核心词</span>
              </div>
              ${it.questions.slice(0, 12).map(q => `<div class="mkb-intent-word-row"><span>${esc(q)}</span></div>`).join('')}
              ${it.questions.length > 12 ? `<button type="button" class="mkb-copy-btn" style="width:100%;margin-top:4px" data-mkb-act="open-intent" data-id="${esc(it.id)}">查看全部 ${it.questions.length} 条意图词包与承接动作 →</button>` : ''}
            </div>` : ''}
        </div>` : '';
      return `${divider}
        <div class="mkb-node-card ${active ? 'active' : ''}" data-mkb-act="select-intent" data-id="${esc(it.id)}">
          <div class="mkb-node-head">
            ${rankBadgeHtml(it.rank, 'intent')}
            <div class="mkb-node-title-wrap">
              <div class="mkb-node-title-row">
                <div class="mkb-node-title" title="${esc(it.name)}">${esc(it.name)}</div>
                <button type="button" class="mkb-insight-pill ${active ? 'primary' : ''}" data-mkb-act="open-intent" data-id="${esc(it.id)}">洞察</button>
              </div>
              <p class="mkb-node-desc">${esc(it.desc)}</p>
              ${metricsHtml(it.heat, it.comp, true)}
            </div>
          </div>
          ${wordsPanel}
        </div>`;
    }).join('');

    return `
      <div class="mkb-graph-grid">
        <section class="mkb-graph-col">
          <div class="mkb-col-head"><h2>核心客群</h2><span class="mkb-count-pill">${PERSONAS.length}个</span></div>
          <div class="mkb-col-scroll">${personaCards}</div>
        </section>
        <section class="mkb-graph-col">
          <div class="mkb-col-head"><h2>核心场景</h2><span class="mkb-count-pill">${curP.scenes.length}个</span></div>
          <div class="mkb-col-scroll">${sceneCards}</div>
        </section>
        <section class="mkb-graph-col">
          <div class="mkb-col-head"><h2>意图&amp;词包</h2><span class="mkb-count-pill">${curS.intents.length}个</span></div>
          <div class="mkb-col-scroll">${intentCards}</div>
        </section>
      </div>`;
  }

  // 视图 B：营销洞察 · 客群卡片网格
  function renderInsightGridView() {
    return `
      <div class="mkb-surface">
        <div class="mkb-persona-grid">
          ${PERSONAS.map(p => {
            const intentsCnt = p.scenes.reduce((s, sc) => s + sc.intents.length, 0);
            const wordsCnt = intentsCnt * 20;
            return `
              <article class="mkb-persona-card">
                <div class="mkb-pcard-head">
                  ${rankBadgeHtml(p.rank, 'persona')}
                  <div style="min-width:0;flex:1">
                    <h3 class="mkb-pcard-title">${esc(p.name)}</h3>
                    <p class="mkb-pcard-desc">${esc(p.desc)}</p>
                  </div>
                </div>
                <div class="mkb-pcard-stats">
                  <div class="mkb-pcard-stat"><b>${p.scenes.length}</b><span>场景</span></div>
                  <div class="mkb-pcard-stat"><b>${intentsCnt}</b><span>意图</span></div>
                  <div class="mkb-pcard-stat"><b>${wordsCnt}</b><span>关键词</span></div>
                </div>
                ${metricsHtml(p.heat, p.comp, false)}
                <button type="button" class="mkb-cta-btn" data-mkb-act="open-persona" data-id="${esc(p.id)}">查看客群详情页</button>
              </article>`;
          }).join('')}
        </div>
      </div>`;
  }

  // 视图 C：客群详情页（图 2 + 图 3）
  function renderPersonaDetailView() {
    const p = getPersona();
    return `
      <div class="mkb-detail-bar">
        <div class="mkb-breadcrumb">
          <button type="button" class="mkb-back-btn" data-mkb-act="back-main">← 返回</button>
          <span class="mkb-sep">|</span>
          <span>${esc(p.name)}</span>
        </div>
      </div>

      <div class="mkb-detail-stack">
        <section class="mkb-section-card">
          <div class="mkb-section-head">
            <h3 class="mkb-section-title"><span class="mkb-star">✦</span>AI 摘要</h3>
          </div>
          <p class="mkb-ai-summary-text">${esc(p.aiSummary)}</p>
        </section>

        <section class="mkb-section-card">
          <div class="mkb-section-head">
            <div class="mkb-section-title-group">
              <h3 class="mkb-section-title"><span class="mkb-star">✦</span>客群定义</h3>
              <span class="mkb-section-sub">客群基础信息，帮助快速建立统一的人群认知</span>
            </div>
          </div>
          <div class="mkb-def-box">
            <div class="mkb-def-label">客群名称</div>
            <div class="mkb-def-name-row">
              <span class="mkb-def-name">${esc(p.name)}</span>
              <span class="mkb-soft-tag">${esc(p.tag)}</span>
            </div>
          </div>
          <div class="mkb-def-grid">
            <div class="mkb-def-box">
              <div class="mkb-def-label">核心特征描述</div>
              <p class="mkb-def-text">${esc(p.desc)}</p>
            </div>
            <div class="mkb-def-box">
              <div class="mkb-def-label">采用原因与数据支撑</div>
              <p class="mkb-def-text">${esc(p.reason)}</p>
            </div>
          </div>
        </section>

        <section class="mkb-section-card">
          <div class="mkb-section-head">
            <div class="mkb-section-title-group">
              <h3 class="mkb-section-title"><span class="mkb-star">✦</span>人群画像</h3>
              <span class="mkb-section-sub">结构为模拟推演，用于辅助判断客群轮廓与消费特征</span>
            </div>
          </div>

          <div class="mkb-portrait-grid">
            <!-- 年龄段占比 -->
            <div class="mkb-portrait-box">
              <div class="mkb-portrait-title">
                <b>年龄段占比</b>
                <span>客群年龄结构分布，便于界定核心沟通对象</span>
              </div>
              <div class="mkb-donut-wrap">
                ${donutSvg(p.ageDist, `${p.ageCore.pct}%`, p.ageCore.label, '核心年龄层')}
                <div class="mkb-legend-grid">
                  ${p.ageDist.map(a => `
                    <div class="mkb-legend-pill">
                      <span class="mkb-legend-left"><span class="mkb-dot" style="background:${a.color}"></span>${esc(a.label)}</span>
                      <b>${a.pct}%</b>
                    </div>`).join('')}
                </div>
              </div>
            </div>

            <!-- 性别占比 -->
            <div class="mkb-portrait-box">
              <div class="mkb-portrait-title">
                <b>性别占比</b>
                <span>客群性别结构概览，辅助判断内容表达语气与视觉偏好</span>
              </div>
              <div class="mkb-donut-wrap">
                ${donutSvg(p.genderDist, `${p.genderLead.pct}%`, p.genderLead.label, '主导性别')}
                <div class="mkb-legend-grid">
                  ${p.genderDist.map(g => `
                    <div class="mkb-legend-pill">
                      <span class="mkb-legend-left"><span class="mkb-dot" style="background:${g.color}"></span>${esc(g.label)}</span>
                      <b>${g.pct}%</b>
                    </div>`).join('')}
                </div>
              </div>
            </div>

            <!-- 消费/收入水平 -->
            <div class="mkb-portrait-box">
              <div class="mkb-portrait-title">
                <b>消费/收入水平</b>
                <span>采用 5 级评分，帮助快速判断价格带与转化门槛</span>
              </div>
              <div class="mkb-level-grid">
                <div class="mkb-level-card">
                  <div class="mkb-level-top"><b>消费水平</b><span class="mkb-level-badge">等级 ${esc(p.consume.level)}</span></div>
                  <div class="mkb-level-desc">反映价格敏感度与体验诉求强弱</div>
                  <div class="mkb-level-val">${esc(p.consume.label)}</div>
                  <div class="mkb-level-sub">当前定位</div>
                  <div class="mkb-level-bars">
                    ${[1, 2, 3, 4, 5].map(n => `<span class="mkb-level-seg ${n <= p.consume.score ? 'blue' : ''}"></span>`).join('')}
                  </div>
                </div>
                <div class="mkb-level-card">
                  <div class="mkb-level-top"><b>收入水平</b><span class="mkb-level-badge">等级 ${esc(p.income.level)}</span></div>
                  <div class="mkb-level-desc">决定价格接受区间与升维空间</div>
                  <div class="mkb-level-val">${esc(p.income.label)}</div>
                  <div class="mkb-level-sub">当前定位</div>
                  <div class="mkb-level-bars">
                    ${[1, 2, 3, 4, 5].map(n => `<span class="mkb-level-seg ${n <= p.income.score ? 'amber' : ''}"></span>`).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- 城市等级分布 -->
            <div class="mkb-portrait-box">
              <div class="mkb-portrait-title">
                <b>城市等级分布</b>
                <span>按城市层级拆分覆盖重心，帮助判断传播半径与价格带</span>
              </div>
              <div class="mkb-city-grid">
                ${p.cities.map(c => `
                  <div class="mkb-city-card">
                    <div class="mkb-city-head">
                      <span class="mkb-city-name">${esc(c.name)}</span>
                      <span class="mkb-city-right">${c.top ? '<span class="mkb-city-top">TOP</span>' : ''}${esc(c.tag)}</span>
                    </div>
                    <div class="mkb-city-bar"><div class="mkb-city-fill" style="width:${c.pct}%"></div></div>
                  </div>`).join('')}
              </div>
            </div>
          </div>
        </section>

        <section class="mkb-section-card">
          <div class="mkb-section-head">
            <div class="mkb-section-title-group">
              <h3 class="mkb-section-title"><span class="mkb-star">✦</span>需求场景</h3>
              <span class="mkb-section-sub">点击场景进入：场景深度分析报告</span>
            </div>
          </div>
          <div class="mkb-scene-grid">
            ${p.scenes.map(sc => `
              <div class="mkb-scene-card" data-mkb-act="open-scene-from-persona" data-id="${esc(sc.id)}">
                <div class="mkb-scene-head">
                  <b>${esc(sc.name)}</b>
                  <span class="mkb-link-view">查看 &gt;</span>
                </div>
                <p class="mkb-scene-desc">${esc(sc.desc)}</p>
                <div class="mkb-scene-meta">
                  <span>意图：<b>${sc.intents.length}</b></span>
                  <span>词：<b>${sc.intents.length * 20}</b></span>
                </div>
                ${metricsHtml(sc.heat, sc.comp, false)}
              </div>`).join('')}
          </div>
        </section>
      </div>`;
  }

  // 视图 D：场景深度分析报告（点击客群详情页「需求场景」或图谱场景「洞察」进入）
  function renderSceneDetailView() {
    const p = getPersona();
    const sc = getScene(p);
    return `
      <div class="mkb-detail-bar">
        <div class="mkb-breadcrumb">
          <button type="button" class="mkb-back-btn" data-mkb-act="back-step">← 返回</button>
          <span class="mkb-sep">|</span>
          <span style="color:#64748b">${esc(p.name)}</span>
          <span class="mkb-sep">/</span>
          <span>${esc(sc.name)}</span>
        </div>
      </div>

      <div class="mkb-detail-stack">
        <section class="mkb-section-card">
          <div class="mkb-section-head">
            <h3 class="mkb-section-title"><span class="mkb-star">✦</span>AI 摘要</h3>
          </div>
          <p class="mkb-ai-summary-text">「${esc(sc.name)}」归属「${esc(p.name)}」，当前场景综合热度 <b>${sc.heat}</b>、竞争指数 <b>${sc.comp}</b>，共拆解出 <b>${sc.intents.length} 个核心营销意图</b> 与 <b>${sc.intents.length * 20} 条高意图提问词</b>，建议围绕下方意图优先布局结构化权威信源内容。</p>
        </section>

        <section class="mkb-section-card">
          <div class="mkb-section-head">
            <div class="mkb-section-title-group">
              <h3 class="mkb-section-title"><span class="mkb-star">✦</span>场景定义</h3>
              <span class="mkb-section-sub">清晰界定该出行场景的用户痛点与评估热度</span>
            </div>
          </div>
          <div class="mkb-def-box">
            <div class="mkb-def-label">场景名称 / 场景描述</div>
            <div class="mkb-def-name-row" style="margin-bottom:8px">
              <span class="mkb-def-name">${esc(sc.name)}</span>
              <span class="mkb-soft-tag">${sc.rank === 0 ? '通用场景' : `TOP ${sc.rank} 细分场景`}</span>
            </div>
            <p class="mkb-def-text">${esc(sc.desc)}</p>
          </div>
          <div style="margin-top:12px">${metricsHtml(sc.heat, sc.comp, false)}</div>
        </section>

        <section class="mkb-section-card">
          <div class="mkb-section-head">
            <div class="mkb-section-title-group">
              <h3 class="mkb-section-title"><span class="mkb-star">✦</span>核心意图与词包</h3>
              <span class="mkb-section-sub">点击任一意图查看完整承接动作与 TOP 1~20 提问词</span>
            </div>
          </div>
          <div class="mkb-scene-grid">
            ${sc.intents.map(it => `
              <div class="mkb-scene-card" data-mkb-act="open-intent-from-scene" data-id="${esc(it.id)}">
                <div class="mkb-scene-head">
                  <div style="display:flex;align-items:center;gap:8px;min-width:0">
                    ${rankBadgeHtml(it.rank, 'intent')}
                    <b>${esc(it.name)}</b>
                  </div>
                  <span class="mkb-link-view">查看详情 &gt;</span>
                </div>
                <p class="mkb-scene-desc">${esc(it.desc)}</p>
                <div class="mkb-scene-meta">
                  <span>核心词：<b>${esc(it.coreWord)}</b></span>
                  <span>提问词：<b>${it.questions.length} 词</b></span>
                </div>
                ${metricsHtml(it.heat, it.comp, false)}
              </div>`).join('')}
          </div>
        </section>
      </div>`;
  }

  // 视图 E：意图详情页（图 5 + 图 6）
  function renderIntentDetailView() {
    const p = getPersona();
    const sc = getScene(p);
    const it = getIntent(sc);
    return `
      <div class="mkb-detail-bar">
        <div class="mkb-breadcrumb">
          <button type="button" class="mkb-back-btn" data-mkb-act="back-step">← 返回</button>
          <span class="mkb-sep">|</span>
          <span>${esc(it.name)}</span>
        </div>
      </div>

      <div class="mkb-detail-stack">
        <section class="mkb-section-card">
          <div class="mkb-section-head">
            <h3 class="mkb-section-title"><span class="mkb-star">✦</span>AI 摘要</h3>
          </div>
          <p class="mkb-ai-summary-text">${esc(it.aiSummary)}</p>
        </section>

        <section class="mkb-section-card">
          <div class="mkb-section-head">
            <div class="mkb-section-title-group">
              <h3 class="mkb-section-title"><span class="mkb-star">✦</span>意图定义</h3>
              <span class="mkb-section-sub">围绕意图名称、意图详情、承接动作与评分详情，完整说明该意图的业务边界与承接方式</span>
            </div>
          </div>
          <div class="mkb-def-box" style="margin-bottom:12px">
            <div class="mkb-def-label">意图名称 / 意图详情</div>
            <div class="mkb-def-name-row" style="margin-bottom:8px">
              <span class="mkb-def-name">${esc(it.name)}</span>
              <span class="mkb-soft-tag">${it.rank === 0 ? '通用意图' : `TOP ${it.rank} 细分意图`}</span>
            </div>
            <p class="mkb-def-text">${esc(it.desc)}</p>
          </div>
          <div class="mkb-def-box">
            <div class="mkb-def-label">📄 承接动作</div>
            <p class="mkb-def-text">${esc(it.action)}</p>
          </div>
        </section>

        <section class="mkb-section-card">
          <div class="mkb-section-head">
            <div class="mkb-section-title-group">
              <h3 class="mkb-section-title"><span class="mkb-star">✦</span>意图词（词包）</h3>
              <span class="mkb-section-sub">展示当前意图的核心词与所有提问词</span>
            </div>
            <button type="button" class="mkb-copy-btn" data-mkb-act="copy-intent-words">一键复制全部 ${it.questions.length} 词</button>
          </div>
          <div style="font-size:12.5px;color:#64748b;margin-bottom:10px">共 ${it.questions.length} 词</div>
          <div class="mkb-core-word-banner">
            <b>${esc(it.coreWord)}</b>
            <span class="mkb-core-tag solid">核心词</span>
          </div>
          <div class="mkb-q-divider">提问词</div>
          <div class="mkb-q-grid">
            ${it.questions.map((q, i) => {
              const rank = i + 1;
              const cls = rank <= 2 ? `t${rank}` : (rank <= 4 ? `t${rank}` : 't5');
              return `
                <div class="mkb-q-card">
                  <span class="mkb-top-badge ${cls}"><span>TOP</span><strong>${rank}</strong></span>
                  <span class="mkb-q-text">${esc(q)}</span>
                </div>`;
            }).join('')}
          </div>
        </section>
      </div>`;
  }

  function mktKbPage() {
    let body = '';
    if (state.view === 'persona') body = renderPersonaDetailView();
    else if (state.view === 'scene') body = renderSceneDetailView();
    else if (state.view === 'intent') body = renderIntentDetailView();
    else body = state.mode === 'insight' ? renderInsightGridView() : renderGraphView();

    return `<div class="mkb-page">${topBarHtml()}${body}</div>`;
  }

  function rerender() {
    if (typeof render === 'function') render({ preserveScroll: true });
  }

  // 事件委托
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-mkb-act]');
    if (!el) return;
    const act = el.dataset.mkbAct;
    const id = el.dataset.id;
    const val = el.dataset.val;

    if (act === 'mode') {
      state.mode = val === 'insight' ? 'insight' : 'graph';
      state.view = 'main';
      state.returnView = 'main';
      rerender();
      return;
    }
    if (act === 'select-persona') {
      if (e.target.closest('[data-mkb-act="open-persona"]')) return;
      const p = getPersona(id);
      state.personaId = p.id;
      state.sceneId = p.scenes[0].id;
      state.intentId = p.scenes[0].intents[0].id;
      state.wordsExpanded = true;
      rerender();
      return;
    }
    if (act === 'select-scene') {
      if (e.target.closest('[data-mkb-act="open-scene"]')) return;
      const p = getPersona();
      const sc = getScene(p, id);
      state.sceneId = sc.id;
      state.intentId = sc.intents[0].id;
      state.wordsExpanded = true;
      rerender();
      return;
    }
    if (act === 'select-intent') {
      if (e.target.closest('[data-mkb-act="open-intent"]') || e.target.closest('[data-mkb-act="toggle-words"]')) return;
      const sc = getScene();
      const it = getIntent(sc, id);
      state.intentId = it.id;
      state.wordsExpanded = true;
      rerender();
      return;
    }
    if (act === 'toggle-words') {
      e.stopPropagation();
      state.wordsExpanded = !state.wordsExpanded;
      rerender();
      return;
    }
    if (act === 'open-persona') {
      e.stopPropagation();
      const p = getPersona(id);
      state.personaId = p.id;
      state.sceneId = p.scenes[0].id;
      state.intentId = p.scenes[0].intents[0].id;
      state.mode = 'insight';
      state.view = 'persona';
      state.returnView = 'main';
      if (typeof render === 'function') render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (act === 'open-scene') {
      e.stopPropagation();
      const p = getPersona();
      const sc = getScene(p, id);
      state.sceneId = sc.id;
      state.intentId = sc.intents[0].id;
      state.returnView = 'main';
      state.view = 'scene';
      if (typeof render === 'function') render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (act === 'open-scene-from-persona') {
      const p = getPersona();
      const sc = getScene(p, id);
      state.sceneId = sc.id;
      state.intentId = sc.intents[0].id;
      state.returnView = 'persona';
      state.view = 'scene';
      if (typeof render === 'function') render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (act === 'open-intent') {
      e.stopPropagation();
      const sc = getScene();
      const it = getIntent(sc, id);
      state.intentId = it.id;
      state.returnView = 'main';
      state.view = 'intent';
      if (typeof render === 'function') render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (act === 'open-intent-from-scene') {
      const sc = getScene();
      const it = getIntent(sc, id);
      state.intentId = it.id;
      state.returnView = 'scene';
      state.view = 'intent';
      if (typeof render === 'function') render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (act === 'back-main') {
      state.view = 'main';
      if (typeof render === 'function') render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (act === 'back-step') {
      if (state.view === 'intent' && state.returnView === 'scene') {
        state.view = 'scene';
        state.returnView = 'persona';
      } else if (state.view === 'scene' && state.returnView === 'persona') {
        state.view = 'persona';
        state.returnView = 'main';
      } else {
        state.view = 'main';
      }
      if (typeof render === 'function') render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (act === 'copy-intent-words') {
      const it = getIntent();
      const txt = [it.coreWord, ...it.questions].join('\n');
      navigator.clipboard?.writeText(txt).catch(() => {});
      if (typeof toast === 'function') toast(`已复制「${it.name}」核心词及 ${it.questions.length} 条提问词`);
    }
  });

  // 挂接 URL 参数支持（便于直达预览 ?mkb=insight|persona|intent）
  const params = new URLSearchParams(location.search);
  const initMkb = params.get('mkb');
  if (initMkb === 'insight') { state.mode = 'insight'; state.view = 'main'; }
  else if (initMkb === 'persona') { state.mode = 'insight'; state.view = 'persona'; }
  else if (initMkb === 'scene') { state.mode = 'insight'; state.view = 'scene'; state.returnView = 'persona'; }
  else if (initMkb === 'intent') { state.mode = 'graph'; state.view = 'intent'; }

  // 覆写 #graph 渲染器（服务版与工具版共享）
  if (typeof renderers !== 'undefined') {
    renderers.graph = mktKbPage;
  }
  if (typeof render === 'function') render({ preserveScroll: true });
})();
