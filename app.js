// 宇宙无敌表达训练系统 - Web版 (Web Speech API)

// ===== 语言设置 =====
function getLang() { return localStorage.getItem('expr_v3_lang') || 'zh'; }
function setLang(lang) { localStorage.setItem('expr_v3_lang', lang); }

// ===== 中文词库 =====
const FILLER_WORDS_ZH = [
  '嗯', '啊', '呃', '额', '那个', '就是', '然后',
  '这个', '对吧', '是吧', '你知道', '怎么说呢',
  '反正', '基本上', '总之', '所以说'
];
const HEDGE_WORDS_ZH = [
  '可能', '也许', '大概', '应该', '我觉得', '好像',
  '似乎', '或许', '不一定', '差不多', '算是',
  '某种程度上', '一般来说', '感觉'
];

// ===== 英文词库 =====
const FILLER_WORDS_EN = [
  'um', 'uh', 'ah', 'er', 'like', 'you know', 'basically',
  'actually', 'literally', 'so', 'well', 'right', 'okay so',
  'I mean', 'you see', 'kind of like', 'sort of like'
];
const HEDGE_WORDS_EN = [
  'maybe', 'perhaps', 'probably', 'I think', 'I guess',
  'kind of', 'sort of', 'a little bit', 'somewhat',
  'I suppose', 'it seems', 'more or less', 'in a way', 'arguably'
];
const VAGUE_TO_PRECISE_EN = {
  'good': ['excellent', 'outstanding', 'remarkable', 'exceptional', 'superb', 'stellar'],
  'bad': ['terrible', 'dreadful', 'appalling', 'atrocious', 'disastrous', 'abysmal'],
  'big': ['enormous', 'substantial', 'colossal', 'immense', 'massive', 'considerable'],
  'small': ['minuscule', 'negligible', 'trivial', 'microscopic', 'compact', 'modest'],
  'very': ['exceptionally', 'remarkably', 'extraordinarily', 'tremendously', 'profoundly', 'intensely'],
  'a lot': ['extensively', 'abundantly', 'substantially', 'considerably', 'tremendously', 'immensely'],
  'thing': ['aspect', 'element', 'factor', 'component', 'phenomenon', 'concept'],
  'stuff': ['material', 'content', 'resources', 'elements', 'components', 'substance'],
  'nice': ['delightful', 'pleasant', 'exquisite', 'charming', 'gracious', 'splendid'],
  'happy': ['elated', 'thrilled', 'ecstatic', 'overjoyed', 'euphoric', 'jubilant'],
  'sad': ['devastated', 'heartbroken', 'melancholy', 'sorrowful', 'despondent', 'grief-stricken'],
  'interesting': ['fascinating', 'compelling', 'captivating', 'intriguing', 'riveting', 'thought-provoking'],
  'important': ['crucial', 'vital', 'essential', 'paramount', 'significant', 'critical'],
  'hard': ['challenging', 'demanding', 'grueling', 'strenuous', 'arduous', 'formidable'],
  'easy': ['effortless', 'straightforward', 'seamless', 'intuitive', 'manageable', 'uncomplicated'],
  'fast': ['rapid', 'swift', 'lightning-fast', 'instantaneous', 'brisk', 'accelerated'],
  'slow': ['gradual', 'sluggish', 'unhurried', 'leisurely', 'plodding', 'painstaking'],
  'get': ['obtain', 'acquire', 'secure', 'achieve', 'attain', 'procure'],
  'make': ['create', 'construct', 'produce', 'generate', 'establish', 'craft'],
  'really': ['genuinely', 'truly', 'undeniably', 'absolutely', 'undoubtedly', 'fundamentally']
};

// ===== 根据语言获取词库 =====
function getFillerWords() { return getLang() === 'en' ? FILLER_WORDS_EN : FILLER_WORDS_ZH; }
function getHedgeWords() { return getLang() === 'en' ? HEDGE_WORDS_EN : HEDGE_WORDS_ZH; }
function getVagueToPrecise() { return getLang() === 'en' ? VAGUE_TO_PRECISE_EN : VAGUE_TO_PRECISE_ZH; }

// 兼容旧引用
const FILLER_WORDS = FILLER_WORDS_ZH;
const HEDGE_WORDS = HEDGE_WORDS_ZH;

const VAGUE_TO_PRECISE_ZH = {
  '开心': ['欣喜', '雀跃', '兴奋', '欣慰', '畅快', '满足'],
  '难过': ['心酸', '失落', '委屈', '心疼', '沮丧', '低落'],
  '害怕': ['恐惧', '焦虑', '不安', '慌张', '胆怯', '忐忑'],
  '生气': ['愤怒', '恼火', '窝火', '气愤', '不满', '暴躁'],
  '不舒服': ['压抑', '烦躁', '憋屈', '窒息', '煎熬', '疲惫'],
  '很好': ['出色', '精彩', '优秀', '惊艳', '完美', '理想'],
  '很多': ['大量', '海量', '充裕', '丰富', '密集', '可观'],
  '很快': ['迅速', '飞速', '立刻', '瞬间', '即刻', '火速'],
  '很大': ['巨大', '庞大', '显著', '惊人', '可观', '壮观'],
  '很小': ['微小', '细微', '轻微', '渺小', '微不足道', '些许'],
  '好看': ['精致', '优雅', '绚丽', '惊艳', '别致', '夺目'],
  '不好': ['糟糕', '恶劣', '拙劣', '不堪', '惨淡', '低劣'],
  '喜欢': ['热爱', '痴迷', '着迷', '钟爱', '倾心', '沉醉'],
  '讨厌': ['厌恶', '反感', '排斥', '憎恨', '鄙视', '嫌弃'],
  '觉得': ['认为', '判断', '确信', '推断', '意识到', '发现'],
  '想': ['渴望', '期待', '向往', '盼望', '企图', '打算'],
  '做': ['执行', '落实', '推进', '完成', '实施', '操作'],
  '看': ['审视', '观察', '注视', '打量', '端详', '凝视'],
  '说': ['表达', '阐述', '强调', '指出', '坦言', '声明'],
  '想想': ['反思', '回顾', '审视', '复盘', '琢磨', '斟酌']
};
const VAGUE_TO_PRECISE = VAGUE_TO_PRECISE_ZH;

// ===== Prompt 模板 =====
function getRealtimePrompt(text, context, customPrompt) {
  const elapsed = context?.elapsedSec || 0;
  const elapsedMin = Math.floor(elapsed / 60);
  const topic = context?.topic || '';
  const prevPoints = context?.previousPoints || [];
  const guidancePrompts = context?.guidancePrompts || [];
  const freeMode = Boolean(context?.freeMode);
  const freeGuidance = context?.freeGuidance || [];

  let customBlock = '';
  if (customPrompt) {
    if (customPrompt.goals) customBlock += `\n\n## 用户训练目标(调整你的反馈优先级)\n${customPrompt.goals}`;
    if (customPrompt.customRules) customBlock += `\n\n## 用户自定义规则(和上面的规则一起生效,触发时一样只输出1条提示)\n${customPrompt.customRules}`;
    if (customPrompt.styleRef) customBlock += `\n\n## 用户想要的表达风格(反馈时以此为标准)\n${customPrompt.styleRef}`;
    if (customPrompt.customWords) customBlock += `\n\n## 用户额外口癖词(视为填充词,出现时标记)\n${customPrompt.customWords}`;
  }

  let contextBlock = '';
  if (elapsedMin > 0) contextBlock += `[已说${elapsedMin}分钟] `;
  if (topic) contextBlock += `[开头主题: "${topic}"] `;
  if (prevPoints.length > 0) contextBlock += `[已说过的观点: ${prevPoints.join(';')}]`;
  if (guidancePrompts.length > 0) contextBlock += `\n[自由表达提示: ${guidancePrompts.join(' / ')}]`;
  if (freeMode && freeGuidance.length > 0) contextBlock += `\n[自由表达训练目标: ${freeGuidance.join(' / ')}]`;

  let system;
  if (getLang() === 'en') {
    system = `你是英语口语表达的实时教练。用中文输出提示，每次只1条，不超过8个字，不加标点。

用户正在用英语演讲/表达。根据最新这段话判断是否触发规则：

## 触发规则
1. 重复检测：同一观点说过→「说过一遍」
2. 结论缺失：只有铺垫没结论→「说结论」
3. 好结构：出现自问自答(why?because...)→「✓ 好结构」
4. 缺例子：说了很久没举例→「举个例子？」
5. 前后矛盾→「跟前面矛盾」
6. 超时未入主题→「3分钟，还没进主题」
7. 金句：有力/有画面感→「⭐ 这句好」
8. 类比/故事→「✓ 有画面」
9. 太抽象没具体数字→「太抽象，给个数字」
10. 跑题→「跑题」
11. 立场模糊(it depends/not bad/whatever)→「你到底觉得呢？」

## 硬性约束
- 用中文输出提示，不超过8个字
- 不加引号、标点、编号
- 都没触发则输出空行
- 不管语音识别错误` + customBlock;
  } else {
    system = `你是7到12岁孩子的中文表达小教练。你的任务是帮孩子把真实发生的小事说清楚，让他觉得自己做得到。

请根据最新一小段口述，只给一条实时提示，最多14个字。提示要像老师在旁边轻轻提醒，孩子一看就知道下一句可以怎么说；不打分、不批评、不使用成人培训术语。

优先关注：
1. 事情完整：发生了什么、为什么、后来结果怎样
2. 顺序清楚：先发生什么，再发生什么，最后怎样
3. 词语具体：把“很好、很生气、很多”换成具体的感受、动作、画面或数字
4. 观点有理由：我觉得……因为……比如……所以……
5. 感受和需要：我因为……感到……我希望……
6. 听别人说：想想对方怎么想、怎么回应，或提出一个问题

可以使用的提示示例：补一句后来怎样、说个具体瞬间、为什么会这样、把感受说具体、给想法加个理由、想想对方会怎么回答、这句说得很有画面、把先后顺序说清楚。

规则：只输出提示本身，不加引号、编号或解释；没有需要提醒时输出空行；不要纠正识别错字，不要要求背稿。` + (freeMode ? `

孩子正在自由表达${topic ? `，场景是“${topic}”` : ''}。优先提醒真实小事、事情顺序、具体瞬间、感受和希望；每天说一点就很好。` : '') + customBlock;
  }

  const user = `${contextBlock}\n\n最新一段：\n"${text.slice(-500)}"`;

  return { system, user };
}

function getReportPrompt(fullText, stats, customPrompt) {
  let customBlock = '';
  if (customPrompt) {
    if (customPrompt.goals) customBlock += `\n\n## 用户训练目标(报告中请重点关注这些方面)\n${customPrompt.goals}`;
    if (customPrompt.styleRef) customBlock += `\n\n## 用户想要的表达风格(评价时以此为标准)\n${customPrompt.styleRef}`;
    if (customPrompt.customWords) customBlock += `\n\n## 用户额外口癖词(请在报告中一并统计)\n${customPrompt.customWords}`;
  }

  let system;
  if (getLang() === 'en') {
    system = `你是专业英语口语表达教练。用户刚用英语说了一段话，你需要用中文写一份详细的分析报告。

报告开头第一句话固定为：「宇宙无敌少女收到你的英语录音啦~~」

请严格按以下结构输出(markdown格式):

## 总评
给一个总分(0-100)和一句话定位。

## ✓ 亮点
引用英文原文中说得好的部分，用中文解释为什么好。

## 🔧 连句编辑
对每句有问题的英文，给出:
> 原文: "xxx"
> 建议: "xxx"
> 原因(中文): xxx

包括: 语法错误、用词不精准、句式单一、表达不地道、逻辑不清晰。

## 📝 用词精准度

| 原词 | 可替换为 |
|------|--------|
| good | excellent / outstanding / remarkable |
| very | incredibly / remarkably / profoundly |

只列出笼统/重复/低级的英文词，给出更高级的替代。

## 💬 行为模式分析

**填充词模式**: um/uh/like/you know等出现频率和情境。
**犹豫模式**: maybe/I think/kind of等hedging词的使用情况。
**直接性**: 哪些地方可以更直接，对比原文vs直接版。
**语法准确度**: 时态、主谓一致、冒词、介词等常见问题。
**发音提示**: 根据语音识别结果推测可能的发音问题。

## 📊 数据

| 指标 | 数值 |
|------|------|
| 时长 | Xs |
| 总词数 | X |
| 语速 | X词/分钟 |
| 填充词频率 | X次/分钟 |
| 犹豫词占比 | X% |

## 🎯 下次练习重点
只给1条最关键的改进方向 + 具体怎么练。

---
语气要求:用中文写，直接、犯利、有建设性。像一个严格但真心关心你的英语教练。` + customBlock;
  } else {
    system = `你是7到12岁儿童的中文表达成长教练。请用温暖、具体、孩子听得懂的话分析这段真实口述，帮助孩子下一次更清楚地表达。不要用成人培训或心理咨询口吻，不讨论主导性、冲突回避、职场沟通、犀利度，也不要要求背稿。

请严格按下面结构输出 Markdown：

## 🌟 你已经做到
先用2到3条短句鼓励孩子，指出内容里已经说清楚的事情、顺序、画面、情绪或观点。

## 🧩 把一件事说完整
用孩子能懂的话看：发生了什么、为什么会这样、后来结果怎样。只挑最需要补的一处，用一个小问题引导，不替孩子写答案。

## 🎨 让词语更具体
只从孩子实际说过的词里挑选：情绪词、动作词、画面词、时间地点词、原因结果词。每项最多3个，给出更贴近生活的替换，例如“开心→期待/得意”“生气→窝火/不服气”“很多→排成一长串”。没有合适词就写“这部分已经很具体”。

## 🗣️ 下一次可以这样练
只给一个3分钟以内的小练习，按“事情→原因→结果→感受/希望”练一遍。7到9岁优先说完整、讲顺序；10到12岁可以再加观点和理由。不要要求孩子一次说很长。

## 👂 也听听别人
如果口述里提到朋友、老师或家人，提醒孩子想一个回应或问题；没有提到别人时，写“下次可以问问对方怎么想”。

## 📌 今天的小数据
只展示时长、字数、语速和“说清楚度”四项，用鼓励性的文字解释，不做成人式排名。

## ✅ 给孩子的一句话
用一句不超过20字的话收尾，例如“你已经把事情讲出来了，下一次补一个具体瞬间就更棒”。

要求：全文使用中文短句，少用术语，不虚构孩子没有说过的内容；先鼓励，再给一个最小可行动的下一步。` + customBlock;
  }

  const user = `以下是说话者的完整口语内容:

---
${fullText}
---

数据:${stats.duration}秒 | ${stats.totalWords}字 | 填充词${stats.fillers}次 | 犹豫词${stats.hedges}次 | 笼统词${stats.vagueWords}次`;

  return { system, user };
}

// ===== V3 AI routing: personal key or metered managed access =====
async function callAI(messages, maxTokens = 200) {
  try { return await window.accessController.callAI(messages, maxTokens); }
  catch (error) {
    window.accessController.lastError = error.message;
    if (maxTokens < 1000) window.trainer?.addFeedbackItem(error.message, 'ai');
    return null;
  }
}
function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ===== 儿童离线表达词库 =====
// 词语分类和高亮完全在本地完成；没有 API Key 或网络时仍然可用。
let OFFLINE_LEXICON = { entries: [] };
let OFFLINE_LEXICON_PROMISE = null;
if (typeof window !== 'undefined' && window.__EXPR_OFFLINE_LEXICON?.entries?.length) {
  OFFLINE_LEXICON = window.__EXPR_OFFLINE_LEXICON;
}

async function loadOfflineLexicon() {
  if (OFFLINE_LEXICON_PROMISE) return OFFLINE_LEXICON_PROMISE;
  // 词库通过 index.html 预加载的静态 bundle 注入，避免录音时产生网络请求。
  // 这也让离线模式和前端自动化测试都不依赖 fetch。
  OFFLINE_LEXICON_PROMISE = Promise.resolve().then(() => {
    const bundled = window.__EXPR_OFFLINE_LEXICON;
    if (bundled?.entries?.length) {
      OFFLINE_LEXICON = {
        ...bundled,
        entries: bundled.entries
          .filter(entry => entry.active !== false && entry.term)
          .sort((a, b) => String(b.term).length - String(a.term).length)
      };
      return OFFLINE_LEXICON;
    }
    // 最小兜底词库，避免静态 bundle 未部署时影响录音。
    OFFLINE_LEXICON = {
      entries: [
        ...['开心', '高兴', '紧张', '委屈', '惊喜'].map((term, i) => ({ term, category: 'emotion', color: 'pink', id: `fallback-emotion-${i}` })),
        ...['跑过去', '跳起来', '抱住', '皱眉'].map((term, i) => ({ term, category: 'action', color: 'blue', id: `fallback-action-${i}` })),
        ...['操场', '教室', '窗边', '蛋糕'].map((term, i) => ({ term, category: 'scene', color: 'green', id: `fallback-scene-${i}` })),
        ...['后来', '突然', '最后', '因为', '所以'].map((term, i) => ({ term, category: 'sequence', color: 'purple', id: `fallback-sequence-${i}` })),
        ...['嗯', '啊', '呃', '那个', '就是'].map((term, i) => ({ term, category: 'filler', color: 'orange', id: `fallback-filler-${i}` }))
      ]
    };
    return OFFLINE_LEXICON;
  });
  return OFFLINE_LEXICON_PROMISE;
}

function findOfflineLexiconMatches(text) {
  const source = String(text || '');
  if (!source || !OFFLINE_LEXICON.entries?.length) return [];
  const occupied = new Array(source.length).fill(false);
  const matches = [];
  const entries = OFFLINE_LEXICON.entries;
  entries.forEach(entry => {
    const terms = [entry.term, ...(Array.isArray(entry.variants) ? entry.variants : [])]
      .filter(Boolean)
      .sort((a, b) => String(b).length - String(a).length);
    terms.forEach(term => {
      let from = 0;
      while (from < source.length) {
        const index = source.indexOf(term, from);
        if (index < 0) break;
        const end = index + term.length;
        const overlaps = occupied.slice(index, end).some(Boolean);
        if (!overlaps) {
          for (let cursor = index; cursor < end; cursor += 1) occupied[cursor] = true;
          matches.push({ start: index, end, text: source.slice(index, end), entry });
        }
        from = Math.max(end, index + 1);
      }
    });
  });
  return matches.sort((a, b) => a.start - b.start || b.end - a.end);
}

function highlightOfflineLexicon(text) {
  const source = String(text || '');
  const matches = findOfflineLexiconMatches(source);
  if (!matches.length) return escapeHTML(source);
  const chunks = [];
  let cursor = 0;
  matches.forEach(match => {
    if (match.start > cursor) chunks.push(escapeHTML(source.slice(cursor, match.start)));
    const category = String(match.entry.category || 'scene').replace(/[^a-z-]/g, '');
    chunks.push(`<span class="lexicon-word lexicon-${category}" data-lexicon-word="${escapeHTML(match.text)}">${escapeHTML(match.text)}</span>`);
    cursor = match.end;
  });
  if (cursor < source.length) chunks.push(escapeHTML(source.slice(cursor)));
  return chunks.join('');
}

function analyzeOfflineLexicon(text) {
  const counts = { emotion: 0, action: 0, scene: 0, sequence: 0, filler: 0 };
  findOfflineLexiconMatches(text).forEach(match => {
    if (Object.prototype.hasOwnProperty.call(counts, match.entry.category)) counts[match.entry.category] += 1;
  });
  return counts;
}

// ===== 文本分析（本地词库） =====
function analyzeText(text) {
  if (!text || !text.trim()) return null;

  const lang = getLang();
  const fillerList = getFillerWords();
  const hedgeList = getHedgeWords();
  const vagueMap = getVagueToPrecise();

  const words = segmentText(text);
  const totalWords = words.length;

  const fillers = [];
  const hedges = [];
  const vagueWords = [];

  if (lang === 'en') {
    // 英文模式：需要处理多词短语（如 "you know", "I mean"）
    const textLower = text.toLowerCase();

    // 多词填充词/犹豫词用正则匹配（带词边界）
    fillerList.forEach(f => {
      const escaped = f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('\\b' + escaped + '\\b', 'gi');
      let match;
      while ((match = regex.exec(textLower)) !== null) {
        fillers.push({ word: f.toLowerCase(), position: match.index });
      }
    });

    hedgeList.forEach(h => {
      const escaped = h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('\\b' + escaped + '\\b', 'gi');
      let match;
      while ((match = regex.exec(textLower)) !== null) {
        hedges.push({ word: h.toLowerCase(), position: match.index });
      }
    });

    // 笼统词仍用单词匹配
    words.forEach((word, idx) => {
      const w = word.toLowerCase();
      const key = Object.keys(vagueMap).find(k => k.toLowerCase() === w);
      if (key) vagueWords.push({ word, position: idx, alternatives: vagueMap[key] });
    });
  } else {
    // 中文模式：保持原来的词典匹配逻辑
    words.forEach((word, idx) => {
      if (fillerList.some(f => f === word)) fillers.push({ word, position: idx });
    });
    words.forEach((word, idx) => {
      if (hedgeList.some(h => h === word)) hedges.push({ word, position: idx });
    });
    words.forEach((word, idx) => {
      const key = Object.keys(vagueMap).find(k => k === word);
      if (key) vagueWords.push({ word, position: idx, alternatives: vagueMap[key] });
    });
  }

  const meaningfulWords = totalWords - fillers.length - hedges.length;
  const density = totalWords > 0 ? (meaningfulWords / totalWords) : 1;

  return { totalWords, fillers, hedges, vagueWords, density: Math.round(density * 100) };
}

function segmentText(text) {
  if (getLang() === 'en') {
    // 英文用空格分词
    return text.split(/\s+/).filter(w => w.length > 0);
  }
  // 中文用词典匹配
  const words = [];
  let i = 0;
  const maxLen = 6;
  const fillerList = getFillerWords();
  const hedgeList = getHedgeWords();
  const vagueMap = getVagueToPrecise();
  const dict = new Set([...fillerList, ...hedgeList, ...Object.keys(vagueMap)]);

  while (i < text.length) {
    let matched = false;
    for (let len = Math.min(maxLen, text.length - i); len >= 2; len--) {
      const word = text.substring(i, i + len);
      if (dict.has(word)) {
        words.push(word);
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      words.push(text[i]);
      i++;
    }
  }
  return words;
}

function loadCustomPrompt() {
  const raw = localStorage.getItem('expr_v3_prompt');
  if (raw) return JSON.parse(raw);
  return { goals: '', customRules: '', styleRef: '', customWords: '' };
}

function saveCustomPrompt(prompt) {
  localStorage.setItem('expr_v3_prompt', JSON.stringify(prompt));
}

// V7 beta stores only the signed-in user's practice summary on the new server.
function track() {}
function reportToBackend(path, body = {}) {
  if (path !== '/api/session') return;
  const access = window.accessController;
  if (!access?.authToken || access.mode !== 'server') return;
  access.api('/api/account/activity', body).catch(() => {});
}

// ===== 主应用 =====
class ExpressionTrainer {
  constructor() {
    this.isRecording = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedTime = 0;
    this.pauseStart = null;
    this.timerInterval = null;
    this.fullText = '';
    this.sentences = [];
    this.stats = { fillers: 0, hedges: 0, vagueWords: 0, totalWords: 0, duration: 0, emotion: 0, action: 0, scene: 0, sequence: 0 };
    this.wordCounts = {}; // 累计每个填充词/犹豫词出现次数，用于阈值判断
    this.lastFeedbackText = '';
    this.lastReport = '';
    this.recordingId = null;
    this.recordingTopic = '';
    this.lastRecordingWasFree = false;
    this.recognition = null;
    this.freeHintsShown = new Set();

    this.initElements();
    this.bindEvents();

    track('page_view');
  }

  initElements() {
    this.btnStart = document.getElementById('btn-start');
    this.btnPaste = document.getElementById('btn-paste');
    this.btnPause = document.getElementById('btn-pause');
    this.btnResume = document.getElementById('btn-resume');
    this.btnStop = document.getElementById('btn-stop');
    this.btnReport = document.getElementById('btn-report');
    this.btnSettings = document.getElementById('btn-settings');
    this.btnLangToggle = document.getElementById('btn-lang-toggle');
    this.btnPromptEditor = document.getElementById('btn-prompt-editor');
    this.btnCopyText = document.getElementById('btn-copy-text');
    this.btnSaveText = document.getElementById('btn-save-text');
    this.btnClear = document.getElementById('btn-clear');
    this.btnReturnHome = document.getElementById('btn-return-home');
    this.timer = document.getElementById('timer');
    this.subtitleScroll = document.getElementById('subtitle-scroll');
    this.subtitleContainer = document.getElementById('subtitle-container');
    this.feedbackContent = document.getElementById('feedback-content');
    this.mainArea = document.querySelector('.main-area');

    // Modals
    this.promptModal = document.getElementById('prompt-modal');
    this.pasteModal = document.getElementById('paste-modal');
    this.reportModal = document.getElementById('report-modal');
    this.tipModal = document.getElementById('tip-modal');
    this.reportBody = document.getElementById('report-body');

    // Stats
    this.statFillers = document.getElementById('stat-fillers');
    this.statHedges = document.getElementById('stat-hedges');
    this.statVague = document.getElementById('stat-vague');
    this.statDensity = document.getElementById('stat-density');
    this.statEmotion = document.getElementById('stat-emotion');
    this.statAction = document.getElementById('stat-action');
    this.statScene = document.getElementById('stat-scene');
    this.statSequence = document.getElementById('stat-sequence');

    // 语言按钮初始状态
    if (this.btnLangToggle) this.btnLangToggle.textContent = getLang().toUpperCase();
  }

  bindEvents() {
    // Recording controls
    this.btnStart.addEventListener('click', () => window.accessController.open('record'));
    this.btnPause.addEventListener('click', () => this.pauseRecording());
    this.btnResume.addEventListener('click', () => this.resumeRecording());
    this.btnStop.addEventListener('click', () => this.stopRecording());
    this.btnReport.addEventListener('click', () => this.generateReport());
    this.btnReturnHome?.addEventListener('click', () => this.returnToHome());

    // Topbar
    this.btnSettings.addEventListener('click', () => window.accessController.open('settings'));
    this.btnLangToggle.addEventListener('click', () => this.toggleLang());
    this.btnPromptEditor.addEventListener('click', () => this.openPromptEditor());

    // Subtitle toolbar
    this.btnPaste.addEventListener('click', () => this.openPasteModal());
    this.btnCopyText.addEventListener('click', () => this.copyOriginalText());
    this.btnSaveText.addEventListener('click', () => this.saveOriginalText());
    this.btnClear.addEventListener('click', () => this.clearAll());

    // Prompt modal
    document.getElementById('btn-close-prompt').addEventListener('click', () => this.promptModal.classList.add('hidden'));
    document.getElementById('btn-save-prompt').addEventListener('click', () => this.savePromptForm());

    // Paste modal
    document.getElementById('btn-close-paste').addEventListener('click', () => this.pasteModal.classList.add('hidden'));
    document.getElementById('btn-analyze-paste').addEventListener('click', () => this.analyzePastedText());

    // Report modal
    document.getElementById('btn-close-report').addEventListener('click', () => this.closeReport());
    document.getElementById('btn-copy-report').addEventListener('click', () => this.copyReport());

    // Tip / watermark
    document.getElementById('watermark').addEventListener('click', () => this.tipModal.classList.remove('hidden'));
    document.getElementById('btn-close-tip').addEventListener('click', () => this.tipModal.classList.add('hidden'));

    // Inner watermark (Powered by ExprTrain) - 纯展示不可点
    this.watermarkInner = document.getElementById('watermark-inner');
    // 打赏弹窗
    this.coffeeModal = document.getElementById('coffee-modal');
    document.getElementById('btn-close-coffee').addEventListener('click', () => this.coffeeModal.classList.add('hidden'));
    // 侧边栏☕按钮
    document.getElementById('btn-coffee')?.addEventListener('click', (e) => { e.preventDefault(); this.coffeeModal.classList.remove('hidden'); });

    // Social toggle
    document.getElementById('social-toggle').addEventListener('click', () => {
      document.getElementById('social-panel').classList.toggle('hidden');
    });

    // Mobile tabs
    document.querySelectorAll('.mobile-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchMobilePanel(tab.dataset.panel));
    });
  }

  // ===== Mobile panel switching =====
  switchMobilePanel(panel) {
    document.querySelectorAll('.mobile-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.mobile-tab[data-panel="${panel}"]`).classList.add('active');

    const panelLeft = document.getElementById('panel-left');
    const panelRight = document.getElementById('panel-right');
    const mainArea = document.querySelector('.main-area');

    panelLeft.classList.remove('mobile-active');
    panelRight.classList.remove('mobile-active');
    mainArea.classList.remove('mobile-hidden');

    if (panel === 'left') {
      panelLeft.classList.add('mobile-active');
      mainArea.classList.add('mobile-hidden');
    } else if (panel === 'right') {
      panelRight.classList.add('mobile-active');
      mainArea.classList.add('mobile-hidden');
    }
  }

  // ===== Settings =====
  toggleLang() {
    const current = getLang();
    const next = current === 'zh' ? 'en' : 'zh';
    setLang(next);
    this.btnLangToggle.textContent = next.toUpperCase();
    // 提示用户
    const msg = next === 'en' ? 'Switched to English mode' : '已切换为中文模式';
    this.addFeedbackItem(msg, 'ai');
  }

  openPromptEditor() {
    const prompt = loadCustomPrompt();
    document.getElementById('prompt-goals').value = prompt.goals || '';
    document.getElementById('prompt-rules').value = prompt.customRules || '';
    document.getElementById('prompt-style').value = prompt.styleRef || '';
    document.getElementById('prompt-words').value = prompt.customWords || '';
    this.promptModal.classList.remove('hidden');
  }

  savePromptForm() {
    const prompt = {
      goals: document.getElementById('prompt-goals').value.trim(),
      customRules: document.getElementById('prompt-rules').value.trim(),
      styleRef: document.getElementById('prompt-style').value.trim(),
      customWords: document.getElementById('prompt-words').value.trim()
    };
    saveCustomPrompt(prompt);
    this.promptModal.classList.add('hidden');
  }

  // ===== 录制控制 (Web Speech API) =====
  startRecording() {
    if (!window.accessController.authorizedRecording) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      window.accessController.recordingEnded();
      this.showError('当前浏览器不支持语音识别，请使用支持语音识别的浏览器，或粘贴逐字稿分析。');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = getLang() === 'en' ? 'en-US' : 'zh-CN';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onstart = async () => {
      try {
        await window.accessController.recordingStarted();
      } catch (error) {
        this.stopRecording();
        this.showError(error.message);
      }
    };
    this.recognition.onresult = (event) => {
      if (this.isPaused) return;
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        this.handleASRResult({ text: finalTranscript, isFinal: true });
      }
      if (interimTranscript) {
        this.handleASRResult({ text: interimTranscript, isFinal: false });
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech') return; // normal
      if (event.error === 'aborted') return;
      this.stopRecording();
      this.showError(event.error === 'not-allowed' || event.error === 'service-not-allowed' ? '麦克风权限未开启。请允许浏览器使用麦克风后重试。' : '语音识别暂不可用，请检查网络和麦克风后重试。');
    };

    this.recognition.onend = () => {
      // Auto-restart if still recording
      if (this.isRecording && !this.isPaused) {
        try { this.recognition.start(); } catch (e) { this.stopRecording(); this.showError('语音识别未能继续，请重新开始录制。'); }
      }
    };

    try {
      this.recognition.start();
    } catch (err) {
      window.accessController.recordingEnded();
      this.showError(`语音识别启动失败: ${err.message}`);
      return;
    }

    this.isRecording = true;
    this.isPaused = false;
    this.startTime = Date.now();
    this.pausedTime = 0;
    this.pauseStart = null;
    this.lastFeedbackText = '';
    this.pastedText = false;
    this.fullText = '';
    this.recordingId = `expression-${Date.now()}`;
    this.sentences = [];
    this.resetStats();
    this.freeHintsShown = new Set();
    const freeContext = window.freeExpressionContext;
    this.recordingTopic = freeContext?.mode === 'free' ? (freeContext.scene || '') : '';
    this.subtitleContainer.innerHTML = freeContext?.mode === 'free'
      ? `<div class="free-live-prompt"><b>自由表达 · ${escapeHTML(freeContext.scene)}</b><span>说话小路线：${(freeContext.prompts || []).map(escapeHTML).join('　')}</span><small>不用背稿，右侧会根据你说的内容实时提示。</small></div>`
      : '';
    this.feedbackContent.innerHTML = '<div class="feedback-empty">我会帮你留意：事情、原因、结果、具体瞬间和感受。</div>';
    if (freeContext?.mode === 'free') {
      this.addFeedbackItem(`先说清楚：${freeContext.prompts?.[0] || '发生了什么？'}`, 'ai');
      this.addFeedbackItem('可以补一句：为什么、后来结果怎样', 'ai');
      this.addFeedbackItem('再加一个具体瞬间、动作或画面', 'ai');
      this.addFeedbackItem('最后说说你的感受或希望', 'ai');
      this.addFeedbackItem('每天说一点真实小事，不用背稿', 'good');
    }

    // UI
    this.btnStart.classList.add('hidden');
    this.btnPause.classList.remove('hidden');
    this.btnStop.classList.remove('hidden');
    this.btnReport.classList.add('hidden');
    this.btnReturnHome?.classList.add('hidden');
    this.btnResume.classList.add('hidden');
    this.btnCopyText.classList.add('hidden');
    this.btnSaveText.classList.add('hidden');
    this.btnClear.classList.add('hidden');
    this.timer.classList.add('active');
    this.btnSettings.disabled = this.btnPaste.disabled = this.btnLangToggle.disabled = true;
    document.getElementById('btn-access-manage').disabled = true;

    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    track('recording_start');
  }

  pauseRecording() {
    if (!this.isRecording || this.isPaused) return;
    window.accessController.recordingPaused();
    this.isPaused = true;
    this.pauseStart = Date.now();
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) { /* ignore */ }
    }
    this.btnPause.classList.add('hidden');
    this.btnResume.classList.remove('hidden');
    this.timer.classList.remove('active');
  }

  resumeRecording() {
    if (!this.isRecording || !this.isPaused) return;
    this.isPaused = false;
    this.pausedTime += Date.now() - this.pauseStart;
    this.pauseStart = null;
    if (this.recognition) {
      try { this.recognition.start(); } catch (e) { this.stopRecording(); this.showError('语音识别未能继续，请重新开始录制。'); }
    }
    this.btnResume.classList.add('hidden');
    this.btnPause.classList.remove('hidden');
    this.timer.classList.add('active');
  }

  stopRecording() {
    if (!this.isRecording) return;
    const wasFreeExpression = window.freeExpressionContext?.mode === 'free';
    this.lastRecordingWasFree = wasFreeExpression;
    const interimText = this.subtitleContainer.querySelector('.interim-line')?.textContent.trim() || '';
    if (wasFreeExpression && !this.fullText.trim() && interimText) {
      this.fullText = interimText;
      this.sentences.push(interimText);
      this.analyzeCurrentSentence(interimText);
      this.renderSubtitle(interimText, true);
    }
    this.isRecording = false;
    window.accessController.recordingEnded();
    this.btnSettings.disabled = this.btnPaste.disabled = this.btnLangToggle.disabled = false;
    document.getElementById('btn-access-manage').disabled = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) { /* ignore */ }
      this.recognition = null;
    }
    this.isRecording = false;
    this.isPaused = false;

    clearInterval(this.timerInterval);
    let totalPaused = this.pausedTime;
    if (this.pauseStart) totalPaused += Date.now() - this.pauseStart;
    this.stats.duration = Math.floor((Date.now() - this.startTime - totalPaused) / 1000);

    // UI
    this.btnStop.classList.add('hidden');
    this.btnPause.classList.add('hidden');
    this.btnResume.classList.add('hidden');
    this.btnStart.classList.remove('hidden');
    this.timer.classList.remove('active');

    if (this.fullText.trim()) {
      this.btnReport.classList.remove('hidden');
      this.btnReturnHome?.classList.remove('hidden');
      this.btnCopyText.classList.remove('hidden');
      this.btnSaveText.classList.remove('hidden');
      this.btnClear.classList.remove('hidden');
    }

    track('recording_stop', { duration: this.stats.duration, words: this.stats.totalWords });
    // 上报训练数据到后端
    if (this.fullText.trim()) {
      this.saveExpressionHistory();
      const density = this.stats.totalWords > 0 ? ((this.stats.totalWords - this.stats.fillers - this.stats.hedges) / this.stats.totalWords * 100).toFixed(0) + '%' : '--';
      reportToBackend('/api/session', { recordingId: this.recordingId, duration: this.stats.duration, totalWords: this.stats.totalWords, fillers: this.stats.fillers, hedges: this.stats.hedges, vagueWords: this.stats.vagueWords, density, fullText: this.fullText.slice(0, 5000) });
    }
    window.freeExpressionContext = null;
    // 自由表达结束后直接进入 AI 分析，避免回到没有内容的空白练习层。
    // 普通录制仍保留“生成报告”按钮，用户可以决定是否生成分析。
    if (wasFreeExpression) {
      setTimeout(() => this.generateReport(), 120);
    }
  }

  // ===== ASR结果处理 =====
  handleASRResult({ text, isFinal }) {
    if (isFinal) {
      this.sentences.push(text);
      this.fullText += text;
      this.analyzeCurrentSentence(text);
      this.analyzeFreeExpression(text);

      // 每30字触发一次AI反馈
      if (this.fullText.length - this.lastFeedbackText.length >= 30) {
        this.requestRealtimeFeedback();
      }
    }
    this.renderSubtitle(text, isFinal);
  }

  renderSubtitle(currentText, isFinal) {
    if (isFinal) {
      const interim = this.subtitleContainer.querySelector('.interim-line');
      if (interim) interim.remove();

      this.subtitleContainer.querySelectorAll('.subtitle-line:not(.old)').forEach(el => {
        el.classList.add('old');
      });

      const line = document.createElement('div');
      line.className = 'subtitle-line';
      line.innerHTML = this.highlightText(currentText);
      this.subtitleContainer.appendChild(line);
    } else {
      let interim = this.subtitleContainer.querySelector('.interim-line');
      if (!interim) {
        interim = document.createElement('div');
        interim.className = 'subtitle-line interim-line';
        this.subtitleContainer.appendChild(interim);
      }
      interim.textContent = currentText;
    }

    this.subtitleScroll.scrollTop = this.subtitleScroll.scrollHeight;
  }

  highlightText(text) {
    if (getLang() === 'zh' && OFFLINE_LEXICON.entries?.length) return highlightOfflineLexicon(text);
    let result = escapeHTML(text);
    const isEn = getLang() === 'en';
    const fillers = getFillerWords();
    const hedges = getHedgeWords();
    const vagueMap = getVagueToPrecise();
    const vagueKeys = Object.keys(vagueMap);

    // 英文模式用 \b 词边界，防止匹配单词内部子串
    function makePattern(wordList, flags) {
      const sorted = [...wordList].sort((a, b) => b.length - a.length);
      const escaped = sorted.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      if (isEn) {
        return new RegExp('\\b(' + escaped.join('|') + ')\\b', flags);
      }
      return new RegExp('(' + escaped.join('|') + ')', flags);
    }

    // 笼统词
    const vaguePattern = makePattern(vagueKeys, isEn ? 'gi' : 'g');
    result = result.replace(vaguePattern, '<span class="vague">$1</span>');
    // 填充词
    const fillerPattern = makePattern(fillers, isEn ? 'gi' : 'g');
    result = result.replace(fillerPattern, '<span class="filler">$1</span>');
    // 犹豫词
    const hedgePattern = makePattern(hedges, isEn ? 'gi' : 'g');
    result = result.replace(hedgePattern, '<span class="hedge">$1</span>');
    return result;
  }

  // ===== 分析 =====
  analyzeCurrentSentence(text) {
    const analysis = analyzeText(text);
    if (analysis) {
      this.stats.fillers += analysis.fillers.length;
      this.stats.hedges += analysis.hedges.length;
      this.stats.vagueWords += analysis.vagueWords.length;
      this.stats.totalWords += analysis.totalWords;
      const lexiconCounts = analyzeOfflineLexicon(text);
      Object.keys(lexiconCounts).forEach(category => {
        this.stats[category] = (this.stats[category] || 0) + lexiconCounts[category];
      });
      this.updateStatsDisplay();

      // 累计每个词的出现次数
      analysis.fillers.forEach(f => {
        const key = 'filler:' + (f.word || '').toLowerCase();
        this.wordCounts[key] = (this.wordCounts[key] || 0) + 1;
      });
      analysis.hedges.forEach(h => {
        const key = 'hedge:' + (h.word || '').toLowerCase();
        this.wordCounts[key] = (this.wordCounts[key] || 0) + 1;
      });

      // 笼统词 → 反馈栏弹替换建议（笼统词不设阈值，出现就提示替换）
      if (analysis.vagueWords.length > 0) {
        analysis.vagueWords.forEach(item => {
          const alts = item.alternatives.slice(0, 3).join(' / ');
          this.addFeedbackItem(`「${item.word}」可以说得更具体：${alts}`, 'vague');
        });
      }

      // 填充词提醒：只有累计出现≥2次的词才提醒
      const repeatFillers = analysis.fillers
        .map(f => f.word.toLowerCase())
        .filter(w => this.wordCounts['filler:' + w] >= 2);
      if (repeatFillers.length > 0) {
        const unique = [...new Set(repeatFillers)].slice(0, 3);
        const lang = getLang();
        if (lang === 'en') {
          this.addFeedbackItem(`Filler: ${unique.join(', ')} — try pausing`, 'filler');
        } else {
          this.addFeedbackItem(`听到“${unique.join('、')}”，试试停一下再说`, 'filler');
        }
      }

      // 犹豫词提醒：只有累计出现≥2次的词才提醒
      const repeatHedges = analysis.hedges
        .map(h => h.word.toLowerCase())
        .filter(w => this.wordCounts['hedge:' + w] >= 2);
      if (repeatHedges.length > 0) {
        const unique = [...new Set(repeatHedges)].slice(0, 2);
        const lang = getLang();
        if (lang === 'en') {
          this.addFeedbackItem(`Hedging: ${unique.join(', ')} — be direct`, 'hedge');
        } else {
          this.addFeedbackItem(`“${unique.join('、')}”有点不确定，可以把想法说清楚`, 'hedge');
        }
      }
    }
  }

  updateStatsDisplay() {
    if (this.statEmotion) this.statEmotion.textContent = this.stats.emotion || 0;
    if (this.statAction) this.statAction.textContent = this.stats.action || 0;
    if (this.statScene) this.statScene.textContent = this.stats.scene || 0;
    if (this.statSequence) this.statSequence.textContent = this.stats.sequence || 0;
    if (this.statFillers) this.statFillers.textContent = this.stats.fillers;
    if (this.statHedges) this.statHedges.textContent = this.stats.hedges;
    if (this.statVague) this.statVague.textContent = this.stats.vagueWords;
    if (this.stats.totalWords > 0) {
      const density = ((this.stats.totalWords - this.stats.fillers - this.stats.hedges) / this.stats.totalWords * 100).toFixed(0);
      this.statDensity.textContent = density + '%';
    }
  }

  analyzeFreeExpression(text) {
    const context = window.freeExpressionContext;
    if (context?.mode !== 'free') return;
    const spoken = (this.fullText || text || '').trim();
    const addHintOnce = (key, message, type = 'ai') => {
      if (this.freeHintsShown.has(key)) return;
      this.freeHintsShown.add(key);
      this.addFeedbackItem(message, type);
    };
    if (spoken.length >= 18 && !/(后来|结果|最后|于是|因此)/.test(spoken)) addHintOnce('result', '补一句后来结果怎样');
    if (spoken.length >= 24 && !/(因为|由于|所以)/.test(spoken)) addHintOnce('reason', '说说为什么会这样');
    if (spoken.length >= 30 && !/(看见|看到|听见|听到|当时|那一刻|突然|画面|动作)/.test(spoken)) addHintOnce('detail', '加一个具体瞬间');
    if (spoken.length >= 35 && !/(开心|自豪|委屈|难过|紧张|害羞|遗憾|惊喜|生气|期待|担心|骄傲|激动|失望|安心|害怕|希望|想要|感到)/.test(spoken)) addHintOnce('feeling', '说说你的感受或希望');
    if (/(我认为|我觉得|我喜欢|我不喜欢)/.test(spoken) && !/(因为|由于)/.test(spoken)) addHintOnce('opinion', '观点后面补一个理由');
    if (spoken.length >= 40 && !/(你|他|她|同学|朋友|老师|家人)/.test(spoken)) addHintOnce('listen', '想想对方会怎么回应');
  }

  // ===== 实时AI反馈 =====
  async requestRealtimeFeedback() {
    if (this.feedbackPending || Date.now() - (this.lastAIAt || 0) < 5000) return;
    if (!window.accessController.canAnalyze(this.pastedText)) return;
    this.feedbackPending = true;
    this.lastAIAt = Date.now();
    this.lastFeedbackText = this.fullText;
    const customPrompt = loadCustomPrompt();
    const elapsed = this.stats.duration || Math.floor((Date.now() - (this.startTime || Date.now())) / 1000);
    const freeContext = window.freeExpressionContext || {};
    const prompt = getRealtimePrompt(this.fullText, {
      elapsedSec: elapsed,
      topic: freeContext.scene ? `${freeContext.scene}场景` : '',
      guidancePrompts: freeContext.prompts || [],
      freeMode: freeContext.mode === 'free',
      freeGuidance: freeContext.guidance || []
    }, customPrompt);

    const messages = [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user }
    ];

    const result = await callAI(messages, 150);
    this.feedbackPending = false;
    if (result) {
      const lines = result.split('\n').filter(l => l.trim());
      lines.forEach(line => {
        const type = this.classifyFeedback(line.trim());
        this.addFeedbackItem(line.trim(), type);
      });
    }
  }

  classifyFeedback(text) {
    if (text === '✓' || text.includes('✓')) return 'good';
    if (text.includes('⭐')) return 'good';
    const fillerKeywords = ['嗯', '啊', '呃', '那个', '就是', '然后', '这个', '对吧', '是吧', '反正', '基本上', '所以说'];
    if (fillerKeywords.some(w => text.includes(`「${w}」`))) return 'filler';
    const hedgeKeywords = ['可能', '也许', '大概', '应该', '我觉得', '好像', '似乎', '感觉', '或许'];
    if (hedgeKeywords.some(w => text.includes(`「${w}」`))) return 'hedge';
    if (text.includes('→')) return 'vague';
    return 'ai';
  }

  addFeedbackItem(text, type = 'ai') {
    this.feedbackContent.querySelector('.feedback-empty')?.remove();
    const existing = Array.from(this.feedbackContent.children).slice(0, 3);
    if (existing.some(el => el.textContent === text)) return;

    const item = document.createElement('div');
    item.className = `feedback-item type-${type}`;
    item.textContent = text;
    this.feedbackContent.insertBefore(item, this.feedbackContent.firstChild);
    while (this.feedbackContent.children.length > 12) {
      this.feedbackContent.removeChild(this.feedbackContent.lastChild);
    }
  }

  // ===== 报告 =====
  async generateReport() {
    const hasTranscript = Boolean(this.fullText.trim());
    if (!hasTranscript && !this.lastRecordingWasFree) return;
    const canUseAI = hasTranscript && window.accessController.canAnalyze(this.pastedText);
    if (!canUseAI && !this.lastRecordingWasFree) {
      window.accessController.open('report', this.pastedText);
      return;
    }
    if (this.generatingReport) return;
    this.generatingReport = true;
    this.reportBody.innerHTML = '<p style="text-align:center;color:#6c5b70;padding:40px;">正在整理你的表达，一会儿就好…</p>';
    this.reportModal.classList.remove('hidden');
    track('report_generate');

    // 自由表达即使暂时没有可用 Key，也要给孩子一个即时、可关闭的分析弹窗。
    if (!canUseAI && this.lastRecordingWasFree) {
      const localReport = this.buildLocalChildReport();
      this.lastReport = localReport;
      this.generatingReport = false;
      this.saveExpressionHistory(localReport);
      this.renderReport(localReport);
      track('report_success');
      return;
    }

    const customPrompt = loadCustomPrompt();
    const prompt = getReportPrompt(this.fullText, this.stats, customPrompt);
    const messages = [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user }
    ];

    const result = await callAI(messages, 4096);
    this.generatingReport = false;
    if (result) {
      this.lastReport = result;
      this.saveExpressionHistory(result);
      this.renderReport(result);
      track('report_success');
      // 报告内容也上报后端
      reportToBackend('/api/session', { recordingId: this.recordingId, duration: this.stats.duration, totalWords: this.stats.totalWords, fillers: this.stats.fillers, hedges: this.stats.hedges, vagueWords: this.stats.vagueWords, density: '', fullText: this.fullText.slice(0, 5000), report: result.slice(0, 10000) });
    } else if (this.lastRecordingWasFree) {
      const localReport = this.buildLocalChildReport();
      this.lastReport = localReport;
      this.saveExpressionHistory(localReport);
      this.renderReport(localReport);
    } else {
      this.reportBody.textContent = window.accessController.lastError || '生成失败，请稍后重试。';
    }
  }

  buildLocalChildReport() {
    const text = this.fullText.trim();
    const stats = this.stats;
    const density = stats.totalWords > 0 ? Math.round((stats.totalWords - stats.fillers - stats.hedges) / stats.totalWords * 100) : 0;
    const endingHint = /(后来|结果|最后|于是|因此)/.test(text) ? '你有说到事情后来怎么样，顺序已经很清楚。' : '下次可以补一句“后来怎么样”，故事就更完整。';
    const detailHint = /(看见|看到|听见|听到|当时|那一刻|突然|画面|动作|在)/.test(text) ? '你说到了具体的画面或动作，听的人更容易想象。' : '下次加一个具体瞬间、动作或画面，别人会更容易听懂。';
    const feelingHint = /(开心|自豪|委屈|难过|紧张|害羞|遗憾|惊喜|生气|期待|担心|骄傲|激动|失望|安心|害怕|希望|想要|感到)/.test(text) ? '你把自己的感受说出来了，这让故事更像你。' : '最后可以说说“我感到……，我希望……”。';
    return `## 🌟 你已经做到
- 你愿意把真实发生的事情说出来了。
- ${endingHint}
- ${detailHint}

## 🧩 下一步只练一小步
${feelingHint}

## 📌 今天的小数据
| 项目 | 结果 |
|------|------|
| 练习时长 | ${stats.duration} 秒 |
| 说了多少字 | ${stats.totalWords} 字 |
| 停顿词 | ${stats.fillers} 次 |
| 说清楚度 | ${density}% |

## ✅ 给孩子的一句话
你已经开口讲出来了，下一次再补一个具体瞬间就更棒。`;
  }

  renderReport(report) {
    let html = escapeHTML(report)
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/\n/g, '<br>');

    this.reportBody.innerHTML = `
      <div class="report-actions">
        <button id="btn-download-report" style="background:#E5007E;color:#fff;border:none;border-radius:6px;padding:8px 14px;font-size:12px;cursor:pointer;">💾 下载 Markdown</button>
        <button id="btn-return-to-practice" class="report-return-button" type="button">← 回到刚才的练习</button>
      </div>
      ${html}
    `;

    document.getElementById('btn-download-report').addEventListener('click', () => this.downloadReport());
    document.getElementById('btn-return-to-practice').addEventListener('click', () => this.closeReport());
  }

  closeReport() {
    this.reportModal.classList.add('hidden');
    this.mainArea?.classList.remove('mobile-hidden');
    document.querySelector('.mobile-tab[data-panel="main"]')?.click();
    this.subtitleScroll?.scrollTo({ top: this.subtitleScroll.scrollHeight, behavior: 'smooth' });
  }

  saveExpressionHistory(report = '') {
    if (!this.fullText.trim() || !this.recordingId) return;
    const storageKey = 'expr_v3_expression_history';
    const density = this.stats.totalWords > 0 ? Math.round((this.stats.totalWords - this.stats.fillers - this.stats.hedges) / this.stats.totalWords * 100) : 0;
    const entry = {
      id: this.recordingId,
      title: this.recordingTopic ? `自由表达 · ${this.recordingTopic}` : '自由表达练习',
      text: this.fullText.trim(),
      report: (report || this.lastReport || '').slice(0, 12000),
      duration: this.stats.duration,
      totalWords: this.stats.totalWords,
      fillers: this.stats.fillers,
      hedges: this.stats.hedges,
      vagueWords: this.stats.vagueWords,
      density,
      createdAt: new Date().toISOString()
    };
    try {
      const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const list = Array.isArray(history) ? history : [];
      const existingIndex = list.findIndex(item => item?.id === entry.id);
      if (existingIndex >= 0) list[existingIndex] = { ...list[existingIndex], ...entry, createdAt: list[existingIndex].createdAt || entry.createdAt };
      else list.unshift(entry);
      localStorage.setItem(storageKey, JSON.stringify(list.slice(0, 50)));
    } catch (_) {}
  }

  returnToHome() {
    this.closeReport();
    document.getElementById('kids-home')?.classList.remove('is-launching', 'is-reading', 'adventure-open');
    document.getElementById('reading-hub')?.setAttribute('hidden', '');
    document.getElementById('free-expression-hub')?.setAttribute('hidden', '');
    this.mainArea?.classList.remove('free-expression-mode');
    this.clearAll();
    this.btnReturnHome?.classList.add('hidden');
    document.getElementById('kids-home')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  downloadReport() {
    if (!this.lastReport) return;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
    const markdown = `# 表达训练报告\n\n**日期**: ${dateStr}  \n**时长**: ${this.stats.duration}秒  \n**总字数**: ${this.stats.totalWords}  \n\n---\n\n## 完整原文\n\n${this.fullText}\n\n---\n\n${this.lastReport}`;
    const filename = `表达训练-${dateStr}-${timeStr}.md`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    const btn = document.getElementById('btn-download-report');
    btn.textContent = '✓ 已下载';
    btn.style.background = '#333';
    setTimeout(() => { btn.textContent = '💾 下载 Markdown'; btn.style.background = '#E5007E'; }, 2000);
  }

  copyReport() {
    const reportText = this.reportBody.innerText;
    navigator.clipboard.writeText(reportText).then(() => {
      const btn = document.getElementById('btn-copy-report');
      btn.textContent = '✅ 已复制';
      setTimeout(() => { btn.textContent = '📋 复制全文'; }, 2000);
    });
  }

  // ===== 粘贴逐字稿分析 =====
  openPasteModal() {
    document.getElementById('paste-textarea').value = '';
    this.pasteModal.classList.remove('hidden');
    document.getElementById('paste-textarea').focus();
  }

  analyzePastedText() {
    const text = document.getElementById('paste-textarea').value.trim();
    if (!text) return;

    this.pasteModal.classList.add('hidden');
    this.subtitleContainer.innerHTML = '';
    this.fullText = text;
    this.pastedText = true;
    this.lastFeedbackText = '';
    this.resetStats();

    const sentences = text.split(/(?<=[。！？\n])/g).filter(s => s.trim());
    this.sentences = sentences;

    for (const sentence of sentences) {
      const line = document.createElement('div');
      line.className = 'subtitle-line';
      line.innerHTML = this.highlightText(sentence.trim());
      this.subtitleContainer.appendChild(line);

      const analysis = analyzeText(sentence);
      if (analysis) {
        this.stats.fillers += analysis.fillers.length;
        this.stats.hedges += analysis.hedges.length;
        this.stats.vagueWords += analysis.vagueWords.length;
        this.stats.totalWords += analysis.totalWords;
        const lexiconCounts = analyzeOfflineLexicon(sentence);
        Object.keys(lexiconCounts).forEach(category => {
          this.stats[category] = (this.stats[category] || 0) + lexiconCounts[category];
        });
      }
    }

    this.stats.duration = 0;
    this.updateStatsDisplay();

    this.btnReport.classList.remove('hidden');
    this.btnCopyText.classList.remove('hidden');
    this.btnSaveText.classList.remove('hidden');
    this.btnClear.classList.remove('hidden');

    this.requestRealtimeFeedback();
  }

  // ===== 工具 =====
  updateTimer() {
    let totalPaused = this.pausedTime;
    if (this.pauseStart) totalPaused += Date.now() - this.pauseStart;
    const elapsed = Math.floor((Date.now() - this.startTime - totalPaused) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    this.timer.textContent = `${minutes}:${seconds}`;
  }

  resetStats() {
    this.stats = { fillers: 0, hedges: 0, vagueWords: 0, totalWords: 0, duration: 0, emotion: 0, action: 0, scene: 0, sequence: 0 };
    this.wordCounts = {};
    this.updateStatsDisplay();
    this.feedbackContent.innerHTML = '<div class="feedback-empty">选好主题后开口说，我会用孩子听得懂的话提醒你。</div>';
  }

  showError(msg) {
    const line = document.createElement('div');
    line.className = 'subtitle-line';
    line.style.color = '#ff6b6b';
    line.textContent = msg;
    this.subtitleContainer.appendChild(line);
  }

  copyOriginalText() {
    if (!this.fullText.trim()) return;
    navigator.clipboard.writeText(this.fullText).then(() => {
      this.btnCopyText.textContent = '✅ 已复制';
      setTimeout(() => { this.btnCopyText.textContent = '📋 复制'; }, 1500);
    });
  }

  saveOriginalText() {
    if (!this.fullText.trim()) return;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
    const markdown = `# 表达训练原文\n\n**日期**: ${dateStr}\n\n---\n\n${this.fullText}`;
    const filename = `原文-${dateStr}-${timeStr}.md`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    this.btnSaveText.textContent = '✅ 已保存';
    setTimeout(() => { this.btnSaveText.textContent = '💾 保存'; }, 2000);
  }

  clearAll() {
    this.fullText = '';
    this.sentences = [];
    this.lastReport = '';
    this.subtitleContainer.innerHTML = '<div class="subtitle-line hint">点击下方按钮开始说话</div>';
    this.feedbackContent.innerHTML = '';
    this.resetStats();
    this.timer.textContent = '00:00';
    this.timer.classList.remove('active');
    this.btnReport.classList.add('hidden');
    this.btnCopyText.classList.add('hidden');
    this.btnSaveText.classList.add('hidden');
    this.btnClear.classList.add('hidden');
    this.btnReturnHome?.classList.add('hidden');
  }
}

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', () => {
  window.accessController = new AccessController();
  // 先加载本地词库，再开始任何语音练习；失败时自动使用内置最小词库。
  window.offlineLexiconReady = loadOfflineLexicon();
  window.trainer = new ExpressionTrainer();
  window.accessController.ready = window.accessController.init();
});
