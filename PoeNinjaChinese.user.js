// ==UserScript==
// @name         PoeNinjaChinese
// @name:zh-CN   poe.ninja 中文化
// @name:zh-TW   poe.ninja 中文化
// @namespace    https://github.com/saiyajiang/PoeNinjaChinese
// @version      2.0.0
// @description  基于 poe.ninja 官方繁體中文版转换成简体中文（腾讯国服译名优先）；官方未覆盖的残留英文由词库兜底；简体 / 官方繁体 / 关闭可切换，原文悬浮可见
// @description:zh-CN  基于 poe.ninja 官方繁体中文版转换成简体中文（腾讯国服译名优先）；官方未覆盖的残留英文由词库兜底；简体 / 官方繁体 / 关闭可切换，原文悬浮可见
// @description:zh-TW  基於 poe.ninja 官方繁體中文版轉換成簡體中文（騰訊國服譯名優先）；官方未覆蓋的殘留英文由詞庫兜底；簡體 / 官方繁體 / 關閉可切換，原文懸浮可見
// @author       saiyajiang
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAALhklEQVR42t1aeZCU1bX/nXu/pb/unp6FzIyjLMI4I84Q9QGuQRbRBI2ShHJGTYxxiUFFy62M+HxPMJsvL9FoKpsmLqBVarfh+RQCWQhR0EAeoBBmWGbIsMnsTPdMb99y731/9MIAGZgxM1DJqfqquqr7u33Ovef+fr9z7gUGsHC4jofDdRyn2E7khzbQS/X1EQEAr3zncxVnVXxqdmFQG59ICUWkaCQdVopUwOIUi3stza1dq+vrI61H+9TfjnaGlAKIoFb9tH7WGSXW/Rqj6ZyzoljcAdHJmXWlgMKgASFk1JPqvY8PpZ6ZsyC8RilQ1gd1TABKZT4TAeueu/7OkiLrZx09Kbz5x91o2h8VO/ZGFWcEpQ6/PBJGBBJSYeK4IqoaU8Svu7wSZcUWDkVTd0+b/8YvlMr/Th0ZQLiOL26oUVeO3vXq+IqCG3++bJv41dvbkUi7TOOMTJ2PrOdHpYXtCnhCqoBPl1+few7umjeJt7T2vfb7A9U3La5tJMqmE8/l16T6iHi8ruzOqjFFC//95xucJSt3arrOWNDSSdc4CABjdHIeIhgGh9/USCjF1m1to4OdSfe6WZXnB9x97RNujfwlHK7jkUij4uFwHa+rj8jLflo/a3RZ8LWX3tkuXl65Qy/wG8QIkDKTkyfblAKkykyaqWu0pbmLaYy8z5xX8fkvzqxee82tkZbacB1nDQ0dRIAqChgPtR9K8uffbiC/qVNukFNtOR/8pk7Pv91A7YeSvChgPESAamjoIP7uu3tV+Lt1pRWl5lNLV+40N27voKBPIzkI7+kkBqJzQl/SJV3jdPGk8tNmTq5+4Z7Hf5NgAFRFqXaVofNQ0/6Y0DgjeYLBGMu4Lvvh2t/7DR9i7h/PJACNM2raHxOGzkMVpdpVAJQGAJbJqmJxR+3Y0yMNnXN1nNknIsQTDnymBsPgsB0BjdMx6ZZIuZBSgkDHRS/KgjoBsHzagBOilIKhc+zY0yNjcYdZJqvKM7FSyiYi4ieYBSLA8wQ+fXY5Ft4xDYmUi7ufWA7O+DF5O6W2AgUBE1KqvAMDTQgRQQiJbU3tSNke2HEYkzMCEUgpZecDoGzY6oQkQ0jbHq6eXoWrplchmXJx940X4uklH6A4ZEEImU0tie8/dCUmVZcj1puGoXOYpnZkEAogRrAdASkl0o6H6+59Azv3dsMyNAy0B9VhX2hALTQwIigE/AaefvkD1FSW4vKLx+OuG6di3ea92NzQioKAASEz+2JzYytCQRNFIQudPQm0HIhC11jeMUYExxU4vTyEM8oKEO1NI9qXBmeEoZC9NlRI44yQFgrfe+49nDvxNIwqsvDw7dNw+2NvQWTTReMMD/7XKsy8cDxe+e95YIzh0af/gOZ93bBMHQDgegIFfhOv/6gOoYCJ58Ibsb8thqICX36cwRgbKpwJqRD0G9jW3IGXl32IgoCJyTWn4ZzKUqRtD4wRpFQoLPBh3aa9WLW2GRPGFuORO6aBMwZdZzB0DtcVeHT+ZZhcU4EdLV1Y+tYWWD4dcojkwz4JJgupELAMvPnbRix96yN89ZvLsG1XOyyflt+0OSh9dul67D8YwzUzq3HnDRegO5rCoVgKC266CNdfPQm24+HZpetxoK0XpsGHTJ5DSqH+6GDoHNG+FB54chUAwGdqR/y5lAp+y8C2pg784MX38cOHP4uHb7sUnYcSCAVNLLxjGvw+A7+MbEJkVQMKC0wIMXTq14aygZO293cJyzS0Y2CSiAClUFLowwuRzSgO+fDgLZfiu/fPBjGCEAov/nozFv9kDYIBAwQCkRr+FSACHFfgjLIQvvn1z+T/QGVXIZF08P0X3sehaAq6xvKBeJ5AyvZARKgaVwJD15BIOtB1DiklbFvgr03t0DlDrM8G5wSfoWVRaDgDAMETEoVBEzfOPT+vrpSQsF2BnlgSz76yIe84ZfdIcaGF2TWnY/Yl4zHjgjNxelkBiAgft/fC0Dk+VezH9+6/Ajd/4Xz87v3dWLdpL3a2dCORcqBxNnwBZChcw8HOOG5/9H9ABNiOwOjyEO772sXoSzp55xkBibSHh269FF++9lwUBs08N3T3pLD8Tzvx5PNrURTy4fG7Z+KyKWMx+ZwKTK6pQHfdFHRHkwiv3IYfv7IBfks/AhA+eQAANEboS9gIr9wGxgiJtIvzqsvxwC2XgDN2RL5JqdDQ3IHR5SHE+tL4cHsb1m3ah8iqbWjrSuDzM6rR05vC/EXvYEpNBebOnoiLzh2NMRUhnDPxNPS+uQmOJxAgffg2scpqkOJCK7NpTQ2FQfNYxSgVLEvH6vUtWPCtFejsSWDrjjYciqWQdgTmTKvETxZfi917urCx4SA2bD2A9VsPoLQ4gLPHj0Ll2BKsWtsMv29wsz80FAIghIRSGeE1EFsSAI0TXluxFWnbg+XTYRocIuUi2mcj3pdGrC+N3ridYXaN0NYVx56Pe6BrHIUFJjTOBo1GGobZiADHk6gaNwoLvnJhVuARXE+gfFQAjuuhpNDCd+6bnfkuq6ctn45X/3cLNjW2wjK1QTPy8AcAgucJhIImbrvhgkxhm10a6Qi0d8cRDJi4vX4K8o0mqYCgD2v/bw8+2LIffp8GnKoVyKFWW2cc9y1+B9lGGWzbw4SxJZh//VR0dCfw5HPvwXEFiAhKKegax0c72mCZQ9ND2vClDuVzSOOEWNzGS8s+yhQhnNAbtzF96jjce9NFSKQcvPrOViSSbqaaywbutwyYOj/5ATBGcF0BzjIaX+MZ8rN8Wr/vJUydZ1eE4DMzwq8/83qezKwGZ4NmY204nO/tS6P2rFJ8+4HZ+M9nVqNybAnq59SiL+GAMwII8IRESchCKu2iOOTDjxbOyRQ/R8n011f8Fcvf3YWg3xgeIjuROk2nPZw1bhSeuHcWLrpkAq7f1Y54wsHV154HGU0e7jYQwXU8dEeT8Pt0zLuy5oi+jBASvMiPDxsPYtlqkU3JEQ7AEwKmyfHkg1fg09VlWP/BbjyzZD3Gjy5C/InlmQKdZWtpx8OEM4pxy7x/Q1dPAk+99Gc4rne4RSMVfKaGDVsOwG+OAJEd0x3gORkNnF5agK0723HX4uWIxlLYGk9j/UcH8ijJGKE37mDG1HGYf8NU9CUdvPDrzUimHPB+LRmlMnVFprAZoQCUUjB1Dbv39WDFu7vw5WvOxdqNe3Hvt1fgQEcfgn4dUgLFpp5XrowROOcIBoxMv5MIRQUmDJ2Ds34tzKyWUiOJQirbcE3ZHh754e+xubEVK99rQnt3AkFLz1dV/aurnAyRR23aHEsf9vcTVmRKKUVEg+51Zsgqo1d+FdmEgGUgYOmD6ibkGln/yNlBzuf+jS1TKaihtDNys1ZU4INU6ribTkoFy6dh+9+6cOVtS+B6ArYjwBgNuYQUUkEpKCIy812JlC2bCoMGTTyzmOXofYgDDgpyU7aL7bs7sXtfz5DyPLdyjisw8cxiVhg0KGXLplwA1NrprXRc0Vs1ppB7QiqGkTFGBL9Ph88cOvgxAJ6QqmpMIXdc0dva6a0EQGzRohm8/rFIZ9oWa+sur4TfpwnHU/9Qnh63Ta7UJ5t9T8Hv00Td5ZVI22Jt/WORzkWLZnBWW1umFEDRhPNUeYlffGNurUrarspp+1NtOR+Stqu+MbdWlZf4RTThPKUAqq0tUzwSaVS14Tp+7a2Rv31pRlXnnEvGzT3YmXC3NHcxjTPSNZYZJSuLT8rT74DEEwqJlKu+NH2C+8jNk42Wj2P3XHFPJFKbPfjmABCJNCoVruNL9tRsLGEHq6+bNeF8zkhu3tmlepMOCaGIMYLMHryN9KMUkLI9JNOeMjQu75pXqxbePFlvae17bU3bxMf+tKCMTcoes/7rHHTn3v9nu2pwNJ4poszB95z68BoAa07VZY/umN3S3Nq1+qv/8dv8ZQ+iYy97DGj/LNdt/h8btvBKalmOsgAAAABJRU5ErkJggg==
// @match        *://poe.ninja/*
// @match        *://*.poe.ninja/*
// @connect      poedb.tw
// @connect      poe2db.tw
// @connect      poe.game.qq.com
// @connect      poe2.game.qq.com
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
 * v2.0.0 起：poe.ninja 已自带官方繁體中文版，所以架构从「英译中」改为「繁转简」：
 *   1. 词汇层：官方繁体用词 → 简体用词（腾讯国服译名优先），最长匹配
 *   2. 字形层：剩余繁体字逐字转简（4053 个简繁异体字）
 *   3. 兜底层：官方繁中未覆盖的残留英文，仍用旧词库翻译（简/繁各自一套）
 *   4. 数据层：默认关闭（poe.ninja 用 name 查图标/描述，改中文会导致技能丢图标）
 * 词库来源：poedb.tw / poe2db.tw 的 /cn/ 与 /tw/ 页面（CC BY-NC-SA 3.0）
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
  const SCRIPT_VERSION = '2.0.0';

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
    ["Acolyte of Chayula", "夏乌拉侍僧", "夏烏拉侍僧"],
    ["Act 1", "第一章", "第一章"],
    ["Act 2", "第二章", "第二章"],
    ["Act 3", "第三章", "第三章"],
    ["Act 4", "第四章", "第四章"],
    ["Add", "添加", "添加"],
    ["Add Your Character", "添加你的角色", "添加你的角色"],
    ["Add character", "添加角色", "添加角色"],
    ["Add to favorites", "加入收藏", "加入收藏"],
    ["Add your character", "添加你的角色", "添加你的角色"],
    ["Advanced Thaumaturgy", "高等奇术", "高等奇術"],
    ["Advertise on this site", "在本站投放广告", "在本站投放廣告"],
    ["Affinity", "亲和", "親和"],
    ["Ahn's Citadel", "汉恩的城塞", "漢恩的城塞"],
    ["Ailith's Chimes", "艾利丝钟琴", "艾利絲鐘琴"],
    ["Alchemy Shard", "点金碎片", "點金碎片"],
    ["All leagues", "全部联盟", "全部聯盟"],
    ["Allflame Ember", "全焰余烬", "全焰餘燼"],
    ["Amanamu's Tithe", "阿曼娜姆的奉纳", "阿曼娜姆的奉納"],
    ["Amazon", "亚马逊", "亞馬遜"],
    ["Amulet", "项链", "項鍊"],
    ["Ancestral Tiara", "先祖之冠", "先祖之冠"],
    ["Apply", "应用", "套用"],
    ["Arakaali's Lust", "阿拉卡力的欲望", "阿拉卡力的慾望"],
    ["Arbiter's Ignition", "仲裁官的点燃", "仲裁官的點燃"],
    ["Area Level", "区域等级", "區域等級"],
    ["Arjun's Medal", "阿尔琼的勋章", "阿爾瓊的勳章"],
    ["Armageddon Pace", "末日步伐", "末日步伐"],
    ["Armageddon Pace, Daggerfoot Shoes", "末日步伐，匕足之靴", "末日步伐，匕足之靴"],
    ["Armour", "护甲", "護甲"],
    ["Armour Break I", "护甲破坏 I", "護甲破壞 I"],
    ["Armour Break II", "护甲破坏 II", "護甲破壞 II"],
    ["Armour Break III", "护甲破坏 III", "護甲破壞 III"],
    ["Armour Demolisher I", "破甲者 I", "破甲者 I"],
    ["Armour Demolisher II", "破甲者 II", "破甲者 II"],
    ["Armour Slot", "护甲位", "護甲位"],
    ["Ascendancies", "升华职业", "昇華職業"],
    ["Ascendancy", "升华", "昇華"],
    ["Ascendancy & Keystones", "升华与核心天赋", "昇華與核心天賦"],
    ["Ascending", "升序", "遞增"],
    ["Assassin", "刺客", "刺客"],
    ["Atalui's Bloodletting", "阿图鲁伊的放血术", "阿圖魯伊的放血術"],
    ["Atlas", "异界", "異界"],
    ["Atlas Trees", "异界天赋树", "異界天賦樹"],
    ["Attack Damage", "攻击伤害", "攻擊傷害"],
    ["Attacks per Second", "每秒攻击次数", "每秒攻擊次數"],
    ["Atziri's Allure", "阿兹里的魅惑", "阿茲里的魅惑"],
    ["Atziri's Communion", "阿兹里的呼唤", "阿茲里的呼喚"],
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
    ["Block Chance", "格挡率", "格擋率"],
    ["Blood Mage", "命源法师", "血法師"],
    ["Bloodmage", "命源法师", "血法師"],
    ["Breachlord's Rift", "裂界之主的裂隙", "裂界之主的裂隙"],
    ["Brutus' Brain", "布鲁特斯之脑", "布魯特斯之腦"],
    ["Build Planner", "天赋树规划器", "天賦樹規劃器"],
    ["Builds", "构筑", "構築"],
    ["Builds - Path of Exile 1", "构筑 — 流放之路 1", "構築 — 流放之路 1"],
    ["Builds - Path of Exile 2", "构筑 — 流放之路 2", "構築 — 流放之路 2"],
    ["Buying Price", "买入价", "買入價"],
    ["Cancel", "取消", "取消"],
    ["Cannibalism", "吞灵", "吞靈"],
    ["Cannibalism II", "吞灵 II", "吞靈 II"],
    ["Cartographer\"s Chisel", "制图钉", "製圖釘"],
    ["Category", "分类", "分類"],
    ["Champion", "冠军", "冠軍"],
    ["Change", "涨跌", "漲跌"],
    ["Change %", "涨跌幅", "漲跌幅"],
    ["Chaos Damage", "混沌伤害", "混沌傷害"],
    ["Chaos Equivalent", "折合混沌石", "折合混沌石"],
    ["Chaos Orb", "混沌石", "混沌石"],
    ["Chaos Resistance", "混沌抗性", "混沌抗性"],
    ["Chaos Value", "混沌石价值", "混沌石價值"],
    ["Character", "角色", "角色"],
    ["Characters", "角色", "角色"],
    ["Characters and Favorites", "角色与收藏", "角色與收藏"],
    ["Characters found", "找到角色", "找到角色"],
    ["Charge Profusion", "能量球激增", "充能滿盈"],
    ["Charge Profusion II", "能量球激增 II", "充能滿盈 II"],
    ["Charge Regulation", "充能调节", "充能調節"],
    ["ChargeRegulationPlayer", "充能调节", "充能調節"],
    ["Charges gained", "获得的充能", "獲得的充能"],
    ["Chieftain", "酋长", "酋長"],
    ["Choices", "选项", "選項"],
    ["Chromatic Orb", "幻色石", "幻色石"],
    ["Chronomancer", "塑时术师", "時空幻術師"],
    ["Clarity I", "清晰 I", "清晰 I"],
    ["Clarity II", "清晰 II", "清晰 II"],
    ["Class", "职业", "職業"],
    ["Click the row for the full breakdown", "点击该行查看完整明细", "點擊該行查看完整明細"],
    ["Close", "关闭", "關閉"],
    ["Cluster Jewel", "集群珠宝", "集群珠寶"],
    ["Cluster Jewels", "集群珠宝", "集群珠寶"],
    ["Coffin", "棺柩", "棺柩"],
    ["Cold Damage", "冰霜伤害", "冰霜傷害"],
    ["Cold Resistance", "冰霜抗性", "冰霜抗性"],
    ["Cold-Infused", "冰霜灌注", "冰霜灌注"],
    ["Columns", "列", "欄位"],
    ["Combat Frenzy", "战斗狂怒", "戰鬥狂怒"],
    ["Compare", "对比", "比較"],
    ["Confidence", "置信度", "信心度"],
    ["Console", "主机版", "主機版"],
    ["Consumption", "吞噬", "吞噬"],
    ["Contribute", "贡献", "貢獻"],
    ["Cooldown Recovery II", "冷却回复速度 II", "冷卻回復速度 II"],
    ["Copied", "已复制", "已複製"],
    ["Copy", "复制", "複製"],
    ["Corrupted", "已腐化", "已腐化"],
    ["Count", "数量", "數量"],
    ["Crafted", "工艺", "工藝"],
    ["Critical Damage Bonus", "暴击伤害加成", "暴擊傷害加成"],
    ["Critical Hit Chance", "暴击几率", "暴擊機率"],
    ["Critical Strike Chance", "暴击率", "暴擊率"],
    ["Currency", "通货", "通貨"],
    ["Current price", "当前价格", "目前價格"],
    ["DPS", "每秒伤害", "每秒傷害"],
    ["Daggerfoot Shoes", "匕足之靴", "匕足之靴"],
    ["Daily change", "日涨跌", "日漲跌"],
    ["Damage", "伤害", "傷害"],
    ["Damage per Second", "每秒伤害", "每秒傷害"],
    ["Damage taken", "承受伤害", "承受傷害"],
    ["Daresso's Passion", "德瑞索的热情", "德瑞索的熱情"],
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
    ["Dialla's Desire", "达拉的渴望", "達拉的渴望"],
    ["Diamond", "钻石", "鑽石"],
    ["Disable", "停用", "停用"],
    ["Disciple of Varashta", "瓦拉煞的门徒", "瓦拉什塔門徒"],
    ["Divination Card", "命运卡", "命運卡"],
    ["Divination Cards", "命运卡", "命運卡"],
    ["Divine Orb", "神圣石", "神聖石"],
    ["Divine Value", "神圣石价值", "神聖石價值"],
    ["Docs & FAQ", "文档与常见问题", "文件與常見問題"],
    ["Doedre's Undoing", "德瑞的毁灭", "德瑞的毀滅"],
    ["Druid", "德鲁伊", "德魯伊"],
    ["Duelist", "决斗者", "決鬥者"],
    ["Economy", "经济", "經濟"],
    ["Economy - Path of Exile 1", "经济 — 流放之路 1", "經濟 — 流放之路 1"],
    ["Economy - Path of Exile 2", "经济 — 流放之路 2", "經濟 — 流放之路 2"],
    ["Effective DPS", "有效 DPS", "有效 DPS"],
    ["Effective Health Pool", "有效生命池", "有效生命池"],
    ["Effective mitigation", "有效减伤", "有效減傷"],
    ["Effective mitigation 61", "有效减伤 61", "有效減傷 61"],
    ["Efficiency", "效率", "效率"],
    ["Einhar's Beastrite", "伊恩哈尔的魔物仪式", "伊恩哈爾的魔物儀式"],
    ["Elemental Armament II", "元素军备 II", "元素軍備 II"],
    ["Elemental DPS", "元素 DPS", "元素 DPS"],
    ["Elemental Damage", "元素伤害", "元素傷害"],
    ["Elementalist", "元素使", "元素使"],
    ["Elements", "元素", "元素"],
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
    ["Esh's Radiance", "艾许的光辉", "艾許的光輝"],
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
    ["Fire Damage", "火焰伤害", "火焰傷害"],
    ["Fire Mastery", "火焰精通", "火焰精通"],
    ["Fire Resistance", "火焰抗性", "火焰抗性"],
    ["Flasks", "药剂", "藥劑"],
    ["Flavour text", "风味文本", "風味文本"],
    ["Flow State", "流动状态", "流動狀態"],
    ["Forbidden Rites", "禁忌仪式", "禁忌儀式"],
    ["Fossil", "化石", "化石"],
    ["Fossils", "化石", "化石"],
    ["Fractured", "破裂的", "破裂的"],
    ["Fragment", "碎片", "碎片"],
    ["Fragments", "碎片", "碎片"],
    ["Frost Nexus", "霜寒连结", "霜寒連結"],
    ["Gale Force", "疾风之力", "疾風之力"],
    ["Garukhan's Resolve", "格鲁坎的决心", "格魯坎的決心"],
    ["Gem Level", "宝石等级", "寶石等級"],
    ["Gem Quality", "宝石品质", "寶石品質"],
    ["Gem Studded", "宝石镶嵌", "寶石鑲嵌"],
    ["Gemcutter\"s Prism", "宝石工匠的棱镜", "寶石工匠的稜鏡"],
    ["Gemling Legionnaire", "古灵使徒斗士", "古靈軍團"],
    ["Gems", "宝石", "寶石"],
    ["Ghost Dance", "幽灵舞步", "幽靈舞步"],
    ["Gladiator", "角斗士", "角鬥士"],
    ["Goddess of Justice", "正义女神", "正義女神"],
    ["Grants Skill", "赋予技能", "賦予技能"],
    ["Grants skill", "赋予技能", "賦予技能"],
    ["Great White One", "大白鲨", "大白鯊"],
    ["Guardian", "守护者", "守護者"],
    ["Guatelitzi's Ablation", "瓜铁雷兹的消融", "瓜鐵雷茲的消融"],
    ["Halls of the Dead", "亡者之厅", "亡者之廳"],
    ["Hardcore", "硬核", "硬核"],
    ["Hayoxi's Fulmination", "海幽夏的诛罚", "海幽夏的誅罰"],
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
    ["Huntress", "女猎手", "女獵人"],
    ["Hypnotic Star", "催眠之星", "催眠之星"],
    ["Hypnotic Star, Ancestral Tiara", "催眠之星，先祖之冠", "催眠之星，先祖之冠"],
    ["Implicit", "固有词缀", "固有詞綴"],
    ["Implicit Modifier", "固有词缀", "固有詞綴"],
    ["Implicit modifiers", "固有词缀", "固有詞綴"],
    ["Import", "导入", "匯入"],
    ["Import Code for Path of Building", "Path of Building 导入代码", "Path of Building 匯入代碼"],
    ["Increased", "提高", "提高"],
    ["Incubator", "孵化器", "孵化器"],
    ["Incubators", "孵化器", "孵化器"],
    ["Infernalist", "驱炎师", "獄火師"],
    ["Influenced", "已受尊师影响", "已受尊師影響"],
    ["Inquisitor", "判官", "判官"],
    ["Intelligence", "智慧", "智慧"],
    ["Interludes", "幕间", "幕間"],
    ["Invigorating Archon", "振奋执政官", "振奮執政官"],
    ["Invitation", "邀请函", "邀請函"],
    ["Invitations", "邀请函", "邀請函"],
    ["Invoker", "祈求者", "祈靈者"],
    ["Item", "物品", "物品"],
    ["Item Level", "物品等级", "物品等級"],
    ["Item Quantity", "物品数量", "物品數量"],
    ["Item Rarity", "物品稀有度", "物品稀有度"],
    ["Ixchel's Torment", "伊克切尔的折磨", "伊克切爾的折磨"],
    ["Jeweller\"s Orb", "工匠石", "工匠石"],
    ["Jewels", "珠宝", "珠寶"],
    ["Juggernaut", "勇士", "勇士"],
    ["Kalisa's Crescendo", "卡莉莎的强音", "卡莉莎的強音"],
    ["Kaom's Madness", "冈姆的疯狂", "岡姆的瘋狂"],
    ["Keystone", "核心天赋", "核心天賦"],
    ["Keystones", "核心天赋", "核心天賦"],
    ["Khatal's Rejuvenation", "卡哈塔的复苏", "卡哈塔的復甦"],
    ["Kulemak's Dominion", "库勒马克的统治", "庫勒馬克的統治"],
    ["Kurgal's Leash", "古加尔的缰绳", "古加爾的韁繩"],
    ["Ladder", "天梯", "天梯"],
    ["Language", "语言", "語言"],
    ["Last 7 days", "近 7 天", "近 7 天"],
    ["Last fetched", "最后抓取", "最後抓取"],
    ["Last updated", "最后更新", "最後更新"],
    ["Latest Snapshot", "最新快照", "最新快照"],
    ["Latest snapshot", "最新快照", "最新快照"],
    ["League", "联盟", "聯盟"],
    ["League start", "赛季开始", "賽季開始"],
    ["Leagues", "联盟", "聯盟"],
    ["Less", "更少", "更少"],
    ["Level", "等级", "等級"],
    ["Lich", "巫妖", "巫妖"],
    ["Life", "生命", "生命"],
    ["Life Regeneration", "生命回复", "生命回復"],
    ["Light mode", "浅色模式", "淺色模式"],
    ["Lightning Damage", "闪电伤害", "閃電傷害"],
    ["Lightning Resistance", "闪电抗性", "閃電抗性"],
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
    ["Mastery", "精通", "精通"],
    ["Max Hit", "最大承受击中", "最大承受擊中"],
    ["Medallion", "徽章", "徽章"],
    ["Memory", "记忆", "記憶"],
    ["Mercenary", "佣兵", "傭兵"],
    ["Mindful Awareness", "正念觉察", "正念覺察"],
    ["Mirror Shard", "魔镜碎片", "魔鏡碎片"],
    ["Mirror of Kalandra", "卡兰德的魔镜", "卡蘭德的魔鏡"],
    ["Mirrored", "已复制", "已複製"],
    ["Monk", "行者", "僧侶"],
    ["Monster Level", "怪物等级", "怪物等級"],
    ["More", "更多", "更多"],
    ["Morgana's Tempest", "莫甘娜的暴风", "莫甘娜的暴風"],
    ["Mote", "微粒", "微粒"],
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
    ["Oisín's Oath", "奥辛之誓", "奧辛之誓"],
    ["Olroth's Conviction", "欧洛斯的信念", "歐洛斯的信念"],
    ["Omen", "预兆", "預兆"],
    ["Omens", "预兆", "預兆"],
    ["One-Handed", "单手", "單手"],
    ["Open", "打开", "開啟"],
    ["Open in PoB", "在 PoB 中打开", "在 PoB 中開啟"],
    ["Oracle", "神谕者", "天啟先知"],
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
    ["Paquate's Pact", "帕夸特的契约", "帕夸特的契約"],
    ["Passive Skill Tree", "天赋树", "天賦樹"],
    ["Passive tree", "天赋树", "天賦樹"],
    ["Passives", "天赋树", "天賦樹"],
    ["Path of Exile 1", "流放之路 1", "流放之路 1"],
    ["Path of Exile 2", "流放之路 2", "流放之路 2"],
    ["Pathfinder", "追猎者", "追獵者"],
    ["Payoff", "收割", "收割"],
    ["Percentage", "占比", "佔比"],
    ["Perfect Iron Rune", "完美钢铁符文", "完美鋼鐵符文"],
    ["Perform a circular slash that kicks up a", "挥出环形斩击，扬起", "揮出環形斬擊，揚起"],
    ["Perpetual Charge", "永续充能", "永續充能"],
    ["Phoenix Claw", "凤凰之爪", "鳳凰之爪"],
    ["Physical DPS", "物理 DPS", "物理 DPS"],
    ["Physical Damage", "物理伤害", "物理傷害"],
    ["Pierce the Heart", "穿心", "穿心"],
    ["Pin Buildup", "钉住积蓄", "釘住積蓄"],
    ["Pinpoint Critical", "精准暴击", "精準暴擊"],
    ["PoEDB", "编年史", "編年史"],
    ["Popularity", "热度", "熱度"],
    ["Portal Scroll", "传送卷轴", "傳送卷軸"],
    ["Prefix", "前缀", "前綴"],
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
    ["Ratha's Assault", "拉莎的突袭", "拉莎的突襲"],
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
    ["Rigwald's Ferocity", "瑞佛的凶猛", "瑞佛的兇猛"],
    ["Rings", "戒指", "戒指"],
    ["Ritualist", "仪祭师", "儀式行者"],
    ["Romira's Requital", "罗米拉的报复", "羅米拉的報復"],
    ["Rows per page", "每页行数", "每頁列數"],
    ["Rune", "符文", "符文"],
    ["Runeforged Secured Wraps", "符文锻造护腕", "符文鍛造護腕"],
    ["Runic Ward", "符文护盾", "符文護盾"],
    ["Saboteur", "破坏者", "破壞者"],
    ["Salvo", "齐射", "齊射"],
    ["Sanctified", "圣化的", "聖化的"],
    ["Scarab", "圣甲虫", "聖甲蟲"],
    ["Scarabs", "圣甲虫", "聖甲蟲"],
    ["Scarred Faith", "伤痕信仰", "傷痕信仰"],
    ["Scion", "贵族", "貴族"],
    ["Scroll of Wisdom", "智慧卷轴", "智慧卷軸"],
    ["Seal", "封印", "封印"],
    ["Seal broken", "封印破碎", "封印破碎"],
    ["Sealing", "封印", "封印"],
    ["Seals", "封印", "封印"],
    ["Search", "搜索", "搜索"],
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
    ["Shaman", "萨满", "狂徒薩滿"],
    ["Share Path of Building Code", "分享 PoB 代码", "分享 PoB 代碼"],
    ["Share PoB", "分享 PoB", "分享 PoB"],
    ["Show", "显示", "顯示"],
    ["Show all", "显示全部", "顯示全部"],
    ["Show more", "显示更多", "顯示更多"],
    ["Sign in", "登录", "登入"],
    ["Sign up", "注册", "註冊"],
    ["Sione's Temper", "西奥妮的怒火", "西奧妮的怒火"],
    ["Skill", "技能", "技能"],
    ["Skill Gem", "技能宝石", "技能寶石"],
    ["Skill Gems", "技能宝石", "技能寶石"],
    ["Skills", "技能", "技能"],
    ["Slayer", "处刑者", "處刑者"],
    ["Slipstrike Vest", "滑击背心", "快速打擊背心"],
    ["Smith of Kitava", "奇塔弗匠师", "奇塔弗工匠"],
    ["Snapshot", "快照", "快照"],
    ["Sniper's Mark", "狙击者印记", "狙擊者印記"],
    ["Socket", "插槽", "插槽"],
    ["Socketed Skill", "已镶嵌技能", "已鑲嵌技能"],
    ["Sockets", "插槽", "插槽"],
    ["Solo Self-Found", "独狼模式", "獨狼模式"],
    ["Sorceress", "魔巫", "女術者"],
    ["Sort", "排序", "排序"],
    ["Soul Core", "魂核", "魂核"],
    ["Sparkline", "价格走势", "價格走勢"],
    ["Spear Throw", "战矛投掷", "戰矛投擲"],
    ["Spell Damage", "法术伤害", "法術傷害"],
    ["Spiked Shield", "尖刺盾", "尖刺盾"],
    ["Spirit", "精魂", "精魂"],
    ["Split", "已分裂", "已分裂"],
    ["Spray and Pray", "散射快射", "散射快射"],
    ["Stack size", "堆叠数量", "堆疊數量"],
    ["Standard", "标准", "標準"],
    ["Statistics", "统计", "統計"],
    ["Stormweaver", "风暴编织者", "風暴編織者"],
    ["Strength", "力量", "力量"],
    ["Subterfuge Mask", "诡诈面具", "詭詐面具"],
    ["Suffix", "后缀", "後綴"],
    ["Supply", "供给量", "供給量"],
    ["Support the site", "支持本站", "支持本站"],
    ["SupportClarityPlayerTwo", "清晰 II（辅助）", "清晰 II（輔助）"],
    ["Tacati's Ire", "塔卡提之怒", "塔卡提之怒"],
    ["Tactician", "战术家", "智勇軍師"],
    ["Tasalio's Test", "塔萨罗的考验", "塔薩羅的考驗"],
    ["Tawhoa's Tending", "塔赫亚的照料", "塔赫亞的照料"],
    ["Tawhoa's Test", "塔霍亚的考验", "塔霍亞的考驗"],
    ["Tecrod's Revenge", "特克罗的复仇", "特克羅的復仇"],
    ["Templar", "圣堂武僧", "聖堂武僧"],
    ["The Seven Pillars", "七灵柱", "七靈柱"],
    ["The Venom Crypts", "毒蛇地穴", "毒蛇地穴"],
    ["Tier", "阶级", "階級"],
    ["Time Machine", "时间机器", "時間機器"],
    ["Time-Lost Emerald", "时光遗失的翠玉", "時光遺失的翠玉"],
    ["Titan", "泰坦", "泰坦"],
    ["Total", "合计", "合計"],
    ["Total DPS", "总 DPS", "總 DPS"],
    ["Trade", "交易", "交易"],
    ["Transmutation Shard", "蜕变碎片", "蛻變碎片"],
    ["Tree", "天赋树", "天賦樹"],
    ["Trickster", "欺诈师", "欺詐師"],
    ["Trinity", "三位一体", "三位一體"],
    ["Tul's Stillness", "托沃的寂静", "托沃的寂靜"],
    ["Twice Corrupted", "二次腐化", "二次腐化"],
    ["Twister", "旋风", "旋風"],
    ["Twofold", "双重", "雙重"],
    ["Type", "类型", "類型"],
    ["Uhtred's Augury", "乌崔德的占卜", "烏崔德的占卜"],
    ["Uhtred's Constellation", "乌崔德的星座", "烏崔德的星座"],
    ["Uhtred's Exodus", "乌崔德的出走", "烏崔德的出走"],
    ["Uhtred's Omen", "乌崔德的预兆", "烏崔德的預兆"],
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
    ["Uruk's Smelting", "厄罗克的熔炼术", "厄羅克的熔煉術"],
    ["Uul-Netol's Embrace", "乌尔尼多的拥抱", "烏爾尼多的擁抱"],
    ["Vaal Orb", "瓦尔宝珠", "瓦爾寶珠"],
    ["Vale Shelter", "谷地庇护", "谷地庇護"],
    ["Valley of the Titans", "泰坦之谷", "泰坦之谷"],
    ["Value", "价值", "價值"],
    ["Varashta's Blessing", "瓦拉煞的祝福", "瓦拉煞的祝福"],
    ["Variant", "变体", "變體"],
    ["Vial", "小瓶", "小瓶"],
    ["Vials", "小瓶", "小瓶"],
    ["View Profile", "查看资料", "檢視資料"],
    ["View all posts", "查看全部公告", "查看全部公告"],
    ["Vilenta's Propulsion", "薇伦塔之推进", "薇倫塔之推進"],
    ["Virtuous Barrier", "美德壁垒", "美德壁壘"],
    ["VirtuousBarrierPlayer", "美德壁垒", "美德壁壘"],
    ["Vitality II", "活力 II", "活力 II"],
    ["Volume", "成交量", "成交量"],
    ["Vulgar Methods", "粗俗手段", "卑鄙手段"],
    ["Warbringer", "战争使者", "戰爭使者"],
    ["Ward", "结界", "結界"],
    ["Warden", "守望者", "守望者"],
    ["Warrior", "战士", "戰士"],
    ["Watch Intro", "观看介绍", "觀看介紹"],
    ["Weapon", "武器", "武器"],
    ["Weapon DPS", "武器 DPS", "武器 DPS"],
    ["Whakapanu Island", "瓦卡帕努岛", "瓦卡帕努島"],
    ["Whirling Slash", "回旋斩", "迴旋斬"],
    ["Wiki", "维基", "維基"],
    ["Wind Dancer", "风舞者", "風舞者"],
    ["Witch", "女巫", "女巫"],
    ["Witchhunter", "猎巫人", "女巫獵人"],
    ["Xibaqua's Rending", "夏巴夸亚的撕裂", "夏巴夸亞的撕裂"],
    ["Xoph's Pyre", "索伏的葬火", "索伏的葬火"],
    ["Zarokh's Refrain", "扎洛卡的克制", "扎洛卡的克制"],
    ["ago", "前", "前"],
    ["characters found", "个角色", "個角色"],
    ["day", "天", "天"],
    ["days", "天", "天"],
    ["equipped in your Main Hand", "装备于主手", "裝備於主手"],
    ["found", "找到", "找到"],
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
    ["absorbs", "吸收", "吸收"],
    ["acceleration", "加速", "加速"],
    ["account", "账号", "帳號"],
    ["accuracy", "命中", "命中"],
    ["accuracy rating", "命中值", "命中值"],
    ["accuracy rating while moving", "移动时命中值", "移動時命中值"],
    ["added", "附加", "附加"],
    ["additional", "额外", "額外"],
    ["adds", "附加", "附加"],
    ["affinity", "亲和", "親和"],
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
    ["around", "周围", "周圍"],
    ["around you", "在你周围", "在你周圍"],
    ["arrow", "箭矢", "箭矢"],
    ["arrows", "箭矢", "箭矢"],
    ["ascendancy", "升华", "昇華"],
    ["attack", "攻击", "攻擊"],
    ["attack damage", "攻击伤害", "攻擊傷害"],
    ["attack speed", "攻击速度", "攻擊速度"],
    ["attacks", "攻击", "攻擊"],
    ["attribute", "属性", "屬性"],
    ["attributes", "属性", "屬性"],
    ["augment", "增幅", "增幅"],
    ["aura", "光环", "光環"],
    ["awareness", "觉察", "覺察"],
    ["axes", "斧", "斧"],
    ["banner", "战旗", "戰旗"],
    ["barrage", "弹幕", "彈幕"],
    ["base", "基础", "基礎"],
    ["based on a portion of", "基于一部分", "基於一部分"],
    ["bear", "熊", "熊"],
    ["belt", "腰带", "腰帶"],
    ["bidding", "号令", "號令"],
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
    ["bows", "弓", "弓"],
    ["break", "破坏", "破壞"],
    ["broken", "破碎", "破碎"],
    ["bubble", "气泡", "氣泡"],
    ["buff", "增益", "增益"],
    ["buffs", "增益", "增益"],
    ["buildup", "积蓄", "積蓄"],
    ["burst", "破裂", "破裂"],
    ["but will", "但会", "但會"],
    ["by", "被", "被"],
    ["can be boosted by multiple", "可被多个加成", "可被多個加成"],
    ["can't be", "无法被", "無法被"],
    ["cannibalism", "吞灵", "吞靈"],
    ["cannot", "无法", "無法"],
    ["cannot be", "无法被", "無法被"],
    ["cast speed", "施法速度", "施法速度"],
    ["cast time", "施法时间", "施法時間"],
    ["causing", "使", "使"],
    ["causing them to", "使其", "使其"],
    ["causing them to grant", "使其获得", "使其獲得"],
    ["causing those", "使这些", "使這些"],
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
    ["chilled ground", "冰缓地面", "冰緩地面"],
    ["clarity", "清晰", "清晰"],
    ["class", "职业", "職業"],
    ["claw", "爪", "爪"],
    ["claws", "爪", "爪"],
    ["close", "关闭", "關閉"],
    ["cold", "冰霜", "冰霜"],
    ["cold damage", "冰霜伤害", "冰霜傷害"],
    ["cold-infused", "冰霜灌注", "冰霜灌注"],
    ["color", "颜色", "顏色"],
    ["colour", "颜色", "顏色"],
    ["combo", "连击", "連擊"],
    ["command", "指令", "指令"],
    ["commands", "指令", "指令"],
    ["companion", "同伴", "同伴"],
    ["companions", "同伴", "同伴"],
    ["condition", "条件", "條件"],
    ["conditional", "条件", "條件"],
    ["confidence", "置信度", "信心度"],
    ["consume", "消耗", "消耗"],
    ["consumes", "消耗", "消耗"],
    ["consumption", "吞噬", "吞噬"],
    ["conversion", "转换", "轉換"],
    ["converted", "已转换", "已轉換"],
    ["converts", "转换", "轉換"],
    ["cooldown", "冷却", "冷卻"],
    ["cooldown recovery rate", "冷却回复速度", "冷卻回復速度"],
    ["cooldown time", "冷却时间", "冷卻時間"],
    ["cooldowns recover", "冷却回复", "冷卻回復"],
    ["copy", "复制", "複製"],
    ["corrupted", "已腐化", "已腐化"],
    ["cost", "消耗", "消耗"],
    ["cost multiplier", "消耗倍率", "消耗倍率"],
    ["crafted", "工艺", "工藝"],
    ["crit", "暴击", "暴擊"],
    ["critical", "暴击", "暴擊"],
    ["critical damage bonus", "暴击伤害加成", "暴擊傷害加成"],
    ["critical hit", "暴击", "暴擊"],
    ["critical hit chance", "暴击率", "暴擊率"],
    ["critically hit", "暴击", "暴擊"],
    ["critically hitting", "暴击时", "暴擊時"],
    ["crossbow", "十字弓", "十字弓"],
    ["crossbows", "十字弓", "十字弓"],
    ["currency", "通货", "通貨"],
    ["curse", "诅咒", "詛咒"],
    ["daggers", "匕首", "匕首"],
    ["damage", "伤害", "傷害"],
    ["damage while moving", "移动时伤害", "移動時傷害"],
    ["dancer", "舞者", "舞者"],
    ["dealing", "造成", "造成"],
    ["dealt", "造成的伤害", "造成的傷害"],
    ["debuff", "减益", "減益"],
    ["decreased", "降低", "降低"],
    ["defensive", "防御", "防禦"],
    ["deflect", "偏转", "偏轉"],
    ["deflected", "偏斜", "偏斜"],
    ["deflection", "偏转", "偏轉"],
    ["demolisher", "破甲者", "破甲者"],
    ["detonator", "引爆", "引爆"],
    ["dexterity", "敏捷", "敏捷"],
    ["disable", "停用", "停用"],
    ["divine value", "神圣石价值", "神聖石價值"],
    ["djinn", "巨灵", "巨靈"],
    ["dodge", "躲避", "躲避"],
    ["does not", "不会", "不會"],
    ["dps", "每秒伤害", "每秒傷害"],
    ["duration", "持续时间", "持續時間"],
    ["during", "期间", "期間"],
    ["each", "每个", "每個"],
    ["effect", "效果", "效果"],
    ["effective", "有效", "有效"],
    ["efficiency", "效率", "效率"],
    ["electrocute", "电击", "電擊"],
    ["electrocutes", "电击", "電擊"],
    ["electrocuting", "电击", "電擊"],
    ["elemental", "元素", "元素"],
    ["elemental damage", "元素伤害", "元素傷害"],
    ["elemental resistances", "元素抗性", "元素抗性"],
    ["embrace", "拥抱", "擁抱"],
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
    ["every", "每个", "每個"],
    ["expected", "预期", "預期"],
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
    ["fire", "发射", "發射"],
    ["fire damage", "火焰伤害", "火焰傷害"],
    ["fires", "发射", "發射"],
    ["flails", "连枷", "連枷"],
    ["flask", "药剂", "藥劑"],
    ["flask charges gained", "获得的药剂充能", "獲得的藥劑充能"],
    ["flow", "流动", "流動"],
    ["flow state", "流动状态", "流動狀態"],
    ["for", "持续", "持續"],
    ["found", "找到", "找到"],
    ["fractured", "碎裂", "碎裂"],
    ["freeze", "冰冻", "冰凍"],
    ["freeze buildup", "冰冻积蓄", "冰凍積蓄"],
    ["freezes", "冰冻", "冰凍"],
    ["freezing", "冰冻", "冰凍"],
    ["frenzy charge", "狂怒球", "狂怒球"],
    ["from", "来自", "來自"],
    ["frost", "冰霜", "冰霜"],
    ["fully break", "完全破坏", "完全破壞"],
    ["gain", "获得", "獲得"],
    ["gale force", "疾风之力", "疾風之力"],
    ["gem", "宝石", "寶石"],
    ["gem level", "宝石等级", "寶石等級"],
    ["gems", "宝石", "寶石"],
    ["generating", "生成", "生成"],
    ["generating a", "生成一个", "生成一個"],
    ["ghost shroud", "幽灵帷幕", "幽靈帷幕"],
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
    ["heals", "治疗", "治療"],
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
    ["infused", "灌注", "灌注"],
    ["intelligence", "智慧", "智慧"],
    ["inverted", "反转", "反轉"],
    ["invocation", "祈唤", "祈喚"],
    ["invulnerable", "无敌", "無敵"],
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
    ["leave a", "留下一片", "留下一片"],
    ["leech", "偷取", "偷取"],
    ["less", "更少", "更少"],
    ["level", "等级", "等級"],
    ["level of all", "所有……等级", "所有……等級"],
    ["level requirement", "等级需求", "等級需求"],
    ["level:", "等级：", "等級："],
    ["levels from gem", "来自宝石的等级", "來自寶石的等級"],
    ["life", "生命", "生命"],
    ["lightning", "闪电", "閃電"],
    ["lightning damage", "闪电伤害", "閃電傷害"],
    ["lineage", "血统", "血統"],
    ["listings", "挂单数", "掛單數"],
    ["loading", "加载中", "載入中"],
    ["lose", "失去", "失去"],
    ["lose a", "失去一个", "失去一個"],
    ["maces", "锤", "錘"],
    ["magic", "魔法", "魔法"],
    ["magnitude", "效果", "效果"],
    ["main hand", "主手", "主手"],
    ["mana", "魔力", "魔力"],
    ["mark", "印记", "印記"],
    ["marked", "被标记", "被標記"],
    ["marks", "印记", "印記"],
    ["martial", "军械", "軍械"],
    ["mastery", "精通", "精通"],
    ["max", "最大", "最大"],
    ["maximum", "最高", "最高"],
    ["maximum life", "最大生命", "最大生命"],
    ["melee", "近战", "近戰"],
    ["merging", "融合", "融合"],
    ["meta", "元", "元"],
    ["metre", "米", "公尺"],
    ["metres", "米", "米"],
    ["min", "最小", "最小"],
    ["mindful", "正念", "正念"],
    ["minimum", "最低", "最低"],
    ["minion", "召唤生物", "召喚生物"],
    ["minions", "召唤生物", "召喚生物"],
    ["mirage", "幻影", "幻影"],
    ["mitigation", "减伤", "減傷"],
    ["modifier", "词缀", "詞綴"],
    ["modifiers", "词缀", "詞綴"],
    ["more", "更多", "更多"],
    ["more damage", "更多伤害", "更多傷害"],
    ["most", "最", "最"],
    ["most numerous", "数量最多", "數量最多"],
    ["mote", "微粒", "微粒"],
    ["movement speed", "移动速度", "移動速度"],
    ["moving", "移动中", "移動中"],
    ["multiple", "多个", "多個"],
    ["muster", "集结", "集結"],
    ["nearby", "附近", "附近"],
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
    ["of the damage", "的伤害", "的傷害"],
    ["of you and", "你和", "你和"],
    ["off hand", "副手", "副手"],
    ["offensive", "攻击", "攻擊"],
    ["offerings", "供品", "供品"],
    ["offhand", "副手", "副手"],
    ["on dealing", "造成……时", "造成……時"],
    ["on use", "使用时", "使用時"],
    ["on you", "在你身上", "在你身上"],
    ["orb", "法球", "法球"],
    ["other", "其他", "其他"],
    ["outside", "外部", "外部"],
    ["parry", "招架", "招架"],
    ["passive", "天赋", "天賦"],
    ["passives", "天赋", "天賦"],
    ["payoff", "收割", "收割"],
    ["penalty", "惩罚", "懲罰"],
    ["penetrates", "穿透", "穿透"],
    ["penetration", "穿透", "穿透"],
    ["per", "每", "每"],
    ["per second", "每秒", "每秒"],
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
    ["quarterstaves", "长杖", "長杖"],
    ["quest", "任务", "任務"],
    ["quiver", "箭袋", "箭袋"],
    ["radius", "半径", "半徑"],
    ["radius is", "半径为", "半徑為"],
    ["rage", "怒气", "怒氣"],
    ["rare", "稀有", "稀有"],
    ["rating", "值", "值"],
    ["recharge", "回复", "回復"],
    ["recouped", "回收", "回收"],
    ["recover", "回复", "回復"],
    ["recovers", "回复", "回復"],
    ["recovery", "回复", "回復"],
    ["reduced", "减少", "減少"],
    ["refresh", "刷新", "重新整理"],
    ["regen", "回复", "回復"],
    ["regenerate", "再生", "再生"],
    ["regeneration", "回复", "回復"],
    ["relic", "遗物", "遺物"],
    ["remnant", "残迹", "殘跡"],
    ["repeat", "重复", "重複"],
    ["repeatable", "可重复", "可重複"],
    ["requirement", "需求", "需求"],
    ["requirements", "需求", "需求"],
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
    ["runeforged", "符文锻造", "符文鍛造"],
    ["runes", "符文", "符文"],
    ["seal", "封印", "封印"],
    ["sealing", "封印", "封印"],
    ["search", "搜索", "搜尋"],
    ["seconds", "秒", "秒"],
    ["secured", "加固", "加固"],
    ["settings", "设置", "設定"],
    ["shapeshift", "变形", "變形"],
    ["shatter", "碎裂", "碎裂"],
    ["shattering", "碎裂", "碎裂"],
    ["shield", "盾牌", "盾牌"],
    ["shield bubble", "气泡护盾", "氣泡護盾"],
    ["shock", "感电", "感電"],
    ["shock magnitude", "感电效果", "感電效果"],
    ["shocked", "感电", "感電"],
    ["shocks", "感电", "感電"],
    ["show", "显示", "顯示"],
    ["single", "单", "單"],
    ["single-", "单", "單"],
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
    ["spears", "长矛", "長矛"],
    ["speed", "速度", "速度"],
    ["spell damage", "法术伤害", "法術傷害"],
    ["spells", "法术", "法術"],
    ["spirit", "精魂", "精魂"],
    ["spirit gem", "精魂宝石", "精魂寶石"],
    ["spirit gems", "精魂宝石", "精魂寶石"],
    ["stack size", "堆叠数量", "堆疊數量"],
    ["staff", "法杖", "法杖"],
    ["stage", "阶段", "階段"],
    ["staged", "分阶段", "分階段"],
    ["stages", "阶段", "階段"],
    ["state", "状态", "狀態"],
    ["stats", "属性", "屬性"],
    ["staves", "长杖", "長杖"],
    ["storm", "风暴", "風暴"],
    ["strength", "力量", "力量"],
    ["strike", "打击", "打擊"],
    ["stun", "眩晕", "眩暈"],
    ["stun threshold", "眩晕门槛", "眩暈門檻"],
    ["subterfuge", "诡诈", "詭詐"],
    ["summon", "召唤", "召喚"],
    ["summons", "召唤", "召喚"],
    ["support", "辅助", "輔助"],
    ["support gem", "辅助宝石", "輔助寶石"],
    ["supports", "辅助", "輔助"],
    ["sustained", "持续型", "持續型"],
    ["swords", "剑", "劍"],
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
    ["twice", "两次", "兩次"],
    ["two-handed", "双手", "雙手"],
    ["twofold", "双重", "雙重"],
    ["unique", "传奇", "傳奇"],
    ["value", "价值", "價值"],
    ["values as inverted", "数值反转", "數值反轉"],
    ["virtue", "美德", "美德"],
    ["vitality", "活力", "活力"],
    ["wand", "法杖", "法杖"],
    ["wands", "短杖", "短杖"],
    ["warcries", "战吼", "戰吼"],
    ["warcry", "战吼", "戰吼"],
    ["ward", "结界", "結界"],
    ["water djinn", "水之巨灵", "水之巨靈"],
    ["waystone", "引路石", "引路石"],
    ["weapon", "武器", "武器"],
    ["wells", "水井", "水井"],
    ["werewolf", "狼人", "狼人"],
    ["when", "当", "當"],
    ["when it", "当它", "當它"],
    ["when you kill a", "当你击杀一个", "當你擊殺一個"],
    ["which", "其", "其"],
    ["which can be boosted by", "可被以下加成", "可被以下加成"],
    ["while", "当……时", "當……時"],
    ["while active", "激活期间", "啟用期間"],
    ["while active,", "激活期间，", "啟用期間，"],
    ["whirlwind", "旋风", "旋風"],
    ["whirlwinds", "旋风", "旋風"],
    ["will have their", "将使其", "將使其"],
    ["wind", "风", "風"],
    ["with", "与", "與"],
    ["wraps", "护腕", "護腕"],
    ["wyvern", "飞龙", "飛龍"],
    ["you", "你", "你"],
    ["your", "你的", "你的"]
  ];
  /* INLINE_TERMS:END */

  /* INLINE_GEMS:BEGIN */
const INLINE_GEMS = [
    ["Abiding Hex", "恒远魔蛊", "永久咒術"],
    ["Abyssal Pact", "深渊契约", "深淵冥約"],
    ["Accelerated Growth II", "迅猛绽放II", "飛速生長II"],
    ["Acidic Concoction", "酸性灵药", "酸性靈藥"],
    ["Acrimony", "尖刻", "毒辣"],
    ["Adhesive Grenades I", "胶粘榴弹 I", "黏性擲彈 I"],
    ["Adhesive Grenades II", "相性 II", "相性 II"],
    ["Admixture", "混合物", "混合物"],
    ["Advancing Storm", "风暴行军", "推進風暴"],
    ["Affliction III", "极速腐化 III", "極速苦痛 III"],
    ["Aftershock I", "护甲破损 I", "護甲破損 I"],
    ["Aftershock II", "余震 II", "餘震 II"],
    ["Agony", "剧烈痛苦", "劇烈苦痛"],
    ["Alchemist's Boon", "炼金师的恩典", "煉金師恩惠"],
    ["Align Fate", "命运同调", "命運同調"],
    ["Alignment II", "能量球激增 II", "能量球激增 II"],
    ["Alignment III", "相性 III", "聯合 III"],
    ["Amanamu's Tithe", "阿曼娜姆的奉纳", "阿姆那姆的稅賦"],
    ["Ambrosia", "仙馔", "仙饌蜜酒"],
    ["Ambrosia II", "仙馔 II", "仙饌蜜酒 II"],
    ["Ambush", "伏击", "伏擊"],
    ["Ammo Conservation I", "节省弹药 I", "彈藥保存 I"],
    ["Ammo Conservation II", "丰饶 II", "豐饒 II"],
    ["Ammo Conservation III", "节省弹药 III", "彈藥保存 III"],
    ["Ancestral Call I", "先祖召唤 I", "先祖怒嚎 I"],
    ["Ancestral Call II", "先祖召唤 II", "先祖召喚 II"],
    ["Ancestral Cry", "先祖战吼", "先祖戰吼"],
    ["Ancestral Spirits", "先祖之灵", "先祖之魂"],
    ["Ancestral Warrior Totem", "先祖战士图腾", "先祖戰士圖騰"],
    ["Animus Exchange", "命源交换", "意志轉換"],
    ["Animus Splinters", "命源碎片", "意志斷片"],
    ["AoE, Fire Jagged Ground II", "炎军 II", "煉獄軍團 II"],
    ["AoE, Trigger, Fire Fire Penetration I", "煽风点火", "灼炎扇舞I"],
    ["Apocalypse", "天灾", "壞滅災變"],
    ["Arakaali's Lust", "阿拉卡力的欲望", "阿拉卡力的欲望"],
    ["Arbiter's Ignition", "仲裁官的点燃", "仲裁者的燃灼"],
    ["Arc", "电弧", "電弧"],
    ["Archmage", "大法师", "大法師"],
    ["Archon of Chayula", "夏乌拉执政官", "夏烏拉統治者"],
    ["Arctic Armour", "极地装甲", "極地裝甲"],
    ["Arctic Howl", "极地战嚎", "極地戰嚎"],
    ["Area II", "范围扩大 II", "增幅光環 II"],
    ["Arjun's Medal", "阿尔琼的勋章", "阿爾瓊的勳章"],
    ["Armament I", "元素军械 I", "元素武裝 I"],
    ["Armour Break III", "护甲破损 III", "護甲破壞 III"],
    ["Armour Breaker", "摧甲重击", "護甲碎擊"],
    ["Armour Demolisher I", "护甲破坏者 I", "護甲破壞者 I"],
    ["Armour Piercing Rounds", "贯甲弹药", "貫甲彈藥"],
    ["Artillery Ballista", "火力弩炮", "火力弩炮"],
    ["Atalui's Bloodletting", "阿图鲁伊的放血术", "阿特路伊的出血"],
    ["Attack, AoE, Melee, Trigger, Fire, Duration Defy I", "陨坑", "隕石坑"],
    ["Attack, Melee Cannibalism I", "崩溃边缘 II", "邊緣 II"],
    ["Attack, Melee Rageforged II", "狂怒 III", "盛怒 III"],
    ["Attack, Melee Rearm I", "灵体齐射", "靈體齊射"],
    ["Attack, Melee, Strike Behead II", "荆棘倒刺 I", "倒刺 I"],
    ["Attack, Melee, Strike, Conditional Cooldown Recovery I", "终结 I", "撲殺 I"],
    ["Attack, Minion, Melee, Strike Persistent Ground III", "召唤生物溅射伤害 II", "召喚物擴散II"],
    ["Attack, Projectile Ammo Conservation II", "节省弹药 II", "節省彈藥 II"],
    ["Attack, Projectile Close Combat I", "受控危技", "危險抑制"],
    ["Attrition", "持久鏖战", "持久鏖戰"],
    ["Atziri's Allure", "阿兹里的魅惑", "阿茲里的魅惑"],
    ["Atziri's Call", "阿兹里的呼唤", "阿茲里的呼喚"],
    ["Atziri's Communion", "阿兹里的圣礼", "阿茲里的共融"],
    ["Atziri's Impatience", "阿兹里的焦躁", "阿茲裏的焦躁"],
    ["Auto Reload", "自动装填", "自動裝填"],
    ["Axe Slash", "斧挥砍", "斧鉞斬"],
    ["Azmerian Swarms", "阿兹莫里虫群", "阿茲莫裏蟲羣"],
    ["Azmerian Wolf", "阿兹莫里巨狼", "阿茲莫里巨狼"],
    ["Ball Lightning", "天雷之珠", "天雷之珠"],
    ["Barbs II", "荆棘倒刺 II", "荊棘倒刺 II"],
    ["Barbs III", "荆棘倒刺 III", "荊棘倒刺 III"],
    ["Barkskin", "树肤术", "木質外膚"],
    ["Barrage", "弹幕", "彈幕"],
    ["Barrier Invocation", "屏障咒言", "屏障祈願"],
    ["Battershout", "震撼战吼", "震撼戰吼"],
    ["Behead II", "流血 II", "流血 II"],
    ["Berserk", "盛怒", "狂戰"],
    ["Bhatair's Vengeance", "巴蒂尔的复仇", "瓦特爾的復仇"],
    ["Bidding III", "奉命 III", "奉命 III"],
    ["Bind Spectre", "束缚灵体", "束縛靈體"],
    ["Bite I", "霜咬 I", "霜咬 I"],
    ["Biting Frost II", "刺骨寒意 II", "刺骨寒意 II"],
    ["Bitter Dead", "苦涩死亡", "苦澀衰亡"],
    ["Black Powder Blitz", "黑火药闪击", "黑火藥閃擊"],
    ["Blasphemy", "诅咒光环", "詛咒光環"],
    ["Blazing Critical", "炽烈绝杀", "燃焰暴擊"],
    ["Bleed I", "崩溃边缘 I", "崩潰邊緣 I"],
    ["Bleed II", "斩首 II", "斬首 II"],
    ["Bleed IV", "流血 IV", "流血 IV"],
    ["Bleeding Concoction", "创伤灵药", "流血混合物"],
    ["Blind I", "致盲 I", "致盲 I"],
    ["Blind II", "致盲 II", "致盲 II"],
    ["Blindside", "盲点", "盲點"],
    ["Blink", "闪现", "閃現"],
    ["Blood Boil", "血沸", "血沸"],
    ["Blood Hunt", "猎血寻腥", "鮮血狩獵"],
    ["Bloodhound's Mark", "血犬印记", "鮮血獵犬印記"],
    ["Bloodlust", "血怒", "嗜血"],
    ["Bone Blast", "针刺爆发", "骨之爆破"],
    ["Bone Cage", "画地为牢", "畫地爲牢"],
    ["Bone Offering", "装甲奉献", "裝甲奉獻"],
    ["Bone Shrapnel", "钙质碎片", "骨片"],
    ["Boneshatter", "七伤破", "碎骨"],
    ["Bonestorm", "尖刺风暴", "尖刺風暴"],
    ["Boundless Energy I", "无边能量 I", "無盡能量 I"],
    ["Boundless Energy II", "无边能量 II", "無盡能量 II"],
    ["Bounty", "魔力丰沛", "魔力恩惠"],
    ["Bounty II", "丰饶 II", "豐饒 II"],
    ["Bow Shot", "弓射击", "弓箭射擊"],
    ["Brambleslam", "遍地荆棘", "遍地荊棘"],
    ["Branching Fissures I", "崩溃边缘 I", "崩潰邊緣 I"],
    ["Branching Fissures II", "分叉裂缝 II", "分岔裂縫 II"],
    ["Breachlord's Amalgam", "裂隙领主的融合体", "裂隙領主的融合體"],
    ["Briarpatch", "荆刺之缚", "荊刺之縛"],
    ["Brink I", "崩溃边缘 I", "崩潰邊緣 I"],
    ["Brittle Armour", "脆弱护甲", "易碎鎧甲"],
    ["Brutality I", "野性残暴 I", "野性殘暴 I"],
    ["Brutus' Brain", "布鲁特斯之脑", "布魯特斯的腦"],
    ["Buff Infernal Legion III", "炎军 III", "煉獄軍團 III"],
    ["Buff, Persistent Aftershock I", "活力 I", "活力 I"],
    ["Buff, Persistent Reinforced Totems II", "折射 III", "折射 III"],
    ["Buff, Persistent Urgent Totems I", "荆棘皮肤 I", "荊棘之皮 I"],
    ["Burgeon I", "迅猛增幅 I", "萌發 I"],
    ["Burning Inscription", "燃烧铭文", "爆燃銘文"],
    ["Bursting Fen Toad", "爆裂沼蟾", "爆發沼地蟾蜍"],
    ["Bursting Plague", "迸发之疫", "迸發之疫"],
    ["Cackling Companions", "鬣狗同伴", "奸笑鬣狗群"],
    ["Cadence", "节律", "節律"],
    ["Called Shots", "言出箭随", "預告射擊"],
    ["Caltrops", "节省弹药 II", "彈藥保存 II"],
    ["Cannibalism II", "吞灵 II", "食人 II"],
    ["Capacitor", "能量电容", "儲能"],
    ["Cast on Block", "格挡时施放", "格擋時施放"],
    ["Cast on Charm Use", "使用咒符时施放", "使用護符時施放"],
    ["Cast on Critical", "暴击时施放", "暴擊時施放"],
    ["Cast on Dodge", "躲闪时施放", "閃避時施放"],
    ["Cast on Elemental Ailment", "元素异常状态时施放", "元素異常狀態時施放"],
    ["Cast on Freeze", "冻结时施放", "冰凍時施放"],
    ["Cast on Ignite", "点燃时施放", "點燃時施放"],
    ["Cast on Minion Death", "召唤生物死亡时施放", "召喚生物死亡時施放"],
    ["Cast on Shock", "感电时施放", "感電時施放"],
    ["Catalysing Elements", "元素催化", "催化元素"],
    ["Catha's Brilliance", "卡莎的光辉", "卡莎的光輝"],
    ["Catharsis", "泄除", "宣洩"],
    ["Channelling Ahn's Citadel", "吟唱汉恩的城塞", "漢恩的城塞"],
    ["Channelling, Staged Searing Flame I", "致命决心", "致命決心"],
    ["Chaos Attunement", "混沌协调", "混沌同調"],
    ["Chaos Bolt", "混沌箭", "混沌弩箭"],
    ["Chaos Mastery", "混沌专精", "混沌專精"],
    ["Chaos Practiced Combo", "精准 II", "精準 II"],
    ["Chaotic Freeze", "混沌冻结", "混沌冰凍"],
    ["Chaotic Surge", "混沌涌动", "混沌波動"],
    ["Charge Profusion I", "能量球激增 I", "能量球激增 I"],
    ["Charge Profusion II", "能量球激增 II", "能量球激增 II"],
    ["Charge Regulation", "能量球调节", "充能調節"],
    ["Charged Shots II", "充能射击 II", "充能射擊 II"],
    ["Charged Staff", "充能杖", "充能杖"],
    ["Chimes", "辅助艾利丝钟琴", "輔助艾利絲鐘琴"],
    ["Cirel's Cultivation", "西雷尔的教化", "西瑞爾的耕植"],
    ["Clarity I", "清晰 I", "清晰 I"],
    ["Clarity II", "清晰 II", "清晰 II"],
    ["Clash", "吞灵 I", "食人 I"],
    ["Claw Stab", "爪突刺", "爪突刺"],
    ["Close Combat I", "连击终结 I", "連擊終結 I"],
    ["Close Combat II", "终结 II", "終結 II"],
    ["Cluster Grenade", "集束榴弹", "集束榴彈"],
    ["Coiling Bolts", "盘绕魔弹", "寂纏彈"],
    ["Cold Attunement", "冰霜协调", "冰冷同調"],
    ["Cold Exposure", "冰霜曝露", "冰冷曝曬"],
    ["Cold Mastery", "冰霜专精", "冰冷專精"],
    ["Cold Penetration", "冰霜穿透", "冰冷穿透"],
    ["Combat Frenzy", "战斗狂怒", "戰鬥狂怒"],
    ["Combo Finisher II", "冷却回复 II", "冷卻時間恢復 II"],
    ["Comet", "彗星落", "彗星"],
    ["Commandment", "调遣", "誡命"],
    ["Commiserate", "以己度人", "憐憫"],
    ["Compressed Duration I", "持续时间压缩 I", "縮短持續時間 I"],
    ["Compressed Duration II", "形势逆转", "交鋒"],
    ["Concentrated Area", "范围集中", "集中範圍"],
    ["Concoct II", "调和术 II", "調製 II"],
    ["Concussive Runes", "震荡符文", "震蕩符文"],
    ["Concussive Spells", "冲击法术", "震盪法術"],
    ["Conductive Runes", "导电符文", "傳導符文"],
    ["Conductivity", "导电", "導電"],
    ["Consecrate", "奉献", "奉獻"],
    ["Considered Casting", "审慎施法", "細思施法"],
    ["Contagion", "瘟疫", "瘟疫"],
    ["Controlled Destruction", "精准破坏", "精準破壞"],
    ["Convalescence", "康复", "恢復期"],
    ["Cool Headed", "冷静头脑", "冷靜頭腦"],
    ["Cooldown Recovery I", "登峰造极 I", "登峯造極 I"],
    ["Cooldown Recovery II", "冷却回复 II", "冷卻回復 II"],
    ["Corpse Conservation", "灵柩留存", "屍體保存"],
    ["Corrosion", "腐蚀", "衰敗"],
    ["Corrupting Cry II", "腐化战吼 II", "腐化戰吼 II"],
    ["Coursing Current", "奔雷疾走", "雷鳴湍流"],
    ["Crackling Barrier", "霹雳屏障", "電流屏障"],
    ["Crackling Palm", "霹雳掌", "霹靂掌"],
    ["Crater", "调和术 I", "調製 I"],
    ["Crazed Minions", "癫狂召唤生物", "發狂召喚物"],
    ["Creeping Chill", "蔓延霜寒", "寒冰蔓延"],
    ["Crescendo I", "渐入佳境 I", "逐漸增強 I"],
    ["Crescendo II", "渐入佳境 II", "逐漸增強 II"],
    ["Crescendo III", "渐入佳境 III", "逐漸增強 III"],
    ["Critical I", "命定绝杀 I", "無情暴擊 I"],
    ["Cross Slash", "双爪劈击", "雙爪劈擊"],
    ["Crossbow Shot", "战弩射击", "戰弩射擊"],
    ["Crushing Fear", "恐惧终结", "死懼碎擊"],
    ["Cry", "持久地面 I", "暴露戰吼"],
    ["Crystalline Shards", "水晶碎片", "結晶碎片"],
    ["Cull The Weak", "终结弱者", "撲殺弱者"],
    ["Culling Strike II", "终结 II", "終結 II"],
    ["Culmination II", "登峰造极 II", "登峯造極 II"],
    ["Curse", "强效诅咒", "增強詛咒"],
    ["Dagger Stab", "匕首突刺", "匕首刺擊"],
    ["Danse Macabre", "死亡之舞", "骷髏之舞"],
    ["Daresso's Passion", "德瑞索的热情", "德瑞索的熱情"],
    ["Dark Effigy", "黑暗塑像", "黑暗塑像"],
    ["Dark Pact", "暗夜契约", "暗夜血契"],
    ["Dauntless", "不动如山", "不動如山"],
    ["Deadly Herald", "致命之捷", "致命之捷"],
    ["Deadly Poison II", "致命毒素 II", "致命毒素 II"],
    ["Deadly Resolve", "致命决心", "致命決心"],
    ["Death", "生命偷取 I", "生命偷取 I"],
    ["Deathmarch", "终末行军", "死亡行進"],
    ["Decaying Hex", "衰颓魔蛊", "腐朽咒術"],
    ["Decompose", "降解", "降解"],
    ["Deep Cuts I", "战争铁拳 I", "戰爭鐵拳 I"],
    ["Deep Cuts II", "凌迟 II", "凌遲 II"],
    ["Deep Freeze", "深度冻结", "深度冰凍"],
    ["Defiance Banner", "抗争战旗", "反抗之旗"],
    ["Defy I", "蛮勇打击 I", "蠻勇打擊 I"],
    ["Defy II", "顽抗 II", "頑抗 II"],
    ["Delayed Gratification", "延迟满足", "延遲滿足感"],
    ["Delayed Reaction", "延迟激活", "延遲激活"],
    ["Deliberation", "连打带跑", "打帶跑"],
    ["Demon Form", "走火入魔", "惡魔變身"],
    ["Derange", "错乱", "精神錯亂"],
    ["Descent", "势大力沉", "分量"],
    ["Despair", "绝望", "絕望"],
    ["Detonate Dead", "爆灵术", "爆靈術"],
    ["Detonate Living", "活体引爆", "活體引爆"],
    ["Detonating Arrow", "爆破箭", "爆破箭矢"],
    ["Devour", "吞噬", "吞噬"],
    ["Dialla's Desire", "达拉的渴望", "達拉的渴望"],
    ["Direstrike I", "双管齐下 I", "雙管齊下 I"],
    ["Direstrike II", "蛮勇打击 II", "極惡打擊 II"],
    ["Discipline", "纪律", "紀律"],
    ["Disengage", "退避三舍", "脫離戰鬥"],
    ["Doedre's Undoing", "德瑞的毁灭", "德瑞的毀滅"],
    ["Dominus' Grasp", "神主之握", "神主的掌握"],
    ["Double Barrel I", "双管齐下 I", "雙管 I"],
    ["Double Barrel II", "元素军械 II", "元素軍械 II"],
    ["Double Barrel III", "顽抗 II", "頑抗 II"],
    ["Drain", "敏捷装填", "敏捷裝填"],
    ["Drain Ailments", "异常状态吸收", "汲取異常狀態"],
    ["Dread Banner", "恐怖战旗", "恐怖戰旗"],
    ["Dreamer's Knell", "幻梦者的丧钟", "幻夢者的喪鐘"],
    ["Durability", "耐久度", "耐久"],
    ["Duration Bursting Plague", "齐射", "齊射"],
    ["Duration I", "持续时间延长 I", "延長持續時間 I"],
    ["Duration II", "持续时间延长 II", "延長持續時間 II"],
    ["Duration Ignite III", "神圣降临", "神聖血統"],
    ["Duration Stormfire", "风暴之炎", "烈風暴"],
    ["Earthquake", "震地", "震地"],
    ["Earthshatter", "尖刺战吼", "碎地重擊"],
    ["Echoing Cry", "回荡战嚎", "迴響戰吼"],
    ["Efficiency I", "效能 I", "效率 I"],
    ["Efficiency II", "效能 II", "效率 II"],
    ["Einhar's Beastrite", "伊恩哈尔的魔物仪式", "埃哈的野獸儀式"],
    ["Electrocute", "触电", "電刑"],
    ["Electrocuting Arrow", "电殛箭", "電極箭矢"],
    ["Electromagnetism", "电磁力场", "磁化電極"],
    ["Elemental Armament II", "双管齐下 II", "雙管 II"],
    ["Elemental Armament III", "燃怒战吼 III", "燃怒戰吼 III"],
    ["Elemental Army", "元素大军", "元素軍隊"],
    ["Elemental Conflux", "元素汇流", "元素匯流"],
    ["Elemental Discharge", "元素解放", "元素解放"],
    ["Elemental Expression", "元素表现", "元素表現"],
    ["Elemental Focus", "元素集中", "元素專注"],
    ["Elemental Invocation", "元素祈求", "元素祈願"],
    ["Elemental Storm", "元素风暴", "元素風暴"],
    ["Elemental Sundering", "元素碎裂", "元素崩裂"],
    ["Elemental Surge", "元素涌动", "元素波動"],
    ["Elemental Weakness", "元素要害", "元素要害"],
    ["Ember Fusillade", "灰烬连射", "灰燼連射"],
    ["Embitter", "苦寒之意", "激怒"],
    ["Emergency Reload", "紧急装填", "緊急裝填"],
    ["Empowered Sparks I", "强化火花 I", "強化電球I"],
    ["Encase in Jade", "青玉囚笼", "包覆於翠玉中"],
    ["Encroaching Ground", "侵蚀地面", "進逼地面"],
    ["Enduring Impact I", "持续冲击 I", "堅忍衝擊 I"],
    ["Enduring Impact II", "持续冲击 II", "堅忍衝擊 II"],
    ["Enervating Nova", "衰颓新星", "超能新星"],
    ["Enfeeble", "衰弱", "衰弱"],
    ["Enraged Warcry II", "处决 II", "處決 II"],
    ["Entangle", "纠缠", "糾纏"],
    ["Eruption", "先锋 II", "無懼先鋒 II"],
    ["Escalating Poison", "毒性加剧", "遞增之毒"],
    ["Escape Shot", "逃脱射击", "逃脫之矢"],
    ["Esh's Prowess", "艾许的骁勇", "艾許的驍勇"],
    ["Esh's Radiance", "艾许的光辉", "艾許的光芒"],
    ["Essence Drain", "精华吸取", "靈魂吸取"],
    ["Essence Harvest", "收割精华", "精髓收割"],
    ["Eternal Flame II", "长明烈焰 II", "長明烈焰 II"],
    ["Eternal Flame III", "长明烈焰 III", "永恆烈焰 III"],
    ["Eternal March", "永恒行军", "永恆行軍"],
    ["Eternal Mark", "永恒印记", "永恆印記"],
    ["Eternal Rage", "永恒狂怒", "無盡怒火"],
    ["Excise", "净除", "切除"],
    ["Execrate", "怨恨", "咒怨"],
    ["Execute I", "处决 I", "處刑 I"],
    ["Execute II", "处决 II", "處刑 II"],
    ["Execute III", "燃怒战吼 II", "激怒戰吼 II"],
    ["Expand", "扩展", "擴展"],
    ["Expanse", "开疆", "廣闊區域"],
    ["Exploit Weakness", "开发要害", "開發要害"],
    ["Explosion", "护甲爆破", "護甲爆破"],
    ["Explosive Concoction", "爆破灵药", "爆裂物"],
    ["Explosive Grenade", "高爆榴弹", "高爆榴彈"],
    ["Explosive Shot", "爆炸射击", "爆炸射擊"],
    ["Explosive Spear", "爆破战矛", "爆炸長矛"],
    ["Explosive Transmutation", "烈性转化", "爆炸轉化"],
    ["Exposure", "闪电曝露", "強力曝曬"],
    ["Exsanguinate", "赤炼魔光", "抽血"],
    ["Extraction", "萃取", "提取"],
    ["Eye of Winter", "凛冬之眼", "凜冬之眼"],
    ["Falling Thunder", "霹雳闪", "霹靂閃"],
    ["Fan The Flames", "开发要害", "攻其之弱"],
    ["Fan The Flames II", "煽风点火II", "灼炎扇舞II"],
    ["Fangs of Frost", "刺骨寒冰", "刺骨寒冰"],
    ["Feast of Flesh", "血肉盛宴", "血肉盛宴"],
    ["Feeding Frenzy I", "狂噬 I", "豢養狂熱 I"],
    ["Feeding Frenzy II", "狂噬 II", "豢養狂熱 II"],
    ["Feral Invocation", "野性召唤", "野性召喚"],
    ["Ferocious Roar", "凶蛮咆哮", "兇蠻咆哮"],
    ["Ferocity", "狂暴", "狂暴"],
    ["Fiery Death", "炽灭", "火熱死寂"],
    ["Finisher I", "连击终结 I", "連擊終結輔助 I"],
    ["Fire Attunement", "火焰协调", "火焰同調"],
    ["Fire Exposure", "火焰曝露", "火焰曝曬"],
    ["Fire Fist of War III", "火焰穿透 II", "火焰穿透 II"],
    ["Fire Jagged Ground I", "炎军 I", "煉獄軍團 I"],
    ["Fire Mastery", "火焰专精", "火焰專精"],
    ["Fire Penetration I", "新装箭匣 I", "新裝箭匣 I"],
    ["Fire Spell on Hit", "击中时火焰法术", "擊中時火焰法術"],
    ["Fireball", "火球", "火球"],
    ["Firebolt", "火焰弹", "火彈"],
    ["Firestorm", "烈炎风暴", "烈炎風暴"],
    ["Fist Of Kalguur", "卡古兰之拳", "卡古蘭之拳"],
    ["Fist of War II", "战争铁拳 II", "戰爭鐵拳 II"],
    ["Flail Strike", "连枷打击", "連枷打擊"],
    ["Flame Breath", "龙炎吐息", "龍炎吐息"],
    ["Flame I", "长明烈焰 I", "永恆烈焰 I"],
    ["Flame II", "焚躯烈焰 II", "燒灼烈焰 II"],
    ["Flame Wall", "烈焰之墙", "烈焰之牆"],
    ["Flameblast", "烈焰爆破", "烈焰爆破"],
    ["Flamepierce", "烈焰穿刺", "烈焰穿透"],
    ["Flammability", "易燃", "易燃"],
    ["Flash Grenade", "闪光榴弹", "閃光榴彈"],
    ["Flicker Strike", "闪现打击", "閃現打擊"],
    ["Fluke", "运势", "僥倖"],
    ["Focused Curse", "聚焦诅咒", "專注詛咒"],
    ["Font of Blood", "血脉源泉", "血脈源泉"],
    ["Font of Mana", "魔力源泉", "魔力器皿"],
    ["Forge Hammer", "锻造之锤", "鍛造之錘"],
    ["Fork", "冗余 II", "冗餘 II"],
    ["Fortifying Cry", "坚韧战吼", "堅韌之吼"],
    ["Fortress I", "坚城 I", "堡壘 I"],
    ["Fortress II", "坚城 II", "堡壘 II"],
    ["Fragmentation Rounds", "碎裂弹药", "碎裂彈藥"],
    ["Fragments Of The Past", "往昔碎片", "往昔碎片"],
    ["Freeze", "冻结", "冰凍"],
    ["Freezefork", "冻结分叉", "冰凍之叉"],
    ["Freezing Mark", "冰冻印记", "冰凍印記"],
    ["Freezing Salvo", "冻结齐射", "凍結齊射"],
    ["Freezing Shards", "急冻碎片", "冰凍裂片"],
    ["Frenzied Riposte", "狂怒反击", "狂亂反擊"],
    ["Fresh Clip I", "坚韧图腾 I", "堅韌圖騰 I"],
    ["Fresh Clip II", "新装箭匣 II", "全新彈夾 II"],
    ["Frost Bomb", "寒霜爆", "寒霜爆"],
    ["Frost Darts", "冰霜飞镖", "寒霜之鏢"],
    ["Frost I", "刺骨寒意 I", "刺骨冰霜I"],
    ["Frost Nexus", "封冻枢纽", "冰霜匯聚"],
    ["Frost Wall", "冰墙", "冰牆"],
    ["Frostbolt", "寒冰弹", "寒冰彈"],
    ["Frostfire", "霜火", "霜火"],
    ["Frostflame Nova", "霜焰新星", "霜火新星"],
    ["Frozen Locus", "冰凌座", "冰凌座"],
    ["Frozen Spite", "冰冻怨恨", "凍結怨恨"],
    ["Fulminating Concoction", "雷鸣灵药", "烈性混合物"],
    ["Fulmination", "轰鸣烈焰", "劇烈爆發"],
    ["Furious Slam", "狂怒猛击", "狂怒猛擊"],
    ["Fury of the Mountain", "山岳之怒", "山嶽之怒"],
    ["Fuse I", "无我残片", "無私痕跡"],
    ["Future-Past", "未来的过去", "未來昔日"],
    ["Galvanic Field", "电流场", "電光領域"],
    ["Galvanic Shards", "电光散射", "電光散射"],
    ["Gambleshot", "投机射击", "博弈射擊"],
    ["Gas Arrow", "瓦斯之箭", "毒氣箭矢"],
    ["Gas Grenade", "瓦斯榴弹", "瓦斯榴彈"],
    ["Gathering Storm", "聚风雨", "聚風雨"],
    ["Gemini Surge", "双灵涌动", "雙靈波動"],
    ["Ghost Dance", "幽灵舞步", "幽靈舞步"],
    ["Glacial Bolt", "冰川弩箭", "冰川弩箭"],
    ["Glacial Cascade", "冰川之刺", "冰川之刺"],
    ["Glacial Lance", "冰川长枪", "冰川之槍"],
    ["Glacier", "冰川", "冰河"],
    ["Gorge", "狼吞虎咽", "峽谷"],
    ["Grenade Admixture", "混合物", "混合劑"],
    ["Grenade Perfected Endurance", "完美耐力", "絕對堅毅"],
    ["Grim Feast", "饕餮飨宴", "冷酷之宴"],
    ["Grim Pillars", "阴森之柱", "恐怖之柱"],
    ["Ground", "诅咒之地", "詛咒地面"],
    ["Growth", "迅猛绽放", "飛速生長"],
    ["Guatelitzi's Ablation", "瓜铁雷兹的消融", "瓜特利斯的消融"],
    ["Haemocrystals", "赤炼水晶", "赤煉水晶"],
    ["Hailstorm Rounds", "冰雹弹药", "冰雹彈藥"],
    ["Hammer of the Gods", "诸天之锤", "眾神之錘"],
    ["Hand of Chayula", "夏乌拉之手", "夏烏拉之手"],
    ["Harbinger of Madness", "疯魔先驱", "神諭之狂"],
    ["Harmonic Remnants I", "和谐残迹 I", "和諧的痕跡 I"],
    ["Harmonic Remnants II", "和谐残迹 II", "和諧的痕跡 II"],
    ["Hayoxi's Fulmination", "海幽夏的诛罚", "荷霖蔡的轟鳴"],
    ["Hazard", "受控危技", "受控危技"],
    ["Headed", "持续时间压缩 II", "縮短持續時間 II"],
    ["Healing Runes", "治疗符文", "治療符文"],
    ["Heart of Ice", "冰雪之心", "冰雪之心"],
    ["Heavy Swing", "沉重挥舞", "沉重揮擊"],
    ["Heft", "势大力沉", "勢大力沉"],
    ["Heightened Accuracy I", "精准增强 I", "強化命中 I"],
    ["Heightened Charges", "强化能量球", "能量球增強"],
    ["Helbrym's Hide", "赫尔布林的隐瞒", "海爾賓姆的躲藏"],
    ["Her Declaration", "她的宣言", "她的宣言"],
    ["Herald of Ash", "灰烬之捷", "灰燼之捷"],
    ["Herald of Blood", "赤血之捷", "鮮血之捷"],
    ["Herald of Ice", "寒冰之捷", "冰霜之捷"],
    ["Herald of Plague", "荒芜之捷", "瘟疫之捷"],
    ["Herald of Thunder", "闪电之捷", "閃電之捷"],
    ["Herald of the Royal Queen", "皇后之捷", "皇后之捷"],
    ["Herbalism I", "炎军 I", "炎軍 I"],
    ["Hex Bloom", "魔蛊绽放", "咒術綻放"],
    ["Hexblast", "魔蛊爆炸", "咒術枯萎"],
    ["High Velocity Rounds", "高速弹药", "高速彈藥"],
    ["Hit and Run", "连打带跑", "連打帶跑"],
    ["Hollow Focus", "虚空钟灵", "空無專注"],
    ["Hollow Form", "虚空魅影", "空無型態"],
    ["Hollow Resonance", "虚空和鸣", "空無共鳴"],
    ["Hollow Shell", "虚空之壳", "空無披甲"],
    ["Holy Descent", "神圣降临", "神聖降臨"],
    ["Hourglass", "时之沙漏", "沙漏"],
    ["Hulking Minions", "魁梧仆从", "巨大召喚物"],
    ["Hypothermia", "急冻", "急凍"],
    ["I", "剧变 I", "野性碎片 I"],
    ["II", "赤炼", "萌發 II"],
    ["III", "野性残暴 III", "堅忍 II"],
    ["Ice Bite II", "霜咬 II", "霜咬 II"],
    ["Ice Nova", "冰霜新星", "冰霜新星"],
    ["Ice Shards", "冰屑", "冰屑"],
    ["Ice Shot", "冰霜射击", "冰霜射擊"],
    ["Ice Strike", "幽寒打", "幽寒打"],
    ["Ice-Tipped Arrows", "冰尖箭矢", "冰鏃箭矢"],
    ["Icestorm", "冰风暴", "冰風暴"],
    ["Icicle", "冰刺", "冰柱"],
    ["Ignite I", "点燃 I", "點燃 I"],
    ["Ignite II", "点燃 II", "點燃 II"],
    ["Ignite III", "炎军 III", "炎軍 III"],
    ["Immolate", "献祭", "犧牲"],
    ["Impact Shockwave", "冲击震波", "衝擊震波"],
    ["Impale", "穿刺", "穿刺"],
    ["Impending Doom", "末日将至", "末日厄運"],
    ["Impurity", "不净", "不淨"],
    ["Incendiary Shot", "燃烧射击", "燃燒射擊"],
    ["Incinerate", "烧毁", "燒毀"],
    ["Incision", "创口", "切割"],
    ["Inevitable Agony", "命定苦痛", "命定苦痛"],
    ["Inexorable Critical II", "命定绝杀 II", "無情暴擊 II"],
    ["Infernal Cry", "炽焰战吼", "煉獄戰吼"],
    ["Infernal Legion I", "崎岖之地 I", "崎嶇之地 I"],
    ["Infernal Legion II", "崎岖之地 II", "崎嶇之地 II"],
    ["Inhibitor", "抑制器", "抑制劑"],
    ["Innervate", "闪电支配", "亢奮"],
    ["Into the Breach", "投身裂隙", "遁入裂痕"],
    ["Iron Ward", "钢铁看守", "鋼鐵守護"],
    ["Ixchel's Torment", "伊克切尔的折磨", "薩雷許的折磨"],
    ["Jagged Ground I", "生命偷取 I", "生命偷取 I"],
    ["Jagged Ground II", "生命偷取 II", "生命偷取 II"],
    ["Kalisa's Crescendo", "卡莉莎的强音", "卡莉莎的漸強"],
    ["Kaom's Madness", "冈姆的疯狂", "岡姆的癲狂"],
    ["Kelari's Deception", "凯拉里之诡计", "克拉里的欺瞞"],
    ["Kelari's Embrace", "凯拉里之拥抱", "凱拉裏之擁抱"],
    ["Kelari's Judgment", "凯拉里之审判", "克拉里的審判"],
    ["Kelari's Malediction", "凯拉里之诅咒", "克拉里的惡言"],
    ["Kelari, the Tainted Sands", "凯拉里,污秽沙暴", "凱拉裏,污穢沙暴"],
    ["Khatal's Rejuvenation", "卡哈塔的复苏", "卡塔爾的恢復"],
    ["Killing Palm", "终结掌", "終結掌"],
    ["Knockback", "击退", "擊退"],
    ["Kulemak's Dominion", "库勒马克的统治", "骷髏馬克的支配"],
    ["Kurgal's Leash", "古加尔的缰绳", "柯戈的繩索"],
    ["Last Gasp", "亡命之息", "臨終恐息"],
    ["Leap", "撤退 II", "撤退 II"],
    ["Leap Slam", "跃击", "躍擊"],
    ["Leech II", "生命偷取 II", "生命偷取 II"],
    ["Legion II", "点燃 III", "點燃 III"],
    ["Leylines", "地脉", "地脈"],
    ["Life Bounty", "生命丰沛", "生命恩惠"],
    ["Life Drain", "生命榨取", "生命吸取"],
    ["Life Leech III", "加长引线 III", "加長引線 III"],
    ["Life Remnants", "生命残片", "生命痕跡"],
    ["Lifetap", "血脉源泉", "鮮血器皿"],
    ["Lightning Arrow", "闪电箭矢", "閃電箭矢"],
    ["Lightning Attunement", "闪电协调", "閃電同調"],
    ["Lightning Bolt", "闪电", "雷彈"],
    ["Lightning Conduit", "闪电通道", "導雷"],
    ["Lightning II", "活体闪电 II", "活躍閃電 II"],
    ["Lightning Mastery", "闪电专精", "閃電專精"],
    ["Lightning Penetration", "闪电穿透", "閃電穿透"],
    ["Lightning Rod", "引雷针", "雷霆之杖"],
    ["Lightning Spear", "闪电战矛", "閃電長矛"],
    ["Lightning Warp", "闪电传送", "閃電傳送"],
    ["Lineage Dauntless", "不动如山", "無畏"],
    ["Lingering Illusion", "徘徊幻影", "殘留幻象"],
    ["Living Bomb", "活动炸弹", "活體炸彈"],
    ["Living Lightning", "活体闪电", "活躍閃電"],
    ["Lockdown", "封锁", "封鎖"],
    ["Long Fuse I", "加长引线 I", "長引線 I"],
    ["Long Fuse II", "召唤生物溅射伤害 II", "召喚生物濺射傷害 II"],
    ["Longshot I", "远射 I", "遠程射擊 I"],
    ["Loyalty", "忠诚", "忠誠"],
    ["Lunar Assault", "月痕突袭", "月痕突襲"],
    ["Lunar Blessing", "月神赐福", "月神賜福"],
    ["Mace Strike", "锤打击", "鏈錘打擊"],
    ["Magma Barrier", "岩浆屏障", "熔岩屏障"],
    ["Magnetic Salvo", "磁性齐射", "電磁齊射"],
    ["Magnified Area I", "范围扩大 I", "增幅光環 I"],
    ["Maim", "瘫痪", "癱瘓"],
    ["Malady", "错乱病症", "疾病"],
    ["Malice", "怨毒", "絕滅恨惡"],
    ["Mana Drain", "魔力吸取", "魔力吸取"],
    ["Mana Flare", "魔力耀斑", "魔力閃焰"],
    ["Mana Leech", "魔力偷取", "魔力偷取"],
    ["Mana Remnants", "魔力残片", "魔力痕跡"],
    ["Mana Tempest", "魔力风暴", "魔力風暴"],
    ["Manifest", "显化武器", "幻化武器"],
    ["Manifest Weapon", "显化武器", "顯化武器"],
    ["Mantra of Destruction", "毁灭之兆", "毀滅之兆"],
    ["Mark", "充能印记", "充能印記"],
    ["Mark for Death", "死亡印记", "死亡印記"],
    ["Mark of Siphoning", "虹吸印记", "汲取印記"],
    ["Mark of Siphoning II", "虹吸印记II", "汲取印記 II"],
    ["Maul", "重殴", "爪擊"],
    ["Meat Shield I", "肉盾 I", "肉盾 I"],
    ["Meat Shield II", "肉盾 II", "肉盾 II"],
    ["Meditate", "凝神思", "冥想"],
    ["Medved's Felling", "梅德维德的砍伐", "梅德維德的砍伐"],
    ["Melee Pursuit II", "助力之风 II", "助力之風 II"],
    ["Melee Selfless Remnants", "反击 I", "報復 I"],
    ["Melee, Conditional Deadly Herald", "延迟激活", "延遲反應"],
    ["Melee, Slam Heft", "战争铁拳 III", "拳霸 III"],
    ["Melee, Strike Font of Blood", "斩首 I", "斬首 I"],
    ["Melee, Strike Persistent Ground I", "召唤生物溅射伤害 I", "召喚物擴散I"],
    ["Midnight Zenith", "午夜天顶", "午夜天頂"],
    ["Minion Instability", "复仇之灵", "復仇之靈"],
    ["Minion Mastery", "召唤生物专精", "召喚物專精"],
    ["Minion Pact I", "召唤契约 I", "召喚物契約 I"],
    ["Minion Pact II", "召唤契约 II", "召喚物契約 II"],
    ["Minion Splash I", "死亡印记", "死亡標記"],
    ["Minion, Trigger, Physical, Duration Tectonic Slams", "飞掠石 I", "飛掠之石 I"],
    ["Mirage Archer", "幻影射手", "幻影射手"],
    ["Mirage Deadeye", "蜃影神射", "幻影銳眼"],
    ["Mirror of Refraction", "折射之镜", "鏡面折射"],
    ["Mist Raven", "雾鸦", "迷霧渡鴉"],
    ["Mobility", "新星投射物 II", "新星投射物 II"],
    ["Molten Blast", "熔岩爆裂", "熔火爆破"],
    ["Molten Crash", "熔岩冲击", "熔岩破滅"],
    ["Molten Shower", "熔岩骤雨", "熔火噴濺"],
    ["Moment of Vulnerability", "脆弱瞬间", "可趁之刻"],
    ["Momentum", "中毒 II", "中毒 II"],
    ["Morgana's Tempest", "莫甘娜的暴风", "魔甘娜的風暴"],
    ["Mortar Cannon", "迫击大炮", "迫擊大炮"],
    ["Murderous Intent", "坚韧磨砺", "殺人意圖"],
    ["Muster", "海纳百川", "召集"],
    ["Mysticism I", "灵秘 I", "秘術 I"],
    ["Mysticism II", "灵秘 II", "秘術 II"],
    ["Mórrigan's Insight", "莫丽根的洞察", "莫麗根的洞察"],
    ["Navira's Embrace", "纳薇拉之拥抱", "納薇拉之擁抱"],
    ["Navira's Fracturing", "纳薇拉之裂", "納維拉的封凍"],
    ["Navira's Oasis", "纳薇拉之绿洲", "納維拉的綠洲"],
    ["Navira's Well", "纳薇拉之井", "納維拉的水井"],
    ["Navira, the Last Mirage", "纳薇拉,终末幻影", "納薇拉,終末幻影"],
    ["Nimble Reload", "敏捷装填", "靈活裝填"],
    ["Nova Projectiles II", "新星投射物 II", "新星投射物II"],
    ["Oil Barrage", "黏油炮弹", "黏油炮彈"],
    ["Oil Grenade", "黏油榴弹", "黏油榴彈"],
    ["Olroth's Conviction", "欧罗什的信念", "歐羅什的信念"],
    ["Olroth's Hubris", "欧罗什的傲慢", "歐羅什的傲慢"],
    ["Opening Move", "起手式", "先聲奪人"],
    ["Orb of Storms", "风暴漩涡", "風暴漩渦"],
    ["Overabundance I", "冗余 I", "過剩 I"],
    ["Overabundance II", "冗余 II", "冗餘 II"],
    ["Overabundance III", "冗余 III", "過剩 III"],
    ["Overcharge", "过载", "強化聚能"],
    ["Overextend", "竭力痛击", "過分擴張"],
    ["Overload", "过载", "過載"],
    ["Overreach", "击穿", "透勁拳"],
    ["Overwhelming Presence", "压迫气场", "壓倒性的存在"],
    ["Pain Offering", "苦痛奉献", "苦痛奉獻"],
    ["Paquate's Pact", "帕夸特的契约", "帕科特的協議"],
    ["Parry", "招架", "招架"],
    ["Payload", "子母弹", "承載"],
    ["Payoff Static Shocks", "静电脉冲", "靜電震盪"],
    ["Penetration II", "战争铁拳 II", "戰爭鐵拳 II"],
    ["Perfect Strike", "完美一击", "完美打擊"],
    ["Perfected Endurance", "完美耐力", "完美耐力"],
    ["Perfection", "完美", "完美"],
    ["Permafrost Bolts", "永冻弩箭", "永凍弩箭"],
    ["Perpetual Charge", "永续充能", "永恆充能"],
    ["Persistent Corrupting Cry I", "冷静头脑", "冷靜頭腦"],
    ["Persistent Double Barrel II", "蛮勇打击 I", "極惡打擊 I"],
    ["Persistent Ground II", "持久地面 II", "持續地面 II"],
    ["Persistent Ground III", "狂怒 III", "狂怒 III"],
    ["Persistent Infernal Legion I", "药草学 I", "藥草學 I"],
    ["Persistent Remnant Potency I", "折射 I", "折射 I"],
    ["Phantasmal Arrow", "幻灵箭", "幻影箭矢"],
    ["Physical Concoct I", "野性残暴 II", "野性殘暴 II"],
    ["Physical Mastery", "物理专精", "物理專精"],
    ["Physical, Chaos Ricochet I", "流线弹药", "子彈如流"],
    ["Physical, Duration Deadly Resolve", "腐化战吼 I", "腐化戰吼 I"],
    ["Pierce I", "穿透 I", "穿透 I"],
    ["Pierce II", "子母弹", "子母彈"],
    ["Pierce III", "穿透 III", "穿透 III"],
    ["Pin I", "定身 I", "釘身 I"],
    ["Pin II", "迫近追逐 II", "追擊 II"],
    ["Pin III", "定身 III", "釘身 III"],
    ["Pinnacle of Power", "力量巅峰", "力量巔峰"],
    ["Pinpoint Critical", "精准暴击", "精確暴擊"],
    ["Plague Bearer", "瘟疫使者", "病疫之難"],
    ["Plasma Blast", "离子轰击", "離子轟擊"],
    ["Poison I", "中毒 I", "致命毒藥 I"],
    ["Poison III", "中毒 III", "中毒 III"],
    ["Poison Spores", "毒孢迸溅", "毒孢迸濺"],
    ["Poisonburst Arrow", "毒爆箭", "毒爆箭矢"],
    ["Potency III", "残片效能 III", "痕跡強度 III"],
    ["Pounce", "巨狼猛扑", "巨狼猛撲"],
    ["Power Siphon", "力量抽取", "力量抽取"],
    ["Powered by Verisium", "维金供能", "維金供能"],
    ["Practical Magic I", "实用魔法I", "實用魔法 I"],
    ["Practical Magic II", "实用魔法II", "實用魔法 II"],
    ["Practiced Combo", "娴熟连击", "嫺熟連擊"],
    ["Precision I", "精准 I", "精準 I"],
    ["Primal Bounty", "枭羽馈赠", "梟羽饋贈"],
    ["Primal Strikes", "原始打击", "原始打擊"],
    ["Profane Ritual", "不敬之礼", "不敬之禮"],
    ["Profanity II", "不敬 II", "褻瀆 II"],
    ["Projectile Acceleration I", "投射物加速 I", "投射物加速 I"],
    ["Projectile Acceleration II", "投射物加速 II", "投射物加速 II"],
    ["Projectile Acceleration III", "投射物加速 III", "投射物加速 III"],
    ["Projectile Arbiter's Reach", "投射物仲裁官之握", "投射物仲裁官之握"],
    ["Projectile Deceleration I", "投射物减速 I", "投射物減速 I"],
    ["Projectile Elemental Armament III", "双管齐下 III", "雙管齊下 III"],
    ["Projectile Heightened Accuracy II", "闪电曝露", "閃電曝露"],
    ["Projectile Poison Spores", "完美耐力", "完美耐力"],
    ["Projectile, Lightning Adhesive Grenades II", "温热血脉", "滿腔熱血"],
    ["Projectile, Trigger, Duration, Hazard Charged Shots I", "丰饶 II", "懸賞 II"],
    ["Projection", "星界投射", "星空投影"],
    ["Prototype Seventeen", "原型十七", "原型十七"],
    ["Punch", "拳击", "拳擊"],
    ["Punch Through", "快速攻击 II", "快速攻擊 II"],
    ["Purity of Fire", "火焰净化", "火焰淨化"],
    ["Purity of Ice", "冰霜净化", "冰霜淨化"],
    ["Purity of Lightning", "闪电净化", "閃電淨化"],
    ["Pursuit I", "迫近追逐 I", "追擊 I"],
    ["Pursuit II", "重新武装 II", "重新武裝 II"],
    ["Pursuit III", "迫近追逐 III", "追擊 III"],
    ["Quarterstaff Strike", "节杖打击", "細杖打擊"],
    ["Queen's Procession", "女王冲锋", "女王衝鋒"],
    ["Quill Burst", "棘刺爆发", "驟羽爆發"],
    ["Rage I", "狂怒 I", "狂怒 I"],
    ["Rage II", "狂怒 II", "盛怒 II"],
    ["Rageforged I", "怒火锤炼 I", "盛怒鍛造 I"],
    ["Rageforged II", "折射 II", "折射 II"],
    ["Raging Spirits", "愤怒狂灵", "憤怒狂靈"],
    ["Rain of Arrows", "箭雨", "箭雨"],
    ["Rain of Blades", "刀刃之雨", "刀刃之雨"],
    ["Raise Shield", "架盾", "架盾"],
    ["Raise Zombie", "魔卫复苏", "魔衛復甦"],
    ["Rake", "斜掠", "陰爪"],
    ["Rakiata's Flow", "拉其塔之流", "萊基亞塔的流動"],
    ["Rampage", "横冲直撞", "橫衝直撞"],
    ["Rapid Assault", "极速进攻", "極速進攻"],
    ["Rapid Attacks I", "快速攻击 I", "疾速攻擊 I"],
    ["Rapid Attacks II", "快速攻击 II", "疾速攻擊 II"],
    ["Rapid Attacks III", "快速攻击 III", "疾速攻擊 III"],
    ["Rapid Casting I", "快速施法 I", "疾速施法 I"],
    ["Rapid Casting II", "快速施法 II", "疾速施法 II"],
    ["Rapid Casting III", "快速施法 III", "疾速施法 III"],
    ["Rapid Shot", "快速射击", "快速射擊"],
    ["Ratha's Assault", "拉莎的突袭", "拉莎的突襲"],
    ["Ravenous Swarm", "饕餮虫群", "貪婪蟲群"],
    ["Reap", "赤炼收割", "收割"],
    ["Reaper's Invocation", "收割祈求", "收割祈求"],
    ["Rearm I", "撤退 I", "撤退 I"],
    ["Rearm II", "重新武装 II", "重新佈署 II"],
    ["Refraction II", "折射 II", "折射 II"],
    ["Refutation", "反制", "反制"],
    ["Reinforced Totems I", "增强图腾 I", "強化圖騰 I"],
    ["Reinforced Totems II", "碎片图腾 II", "碎片圖騰 II"],
    ["Remnant Potency I", "反击 I", "反擊 I"],
    ["Remnant Potency II", "残片效能 II", "痕跡強度 II"],
    ["Remnants of Kalguur", "卡古兰残片", "卡古蘭殘片"],
    ["Rend", "龙爪撕裂", "龍爪撕裂"],
    ["Rending Apex", "撕裂巅峰", "撕裂頂點"],
    ["Repulsion", "斥退", "斥退"],
    ["Requiem", "镇魂曲", "安魂曲"],
    ["Resolve", "格鲁坎的决心", "卡洛翰的決心"],
    ["Resonating Shield", "共振护盾", "共鳴之盾"],
    ["Retaliate II", "反击 II", "報復 II"],
    ["Retention", "能量保存", "能量保留"],
    ["Retreat I", "撤退 I", "撤退 I"],
    ["Retreat III", "撤退 III", "撤退 III"],
    ["Rhoa Mount", "恐喙鸟坐骑", "恐喙鳥坐騎"],
    ["Ricochet II", "弹射 II", "彈射 II"],
    ["Ricochet III", "弹射 III", "彈射 III"],
    ["Righteous Descent", "正义天降", "正義天降"],
    ["Rigwald's Ferocity", "瑞佛的凶猛", "瑞佛的狂暴"],
    ["Rip", "撕裂", "撕毀"],
    ["Rising Tempest", "风暴骤起", "崛起風暴"],
    ["Rite of Restoration", "恢复圣仪", "恢復聖儀"],
    ["Ritual Sacrifice", "秘法奉献", "祕法奉獻"],
    ["Ritualistic Curse", "仪祭诅咒", "儀式詛咒"],
    ["Rolling Magma", "熔岩奔涌", "熔巖奔湧"],
    ["Rolling Slam", "轰动猛击", "翻騰重擊"],
    ["Romira's Requital", "罗米拉的报复", "羅米拉的報復"],
    ["Runeforged Blades", "符文之刃", "符文之刃"],
    ["Runic Extraction", "符文提取", "符文提取"],
    ["Runic Infusion", "符文灌注", "符文灌注"],
    ["Runic Reprieve", "符文援护", "符文援護"],
    ["Runic Tempering", "符文淬炼", "符文淬鍊"],
    ["Rupture", "残破", "殘破"],
    ["Rusted Spikes", "锈蚀尖刺", "銹蝕尖刺"],
    ["Ruzhan's Embrace", "鲁詹之拥抱", "魯詹之擁抱"],
    ["Ruzhan's Fury", "鲁詹之怒火", "魯兹安的怒火"],
    ["Ruzhan's Reckoning", "鲁詹之清算", "魯兹安的清算"],
    ["Ruzhan's Trap", "鲁詹之陷阱", "魯兹安的陷阱"],
    ["Ruzhan, the Blazing Sword", "鲁詹,炽焰之剑", "魯詹,熾焰之劍"],
    ["Sacrifice", "替代牺牲", "替代犧牲"],
    ["Sacrificial Lamb I", "替罪羔羊 I", "獻祭羔羊 I"],
    ["Sacrificial Lamb II", "替罪羔羊 II", "獻祭羔羊 II"],
    ["Sacrificial Offering", "牺牲供奉", "犧牲奉獻"],
    ["Salvo", "相性 III", "相性 III"],
    ["Sanguine Revelry", "嗜血狂宴", "嗜血狂宴"],
    ["Savage Fury", "凶蛮怒火", "殘猛狂怒"],
    ["Scavenged Plating", "装甲回收", "拾荒者護板"],
    ["Scouring Flame", "涤罪之火", "滌罪之火"],
    ["Searing Flame I", "凌迟 I", "凌遲 I"],
    ["Second Wind II", "助力之风 II", "恢復 II"],
    ["Second Wind III", "助力之风 III", "恢復 III"],
    ["Seismic Cry", "震地战吼", "裂地戰吼"],
    ["Selfless Remnants", "无我残片", "無我殘片"],
    ["Seraph's Heart", "炽天使之心", "熾天使之心"],
    ["Shard Scavenger", "碎片回收", "碎片清除者"],
    ["Shattering Concoction", "碎冰灵药", "粉碎混合物"],
    ["Shattering Palm", "冰裂掌", "冰裂掌"],
    ["Shattering Spite", "碎裂恶意", "碎裂惡意"],
    ["Shield Charge", "重盾冲锋", "重盾衝鋒"],
    ["Shield Wall", "盾墙", "盾牆"],
    ["Shock", "感电", "持續感電"],
    ["Shock Conduction", "感电传导", "感電傳導"],
    ["Shock Conduction II", "感电传导 II", "感電傳導II"],
    ["Shock Siphon", "感电虹吸", "電擊虹吸"],
    ["Shockburst Rounds", "震爆弹药", "震爆彈藥"],
    ["Shockchain Arrow", "连环震击箭", "電鍊箭矢"],
    ["Shockwave Totem", "震波图腾", "震波圖騰"],
    ["Short Fuse I", "飞掠石 I", "飛掠石 I"],
    ["Short Fuse II", "短暂引信 II", "易怒 II"],
    ["Shred", "狼爪撕裂", "狼爪撕裂"],
    ["Siege Ballista", "攻城炮台", "攻城炮臺"],
    ["Siege Cascade", "摧城倾泻", "摧城傾瀉"],
    ["Sigil of Power", "威能法印", "咒符之力"],
    ["Sione's Temper", "西奥妮的怒火", "西奧妮的鍛鍊"],
    ["Siphon Elements", "汲取元素", "汲取元素"],
    ["Siphoning Strike", "汲能击", "汲能擊"],
    ["Skeletal Arsonist", "魔侍焚焰使", "骷髏縱火者"],
    ["Skeletal Brute", "魔侍蛮兵", "骷髏巨獸"],
    ["Skeletal Cleric", "魔侍祭司", "骷髏牧師"],
    ["Skeletal Frost Mage", "魔侍冰霜法师", "魔侍冰霜法師"],
    ["Skeletal Reaver", "魔侍掠夺者", "魔侍掠奪者"],
    ["Skeletal Sniper", "魔侍神射手", "骷髏狙擊手"],
    ["Skeletal Storm Mage", "魔侍风暴法师", "骷髏風暴法師"],
    ["Skeletal Warrior", "魔侍武士", "骷髏战士"],
    ["Skyfall", "天降杀机", "天降殺機"],
    ["Slam Armour Break I", "余震 I", "餘震 I"],
    ["Slam, Duration Life Leech I", "崎岖之地 I", "碎裂地面 I"],
    ["Slam, Duration Life Leech III", "崎岖之地 II", "碎裂地面 II"],
    ["Slow Potency", "减速效能", "緩速強度"],
    ["Snap", "激变", "激變"],
    ["Snipe", "狙击", "狙擊"],
    ["Sniper's Mark", "狙击印记", "狙擊者印記"],
    ["Soaring Midnight", "午夜翱翔", "午夜飛掠"],
    ["Solar Orb", "日曜球", "日耀球"],
    ["Sorcery Ward", "元素结界", "元素結界"],
    ["Soul Drain", "魂魔榨取", "魂魔榨取"],
    ["Soul Offering", "灵之奉献", "灵魂獻祭"],
    ["Soulrend", "裂魂术", "裂魂術"],
    ["Spar", "角力", "打擊練習"],
    ["Spark", "电球", "電球"],
    ["Sparks II", "强化火花 II", "強化電球II"],
    ["Spear Stab", "战矛突刺", "戰矛突刺"],
    ["Spear Throw", "战矛飞掷", "戰矛飛擲"],
    ["Spear of Solaris", "日耀之矛", "日耀長矛"],
    ["Spearfield", "枪林矛阵", "長矛之錐"],
    ["Spell Cascade", "多重范围施法", "秘能爆發"],
    ["Spell Echo", "施法回响", "法術迴響"],
    ["Spell Totem", "法术图腾", "法術圖騰"],
    ["Spellslinger", "法术节魔", "法術節魔"],
    ["Spiral Volley", "螺旋齐射", "螺旋之弦"],
    ["Spiraling Conspiracy", "鸦群密谋", "鴉羣密謀"],
    ["Splash II", "持久地面 II", "持久地面 II"],
    ["Splinter Totem I", "碎片图腾 I", "殘片圖騰 I"],
    ["Splinter Totem II", "坚忍 II", "堅忍 II"],
    ["Staggering Palm", "惊风掌", "驚風掌"],
    ["Stampede", "奔踏", "踐踏"],
    ["Starborn Onslaught", "星辰冲击", "星辰衝擊"],
    ["Static Shocks", "静电脉冲", "靜電脈衝"],
    ["Steadfast I", "坚定 I", "堅定 I"],
    ["Steadfast II", "坚定 II", "穩若泰山 II"],
    ["Stoicism I", "坚忍 I", "堅忍 I"],
    ["Stoicism II", "碎片图腾 II", "殘片圖騰 II"],
    ["Stomping Ground", "震撼大地", "震撼大地"],
    ["Stone II", "飞掠石 II", "飛掠之石 II"],
    ["Storm Bidding II", "奉命 II", "出價 II"],
    ["Storm Lance", "岚舞长枪", "風暴之槍"],
    ["Storm Oisín's Oath", "奥辛之誓", "歐辛的誓言"],
    ["Storm Wave", "移风岚", "移風嵐"],
    ["Stormblast Bolts", "轰雷弩箭", "轟雷弩箭"],
    ["Stormcaller Arrow", "唤雷箭", "風暴呼喚箭矢"],
    ["Stormchain", "风暴连锁", "風暴之鏈"],
    ["Stormfire", "风暴之炎", "風暴之炎"],
    ["Streamlined Rounds", "节省弹药 III", "節省彈藥 III"],
    ["Strike I", "终结 I", "終結 I"],
    ["Strike Projectile Deceleration II", "投射物加速 II", "投射物加速 II"],
    ["Strong Hearted", "强健心灵", "不屈之心"],
    ["Stun I", "荆棘皮肤 I", "荊棘皮膚 I"],
    ["Stun II", "晕眩 II", "暈眩 II"],
    ["Styrn's Ferocity", "斯泰恩的凶残", "斯泰恩的兇殘"],
    ["Styrn's Mountain", "斯泰恩的山岳", "斯泰恩的山嶽"],
    ["Summon Infernal Hound", "召唤炽焰猎犬", "召喚獄炎獵犬"],
    ["Sunder", "大地震击", "大地震擊"],
    ["Supercharged Slam", "蓄威神锤", "超載重擊"],
    ["Supercritical", "特化暴击", "超暴擊"],
    ["Supporting Fire", "支援火力", "支援火力"],
    ["Surge", "秘术增强", "秘能波動"],
    ["Swift Affliction I", "极速腐化 I", "極速苦痛 I"],
    ["Swift Affliction II", "致盲 II", "致盲 II"],
    ["Sword Slash", "剑挥砍", "劍揮砍"],
    ["Syzygy", "朔望", "朔望"],
    ["Tacati's Ire", "塔卡提之怒", "特卡蒂的憤怒"],
    ["Tame Beast", "驯服野兽", "馴獸"],
    ["Tangmazu's Thurible", "唐玛祖的香炉", "唐瑪祖的香爐"],
    ["Tasalio's Rhythm", "塔萨里奥的律动", "塔薩里奧的律動"],
    ["Tawhoa's Tending", "塔赫亚的照料", "塔赫亞的照顧"],
    ["Tear", "撕扯", "撕裂"],
    ["Tecrod's Revenge", "特克罗的复仇", "特克羅德的復仇"],
    ["Tectonic Slams", "破釜一击", "破釜一擊"],
    ["Temper", "淬炼武器", "淬鍊武器"],
    ["Temper Weapon", "淬炼武器", "淬鍊武器"],
    ["Tempest Bell", "风雷钟", "風雷鍾"],
    ["Tempest Flurry", "风暴乱舞", "風暴亂舞"],
    ["Temporal Chains", "时空锁链", "時空鎖鏈"],
    ["Temporal Rift", "时空裂隙", "時空裂隙"],
    ["The Stars Answer", "群星召唤", "羣星召喚"],
    ["Thornskin II", "荆棘皮肤 II", "荊棘之皮 II"],
    ["Thrashing Vines", "鞭笞藤蔓", "鞭笞藤蔓"],
    ["Thrill of the Kill", "杀戮快感", "殺戮渴望"],
    ["Thrill of the Kill II", "杀戮快感II", "殺戮渴望II"],
    ["Thunder", "伊奥尼尔的雷霆", "伊歐涅的雷霆"],
    ["Thundergod's Wrath", "雷霆神祇之怒", "雷神之怒"],
    ["Thunderous Leap", "雷鸣飞跃", "雷霆跳躍"],
    ["Thunderstorm", "雷霆风暴", "雷霆風暴"],
    ["Time Freeze", "时间冻结", "時間凍結"],
    ["Time Snap", "时间捕捉", "時間捕捉"],
    ["Time of Need", "紧急时刻", "緊急時刻"],
    ["Tireless", "冷酷", "冷酷"],
    ["Tornado", "龙卷旋风", "龍捲旋風"],
    ["Tornado Shot", "龙卷射击", "龍捲射擊"],
    ["Totem Herbalism I", "坚韧图腾 I", "堅韌圖騰 I"],
    ["Totem II", "增强图腾 II", "強化圖騰 II"],
    ["Totems I", "药草学 I", "藥草學 I"],
    ["Totems II", "坚韧图腾 II", "堅韌圖騰 II"],
    ["Touch", "凋零之触", "凋零之觸"],
    ["Toxic Domain", "毒性领域", "毒素領域"],
    ["Toxic Growth", "剧毒增生", "毒素植栽"],
    ["Trail of Caltrops", "铁蒺藜之路", "蒺藜之徑"],
    ["Trickster's Shard", "欺诈者碎片", "欺詐者碎片"],
    ["Trinity", "三位一体", "三位一體"],
    ["Triskelion Cascade", "三耀辉轮", "三耀輝輪"],
    ["Tul's Avalanche", "托沃的雪崩", "託沃的雪崩"],
    ["Tul's Stillness", "托沃的寂静", "托沃的寧靜"],
    ["Twister", "旋龙", "旋風"],
    ["Uhtred's Augury", "乌崔德的占卜", "烏特雷的占卜術"],
    ["Uhtred's Constellation", "乌崔德的星图", "烏崔德的星圖"],
    ["Uhtred's Exodus", "乌崔德的出走", "烏特雷的出走"],
    ["Uhtred's Omen", "乌崔德的预兆", "烏特雷的徵兆"],
    ["Uhtred's Rite", "乌崔德仪式", "烏崔德儀式"],
    ["Unbound Avatar", "不羁化身", "不羈化身"],
    ["Unearth", "开掘", "開掘"],
    ["Unleash", "释出", "釋放"],
    ["Untether", "深渊心爆", "解脫"],
    ["Upheaval I", "冷酷", "冷酷"],
    ["Upwelling II", "升流 II", "湧升流 I"],
    ["Urgent Totems I", "先锋 I", "先鋒 I"],
    ["Urgent Totems II", "紧急图腾 II", "應急圖騰 II"],
    ["Urgent Totems III", "紧急图腾 III", "應急圖騰 III"],
    ["Uruk's Smelting", "厄罗克的熔炼术", "厄羅克的鍛鍊"],
    ["Uul-Netol's Embrace", "乌尔尼多的拥抱", "烏爾尼多的擁抱"],
    ["Valako's Charge", "瓦拉克怒冲", "瓦拉克怒衝"],
    ["Varashta's Blessing", "瓦拉煞的祝福", "瓦拉什塔的祝福"],
    ["Vaulting Impact", "跳跃撞击", "跳躍撞擊"],
    ["Verglas", "雨淞", "冰淞"],
    ["Verisium Manifestations", "维金化形", "維金化形"],
    ["Vessel", "灵魂容器", "靈魂容器"],
    ["Vilenta's Propulsion", "薇伦塔之推进", "范尼達的奮進"],
    ["Vine Arrow", "藤缠箭", "藤蔓箭矢"],
    ["Virtuous Barrier", "美德壁垒", "高尚禦盾"],
    ["Vitality II", "活力 II", "活力 II"],
    ["Vivid Stampede", "雄鹿践踏", "雄鹿踐踏"],
    ["Void Illusion", "虚空幻影", "虛空幻影"],
    ["Volatile Dead", "灵体火球", "致命之息"],
    ["Volatility", "无常", "易爆"],
    ["Volcanic Fissure", "火山裂缝", "炎火脈動"],
    ["Volcano", "火山", "火山"],
    ["Volley", "灵体齐射", "靈體齊射"],
    ["Volt", "极速腐化 II", "極速苦痛 II"],
    ["Voltaic Barrier", "电能屏障", "電能屏障"],
    ["Voltaic Grenade", "电涌榴弹", "電湧榴彈"],
    ["Voltaic Mark", "流电印记", "電流印記"],
    ["Vorana's Siege", "沃拉娜的围城", "沃拉娜的圍城"],
    ["Vruun's Inevitability", "弗伦的必然", "弗倫的必然"],
    ["Vulnerability", "脆弱", "脆弱"],
    ["Walking Calamity", "灾厄行者", "災厄行者"],
    ["War Banner", "战旗", "戰爭之旗"],
    ["Warcry I", "燃怒战吼 I", "激怒戰吼 I"],
    ["Warcry II", "元素军械 III", "元素軍械 III"],
    ["Warcry Refraction I", "愤怒战吼", "憤怒戰吼"],
    ["Wardbound Minions", "结界仆从", "結界僕從"],
    ["Warm Blooded", "温热血脉", "溫熱血脈"],
    ["Wave of Frost", "寒霜浪涌", "寒霜浪湧"],
    ["Weakness", "元素军械 II", "元素武裝 II"],
    ["Whirling Assault", "旋风击", "旋風擊"],
    ["Whirling Slash", "回旋挥斩", "迴旋斬"],
    ["Whirlwind Lance", "旋风投枪", "旋風之槍"],
    ["Wild Protector", "野性守护", "野性守護"],
    ["Wildfire", "野火", "燐火"],
    ["Wildshards II", "狂野碎片 II", "野性碎片 II"],
    ["Wildwood's Gifts", "荒林之赐", "荒林禮贈"],
    ["Wind Blast", "迅风爆", "迅風爆"],
    ["Wind Dancer", "风舞者", "風魔舞者"],
    ["Wind I", "重新武装 I", "重新佈署 I"],
    ["Wind Serpent's Fury", "腾蛇之怒", "勁風蝮蛇之怒"],
    ["Window of Opportunity I", "大好时机 I", "機會之窗 I"],
    ["Window of Opportunity II", "大好时机 II", "機會之窗 II"],
    ["Wing Blast", "烈风吹袭", "烈風吹襲"],
    ["Wither", "死亡凋零", "死亡凋零"],
    ["Withering Presence", "凋零姿态", "凋零光環"],
    ["Wolf Pack", "狼群", "召喚惡狼"],
    ["Xibaqua's Rending", "夏巴夸亚的撕裂", "賽巴昆的撕裂"],
    ["Xoph's Pyre", "索伏的葬火", "索伏的燃焰"],
    ["Zarokh's Refrain", "扎洛卡的克制", "澤洛克的克制"],
    ["Zarokh's Revolt", "扎洛卡的反叛", "澤洛克的反叛"],
    ["Zenith I", "天顶 I", "極盛 I"],
    ["Zenith II", "天顶 II", "極盛 II"],
    ["Zerphi's Infamy", "泽佛伊的恶名", "澤佛伊的惡名"],
    ["for Death II", "死亡印记 II", "死亡標記 II"],
    ["of War I", "战争铁拳 I", "拳霸 I"],
    ["the Blazing Sword", "炽焰之剑", "赤炎利劍.魯兹安"],
    ["the Last Mirage", "终末幻影", "最終幻象.納維拉"],
    ["the Tainted Sands", "污秽沙暴", "黯染飛砂.克拉里"]
  ];
  /* INLINE_GEMS:END */

  /* INLINE_H2S:BEGIN */
const H2S_PACKED = "丟丢丣卯並并乗乘乹干乾干亁干亂乱亙亘亝斋亞亚亱夜亷廉亾亡佇伫佈布佔占併并來来侖仑侶侣侷局俁俣係系俔伣俠侠俥伡俬私俻备倀伥倆俩倈俫倉仓個个倐倏們们倖幸倣仿倫伦倲㑈倸睬偉伟偑㐽側侧偵侦偽伪傌㐷傑杰傖伧傘伞備备傚效傢家傭佣傯偬傳传傴伛債债傷伤傾倾僂偻僅仅僉佥僊仙働动僑侨僕仆僞伪僥侥僨偾僱雇價价儀仪儁俊儂侬億亿儈侩儉俭儌侥儎傤儐傧儔俦儕侪儘尽償偿優优儲储儷俪儸㑩儺傩儻傥儼俨兇凶兌兑兎兔兒儿兗兖兠兜內内兩两冄冉冊册冐冒冑胄冪幂冺泯凈净凍冻凜凛凢凡凱凯凴凭別别刦劫刧劫刪删刼劫剄刭則则剉锉剋克剎刹剏创剗刬剙创剛刚剝剥剮剐剳札剴剀創创剷铲剹戮劃划劄札劇剧劉刘劊刽劌刿劍剑劏㓥劑剂劒剑劚㔉効效勁劲勅敕勌倦動动務务勛勋勝胜勞劳勢势勦剿勩勚勱劢勳勋勵励勸劝勻匀匟炕匭匦匯汇匱匮匲奁匳奁區区協协卹恤卻却卽即厀膝厙厍厠厕厤历厭厌厰厂厲厉厴厣參参叄叁叢丛吒咤吚咿吳吴吶呐呂吕呌叫呪咒咊和咼呙員员哶咩唄呗唕唣唘启唚吣唸念啎忤問问啑喋啓启啗啖啞哑啟启啢唡啣衔喎㖞喚唤喪丧喫吃喬乔單单喲哟嗁啼嗆呛嗇啬嗊唝嗎吗嗚呜嗩唢嗶哔嘆叹嘍喽嘑呼嘓啯嘔呕嘖啧嘗尝嘜唛嘠嘎嘩哗嘮唠嘯啸嘰叽嘵哓嘷嗥嘸呒嘽啴噁恶噉啖噓嘘噚㖊噝咝噠哒噥哝噦哕噯嗳噲哙噴喷噸吨噹当嚀咛嚇吓嚌哜嚐尝嚕噜嚙啮嚥咽嚦呖嚨咙嚮向嚲亸嚳喾嚴严嚶嘤囀啭囁嗫囂嚣囅冁囈呓囉啰囌苏囑嘱囓啮囙因囪囱圅函圇囵國国圍围園园圓圆圖图團团坿附垜垛垻坝埡垭埰采執执堅坚堊垩堖垴堝埚堯尧報报場场塊块塋茔塏垲塒埘塗涂塚冢塟葬塢坞塤埙塲场塵尘塹堑墊垫墖塔墜坠墮堕墰坛墳坟墶垯墻墙墾垦壇坛壋垱壎埙壓压壘垒壙圹壚垆壜坛壞坏壟垄壠垅壢坜壩坝壪塆壯壮壺壶壻婿壼壸壽寿夘卯夠够夢梦夥伙夾夹奐奂奧奥奩奁奪夺奬奖奮奋奼姹妝妆妬妒妳你妷侄姉姊姍姗姙妊姦奸姪侄姸妍娛娱婁娄婣姻婦妇婬淫婭娅媍妇媧娲媯妫媰㛀媼媪媽妈媿愧嫋袅嫗妪嫰嫩嫵妩嫺娴嫻娴嫿婳嬀妫嬃媭嬈娆嬋婵嬌娇嬙嫱嬝袅嬡嫒嬤嬷嬪嫔嬭奶嬰婴嬸婶嬾懒孃娘孋㛤孌娈孫孙學学孼孽孿孪宂冗宮宫寀采寃冤寑寝寢寝實实寧宁審审寫写寬宽寳宝寵宠寶宝尅克將将專专尋寻對对導导尒尔尙尚尟鲜尠鲜尷尴屆届屍尸屓屃屛屏屜屉屢屡層层屨屦屬属屭屃岅坂岡冈峝峒峯峰峴岘島岛峽峡崍崃崑昆崗岗崙仑崢峥崬岽嵐岚嵗岁嵾㟥嶁嵝嶃崭嶄崭嶇岖嶔嵚嶗崂嶠峤嶢峣嶧峄嶨峃嶮崄嶸嵘嶺岭嶼屿嶽岳巋岿巒峦巔巅巖岩巰巯巵卮巹卺帀匝帋纸帥帅師师帬裙帳帐帶带幀帧幃帏幇帮幑徽幓㡎幗帼幘帻幙幕幚帮幟帜幣币幫帮幬帱幹干幾几庫库庻庶庽寓廁厕廂厢廄厩廈厦廎庼廐厩廕荫廚厨廝厮廟庙廠厂廡庑廢废廣广廩廪廬庐廳厅廵巡廹迫廻回弒弑弔吊弳弪張张強强彆别彈弹彌弥彎弯彔录彙汇彞彝彠彟彥彦彫雕彲彨彿佛徃往後后徑径從从徠徕徧遍復复徵征徹彻怱匆怳恍恆恒恠怪恡吝恥耻悅悦悞悮悤匆悵怅悶闷悽凄惏婪惡恶惥恿惱恼惲恽惷蠢惻恻愛爱愜惬愨悫愴怆愷恺愽博愾忾慄栗態态慍愠慘惨慙惭慚惭慟恸慣惯慤悫慪怄慫怂慮虑慳悭慴慑慶庆慺㥪慼戚慽戚慾欲憂忧憇憩憊惫憍㤭憐怜憑凭憒愦憖慭憚惮憤愤憫悯憮怃憲宪憶忆懇恳應应懌怿懍懔懞蒙懟怼懣懑懤㤽懧㤖懨恹懲惩懶懒懷怀懸悬懺忏懼惧懾慑戀恋戇戆戔戋戞戛戧戗戩戬戰战戱戯戲戏戶户戹厄扞捍抝拗拋抛拚拼挩捝挱挲挵弄挾挟捄救捨舍捫扪捱挨捲卷掃扫掄抡掆㧏掗挜掙挣掛挂採采掽碰揀拣揑捏揚扬換换揫揪揮挥揯搄揷插揹背搆构搇揿搉榷損损搖摇搗捣搤扼搥捶搨拓搯掏搵揾搶抢搾榨摃扛摑掴摜掼摟搂摯挚摳抠摶抟摺折摻掺撈捞撏挦撐撑撓挠撝㧑撟挢撡操撣掸撥拨撦扯撫抚撲扑撳揿撻挞撾挝撿捡擁拥擄掳擇择擊击擋挡擓㧟擔担擕携據据擠挤擣捣擥㧛擧举擬拟擯摈擰拧擱搁擲掷擴扩擷撷擺摆擻擞擼撸擽㧰擾扰攄摅攆撵攏拢攔拦攖撄攙搀攛撺攜携攝摄攢攒攣挛攤摊攩挡攪搅攬揽攷考敂叩敍叙敎教敓敚敗败敘叙敵敌數数敺驱斂敛斃毙斆敩斕斓斬斩斷断於于旂旗旣既旤祸旹时旾春昇升昬昏時时晉晋晝昼暈晕暉晖暘旸暢畅暫暂暱昵曄晔曆历曇昙曉晓曏向曖暧曠旷曡叠曨昽曬晒書书會会朞期朢望朧胧朮术朶朵東东杴锨枱台枴拐柵栅柺拐査查栁柳栞刊栢柏栰筏桒桑桮杯桺柳桿杆梔栀梘枧條条梟枭梲棁棄弃棊棋棖枨棗枣棟栋棡㭎棧栈棲栖棶梾椏桠椗碇椲㭏椶棕椷缄椾笺楊杨楓枫楥楦楨桢業业極极榘矩榦干榪杩榮荣榲榅榿桤構构槍枪槓杠槕桌槤梿槧椠槨椁槮椮槳桨槶椢槼椝樁桩樂乐樅枞樑梁樓楼標标樞枢樢㭤樣样樧榝樫㭴樳桪樸朴樹树樺桦樿椫橈桡橋桥橜橛機机橢椭橫横檁檩檉柽檔档檜桧檟槚檢检檣樯檮梼檯台檳槟檸柠檻槛櫃柜櫈凳櫓橹櫚榈櫛栉櫝椟櫞橼櫟栎櫥橱櫧槠櫨栌櫪枥櫫橥櫬榇櫱蘖櫳栊櫸榉櫻樱欄栏欅榉權权欏椤欒栾欖榄欝郁欞棂欵款欽钦歎叹歐欧歛敛歟欤歡欢歲岁歴历歷历歸归歿殁殀夭殘残殞殒殤殇殨㱮殫殚殭僵殮殓殯殡殰㱩殲歼殺杀殻壳殼壳毀毁毆殴毧绒毬球毿毵氂牦氈毡氊毡氌氇氣气氫氢氬氩氳氲氷冰氾泛汎泛汙污汚污決决沒没沖冲況况泝溯洩泄洶汹浹浃涇泾涖莅涗涚涼凉淒凄淚泪淛浙淥渌淨净淩凌淪沦淵渊淶涞淺浅渖沈渙涣減减渢沨渦涡測测渾浑湊凑湞浈湧涌湯汤湼涅溈沩準准溝沟溫温溮浉溳涢溼湿滄沧滅灭滌涤滎荥滙汇滛淫滬沪滯滞滲渗滷卤滸浒滻浐滾滚滿满漁渔漊溇漚沤漢汉漣涟漬渍漲涨漵溆漸渐漿浆潁颍潄漱潑泼潔洁潙沩潚㴋潛潜潤润潯浔潰溃潷滗潿涠澀涩澁涩澆浇澇涝澐沄澗涧澠渑澤泽澦滪澩泶澮浍澱淀澾㳠濁浊濃浓濄㳡濇涩濕湿濘泞濚溁濛蒙濜浕濟济濤涛濧㳔濫滥濰潍濱滨濶阔濺溅濼泺濾滤瀂澛瀅滢瀆渎瀇㲿瀉泻瀋沈瀏浏瀕濒瀘泸瀝沥瀟潇瀠潆瀦潴瀧泷瀨濑瀰弥瀲潋瀾澜灃沣灄滠灋法灑洒灕漓灘滩灝灏灠漤灡㳕灣湾灤滦灧滟灩滟災灾為为烏乌烖灾烴烃無无煉炼煑煮煒炜煗暖煙烟煢茕煥焕煩烦煬炀煱㶽熅煴熈熙熒荧熗炝熱热熲颎熾炽燁烨燄焰燈灯燉炖燒烧燙烫燜焖營营燦灿燬毁燭烛燴烩燶㶶燻熏燼烬燾焘爍烁爐炉爗烨爛烂爭争爲为爺爷爾尔牀床牆墙牋笺牎窗牐闸牓榜牕窗牘牍牠它牴抵牽牵犖荦犛牦犢犊犧牺狀状狥徇狹狭狽狈猂悍猙狰猨猿猶犹猻狲獁犸獃呆獄狱獅狮獎奖獘毙獧狷獨独獪狯獫猃獮狝獰狞獱㺍獲获獵猎獷犷獸兽獺獭獻献獼猕玀猡玅妙現现琖盏琱雕琺珐琿珲瑇玳瑋玮瑒玚瑣琐瑤瑶瑩莹瑪玛瑯琅瑲玱璉琏璡琎璢瑠璣玑璦瑷璫珰璯㻅環环璵玙璸瑸璽玺璿璇瓊琼瓏珑瓔璎瓚瓒甌瓯甎砖甕瓮甖罂甞尝產产産产甦苏甯宁畂亩畆亩畝亩畢毕畧略畫画畮亩異异畱留畵画當当疇畴疊叠疎疏疘肛疿痱痐蛔痙痉痠酸痲痳痺痹痾疴瘂痖瘉愈瘋疯瘍疡瘓痪瘖喑瘞瘗瘡疮瘧疟瘮瘆瘲疭瘺瘘瘻瘘療疗癄憔癅瘤癆痨癇痫癈废癉瘅癒愈癘疠癟瘪癡痴癢痒癤疖癥症癧疬癩癞癬癣癭瘿癮瘾癰痈癱瘫癲癫發发皁皂皐皋皚皑皜皓皰疱皷鼓皸皲皺皱盃杯盇盍盌碗盜盗盞盏盡尽監监盤盘盧卢盪荡眎视眞真眡视眥眦眾众睏困睜睁睞睐睠眷睪睾瞇眯瞖翳瞘眍瞜䁖瞞瞒瞭了瞶瞆瞼睑矁瞅矇蒙矓眬矙瞰矚瞩矯矫砲炮硃朱硜硁硤硖硨砗硯砚碕埼碩硕碪砧碭砀碸砜確确碼码碽䂵磑硙磚砖磟碌磠硵磣碜磧碛磯矶磽硗磾䃅礄硚礆硷礎础礙碍礦矿礪砺礫砾礬矾礱砻祕秘祘算祿禄禍祸禎祯禕祎禡祃禦御禪禅禮礼禰祢禱祷禿秃秈籼秊年秌秋秖只稅税稈秆稉粳稏䅉稜棱稟禀稬糯稭秸種种稱称稾稿穀谷穇䅟穌稣積积穎颖穠秾穡穑穢秽穤糯穨颓穩稳穫获穭穞穽阱窓窗窩窝窪洼窮穷窯窑窰窑窵窎窶窭窺窥窻窗竄窜竅窍竇窦竈灶竊窃竝并竢俟竪竖競竞筆笔筍笋筞策筧笕筩筒筯箸筴䇲箇个箋笺箏筝箒帚箠棰節节範范築筑篋箧篔筼篛箬篠筿篤笃篩筛篳筚簀箦簍篓簑蓑簒篡簞箪簡简簣篑簫箫簮簪簷檐簹筜簽签簾帘籃篮籌筹籐藤籔䉤籙箓籛篯籜箨籟籁籠笼籤签籩笾籪簖籬篱籮箩籲吁粃秕粧妆粵粤糉粽糝糁糞粪糧粮糰团糲粝糴籴糶粜糹纟糾纠紀纪紂纣約约紅红紆纡紇纥紈纨紉纫紋纹納纳紐纽紓纾純纯紕纰紖纼紗纱紘纮紙纸級级紛纷紜纭紝纴紡纺紥扎紬䌷紮扎細细紱绂紲绁紳绅紵纻紹绍紺绀紼绋紿绐絀绌終终絃弦組组絅䌹絆绊絎绗絏绁結结絕绝絛绦絝绔絞绞絡络絢绚給给絨绒絰绖統统絲丝絳绛絶绝絹绢綁绑綃绡綆绠綈绨綉绣綌绤綏绥綐䌼綑捆經经綜综綞缍綠绿綢绸綣绻綫线綬绶維维綯绹綰绾綱纲網网綳绷綴缀綵彩綸纶綹绺綺绮綻绽綽绰綾绫綿绵緄绲緇缁緊紧緋绯緐繁緑绿緒绪緓绬緔绱緗缃緘缄緙缂線线緜绵緝缉緞缎締缔緡缗緣缘緥褓緦缌編编緩缓緬缅緯纬緱缑緲缈練练緶缏緹缇緻致緼缊縈萦縉缙縊缢縋缒縐绉縑缣縕缊縗缞縛缚縝缜縞缟縟缛縣县縧绦縫缝縭缡縮缩縱纵縲缧縳䌸縴纤縵缦縶絷縷缕縹缥總总績绩繃绷繅缫繆缪繒缯織织繕缮繖伞繙翻繚缭繞绕繡绣繢缋繦襁繩绳繪绘繫系繭茧繮缰繯缳繰缲繳缴繸䍁繹绎繼继繽缤繾缱繿䍀纇颣纈缬纊纩續续纍累纏缠纓缨纔才纖纤纘缵纜缆缐线缽钵罃䓨罇樽罈坛罋瓮罌罂罎坛罰罚罵骂罷罢罸罚羅罗羆罴羈羁羋芈羗羌羢绒羣群羥羟羨羡義义羶膻翄翅習习翫玩翬翚翶翱翹翘翽翙耡锄耬耧耮耢聖圣聞闻聯联聰聪聲声聳耸聵聩聶聂職职聹聍聽听聾聋肅肃肎肯肐胳肧胚胷胸脃脆脅胁脇胁脈脉脗吻脛胫脣唇脩修脫脱脹胀腁胼腎肾腖胨腡脶腦脑腫肿腳脚腸肠膃腽膓肠膕腘膚肤膞䏝膠胶膩腻膽胆膾脍膿脓臈腊臉脸臋臀臍脐臏膑臕膘臘腊臙胭臚胪臝裸臟脏臠脔臢臜臥卧臨临臯皋臺台與与興兴舉举舊旧舖铺舘馆舩船艙舱艢樯艤舣艦舰艪橹艫舻艱艰艷艳芲花芻刍茘荔茲兹荊荆荳豆莊庄莖茎莢荚莧苋華华菴庵菸烟萇苌萊莱萬万萲萱萴荝萵莴葉叶葒荭葠参葤荮葦苇葯药葷荤蒐搜蒓莼蒔莳蒕蒀蒞莅蒼苍蓀荪蓆席蓋盖蓡参蓮莲蓯苁蓴莼蓽荜蔔卜蔕蒂蔘参蔞蒌蔣蒋蔥葱蔦茑蔭荫蕁荨蕆蒇蕎荞蕒荬蕓芸蕕莸蕘荛蕚萼蕢蒉蕩荡蕪芜蕭萧蕷蓣蕿萱薀蕰薈荟薊蓟薌芗薑姜薔蔷薘荙薟莶薦荐薩萨薳䓕薴苧薵䓓薹苔薺荠藍蓝藎荩藝艺藥药藪薮藭䓖藴蕴藶苈藹蔼藺蔺藼萱蘀萚蘄蕲蘆芦蘇苏蘊蕴蘋苹蘐萱蘓苏蘚藓蘞蔹蘢茏蘤花蘭兰蘺蓠蘿萝虆蔂處处虛虚虜虏號号虧亏虯虬蚘蛔蛕蛔蛺蛱蛻蜕蜆蚬蜋螂蜖蛔蜨蝶蝕蚀蝟猬蝦虾蝨虱蝯猿蝱虻蝸蜗螄蛳螎融螞蚂螡蚊螢萤螮䗖螻蝼螿螀蟁蚊蟄蛰蟇蟆蟈蝈蟎螨蟣虮蟬蝉蟯蛲蟲虫蟶蛏蟻蚁蠁蚃蠅蝇蠆虿蠍蝎蠏蟹蠐蛴蠑蝾蠒茧蠔蚝蠟蜡蠣蛎蠨蟏蠭蜂蠱蛊蠶蚕蠻蛮衂衄衆众衇脉衊蔑術术衕同衚胡衛卫衝冲衞卫衺邪袞衮袟帙袵衽裊袅裌袷裏里補补裝装裠裙裡里製制複复褌裈褘袆褭袅褲裤褳裢褸褛褻亵襃褒襇裥襉裥襍杂襏袯襖袄襝裣襠裆襤褴襪袜襬摆襯衬襲袭襴襕覇霸覈核覊羁見见覎觃規规覓觅覔觅視视覘觇覡觋覥觍覦觎覩睹親亲覬觊覯觏覲觐覷觑覺觉覽览覿觌觀观觝抵觴觞觶觯觸触訁讠訂订訃讣計计訊讯訌讧討讨訐讦訒讱訓训訕讪訖讫託托記记訛讹訝讶訟讼訢䜣訣诀訥讷訩讻訪访設设許许訴诉訶诃診诊註注証证詁诂詆诋詎讵詐诈詒诒詔诏評评詖诐詗诇詘诎詛诅詞词詠咏詡诩詢询詣诣試试詩诗詫诧詬诟詭诡詮诠詰诘話话該该詳详詵诜詶酬詼诙詿诖誄诔誅诛誆诓誇夸誌志認认誑诳誒诶誕诞誖悖誘诱誚诮語语誠诚誡诫誣诬誤误誥诰誦诵誨诲說说説说誰谁課课誶谇誹诽誼谊誾訚調调諂谄諄谆談谈諉诿請请諍诤諏诹諑诼諒谅論论諗谂諛谀諜谍諝谞諞谝諡谥諢诨諤谔諦谛諧谐諫谏諭谕諮咨諱讳諳谙諶谌諷讽諸诸諺谚諼谖諾诺謀谋謁谒謂谓謄誊謅诌謊谎謌歌謎谜謐谧謔谑謖谡謗谤謙谦謚谥講讲謝谢謠谣謡谣謨谟謫谪謬谬謭谫謳讴謹谨謾谩譁哗證证譌讹譎谲譏讥譔撰譖谮識识譙谯譚谭譜谱譟噪譫谵譭毁譯译議议譴谴護护譸诪譼䛓譽誉譾谫讀读讁谪讅谉變变讋詟讌䜩讎雠讐雠讒谗讓让讕谰讖谶讚赞讜谠讞谳讬托谘咨豈岂豎竖豐丰豓艳豔艳豬猪豶豮貍狸貓猫貙䝙貛獾貝贝貞贞貟贠負负財财貢贡貧贫貨货販贩貪贪貫贯責责貯贮貰贳貲赀貳贰貴贵貶贬買买貸贷貺贶費费貼贴貽贻貿贸賀贺賁贲賂赂賃赁賄贿賅赅資资賈贾賉恤賊贼賑赈賒赊賓宾賕赇賙赒賚赉賛赞賜赐賞赏賠赔賡赓賢贤賣卖賤贱賦赋賧赕質质賫赍賬账賭赌賰䞐賴赖賵赗賷赍賺赚賻赙購购賽赛賾赜贄贽贅赘贇赟贈赠贊赞贋赝贍赡贏赢贐赆贓赃贔赑贖赎贗赝贛赣贜赃赬赪趂趁趕赶趙赵趨趋趲趱跡迹跥跺踁胫踐践踫碰踰逾踴踊蹌跄蹏蹄蹕跸蹟迹蹠跖蹣蹒蹤踪蹧糟蹵蹴蹺跷躂跶躉趸躊踌躋跻躍跃躎䟢躑踯躒跞躓踬躕蹰躚跹躡蹑躥蹿躦躜躪躏躭耽躳躬躶裸軀躯車车軋轧軌轨軍军軑轪軒轩軔轫軛轭軟软軤轷軫轸軲轱軸轴軹轵軺轺軻轲軼轶軾轼較较輅辂輇辁輈辀載载輊轾輒辄輓挽輔辅輕轻輙辄輛辆輜辎輝辉輞辋輟辍輥辊輦辇輩辈輪轮輬辌輭软輯辑輳辏輸输輻辐輼辒輾辗輿舆轀辒轂毂轄辖轅辕轆辘轉转轍辙轎轿轔辚轟轰轡辔轢轹轤轳辠罪辢辣辤辞辦办辭辞辮辫辯辩農农辳农迴回迻移逈迥逕迳這这連连逥回逩奔逬迸週周進进遉侦遊游運运過过達达違违遙遥遜逊遞递遠远遡溯適适遯遁遲迟遶绕遷迁選选遺遗遼辽邁迈還还邇迩邊边邏逻邐逦郟郏郵邮鄆郓鄉乡鄒邹鄔邬鄖郧鄧邓鄭郑鄰邻鄲郸鄴邺鄶郐鄺邝酇酂酈郦酖鸩酧酬醃腌醆盏醕醇醖酝醜丑醞酝醟蒏醣糖醫医醬酱醯酰醱酦醻酬醼宴釀酿釁衅釃酾釅酽釋释釐厘釒钅釓钆釔钇釕钌釗钊釘钉釙钋針针釣钓釤钐釦扣釧钏釩钒釬焊釵钗釷钍釹钕釺钎釾䥺鈀钯鈁钫鈃钘鈄钭鈅钥鈈钚鈉钠鈍钝鈎钩鈐钤鈑钣鈒钑鈔钞鈕钮鈞钧鈡钟鈣钙鈥钬鈦钛鈧钪鈮铌鈰铈鈳钶鈴铃鈷钴鈸钹鈹铍鈺钰鈽钸鈾铀鈿钿鉀钾鉄铁鉅巨鉆钻鉈铊鉉铉鉋铇鉍铋鉑铂鉕钷鉗钳鉚铆鉛铅鉞钺鉢钵鉤钩鉦钲鉨鿭鉬钼鉭钽鉳锫鉶铏鉸铰鉺铒鉻铬鉿铪銀银銃铳銅铜銍铚銑铣銓铨銖铢銘铭銚铫銛铦銜衔銠铑銣铷銥铱銦铟銨铵銩铥銪铕銫铯銬铐銱铞銲焊銳锐銷销銹锈銻锑銼锉鋁铝鋃锒鋅锌鋇钡鋌铤鋏铗鋒锋鋙铻鋝锊鋟锓鋣铘鋤锄鋥锃鋦锔鋨锇鋩铓鋪铺鋭锐鋮铖鋯锆鋰锂鋱铽鋶锍鋸锯鋼钢錁锞錄录錆锖錇锫錈锩錏铔錐锥錒锕錕锟錘锤錙锱錚铮錛锛錟锬錠锭錡锜錢钱錦锦錨锚錩锠錫锡錮锢錯错録录錳锰錶表錸铼錼镎鍀锝鍁锨鍃锪鍅钫鍆钔鍇锴鍈锳鍊炼鍋锅鍍镀鍔锷鍘铡鍚钖鍛锻鍠锽鍤锸鍥锲鍩锘鍫锹鍬锹鍰锾鍳鉴鍵键鍶锶鍺锗鍼针鍾钟鎂镁鎄锿鎇镅鎊镑鎌镰鎔镕鎖锁鎗枪鎘镉鎚锤鎛镈鎡镃鎢钨鎣蓥鎦镏鎧铠鎩铩鎪锼鎬镐鎭镇鎮镇鎰镒鎲镋鎳镍鎵镓鎶鿔鎸镌鎻锁鎿镎鏃镞鏇旋鏈链鏌镆鏍镙鏐镠鏑镝鏗铿鏘锵鏜镗鏝镘鏞镛鏟铲鏡镜鏢镖鏤镂鏨錾鏰镚鏵铧鏷镤鏹镪鏺䥽鏽锈鐃铙鐋铴鐐镣鐒铹鐓镦鐔镡鐘钟鐙镫鐝镢鐠镨鐥䦅鐦锎鐧锏鐨镄鐫镌鐮镰鐯䦃鐲镯鐳镭鐵铁鐶镮鐸铎鐺铛鐿镱鑄铸鑈鿭鑊镬鑌镔鑑鉴鑒鉴鑔镲鑕锧鑚钻鑛矿鑞镴鑠铄鑣镳鑤刨鑥镥鑭镧鑰钥鑱镵鑲镶鑵罐鑷镊鑹镩鑼锣鑽钻鑾銮鑿凿钁镢钂镋钜巨锺钟镟旋長长門门閂闩閃闪閆闫閈闬閉闭開开閌闶閎闳閏闰閑闲閒闲間间閔闵閘闸閙闹閡阂閣阁閤合閥阀閧哄閨闺閩闽閫阃閬阆閭闾閱阅閲阅閶阊閹阉閻阎閼阏閽阍閾阈閿阌闃阒闆板闇暗闈闱闊阔闋阕闌阑闍阇闐阗闒阘闓闿闔阖闕阙闖闯闚窥關关闞阚闠阓闡阐闢辟闤阛闥闼阨厄阬坑陗峭陘陉陜陕陝陕陞升陣阵陰阴陳陈陸陆陻堙陽阳陿狭隂阴隄堤隉陧隊队階阶隕陨隖坞際际隣邻隨随險险隯陦隱隐隴陇隷隶隸隶隻只雋隽雖虽雙双雛雏雜杂雞鸡離离難难雲云電电霑沾霢霡霧雾霽霁靂雳靄霭靆叇靈灵靉叆靚靓靜静靝靔靦腼靨靥靭韧靱韧鞀鼗鞏巩鞝绱鞦秋鞵鞋鞽鞒韁缰韃鞑韆千韈袜韉鞯韋韦韌韧韍韨韓韩韙韪韜韬韝鞲韞韫韤袜韮韭韻韵響响頁页頂顶頃顷項项順顺頇顸須须頊顼頌颂頎颀頏颃預预頑顽頒颁頓顿頗颇領领頜颌頟额頡颉頤颐頦颏頭头頮颒頰颊頲颋頴颕頷颔頸颈頹颓頻频頼赖頽颓顆颗顇悴顋腮題题額额顎颚顏颜顒颙顓颛顔颜願愿顙颡顛颠類类顢颟顥颢顦憔顧顾顫颤顬颥顯显顰颦顱颅顳颞顴颧風风颭飐颮飑颯飒颱台颳刮颶飓颸飔颺飏颻飖颼飕飀飗飃飘飄飘飆飙飈飚飛飞飜翻飠饣飢饥飣饤飤饲飥饦飩饨飪饪飫饫飭饬飯饭飱飧飲饮飴饴飼饲飽饱飾饰飿饳餁饪餃饺餄饸餅饼餈糍餉饷養养餌饵餎饹餏饻餑饽餒馁餓饿餕馂餖饾餘余餚肴餛馄餜馃餞饯餡馅館馆餬糊餱糇餳饧餵喂餶馉餷馇餹糖餺馎餻糕餼饩餽馈餾馏餿馊饁馌饃馍饅馒饈馐饉馑饊馓饋馈饌馔饍膳饑饥饒饶饗飨饜餍饝馍饞馋饢馕馀余馬马馭驭馮冯馱驮馳驰馴驯馹驲駁驳駈驱駐驻駑驽駒驹駔驵駕驾駘骀駙驸駛驶駝驼駟驷駡骂駢骈駭骇駰骃駱骆駸骎駿骏騁骋騂骍騅骓騌骔騍骒騎骑騏骐騐验騖骛騙骗騣鬃騤骙騧䯄騫骞騭骘騮骝騰腾騶驺騷骚騸骟騾骡驀蓦驁骜驂骖驃骠驄骢驅驱驊骅驌骕驍骁驏骣驕骄驗验驘骡驚惊驛驿驟骤驢驴驤骧驥骥驦骦驪骊驫骉骯肮骽腿骾鲠髈膀髏髅髒脏體体髕髌髖髋髥髯髮发鬀剃鬆松鬉鬃鬍胡鬚须鬢鬓鬥斗鬦斗鬧闹鬨哄鬩阋鬪斗鬮阄鬰郁鬱郁鬹鬶魎魉魘魇魚鱼魛鱽魢鱾魨鲀魯鲁魴鲂魷鱿魺鲄鮁鲅鮃鲆鮊鲌鮋鲉鮍鲏鮎鲇鮐鲐鮑鲍鮒鲋鮓鲊鮚鲒鮜鲘鮝鲞鮞鲕鮣䲟鮦鲖鮪鲔鮫鲛鮭鲑鮮鲜鮳鲓鮶鲪鮺鲝鯀鲧鯁鲠鯇鲩鯉鲤鯊鲨鯒鲬鯔鲻鯕鲯鯖鲭鯗鲞鯛鲷鯝鲴鯡鲱鯢鲵鯤鲲鯧鲳鯨鲸鯪鲮鯫鲰鯰鲶鯴鲺鯷鳀鯽鲫鯿鳊鰁鳈鰂鲗鰃鳂鰆䲠鰈鲽鰉鳇鰌䲡鰍鳅鰏鲾鰐鳄鰒鳆鰓鳃鰛鳁鰜鳒鰟鳑鰠鳋鰣鲥鰥鳏鰧䲢鰨鳎鰩鳐鰭鳍鰮鳁鰱鲢鰲鳌鰳鳓鰵鳘鰷鲦鰹鲣鰺鲹鰻鳗鰼鳛鰾鳔鱂鳉鱅鳙鱈鳕鱉鳖鱒鳟鱔鳝鱖鳜鱗鳞鱘鲟鱝鲼鱟鲎鱠鲙鱣鳣鱤鳡鱧鳢鱨鲿鱭鲚鱯鳠鱷鳄鱸鲈鱺鲡鳥鸟鳧凫鳩鸠鳬凫鳲鸤鳳凤鳴鸣鳶鸢鳾䴓鴆鸩鴇鸨鴈雁鴉鸦鴒鸰鴕鸵鴛鸳鴝鸲鴞鸮鴟鸱鴣鸪鴦鸯鴨鸭鴯鸸鴰鸹鴴鸻鴷䴕鴻鸿鴿鸽鵁䴔鵂鸺鵃鸼鵐鹀鵑鹃鵒鹆鵓鹁鵜鹈鵝鹅鵞鹅鵠鹄鵡鹉鵪鹌鵬鹏鵮鹐鵯鹎鵰雕鵲鹊鵶鸦鵷鹓鵾鹍鶄䴖鶇鸫鶉鹑鶊鹒鶓鹋鶖鹙鶘鹕鶚鹗鶡鹖鶥鹛鶩鹜鶪䴗鶬鸧鶯莺鶲鹟鶴鹤鶹鹠鶺鹡鶻鹘鶼鹣鶿鹚鷀鹚鷁鹢鷂鹞鷄鸡鷈䴘鷉䴘鷊鹝鷓鹧鷖鹥鷗鸥鷙鸷鷚鹨鷥鸶鷦鹪鷫鹔鷯鹩鷰燕鷲鹫鷳鹇鷴鹇鷸鹬鷹鹰鷺鹭鷽鸴鸂㶉鸇鹯鸊䴙鸌鹱鸎莺鸏鹲鸕鸬鸘鹴鸚鹦鸛鹳鸝鹂鸞鸾鹵卤鹹咸鹺鹾鹻碱鹼碱鹽盐麗丽麥麦麩麸麪面麫面麯曲麴曲麵面麹曲麺面麼么麽么黃黄黌黉點点黨党黲黪黴霉黶黡黷黩黽黾黿鼋鼂鼌鼃蛙鼇鳌鼈鳖鼉鼍鼕冬鼴鼹齊齐齋斋齎赍齏齑齒齿齔龀齕龁齗龂齙龅齜龇齟龃齠龆齡龄齣出齦龈齧啮齪龊齬龉齲龋齶腭齷龌龍龙龎厐龐庞龑䶮龔龚龕龛龜龟鿁䜤鿐䲤鿓鿒";
  /* INLINE_H2S:END */

  /* INLINE_TW2CN:BEGIN */
const INLINE_TW2CN = [
    ["Path of Building 匯入代碼", "Path of Building 导入代码"],
    ["冷卻時間恢復 II", "冷却回复 II"],
    ["在 PoB 中開啟", "在 PoB 中打开"],
    ["延長持續時間 II", "持续时间延长 II"],
    ["縮短持續時間 II", "持续时间压缩 II"],
    ["最終幻象.納維拉", "终末幻影"],
    ["召喚物契約 II", "召唤契约 II"],
    ["和諧的痕跡 II", "和谐残迹 II"],
    ["延長持續時間 I", "持续时间延长 I"],
    ["彈藥保存 III", "节省弹药 III"],
    ["應急圖騰 III", "紧急图腾 III"],
    ["極速苦痛 III", "极速腐化 III"],
    ["正在載入天賦樹…", "正在加载天赋树…"],
    ["永恆烈焰 III", "长明烈焰 III"],
    ["煉獄軍團 III", "炎军 III"],
    ["疾速攻擊 III", "快速攻击 III"],
    ["疾速施法 III", "快速施法 III"],
    ["痕跡強度 III", "残片效能 III"],
    ["縮短持續時間 I", "持续时间压缩 I"],
    ["護甲破壞 III", "护甲破损 III"],
    ["赤炎利劍.魯兹安", "炽焰之剑"],
    ["逐漸增強 III", "渐入佳境 III"],
    ["連擊終結輔助 I", "连击终结 I"],
    ["黯染飛砂.克拉里", "污秽沙暴"],
    ["仙饌蜜酒 II", "仙馔 II"],
    ["使用護符時施放", "使用咒符时施放"],
    ["元素武裝 II", "元素军械 II"],
    ["充能滿盈 II", "能量球激增 II"],
    ["全新彈夾 II", "新装箭匣 II"],
    ["分岔裂縫 II", "分叉裂缝 II"],
    ["匯出到 PoB", "导出到 PoB"],
    ["召喚物契約 I", "召唤契约 I"],
    ["召喚物擴散II", "召唤生物溅射伤害 II"],
    ["和諧的痕跡 I", "和谐残迹 I"],
    ["埃哈的野獸儀式", "伊恩哈尔的魔物仪式"],
    ["堅忍衝擊 II", "持续冲击 II"],
    ["增幅光環 II", "范围扩大 II"],
    ["實用魔法 II", "实用魔法II"],
    ["強化圖騰 II", "增强图腾 II"],
    ["彈藥保存 II", "节省弹药 II"],
    ["應急圖騰 II", "紧急图腾 II"],
    ["持續地面 II", "持久地面 II"],
    ["文件與常見問題", "文档与常见问题"],
    ["新星投射物II", "新星投射物 II"],
    ["極惡打擊 II", "蛮勇打击 II"],
    ["極速苦痛 II", "极速腐化 II"],
    ["機會之窗 II", "大好时机 II"],
    ["死亡標記 II", "死亡印记 II"],
    ["殘片圖騰 II", "碎片图腾 II"],
    ["汲取印記 II", "虹吸印记II"],
    ["活躍閃電 II", "活体闪电 II"],
    ["海爾賓姆的躲藏", "赫尔布林的隐瞒"],
    ["激怒戰吼 II", "燃怒战吼 II"],
    ["烏特雷的占卜術", "乌崔德的占卜"],
    ["無情暴擊 II", "命定绝杀 II"],
    ["無懼先鋒 II", "先锋 II"],
    ["無盡能量 II", "无边能量 II"],
    ["煉獄軍團 II", "炎军 II"],
    ["燒灼烈焰 II", "焚躯烈焰 II"],
    ["特克羅德的復仇", "特克罗的复仇"],
    ["獻祭羔羊 II", "替罪羔羊 II"],
    ["瓜特利斯的消融", "瓜铁雷兹的消融"],
    ["瓦拉什塔的祝福", "瓦拉煞的祝福"],
    ["疾速攻擊 II", "快速攻击 II"],
    ["疾速施法 II", "快速施法 II"],
    ["痕跡強度 II", "残片效能 II"],
    ["碎裂地面 II", "崎岖之地 II"],
    ["穩若泰山 II", "坚定 II"],
    ["荊棘之皮 II", "荆棘皮肤 II"],
    ["萊基亞塔的流動", "拉其塔之流"],
    ["豢養狂熱 II", "狂噬 II"],
    ["逐漸增強 II", "渐入佳境 II"],
    ["重新佈署 II", "重新武装 II"],
    ["野性碎片 II", "狂野碎片 II"],
    ["阿姆那姆的稅賦", "阿曼娜姆的奉纳"],
    ["阿特路伊的出血", "阿图鲁伊的放血术"],
    ["飛掠之石 II", "飞掠石 II"],
    ["骷髏馬克的支配", "库勒马克的统治"],
    ["仲裁者的燃灼", "仲裁官的点燃"],
    ["伊歐涅的雷霆", "伊奥尼尔的雷霆"],
    ["元素武裝 I", "元素军械 I"],
    ["先祖怒嚎 I", "先祖召唤 I"],
    ["克拉里的審判", "凯拉里之审判"],
    ["克拉里的惡言", "凯拉里之诅咒"],
    ["克拉里的欺瞞", "凯拉里之诡计"],
    ["勁風蝮蛇之怒", "腾蛇之怒"],
    ["包覆於翠玉中", "青玉囚笼"],
    ["卡塔爾的恢復", "卡哈塔的复苏"],
    ["卡洛翰的決心", "格鲁坎的决心"],
    ["卡莉莎的漸強", "卡莉莎的强音"],
    ["卡蘭德的魔鏡", "卡兰德的魔镜"],
    ["厄羅克的鍛鍊", "厄罗克的熔炼术"],
    ["召喚物擴散I", "召唤生物溅射伤害 I"],
    ["召喚獄炎獵犬", "召唤炽焰猎犬"],
    ["堅忍衝擊 I", "持续冲击 I"],
    ["塔赫亞的照顧", "塔赫亚的照料"],
    ["增幅光環 I", "范围扩大 I"],
    ["壓倒性的存在", "压迫气场"],
    ["夏烏拉統治者", "夏乌拉执政官"],
    ["實用魔法 I", "实用魔法I"],
    ["布魯特斯的腦", "布鲁特斯之脑"],
    ["帕科特的協議", "帕夸特的契约"],
    ["強化命中 I", "精准增强 I"],
    ["強化圖騰 I", "增强图腾 I"],
    ["強化電球II", "强化火花 II"],
    ["彈藥保存 I", "节省弹药 I"],
    ["快速打擊背心", "滑击背心"],
    ["恢復 III", "助力之风 III"],
    ["感電傳導II", "感电传导 II"],
    ["拳霸 III", "战争铁拳 III"],
    ["極惡打擊 I", "蛮勇打击 I"],
    ["極速苦痛 I", "极速腐化 I"],
    ["機會之窗 I", "大好时机 I"],
    ["殘片圖騰 I", "碎片图腾 I"],
    ["殺戮渴望II", "杀戮快感II"],
    ["永恆烈焰 I", "长明烈焰 I"],
    ["汲取異常狀態", "异常状态吸收"],
    ["澤洛克的克制", "扎洛卡的克制"],
    ["澤洛克的反叛", "扎洛卡的反叛"],
    ["激怒戰吼 I", "燃怒战吼 I"],
    ["灼炎扇舞II", "煽风点火II"],
    ["烏特雷的出走", "乌崔德的出走"],
    ["烏特雷的徵兆", "乌崔德的预兆"],
    ["無情暴擊 I", "命定绝杀 I"],
    ["無盡能量 I", "无边能量 I"],
    ["煉獄軍團 I", "炎军 I"],
    ["爆發沼地蟾蜍", "爆裂沼蟾"],
    ["特卡蒂的憤怒", "塔卡提之怒"],
    ["獻祭羔羊 I", "替罪羔羊 I"],
    ["瓦拉什塔門徒", "瓦拉煞的门徒"],
    ["瓦特爾的復仇", "巴蒂尔的复仇"],
    ["疾速攻擊 I", "快速攻击 I"],
    ["疾速施法 I", "快速施法 I"],
    ["盛怒 III", "狂怒 III"],
    ["盛怒鍛造 I", "怒火锤炼 I"],
    ["碎裂地面 I", "崎岖之地 I"],
    ["納維拉的封凍", "纳薇拉之裂"],
    ["納維拉的水井", "纳薇拉之井"],
    ["納維拉的綠洲", "纳薇拉之绿洲"],
    ["聯合 III", "相性 III"],
    ["致命毒藥 I", "中毒 I"],
    ["范尼達的奮進", "薇伦塔之推进"],
    ["荊棘之皮 I", "荆棘皮肤 I"],
    ["荷霖蔡的轟鳴", "海幽夏的诛罚"],
    ["薩雷許的折磨", "伊克切尔的折磨"],
    ["西奧妮的鍛鍊", "西奥妮的怒火"],
    ["西瑞爾的耕植", "西雷尔的教化"],
    ["豢養狂熱 I", "狂噬 I"],
    ["賽巴昆的撕裂", "夏巴夸亚的撕裂"],
    ["追擊 III", "迫近追逐 III"],
    ["逐漸增強 I", "渐入佳境 I"],
    ["過剩 III", "冗余 III"],
    ["遠程射擊 I", "远射 I"],
    ["重新佈署 I", "重新武装 I"],
    ["野性碎片 I", "剧变 I"],
    ["釘身 III", "定身 III"],
    ["阿茲里的共融", "阿兹里的圣礼"],
    ["風暴呼喚箭矢", "唤雷箭"],
    ["飛掠之石 I", "飞掠石 I"],
    ["飛速生長II", "迅猛绽放II"],
    ["骷髏風暴法師", "魔侍风暴法师"],
    ["魔甘娜的風暴", "莫甘娜的暴风"],
    ["魯兹安的怒火", "鲁詹之怒火"],
    ["魯兹安的清算", "鲁詹之清算"],
    ["魯兹安的陷阱", "鲁詹之陷阱"],
    ["鮮血獵犬印記", "血犬印记"],
    ["黏性擲彈 I", "胶粘榴弹 I"],
    ["冰凍時施放", "冻结时施放"],
    ["出價 II", "奉命 II"],
    ["刺骨冰霜I", "刺骨寒意 I"],
    ["召喚物專精", "召唤生物专精"],
    ["堅忍 II", "野性残暴 III"],
    ["堡壘 II", "坚城 II"],
    ["報復 II", "反击 II"],
    ["奇塔弗工匠", "奇塔弗匠师"],
    ["奸笑鬣狗群", "鬣狗同伴"],
    ["岡姆的癲狂", "冈姆的疯狂"],
    ["巨大召喚物", "魁梧仆从"],
    ["延遲滿足感", "延迟满足"],
    ["強化電球I", "强化火花 I"],
    ["恢復 II", "助力之风 II"],
    ["懸賞 II", "丰饶 II"],
    ["托沃的寧靜", "托沃的寂静"],
    ["拾荒者護板", "装甲回收"],
    ["搜尋物品…", "搜索物品…"],
    ["效率 II", "效能 II"],
    ["易怒 II", "短暂引信 II"],
    ["時空幻術師", "塑时术师"],
    ["柯戈的繩索", "古加尔的缰绳"],
    ["極盛 II", "天顶 II"],
    ["歐辛的誓言", "奥辛之誓"],
    ["流血混合物", "创伤灵药"],
    ["湧升流 I", "升流 II"],
    ["漢恩的城塞", "吟唱汉恩的城塞"],
    ["灼炎扇舞I", "煽风点火"],
    ["烈性混合物", "雷鸣灵药"],
    ["煉金師恩惠", "炼金师的恩典"],
    ["狙擊者印記", "狙击印记"],
    ["瑞佛的狂暴", "瑞佛的凶猛"],
    ["發狂召喚物", "癫狂召唤生物"],
    ["盛怒 II", "狂怒 II"],
    ["碎片清除者", "碎片回收"],
    ["神主的掌握", "神主之握"],
    ["秘術 II", "灵秘 II"],
    ["粉碎混合物", "碎冰灵药"],
    ["索伏的燃焰", "索伏的葬火"],
    ["能量球增強", "强化能量球"],
    ["艾許的光芒", "艾许的光辉"],
    ["萌發 II", "赤炼"],
    ["處刑 II", "处决 II"],
    ["褻瀆 II", "不敬 II"],
    ["調製 II", "调和术 II"],
    ["追擊 II", "迫近追逐 II"],
    ["邊緣 II", "崩溃边缘 II"],
    ["長引線 I", "加长引线 I"],
    ["閃避時施放", "躲闪时施放"],
    ["雙管 II", "双管齐下 II"],
    ["食人 II", "吞灵 II"],
    ["骷髏狙擊手", "魔侍神射手"],
    ["骷髏縱火者", "魔侍焚焰使"],
    ["不屈之心", "强健心灵"],
    ["仙饌蜜酒", "仙馔"],
    ["低信心度", "低置信度"],
    ["倒刺 I", "荆棘倒刺 I"],
    ["偏轉機率", "偏转几率"],
    ["催化元素", "元素催化"],
    ["傳導符文", "导电符文"],
    ["儀式行者", "仪祭师"],
    ["儀式詛咒", "仪祭诅咒"],
    ["元素專注", "元素集中"],
    ["元素崩裂", "元素碎裂"],
    ["元素波動", "元素涌动"],
    ["元素祈願", "元素祈求"],
    ["元素軍隊", "元素大军"],
    ["充能滿盈", "能量球激增"],
    ["充能調節", "能量球调节"],
    ["先祖之魂", "先祖之灵"],
    ["先聲奪人", "起手式"],
    ["共鳴之盾", "共振护盾"],
    ["冰冷同調", "冰霜协调"],
    ["冰冷專精", "冰霜专精"],
    ["冰冷曝曬", "冰霜曝露"],
    ["冰冷穿透", "冰霜穿透"],
    ["冰凍之叉", "冻结分叉"],
    ["冰凍裂片", "急冻碎片"],
    ["冰川之槍", "冰川长枪"],
    ["冰鏃箭矢", "冰尖箭矢"],
    ["冰霜之捷", "寒冰之捷"],
    ["冰霜匯聚", "封冻枢纽"],
    ["冷酷之宴", "饕餮飨宴"],
    ["凋零光環", "凋零姿态"],
    ["凍結怨恨", "冰冻怨恨"],
    ["劇烈爆發", "轰鸣烈焰"],
    ["劇烈苦痛", "剧烈痛苦"],
    ["匕首刺擊", "匕首突刺"],
    ["午夜飛掠", "午夜翱翔"],
    ["卑鄙手段", "粗俗手段"],
    ["博弈射擊", "投机射击"],
    ["危險抑制", "受控危技"],
    ["反抗之旗", "抗争战旗"],
    ["古靈軍團", "古灵使徒斗士"],
    ["召喚惡狼", "狼群"],
    ["可趁之刻", "脆弱瞬间"],
    ["咒符之力", "威能法印"],
    ["咒術枯萎", "魔蛊爆炸"],
    ["咒術綻放", "魔蛊绽放"],
    ["堅韌之吼", "坚韧战吼"],
    ["堡壘 I", "坚城 I"],
    ["報復 I", "反击 I"],
    ["增強詛咒", "强效诅咒"],
    ["壞滅災變", "天灾"],
    ["天啟先知", "神谕者"],
    ["女巫獵人", "猎巫人"],
    ["子彈如流", "流线弹药"],
    ["完美打擊", "完美一击"],
    ["寒冰蔓延", "蔓延霜寒"],
    ["寒霜之鏢", "冰霜飞镖"],
    ["寶石稜鏡", "宝石棱镜"],
    ["專注詛咒", "聚焦诅咒"],
    ["屍體保存", "灵柩留存"],
    ["屏障祈願", "屏障咒言"],
    ["崛起風暴", "风暴骤起"],
    ["幻化武器", "显化武器"],
    ["幻影箭矢", "幻灵箭"],
    ["幻影銳眼", "蜃影神射"],
    ["廣闊區域", "开疆"],
    ["延遲反應", "延迟激活"],
    ["弓箭射擊", "弓射击"],
    ["強力曝曬", "闪电曝露"],
    ["強化聚能", "过载"],
    ["恐怖之柱", "阴森之柱"],
    ["惡魔變身", "走火入魔"],
    ["意志斷片", "命源碎片"],
    ["意志轉換", "命源交换"],
    ["戰爭之旗", "战旗"],
    ["打擊練習", "角力"],
    ["拳霸 I", "战争铁拳 I"],
    ["持續感電", "感电"],
    ["推進風暴", "风暴行军"],
    ["搜尋物品", "搜索物品"],
    ["撕裂頂點", "撕裂巅峰"],
    ["撲殺 I", "终结 I"],
    ["撲殺弱者", "终结弱者"],
    ["攻其之弱", "开发要害"],
    ["效率 I", "效能 I"],
    ["旋風之槍", "旋风投枪"],
    ["日耀長矛", "日耀之矛"],
    ["易碎鎧甲", "脆弱护甲"],
    ["星空投影", "星界投射"],
    ["智勇軍師", "战术家"],
    ["暗夜血契", "暗夜契约"],
    ["暴擊機率", "暴击几率"],
    ["暴露戰吼", "持久地面 I"],
    ["木質外膚", "树肤术"],
    ["未來昔日", "未来的过去"],
    ["末日厄運", "末日将至"],
    ["極盛 I", "天顶 I"],
    ["檢視資料", "查看资料"],
    ["死亡標記", "死亡印记"],
    ["死亡行進", "终末行军"],
    ["死懼碎擊", "恐惧终结"],
    ["殘猛狂怒", "凶蛮怒火"],
    ["殘留幻象", "徘徊幻影"],
    ["殺人意圖", "坚韧磨砺"],
    ["殺戮渴望", "杀戮快感"],
    ["每頁列數", "每页行数"],
    ["毒氣箭矢", "瓦斯之箭"],
    ["毒爆箭矢", "毒爆箭"],
    ["毒素植栽", "剧毒增生"],
    ["毒素領域", "毒性领域"],
    ["永久咒術", "恒远魔蛊"],
    ["永恆充能", "永续充能"],
    ["汲取印記", "虹吸印记"],
    ["沉重揮擊", "沉重挥舞"],
    ["法師之血", "法师之血"],
    ["法術迴響", "施法回响"],
    ["活躍閃電", "活体闪电"],
    ["活體炸彈", "活动炸弹"],
    ["深度冰凍", "深度冻结"],
    ["深淵冥約", "深渊契约"],
    ["混沌冰凍", "混沌冻结"],
    ["混沌同調", "混沌协调"],
    ["混沌弩箭", "混沌箭"],
    ["混沌波動", "混沌涌动"],
    ["滿腔熱血", "温热血脉"],
    ["火焰同調", "火焰协调"],
    ["火焰曝曬", "火焰曝露"],
    ["火熱死寂", "炽灭"],
    ["灵魂獻祭", "灵之奉献"],
    ["炎火脈動", "火山裂缝"],
    ["烈焰穿透", "烈焰穿刺"],
    ["無盡怒火", "永恒狂怒"],
    ["無私痕跡", "无我残片"],
    ["煉獄戰吼", "炽焰战吼"],
    ["熔岩屏障", "岩浆屏障"],
    ["熔岩破滅", "熔岩冲击"],
    ["熔火噴濺", "熔岩骤雨"],
    ["熔火爆破", "熔岩爆裂"],
    ["燃焰暴擊", "炽烈绝杀"],
    ["爆炸轉化", "烈性转化"],
    ["爆炸長矛", "爆破战矛"],
    ["爆燃銘文", "燃烧铭文"],
    ["爆破箭矢", "爆破箭"],
    ["犧牲奉獻", "牺牲供奉"],
    ["狂亂反擊", "狂怒反击"],
    ["狂徒薩滿", "萨满"],
    ["瓦爾寶珠", "瓦尔宝珠"],
    ["生命吸取", "生命榨取"],
    ["生命恩惠", "生命丰沛"],
    ["生命痕跡", "生命残片"],
    ["病疫之難", "瘟疫使者"],
    ["瘟疫之捷", "荒芜之捷"],
    ["目前價格", "当前价格"],
    ["眾神之錘", "诸天之锤"],
    ["碎地重擊", "尖刺战吼"],
    ["磁化電極", "电磁力场"],
    ["神聖血統", "神圣降临"],
    ["神諭之狂", "疯魔先驱"],
    ["秘能波動", "秘术增强"],
    ["秘能爆發", "多重范围施法"],
    ["秘術 I", "灵秘 I"],
    ["空無共鳴", "虚空和鸣"],
    ["空無型態", "虚空魅影"],
    ["空無專注", "虚空钟灵"],
    ["空無披甲", "虚空之壳"],
    ["精確暴擊", "精准暴击"],
    ["精神錯亂", "错乱"],
    ["精髓收割", "收割精华"],
    ["細思施法", "审慎施法"],
    ["細杖打擊", "节杖打击"],
    ["結晶碎片", "水晶碎片"],
    ["絕對堅毅", "完美耐力"],
    ["絕滅恨惡", "怨毒"],
    ["緩速強度", "减速效能"],
    ["翻騰重擊", "轰动猛击"],
    ["能量保留", "能量保存"],
    ["脫離戰鬥", "退避三舍"],
    ["腐朽咒術", "衰颓魔蛊"],
    ["臨終恐息", "亡命之息"],
    ["致命之息", "灵体火球"],
    ["苦澀衰亡", "苦涩死亡"],
    ["荒林禮贈", "荒林之赐"],
    ["萌發 I", "迅猛增幅 I"],
    ["蒺藜之徑", "铁蒺藜之路"],
    ["藤蔓箭矢", "藤缠箭"],
    ["處刑 I", "处决 I"],
    ["螺旋之弦", "螺旋齐射"],
    ["裂地戰吼", "震地战吼"],
    ["詛咒地面", "诅咒之地"],
    ["調製 I", "调和术 I"],
    ["護甲碎擊", "摧甲重击"],
    ["貪婪蟲群", "饕餮虫群"],
    ["資料下載", "数据下载"],
    ["資料來源", "数据来源"],
    ["超能新星", "衰颓新星"],
    ["超載重擊", "蓄威神锤"],
    ["載入中…", "加载中…"],
    ["載入更多", "加载更多"],
    ["迴響戰吼", "回荡战嚎"],
    ["迷霧渡鴉", "雾鸦"],
    ["追擊 I", "迫近追逐 I"],
    ["逃脫之矢", "逃脱射击"],
    ["進逼地面", "侵蚀地面"],
    ["遁入裂痕", "投身裂隙"],
    ["過分擴張", "竭力痛击"],
    ["過剩 I", "冗余 I"],
    ["遞增之毒", "毒性加剧"],
    ["重新整理", "刷新"],
    ["釘身 I", "定身 I"],
    ["鋼鐵守護", "钢铁看守"],
    ["鏈錘打擊", "锤打击"],
    ["鏡之殿堂", "镜之殿堂"],
    ["鏡面折射", "折射之镜"],
    ["長矛之錐", "枪林矛阵"],
    ["閃避機率", "闪避几率"],
    ["閃電同調", "闪电协调"],
    ["閃電長矛", "闪电战矛"],
    ["集中範圍", "范围集中"],
    ["雙管 I", "双管齐下 I"],
    ["雙靈波動", "双灵涌动"],
    ["雷神之怒", "雷霆神祇之怒"],
    ["雷霆之杖", "引雷针"],
    ["雷霆跳躍", "雷鸣飞跃"],
    ["雷鳴湍流", "奔雷疾走"],
    ["電光領域", "电流场"],
    ["電擊虹吸", "感电虹吸"],
    ["電極箭矢", "电殛箭"],
    ["電流印記", "流电印记"],
    ["電流屏障", "霹雳屏障"],
    ["電磁齊射", "磁性齐射"],
    ["電鍊箭矢", "连环震击箭"],
    ["震盪法術", "冲击法术"],
    ["霜火新星", "霜焰新星"],
    ["靈活裝填", "敏捷装填"],
    ["靈魂吸取", "精华吸取"],
    ["靜電震盪", "静电脉冲"],
    ["預告射擊", "言出箭随"],
    ["風暴之槍", "岚舞长枪"],
    ["風暴之鏈", "风暴连锁"],
    ["風魔舞者", "风舞者"],
    ["飛速生長", "迅猛绽放"],
    ["食人 I", "吞灵 I"],
    ["驟羽爆發", "棘刺爆发"],
    ["骨之爆破", "针刺爆发"],
    ["骷髏之舞", "死亡之舞"],
    ["骷髏巨獸", "魔侍蛮兵"],
    ["骷髏战士", "魔侍武士"],
    ["骷髏牧師", "魔侍祭司"],
    ["高尚禦盾", "美德壁垒"],
    ["魔力器皿", "魔力源泉"],
    ["魔力恩惠", "魔力丰沛"],
    ["魔力痕跡", "魔力残片"],
    ["魔力閃焰", "魔力耀斑"],
    ["鮮血之捷", "赤血之捷"],
    ["鮮血器皿", "血脉源泉"],
    ["鮮血狩獵", "猎血寻腥"],
    ["信心度", "置信度"],
    ["女獵人", "女猎手"],
    ["女術者", "魔巫"],
    ["安魂曲", "镇魂曲"],
    ["寂纏彈", "盘绕魔弹"],
    ["恢復期", "康复"],
    ["打帶跑", "连打带跑"],
    ["抑制劑", "抑制器"],
    ["搜尋…", "搜索…"],
    ["斧鉞斬", "斧挥砍"],
    ["日耀球", "日曜球"],
    ["未汙染", "未腐化"],
    ["混合劑", "混合物"],
    ["烈風暴", "风暴之炎"],
    ["爆裂物", "爆破灵药"],
    ["獄火師", "驱炎师"],
    ["祈靈者", "祈求者"],
    ["神聖石", "神圣石"],
    ["血法師", "命源法师"],
    ["製圖釘", "制图钉"],
    ["超暴擊", "特化暴击"],
    ["載入中", "加载中"],
    ["迴旋斬", "回旋挥斩"],
    ["透勁拳", "击穿"],
    ["連結石", "连接石"],
    ["重鑄石", "重铸石"],
    ["隕石坑", "陨坑"],
    ["亢奮", "闪电支配"],
    ["交鋒", "形势逆转"],
    ["僥倖", "运势"],
    ["僧侶", "行者"],
    ["儲能", "能量电容"],
    ["冥想", "凝神思"],
    ["冰凍", "冻结"],
    ["冰柱", "冰刺"],
    ["冰河", "冰川"],
    ["冰淞", "雨淞"],
    ["分量", "势大力沉"],
    ["切割", "创口"],
    ["切除", "净除"],
    ["匯入", "导入"],
    ["匯出", "导出"],
    ["召集", "海纳百川"],
    ["咒怨", "怨恨"],
    ["嗜血", "血怒"],
    ["套用", "应用"],
    ["宣洩", "泄除"],
    ["導雷", "闪电通道"],
    ["峽谷", "狼吞虎咽"],
    ["帳號", "账号"],
    ["彗星", "彗星落"],
    ["憐憫", "以己度人"],
    ["承載", "子母弹"],
    ["抽血", "赤炼魔光"],
    ["提取", "萃取"],
    ["撕毀", "撕裂"],
    ["撕裂", "撕扯"],
    ["收割", "赤炼收割"],
    ["旋風", "旋龙"],
    ["易爆", "无常"],
    ["欄位", "列"],
    ["毒辣", "尖刻"],
    ["比較", "对比"],
    ["沙漏", "时之沙漏"],
    ["激怒", "苦寒之意"],
    ["火彈", "火焰弹"],
    ["無畏", "不动如山"],
    ["燐火", "野火"],
    ["爪擊", "重殴"],
    ["犧牲", "献祭"],
    ["狂戰", "盛怒"],
    ["獵首", "猎首"],
    ["疾病", "错乱病症"],
    ["登入", "登录"],
    ["碎骨", "七伤破"],
    ["耐久", "耐久度"],
    ["衰敗", "腐蚀"],
    ["解脫", "深渊心爆"],
    ["設定", "设置"],
    ["誡命", "调遣"],
    ["踐踏", "奔踏"],
    ["遞增", "升序"],
    ["遞減", "降序"],
    ["醫生", "医生"],
    ["釋放", "释出"],
    ["重設", "重置"],
    ["開啟", "打开"],
    ["陰爪", "斜掠"],
    ["雷彈", "闪电"],
    ["電刑", "触电"],
    ["項鍊", "项链"],
    ["馴獸", "驯服野兽"],
    ["骨片", "钙质碎片"]
  ];
  /* INLINE_TW2CN:END */

  /* ============================================================
   * 3. 运行时状态
   * ========================================================== */
  const state = {
    ready: false,
    lang: GM.get(K_LANG, 'cn'),            // 'cn' | 'tw' | 'off'
    // 是否翻译接口数据（页面自己 /api/ 返回的 JSON）。
    // 默认关闭：poe.ninja 会用 name 字段去查技能图标与描述，改成中文后查不到，
    // 技能就会丢图标和描述。DOM 层在渲染后改文本，不影响这些查询，所以默认走 DOM。
    apiData: GM.get(K_APIDATA, false),     // 是否翻译接口数据
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
    // 技能/辅助宝石：简体与繁体译名不同（编年史两套翻译），分别填充
    for (const row of INLINE_GEMS) {
      const [en, cn, tw] = row;
      if (!en) continue;
      if (cn) state.ui.cn[en] = cn;
      if (tw) state.ui.tw[en] = tw;
      else if (cn) state.ui.tw[en] = cn;   // 繁体缺失时回退简体，总比不翻好
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

  /* ------------------------------------------------------------
   * 官方繁体 → 简体中文（v2 的核心）
   *
   * poe.ninja 自 2026-10-30 起提供官方繁體中文版，页面文字已是中文。
   * 所以不再需要「英文 → 中文」的大词库替换，改成分两层：
   *   ① 词汇层：官方繁体用词 → 国服简体用词（如 鋼鐵守護 → 钢铁看守）
   *   ② 字形层：剩余繁体字逐字转简（如 風 → 风）
   * 腾讯国服覆盖层 data/tencent.json 已合并进词汇表，优先级最高。
   * ---------------------------------------------------------- */
  const H2S = Object.create(null);
  for (let i = 0; i + 1 < H2S_PACKED.length; i += 2) {
    H2S[H2S_PACKED[i]] = H2S_PACKED[i + 1];
  }

  // 词汇层按首字建索引，候选按长度降序 → 扫描时做最长匹配
  const TW2CN_BY_HEAD = Object.create(null);
  let TW2CN_MAXLEN = 0;
  let tencentAugmented = 0;      // 运行时由腾讯国服简体补进来的条数

  function addTw2Cn(tw, cn) {
    if (!tw || !cn || tw === cn) return false;
    const bucket = TW2CN_BY_HEAD[tw[0]] || (TW2CN_BY_HEAD[tw[0]] = []);
    const i = bucket.findIndex((r) => r[0] === tw);
    if (i >= 0) bucket[i][1] = cn;          // 后加入的（腾讯层）覆盖已有
    else bucket.push([tw, cn]);
    bucket.sort((a, b) => b[0].length - a[0].length);
    if (tw.length > TW2CN_MAXLEN) TW2CN_MAXLEN = tw.length;
    return true;
  }
  for (const row of INLINE_TW2CN) addTw2Cn(row[0], row[1]);

  /**
   * 腾讯国服动态层：把运行时同步到的「英文 → 简中（腾讯官方）」与
   * 「英文 → 繁中（编年史 /tw/）」按英文键对齐，生成「繁中 → 简中」补充映射。
   * 这样官方繁体页面上的用词会优先落到国服简体叫法，而不是编年史简体。
   */
  function augmentFromTencent() {
    let n = 0;
    const twDict = state.ui.tw, twExtra = state.dict.tw;
    for (const en of Object.keys(state.dict.cn)) {
      const cn = state.dict.cn[en];
      const tw = twDict[en] || twExtra[en];
      if (!cn || !tw || !/[㐀-鿿]/.test(tw)) continue;
      let shape = '';
      for (const ch of tw) shape += H2S[ch] || ch;   // 先看字形转换够不够
      if (shape === cn) continue;                    // 够就不必进词表
      if (addTw2Cn(tw, cn)) n++;
    }
    tencentAugmented = n;
    return n;
  }

  /** 把一段官方繁体文本转成简体中文，返回 {text, converted} */
  function toSimplified(input) {
    const s = String(input);
    if (!s) return { text: s, converted: false };
    let out = '';
    let changed = false;
    let i = 0;
    while (i < s.length) {
      // ① 用词差异：只在当前字是某个繁体词条首字时查表
      const cands = TW2CN_BY_HEAD[s[i]];
      let hit = null;
      if (cands) {
        for (const [tw, cn] of cands) {
          if (tw.length > s.length - i) continue;
          if (s.substr(i, tw.length) === tw) { hit = [tw, cn]; break; }
        }
      }
      if (hit) {
        out += hit[1];
        i += hit[0].length;
        changed = true;
        continue;
      }
      // ② 字形转换
      const ch = s[i];
      if (H2S[ch]) { out += H2S[ch]; changed = true; }
      else out += ch;
      i++;
    }
    return { text: out, converted: changed };
  }

  /** 是否含繁体特有字（用于快速判断要不要跑转换） */
  const TW_CHAR_RE = /[體護擊傷風龍鐵鋼獸骷髏臺後裡麼發髮乾麵衝擊靈氣點數傷害護甲閃避暴擊幾率範圍效果區域需求等級物品賦予詞綴昇華職業聯盟]/;

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
    augmentFromTencent();
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
  // 国服（腾讯）与国际服的 trade 数据接口。内容两端同步、只是译名不同，
  // 所以对齐后拿到的就是官方译名。
  //
  // 关键：英文侧与中文侧必须落在**同一个 trade 版本**上（trade = PoE1，trade2 = PoE2），
  // 否则组数对不上、一条都对齐不了。所以按「版本对」整体探测，而不是两端各自挑。
  const API_PAIRS = {
    poe2: [
      { tag: 'trade2', en: 'https://www.pathofexile.com/api/trade2/data/',
        cn: ['https://poe2.game.qq.com/api/trade2/data/', 'https://poe.game.qq.com/api/trade2/data/'] },
      { tag: 'trade', en: 'https://www.pathofexile.com/api/trade/data/',
        cn: ['https://poe2.game.qq.com/api/trade/data/', 'https://poe.game.qq.com/api/trade/data/'] }
    ],
    poe1: [
      { tag: 'trade', en: 'https://www.pathofexile.com/api/trade/data/',
        cn: ['https://poe.game.qq.com/api/trade/data/'] }
    ]
  };

  let resolvedPair = null;   // { en, cn, tag }
  let lastOfficial = null;   // 上一次官方同步的详细结果（诊断用）

  /** 按「版本对」探测：先确定英文源，再在同一版本下找中文源 */
  async function resolvePair() {
    if (resolvedPair) return resolvedPair;
    const pairs = API_PAIRS[gameKey()] || API_PAIRS.poe1;
    let lastErr;
    for (const p of pairs) {
      let enData;
      try { enData = await tradeData(p.en, 'items'); }
      catch (e) { lastErr = e; continue; }
      for (const cnBase of p.cn) {
        try {
          const cnData = await tradeData(cnBase, 'items');
          resolvedPair = { en: p.en, cn: cnBase, tag: p.tag, enData, cnData };
          return resolvedPair;
        } catch (e) { lastErr = e; }
      }
    }
    throw lastErr || new Error('没有可用的官方词库源（多数情况是没有登录国服）');
  }

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

  /**
   * 按索引对齐两端条目。
   * 组内条目数必须完全一致才对齐——国服如果过滤掉了某些物品，错位对齐比缺词更糟。
   * 返回 { map, groups, of, detail }，detail 供诊断看清是哪几组没对上。
   */
  function alignGroups(enList, cnList, pick) {
    const map = Object.create(null);
    const detail = [];
    const usable = Math.min(enList.length, cnList.length);
    let groups = 0;
    for (let g = 0; g < usable; g++) {
      const eg = enList[g], cg = cnList[g];
      if (!eg || !cg) continue;
      const ee = eg.entries || [], ce = cg.entries || [];
      const ok = ee.length === ce.length && ee.length > 0;
      detail.push({ g, en: ee.length, cn: ce.length, ok, label: eg.label || '' });
      if (!ok) continue;
      groups++;
      for (let i = 0; i < ee.length; i++) pick(map, ee[i], ce[i]);
    }
    return { map, groups, of: usable, detail };
  }

  async function syncFromTencent() {
    const pair = await resolvePair();
    const enBase = pair.en, cnBase = pair.cn;
    const [enItems, cnItems] = await Promise.all([tradeData(enBase, 'items'), tradeData(cnBase, 'items')]);
    /** 物品名：英文 name → 官方简中 name */
    const aligned = alignGroups(enItems, cnItems, (out, e, c) => {
      const en = cleanStr(e && (e.name || e.type));
      const cn = cleanStr(c && (c.name || c.type));
      if (!en || !cn || en === cn) return;        // 官方没翻译的保持英文
      if (en.length > 60 || cn.length > 60) return;
      if (/[^A-Za-z0-9'’\- ]/.test(en)) return;   // 只收纯英文名，数字/符号条目跳过
      if (!(en in out)) out[en] = cn;
    });
    const items = aligned.map;

    // 词缀：id 两端一致，直接按 id 建索引再对齐，比顺序可靠
    let stats = Object.create(null);
    try {
      const [enStats, cnStats] = await Promise.all([tradeData(enBase, 'stats'), tradeData(cnBase, 'stats')]);
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

    const host = cnBase.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    applyItems(Object.assign({}, items, stats), '腾讯官方（' + host + '）', false);
    const res = { n, host, tag: pair.tag, items: Object.keys(items).length,
                  stats: Object.keys(stats).length, groups: aligned.groups, of: aligned.of,
                  detail: aligned.detail };
    lastOfficial = res;   // 留给诊断用
    return res;
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
    augmentFromTencent();     // 新简体译名立刻参与「官方繁体 → 腾讯简体」对齐
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
  async function syncItems() {
    const res = { official: 0, poedb: 0, host: '', note: '' };
    try {
      const r = await syncFromTencent();
      res.official = r.n;
      res.host = r.host;
      res.detail = r;
    } catch (e) {
      res.note = e.message || String(e);
    }
    // 官方没覆盖到的（PoE2 全部内容、国服未引进的条目）交给 poedb 补
    try {
      const r = await syncFromPoedb();
      res.poedb = r.n;
      if (!res.host) res.host = r.host;
    } catch (e) {
      if (!res.note) res.note = e.message || String(e);
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

  /* ------------------------------------------------------------
   * 专有名词（物品名 / 技能名）的「全有或全无」规则
   *
   * 逐词降级翻译会造出「风暴 Song」「Twice 已腐化」这种半吊子结果，
   * 比全英文更难认。所以形态像专有名词的短语：要么整串命中，
   * 要么每个实词都有译名，否则一律保持原样。
   * ---------------------------------------------------------- */
  const PN_CONNECTORS = new Set(['of', 'the', 'and', 'to', 'in', 'on', 'at', 'for', 'with', 'a', 'an', 'from', 'de']);

  /* 以这些词开头的短语是词缀而不是名字（词缀在 UI 里也常首字母大写）。
   * 不加这条的话，"Increased Area of Effect" 会被当成专有名词而整条不翻。 */
  const MOD_LEADERS = new Set([
    'increased', 'increases', 'increase', 'reduced', 'reduces', 'reduce',
    'adds', 'add', 'added', 'additional', 'more', 'less',
    'gain', 'gains', 'grants', 'grant', 'granted', 'has', 'have',
    'deal', 'deals', 'take', 'takes', 'taken', 'lose', 'loses', 'lost',
    'regenerates', 'regenerate', 'recovers', 'recover', 'recharges', 'recharge',
    'causes', 'cause', 'applies', 'apply', 'inflict', 'inflicts',
    'trigger', 'triggers', 'cannot', 'can', 'will', 'may',
    'when', 'while', 'during', 'if', 'each', 'every', 'per',
    'on', 'at', 'to', 'from', 'with', 'by', 'for', 'of', 'and', 'or', 'in',
    'your', 'you', 'enemy', 'enemies', 'ally', 'allies',
    'damage', 'attacks', 'attack', 'spells', 'spell', 'critical', 'crit',
    'minion', 'minions', 'socketed', 'supported', 'support', 'skills', 'skill',
    'maximum', 'minimum', 'total', 'base', 'extra', 'chance'
  ]);

  /** 是否像专有名词：2~6 个词、不含数字、每个词首字母大写（连接词除外）、首词不是词缀标志词 */
  function isProperNounShape(trim) {
    if (!/^[A-Za-z'’\- ]+$/.test(trim)) return false;   // 含数字/标点 → 词缀，不是名字
    if (/\s\s/.test(trim)) return false;
    const words = trim.split(' ').filter(Boolean);
    if (words.length < 2 || words.length > 6) return false;
    if (MOD_LEADERS.has(words[0].toLowerCase())) return false;
    return words.every((w) => PN_CONNECTORS.has(w.toLowerCase()) || /^[A-Z]/.test(w));
  }

  /**
   * 专有名词整串翻译。能全翻就返回译文，翻不全返回 null（调用方应保持原文）。
   * 返回 undefined 表示"不是专有名词形态"，交给常规逐词逻辑处理。
   */
  function translateProperNoun(trim) {
    if (!isProperNounShape(trim)) return undefined;
    const words = trim.split(' ').filter(Boolean);
    const out = [];
    for (const w of words) {
      const low = w.toLowerCase();
      const r = lookupLoose(w) || (PN_CONNECTORS.has(low) ? lookupLoose(low) : null);
      if (!r) return null;                    // 有词翻不了 → 整体不翻
      out.push(r.zh);
    }
    return out.join('');
  }

  /** 短语翻译（DOM 文本节点）：官方繁体 → 简体 → 残留英文兜底 */
  function translatePhrase(src) {
    if (state.lang === 'off') return src;
    let s = String(src);

    // ① 官方繁体 → 简体中文。页面自 2026-10-30 起自带繁中，这一步取代了
    //    旧版「英文 → 中文」的大词库替换，覆盖面从「词库里有的」变成「整页」。
    //    繁体模式（tw）保持官方原文，只补残留英文；关闭模式（off）不处理。
    if (state.lang === 'cn' && /[㐀-鿿]/.test(s)) {
      const conv = toSimplified(s);
      if (conv.converted) s = conv.text;
    }

    // ② 残留英文（官方繁中未覆盖的新物品/词缀）仍用旧词库兜底
    if (!/[A-Za-z]{2}/.test(s)) return s;

    const trim = s.trim();
    if (trim) {
      const direct = lookup(trim);
      if (direct) return s.replace(trim, direct);
      const loose = lookupLoose(trim);
      if (loose) return s.replace(trim, loose.head + loose.zh + loose.tail);

      // 专有名词：全有或全无
      const pn = translateProperNoun(trim);
      if (pn === null) { collectMissing(trim); return s; }   // 翻不全 → 保持英文
      if (pn !== undefined) return s.replace(trim, pn);
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
  const BRAND_RE = /^(poe\.ninja|poedb\.tw|poe2db\.tw|discord|github|grinding gear games)$/i;

  function collectMissing(s) {
    if (state.missing.size >= MAX_MISSING || state.lang === 'off') return;
    const t = s.trim();
    if (t.length < 4 || t.length > 80) return;
    if (!/[A-Za-z]{3}/.test(t)) return;
    if (CJK_RE.test(t)) return;                      // 已含中文（多半是翻了一半的残留），不重复收集
    if (BRAND_RE.test(t)) return;                    // 品牌名/站名，本来就不该翻
    if (/^https?:\/\//.test(t)) return;
    if (/[{};]|::|@media/.test(t)) return;          // CSS / 选择子，跳过
    if (/^[A-Za-z0-9._-]+@|#\d{3,}/.test(t)) return; // 账号名（含 #数字），跳过
    // 形如 SupportClarityPlayerTwo 的内部 skill id：游戏内部标识，不是给玩家看的英文
    if (/^[A-Z][a-z]+(?:[A-Z][a-z0-9]*)+$/.test(t) && !/\s/.test(t)) return;
    if (/^\d+([.,]\d+)*$/.test(t)) return;
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
    btn.title = state.lang === 'cn' ? '官方繁體 → 简体（国服译名优先）'
              : state.lang === 'tw' ? '保持 poe.ninja 官方繁體原文（仅补残留英文）'
              : '关闭翻译';
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
  function download(filename, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function exportMissing() {
    const list = Array.from(state.missing);
    download(`poeninja-missing-${gameKey()}-${activeLang()}-${new Date().toISOString().slice(0, 10)}.json`,
      { url: location.href, game: gameKey(), lang: activeLang(), count: list.length, items: list });
    GM.notify('已导出 ' + list.length + ' 条未翻译字符串');
  }

  /** 导出当前生效的词库，用于把它内置进脚本（开发者补词库用） */
  function exportDict() {
    const lang = activeLang();
    const dict = state.dict[lang];
    const keys = Object.keys(dict);
    download(`poeninja-dict-${gameKey()}-${lang}-${new Date().toISOString().slice(0, 10)}.json`,
      { game: gameKey(), lang, source: state.source, count: keys.length, dict });
    GM.notify('已导出词库 ' + keys.length + ' 条（来源：' + (state.source || '内置') + '）');
  }

  /** 逐个探测词库源，把结果弹出来——排查"为什么还是英文"用这个 */
  async function diagnose() {
    const lines = [`PoeNinjaChinese v${SCRIPT_VERSION}`, `页面：${gameKey()}　模式：${state.lang === 'cn' ? '简体（繁转简）' : state.lang === 'tw' ? '官方繁体' : '关闭'}`, ''];
    const say = (s) => { lines.push(s); console.log('[PoeNinjaChinese] ' + s); };

    // v2 核心：官方繁体 → 简体
    const htmlLang = (document.documentElement && document.documentElement.lang) || '(无)';
    let sample = '';
    try { sample = (document.body && document.body.innerText || '').slice(0, 4000); } catch (e) {}
    const twHits = (sample.match(/[體護擊傷風龍鐵鋼獸骷髏臺後裡麼發髮乾麵靈氣點數範圍區域聯盟詞綴昇華]/g) || []).length;
    say(`官方语言：<html lang="${htmlLang}">　正文繁体特征字 ${twHits} 处`);
    say(twHits > 5 ? '✅ 页面已是官方繁體中文，繁转简可全量生效'
                   : '⚠️ 页面看起来不是繁體中文 → 请在站顶 Language 选「繁體中文」，否则只有残留英文会被词库兜底');
    say(`转换层：用词对照 ${Object.keys(TW2CN_BY_HEAD).reduce((n, h) => n + TW2CN_BY_HEAD[h].length, 0)} 条（含腾讯动态层 ${tencentAugmented} 条） / 单字表 ${Object.keys(H2S).length} 字`);
    say('内置：界面 ' + Object.keys(state.ui.cn).length + ' 条 / 术语 ' + Object.keys(state.terms.cn).length + ' 条');
    say('内存中物品名词库：' + Object.keys(state.dict[activeLang()]).length + ' 条　来源：' + (state.source || '（空）'));
    say('');
    say('繁转简抽验：');
    for (const p of ['鋼鐵守護', '風魔舞者', '骷髏巨獸', '每秒攻擊次數']) {
      say(`   ${p} → ${toSimplified(p).text}`);
    }
    say('');

    // 官方源：按「版本对」探测，两端必须落在同一个 trade 版本上
    const pairs = API_PAIRS[gameKey()] || API_PAIRS.poe1;
    for (const p of pairs) {
      let enData;
      try { enData = await tradeData(p.en, 'items'); say(`✅ 英文源 [${p.tag}] ${p.en} → ${enData.length} 组`); }
      catch (e) { say(`❌ 英文源 [${p.tag}] ${p.en} → ${e.message}`); continue; }
      for (const cnBase of p.cn) {
        try {
          const cnData = await tradeData(cnBase, 'items');
          const a = alignGroups(enData, cnData, (out, e, c) => {
            const en = cleanStr(e && (e.name || e.type));
            const cn = cleanStr(c && (c.name || c.type));
            if (en && cn && en !== cn) out[en] = cn;
          });
          const bad = a.detail.filter((d) => !d.ok);
          say(`✅ 中文源 [${p.tag}] ${cnBase} → 中文 ${cnData.length} 组，对齐 ${a.groups}/${a.of} 组，得到 ${Object.keys(a.map).length} 条`);
          if (bad.length) {
            say('   ↳ 未对齐的组（英文条目数/中文条目数）：');
            for (const d of bad.slice(0, 12)) say(`      #${d.g} ${d.label || '(无名)'} ${d.en} / ${d.cn}`);
            if (bad.length > 12) say(`      …还有 ${bad.length - 12} 组`);
          }
        } catch (e) { say(`❌ 中文源 [${p.tag}] ${cnBase} → ${e.message || e}`); }
      }
    }

    // poedb：autocomplete 只覆盖物品名，不含技能宝石
    const poedbHost = gameKey() === 'poe2' ? 'https://poe2db.tw' : 'https://poedb.tw';
    say('');
    try {
      const us = await getJSON(`${poedbHost}/json/autocomplete_us.json`);
      const cn = await getJSON(`${poedbHost}/json/autocomplete_cn.json`);
      say(`✅ poedb ${poedbHost} → us ${us.length} 条 / cn ${cn.length} 条（仅物品名，不含技能宝石）`);
    } catch (e) { say(`❌ poedb ${poedbHost} → ${e.message || e}`); }

    // 抽查几个页面上看得见的英文名，看它们到底有没有进词库
    say('');
    say('抽查（页面上的英文 → 当前词库结果）：');
    const probes = gameKey() === 'poe2'
      ? ['Navira, the Last Mirage', 'Bidding II', 'Muster', 'Water Djinn', 'Rakiata\'s Flow', 'Tabula Rasa', 'Divine Orb']
      : ['Tabula Rasa', 'Divine Orb', 'Headhunter'];
    for (const p of probes) say(`   ${p} → ${translatePhrase(p)}`);

    download('poeninja-diagnose-' + new Date().toISOString().slice(0, 10) + '.json', { lines });
    try { alert(lines.join('\n')); } catch (e) {}
    GM.notify('诊断完成，结果已弹窗并导出');
  }

  function registerMenu() {
    GM.menu(`🌐 显示语言（当前：${state.lang === 'cn' ? '简体·繁转简' : state.lang === 'tw' ? '官方繁体' : '关闭'}）`, () => {
      const next = state.lang === 'cn' ? 'tw' : (state.lang === 'tw' ? 'off' : 'cn');
      setLang(next);
    });
    GM.menu('🔄 更新词库', async () => {
      GM.notify('正在更新词库…');
      try { await loadDict(true); } catch (e) { /* CDN 拿不到不影响下面 */ }
      try {
        const r = await syncItems();
        rescanAll();
        const d = r.detail || {};
        GM.notify(r.official
          ? `已更新：腾讯官方 ${d.items || 0} 条物品 + ${d.stats || 0} 条词缀，PoEDB 补 ${r.poedb} 条`
          : `已更新：取自 PoEDB ${r.poedb} 条（腾讯官方不可用：${r.note}）`);
      } catch (e) { GM.notify('更新失败：' + e.message); }
    });
    GM.menu(`📡 翻译接口数据（当前：${state.apiData ? '开' : '关'}）`, () => {
      state.apiData = !state.apiData;
      GM.set(K_APIDATA, state.apiData);
      GM.notify(state.apiData
        ? '已开启：搜索框可直接搜中文；但 poe.ninja 用 name 查图标/描述，可能导致部分技能丢图标和描述'
        : '已关闭：只翻译渲染后的页面文字，图标与描述不受影响', 6000);
      setTimeout(() => location.reload(), 900);
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
    GM.menu('📦 导出当前词库（给开发者补词库用）', exportDict);
    GM.menu('🔍 诊断词库源', diagnose);
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
