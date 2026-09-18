// ==UserScript==
// @name         PoeNinjaChinese
// @name:zh-CN   poe.ninja 中文化
// @name:zh-TW   poe.ninja 中文化
// @namespace    https://github.com/saiyajiang/PoeNinjaChinese
// @version      1.2.0
// @description  调用 poedb.tw 词库，把 poe.ninja 的物品、通货、宝石、地图、基底与界面文案翻译成中文（简/繁可切换，原文悬浮可见）
// @description:zh-CN  调用 poedb.tw 词库，把 poe.ninja 的物品、通货、宝石、地图、基底与界面文案翻译成中文（简/繁可切换，原文悬浮可见）
// @author       saiyajiang
// @license      MIT
// @match        *://poe.ninja/*
// @match        *://*.poe.ninja/*
// @connect      poedb.tw
// @connect      poe2db.tw
// @connect      poe.game.qq.com
// @connect      www.pathofexile.com
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
  const SCRIPT_VERSION = '1.2.0';

  const CDN_BASE = `https://cdn.jsdelivr.net/gh/${OWNER}/${REPO}@${BRANCH}/data/`;
  const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/data/`;
  const DICT_FILE = 'dict.min.json';

  const DICT_TTL = 7 * 24 * 3600 * 1000; // 词库缓存有效期：7 天
  const MAX_MISSING = 3000;              // 未翻译字符串收集上限
  const MAX_NGRAM = 6;                   // 词组匹配最大词数
  const MAX_JOIN = 6;                    // 跨节点合并时最多拼接多少个文本片段

  const K_NAME = 'pnc.dict';
  const K_LANG = 'pnc.lang';
  const K_APIDATA = 'pnc.apiData';
  const K_ORIG = 'pnc.keepOriginal';
  const K_MERGE = 'pnc.mergeAcross';

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
  /* INLINE_UI:BEGIN */
const INLINE_UI = [
    ["1 Day", "1 天", "1 天"],
    ["7 Days", "7 天", "7 天"],
    ["7 days", "7 天", "7 天"],
    ["Abandoned Prison", "废弃监牢", "廢棄監牢"],
    ["Account", "账号", "帳號"],
    ["Act 1", "第一章", "第一章"],
    ["Act 2", "第二章", "第二章"],
    ["Act 3", "第三章", "第三章"],
    ["Act 4", "第四章", "第四章"],
    ["Add to favorites", "加入收藏", "加入收藏"],
    ["Advanced Thaumaturgy", "高等奇术", "高等奇術"],
    ["Advertise on this site", "在本站投放广告", "在本站投放廣告"],
    ["Alchemy Shard", "点金碎片", "點金碎片"],
    ["All leagues", "全部联盟", "全部聯盟"],
    ["Allflame Ember", "全焰余烬", "全焰餘燼"],
    ["Amulet", "项链", "項鍊"],
    ["Ancestral Tiara", "先祖之冠", "先祖之冠"],
    ["Apply", "应用", "套用"],
    ["Area Level", "区域等级", "區域等級"],
    ["Armageddon Pace", "末日步伐", "末日步伐"],
    ["Armageddon Pace, Daggerfoot Shoes", "末日步伐，匕足之靴", "末日步伐，匕足之靴"],
    ["Armour", "护甲", "護甲"],
    ["Armour Break I", "护甲破坏 I", "護甲破壞 I"],
    ["Armour Break II", "护甲破坏 II", "護甲破壞 II"],
    ["Armour Break III", "护甲破坏 III", "護甲破壞 III"],
    ["Armour Demolisher I", "破甲者 I", "破甲者 I"],
    ["Armour Demolisher II", "破甲者 II", "破甲者 II"],
    ["Armour Slot", "护甲位", "護甲位"],
    ["Ascendancy", "升华", "昇華"],
    ["Ascendancy & Keystones", "升华与核心天赋", "昇華與核心天賦"],
    ["Ascending", "升序", "遞增"],
    ["Assassin", "刺客", "刺客"],
    ["Atlas", "异界", "異界"],
    ["Atlas Trees", "异界天赋树", "異界天賦樹"],
    ["Attack Damage", "攻击伤害", "攻擊傷害"],
    ["Attacks per Second", "每秒攻击次数", "每秒攻擊次數"],
    ["Average", "平均", "平均"],
    ["Back to", "返回", "返回"],
    ["Base Type", "基底类型", "基底類型"],
    ["Base Types", "基底类型", "基底類型"],
    ["Beast", "野兽", "野獸"],
    ["Beasts", "野兽", "野獸"],
    ["Belt", "腰带", "腰帶"],
    ["Berserker", "狂战士", "狂戰士"],
    ["Blazing Critical", "炽焰暴击", "熾焰暴擊"],
    ["Blessed Orb", "祝福石", "祝福石"],
    ["Blight-Ravaged Map", "凋零掠夺地图", "凋零掠奪地圖"],
    ["Blighted Map", "凋零地图", "凋零地圖"],
    ["Blind II", "致盲 II", "致盲 II"],
    ["Block", "格挡", "格擋"],
    ["Breachlord's Rift", "裂界之主的裂隙", "裂界之主的裂隙"],
    ["Build Planner", "天赋树规划器", "天賦樹規劃器"],
    ["Builds", "构筑", "構築"],
    ["Builds - Path of Exile 1", "构筑 — 流放之路 1", "構築 — 流放之路 1"],
    ["Builds - Path of Exile 2", "构筑 — 流放之路 2", "構築 — 流放之路 2"],
    ["Buying Price", "买入价", "買入價"],
    ["Cancel", "取消", "取消"],
    ["Cannibalism II", "吞灵 II", "吞靈 II"],
    ["Cartographer\"s Chisel", "制图钉", "製圖釘"],
    ["Category", "分类", "分類"],
    ["Champion", "冠军", "冠軍"],
    ["Change", "涨跌", "漲跌"],
    ["Change %", "涨跌幅", "漲跌幅"],
    ["Chaos Damage", "混沌伤害", "混沌傷害"],
    ["Chaos Equivalent", "折合混沌石", "折合混沌石"],
    ["Chaos Orb", "混沌石", "混沌石"],
    ["Chaos Value", "混沌石价值", "混沌石價值"],
    ["Character", "角色", "角色"],
    ["Characters", "角色", "角色"],
    ["Characters and Favorites", "角色与收藏", "角色與收藏"],
    ["Charge Profusion", "能量球激增", "充能滿盈"],
    ["Charge Profusion II", "能量球激增 II", "充能滿盈 II"],
    ["Charge Regulation", "充能调节", "充能調節"],
    ["Charges gained", "获得的充能", "獲得的充能"],
    ["Chieftain", "酋长", "酋長"],
    ["Choices", "选项", "選項"],
    ["Chromatic Orb", "幻色石", "幻色石"],
    ["Clarity I", "清晰 I", "清晰 I"],
    ["Clarity II", "清晰 II", "清晰 II"],
    ["Class", "职业", "職業"],
    ["Click the row for the full breakdown", "点击该行查看完整明细", "點擊該行查看完整明細"],
    ["Close", "关闭", "關閉"],
    ["Cluster Jewel", "集群珠宝", "集群珠寶"],
    ["Cluster Jewels", "集群珠宝", "集群珠寶"],
    ["Coffin", "棺柩", "棺柩"],
    ["Columns", "列", "欄位"],
    ["Combat Frenzy", "战斗狂怒", "戰鬥狂怒"],
    ["Compare", "对比", "比較"],
    ["Confidence", "置信度", "信心度"],
    ["Console", "主机版", "主機版"],
    ["Contribute", "贡献", "貢獻"],
    ["Cooldown Recovery II", "冷却回复速度 II", "冷卻回復速度 II"],
    ["Copied", "已复制", "已複製"],
    ["Copy", "复制", "複製"],
    ["Corrupted", "已腐化", "已汙染"],
    ["Count", "数量", "數量"],
    ["Crafted", "工艺", "工藝"],
    ["Critical Strike Chance", "暴击率", "暴擊率"],
    ["Currency", "通货", "通貨"],
    ["Current price", "当前价格", "目前價格"],
    ["DPS", "每秒伤害", "每秒傷害"],
    ["Daggerfoot Shoes", "匕足之靴", "匕足之靴"],
    ["Daily change", "日涨跌", "日漲跌"],
    ["Damage", "伤害", "傷害"],
    ["Dark mode", "深色模式", "深色模式"],
    ["Data dumps", "数据下载", "資料下載"],
    ["Data from", "数据来源", "資料來源"],
    ["Deadeye", "锐眼", "銳眼"],
    ["Deflect chance", "偏转几率", "偏轉機率"],
    ["Delirium Orb", "谵妄玉", "譫妄玉"],
    ["Delirium Orbs", "谵妄玉", "譫妄玉"],
    ["Demand", "需求量", "需求量"],
    ["Descending", "降序", "遞減"],
    ["Details", "详情", "詳情"],
    ["Details Id", "详情 ID", "詳情 ID"],
    ["Dexterity", "敏捷", "敏捷"],
    ["Diamond", "钻石", "鑽石"],
    ["Disable", "停用", "停用"],
    ["Divination Card", "命运卡", "命運卡"],
    ["Divination Cards", "命运卡", "命運卡"],
    ["Divine Orb", "神圣石", "神聖石"],
    ["Divine Value", "神圣石价值", "神聖石價值"],
    ["Docs & FAQ", "文档与常见问题", "文件與常見問題"],
    ["Duelist", "决斗者", "決鬥者"],
    ["Economy", "经济", "經濟"],
    ["Economy - Path of Exile 1", "经济 — 流放之路 1", "經濟 — 流放之路 1"],
    ["Economy - Path of Exile 2", "经济 — 流放之路 2", "經濟 — 流放之路 2"],
    ["Effective DPS", "有效 DPS", "有效 DPS"],
    ["Effective Health Pool", "有效生命池", "有效生命池"],
    ["Elemental Armament II", "元素军备 II", "元素軍備 II"],
    ["Elemental DPS", "元素 DPS", "元素 DPS"],
    ["Elemental Damage", "元素伤害", "元素傷害"],
    ["Elementalist", "元素使", "元素使"],
    ["Emerald", "翠玉", "翠玉"],
    ["Empowered Sparks II", "强化火花 II", "強化火花 II"],
    ["Enable", "启用", "啟用"],
    ["Enchant", "附魔", "附魔"],
    ["Energy Shield", "能量护盾", "能量護盾"],
    ["Energy Shield Recharge", "能量护盾回复", "能量護盾回復"],
    ["Enhanced Reflexes", "强化反射", "強化反射"],
    ["Enlarge", "放大", "放大"],
    ["Equipment", "装备", "裝備"],
    ["Error", "错误", "錯誤"],
    ["Essence", "精髓", "精髓"],
    ["Essence of Virtue", "美德精髓", "美德精髓"],
    ["Essences", "精髓", "精髓"],
    ["Estimated value", "估值", "估值"],
    ["Eternal Mark", "永恒印记", "永恆印記"],
    ["Evade chance", "闪避几率", "閃避機率"],
    ["Evasion", "闪避", "閃避"],
    ["Exalted Orb", "崇高石", "崇高石"],
    ["Exalted Shard", "崇高碎片", "崇高碎片"],
    ["Exalted Value", "崇高石价值", "崇高石價值"],
    ["Explicit", "词缀", "詞綴"],
    ["Explicit modifiers", "词缀", "詞綴"],
    ["Export", "导出", "匯出"],
    ["Export to PoB", "导出到 PoB", "匯出到 PoB"],
    ["Favorite", "收藏", "收藏"],
    ["Favorites", "收藏", "收藏"],
    ["Filter", "筛选", "篩選"],
    ["Filters", "筛选", "篩選"],
    ["Fire Mastery", "火焰精通", "火焰精通"],
    ["Flasks", "药剂", "藥劑"],
    ["Flavour text", "风味文本", "風味文本"],
    ["Forbidden Rites", "禁忌仪式", "禁忌儀式"],
    ["Fossil", "化石", "化石"],
    ["Fossils", "化石", "化石"],
    ["Fractured", "碎裂", "碎裂"],
    ["Fragment", "碎片", "碎片"],
    ["Fragments", "碎片", "碎片"],
    ["Frost Nexus", "霜寒连结", "霜寒連結"],
    ["Gale Force", "疾风之力", "疾風之力"],
    ["Garukhan's Resolve", "格鲁坎的决心", "格魯坎的決心"],
    ["Gem Level", "宝石等级", "寶石等級"],
    ["Gem Quality", "宝石品质", "寶石品質"],
    ["Gem Studded", "宝石镶嵌", "寶石鑲嵌"],
    ["Gemcutter\"s Prism", "宝石工匠的棱镜", "寶石工匠的稜鏡"],
    ["Gemling Legionnaire", "宝石军团士兵", "寶石軍團士兵"],
    ["Gems", "宝石", "寶石"],
    ["Ghost Dance", "幽灵舞步", "幽靈舞步"],
    ["Gladiator", "角斗士", "角鬥士"],
    ["Goddess of Justice", "正义女神", "正義女神"],
    ["Great White One", "大白鲨", "大白鯊"],
    ["Guardian", "守护者", "守護者"],
    ["Halls of the Dead", "亡者之厅", "亡者之廳"],
    ["Heart of the Well", "井中之心", "井中之心"],
    ["Heightened Charges", "强化充能", "強化充能"],
    ["Helmet Enchant", "头盔附魔", "頭盔附魔"],
    ["Her Declaration", "她的宣言", "她的宣言"],
    ["Herald of Ash", "灰烬之捷", "灰燼之捷"],
    ["Herald of Fire", "火焰之捷", "火焰之捷"],
    ["Herald of Ice", "冰霜之捷", "冰霜之捷"],
    ["Herald of Thunder", "雷霆之捷", "雷霆之捷"],
    ["Hide", "隐藏", "隱藏"],
    ["Hierophant", "圣宗", "聖宗"],
    ["Hypnotic Star", "催眠之星", "催眠之星"],
    ["Hypnotic Star, Ancestral Tiara", "催眠之星，先祖之冠", "催眠之星，先祖之冠"],
    ["Implicit", "固有词缀", "固有詞綴"],
    ["Implicit modifiers", "固有词缀", "固有詞綴"],
    ["Import", "导入", "匯入"],
    ["Import Code for Path of Building", "Path of Building 导入代码", "Path of Building 匯入代碼"],
    ["Incubator", "孵化器", "孵化器"],
    ["Incubators", "孵化器", "孵化器"],
    ["Influenced", "已受尊师影响", "已受尊師影響"],
    ["Inquisitor", "判官", "判官"],
    ["Intelligence", "智慧", "智慧"],
    ["Interludes", "幕间", "幕間"],
    ["Invigorating Archon", "振奋执政官", "振奮執政官"],
    ["Invitation", "邀请函", "邀請函"],
    ["Invitations", "邀请函", "邀請函"],
    ["Item", "物品", "物品"],
    ["Item Level", "物品等级", "物品等級"],
    ["Item Quantity", "物品数量", "物品數量"],
    ["Item Rarity", "物品稀有度", "物品稀有度"],
    ["Jeweller\"s Orb", "工匠石", "工匠石"],
    ["Jewels", "珠宝", "珠寶"],
    ["Juggernaut", "勇士", "勇士"],
    ["Keystone", "核心天赋", "核心天賦"],
    ["Keystones", "核心天赋", "核心天賦"],
    ["Ladder", "天梯", "天梯"],
    ["Language", "语言", "語言"],
    ["Last 7 days", "近 7 天", "近 7 天"],
    ["Last fetched", "最后抓取", "最後抓取"],
    ["Last updated", "最后更新", "最後更新"],
    ["League", "联盟", "聯盟"],
    ["League start", "赛季开始", "賽季開始"],
    ["Less", "更少", "更少"],
    ["Level", "等级", "等級"],
    ["Life", "生命", "生命"],
    ["Life Regeneration", "生命回复", "生命回復"],
    ["Light mode", "浅色模式", "淺色模式"],
    ["Link", "连线", "連線"],
    ["Links", "连线", "連線"],
    ["Listing Count", "挂单数", "掛單數"],
    ["Listings", "挂单数", "掛單數"],
    ["Load more", "加载更多", "載入更多"],
    ["Loading", "加载中", "載入中"],
    ["Loading passive tree...", "正在加载天赋树…", "正在載入天賦樹…"],
    ["Loading...", "加载中…", "載入中…"],
    ["Locked On", "锁定", "鎖定"],
    ["Log in", "登录", "登入"],
    ["Login", "登录", "登入"],
    ["Logout", "登出", "登出"],
    ["Low confidence", "低置信度", "低信心度"],
    ["Magnified Area II", "范围扩大 II", "增幅光環 II"],
    ["Main", "主", "主"],
    ["Main Skill", "主技能", "主技能"],
    ["Mana", "魔力", "魔力"],
    ["Mana Regeneration", "魔力回复", "魔力回復"],
    ["Map", "地图", "地圖"],
    ["Map Tier", "地图阶级", "地圖階級"],
    ["Maps", "地图", "地圖"],
    ["Marauder", "野蛮人", "野蠻人"],
    ["Martial Weapon", "军械武器", "軍械武器"],
    ["Max Hit", "最大承受击中", "最大承受擊中"],
    ["Medallion", "徽章", "徽章"],
    ["Memory", "记忆", "記憶"],
    ["Mirror Shard", "魔镜碎片", "魔鏡碎片"],
    ["Mirror of Kalandra", "卡兰德的魔镜", "卡蘭德的魔鏡"],
    ["Mirrored", "已复制", "已複製"],
    ["Monster Level", "怪物等级", "怪物等級"],
    ["More", "更多", "更多"],
    ["Motoric Implants", "运动植入体", "運動植入體"],
    ["Movement Speed", "移动速度", "移動速度"],
    ["Name", "名称", "名稱"],
    ["Natural Immunity", "天生免疫", "天生免疫"],
    ["Necromancer", "死灵法师", "死靈法師"],
    ["Next", "下一页", "下一頁"],
    ["Ngamahu's Test", "努葛玛呼的考验", "努葛瑪呼的考驗"],
    ["No items found", "未找到物品", "未找到物品"],
    ["No results", "无结果", "無結果"],
    ["Occultist", "秘术家", "秘術家"],
    ["Off Hand", "副手", "副手"],
    ["Offhand", "副手", "副手"],
    ["Oil", "油", "油"],
    ["Oils", "油", "油"],
    ["Olroth's Conviction", "欧洛斯的信念", "歐洛斯的信念"],
    ["Omen", "预兆", "預兆"],
    ["Omens", "预兆", "預兆"],
    ["One-Handed", "单手", "單手"],
    ["Open", "打开", "開啟"],
    ["Open in PoB", "在 PoB 中打开", "在 PoB 中開啟"],
    ["Orb of Alchemy", "点金石", "點金石"],
    ["Orb of Alteration", "改造石", "改造石"],
    ["Orb of Chance", "机会石", "機會石"],
    ["Orb of Fusing", "连接石", "連結石"],
    ["Orb of Regret", "后悔石", "後悔石"],
    ["Orb of Scouring", "磨刀石", "重鑄石"],
    ["Overexposure", "过度曝光", "過度曝光"],
    ["Overload", "过载", "過載"],
    ["POE 1", "流放之路 1", "流放之路 1"],
    ["POE 2", "流放之路 2", "流放之路 2"],
    ["Page", "页", "頁"],
    ["Passive Skill Tree", "天赋树", "天賦樹"],
    ["Passive tree", "天赋树", "天賦樹"],
    ["Passives", "天赋树", "天賦樹"],
    ["Path of Exile 1", "流放之路 1", "流放之路 1"],
    ["Path of Exile 2", "流放之路 2", "流放之路 2"],
    ["Pathfinder", "游侠·游猎者", "遊俠·漫遊者"],
    ["Payoff", "收割", "收割"],
    ["Perfect Iron Rune", "完美钢铁符文", "完美鋼鐵符文"],
    ["Perform a circular slash that kicks up a", "挥出环形斩击，扬起", "揮出環形斬擊，揚起"],
    ["Perpetual Charge", "永续充能", "永續充能"],
    ["Physical DPS", "物理 DPS", "物理 DPS"],
    ["Physical Damage", "物理伤害", "物理傷害"],
    ["Pin Buildup", "钉住积蓄", "釘住積蓄"],
    ["Pinpoint Critical", "精准暴击", "精準暴擊"],
    ["PoEDB", "编年史", "編年史"],
    ["Portal Scroll", "传送卷轴", "傳送卷軸"],
    ["Previous", "上一页", "上一頁"],
    ["Price", "价格", "價格"],
    ["Price history", "价格历史", "價格歷史"],
    ["Privacy Policy", "隐私政策", "隱私政策"],
    ["Profile", "资料", "資料"],
    ["Projectile Acceleration III", "投射物加速 III", "投射物加速 III"],
    ["Purity of Elements", "纯净之元素", "純淨之元素"],
    ["Purity of Fire", "纯净之火", "純淨之火"],
    ["Purity of Ice", "纯净之冰", "純淨之冰"],
    ["Purity of Lightning", "纯净之电", "純淨之電"],
    ["Qimah", "奇玛尔", "奇瑪爾"],
    ["Quality", "品质", "品質"],
    ["Quantity", "数量", "數量"],
    ["Quest Rewards", "任务奖励", "任務獎勵"],
    ["Rage III", "怒气 III", "怒氣 III"],
    ["Raider", "追猎者", "追獵者"],
    ["Rakiata's Flow", "拉其塔之流", "拉其塔之流"],
    ["Ranger", "游侠", "遊俠"],
    ["Rank", "排名", "排名"],
    ["Rapid Attacks III", "快速攻击 III", "快速攻擊 III"],
    ["Rarity", "稀有度", "稀有度"],
    ["Refresh", "刷新", "重新整理"],
    ["Regal Orb", "富豪石", "富豪石"],
    ["Remove from favorites", "取消收藏", "取消收藏"],
    ["Requirements", "需求", "需求"],
    ["Requires", "需求", "需求"],
    ["Requires Level", "需求等级", "需求等級"],
    ["Reset", "重置", "重設"],
    ["Resistance", "抗性", "抗性"],
    ["Resistances", "抗性", "抗性"],
    ["Resonator", "共振器", "共振器"],
    ["Resonators", "共振器", "共振器"],
    ["Resources", "资源", "資源"],
    ["Retry", "重试", "重試"],
    ["Reward", "奖励", "獎勵"],
    ["Rewards", "奖励", "獎勵"],
    ["Righteous Descent", "正义天降", "正義天降"],
    ["Rigwald's Ferocity", "瑞佛的凶猛", "瑞佛的凶猛"],
    ["Rings", "戒指", "戒指"],
    ["Rows per page", "每页行数", "每頁列數"],
    ["Runic Ward", "符文护盾", "符文護盾"],
    ["Saboteur", "破坏者", "破壞者"],
    ["Salvo", "齐射", "齊射"],
    ["Scarab", "圣甲虫", "聖甲蟲"],
    ["Scarabs", "圣甲虫", "聖甲蟲"],
    ["Scarred Faith", "伤痕信仰", "傷痕信仰"],
    ["Scion", "贵族", "貴族"],
    ["Scroll of Wisdom", "智慧卷轴", "智慧卷軸"],
    ["Search", "搜索", "搜尋"],
    ["Search filters", "筛选", "篩選"],
    ["Search filters...", "筛选…", "篩選…"],
    ["Search items", "搜索物品", "搜尋物品"],
    ["Search items...", "搜索物品…", "搜尋物品…"],
    ["Search...", "搜索…", "搜尋…"],
    ["Select league", "选择联盟", "選擇聯盟"],
    ["Selling Price", "卖出价", "賣出價"],
    ["Set size", "成套数量", "成套數量"],
    ["Settings", "设置", "設定"],
    ["Shadow", "暗影", "暗影"],
    ["Share Path of Building Code", "分享 PoB 代码", "分享 PoB 代碼"],
    ["Share PoB", "分享 PoB", "分享 PoB"],
    ["Show", "显示", "顯示"],
    ["Show all", "显示全部", "顯示全部"],
    ["Show more", "显示更多", "顯示更多"],
    ["Sign in", "登录", "登入"],
    ["Sign up", "注册", "註冊"],
    ["Skill", "技能", "技能"],
    ["Skill Gem", "技能宝石", "技能寶石"],
    ["Skill Gems", "技能宝石", "技能寶石"],
    ["Skills", "技能", "技能"],
    ["Slayer", "处刑者", "處刑者"],
    ["Slipstrike Vest", "滑击背心", "快速打擊背心"],
    ["Sniper's Mark", "狙击者印记", "狙擊者印記"],
    ["Socket", "插槽", "插槽"],
    ["Socketed Skill", "已镶嵌技能", "已鑲嵌技能"],
    ["Sockets", "插槽", "插槽"],
    ["Sort", "排序", "排序"],
    ["Sparkline", "价格走势", "價格走勢"],
    ["Spear Throw", "战矛投掷", "戰矛投擲"],
    ["Spell Damage", "法术伤害", "法術傷害"],
    ["Spiked Shield", "尖刺盾", "尖刺盾"],
    ["Split", "已分裂", "已分裂"],
    ["Spray and Pray", "散射快射", "散射快射"],
    ["Stack size", "堆叠数量", "堆疊數量"],
    ["Statistics", "统计", "統計"],
    ["Strength", "力量", "力量"],
    ["Supply", "供给量", "供給量"],
    ["Support the site", "支持本站", "支持本站"],
    ["Tasalio's Test", "塔萨罗的考验", "塔薩羅的考驗"],
    ["Tawhoa's Test", "塔霍亚的考验", "塔霍亞的考驗"],
    ["Templar", "圣堂武僧", "聖堂武僧"],
    ["The Seven Pillars", "七灵柱", "七靈柱"],
    ["The Venom Crypts", "毒蛇地穴", "毒蛇地穴"],
    ["Tier", "阶级", "階級"],
    ["Time Machine", "时间机器", "時間機器"],
    ["Time-Lost Emerald", "时光遗失的翠玉", "時光遺失的翠玉"],
    ["Total", "合计", "合計"],
    ["Total DPS", "总 DPS", "總 DPS"],
    ["Trade", "交易", "交易"],
    ["Transmutation Shard", "蜕变碎片", "蛻變碎片"],
    ["Tree", "天赋树", "天賦樹"],
    ["Trickster", "欺诈师", "欺詐師"],
    ["Trinity", "三位一体", "三位一體"],
    ["Twister", "旋风", "旋風"],
    ["Type", "类型", "類型"],
    ["Uhtred's Constellation", "乌崔德的星座", "烏崔德的星座"],
    ["Uncorrupted", "未腐化", "未汙染"],
    ["Unique Accessories", "传奇饰品", "傳奇飾品"],
    ["Unique Accessory", "传奇饰品", "傳奇飾品"],
    ["Unique Armour", "传奇护甲", "傳奇護甲"],
    ["Unique Armours", "传奇护甲", "傳奇護甲"],
    ["Unique Flask", "传奇药剂", "傳奇藥劑"],
    ["Unique Flasks", "传奇药剂", "傳奇藥劑"],
    ["Unique Jewel", "传奇珠宝", "傳奇珠寶"],
    ["Unique Jewels", "传奇珠宝", "傳奇珠寶"],
    ["Unique Map", "传奇地图", "傳奇地圖"],
    ["Unique Maps", "传奇地图", "傳奇地圖"],
    ["Unique Relic", "传奇遗物", "傳奇遺物"],
    ["Unique Relics", "传奇遗物", "傳奇遺物"],
    ["Unique Weapon", "传奇武器", "傳奇武器"],
    ["Unique Weapons", "传奇武器", "傳奇武器"],
    ["Uniques", "传奇", "傳奇"],
    ["Uruk's Smelting", "乌鲁克的熔铸", "烏魯克的熔鑄"],
    ["Vaal Orb", "瓦尔宝珠", "瓦爾寶珠"],
    ["Vale Shelter", "谷地庇护", "谷地庇護"],
    ["Valley of the Titans", "泰坦之谷", "泰坦之谷"],
    ["Value", "价值", "價值"],
    ["Variant", "变体", "變體"],
    ["Vial", "小瓶", "小瓶"],
    ["Vials", "小瓶", "小瓶"],
    ["View Profile", "查看资料", "檢視資料"],
    ["View all posts", "查看全部公告", "查看全部公告"],
    ["Virtuous Barrier", "美德壁垒", "美德壁壘"],
    ["Vitality II", "活力 II", "活力 II"],
    ["Volume", "成交量", "成交量"],
    ["Vulgar Methods", "粗俗手段", "卑鄙手段"],
    ["Warden", "守望者", "守望者"],
    ["Watch Intro", "观看介绍", "觀看介紹"],
    ["Weapon", "武器", "武器"],
    ["Weapon DPS", "武器 DPS", "武器 DPS"],
    ["Whakapanu Island", "瓦卡帕努岛", "瓦卡帕努島"],
    ["Whirling Slash", "回旋斩", "迴旋斬"],
    ["Wiki", "维基", "維基"],
    ["Wind Dancer", "风舞者", "風舞者"],
    ["Witch", "女巫", "女巫"],
    ["ago", "前", "前"],
    ["day", "天", "天"],
    ["days", "天", "天"],
    ["equipped in your Main Hand", "装备于主手", "裝備於主手"],
    ["hour", "小时", "小時"],
    ["hours", "小时", "小時"],
    ["just now", "刚刚", "剛剛"],
    ["minute", "分钟", "分鐘"],
    ["minutes", "分钟", "分鐘"],
    ["month", "个月", "個月"],
    ["months", "个月", "個月"],
    ["poe.ninja is not affiliated with or endorsed by Grinding Gear Games.", "poe.ninja 与 Grinding Gear Games 无隶属或授权关系。", "poe.ninja 與 Grinding Gear Games 無隸屬或授權關係。"],
    ["second", "秒", "秒"],
    ["seconds", "秒", "秒"],
    ["week", "周", "週"],
    ["weeks", "周", "週"]
  ];
  /* INLINE_UI:END */

  /* INLINE_TERMS:BEGIN */
const INLINE_TERMS = [
    ["(max)", "（最大）", "（最大）"],
    [", and", "，和", "，和"],
    ["100% more", "100% 更多", "100% 更多"],
    ["20 (max)", "20（最大）", "20（最大）"],
    ["about", "关于", "關於"],
    ["acceleration", "加速", "加速"],
    ["account", "账号", "帳號"],
    ["accuracy", "命中", "命中"],
    ["accuracy rating", "命中值", "命中值"],
    ["accuracy rating while moving", "移动时命中值", "移動時命中值"],
    ["additional", "额外", "額外"],
    ["adds", "附加", "附加"],
    ["against you have no", "对你没有", "對你沒有"],
    ["ailment", "异常状态", "異常狀態"],
    ["ailments", "异常状态", "異常狀態"],
    ["all targets", "所有目标", "所有目標"],
    ["allies", "友军", "友軍"],
    ["allocated", "已分配", "已分配"],
    ["allocates", "分配", "分配"],
    ["ally", "友军", "友軍"],
    ["ambush", "伏击", "伏擊"],
    ["ammunition", "弹药", "彈藥"],
    ["amulet", "项链", "項鍊"],
    ["an", "一个", "一個"],
    ["an enemy's", "敌人的", "敵人的"],
    ["and", "和", "和"],
    ["and repeatedly", "并反复", "並反覆"],
    ["aoe", "范围", "範圍"],
    ["applies", "施加", "施加"],
    ["applies to", "作用于", "作用於"],
    ["archon", "执政官", "執政官"],
    ["area of effect", "效果区域", "效果區域"],
    ["armour", "护甲", "護甲"],
    ["armour break", "护甲破坏", "護甲破壞"],
    ["armour slot", "护甲位", "護甲位"],
    ["around you", "在你周围", "在你周圍"],
    ["ascendancy", "升华", "昇華"],
    ["attack", "攻击", "攻擊"],
    ["attack damage", "攻击伤害", "攻擊傷害"],
    ["attack speed", "攻击速度", "攻擊速度"],
    ["attacks", "攻击", "攻擊"],
    ["attribute", "属性", "屬性"],
    ["attributes", "属性", "屬性"],
    ["augment", "增幅", "增幅"],
    ["aura", "光环", "光環"],
    ["banner", "战旗", "戰旗"],
    ["barrage", "弹幕", "彈幕"],
    ["base", "基础", "基礎"],
    ["based on a portion of", "基于一部分", "基於一部分"],
    ["bear", "熊", "熊"],
    ["belt", "腰带", "腰帶"],
    ["bifurcate", "分岔", "分岔"],
    ["bifurcates", "分岔", "分岔"],
    ["bleeding", "流血", "流血"],
    ["blind", "致盲", "致盲"],
    ["blinding", "致盲", "致盲"],
    ["blinds", "致盲", "致盲"],
    ["block", "格挡", "格擋"],
    ["body armour", "胸甲", "胸甲"],
    ["boosted", "提升", "提升"],
    ["boosts", "提升", "提升"],
    ["boosts the", "提升", "提升"],
    ["boots", "鞋子", "鞋子"],
    ["bow", "弓", "弓"],
    ["break", "破坏", "破壞"],
    ["buff", "增益", "增益"],
    ["buffs", "增益", "增益"],
    ["buildup", "积蓄", "積蓄"],
    ["but will", "但会", "但會"],
    ["by", "被", "被"],
    ["can be boosted by multiple", "可被多个加成", "可被多個加成"],
    ["can't be", "无法被", "無法被"],
    ["cannot", "无法", "無法"],
    ["cannot be", "无法被", "無法被"],
    ["cast speed", "施法速度", "施法速度"],
    ["cast time", "施法时间", "施法時間"],
    ["causing them to", "使其", "使其"],
    ["causing them to grant", "使其获得", "使其獲得"],
    ["chaining", "连锁", "連鎖"],
    ["chance", "几率", "機率"],
    ["change", "涨跌", "漲跌"],
    ["channelling", "引导", "引導"],
    ["chaos damage", "混沌伤害", "混沌傷害"],
    ["chaos value", "混沌石价值", "混沌石價值"],
    ["character", "角色", "角色"],
    ["characters", "角色", "角色"],
    ["charge", "充能", "充能"],
    ["charges", "充能", "充能"],
    ["charm", "咒符", "咒符"],
    ["charms", "咒符", "咒符"],
    ["checkpoints", "检查点", "檢查點"],
    ["chill", "冰缓", "冰緩"],
    ["chilled", "冰缓", "冰緩"],
    ["clarity", "清晰", "清晰"],
    ["class", "职业", "職業"],
    ["close", "关闭", "關閉"],
    ["cold", "冰霜", "冰霜"],
    ["cold damage", "冰霜伤害", "冰霜傷害"],
    ["color", "颜色", "顏色"],
    ["colour", "颜色", "顏色"],
    ["combo", "连击", "連擊"],
    ["command", "指令", "指令"],
    ["companion", "同伴", "同伴"],
    ["companions", "同伴", "同伴"],
    ["condition", "条件", "條件"],
    ["conditional", "条件", "條件"],
    ["confidence", "置信度", "信心度"],
    ["consume", "消耗", "消耗"],
    ["consumes", "消耗", "消耗"],
    ["conversion", "转换", "轉換"],
    ["converted", "已转换", "已轉換"],
    ["converts", "转换", "轉換"],
    ["cooldown", "冷却", "冷卻"],
    ["cooldown recovery rate", "冷却回复速度", "冷卻回復速度"],
    ["cooldown time", "冷却时间", "冷卻時間"],
    ["copy", "复制", "複製"],
    ["corrupted", "已腐化", "已汙染"],
    ["cost", "消耗", "消耗"],
    ["cost multiplier", "消耗倍率", "消耗倍率"],
    ["crafted", "工艺", "工藝"],
    ["crit", "暴击", "暴擊"],
    ["critical damage bonus", "暴击伤害加成", "暴擊傷害加成"],
    ["critical hit", "暴击", "暴擊"],
    ["critical hit chance", "暴击率", "暴擊率"],
    ["critically hit", "暴击", "暴擊"],
    ["critically hitting", "暴击时", "暴擊時"],
    ["crossbow", "十字弓", "十字弓"],
    ["crossbows", "十字弓", "十字弓"],
    ["currency", "通货", "通貨"],
    ["curse", "诅咒", "詛咒"],
    ["damage", "伤害", "傷害"],
    ["damage while moving", "移动时伤害", "移動時傷害"],
    ["dancer", "舞者", "舞者"],
    ["dealt", "造成的伤害", "造成的傷害"],
    ["debuff", "减益", "減益"],
    ["defensive", "防御", "防禦"],
    ["deflect", "偏转", "偏轉"],
    ["deflected", "偏斜", "偏斜"],
    ["deflection", "偏转", "偏轉"],
    ["demolisher", "破甲者", "破甲者"],
    ["detonator", "引爆", "引爆"],
    ["dexterity", "敏捷", "敏捷"],
    ["disable", "停用", "停用"],
    ["divine value", "神圣石价值", "神聖石價值"],
    ["dodge", "躲避", "躲避"],
    ["does not", "不会", "不會"],
    ["dps", "每秒伤害", "每秒傷害"],
    ["duration", "持续时间", "持續時間"],
    ["each", "每个", "每個"],
    ["effect", "效果", "效果"],
    ["electrocute", "电击", "電擊"],
    ["electrocutes", "电击", "電擊"],
    ["electrocuting", "电击", "電擊"],
    ["elemental", "元素", "元素"],
    ["elemental damage", "元素伤害", "元素傷害"],
    ["elemental resistances", "元素抗性", "元素抗性"],
    ["emit an", "释放出一道", "釋放出一道理"],
    ["empower", "强化", "強化"],
    ["empowered", "强化的", "強化的"],
    ["empowering", "强化", "強化"],
    ["empty", "空", "空"],
    ["enable", "启用", "啟用"],
    ["enchant", "附魔", "附魔"],
    ["endurance charge", "耐力球", "耐力球"],
    ["enemies", "敌人", "敵人"],
    ["enemies you", "你", "你"],
    ["enemy", "敌人", "敵人"],
    ["energy shield", "能量护盾", "能量護盾"],
    ["equal to", "等于", "等於"],
    ["equal to 20% of", "等于 20% 的", "等於 20% 的"],
    ["equipped", "已装备", "已裝備"],
    ["equipped shield", "已装备盾牌", "已裝備盾牌"],
    ["error", "错误", "錯誤"],
    ["essence", "精髓", "精髓"],
    ["estimated", "估值", "估值"],
    ["evaded", "被闪避", "被閃避"],
    ["evasion", "闪避", "閃避"],
    ["explicit", "词缀", "詞綴"],
    ["explode", "爆炸", "爆炸"],
    ["explosion", "爆炸", "爆炸"],
    ["explosion radius", "爆炸半径", "爆炸半徑"],
    ["export", "导出", "匯出"],
    ["exposure", "曝露", "曝露"],
    ["extra", "额外", "額外"],
    ["extra damage", "额外伤害", "額外傷害"],
    ["fiery", "火焰", "火焰"],
    ["filter", "筛选", "篩選"],
    ["filters", "筛选", "篩選"],
    ["fire", "火焰", "火焰"],
    ["fire damage", "火焰伤害", "火焰傷害"],
    ["flask", "药剂", "藥劑"],
    ["flask charges gained", "获得的药剂充能", "獲得的藥劑充能"],
    ["found", "找到", "找到"],
    ["fractured", "碎裂", "碎裂"],
    ["freeze", "冰冻", "冰凍"],
    ["freeze buildup", "冰冻积蓄", "冰凍積蓄"],
    ["freezes", "冰冻", "冰凍"],
    ["freezing", "冰冻", "冰凍"],
    ["frenzy charge", "狂怒球", "狂怒球"],
    ["from", "从", "從"],
    ["frost", "冰霜", "冰霜"],
    ["fully break", "完全破坏", "完全破壞"],
    ["gain", "获得", "獲得"],
    ["gale force", "疾风之力", "疾風之力"],
    ["gem", "宝石", "寶石"],
    ["gems", "宝石", "寶石"],
    ["global", "全域", "全域"],
    ["glory", "荣耀", "榮耀"],
    ["gloves", "手套", "手套"],
    ["granted", "赋予", "賦予"],
    ["grants", "赋予", "賦予"],
    ["grenade", "手雷", "手雷"],
    ["ground", "地面", "地面"],
    ["has 3", "拥有 3", "擁有 3"],
    ["have", "有", "有"],
    ["hazard", "险境", "險境"],
    ["helmet", "头盔", "頭盔"],
    ["herald", "捷", "捷"],
    ["hide", "隐藏", "隱藏"],
    ["history", "历史", "歷史"],
    ["hit", "击中", "擊中"],
    ["hits", "击中", "擊中"],
    ["hitting", "击中", "擊中"],
    ["hurl your", "用力投出你的", "用力投出你的"],
    ["ice", "冰霜", "冰霜"],
    ["icy", "冰霜", "冰霜"],
    ["idol", "神像", "神像"],
    ["ignite", "点燃", "點燃"],
    ["ignite magnitude", "点燃效果", "點燃效果"],
    ["ignited", "点燃", "點燃"],
    ["ignites", "点燃", "點燃"],
    ["immobilise", "定身", "定身"],
    ["immobilised", "定身", "定身"],
    ["implicit", "固有", "固有"],
    ["import", "导入", "匯入"],
    ["in your", "在你的", "在你的"],
    ["increased", "提高", "提高"],
    ["increases and reductions to", "提高与降低", "提高與降低"],
    ["intelligence", "智慧", "智慧"],
    ["invocation", "祈唤", "祈喚"],
    ["is", "是", "是"],
    ["is in your", "在你的", "在你的"],
    ["item", "物品", "物品"],
    ["item level", "物品等级", "物品等級"],
    ["items", "物品", "物品"],
    ["items.", "物品。", "物品。"],
    ["jewel", "珠宝", "珠寶"],
    ["jewels", "珠宝", "珠寶"],
    ["keystone", "核心天赋", "核心天賦"],
    ["knock back", "击退", "擊退"],
    ["knockback", "击退", "擊退"],
    ["knocks back", "击退", "擊退"],
    ["language", "语言", "語言"],
    ["league", "联盟", "聯盟"],
    ["leech", "偷取", "偷取"],
    ["less", "更少", "更少"],
    ["level", "等级", "等級"],
    ["level of all", "所有……等级", "所有……等級"],
    ["level requirement", "等级需求", "等級需求"],
    ["levels from gem", "来自宝石的等级", "來自寶石的等級"],
    ["life", "生命", "生命"],
    ["lightning", "闪电", "閃電"],
    ["lightning damage", "闪电伤害", "閃電傷害"],
    ["lineage", "血统", "血統"],
    ["listings", "挂单数", "掛單數"],
    ["loading", "加载中", "載入中"],
    ["magic", "魔法", "魔法"],
    ["magnitude", "效果", "效果"],
    ["main hand", "主手", "主手"],
    ["mana", "魔力", "魔力"],
    ["mark", "印记", "印記"],
    ["marked", "被标记", "被標記"],
    ["marks", "印记", "印記"],
    ["martial", "军械", "軍械"],
    ["max", "最大", "最大"],
    ["maximum", "最大", "最大"],
    ["maximum life", "最大生命", "最大生命"],
    ["melee", "近战", "近戰"],
    ["merging", "融合", "融合"],
    ["meta", "元", "元"],
    ["metre", "米", "公尺"],
    ["metres", "米", "公尺"],
    ["min", "最小", "最小"],
    ["minimum", "最小", "最小"],
    ["minion", "召唤物", "召喚物"],
    ["minions", "召唤物", "召喚物"],
    ["modifier", "词缀", "詞綴"],
    ["modifiers", "词缀", "詞綴"],
    ["more", "更多", "更多"],
    ["more damage", "更多伤害", "更多傷害"],
    ["most", "最", "最"],
    ["most numerous", "数量最多", "數量最多"],
    ["movement speed", "移动速度", "移動速度"],
    ["moving", "移动中", "移動中"],
    ["multiple", "多个", "多個"],
    ["next", "下一页", "下一頁"],
    ["non-", "非", "非"],
    ["normal", "普通", "普通"],
    ["not at maximum", "未达上限", "未達上限"],
    ["notable", "显著天赋", "顯著天賦"],
    ["nova", "新星", "新星"],
    ["numerous", "数量", "數量"],
    ["of", "之", "之"],
    ["of base", "基础值的", "基礎值的"],
    ["of explosion", "爆炸的", "爆炸的"],
    ["of you and", "你和", "你和"],
    ["off hand", "副手", "副手"],
    ["offensive", "攻击", "攻擊"],
    ["offerings", "供品", "供品"],
    ["offhand", "副手", "副手"],
    ["on use", "使用时", "使用時"],
    ["on you", "在你身上", "在你身上"],
    ["orb", "法球", "法球"],
    ["other", "其他", "其他"],
    ["parry", "招架", "招架"],
    ["passive", "天赋", "天賦"],
    ["passives", "天赋", "天賦"],
    ["payoff", "收割", "收割"],
    ["penalty", "惩罚", "懲罰"],
    ["penetrates", "穿透", "穿透"],
    ["penetration", "穿透", "穿透"],
    ["per", "每", "每"],
    ["per stage", "每阶段", "每階段"],
    ["persistent", "持续", "持續"],
    ["physical", "物理", "物理"],
    ["physical damage", "物理伤害", "物理傷害"],
    ["pierces", "穿透", "穿透"],
    ["pin", "钉住", "釘住"],
    ["pinned", "钉住", "釘住"],
    ["pinning", "钉住", "釘住"],
    ["place into an empty", "放入一个空的", "放入一個空的"],
    ["plant", "植物", "植物"],
    ["poison", "中毒", "中毒"],
    ["power", "能量", "能量"],
    ["power charge", "暴击球", "暴擊球"],
    ["presence", "存在范围", "存在範圍"],
    ["previous", "上一页", "上一頁"],
    ["price", "价格", "價格"],
    ["proj", "投射物", "投射物"],
    ["projectile", "投射物", "投射物"],
    ["projectiles", "投射物", "投射物"],
    ["quality", "品质", "品質"],
    ["quest", "任务", "任務"],
    ["quiver", "箭袋", "箭袋"],
    ["radius", "半径", "半徑"],
    ["radius is", "半径为", "半徑為"],
    ["rage", "怒气", "怒氣"],
    ["rare", "稀有", "稀有"],
    ["rating", "值", "值"],
    ["recharge", "回复", "回復"],
    ["recouped", "回收", "回收"],
    ["recovery", "回复", "回復"],
    ["reduced", "降低", "降低"],
    ["refresh", "刷新", "重新整理"],
    ["regen", "回复", "回復"],
    ["regeneration", "回复", "回復"],
    ["relic", "遗物", "遺物"],
    ["remnant", "残迹", "殘跡"],
    ["repeat", "重复", "重複"],
    ["repeatable", "可重复", "可重複"],
    ["requirement", "需求", "需求"],
    ["requires", "需求", "需求"],
    ["requires:", "需求：", "需求："],
    ["reservation", "保留", "保留"],
    ["reset", "重置", "重設"],
    ["resistance", "抗性", "抗性"],
    ["resistances", "抗性", "抗性"],
    ["retry", "重试", "重試"],
    ["ring", "戒指", "戒指"],
    ["ruin", "毁灭", "毀滅"],
    ["rune", "符文", "符文"],
    ["runes", "符文", "符文"],
    ["search", "搜索", "搜尋"],
    ["settings", "设置", "設定"],
    ["shapeshift", "变形", "變形"],
    ["shatter", "碎裂", "碎裂"],
    ["shattering", "碎裂", "碎裂"],
    ["shield", "盾牌", "盾牌"],
    ["shock", "感电", "感電"],
    ["shock magnitude", "感电效果", "感電效果"],
    ["shocked", "感电", "感電"],
    ["shocks", "感电", "感電"],
    ["show", "显示", "顯示"],
    ["skill", "技能", "技能"],
    ["skill gem", "技能宝石", "技能寶石"],
    ["skills", "技能", "技能"],
    ["slam", "重击", "重擊"],
    ["slot", "插槽", "插槽"],
    ["slots", "插槽", "插槽"],
    ["slow magnitude", "减速效果", "減速效果"],
    ["slowing", "减速", "減速"],
    ["slows", "减速", "減速"],
    ["sniper", "狙击者", "狙擊者"],
    ["socket", "插槽", "插槽"],
    ["socketed", "已镶嵌", "已鑲嵌"],
    ["sockets", "插槽", "插槽"],
    ["sort", "排序", "排序"],
    ["spear", "长矛", "長矛"],
    ["speed", "速度", "速度"],
    ["spell damage", "法术伤害", "法術傷害"],
    ["spells", "法术", "法術"],
    ["spirit", "精魂", "精魂"],
    ["spirit gem", "精魂宝石", "精魂寶石"],
    ["stack size", "堆叠数量", "堆疊數量"],
    ["staff", "法杖", "法杖"],
    ["stage", "阶段", "階段"],
    ["staged", "分阶段", "分階段"],
    ["stages", "阶段", "階段"],
    ["stats", "属性", "屬性"],
    ["storm", "风暴", "風暴"],
    ["strength", "力量", "力量"],
    ["strike", "打击", "打擊"],
    ["stun", "眩晕", "眩暈"],
    ["stun threshold", "眩晕门槛", "眩暈門檻"],
    ["support", "辅助", "輔助"],
    ["support gem", "辅助宝石", "輔助寶石"],
    ["supports", "辅助", "輔助"],
    ["sustained", "持续型", "持續型"],
    ["taken as", "视为", "視為"],
    ["target", "目标", "目標"],
    ["targets", "目标", "目標"],
    ["that boosts the", "提升", "提升"],
    ["they take", "它们受到的", "它們受到的"],
    ["to", "至", "至"],
    ["to above", "至以上", "至以上"],
    ["to all", "全部", "全部"],
    ["to any", "任意", "任意"],
    ["total", "总计", "總計"],
    ["totem", "图腾", "圖騰"],
    ["totems", "图腾", "圖騰"],
    ["trade", "交易", "交易"],
    ["travel", "位移", "位移"],
    ["tree", "树", "樹"],
    ["trend", "趋势", "趨勢"],
    ["trigger", "触发", "觸發"],
    ["trigger a", "触发一次", "觸發一次"],
    ["triggered", "触发", "觸發"],
    ["two-handed", "双手", "雙手"],
    ["unique", "传奇", "傳奇"],
    ["value", "价值", "價值"],
    ["virtue", "美德", "美德"],
    ["vitality", "活力", "活力"],
    ["wand", "法杖", "法杖"],
    ["warcries", "战吼", "戰吼"],
    ["warcry", "战吼", "戰吼"],
    ["ward", "护盾", "護盾"],
    ["waystone", "引路石", "引路石"],
    ["weapon", "武器", "武器"],
    ["wells", "水井", "水井"],
    ["werewolf", "狼人", "狼人"],
    ["when", "当", "當"],
    ["when you kill a", "当你击杀一个", "當你擊殺一個"],
    ["which", "其", "其"],
    ["which can be boosted by", "可被以下加成", "可被以下加成"],
    ["while", "当", "當"],
    ["while active", "激活期间", "啟用期間"],
    ["while active,", "激活期间，", "啟用期間，"],
    ["whirlwind", "旋风", "旋風"],
    ["whirlwinds", "旋风", "旋風"],
    ["will have their", "将使其", "將使其"],
    ["wind", "风", "風"],
    ["with", "与", "與"],
    ["wyvern", "飞龙", "飛龍"],
    ["you", "你", "你"],
    ["your", "你的", "你的"]
  ];
  /* INLINE_TERMS:END */

  /* ============================================================
   * 3. 运行时状态
   * ========================================================== */
  const state = {
    ready: false,
    lang: GM.get(K_LANG, 'cn'),            // 'cn' | 'tw' | 'off'
    apiData: GM.get(K_APIDATA, true),      // 是否翻译接口数据
    keepOriginal: GM.get(K_ORIG, true),    // 悬浮显示英文原文
    mergeAcross: GM.get(K_MERGE, true),    // 跨相邻节点合并翻译（数值高亮被拆开时靠它）
    dict: { cn: Object.create(null), tw: Object.create(null) },   // 物品名 英→中
    ui: { cn: Object.create(null), tw: Object.create(null) },     // 界面文案 英→中
    uiLower: { cn: Object.create(null), tw: Object.create(null) },// 小写索引
    terms: { cn: Object.create(null), tw: Object.create(null) },  // 通用术语（小写键，大小写不敏感）
    missing: new Set(),
    source: ''
  };

  function buildIndex() {
    for (const row of INLINE_UI) {
      const [en, cn, tw] = row;
      if (en && cn) state.ui.cn[en] = cn;
      if (en && tw) state.ui.tw[en] = tw;
    }
    for (const row of INLINE_TERMS) {
      const [en, cn, tw] = row;
      if (!en) continue;
      const k = en.toLowerCase();
      if (cn) state.terms.cn[k] = cn;
      if (tw) state.terms.tw[k] = tw;
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
    if (payload.terms) {
      for (const lang of ['cn', 'tw']) {
        const src = payload.terms[lang];
        if (!src) continue;
        for (const k of Object.keys(src)) state.terms[lang][k.toLowerCase()] = src[k];
      }
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

  /* ------------------------------------------------------------
   * 4b. 腾讯官方（国服）词库 —— 译名优先级最高的来源
   *
   * 国服市集 API 与国际服同源同构，返回的是腾讯官方简体译名：
   *   /api/trade/data/items  物品名（按分组+条目的顺序对齐英文）
   *   /api/trade/data/stats  词缀文本（两端 id 一致，可精确对齐）
   *
   * 国服 API 需要登录态（POESESSID）；取不到就静默失败，交给 poedb 兜底。
   * ---------------------------------------------------------- */
  const CN_API = 'https://poe.game.qq.com/api/trade/data/';
  const EN_API = 'https://www.pathofexile.com/api/trade/data/';

  async function tradeData(base, name) {
    const url = base + name;
    const r = await GM.xhr({
      method: 'GET', url, responseType: 'json',
      headers: { Accept: 'application/json', 'User-Agent': 'PoeNinjaChinese' }
    });
    const list = r.response && r.response.result;
    if (!Array.isArray(list) || !list.length) throw new Error(name + ' 返回为空（多半是没登录国服）');
    return list;
  }

  /** 按索引对齐两端条目；组数或组内条数不一致就整组放弃，宁缺勿错 */
  function alignGroups(enList, cnList, pick) {
    const out = Object.create(null);
    const usable = Math.min(enList.length, cnList.length);
    for (let g = 0; g < usable; g++) {
      const eg = enList[g], cg = cnList[g];
      if (!eg || !cg) continue;
      const ee = eg.entries || [], ce = cg.entries || [];
      if (ee.length !== ce.length) continue;      // 版本不同步 → 跳过该组
      for (let i = 0; i < ee.length; i++) pick(out, ee[i], ce[i]);
    }
    return out;
  }

  async function syncFromTencent() {
    const [enItems, cnItems] = await Promise.all([tradeData(EN_API, 'items'), tradeData(CN_API, 'items')]);
    /** 物品名：英文 name → 官方简中 name */
    const items = alignGroups(enItems, cnItems, (out, e, c) => {
      const en = cleanStr(e && (e.name || e.type));
      const cn = cleanStr(c && (c.name || c.type));
      if (!en || !cn || en === cn) return;        // 官方没翻译的保持英文
      if (en.length > 60 || cn.length > 60) return;
      if (/[^A-Za-z0-9'’\- ]/.test(en)) return;   // 只收纯英文名，数字/符号条目跳过
      if (!(en in out)) out[en] = cn;
    });

    // 词缀：id 两端一致，直接按 id 建索引再对齐，比顺序可靠
    let stats = Object.create(null);
    try {
      const [enStats, cnStats] = await Promise.all([tradeData(EN_API, 'stats'), tradeData(CN_API, 'stats')]);
      const cnById = new Map();
      for (const g of cnStats) for (const e of (g.entries || [])) {
        if (e && e.id && e.text) cnById.set(e.id, cleanStr(e.text));
      }
      for (const g of enStats) for (const e of (g.entries || [])) {
        if (!e || !e.id || !e.text) continue;
        const cn = cnById.get(e.id);
        const en = cleanStr(e.text);
        if (!cn || !en || en === cn) continue;
        if (!(en in stats)) stats[en] = cn;
      }
    } catch (e) { /* 词缀取不到不影响物品名 */ }

    const n = Object.keys(items).length + Object.keys(stats).length;
    if (!n) throw new Error('腾讯官方接口未返回可用译名');

    applyItems(Object.assign({}, items, stats), '腾讯官方（poe.game.qq.com）', false);
    return { n, host: 'poe.game.qq.com', items: Object.keys(items).length, stats: Object.keys(stats).length };
  }

  function cleanStr(s) {
    return String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  }

  /** 把一批英→中映射写进内存与缓存；fill=true 时只补官方没有的，不覆盖 */
  function applyItems(merged, src, fill) {
    const lang = activeLang();
    const bucket = lang === 'tw' ? 'en2tw' : 'en2cn';
    const dict = state.dict[lang];
    let added = 0;
    for (const k of Object.keys(merged)) {
      if (fill && (k in dict)) continue;   // 已有（多半来自腾讯官方）→ 不动
      dict[k] = merged[k];
      added++;
    }
    const cached = GM.get(K_NAME, null) || {};
    const payload = cached.payload || { en2cn: {}, en2tw: {}, ui: state.ui, terms: state.terms, overrides: {} };
    payload[bucket] = Object.assign(payload[bucket] || {}, merged);
    GM.set(K_NAME, { t: Date.now(), src, payload });
    return added;
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
    const total = Object.keys(built).length;
    if (!total) throw new Error('词表为空');

    // 只补官方没有的，腾讯译名优先
    const added = applyItems(built, host, true);
    return { n: added, total, host };
  }

  /**
   * 统一的物品名词库同步：腾讯官方优先，poedb 只补官方缺的。
   * 返回 { official, poedb, host, note }，任一源失败都不影响另一个。
   */
  async function syncItems(onlyOfficial) {
    const res = { official: 0, poedb: 0, host: '', note: '' };
    try {
      const r = await syncFromTencent();
      res.official = r.n;
      res.host = r.host;
      res.detail = r;
    } catch (e) {
      res.note = e.message || String(e);
    }
    if (onlyOfficial || !res.official) {
      try {
        const r = await syncFromPoedb();
        res.poedb = r.n;
        if (!res.host) res.host = r.host;
        res.poedbDetail = r;
      } catch (e) {
        if (!res.note) res.note = e.message || String(e);
      }
    }
    if (!res.official && !res.poedb) throw new Error(res.note || '两个词库源都取不到');
    return res;
  }

  /* ============================================================
   * 5. 翻译核心
   * ========================================================== */

  function gameKey() {
    return /^\/poe2(\/|$)/.test(location.pathname) ? 'poe2' : 'poe1';
  }

  function activeLang() { return state.lang === 'tw' ? 'tw' : 'cn'; }

  /** 单词条查表：物品词典 → 界面词典 → 术语词典（术语大小写不敏感） */
  function lookup(raw) {
    const s = String(raw);
    const d = state.dict[activeLang()];
    if (s in d) return d[s];
    const u = state.ui[activeLang()];
    if (s in u) return u[s];
    const low = s.toLowerCase();
    if (low in state.uiLower[activeLang()]) return state.uiLower[activeLang()][low];
    const t = state.terms[activeLang()];
    if (low in t) return t[low];
    return null;
  }

  /** 该词是否命中界面/术语词典（用于放宽单词级匹配的首字母大写限制） */
  function inGlossary(phrase) {
    const low = String(phrase).toLowerCase();
    return Object.prototype.hasOwnProperty.call(state.uiLower[activeLang()], low) ||
           Object.prototype.hasOwnProperty.call(state.terms[activeLang()], low);
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
        const okSingle = seq.length > 1 || /^[A-Z]/.test(phrase) || inGlossary(phrase);
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
    return tidy(out);
  }

  /** 译文收尾：中文之间不留空格（「护甲 破坏 III」→「护甲破坏 III」） */
  const CJK_SPACE = /([　-〿㐀-鿿＀-￯])\s+([　-〿㐀-鿿＀-￯])/g;
  function tidy(s) {
    let out = s, prev;
    do { prev = out; out = out.replace(CJK_SPACE, '$1$2'); } while (out !== prev);
    return out;
  }



  const CJK_RE = /[　-〿㐀-鿿＀-￯]/;

  function collectMissing(s) {
    if (state.missing.size >= MAX_MISSING || state.lang === 'off') return;
    const t = s.trim();
    if (t.length < 4 || t.length > 80) return;
    if (!/[A-Za-z]{3}/.test(t)) return;
    if (CJK_RE.test(t)) return;                      // 已含中文（多半是翻了一半的残留），不重复收集
    if (/^\d+([.,]\d+)*$/.test(t)) return;
    if (/^https?:\/\//.test(t)) return;
    if (/[{};]|::|@media/.test(t)) return;          // CSS / 选择子，跳过
    if (/^[A-Za-z0-9._-]+@|#\d{3,}/.test(t)) return; // 账号名（含 #数字），跳过
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

  /**
   * 收集 node 之后连续的文本节点，允许跨一层纯文本元素。
   * poe.ninja 会把数值高亮拆成 <span>30%</span><span>increased</span>…，
   * 只有把相邻片段拼起来，才能匹配「30% increased Global Damage」这类完整词条。
   */
  function followingTextNodes(node, limit) {
    const out = [];
    let cur = node;
    while (out.length < limit) {
      let sib = cur.nextSibling;
      let el = cur.parentElement;
      while (!sib && el) { sib = el.nextSibling; el = el.parentElement; }
      if (!sib) break;
      if (sib.nodeType === 3) {
        if (sib.nodeValue && sib.nodeValue.trim()) out.push(sib);
        cur = sib;
      } else if (sib.nodeType === 1) {
        // 只吃没有子元素的纯文本节点，复杂结构一律停手
        if (!sib.childElementCount && sib.textContent && sib.textContent.trim() && !SKIP_TAGS.has(sib.tagName)) {
          if (sib.firstChild && sib.firstChild.nodeType === 3) { out.push(sib.firstChild); cur = sib; }
          else break;
        } else break;
      } else break;
    }
    return out;
  }

  function scanText(node) {
    const src = node.nodeValue;
    if (!src || !src.trim()) { seen.add(node); return; }
    seen.add(node);

    // ① 单节点整体翻译
    const solo = translatePhrase(src);
    if (solo !== src) {
      node.nodeValue = solo;
      markOriginal(node, src);
      return;
    }

    // ② 单节点翻不动 → 与后面连续的文本片段合并再试（从最长开始）
    if (state.mergeAcross && /[A-Za-z]{2}/.test(src)) {
      const follow = followingTextNodes(node, MAX_JOIN);
      for (let n = follow.length; n >= 1; n--) {
        const parts = [src];
        for (let i = 0; i < n; i++) parts.push(follow[i].nodeValue);
        const joined = parts.join(' ').replace(/\s+/g, ' ').trim();
        const out = translatePhrase(joined);
        if (out !== joined) {
          node.nodeValue = out;
          for (let i = 0; i < n; i++) { follow[i].nodeValue = ''; seen.add(follow[i]); }
          markOriginal(node, joined);
          return;
        }
      }
    }
  }

  function markOriginal(node, src) {
    const p = node.parentElement;
    if (p && state.keepOriginal && !p.getAttribute('title')) {
      try { p.setAttribute('title', String(src).trim().slice(0, 300)); } catch (e) {}
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
    GM.menu('🇨🇳 同步词库（腾讯官方优先，PoEDB 补缺）', async () => {
      GM.notify('正在同步：腾讯官方 → PoEDB 补缺…');
      try {
        const r = await syncItems(false);
        rescanAll();
        const d = r.detail || {};
        GM.notify(r.official
          ? `腾讯官方 ${d.items || 0} 条物品 + ${d.stats || 0} 条词缀；PoEDB 补 ${r.poedb} 条`
          : `腾讯官方不可用（${r.note}）→ 全部取自 PoEDB：${r.poedb} 条`);
      } catch (e) { GM.notify('同步失败：' + e.message); }
    });
    GM.menu('🌏 只从 PoEDB 同步词库', async () => {
      GM.notify('正在从 ' + (gameKey() === 'poe2' ? 'poe2db.tw' : 'poedb.tw') + ' 拉取…');
      try {
        const r = await syncFromPoedb();
        rescanAll();
        GM.notify(`PoEDB 共 ${r.total} 条，其中 ${r.n} 条为官方缺失、已补入`);
      } catch (e) { GM.notify('同步失败：' + e.message); }
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
    GM.menu(`🧩 跨节点合并翻译（当前：${state.mergeAcross ? '开' : '关'}）`, () => {
      state.mergeAcross = !state.mergeAcross;
      GM.set(K_MERGE, state.mergeAcross);
      GM.notify('已' + (state.mergeAcross ? '开启' : '关闭'));
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

    // 首次安装（或仓库还没生成 dict.min.json）时，后台补一次物品名词库：
    // 腾讯官方优先，取不到（多半是没登录国服）再自动降级到 poedb。
    // 内置词库已能覆盖界面与术语，这一步失败也无妨，所以静默处理。
    if (Object.keys(state.dict[activeLang()]).length === 0) {
      syncItems(false)
        .then((r) => {
          rescanAll();
          const d = r.detail || {};
          GM.notify(r.official
            ? `已从腾讯官方载入 ${d.items || 0} 条物品 + ${d.stats || 0} 条词缀`
            : `腾讯官方不可用，已从 ${r.host} 载入 ${r.poedb} 条物品名`);
        })
        .catch(() => {});
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
      syncFromTencent,
      syncFromPoedb,
      syncItems,
      exportMissing
    };
  } catch (e) {}

  console.log(`[PoeNinjaChinese] v${SCRIPT_VERSION} · ${gameKey()} · lang=${state.lang}`);
})();
