// ==UserScript==
// @name         PoeNinjaChinese
// @name:zh-CN   poe.ninja 中文化
// @name:zh-TW   poe.ninja 中文化
// @namespace    https://github.com/saiyajiang/PoeNinjaChinese
// @version      1.0.0
// @description  调用 poedb.tw 词库，把 poe.ninja 的物品、通货、宝石、地图、基底与界面文案翻译成中文（简/繁可切换，原文悬浮可见）
// @description:zh-CN  调用 poedb.tw 词库，把 poe.ninja 的物品、通货、宝石、地图、基底与界面文案翻译成中文（简/繁可切换，原文悬浮可见）
// @author       saiyajiang
// @license      MIT
// @match        *://poe.ninja/*
// @match        *://*.poe.ninja/*
// @connect      poedb.tw
// @connect      poe2db.tw
// @connect      cdn.jsdelivr.net
// @connect      raw.githubusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_notification
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/saiyajiang/PoeNinjaChinese/main/PoeNinjaChinese.user.js
// @updateURL    https://raw.githubusercontent.com/saiyajiang/PoeNinjaChinese/main/PoeNinjaChinese.user.js
// @supportURL   https://github.com/saiyajiang/PoeNinjaChinese/issues
// @homepageURL  https://github.com/saiyajiang/PoeNinjaChinese
// ==/UserScript==

/*
 * PoeNinjaChinese —— poe.ninja 中文化
 *
 * 三层翻译，互为兜底：
 *   1. 数据层：拦截页面自身调用的 /api/ 接口，在 JSON 进入前端前把物品名/基底名等字段换成中文
 *      （好处：搜索、排序、筛选都能直接吃中文；可在菜单里关掉，退回纯 DOM 翻译）
 *   2. DOM 层：对文本节点做「整体匹配 → 最长词组匹配」替换，覆盖表格、筛选器、弹窗
 *   3. UI 层：内置界面文案词典（离线可用），CDN 词库可在线扩充/覆盖
 *
 * 词库来源：poedb.tw / poe2db.tw 的公开 autocomplete 词表（CC BY-NC-SA 3.0）。
 */

(function () {
  'use strict';

  /* ============================================================
   * 0. 常量与配置
   * ========================================================== */
  const OWNER = 'saiyajiang';        // GitHub 用户名，决定 @namespace / CDN / 更新地址
  const REPO = 'PoeNinjaChinese';
  const BRANCH = 'main';
  const SCRIPT_VERSION = '1.0.0';

  const CDN_BASE = `https://cdn.jsdelivr.net/gh/${OWNER}/${REPO}@${BRANCH}/data/`;
  const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/data/`;
  const DICT_FILE = 'dict.min.json';

  const DICT_TTL = 7 * 24 * 3600 * 1000; // 词库缓存有效期：7 天
  const MAX_MISSING = 3000;              // 未翻译字符串收集上限
  const MAX_NGRAM = 6;                   // 词组匹配最大词数

  const K_NAME = 'pnc.dict';
  const K_LANG = 'pnc.lang';
  const K_APIDATA = 'pnc.apiData';
  const K_ORIG = 'pnc.keepOriginal';

  const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  /* ============================================================
   * 1. GM API 兼容封装（脚本在没有 grant 时也要能跑）
   * ========================================================== */
  const GM = {
    get(key, def) {
      try { const v = GM_getValue(key); return v === undefined || v === null ? def : v; }
      catch (e) { try { return JSON.parse(localStorage.getItem(key) ?? String(def)); } catch (_) { return def; } }
    },
    set(key, val) {
      try { GM_setValue(key, val); }
      catch (e) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (_) {} }
    },
    xhr(opt) {
      return new Promise((resolve, reject) => {
        if (typeof GM_xmlhttpRequest !== 'function') { reject(new Error('GM_xmlhttpRequest 不可用')); return; }
        GM_xmlhttpRequest(Object.assign({ timeout: 20000 }, opt, {
          onload: (r) => (r.status >= 200 && r.status < 300 ? resolve(r) : reject(new Error('HTTP ' + r.status))),
          onerror: (e) => reject(e || new Error('network error')),
          ontimeout: () => reject(new Error('timeout'))
        }));
      });
    },
    menu(name, fn) { try { GM_registerMenuCommand(name, fn); } catch (e) {} },
    notify(text) { try { GM_notification({ text, title: 'PoeNinjaChinese', timeout: 4000 }); } catch (e) { console.log('[PoeNinjaChinese] ' + text); } }
  };

  async function getJSON(url) {
    const r = await GM.xhr({ method: 'GET', url, responseType: 'json' });
    return r.response;
  }

  /* ============================================================
   * 2. 内置界面文案词典（离线兜底）
   *    格式：[英文, 简体, 繁體]
   * ========================================================== */
  const INLINE_UI = [
    // 站点导航
    ['Economy', '经济', '經濟'],
    ['Builds', '构筑', '構築'],
    ['Atlas Trees', '异界天赋树', '異界天賦樹'],
    ['Passives', '天赋树', '天賦樹'],
    ['Passive Skill Tree', '天赋树', '天賦樹'],
    ['Share PoB', '分享 PoB', '分享 PoB'],
    ['Share Path of Building Code', '分享 PoB 代码', '分享 PoB 代碼'],
    ['Watch Intro', '观看介绍', '觀看介紹'],
    ['View all posts', '查看全部公告', '查看全部公告'],
    ['Path of Exile 1', '流放之路 1', '流放之路 1'],
    ['Path of Exile 2', '流放之路 2', '流放之路 2'],
    ['Console', '主机版', '主機版'],
    ['Characters and Favorites', '角色与收藏', '角色與收藏'],
    // 经济页：表头
    ['Item', '物品', '物品'],
    ['Name', '名称', '名稱'],
    ['Currency', '通货', '通貨'],
    ['Chaos Value', '混沌石价值', '混沌石價值'],
    ['Divine Value', '神圣石价值', '神聖石價值'],
    ['Exalted Value', '崇高石价值', '崇高石價值'],
    ['Chaos Equivalent', '折合混沌石', '折合混沌石'],
    ['Buying Price', '买入价', '買入價'],
    ['Selling Price', '卖出价', '賣出價'],
    ['Price', '价格', '價格'],
    ['Value', '价值', '價值'],
    ['Change', '涨跌', '漲跌'],
    ['Change %', '涨跌幅', '漲跌幅'],
    ['Listings', '挂单数', '掛單數'],
    ['Listing Count', '挂单数', '掛單數'],
    ['Quantity', '数量', '數量'],
    ['Count', '数量', '數量'],
    ['Sparkline', '价格走势', '價格走勢'],
    ['7 Days', '7 天', '7 天'],
    ['7 days', '7 天', '7 天'],
    ['1 Day', '1 天', '1 天'],
    ['Base Type', '基底类型', '基底類型'],
    ['Item Level', '物品等级', '物品等級'],
    ['Gem Level', '宝石等级', '寶石等級'],
    ['Gem Quality', '宝石品质', '寶石品質'],
    ['Level', '等级', '等級'],
    ['Quality', '品质', '品質'],
    ['Corrupted', '已腐化', '已腐化'],
    ['Links', '连线', '連線'],
    ['Variant', '变体', '變體'],
    ['Details', '详情', '詳情'],
    ['Details Id', '详情 ID', '詳情 ID'],
    // 经济页：类别
    ['Unique Weapon', '传奇武器', '傳奇武器'],
    ['Unique Weapons', '传奇武器', '傳奇武器'],
    ['Unique Armour', '传奇护甲', '傳奇護甲'],
    ['Unique Armours', '传奇护甲', '傳奇護甲'],
    ['Unique Accessory', '传奇饰品', '傳奇飾品'],
    ['Unique Accessories', '传奇饰品', '傳奇飾品'],
    ['Unique Flask', '传奇药剂', '傳奇藥劑'],
    ['Unique Flasks', '传奇药剂', '傳奇藥劑'],
    ['Unique Jewel', '传奇珠宝', '傳奇珠寶'],
    ['Unique Jewels', '传奇珠宝', '傳奇珠寶'],
    ['Unique Map', '传奇地图', '傳奇地圖'],
    ['Unique Maps', '传奇地图', '傳奇地圖'],
    ['Unique Relic', '传奇遗物', '傳奇遺物'],
    ['Unique Relics', '传奇遗物', '傳奇遺物'],
    ['Divination Card', '命运卡', '命運卡'],
    ['Divination Cards', '命运卡', '命運卡'],
    ['Skill Gem', '技能宝石', '技能寶石'],
    ['Skill Gems', '技能宝石', '技能寶石'],
    ['Cluster Jewel', '集群珠宝', '集群珠寶'],
    ['Cluster Jewels', '集群珠宝', '集群珠寶'],
    ['Base Types', '基底类型', '基底類型'],
    ['Incubator', '孵化器', '孵化器'],
    ['Incubators', '孵化器', '孵化器'],
    ['Scarab', '圣甲虫', '聖甲蟲'],
    ['Scarabs', '圣甲虫', '聖甲蟲'],
    ['Fossil', '化石', '化石'],
    ['Fossils', '化石', '化石'],
    ['Resonator', '共振器', '共振器'],
    ['Resonators', '共振器', '共振器'],
    ['Essence', '精髓', '精髓'],
    ['Essences', '精髓', '精髓'],
    ['Oil', '油', '油'],
    ['Oils', '油', '油'],
    ['Fragment', '碎片', '碎片'],
    ['Fragments', '碎片', '碎片'],
    ['Delirium Orb', '谵妄玉', '譫妄玉'],
    ['Delirium Orbs', '谵妄玉', '譫妄玉'],
    ['Invitation', '邀请函', '邀請函'],
    ['Invitations', '邀请函', '邀請函'],
    ['Vial', '小瓶', '小瓶'],
    ['Vials', '小瓶', '小瓶'],
    ['Omen', '预兆', '預兆'],
    ['Omens', '预兆', '預兆'],
    ['Beast', '野兽', '野獸'],
    ['Beasts', '野兽', '野獸'],
    ['Blighted Map', '凋零地图', '凋零地圖'],
    ['Blight-Ravaged Map', '凋零掠夺地图', '凋零掠奪地圖'],
    ['Allflame Ember', '全焰余烬', '全焰餘燼'],
    ['Coffin', '棺柩', '棺柩'],
    ['Memory', '记忆', '記憶'],
    ['Helmet Enchant', '头盔附魔', '頭盔附魔'],
    ['Map', '地图', '地圖'],
    ['Maps', '地图', '地圖'],
    // 通用 UI
    ['Search', '搜索', '搜尋'],
    ['Search filters', '筛选', '篩選'],
    ['Search filters...', '筛选…', '篩選…'],
    ['Search items', '搜索物品', '搜尋物品'],
    ['Search items...', '搜索物品…', '搜尋物品…'],
    ['Search...', '搜索…', '搜尋…'],
    ['Filter', '筛选', '篩選'],
    ['Filters', '筛选', '篩選'],
    ['League', '联盟', '聯盟'],
    ['Type', '类型', '類型'],
    ['Category', '分类', '分類'],
    ['Rarity', '稀有度', '稀有度'],
    ['Show all', '显示全部', '顯示全部'],
    ['Show more', '显示更多', '顯示更多'],
    ['Load more', '加载更多', '載入更多'],
    ['Refresh', '刷新', '重新整理'],
    ['Reset', '重置', '重設'],
    ['Apply', '应用', '套用'],
    ['Cancel', '取消', '取消'],
    ['Close', '关闭', '關閉'],
    ['Export', '导出', '匯出'],
    ['Copy', '复制', '複製'],
    ['Copied', '已复制', '已複製'],
    ['Compare', '对比', '比較'],
    ['Trade', '交易', '交易'],
    ['Wiki', '维基', '維基'],
    ['PoEDB', '编年史', '編年史'],
    ['Settings', '设置', '設定'],
    ['Sort', '排序', '排序'],
    ['Ascending', '升序', '遞增'],
    ['Descending', '降序', '遞減'],
    ['Total', '合计', '合計'],
    ['Average', '平均', '平均'],
    ['Confidence', '置信度', '信心度'],
    ['Low confidence', '低置信度', '低信心度'],
    ['Estimated value', '估值', '估值'],
    // 构筑页
    ['Class', '职业', '職業'],
    ['Ascendancy', '升华', '昇華'],
    ['Skill', '技能', '技能'],
    ['Main Skill', '主技能', '主技能'],
    ['Skills', '技能', '技能'],
    ['DPS', '每秒伤害', '每秒傷害'],
    ['Effective DPS', '有效 DPS', '有效 DPS'],
    ['Life', '生命', '生命'],
    ['Mana', '魔力', '魔力'],
    ['Energy Shield', '能量护盾', '能量護盾'],
    ['Armour', '护甲', '護甲'],
    ['Evasion', '闪避', '閃避'],
    ['Resistance', '抗性', '抗性'],
    ['Resistances', '抗性', '抗性'],
    ['Rank', '排名', '排名'],
    ['Account', '账号', '帳號'],
    ['Character', '角色', '角色'],
    ['Characters', '角色', '角色'],
    ['Equipment', '装备', '裝備'],
    ['Weapon', '武器', '武器'],
    ['Offhand', '副手', '副手'],
    ['Armour Slot', '护甲位', '護甲位'],
    ['Rings', '戒指', '戒指'],
    ['Amulet', '项链', '項鍊'],
    ['Belt', '腰带', '腰帶'],
    ['Flasks', '药剂', '藥劑'],
    ['Jewels', '珠宝', '珠寶'],
    // 职业与升华
    ['Marauder', '野蛮人', '野蠻人'],
    ['Ranger', '游侠', '遊俠'],
    ['Witch', '女巫', '女巫'],
    ['Duelist', '决斗者', '決鬥者'],
    ['Templar', '圣堂武僧', '聖堂武僧'],
    ['Shadow', '暗影', '暗影'],
    ['Scion', '贵族', '貴族'],
    ['Juggernaut', '勇士', '勇士'],
    ['Berserker', '狂战士', '狂戰士'],
    ['Chieftain', '酋长', '酋長'],
    ['Guardian', '守护者', '守護者'],
    ['Inquisitor', '判官', '判官'],
    ['Hierophant', '圣宗', '聖宗'],
    ['Raider', '追猎者', '追獵者'],
    ['Deadeye', '锐眼', '銳眼'],
    ['Pathfinder', '游侠·游猎者', '遊俠·漫遊者'],
    ['Warden', '守望者', '守望者'],
    ['Necromancer', '死灵法师', '死靈法師'],
    ['Elementalist', '元素使', '元素使'],
    ['Occultist', '秘术家', '秘術家'],
    ['Slayer', '处刑者', '處刑者'],
    ['Gladiator', '角斗士', '角鬥士'],
    ['Champion', '冠军', '冠軍'],
    ['Assassin', '刺客', '刺客'],
    ['Saboteur', '破坏者', '破壞者'],
    ['Trickster', '欺诈师', '欺詐師'],
    // 时间与单位
    ['ago', '前', '前'],
    ['just now', '刚刚', '剛剛'],
    ['second', '秒', '秒'],
    ['seconds', '秒', '秒'],
    ['minute', '分钟', '分鐘'],
    ['minutes', '分钟', '分鐘'],
    ['hour', '小时', '小時'],
    ['hours', '小时', '小時'],
    ['day', '天', '天'],
    ['days', '天', '天'],
    ['week', '周', '週'],
    ['weeks', '周', '週'],
    ['month', '个月', '個月'],
    ['months', '个月', '個月'],
    // 常见货币与基础词（poedb 词库缺失时的兜底）
    ['Chaos Orb', '混沌石', '混沌石'],
    ['Divine Orb', '神圣石', '神聖石'],
    ['Exalted Orb', '崇高石', '崇高石'],
    ['Mirror of Kalandra', '卡兰德的魔镜', '卡蘭德的魔鏡'],
    ['Vaal Orb', '瓦尔宝珠', '瓦爾寶珠'],
    ['Orb of Alchemy', '点金石', '點金石'],
    ['Orb of Alteration', '改造石', '改造石'],
    ['Orb of Fusing', '连接石', '連結石'],
    ['Orb of Chance', '机会石', '機會石'],
    ['Orb of Scouring', '磨刀石', '重鑄石'],
    ['Regal Orb', '富豪石', '富豪石'],
    ['Blessed Orb', '祝福石', '祝福石'],
    ['Chromatic Orb', '幻色石', '幻色石'],
    ['Jeweller\'s Orb', '工匠石', '工匠石'],
    ['Gemcutter\'s Prism', '宝石工匠的棱镜', '寶石工匠的稜鏡'],
    ['Orb of Regret', '后悔石', '後悔石'],
    ['Cartographer\'s Chisel', '制图钉', '製圖釘'],
    ['Scroll of Wisdom', '智慧卷轴', '智慧卷軸'],
    ['Portal Scroll', '传送卷轴', '傳送卷軸'],
    ['Transmutation Shard', '蜕变碎片', '蛻變碎片'],
    ['Alchemy Shard', '点金碎片', '點金碎片'],
    ['Mirror Shard', '魔镜碎片', '魔鏡碎片'],
    ['Exalted Shard', '崇高碎片', '崇高碎片']
  ];

  /* ============================================================
   * 3. 运行时状态
   * ========================================================== */
  const state = {
    ready: false,
    lang: GM.get(K_LANG, 'cn'),            // 'cn' | 'tw' | 'off'
    apiData: GM.get(K_APIDATA, true),      // 是否翻译接口数据
    keepOriginal: GM.get(K_ORIG, true),    // 悬浮显示英文原文
    dict: { cn: Object.create(null), tw: Object.create(null) },   // 物品名 英→中
    ui: { cn: Object.create(null), tw: Object.create(null) },     // 界面文案 英→中
    uiLower: { cn: Object.create(null), tw: Object.create(null) },// 小写索引
    missing: new Set(),
    source: ''
  };

  function buildIndex() {
    for (const en of Object.keys(INLINE_UI)) void en;
    for (const row of INLINE_UI) {
      const [en, cn, tw] = row;
      if (en && cn) state.ui.cn[en] = cn;
      if (en && tw) state.ui.tw[en] = tw;
    }
    reindexLower();
  }

  function reindexLower() {
    for (const lang of ['cn', 'tw']) {
      const low = Object.create(null);
      for (const k of Object.keys(state.ui[lang])) {
        const lk = k.toLowerCase();
        if (!(lk in low)) low[lk] = state.ui[lang][k];
      }
      state.uiLower[lang] = low;
    }
  }

  buildIndex();

  /* ============================================================
   * 4. 词库加载
   * ========================================================== */

  /** 合并外部词库（CDN / PoEDB）进内存 */
  function mergeDict(payload) {
    if (!payload || typeof payload !== 'object') return 0;
    let n = 0;
    if (payload.en2cn) Object.assign(state.dict.cn, payload.en2cn), n += Object.keys(payload.en2cn).length;
    if (payload.en2tw) Object.assign(state.dict.tw, payload.en2tw), n += Object.keys(payload.en2tw).length;
    if (payload.ui) {
      if (payload.ui.cn) Object.assign(state.ui.cn, payload.ui.cn);
      if (payload.ui.tw) Object.assign(state.ui.tw, payload.ui.tw);
      reindexLower();
    }
    if (payload.overrides) {
      if (payload.overrides.cn) Object.assign(state.dict.cn, payload.overrides.cn);
      if (payload.overrides.tw) Object.assign(state.dict.tw, payload.overrides.tw);
    }
    return n;
  }

  function isFresh(cached) {
    return !!(cached && cached.t && (Date.now() - cached.t) < DICT_TTL && (cached.payload || cached.dict));
  }

  async function loadDict(force) {
    const cached = GM.get(K_NAME, null);
    if (cached) {
      const payload = cached.payload || cached.dict;
      mergeDict(payload);
      state.source = cached.src || 'cache';
    }
    const needRemote = force || !isFresh(cached) || Object.keys(state.dict[state.lang] || {}).length === 0;

    if (needRemote) {
      const sources = [CDN_BASE + DICT_FILE, RAW_BASE + DICT_FILE];
      for (const url of sources) {
        try {
          const payload = await getJSON(url);
          mergeDict(payload);
          GM.set(K_NAME, { t: Date.now(), src: url, payload: { en2cn: payload.en2cn, en2tw: payload.en2tw, ui: payload.ui, overrides: payload.overrides } });
          state.source = url;
          break;
        } catch (e) { /* 换下一个源 */ }
      }
    }
    state.ready = true;
  }

  /** 直接从 poedb.tw / poe2db.tw 拉 autocomplete 词表，现场构建英→中映射 */
  async function syncFromPoedb() {
    const host = gameKey() === 'poe2' ? 'https://poe2db.tw' : 'https://poedb.tw';
    const beta = host.indexOf('poe2db') >= 0 ? '_cb' : '';
    const lang = state.lang === 'tw' ? 'tw' : 'cn';

    async function auto(l) {
      const tries = [`${host}/json/autocomplete${beta}_${l}.json`, `${host}/json/autocomplete_${l}.json`];
      let lastErr;
      for (const u of tries) {
        try { return await getJSON(u); } catch (e) { lastErr = e; }
      }
      throw lastErr || new Error('无法获取 ' + l + ' 词表');
    }

    const [us, zh] = await Promise.all([auto('us'), auto(lang)]);
    const enBySlug = new Map();
    for (const it of us) if (it && it.value) enBySlug.set(it.value, it.label);

    const built = Object.create(null);
    for (const it of zh) {
      if (!it || !it.value || !it.label) continue;
      const en = enBySlug.get(it.value);
      if (!en || en === it.label) continue;      // 官方未翻译的条目保持英文
      if (en.length > 60 || it.label.length > 60) continue;
      if (!(en in built)) built[en] = it.label;
    }
    const n = Object.keys(built).length;
    if (!n) throw new Error('词表为空');

    if (lang === 'tw') Object.assign(state.dict.tw, built);
    else Object.assign(state.dict.cn, built);

    // 顺手写回缓存，下次开机直接命中
    const cached = GM.get(K_NAME, null) || {};
    const payload = cached.payload || { en2cn: {}, en2tw: {}, ui: state.ui, overrides: {} };
    if (lang === 'tw') payload.en2tw = Object.assign(payload.en2tw || {}, built);
    else payload.en2cn = Object.assign(payload.en2cn || {}, built);
    GM.set(K_NAME, { t: Date.now(), src: host, payload });
    return { n, host };
  }

  /* ============================================================
   * 5. 翻译核心
   * ========================================================== */

  function gameKey() {
    return /^\/poe2(\/|$)/.test(location.pathname) ? 'poe2' : 'poe1';
  }

  function activeLang() { return state.lang === 'tw' ? 'tw' : 'cn'; }

  /** 单词条查表：先物品词典，再界面词典（含大小写不敏感） */
  function lookup(raw) {
    const s = String(raw);
    const d = state.dict[activeLang()];
    if (s in d) return d[s];
    const u = state.ui[activeLang()];
    if (s in u) return u[s];
    const low = s.toLowerCase();
    if (low in state.uiLower[activeLang()]) return state.uiLower[activeLang()][low];
    return null;
  }

  const TAIL = /[,.:;!?)\]»"'’“”]+$/;
  const HEAD = /^[(\["'“‘]+/;

  /** 带标点剥离的查表，返回 {zh, head, tail} */
  function lookupLoose(core) {
    const s = String(core);
    let hit = lookup(s);
    if (hit) return { zh: hit, head: '', tail: '' };
    const tailM = s.match(TAIL);
    const tail = tailM ? tailM[0] : '';
    const noTail = tail ? s.slice(0, -tail.length) : s;
    const headM = noTail.match(HEAD);
    const head = headM ? headM[0] : '';
    const mid = head ? noTail.slice(head.length) : noTail;
    hit = lookup(mid);
    if (hit) return { zh: hit, head, tail };
    hit = lookup(mid.toLowerCase());
    if (hit) return { zh: hit, head, tail };
    return null;
  }

  /** 整体名称翻译（用于接口字段、title 等短串） */
  function translateName(s) {
    if (!s || typeof s !== 'string') return s;
    if (!/[A-Za-z]/.test(s)) return s;
    const trim = s.trim();
    const direct = lookup(trim);
    if (direct) return s.replace(trim, direct);
    const loose = lookupLoose(trim);
    if (loose) return s.replace(trim, loose.head + loose.zh + loose.tail);
    return s;
  }

  /** 短语翻译（DOM 文本节点）：整体 → 最长词组 → 单词 */
  function translatePhrase(src) {
    const s = String(src);
    if (!/[A-Za-z]{2}/.test(s)) return s;

    const trim = s.trim();
    if (trim) {
      const direct = lookup(trim);
      if (direct) return s.replace(trim, direct);
      const loose = lookupLoose(trim);
      if (loose) return s.replace(trim, loose.head + loose.zh + loose.tail);
    }

    // 切成「单词 / 空白 / 标点」三类 token，只在连续单词上做最长匹配
    const tokens = s.match(/[A-Za-z0-9'’\-]+|\s+|[^A-Za-z0-9'’\-\s]+/g);
    if (!tokens) return s;

    const isWord = (t) => /^[A-Za-z0-9]/.test(t);
    const isSpace = (t) => /^\s+$/.test(t);

    let out = '';
    let changed = false;

    for (let i = 0; i < tokens.length; i++) {
      const tk = tokens[i];
      if (!isWord(tk)) { out += tk; continue; }

      const seq = [tk];          // 参与匹配的 token（含中间空白，保证能原样还原）
      let lastIdx = i;
      let hitText = null;

      for (let n = 1; n <= MAX_NGRAM; n++) {
        const phrase = seq.join('').replace(/\s+/g, ' ').trim();
        const r = lookupLoose(phrase);
        // 单词级命中要求首字母大写，避免把普通英文单词当物品名误翻
        const okSingle = seq.length > 1 || /^[A-Z]/.test(phrase) || inUi(phrase);
        if (r && okSingle) { hitText = r.head + r.zh + r.tail; break; }

        const sp = tokens[i + seq.length];
        const nx = tokens[i + seq.length + 1];
        if (!sp || !nx || !isSpace(sp) || !isWord(nx)) break;
        seq.push(sp, nx);
        lastIdx = i + seq.length - 1;
      }

      if (hitText) { out += hitText; i = lastIdx; changed = true; }
      else out += tk;
    }

    if (!changed) {
      collectMissing(s);
      return s;
    }
    return out;
  }

  function inUi(phrase) {
    const low = String(phrase).toLowerCase();
    return Object.prototype.hasOwnProperty.call(state.uiLower[activeLang()], low);
  }

  function collectMissing(s) {
    if (state.missing.size >= MAX_MISSING || state.lang === 'off') return;
    const t = s.trim();
    if (t.length < 4 || t.length > 80) return;
    if (!/[A-Za-z]{3}/.test(t)) return;
    if (/^\d+([.,]\d+)*$/.test(t)) return;
    if (/^https?:\/\//.test(t)) return;
    state.missing.add(t);
  }

  /* ============================================================
   * 6. 数据层：拦截页面自己的接口响应
   * ========================================================== */
  const NAME_KEYS = new Set(['name', 'baseType', 'currencyTypeName', 'itemName', 'baseTypeName', 'displayName']);
  const MOD_PARENTS = new Set(['explicitModifiers', 'implicitModifiers', 'fracturedModifiers', 'enchantModifiers', 'runeModifiers', 'craftedModifiers']);
  const NO_TOUCH = new Set(['detailsId', 'id', 'icon', 'artFilename', 'variant', 'itemType', 'type', 'url', 'slug', 'class', 'tradeId']);

  function translatePayload(node, parentKey) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      for (const v of node) translatePayload(v, parentKey);
      return;
    }
    for (const k of Object.keys(node)) {
      const v = node[k];
      if (v === null || v === undefined) continue;
      if (typeof v === 'object') { translatePayload(v, k); continue; }
      if (typeof v !== 'string') continue;
      if (NO_TOUCH.has(k)) continue;
      if (NAME_KEYS.has(k)) {
        const t = translateName(v);
        if (t !== v) node[k] = t;
      } else if (k === 'text' && MOD_PARENTS.has(parentKey) && state.dict[activeLang()]) {
        const t = translateName(v);
        if (t !== v) node[k] = t;
      }
    }
  }

  function isApiUrl(u) {
    if (typeof u !== 'string') return false;
    return /\/(poe1|poe2)\/api\//.test(u) || /\/api\/(data|economy)\//.test(u) || /\/api\/economy\//.test(u);
  }

  function hookFetch() {
    const OrigFetch = W.fetch;
    if (typeof OrigFetch !== 'function') return;
    W.fetch = function (input, init) {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      const p = OrigFetch.apply(this, arguments);
      if (!state.apiData || !isApiUrl(url)) return p;
      return p.then(async (res) => {
        try {
          const ct = (res.headers && res.headers.get && res.headers.get('content-type')) || '';
          if (!res.ok || !/json/.test(ct)) return res;
          const data = await res.clone().json();
          translatePayload(data, '');
          const RC = W.Response || Response;
          return new RC(JSON.stringify(data), {
            status: res.status, statusText: res.statusText, headers: { 'content-type': 'application/json' }
          });
        } catch (e) { return res; }
      });
    };
  }

  function hookXHR() {
    const XHR = W.XMLHttpRequest;
    if (!XHR || !XHR.prototype) return;
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;
    XHR.prototype.open = function (method, url) {
      try { this.__pncUrl = String(url); } catch (e) { this.__pncUrl = ''; }
      return origOpen.apply(this, arguments);
    };
    XHR.prototype.send = function () {
      const self = this;
      if (isApiUrl(this.__pncUrl)) {
        this.addEventListener('load', function () {
          if (!state.apiData) return;
          if (self.responseType && self.responseType !== 'text') return;
          try {
            const data = JSON.parse(self.responseText);
            translatePayload(data, '');
            const str = JSON.stringify(data);
            Object.defineProperty(self, 'responseText', { configurable: true, value: str });
            Object.defineProperty(self, 'response', { configurable: true, value: str });
          } catch (e) { /* 非 JSON 或已冻结，忽略 */ }
        });
      }
      return origSend.apply(this, arguments);
    };
  }

  /* ============================================================
   * 7. DOM 层
   * ========================================================== */
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE', 'SVG', 'CANVAS', 'INPUT', 'OPTION', 'TITLE']);
  let seen = new WeakSet();

  function skippable(el) {
    if (!el || el.nodeType !== 1) return true;
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.isContentEditable) return true;
    if (el.closest && el.closest('#pnc-toggle,[data-pnc-skip]')) return true;
    return false;
  }

  function scan(root) {
    if (!root || state.lang === 'off' || !state.ready) return;
    if (root.nodeType === 3) { scanText(root); return; }
    if (root.nodeType === 1 && skippable(root)) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (seen.has(node)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (skippable(node.parentElement)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const batch = [];
    let guard = 0;
    while (walker.nextNode() && guard++ < 20000) batch.push(walker.currentNode);
    for (const n of batch) scanText(n);
  }

  function scanText(node) {
    const src = node.nodeValue;
    if (!src || !src.trim()) { seen.add(node); return; }
    const out = translatePhrase(src);
    seen.add(node);
    if (out !== src) {
      node.nodeValue = out;
      const p = node.parentElement;
      if (p && state.keepOriginal && !p.getAttribute('title')) {
        try { p.setAttribute('title', src.trim().slice(0, 300)); } catch (e) {}
      }
    }
  }

  let obs = null;
  let scheduled = false;
  let dirty = new Set();
  let needFull = true;

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; flush(); });
  }

  function flush() {
    if (!state.ready || state.lang === 'off') return;
    if (obs) obs.disconnect();
    try {
      if (needFull) { scan(document.body); needFull = false; dirty = new Set(); }
      else { for (const el of dirty) { if (el && el.isConnected !== false) scan(el); } dirty = new Set(); }
    } catch (e) { /* 页面结构变化导致的异常可忽略 */ }
    if (obs && document.body) obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function startObserver() {
    if (obs) return;
    obs = new MutationObserver((records) => {
      for (const m of records) {
        if (m.type === 'childList') {
          for (const n of m.addedNodes) {
            if (n.nodeType === 1) dirty.add(n);
            else if (n.nodeType === 3 && n.parentElement) dirty.add(n.parentElement);
          }
        } else if (m.type === 'characterData') {
          seen.delete(m.target);
          if (m.target.parentElement) dirty.add(m.target.parentElement);
        }
      }
      schedule();
    });
    needFull = true;
    schedule();
  }

  /** 全量重扫（切换语言 / 词库更新后调用）：WeakSet 不能清空，直接换一个新的 */
  function rescanAll() {
    seen = new WeakSet();
    needFull = true;
    schedule();
  }

  /* ============================================================
   * 8. 悬浮控制按钮
   * ========================================================== */
  function addStyle() {
    const css = `
#pnc-toggle{position:fixed;right:18px;bottom:18px;z-index:2147483000;
  min-width:52px;height:34px;padding:0 12px;border-radius:17px;cursor:pointer;
  background:#1b1b1f;color:#e8c07d;border:1px solid #3a3327;font:600 13px/1 system-ui,"PingFang SC","Microsoft YaHei",sans-serif;
  display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.45);user-select:none;opacity:.86}
#pnc-toggle:hover{opacity:1;border-color:#e8c07d}
#pnc-toggle[data-state="off"]{color:#8b8b8b;border-color:#333}`;
    try { GM_addStyle(css); }
    catch (e) { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); }
  }

  function buildToggle() {
    if (document.getElementById('pnc-toggle')) return;
    const btn = document.createElement('div');
    btn.id = 'pnc-toggle';
    btn.setAttribute('data-pnc-skip', '1');
    btn.title = '点击切换：简体 / 繁體 / 关闭　·　Alt+点击 导出未翻译字符串';
    btn.addEventListener('click', (e) => {
      if (e.altKey) { exportMissing(); return; }
      const next = state.lang === 'cn' ? 'tw' : (state.lang === 'tw' ? 'off' : 'cn');
      setLang(next);
    });
    document.body.appendChild(btn);
    paintToggle();
  }

  function paintToggle() {
    const btn = document.getElementById('pnc-toggle');
    if (!btn) return;
    const label = state.lang === 'cn' ? '译·简' : (state.lang === 'tw' ? '譯·繁' : '译·关');
    btn.textContent = label;
    btn.dataset.state = state.lang;
  }

  function setLang(lang) {
    state.lang = lang;
    GM.set(K_LANG, lang);
    paintToggle();
    // 页面上的中文无法还原成英文，切换语言一律刷新整页最稳
    setTimeout(() => { try { location.reload(); } catch (e) {} }, 200);
  }

  /* ============================================================
   * 9. 菜单与工具
   * ========================================================== */
  function exportMissing() {
    const list = Array.from(state.missing);
    const blob = new Blob([JSON.stringify({ url: location.href, game: gameKey(), lang: activeLang(), count: list.length, items: list }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `poeninja-missing-${activeLang()}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    GM.notify('已导出 ' + list.length + ' 条未翻译字符串');
  }

  function registerMenu() {
    GM.menu(`🌐 显示语言（当前：${state.lang === 'cn' ? '简体' : state.lang === 'tw' ? '繁體' : '关闭'}）`, () => {
      const next = state.lang === 'cn' ? 'tw' : (state.lang === 'tw' ? 'off' : 'cn');
      setLang(next);
    });
    GM.menu('🔄 立即更新词库（CDN）', async () => {
      GM.notify('正在更新词库…');
      try { await loadDict(true); rescanAll(); GM.notify('词库已更新'); }
      catch (e) { GM.notify('更新失败：' + e.message); }
    });
    GM.menu('🌏 直接从 PoEDB 同步词库', async () => {
      GM.notify('正在从 ' + (gameKey() === 'poe2' ? 'poe2db.tw' : 'poedb.tw') + ' 拉取…');
      try { const r = await syncFromPoedb(); rescanAll(); GM.notify(`已同步 ${r.n} 条词条（${r.host}）`); }
      catch (e) { GM.notify('同步失败：' + e.message); }
    });
    GM.menu(`📡 翻译接口数据（当前：${state.apiData ? '开' : '关'}）`, () => {
      state.apiData = !state.apiData;
      GM.set(K_APIDATA, state.apiData);
      GM.notify('已' + (state.apiData ? '开启' : '关闭') + '接口数据翻译，刷新后生效');
      setTimeout(() => location.reload(), 600);
    });
    GM.menu(`🏷 悬浮显示英文原文（当前：${state.keepOriginal ? '开' : '关'}）`, () => {
      state.keepOriginal = !state.keepOriginal;
      GM.set(K_ORIG, state.keepOriginal);
      GM.notify('已' + (state.keepOriginal ? '开启' : '关闭'));
      setTimeout(() => location.reload(), 600);
    });
    GM.menu('📤 导出未翻译字符串', exportMissing);
    GM.menu('🧹 清除本地词库缓存', () => { GM.set(K_NAME, null); GM.notify('已清除，刷新后重新拉取'); });
    GM.menu('ℹ️ 关于 PoeNinjaChinese v' + SCRIPT_VERSION, () => {
      GM.notify(`版本 ${SCRIPT_VERSION}　词库来源：${state.source || '内置'}\n简体 ${Object.keys(state.dict.cn).length} 条 / 繁體 ${Object.keys(state.dict.tw).length} 条`);
    });
  }

  /* ============================================================
   * 10. 启动
   * ========================================================== */
  hookFetch();
  hookXHR();

  async function boot() {
    try { await loadDict(false); } catch (e) { state.ready = true; }
    if (state.lang === 'off') return;
    addStyle();
    startObserver();

    // 首次安装（或仓库还没生成 dict.min.json）时，自动去 poedb.tw / poe2db.tw 取一次词库
    if (Object.keys(state.dict[activeLang()]).length === 0) {
      syncFromPoedb()
        .then((r) => { rescanAll(); GM.notify(`已从 ${r.host} 载入 ${r.n} 条词条`); })
        .catch(() => GM.notify('词库为空，请点油猴菜单「🌏 直接从 PoEDB 同步词库」'));
    }
    const mount = () => {
      if (!document.body) { setTimeout(mount, 50); return; }
      buildToggle();
      needFull = true;
      schedule();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
    else mount();
    registerMenu();
    // 首屏后再补两轮，覆盖懒加载表格
    [800, 2500, 6000].forEach((ms) => setTimeout(() => { needFull = true; schedule(); }, ms));
  }

  boot();

  // 调试入口：控制台里可用 __PoeNinjaChinese.translatePhrase('Tabula Rasa') 自查词库命中情况
  try {
    W.__PoeNinjaChinese = {
      version: SCRIPT_VERSION,
      state,
      translatePhrase,
      translateName,
      translatePayload,
      loadDict,
      syncFromPoedb,
      exportMissing
    };
  } catch (e) {}

  console.log(`[PoeNinjaChinese] v${SCRIPT_VERSION} · ${gameKey()} · lang=${state.lang}`);
})();
