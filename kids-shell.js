/*
 * Child-facing shell: the reading practice is deliberately local and does not
 * ask for an API key. The existing recorder remains the reliable free-speech
 * practice engine.
 */
(function () {
  const ARTICLES = [
    {
      id: 'window-tree', title: '窗边的小树', category: '观察小文', color: 'blue',
      summary: '一棵小树，陪着窗边的孩子一起长大。',
      text: '教室的窗边有一棵小树。春天，嫩绿的叶子像一把把小扇子，在风里轻轻摇晃。下课时，阳光落在叶片上，留下会移动的金色小点。夏天，小树撑开浓密的树荫，给窗边带来一片清凉。孩子们每天经过它，都能发现一点新的变化。',
      emotionWords: ['新鲜', '安静', '喜欢'], reciteGrips: ['窗边的小树', '季节里的变化', '孩子发现新变化'], recitePrompt: '你觉得孩子每天经过小树时，心情有什么变化？'
    },
    {
      id: 'firefly', title: '会发光的萤火虫', category: '趣味科普', color: 'yellow',
      summary: '小小的光从哪里来？一起认识萤火虫。',
      text: '夏夜的草丛里，常常能看见一闪一闪的萤火虫。它们腹部有一种特殊的发光器官，能把身体里的化学能变成柔和的光。萤火虫发光不是为了照亮整片夜空，而是在寻找伙伴、传递信号。我们观察它们时，要保持安静，也不要用手去捉。',
      emotionWords: ['好奇', '惊喜', '安静'], reciteGrips: ['夏夜草丛里的光', '身体里的发光器官', '发光是为了寻找伙伴'], recitePrompt: '萤火虫为什么会发光？你最记得哪一个画面？'
    },
    {
      id: 'little-kite', title: '小小的风筝', category: '儿童短文', color: 'pink',
      summary: '风把风筝送上天空，也把勇气送进心里。',
      text: '广场上，一只小风筝努力向上飞。刚开始，风不够大，它在地面上东倒西歪。小主人没有着急，而是顺着风向慢慢后退。忽然，一阵风吹来，风筝越过树梢，尾巴像彩带一样摆动。小主人抬头笑了，因为他知道，耐心也能把小小的愿望送到天空。',
      emotionWords: ['着急', '耐心', '开心'], reciteGrips: ['风筝一开始飞不起来', '小主人顺着风向后退', '风筝越过树梢'], recitePrompt: '小主人后来做了什么，风筝才飞起来？'
    }
    ,
    { id: 'rainy-afternoon', title: '没带伞的下午', category: '原创微情绪', color: 'blue', summary: '一把小伞，让着急的下午变得安心。', text: '放学时，天空突然变成了灰色。小雨点很快落在校门口的地砖上。小满摸了摸书包，才想起自己没有带伞。她站在屋檐下，看着同学一个个走远。这时，同桌把伞往她这边挪了挪。两个人挤在一把小伞下面，鞋尖都被雨水打湿了。小满原来很着急，后来却觉得这场雨没有那么讨厌。', emotionWords: ['着急', '失落', '安心'], reciteGrips: ['小满没有带伞', '同桌分享雨伞', '一起走回家'], recitePrompt: '小满一开始为什么着急？后来哪件事让她安心了？' },
    { id: 'last-eraser', title: '最后一块橡皮', category: '原创微情绪', color: 'yellow', summary: '一小块橡皮，刚好够两个人使用。', text: '小禾的橡皮只剩最后一小块了。同桌的作业本上写错了一个大字，却找不到橡皮。小禾把橡皮握在手里，想起自己下午也要用它。她犹豫了一会儿，还是把橡皮掰成两半。同桌接过小半块，马上把那个字擦干净了。小禾发现，自己的半块橡皮也够用。她低头写字时，心里多了一点轻快的感觉。', emotionWords: ['犹豫', '分享', '轻快'], reciteGrips: ['最后一块橡皮', '小禾掰成两半', '两个人都完成作业'], recitePrompt: '小禾为什么把橡皮掰成两半？' },
    { id: 'curtain-sound', title: '窗帘后面的声音', category: '原创微情绪', color: 'pink', summary: '害怕的声音，原来是风吹动了一张画。', text: '晚上，小雨听见窗帘后面传来沙沙的声音。她先以为有人躲在那里，赶紧把被子拉到下巴。声音又响了一下，还碰到了窗台上的小花盆。小雨鼓起勇气，慢慢走过去。原来是窗户没有关紧，风把一张画吹得来回摆动。她关好窗户，又把画贴回墙上。刚才的害怕变成了松一口气的感觉。', emotionWords: ['害怕', '紧张', '放松'], reciteGrips: ['听见窗帘后的声音', '以为有人躲着', '发现是风吹画'], recitePrompt: '小雨是怎样发现声音真正来自哪里的？' },
    { id: 'not-chosen', title: '没有被选中的那一次', category: '原创微情绪', color: 'blue', summary: '没有站在台中央，也能完成重要的事。', text: '班里要选一名同学做小主持人。小宁举起了手，却没有被选中。她坐回座位，觉得胸口像压着一块小石头。老师后来请她负责检查每个人的麦克风。小宁发现，主持人能顺利讲话，离不开这些准备。活动结束时，老师说她让整个节目变得很顺利。小宁没有站在台中央，却第一次为自己的任务感到自豪。', emotionWords: ['失落', '难过', '自豪'], reciteGrips: ['小宁没有当上主持人', '检查每个人的麦克风', '让节目顺利完成'], recitePrompt: '小宁没有当主持人，后来为什么还是觉得自豪？' },
    { id: 'small-voice', title: '我把声音说小了', category: '原创微情绪', color: 'yellow', summary: '再试一次，声音就能被更多人听见。', text: '轮到小远在班上介绍自己的植物时，他的声音小得像蚊子。前排的同学没有听清，他的脸一下子热了起来。老师没有催他，只让他把叶子举高一点，再说一遍。小远看着那片新长出来的叶子，慢慢把声音放大。这一次，后排的同学也听见了。他坐回座位时，手心还有一点汗，却觉得自己完成了一件难事。', emotionWords: ['紧张', '害羞', '踏实'], reciteGrips: ['第一次声音太小', '老师给了一个方法', '第二次说清楚了'], recitePrompt: '老师让小远改变了哪个动作？' },
    { id: 'no-reply', title: '朋友没有马上回答', category: '原创微情绪', color: 'pink', summary: '没有马上回复，也不一定代表不在乎。', text: '小哲给朋友发了一条消息，却等了很久都没有收到回复。他开始猜，朋友是不是生气了。第二天见面时，朋友递给他一张画。原来，朋友昨晚一直在画这张图，想送给他做生日礼物。小哲看着画里歪歪扭扭的两个人，忽然觉得自己昨天想多了。有时候，没有马上回答，不代表不在乎。', emotionWords: ['疑惑', '担心', '理解'], reciteGrips: ['朋友没有回复消息', '朋友在准备生日画', '小哲发现自己误会了'], recitePrompt: '小哲后来知道了什么？' },
    { id: 'sneeze-moon', title: '会打喷嚏的月亮', category: '想象故事', color: 'yellow', summary: '知道真相以后，想象也没有消失。', text: '小满发现，每当月亮躲进云里，街上的灯就会闪三下。她以为月亮是在打喷嚏。她对着天空说：“月亮，你是不是着凉了？”第二天，爷爷告诉她，那是远处的灯塔在转动。小满有点失望，却没有放弃自己的想象。晚上，她给月亮画了一条蓝色围巾。她觉得，知道真相以后，月亮还是很好玩。', emotionWords: ['好奇', '失望', '想象'], reciteGrips: ['灯闪三下', '以为月亮打喷嚏', '给月亮画蓝围巾'], recitePrompt: '知道灯塔的真相后，小满还做了什么？' },
    { id: 'frog-leaf', title: '不想跳的青蛙', category: '原创微情绪', color: 'blue', summary: '从低一点的荷叶开始，也能跳到更远的地方。', text: '池塘边的小青蛙第一次看见高高的荷叶。哥哥们都跳过去了，它却只敢把脚尖伸出去。风一吹，荷叶晃了起来，小青蛙马上退回岸边。它先找来一片低一点的叶子，轻轻跳了一步。第二步时，它还是有点害怕，却没有停下来。最后，它站在最大的荷叶上，发现池塘原来这么宽。', emotionWords: ['害怕', '犹豫', '勇敢'], reciteGrips: ['小青蛙不敢跳高荷叶', '先选择低一点的叶子', '最后站上大荷叶'], recitePrompt: '小青蛙用什么办法让自己开始？' },
    { id: 'borrowed-shadow', title: '借来的影子', category: '原创微情绪', color: 'pink', summary: '两个影子重叠后，黑暗变成了一场游戏。', text: '小北怕黑，却不想让别人知道。放学时，他悄悄走在朋友身后，让朋友的影子盖住自己的影子。走到路灯下面，朋友忽然停住了。小北以为朋友发现了自己的秘密，脸一下红了。朋友却说：“你站近一点，我们的影子可以变成一只大怪兽。”两个影子重叠在一起，真的像一只张牙舞爪的怪兽。', emotionWords: ['害怕', '害羞', '开心'], reciteGrips: ['小北怕黑', '躲在朋友影子后面', '一起把影子变成怪兽'], recitePrompt: '朋友怎样帮小北把害怕变成了好玩的事？' },
    { id: 'wednesday-door', title: '星期三的门', category: '想象故事', color: 'yellow', summary: '门后没有宝藏，却藏着一段家人的记忆。', text: '小安在图书馆发现一扇只在星期三出现的小门。门后没有宝藏，只有一间放满旧地图的房间。墙上的地图会把人带到自己最想去的地方。小安最想去海边，可他先看见了地图角落里的一个小村子。那里标着“奶奶小时候住过的地方”。他没有马上去海边，而是先记下了这个村子的名字。', emotionWords: ['惊奇', '好奇', '想念'], reciteGrips: ['星期三出现的小门', '会带路的旧地图', '发现奶奶小时候的村子'], recitePrompt: '小安为什么改变了原来的计划？' },
    { id: 'bottle-wind', title: '把风装进瓶子', category: '想象故事', color: 'blue', summary: '风不能被关起来，却可以被记住。', text: '小澄想把海边的风带回家。她打开瓶子，对着海面等了很久，再把瓶盖迅速拧紧。回家后，瓶子里什么声音也没有。她有点失望，把瓶子放在窗台上。夜里，窗户缝里吹进一阵风，瓶子轻轻滚了一下。小澄忽然明白，风不能被关起来，却可以被记住。', emotionWords: ['期待', '失望', '明白'], reciteGrips: ['想把海风装进瓶子', '瓶子里没有声音', '用画和日期保存记忆'], recitePrompt: '小澄最后保存下来的是什么？' },
    { id: 'late-cloud', title: '会迟到的云', category: '自然故事', color: 'pink', summary: '走得慢一点，也能带来特别的风景。', text: '小树每天放学都会看天上的云。有一朵云总是慢吞吞的，常常落在队伍最后。小树担心它找不到回家的方向，就一路抬头陪着它。太阳快落山时，那朵云终于赶上了伙伴们。它把最后一小片粉色的晚霞留给小树。小树发现，有些人走得慢，却也能带来特别的风景。', emotionWords: ['担心', '陪伴', '惊喜'], reciteGrips: ['落在最后的云', '小树陪它回家', '云留下粉色晚霞'], recitePrompt: '那朵慢吞吞的云最后给小树带来了什么？' },
    { id: 'ferry-duck', title: '小船停在渡口', category: '自然故事', color: 'blue', summary: '晚一点出发，也不要把谁丢在后面。', text: '雨停以后，小河涨了水。小船停在渡口，没有马上出发。小河边的小男孩以为船夫忘记了方向。他走近一看，发现船夫正在等一只落单的小鸭子。小鸭子终于游到岸边，船才慢慢离开。男孩觉得，这趟船虽然晚了一点，却没有把谁丢在后面。', emotionWords: ['疑惑', '等待', '温暖'], reciteGrips: ['小船没有马上出发', '船夫等待落单的小鸭子', '没有把伙伴丢下'], recitePrompt: '船夫为什么愿意多等一会儿？' },
    { id: 'dragon-poem', title: '不情愿的龙想读诗', category: '想象故事', color: 'yellow', summary: '别人以为龙会喷火，它却更喜欢读诗。', text: '山洞里的小龙每天都在读诗。村里的人却认为，龙就应该喷火和吓人。骑士来到山脚，准备和它决斗。小龙没有喷火，只把自己最喜欢的一首诗读给骑士听。骑士听完后，发现小龙并不想伤害任何人。他们最后一起想办法，把山洞变成了一个可以听故事的地方。', emotionWords: ['委屈', '坚持', '被理解'], reciteGrips: ['小龙喜欢读诗', '大家误会它会伤人', '用读诗解决冲突'], recitePrompt: '小龙怎样让骑士了解真正的自己？' },
    { id: 'quiet-firework', title: '最安静的烟花', category: '想象故事', color: 'pink', summary: '不一定声音最大，才能被别人记住。', text: '广场上，所有烟花都在讨论谁的声音最大。只有一支小烟花躲在箱子角落里，不敢说话。点火以后，它没有发出巨响，只在天空展开一圈淡淡的蓝光。人群忽然安静下来，孩子们都抬头看着它。小烟花第一次知道，不一定要声音最大，才能让别人记住。', emotionWords: ['自卑', '紧张', '自信'], reciteGrips: ['小烟花躲在箱子角落', '在天空展开蓝色光圈', '发现自己的独特'], recitePrompt: '小烟花靠什么让大家记住它？' },
    { id: 'backward-clock', title: '倒着走的钟', category: '观察故事', color: 'blue', summary: '先观察，再下结论，答案会自己出现。', text: '小言发现，教室后面的钟每天都会倒着走。他担心上课时间全乱了，赶紧去告诉老师。老师没有马上修钟，而是问他：“你觉得它为什么这样走？”小言观察了一会儿，发现钟面后面贴着一块镜子。原来，钟没有倒着走，只是镜子把方向反过来了。他松了一口气，也记住了先观察再下结论。', emotionWords: ['担心', '好奇', '释然'], reciteGrips: ['钟看起来倒着走', '老师让小言观察', '发现镜子改变了方向'], recitePrompt: '小言后来发现了什么，才知道钟没有坏？' },
    { id: 'pocket-sea', title: '口袋里的小海', category: '想象故事', color: 'yellow', summary: '一枚贝壳，把海边的记忆带回了家。', text: '小洛把一枚贝壳放进口袋。走在回家的路上，他总觉得口袋里有海浪在响。他把贝壳贴到耳边，听见的却只是轻轻的风声。小洛没有把贝壳丢掉，而是想起了海边的白浪和湿沙。回到家后，他把贝壳放在书桌上。每次想念海边时，他都会停下来听一听。', emotionWords: ['想念', '安静', '满足'], reciteGrips: ['把贝壳放进口袋', '以为听见海浪', '贝壳带回海边记忆'], recitePrompt: '贝壳真正带回来的是什么？' },
    { id: 'paper-plane-wind', title: '纸飞机找不到风', category: '成长故事', color: 'blue', summary: '有时不是不够用力，而是还没找到方向。', text: '小齐折了一架很漂亮的纸飞机。他跑到操场上用力一扔，飞机却立刻掉了下来。他换了三个方向，飞机还是飞不远。最后，他站到树下，等一阵风从身后吹来。这一次，飞机越过了围栏，落在一片柔软的草地上。小齐发现，有时候不是自己不够用力，而是还没找到合适的方向。', emotionWords: ['失望', '尝试', '明白'], reciteGrips: ['纸飞机一次次掉下来', '小齐改变投掷方向', '等到顺风后飞远'], recitePrompt: '小齐最后改变了什么，纸飞机才飞远？' },
    { id: 'half-story', title: '只说一半的故事', category: '表达故事', color: 'pink', summary: '留下一个小悬念，大家更想听你说下去。', text: '小悠讲故事时，总是在最有趣的地方停下来。同学们急着问：“后来呢？”小悠觉得大家真的在认真听，便把人物接下来遇到的麻烦说了出来。她又停了一下，先问大家猜结局。有人猜错了，有人猜得很接近。小悠最后说出结局，发现同学们比以前更想听她讲完。', emotionWords: ['得意', '期待', '分享'], reciteGrips: ['故事停在关键地方', '同学们猜结局', '小悠继续讲完'], recitePrompt: '小悠怎样让大家更想听下去？' },
    { id: 'hidden-star', title: '把名字藏起来的星星', category: '想象故事', color: 'yellow', summary: '一点点光，也能帮别人看清下一步。', text: '夜空里有一颗小星星，总觉得自己的光太弱。它把名字藏在云后面，不愿意和其他星星打招呼。一天，一个迷路的小孩抬头看见它，顺着那一点光找到了回家的路。小星星这才知道，光不一定要照亮整座城市。只要能让一个人看清下一步，它就已经有了自己的名字。', emotionWords: ['自卑', '孤单', '被需要'], reciteGrips: ['小星星把名字藏起来', '微光帮助孩子回家', '发现自己的价值'], recitePrompt: '小星星什么时候发现自己的光很重要？' }
  ];

  // 朗读材料使用离线拼音标注，不把孩子的文章发送到第三方服务。
  // 这份词表覆盖内置文章及儿童常用表达；未收录的生僻字会保留原字，不影响朗读。
  const PINYIN_MAP = {
    教:'jiao',室:'shi',的:'de',窗:'chuang',边:'bian',有:'you',一:'yi',棵:'ke',小:'xiao',树:'shu',
    春:'chun',天:'tian',嫩:'nen',绿:'lv',叶:'ye',子:'zi',像:'xiang',把:'ba',扇:'shan',在:'zai',风:'feng',
    里:'li',轻:'qing',摇:'yao',晃:'huang',下:'xia',课:'ke',时:'shi',阳:'yang',光:'guang',落:'luo',片:'pian',
    上:'shang',留:'liu',会:'hui',移:'yi',动:'dong',金:'jin',色:'se',点:'dian',夏:'xia',撑:'cheng',开:'kai',
    浓:'nong',密:'mi',荫:'yin',给:'gei',带:'dai',来:'lai',清:'qing',凉:'liang',孩:'hai',们:'men',每:'mei',
    经:'jing',过:'guo',它:'ta',都:'dou',能:'neng',发:'fa',现:'xian',新:'xin',变:'bian',化:'hua',夜:'ye',
    草:'cao',丛:'cong',常:'chang',看:'kan',见:'jian',闪:'shan',萤:'ying',火:'huo',虫:'chong',腹:'fu',部:'bu',
    种:'zhong',特:'te',殊:'shu',器:'qi',官:'guan',身:'shen',体:'ti',学:'xue',成:'cheng',柔:'rou',和:'he',
    不:'bu',是:'shi',为:'wei',了:'le',照:'zhao',亮:'liang',整:'zheng',空:'kong',而:'er',寻:'xun',找:'zhao',
    伙:'huo',伴:'ban',传:'chuan',递:'di',信:'xin',号:'hao',我:'wo',观:'guan',察:'cha',要:'yao',保:'bao',
    持:'chi',安:'an',静:'jing',也:'ye',用:'yong',手:'shou',去:'qu',捉:'zhuo',广:'guang',场:'chang',只:'zhi',
    筝:'zheng',努:'nu',力:'li',向:'xiang',飞:'fei',刚:'gang',始:'shi',够:'gou',大:'da',地:'di',面:'mian',
    东:'dong',倒:'dao',歪:'wai',主:'zhu',人:'ren',没:'mei',着:'zhao',急:'ji',顺:'shun',慢:'man',后:'hou',
    退:'tui',忽:'hu',然:'ran',阵:'zhen',吹:'chui',越:'yue',梢:'shao',尾:'wei',巴:'ba',彩:'cai',样:'yang',
    摆:'bai',抬:'tai',头:'tou',笑:'xiao',因:'yin',他:'ta',知:'zhi',道:'dao',耐:'nai',心:'xin',愿:'yuan',
    望:'wang',送:'song',到:'dao',家:'jia',庭:'ting',校:'xiao',园:'yuan',同:'tong',朋:'peng',友:'you',旅:'lv',
    行:'xing',日:'ri',常:'chang',事:'shi',情:'qing',开:'kai',始:'shi',说:'shuo',话:'hua',感:'gan',觉:'jue',
    开:'kai',心:'xin',自:'zi',豪:'hao',委:'wei',屈:'qu',难:'nan',过:'guo',紧:'jin',张:'zhang',害:'hai',羞:'xiu',
    遗:'yi',憾:'han',惊:'jing',喜:'xi',生:'sheng',气:'qi',期:'qi',待:'dai',担:'dan',骄:'jiao',傲:'ao',激:'ji',
    失:'shi',安:'an',满:'man',兴:'xing',奋:'fen',希:'xi',西:'xi',我:'wo',想:'xiang',更:'geng',具:'ju',详:'xiang',
    细:'xi',结:'jie',果:'guo',原:'yuan',文:'wen',复:'fu',述:'shu',朗:'lang',读:'du',完:'wan',整:'zheng'
  };

  // The generated offline map covers the full CJK block, including parent-added materials.
  Object.assign(PINYIN_MAP, window.EXPR_PINYIN_MAP || {});

  function getPinyin(character) {
    return PINYIN_MAP[character] || '';
  }

  function voiceNeedsHttps() {
    const hostname = String(window.location?.hostname || '');
    return !window.isSecureContext && hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '::1';
  }

  function explainVoiceAccess(setMessage) {
    if (!voiceNeedsHttps()) return false;
    setMessage?.('语音识别需要安全连接，请用 HTTPS 打开页面；本机预览可直接使用。', 'error', '请使用 HTTPS 开启麦克风');
    return true;
  }

  function pinyinText(text) {
    return [...String(text || '')].map(character => getPinyin(character) || character).join(' ');
  }

  function tokenize(text) {
    return [...String(text || '').matchAll(/\r\n|\n|[ \t]+|[\u4e00-\u9fff]|[A-Za-z0-9]+|[，。！？；：“”‘’、,.!?;:]/g)].map(match => ({
      value: match[0],
      lineBreak: /^\r?\n$/.test(match[0]),
      whitespace: /^[ \t]+$/.test(match[0]),
      punctuation: /[^\u4e00-\u9fffA-Za-z0-9]/.test(match[0])
    }));
  }
  function normalizeSpeech(text) { return String(text || '').toLowerCase().replace(/[^\u4e00-\u9fffA-Za-z0-9]/g, ''); }
  function escapeHtml(text) { return String(text).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character])); }

  // 三条练习共用这一层“主表达体系”：中央字幕、左侧分析、右侧儿童提示。
  // 朗读复述和闯关故事仍保留各自的文章/闯关控件，但语音结果会同步到这里。
  function sharedExpressionStart(context = {}) {
    const trainer = window.trainer;
    const prompts = Array.isArray(context.prompts) ? context.prompts.filter(Boolean) : [];
    window.sharedExpressionContext = { ...context, prompts, text: '', currentPrompt: prompts[0] || context.openingHint || '先开口说第一句，不用一次说得很长。' };
    trainer?.resetStats?.();
    if (trainer) {
      trainer.fullText = '';
      trainer.sentences = [];
    }
    const subtitleContainer = trainer?.subtitleContainer || document.getElementById('subtitle-container');
    if (subtitleContainer) {
      subtitleContainer.innerHTML = `<div class="free-live-prompt shared-expression-prompt"><b>${escapeHtml(context.title || '表达练习')}</b><span>${escapeHtml(window.sharedExpressionContext.currentPrompt)}</span><small>我会在两边给你小提示，放心说自己的话。</small></div>`;
    }
    if (trainer?.feedbackContent) {
      trainer.feedbackContent.innerHTML = `<div class="feedback-empty shared-live-prompt"><b>现在提示</b><span>${escapeHtml(window.sharedExpressionContext.currentPrompt)}</span></div>`;
    }
    const mainArea = document.querySelector('.main-area');
    mainArea?.classList.add('shared-expression-active');
    if (context.fullPage) mainArea?.classList.add('shared-expression-full');

    // 主表达框只保留一个可读区域。顶部的小把手可拖动位置，右下角可拉伸大小。
    const subtitleScroll = trainer?.subtitleScroll || document.getElementById('subtitle-scroll');
    if (subtitleScroll && !subtitleScroll.querySelector('.shared-expression-drag-handle')) {
      const handle = document.createElement('button');
      handle.type = 'button';
      handle.className = 'shared-expression-drag-handle';
      handle.textContent = '↕ 拖动表达框 · ↘ 拉伸大小';
      handle.title = '拖动表达框；右下角可拉伸大小';
      subtitleScroll.prepend(handle);
      let drag = null;
      handle.addEventListener('pointerdown', event => {
        if (!mainArea?.classList.contains('shared-expression-active')) return;
        drag = {
          x: event.clientX,
          y: event.clientY,
          offsetX: Number.parseFloat(subtitleScroll.dataset.dragOffsetX || '0') || 0,
          offsetY: Number.parseFloat(subtitleScroll.dataset.dragOffsetY || '0') || 0
        };
        handle.setPointerCapture?.(event.pointerId);
        subtitleScroll.classList.add('is-dragging');
      });
      handle.addEventListener('pointermove', event => {
        if (!drag) return;
        const offsetX = Math.max(-260, Math.min(260, drag.offsetX + event.clientX - drag.x));
        const offsetY = Math.max(-90, Math.min(180, drag.offsetY + event.clientY - drag.y));
        subtitleScroll.dataset.dragOffsetX = String(offsetX);
        subtitleScroll.dataset.dragOffsetY = String(offsetY);
        subtitleScroll.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
      const stopDrag = () => { drag = null; subtitleScroll.classList.remove('is-dragging'); };
      handle.addEventListener('pointerup', stopDrag);
      handle.addEventListener('pointercancel', stopDrag);
    }
    const tools = document.getElementById('shared-expression-tools');
    const finishButton = document.getElementById('shared-expression-finish');
    const label = document.getElementById('shared-expression-label');
    if (tools && finishButton) {
      const canFinish = typeof context.onFinish === 'function';
      tools.classList.toggle('hidden', !canFinish);
      if (label) label.textContent = context.title || '主表达器';
      finishButton.textContent = context.finishLabel || '完成表达';
      finishButton.onclick = canFinish ? context.onFinish : null;
    }
  }

  function sharedExpressionPrompt(prompt) {
    const context = window.sharedExpressionContext;
    const value = String(prompt || '').trim();
    if (!context || !value || context.currentPrompt === value) return;
    context.currentPrompt = value;
    const subtitlePrompt = document.querySelector('.shared-expression-prompt span');
    if (subtitlePrompt) subtitlePrompt.textContent = value;
    const feedbackPrompt = document.querySelector('.shared-live-prompt span');
    if (feedbackPrompt) feedbackPrompt.textContent = value;
  }

  function sharedExpressionSpeech(text, isFinal = false) {
    const trainer = window.trainer;
    const context = window.sharedExpressionContext;
    if (!context || !String(text || '').trim()) return;
    const value = String(text).trim();
    if (!trainer) {
      const container = document.getElementById('subtitle-container');
      if (container && isFinal) {
        const line = document.createElement('div');
        line.className = 'subtitle-line'; line.textContent = value; container.appendChild(line);
      }
      return;
    }
    if (!isFinal) { trainer.renderSubtitle?.(value, false); return; }
    context.text = `${context.text || ''}${value}`;
    trainer.fullText = context.text;
    trainer.sentences.push(value);
    trainer.analyzeCurrentSentence?.(value);
    trainer.renderSubtitle?.(value, true);
    if (context.kind === 'recite') {
      const prompt = typeof context.getPrompt === 'function'
        ? context.getPrompt(context.text)
        : (context.text.length < 18 ? '接着说，后来发生了什么？' : '补充一个具体画面或细节。');
      sharedExpressionPrompt(prompt);
    }
    if (context.kind === 'adventure') {
      if (context.text.length >= 18 && !/(后来|结果|最后|于是)/.test(context.text)) trainer.addFeedbackItem('补一句后来怎么样，故事会更完整。', 'ai');
      if (context.text.length >= 24 && !/(开心|自豪|紧张|委屈|难过|惊喜|生气|期待|感到)/.test(context.text)) trainer.addFeedbackItem('用刚才的情绪词说说你的感受。', 'ai');
    }
  }

  function sharedExpressionFinish(message = '你完成了这次表达，看看两边的小提示吧。') {
    const trainer = window.trainer;
    if (trainer && message) trainer.addFeedbackItem(message, 'good');
  }

  function sharedExpressionEnd() {
    delete window.sharedExpressionContext;
    const mainArea = document.querySelector('.main-area');
    mainArea?.classList.remove('shared-expression-active', 'shared-expression-full');
    const tools = document.getElementById('shared-expression-tools');
    const finishButton = document.getElementById('shared-expression-finish');
    tools?.classList.add('hidden');
    if (finishButton) finishButton.onclick = null;
    const subtitleScroll = document.getElementById('subtitle-scroll');
    if (subtitleScroll) {
      subtitleScroll.style.removeProperty('transform');
      delete subtitleScroll.dataset.dragOffsetX;
      delete subtitleScroll.dataset.dragOffsetY;
      delete subtitleScroll.dataset.dragOffset;
      subtitleScroll.classList.remove('is-dragging');
    }
  }

  window.kidsShellSharedExpressionStart = sharedExpressionStart;
  window.kidsShellSharedExpressionSpeech = sharedExpressionSpeech;
  window.kidsShellSharedExpressionPrompt = sharedExpressionPrompt;
  window.kidsShellSharedExpressionFinish = sharedExpressionFinish;
  window.kidsShellSharedExpressionEnd = sharedExpressionEnd;

  const ADVENTURE_ISLANDS = [
    { id: 'family', name: '家庭', icon: '🏠', color: 'green', topics: [
      { id: 'family-dinner', title: '和家人一起吃饭', prompt: '你和家人吃饭时发生了什么？当时是什么感觉？' },
      { id: 'family-help', title: '我帮家人做了一件事', prompt: '你帮谁做了什么？你感到开心、自豪还是别的感觉？' },
      { id: 'family-misunderstanding', title: '一次小误会', prompt: '发生了什么误会？后来是怎么解决的？' }
    ] },
    { id: 'school', name: '校园', icon: '🎒', color: 'blue', topics: [
      { id: 'praised', title: '被老师表扬', prompt: '你最近因为什么事被老师表扬？当时是什么感觉？' },
      { id: 'criticized', title: '被老师批评', prompt: '老师为什么提醒你？你后来想怎么做？' },
      { id: 'class-speech', title: '上台发言', prompt: '你在台上说了什么？上台前和说完后是什么感觉？' },
      { id: 'friend-project', title: '和同学合作', prompt: '你们一起完成了什么？中间遇到什么情况？' }
    ] },
    { id: 'outdoor', name: '户外', icon: '🌳', color: 'orange', topics: [
      { id: 'new-discovery', title: '发现一个新东西', prompt: '你在户外发现了什么？哪一点最让你惊喜？' },
      { id: 'sports', title: '完成一次挑战', prompt: '你挑战了什么？过程中有什么心情变化？' },
      { id: 'help-outdoors', title: '户外的一次互相帮助', prompt: '你帮助了谁，或者谁帮助了你？后来发生了什么？' }
    ] },
    { id: 'friends', name: '朋友', icon: '🧡', color: 'pink', topics: [
      { id: 'friend-new', title: '认识一位新朋友', prompt: '你们是怎么认识的？第一印象是什么？' },
      { id: 'friend-play', title: '和朋友一起玩', prompt: '你们一起玩了什么？哪一刻最开心？' },
      { id: 'friend-conflict', title: '和朋友闹别扭', prompt: '发生了什么小矛盾？最后你们怎么说开的？' }
    ] },
    { id: 'travel', name: '旅行', icon: '🗺️', color: 'purple', topics: [
      { id: 'travel-first', title: '第一次去一个地方', prompt: '你第一次去了哪里？最先注意到什么？' },
      { id: 'travel-food', title: '旅行中遇到的美食', prompt: '你吃了什么？味道和心情怎么样？' },
      { id: 'travel-surprise', title: '旅行中的小惊喜', prompt: '旅途中发生了什么意外惊喜？你当时怎么反应？' }
    ] },
    { id: 'daily', name: '日常', icon: '✨', color: 'yellow', topics: [
      { id: 'daily-small-win', title: '我完成了一件小事', prompt: '你完成了什么小事？为什么觉得自己很棒？' },
      { id: 'daily-mistake', title: '一次小失误', prompt: '哪里出了小差错？你后来学到了什么？' },
      { id: 'daily-surprise', title: '今天的小惊喜', prompt: '今天有什么事情让你意外或开心？' }
    ] }
  ];

  class ReadingPractice {
    constructor() {
      this.hub = document.getElementById('reading-hub');
      if (!this.hub) return;
      this.library = document.getElementById('reading-library');
      this.customForm = document.getElementById('reading-custom-form');
      this.customText = document.getElementById('reading-custom-text');
      this.customTitle = document.getElementById('reading-custom-title');
      this.customStatus = document.getElementById('reading-custom-status');
      this.player = document.getElementById('reading-player');
      this.text = document.getElementById('reading-text');
      this.title = document.getElementById('reading-player-title');
      this.category = document.getElementById('reading-category');
      this.fill = document.getElementById('reading-progress-fill');
      this.meta = document.getElementById('reading-progress-meta');
      this.status = document.getElementById('reading-status');
      this.mic = document.getElementById('reading-mic');
      this.startButton = document.getElementById('reading-start');
      this.pauseButton = document.getElementById('reading-pause');
      this.stopButton = document.getElementById('reading-stop');
      this.skipButton = document.getElementById('reading-skip');
      this.recite = document.getElementById('reading-recite');
      this.reciteStart = document.getElementById('recite-start');
      this.reciteStop = document.getElementById('recite-stop');
      this.reciteTranscript = document.getElementById('recite-transcript');
      this.reciteGuidance = document.getElementById('recite-guidance');
      this.confirm = document.getElementById('reading-confirm');
      this.results = document.getElementById('reading-results');
      this.resultsOriginal = document.getElementById('results-original');
      this.resultsRecite = document.getElementById('results-recite');
      this.resultsFeedback = document.querySelector('#results-feedback span');
      this.resultsReciteGuide = document.getElementById('results-recite-guide');
      this.resultsReciteGrips = document.getElementById('results-recite-grips');
      this.resultsReciteEmotions = document.getElementById('results-recite-emotions');
      this.reciteFeedback = document.querySelector('#recite-feedback span');
      this.versionTabs = document.getElementById('recite-version-tabs');
      this.retryReciteButton = document.getElementById('reading-retry-recite');
      this.saveButton = document.getElementById('reading-save');
      this.saveState = document.getElementById('reading-save-state');
      this.celebration = document.getElementById('reading-celebration');
      this.articles = [...ARTICLES, ...this.readCustomArticles()].map(article => ({ ...article, pinyinText: article.pinyinText || pinyinText(article.text) }));
      this.selected = null; this.tokens = []; this.wordTokens = []; this.cursor = 0; this.confirmedCursor = 0;
      this.recognition = null; this.running = false; this.paused = false; this.phase = 'library'; this.reciting = false; this.reciteText = ''; this.reciteFinalText = '';
      this.reciteVersions = []; this.activeReciteVersion = 0; this.celebrationTimer = null; this.latestAnalysis = ''; this.savedHistoryId = null;
      this.bind(); this.renderLibrary();
    }
    bind() {
      document.getElementById('reading-back')?.addEventListener('click', () => this.close());
      document.getElementById('reading-change')?.addEventListener('click', () => this.showLibrary());
      document.getElementById('reading-add-material')?.addEventListener('click', () => this.toggleCustomForm(true));
      document.getElementById('reading-custom-close')?.addEventListener('click', () => this.toggleCustomForm(false));
      document.getElementById('reading-custom-save')?.addEventListener('click', () => this.saveCustomArticle());
      this.startButton?.addEventListener('click', () => this.start());
      this.pauseButton?.addEventListener('click', () => this.pause());
      this.stopButton?.addEventListener('click', () => this.finish());
      this.skipButton?.addEventListener('click', () => this.skipSentence());
      this.reciteStart?.addEventListener('click', () => this.startRecite());
      this.reciteStop?.addEventListener('click', () => this.finishRecite());
      this.retryReciteButton?.addEventListener('click', () => this.retryRecite());
      this.saveButton?.addEventListener('click', () => this.saveHistory());
      document.getElementById('confirm-recite')?.addEventListener('click', () => this.startConfirmedRecite());
      document.getElementById('confirm-reread')?.addEventListener('click', () => this.reread());
      this.text?.addEventListener('click', event => {
        const target = event.target.closest?.('[data-word-index]');
        if (!target) return;
        this.cursor = Math.max(this.cursor, Number(target.dataset.wordIndex) + 1);
        this.confirmedCursor = this.cursor;
        this.renderProgress();
      });
    }
    setMicState(state, label) {
      if (this.mic) {
        this.mic.className = `reading-mic is-${state}`;
        const labelNode = this.mic.querySelector('b');
        if (labelNode) labelNode.textContent = label;
      }
    }
    setStatus(text, micState = null, micLabel = '') {
      this.status.textContent = text;
      if (micState) this.setMicState(micState, micLabel || text);
    }
    readCustomArticles() {
      try {
        const value = JSON.parse(localStorage.getItem('expr_v3_reading_materials') || '[]');
        return Array.isArray(value) ? value.filter(item => item?.id && item?.text).map(item => ({ ...item, pinyinText: item.pinyinText || pinyinText(item.text) })) : [];
      } catch (_) { return []; }
    }
    readProgress() {
      try {
        const value = JSON.parse(localStorage.getItem('expr_v3_reading_progress') || '{}');
        return value && typeof value === 'object' ? value : {};
      } catch (_) { return {}; }
    }
    markArticleProgress(kind) {
      if (!this.selected) return;
      const progress = this.readProgress();
      progress[this.selected.id] = { ...(progress[this.selected.id] || {}), [kind]: true };
      try { localStorage.setItem('expr_v3_reading_progress', JSON.stringify(progress)); } catch (_) {}
    }
    toggleCustomForm(show) {
      if (!this.customForm) return;
      this.customForm.hidden = !show;
      if (show) { this.customStatus.textContent = '建议 50—150 字；保存后会自动为汉字加上拼音。'; this.customText.focus(); }
    }
    saveCustomArticle() {
      const text = this.customText?.value.trim() || '';
      if (text.length < 10) { this.customStatus.textContent = '再多写一点，至少输入 10 个字。'; this.customText.focus(); return; }
      const title = this.customTitle?.value.trim() || `我的素材 ${this.articles.filter(item => item.custom).length + 1}`;
      const article = { id: `custom-${Date.now()}`, title, category: '我的素材', color: 'custom', summary: text.slice(0, 34) + (text.length > 34 ? '…' : ''), text, pinyinText: pinyinText(text), emotionWords: [], reciteGrips: ['人物', '发生的事情', '最后的结果'], recitePrompt: '你觉得故事里的人当时是什么感觉？', custom: true };
      this.articles = [article, ...this.articles.filter(item => item.id !== article.id)];
      try {
        const custom = this.articles.filter(item => item.custom).slice(0, 20);
        localStorage.setItem('expr_v3_reading_materials', JSON.stringify(custom));
      } catch (_) {}
      this.customText.value = ''; this.customTitle.value = ''; this.toggleCustomForm(false);
      this.renderLibrary();
      this.select(article.id);
      this.setStatus('你的素材已显示在朗读页面，可以开始练习。', 'idle', '麦克风未开启');
    }
    renderLibrary() {
      const progress = this.readProgress();
      this.library.innerHTML = this.articles.map((article, index) => {
        const complete = Boolean(progress[article.id]?.read || progress[article.id]?.recited);
        return `<article class="reading-card reading-card-${article.color} ${complete ? 'is-read' : 'is-unread'}" data-reading-card="${article.id}">
          <button class="reading-card-open" type="button" data-reading-id="${article.id}">
            <span class="reading-card-index">${String(index + 1).padStart(2, '0')}</span>
            <span class="reading-card-copy"><b>${escapeHtml(article.title)}</b><small>${escapeHtml(article.category)} · 约 ${tokenize(article.text).filter(token => !token.punctuation).length} 字</small><em>${escapeHtml(article.summary)}</em></span>
            <span class="reading-card-arrow">→</span>
          </button>
          ${article.custom ? `<button class="reading-card-delete" type="button" data-delete-reading-id="${article.id}" aria-label="删除 ${escapeHtml(article.title)}">× 删除</button>` : ''}
        </article>`;
      }).join('');
      this.library.querySelectorAll('[data-reading-id]').forEach(button => button.addEventListener('click', () => this.select(button.dataset.readingId)));
      this.library.querySelectorAll('[data-delete-reading-id]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); this.deleteCustomArticle(button.dataset.deleteReadingId); }));
    }
    deleteCustomArticle(id) {
      const article = this.articles.find(item => item.id === id && item.custom);
      if (!article) return;
      this.articles = this.articles.filter(item => item.id !== id);
      try {
        localStorage.setItem('expr_v3_reading_materials', JSON.stringify(this.articles.filter(item => item.custom).slice(0, 20)));
        const progress = this.readProgress(); delete progress[id]; localStorage.setItem('expr_v3_reading_progress', JSON.stringify(progress));
      } catch (_) {}
      if (this.selected?.id === id) { this.selected = null; this.showLibrary(); }
      this.renderLibrary();
      if (this.customStatus) this.customStatus.textContent = '已删除这条自定义素材。';
    }
    open() {
      document.getElementById('kids-home')?.classList.add('is-reading');
      document.querySelector('.main-area')?.classList.add('reading-mode');
      window.kidsShellSetTopBack?.(true);
      this.hub.hidden = false; this.hub.classList.add('is-visible'); this.showLibrary(); this.hub.scrollTop = 0;
    }
    close() {
      this.stopRecognition(); this.running = false;
      this.reciting = false; this.phase = 'library';
      window.kidsShellSharedExpressionEnd?.();
      this.hub.classList.remove('recite-main-only');
      this.setMicState('idle', '麦克风未开启');
      document.getElementById('kids-home')?.classList.remove('is-reading');
      document.querySelector('.main-area')?.classList.remove('reading-mode');
      this.hub.classList.remove('is-visible'); this.hub.hidden = true;
      window.kidsShellSetTopBack?.(false);
    }
    showLibrary() {
      this.stopRecognition(); this.running = false; this.player.hidden = true; this.library.hidden = false;
      this.renderLibrary();
      this.toggleCustomForm(false);
      this.phase = 'library'; this.reciting = false; this.recite.hidden = true;
      this.hub.classList.remove('recite-main-only');
      window.kidsShellSharedExpressionEnd?.();
      this.confirm.hidden = true; this.results.hidden = true;
      this.resetSaveState();
      this.text.hidden = false; this.fill.closest('.reading-meter')?.removeAttribute('hidden'); this.skipButton.closest('.reading-skip-row')?.removeAttribute('hidden');
      this.startButton.hidden = false; this.pauseButton.hidden = true; this.stopButton.hidden = true;
      this.setStatus('选一篇你喜欢的，准备好就开始。', 'idle', '麦克风未开启');
    }
    select(id) {
      this.selected = this.articles.find(article => article.id === id) || this.articles[0];
      this.tokens = tokenize(this.selected.text); this.wordTokens = this.tokens.filter(token => !token.punctuation);
      this.cursor = 0; this.confirmedCursor = 0; this.running = false; this.paused = false;
      this.phase = 'reading'; this.reciting = false; this.reciteText = ''; this.reciteFinalText = ''; this.reciteVersions = []; this.activeReciteVersion = 0;
      this.category.textContent = this.selected.category; this.title.textContent = this.selected.title;
      this.library.hidden = true; this.player.hidden = false; this.startButton.hidden = false; this.startButton.textContent = '开始朗读';
      this.pauseButton.hidden = true; this.stopButton.hidden = true; this.setStatus('点击“开始朗读”，跟着文字读。', 'idle', '麦克风未开启');
      this.confirm.hidden = true; this.recite.hidden = true; this.results.hidden = true; this.text.hidden = false; this.text.classList.remove('is-recite'); this.fill.closest('.reading-meter')?.removeAttribute('hidden'); this.skipButton.closest('.reading-skip-row')?.removeAttribute('hidden');
      this.reciteTranscript.textContent = '点击“开始复述”，说说你记得的内容。'; this.reciteTranscript.classList.remove('has-speech'); this.reciteStart.hidden = false; this.reciteStop.hidden = true;
      this.renderReciteVersions();
      this.resetSaveState();
      this.renderText(); this.renderProgress();
    }
    setReciteGuidance(message, state = 'live') {
      if (!this.reciteGuidance) return;
      const text = this.reciteGuidance.querySelector('span');
      if (text) text.textContent = message;
      this.reciteGuidance.dataset.state = state;
    }
    getReciteGuidance(text = '') {
      const value = String(text || '').trim();
      if (!value) return '先说一说，故事里谁遇到了什么事？';
      if (value.length < 12) return '接着说，后来发生了什么？';
      if (value.length < 28 && !/(后来|然后|最后|结果|于是)/.test(value)) return '再说一句后来发生了什么？';
      const emotionWords = this.selected?.emotionWords || [];
      const hasEmotion = emotionWords.some(word => value.includes(word)) || /(觉得|感觉|心里|开心|难过|害怕|紧张|安心|失望|惊喜|自豪|生气|担心|想念|勇敢)/.test(value);
      if (!hasEmotion && value.length >= 28) return this.selected?.recitePrompt || '你觉得故事里的人当时是什么感觉？';
      if (value.length < 52) return '补充一个具体画面或动作，让别人更容易想象。';
      return '你已经说清楚了，要不要再补一个你记得最深的地方？';
    }
    renderText() {
      let wordIndex = 0;
      const lines = [];
      let current = [];
      let pendingParagraphBreaks = 0;
      const flush = () => {
        if (!current.length) return;
        lines.push(`<div class="reading-sentence">${current.join('')}</div>`);
        current = [];
      };
      this.tokens.forEach(token => {
        if (token.lineBreak) { flush(); pendingParagraphBreaks += 1; return; }
        if (pendingParagraphBreaks && lines.length) {
          for (let index = 0; index < pendingParagraphBreaks; index += 1) lines.push('<div class="reading-paragraph-break" aria-hidden="true"></div>');
        }
        pendingParagraphBreaks = 0;
        if (token.whitespace) { current.push(escapeHtml(token.value)); return; }
        if (token.punctuation) {
          current.push(`<span class="reading-punctuation">${escapeHtml(token.value)}</span>`);
          if (/[。！？!?]/.test(token.value)) flush();
          return;
        }
        const pinyin = getPinyin(token.value);
        const display = pinyin
          ? `<ruby>${escapeHtml(token.value)}<rt>${escapeHtml(pinyin)}</rt></ruby>`
          : escapeHtml(token.value);
        current.push(`<span class="reading-word" data-word-index="${wordIndex}">${display}</span>`);
        wordIndex += 1;
      });
      flush();
      this.text.innerHTML = lines.join('');
    }
    renderProgress() {
      const total = this.wordTokens.length; const percent = total ? Math.round((this.cursor / total) * 100) : 0;
      this.fill.style.width = `${percent}%`; this.meta.textContent = `${this.cursor} / ${total} 字`;
      this.text.querySelectorAll('.reading-word').forEach(node => {
        const index = Number(node.dataset.wordIndex);
        node.classList.toggle('is-read', index < this.cursor); node.classList.toggle('is-current', index === this.cursor && this.running);
      });
      if (this.cursor >= total && total && this.confirmedCursor >= total) this.complete();
    }
    start() {
      if (!this.selected) return;
      if (this.cursor >= this.wordTokens.length) this.cursor = 0;
      this.confirmedCursor = this.cursor;
      this.running = true; this.paused = false; this.startButton.hidden = true; this.pauseButton.hidden = false; this.stopButton.hidden = false;
      this.setStatus('正在等待你开口，读过的字会变成黑色。', 'requesting', '正在开启麦克风…'); this.startRecognition(); this.renderProgress();
    }
    pause() {
      this.paused = !this.paused;
      if (this.paused) { this.stopRecognition(); this.pauseButton.textContent = '继续朗读'; this.setStatus('已暂停，准备好后继续。', 'paused', '麦克风已暂停'); }
      else { this.pauseButton.textContent = '暂停'; this.setStatus('继续朗读，读过的字会变成黑色。', 'requesting', '正在重新开启麦克风…'); this.startRecognition(); }
      this.renderProgress();
    }
    finish() {
      const done = this.cursor >= this.wordTokens.length;
      this.stopRecognition(); this.running = false; this.paused = false; this.startButton.hidden = false; this.startButton.textContent = done ? '再读一遍' : '继续朗读';
      this.pauseButton.hidden = true; this.stopButton.hidden = true;
      this.markArticleProgress('read'); this.renderLibrary();
      // “完成朗读”是明确的阶段切换，即使孩子跳过了部分内容，也直接进入复述。
      this.showRecite();
      this.renderProgress();
    }
    skipSentence() {
      if (!this.selected || !this.wordTokens.length) return;
      let seen = 0; let target = this.cursor;
      for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex += 1) {
        const token = this.tokens[tokenIndex];
        if (token.punctuation) continue;
        if (seen >= this.cursor) {
          const punctuation = this.tokens.slice(tokenIndex + 1).findIndex(item => item.punctuation && /[。！？!?]/.test(item.value));
          target = punctuation >= 0 ? this.tokens.slice(0, tokenIndex + 1 + punctuation + 1).filter(item => !item.punctuation).length : this.wordTokens.length;
          break;
        }
        seen += 1;
      }
      this.cursor = Math.max(this.cursor + 1, target); this.confirmedCursor = this.cursor; this.setStatus(this.cursor >= this.wordTokens.length ? '已跳到文章末尾，可以完成朗读。' : '已跳过这一段，继续读下一段。', this.running ? 'listening' : 'idle', this.running ? '麦克风已开启，正在听你朗读' : '麦克风未开启'); this.renderProgress();
    }
    startRecognition() {
      if (voiceNeedsHttps()) { this.setStatus('语音识别需要安全连接，请用 HTTPS 打开页面；本机预览可直接使用。', 'error', '请使用 HTTPS 开启麦克风'); return; }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition || !this.running || this.paused) { if (!SpeechRecognition) this.setStatus('当前浏览器不支持语音识别，可直接点击文字标记进度。', 'unsupported', '浏览器不支持语音识别'); return; }
      this.stopRecognition(); this.recognition = new SpeechRecognition(); this.recognition.lang = 'zh-CN'; this.recognition.continuous = true; this.recognition.interimResults = true;
      this.recognition.onstart = () => this.setMicState('listening', '麦克风已开启，正在听你朗读');
      this.recognition.onresult = event => {
        let finalTranscript = ''; let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += transcript; else interimTranscript += transcript;
        }
        if (finalTranscript) this.consumeSpeech(finalTranscript);
        if (interimTranscript) this.previewSpeech(interimTranscript);
      };
      this.recognition.onerror = event => {
        if (event.error === 'no-speech') { this.setMicState('listening', '麦克风已开启，等你开口'); return; }
        if (event.error === 'aborted') return;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') this.setStatus('麦克风没有权限，请在浏览器地址栏允许麦克风后重试。', 'error', '麦克风未授权');
        else this.setStatus('没有听清，可以继续朗读或直接点字跳过。', 'error', '识别遇到问题');
      };
      this.recognition.onend = () => { if (this.running && !this.paused && this.cursor < this.wordTokens.length) { this.setMicState('requesting', '正在重新连接麦克风…'); try { this.recognition.start(); } catch (_) {} } };
      try { this.setMicState('requesting', '正在开启麦克风…'); this.recognition.start(); } catch (_) { this.setStatus('麦克风暂未开启，可直接点字标记进度。', 'error', '麦克风未开启'); }
    }
    consumeSpeech(transcript) {
      this.confirmedCursor = this.matchSpeech(transcript, this.confirmedCursor);
      this.cursor = this.confirmedCursor;
      this.setStatus(`已听到：“${String(transcript).slice(-18)}”`, 'listening', '麦克风已开启，正在听你朗读');
      this.renderProgress();
    }
    previewSpeech(transcript) {
      const previewCursor = this.matchSpeech(transcript, this.confirmedCursor);
      this.cursor = Math.max(this.confirmedCursor, previewCursor);
      this.setStatus(`正在识别：“${String(transcript).slice(-18)}”`, 'listening', '麦克风已开启，正在听你朗读');
      this.renderProgress();
    }
    matchSpeech(transcript, start) {
      let nextCursor = start;
      for (const character of [...normalizeSpeech(transcript)]) {
        const remaining = this.wordTokens.slice(nextCursor, nextCursor + 4);
        const found = remaining.findIndex(token => normalizeSpeech(token.value).startsWith(character));
        if (found >= 0) nextCursor += found + 1;
        if (nextCursor >= this.wordTokens.length) break;
      }
      return nextCursor;
    }
    stopRecognition() {
      if (!this.recognition) return;
      const recognition = this.recognition; this.recognition = null; recognition.onend = null;
      try { recognition.stop(); } catch (_) {}
    }
    showRecite() {
      const anchorTop = this.text.getBoundingClientRect().top;
      const previousScroll = this.hub.scrollTop;
      document.activeElement?.blur?.();
      this.phase = 'confirm'; this.reciting = false; this.stopRecognition();
      this.text.hidden = true; this.fill.closest('.reading-meter')?.setAttribute('hidden', ''); this.skipButton.closest('.reading-skip-row')?.setAttribute('hidden', '');
      this.startButton.hidden = true; this.pauseButton.hidden = true; this.stopButton.hidden = true; this.recite.hidden = true; this.results.hidden = true; this.confirm.hidden = false;
      this.setStatus('朗读完成，请确认是否开始复述。', 'complete', '朗读已完成');
      this.keepReadingPosition(anchorTop, previousScroll, this.confirm);
    }
    startConfirmedRecite() {
      const previousScroll = this.hub.scrollTop;
      document.activeElement?.blur?.();
      this.phase = 'recite'; this.confirm.hidden = true; this.recite.hidden = true; this.text.hidden = true; this.text.classList.add('is-recite');
      this.hub.classList.add('recite-main-only');
      this.reciteStart.hidden = false; this.reciteStop.hidden = true; this.reciteText = ''; this.reciteFinalText = '';
      this.reciteTranscript.textContent = '复述时，这里会显示你的识别文字。'; this.reciteTranscript.classList.remove('has-speech');
      this.setReciteGuidance('先说一说，故事里谁遇到了什么事？');
      if (this.reciteFeedback) this.reciteFeedback.textContent = '可以先说发生了什么，再说你的感受。';
      this.setStatus('原文已隐藏，现在请用自己的话复述。', 'idle', '麦克风未开启');
      this.hub.scrollTop = previousScroll;
      // 确认后直接进入主表达器，避免把孩子留在一个没有按钮的空白页。
      this.startRecite();
    }
    keepReadingPosition(anchorTop, previousScroll, replacement) {
      const raf = window.requestAnimationFrame || (callback => setTimeout(callback, 0));
      const restore = () => {
        const replacementTop = replacement.getBoundingClientRect().top;
        this.hub.scrollTop = Math.max(0, previousScroll + replacementTop - anchorTop);
      };
      raf(restore);
      // Browsers may apply focus/scroll anchoring once more after a hidden
      // button is removed, so restore the same visual anchor after that pass.
      setTimeout(restore, 40);
    }
    reread() {
      window.kidsShellSharedExpressionEnd?.(); this.hub.classList.remove('recite-main-only');
      this.confirm.hidden = true; this.results.hidden = true; this.recite.hidden = true; this.text.hidden = false; this.text.classList.remove('is-recite');
      this.fill.closest('.reading-meter')?.removeAttribute('hidden'); this.skipButton.closest('.reading-skip-row')?.removeAttribute('hidden');
      this.resetSaveState();
      this.cursor = 0; this.confirmedCursor = 0; this.reciteVersions = []; this.activeReciteVersion = 0; this.renderReciteVersions(); this.startButton.hidden = false; this.startButton.textContent = '开始朗读'; this.setStatus('可以再读一遍。', 'idle', '麦克风未开启'); this.renderText(); this.renderProgress();
    }
    renderReciteVersions() {
      if (!this.versionTabs) return;
      this.versionTabs.innerHTML = this.reciteVersions.map((_, index) => `<button type="button" class="recite-version-tab ${index === this.activeReciteVersion ? 'is-active' : ''}" role="tab" aria-selected="${index === this.activeReciteVersion}" data-recite-version="${index}">第 ${index + 1} 遍</button>`).join('');
      this.versionTabs.querySelectorAll('[data-recite-version]').forEach(button => button.addEventListener('click', () => {
        this.activeReciteVersion = Number(button.dataset.reciteVersion); this.renderReciteResult();
      }));
      if (this.retryReciteButton) {
        this.retryReciteButton.disabled = this.reciteVersions.length >= 3;
        this.retryReciteButton.textContent = this.reciteVersions.length >= 3 ? '已完成三遍' : '重新复述';
      }
    }
    renderReciteResult() {
      const text = this.reciteVersions[this.activeReciteVersion] || this.reciteText || '';
      if (!text || !this.resultsOriginal || !this.resultsRecite) return;
      this.resultsOriginal.textContent = this.selected?.text || '';
      this.resultsRecite.innerHTML = this.highlightMatches(text);
      if (this.resultsReciteGuide) {
        this.resultsReciteGuide.hidden = false;
        if (this.resultsReciteGrips) this.resultsReciteGrips.textContent = (this.selected?.reciteGrips || ['人物', '发生的事情', '最后的结果']).join('　·　');
        if (this.resultsReciteEmotions) this.resultsReciteEmotions.textContent = `这篇故事可以留意：${(this.selected?.emotionWords || ['当时的感受']).join('、')}`;
      }
    }
    retryRecite() {
      if (this.reciteVersions.length >= 3) {
        this.setStatus('最多可以复述三遍，挑一个你最满意的版本保存。', 'complete', '三遍复述已完成');
        return;
      }
      const previousScroll = this.hub.scrollTop;
      this.phase = 'recite'; this.results.hidden = true; this.confirm.hidden = true; this.recite.hidden = true; this.text.hidden = true; this.text.classList.add('is-recite');
      this.hub.classList.add('recite-main-only'); this.reciteStart.hidden = false; this.reciteStop.hidden = true; this.reciteText = ''; this.reciteFinalText = '';
      this.reciteTranscript.textContent = `第 ${this.reciteVersions.length + 1} 遍：点击“开始复述”，说说你记得的内容。`; this.reciteTranscript.classList.remove('has-speech');
      this.setReciteGuidance('先说一说，故事里谁遇到了什么事？');
      if (this.reciteFeedback) this.reciteFeedback.textContent = '可以换一种说法，再补一个具体细节。';
      this.resetSaveState(); this.latestAnalysis = ''; this.savedHistoryId = null; this.setStatus(`准备开始第 ${this.reciteVersions.length + 1} 遍复述。`, 'idle', '麦克风未开启');
      this.hub.scrollTop = previousScroll;
      this.startRecite();
    }
    startRecite() {
      if (voiceNeedsHttps()) { this.setStatus('语音识别需要安全连接，请用 HTTPS 打开页面；本机预览可直接使用。', 'error', '请使用 HTTPS 开启麦克风'); return; }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.reciting = true; this.reciteStart.hidden = true; this.reciteStop.hidden = false; this.reciteText = ''; this.reciteFinalText = '';
      window.kidsShellSharedExpressionStart?.({
        kind: 'recite',
        title: `复述练习 · ${this.selected?.title || '这篇短文'}`,
        prompts: ['先说一说，故事里谁遇到了什么事？'],
        openingHint: '不用背原句，先把记得的第一件事说出来。',
        getPrompt: text => this.getReciteGuidance(text),
        fullPage: true,
        finishLabel: '完成复述',
        onFinish: () => this.finishRecite()
      });
      this.hub.classList.add('recite-main-only');
      this.text.hidden = true; this.text.classList.add('is-recite');
      this.reciteTranscript.textContent = '正在听你复述…'; this.reciteTranscript.classList.add('has-speech');
      if (this.reciteFeedback) this.reciteFeedback.textContent = '我在听，你可以继续把事情说完整。';
      if (!SpeechRecognition) { this.setStatus('当前浏览器不支持语音识别，可以直接口述练习。', 'unsupported', '浏览器不支持语音识别'); return; }
      this.stopRecognition(); this.recognition = new SpeechRecognition(); this.recognition.lang = 'zh-CN'; this.recognition.continuous = true; this.recognition.interimResults = true;
      this.recognition.onstart = () => this.setMicState('listening', '麦克风已开启，正在听你复述');
      this.recognition.onresult = event => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            this.reciteFinalText += transcript;
            window.kidsShellSharedExpressionSpeech?.(transcript, true);
          } else interim += transcript;
        }
        const text = `${this.reciteFinalText}${interim}`;
        if (text) { this.reciteText = text; this.reciteTranscript.textContent = text; this.setReciteGuidance(this.getReciteGuidance(text)); window.kidsShellSharedExpressionPrompt?.(this.getReciteGuidance(text)); }
        if (interim) window.kidsShellSharedExpressionSpeech?.(interim, false);
        if (this.reciteFeedback) this.reciteFeedback.textContent = text.length > 18 ? '说得很顺，继续把结尾说完。' : '很好，继续说说发生了什么。';
        this.setStatus('正在听你的复述…', 'listening', '麦克风已开启，正在听你复述');
      };
      this.recognition.onerror = event => { if (event.error === 'not-allowed' || event.error === 'service-not-allowed') this.setStatus('麦克风没有权限，请在浏览器地址栏允许麦克风后重试。', 'error', '麦克风未授权'); };
      this.recognition.onend = () => { if (this.reciting) try { this.recognition.start(); } catch (_) {} };
      try { this.setMicState('requesting', '正在开启麦克风…'); this.recognition.start(); } catch (_) { this.setStatus('麦克风暂未开启，请重试。', 'error', '麦克风未开启'); }
    }
    finishRecite() {
      this.reciting = false; this.stopRecognition(); this.reciteStart.hidden = false; this.reciteStop.hidden = true;
      const text = this.reciteText.trim();
      if (!text) {
        this.setStatus('还没有听到内容，可以再试一次。', 'idle', '麦克风未开启');
        return;
      }
      this.reciteText = text;
      if (this.reciteVersions.length < 3) this.reciteVersions.push(text);
      this.activeReciteVersion = this.reciteVersions.length - 1;
      this.markArticleProgress('recited'); this.renderLibrary();
      this.phase = 'results'; this.recite.hidden = true; this.text.hidden = true; this.results.hidden = false;
      this.hub.classList.remove('recite-main-only');
      this.renderReciteVersions(); this.renderReciteResult();
      this.setReciteGuidance('复述完成，可以回看刚才说到的关键内容。', 'complete');
      this.setStatus('复述完成，可以看看 AI 小教练的反馈。', 'complete', '复述已完成');
      window.kidsShellSharedExpressionFinish?.('复述完成！左边是你的表达小雷达，右边是下一步提示。');
      window.kidsShellSharedExpressionEnd?.();
      this.evaluateRecite(text);
    }
    resetSaveState() {
      if (this.celebrationTimer) { clearTimeout(this.celebrationTimer); this.celebrationTimer = null; }
      if (this.saveButton) { this.saveButton.disabled = false; this.saveButton.textContent = '保存这次练习'; }
      if (this.saveState) this.saveState.textContent = '';
      if (this.celebration) this.celebration.hidden = true;
    }
    saveHistory() {
      const selectedRecite = (this.reciteVersions[this.activeReciteVersion] || this.reciteText || '').trim();
      if (!this.selected || !selectedRecite || this.saveButton?.disabled) return;
      const storageKey = 'expr_v3_reading_history';
      const originalCharacters = new Set([...normalizeSpeech(this.selected.text)]);
      const matchedCount = [...normalizeSpeech(selectedRecite)].filter(character => originalCharacters.has(character)).length;
      const entry = {
        id: `reading-${Date.now()}`,
        articleId: this.selected.id,
        title: this.selected.title,
        original: this.selected.text,
        recite: selectedRecite,
        matchedCount,
        analysis: this.latestAnalysis || '',
        createdAt: new Date().toISOString()
      };
      try {
        const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const next = Array.isArray(history) ? [entry, ...history].slice(0, 50) : [entry];
        localStorage.setItem(storageKey, JSON.stringify(next));
        this.savedHistoryId = entry.id;
      } catch (_) {
        if (this.saveState) this.saveState.textContent = '本机记录暂时不可用';
        return;
      }
      this.saveButton.disabled = true; this.saveButton.textContent = '✓ 已保存';
      if (this.saveState) this.saveState.textContent = '已保存到成长档案';
      if (this.celebration) { this.celebration.hidden = false; this.celebration.classList.remove('celebration-replay'); void this.celebration.offsetWidth; this.celebration.classList.add('celebration-replay'); }
      this.setStatus('保存成功！这次练习完成得真棒。', 'complete', '已保存到成长档案');
      this.celebrationTimer = setTimeout(() => {
        if (this.celebration) this.celebration.hidden = true;
        if (this.saveState) this.saveState.textContent = '';
      }, 2400);
    }
    highlightMatches(text) {
      const originalCharacters = new Set([...normalizeSpeech(this.selected?.text || '')]);
      return [...text].map(character => {
        const normalized = normalizeSpeech(character);
        if (!normalized) return escapeHtml(character);
        const highlighted = originalCharacters.has(normalized);
        return highlighted ? `<span class="recite-match" title="原文出现过的字">${escapeHtml(character)}</span>` : escapeHtml(character);
      }).join('');
    }
    evaluateRecite(text) {
      const originalCharacters = new Set([...normalizeSpeech(this.selected?.text || '')]);
      const spokenCharacters = [...normalizeSpeech(text)];
      const matched = spokenCharacters.filter(character => originalCharacters.has(character)).length;
      const encouragement = spokenCharacters.length >= 18
        ? '你做得真好！你已经用自己的话把内容讲出来了。'
        : '你完成了一次复述！再补充一个细节，表达会更完整。';
      const localFeedback = `${encouragement} 我听到你提到了 ${matched} 个原文关键词，紫色标记就是它们。`;
      this.latestAnalysis = localFeedback;
      if (this.resultsFeedback) this.resultsFeedback.textContent = localFeedback;
      const controller = window.accessController;
      if (!controller?.canAnalyze?.()) return;
      controller.callAI([
        { role: 'system', content: '你是7到12岁儿童的中文口语教练。只用中文回复2到3句：先鼓励孩子，再给一个很具体的复述建议。语气温暖、短句、孩子能听懂。' },
        { role: 'user', content: `原文：${this.selected.text}\n孩子的复述：${text}` }
      ], 220).then(feedback => {
        if (feedback) {
          this.latestAnalysis = feedback;
          if (this.phase === 'results' && this.resultsFeedback) this.resultsFeedback.textContent = feedback;
          this.updateSavedAnalysis(feedback);
        }
      }).catch(() => {});
    }
    updateSavedAnalysis(analysis) {
      if (!this.savedHistoryId || !analysis) return;
      try {
        const storageKey = 'expr_v3_reading_history';
        const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (!Array.isArray(history)) return;
        const entry = history.find(item => item?.id === this.savedHistoryId);
        if (entry) { entry.analysis = analysis; localStorage.setItem(storageKey, JSON.stringify(history)); }
      } catch (_) {}
    }
    complete() {
      if (!this.running || this.cursor < this.wordTokens.length) return;
      this.stopRecognition(); this.running = false; this.markArticleProgress('read'); this.renderLibrary(); this.startButton.hidden = false; this.startButton.textContent = '再读一遍'; this.pauseButton.hidden = true; this.stopButton.hidden = true; this.showRecite();
    }
  }

  class AdventurePractice {
    constructor() {
      this.hub = document.querySelector('[data-kids-panel="adventure"]');
      if (!this.hub) return;
      this.home = document.getElementById('kids-home');
      this.islands = document.getElementById('adventure-islands');
      this.themes = document.getElementById('adventure-themes');
      this.themeTitle = document.getElementById('adventure-island-title');
      this.themeList = document.getElementById('adventure-theme-list');
      this.stage = document.getElementById('adventure-stage');
      this.stageBadge = document.getElementById('adventure-stage-badge');
      this.stageTitle = document.getElementById('adventure-stage-title');
      this.stagePrompt = document.getElementById('adventure-stage-prompt');
      this.emotionStage = document.getElementById('adventure-emotion-stage');
      this.emotionSlots = document.getElementById('adventure-emotion-slots');
      this.emotionInput = document.getElementById('adventure-emotion-input');
      this.emotionHints = document.getElementById('adventure-emotion-hints');
      this.storyStage = document.getElementById('adventure-story-stage');
      this.storyInput = document.getElementById('adventure-story-input');
      this.pickedWords = document.getElementById('adventure-picked-word-text');
      this.storyFeedback = document.getElementById('adventure-story-feedback');
      this.resultStage = document.getElementById('adventure-result-stage');
      this.stars = document.getElementById('adventure-stars');
      this.resultFeedback = document.getElementById('adventure-result-feedback');
      this.resultDialog = document.getElementById('adventure-result-dialog');
      this.resultDialogStory = document.getElementById('adventure-result-dialog-story');
      this.resultDialogStars = document.getElementById('adventure-result-dialog-stars');
      this.resultDialogFeedback = document.getElementById('adventure-result-dialog-feedback');
      this.emotionMic = document.getElementById('adventure-emotion-mic');
      this.storyMic = document.getElementById('adventure-story-mic');
      this.selectedIsland = null; this.selectedTopic = null; this.emotionWords = [];
      this.recognition = null; this.voiceKind = ''; this.voiceBase = ''; this.voiceSessionText = ''; this.voiceWanted = false; this.voiceRestartTimer = null;
      this.bind(); this.renderIslands();
    }
    bind() {
      this.hub.querySelector('#adventure-back-islands')?.addEventListener('click', () => this.showIslands());
      this.hub.querySelector('#adventure-change-theme')?.addEventListener('click', () => this.showThemes());
      this.hub.querySelector('#adventure-emotion-submit')?.addEventListener('click', () => this.submitEmotion());
      this.hub.querySelector('#adventure-emotion-mic')?.addEventListener('click', () => this.toggleVoice('emotion'));
      this.hub.querySelector('#adventure-story-mic')?.addEventListener('click', () => this.toggleVoice('story'));
      this.hub.querySelector('#adventure-story-submit')?.addEventListener('click', () => this.finishStory());
      this.hub.querySelector('#adventure-next')?.addEventListener('click', () => this.showThemes());
      document.getElementById('adventure-result-dialog-close')?.addEventListener('click', () => this.closeResultDialog());
      document.getElementById('adventure-result-dialog-keep')?.addEventListener('click', () => this.closeResultDialog());
      document.getElementById('adventure-result-dialog-next')?.addEventListener('click', () => { this.closeResultDialog(); this.showThemes(); });
      this.hub.querySelectorAll('[data-quest-word]').forEach(button => button.addEventListener('click', () => this.addEmotion(button.dataset.questWord)));
      this.emotionInput?.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); this.submitEmotion(); } });
      this.storyInput?.addEventListener('input', () => this.clearStoryAttention());
    }
    open() {
      if (!this.hub) return;
      this.showIslands();
    }
    renderIslands() {
      if (!this.islands) return;
      this.islands.innerHTML = ADVENTURE_ISLANDS.map(island => `<button type="button" class="adventure-island adventure-island-${island.color}" data-adventure-island="${island.id}"><span class="adventure-island-icon">${island.icon}</span><b>${island.name}岛</b><small>${island.topics.length} 个主题</small><i>→</i></button>`).join('');
      this.islands.querySelectorAll('[data-adventure-island]').forEach(button => button.addEventListener('click', () => this.selectIsland(button.dataset.adventureIsland)));
    }
    showIslands() {
      this.closeResultDialog();
      this.stopVoice();
      window.kidsShellSharedExpressionEnd?.();
      this.home?.classList.remove('is-launching');
      this.selectedIsland = null; this.selectedTopic = null; this.emotionWords = [];
      this.islands.hidden = false; this.themes.hidden = true; this.stage.hidden = true;
      this.hub.querySelectorAll('[data-adventure-island]').forEach(button => button.classList.remove('is-selected'));
    }
    selectIsland(id) {
      const island = ADVENTURE_ISLANDS.find(item => item.id === id);
      if (!island) return;
      this.selectedIsland = island;
      this.themeTitle.textContent = `${island.name}岛`;
      this.themeList.innerHTML = island.topics.map((topic, index) => `<button type="button" class="adventure-theme-card" data-adventure-topic="${topic.id}"><span class="adventure-theme-number">${String(index + 1).padStart(2, '0')}</span><span><b>${topic.title}</b><small>${topic.prompt}</small></span><i>→</i></button>`).join('');
      this.themeList.querySelectorAll('[data-adventure-topic]').forEach(button => button.addEventListener('click', () => this.startTheme(button.dataset.adventureTopic)));
      this.islands.hidden = true; this.themes.hidden = false; this.stage.hidden = true;
      this.islands.querySelectorAll('[data-adventure-island]').forEach(button => button.classList.toggle('is-selected', button.dataset.adventureIsland === id));
      this.themes.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    showThemes() {
      this.closeResultDialog();
      this.stopVoice();
      window.kidsShellSharedExpressionEnd?.();
      this.home?.classList.remove('is-launching');
      if (!this.selectedIsland) return this.showIslands();
      this.islands.hidden = true; this.themes.hidden = false; this.stage.hidden = true;
      this.emotionWords = [];
      this.themeList.querySelectorAll('[data-adventure-topic]').forEach(button => button.classList.remove('is-selected'));
    }
    startTheme(topicId) {
      const topic = this.selectedIsland?.topics.find(item => item.id === topicId);
      if (!topic) return;
      this.selectedTopic = topic; this.emotionWords = []; this.closeResultDialog(); this.stopVoice();
      this.emotionInput.value = ''; this.storyInput.value = ''; this.emotionHints.hidden = true;
      this.renderEmotionSlots();
      this.stageBadge.textContent = '第 1 关 · 情绪热身';
      this.stageTitle.textContent = '先说出三个情感类词语';
      this.stagePrompt.textContent = `在“${topic.title}”这件事里，你是什么感觉？请先说出三个情感类词语。`;
      this.emotionStage.hidden = false; this.storyStage.hidden = true; this.resultStage.hidden = true;
      this.islands.hidden = true; this.themes.hidden = true; this.stage.hidden = false;
      this.stage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    parseEmotionWords(text) {
      const known = ['开心', '自豪', '紧张', '委屈', '难过', '害羞', '遗憾', '惊喜', '生气', '期待', '担心', '骄傲', '激动', '失望', '安心', '害怕', '满足', '兴奋'];
      const normalized = String(text || '').replace(/[，、。；;\s]+/g, ',');
      const pieces = normalized.split(',').map(item => item.trim()).filter(Boolean);
      const found = [...pieces, ...known.filter(word => normalized.includes(word))];
      return [...new Set(found.filter(word => word.length <= 8))].slice(0, 3);
    }
    addEmotion(word) {
      const value = String(word || '').trim();
      if (!value || this.emotionWords.includes(value) || this.emotionWords.length >= 3) return;
      this.emotionWords.push(value); this.emotionInput.value = ''; this.renderEmotionSlots();
    }
    renderEmotionSlots() {
      if (!this.emotionSlots) return;
      this.emotionSlots.innerHTML = [0, 1, 2].map(index => this.emotionWords[index] ? `<span class="is-filled"><b>${index + 1}</b>${escapeHtml(this.emotionWords[index])}</span>` : `<span><b>${index + 1}</b>词语 ${index + 1}</span>`).join('');
    }
    submitEmotion() {
      this.parseEmotionWords(this.emotionInput?.value).forEach(word => this.addEmotion(word));
      if (this.emotionWords.length < 3) {
        const missing = 3 - this.emotionWords.length;
        this.emotionHints.hidden = false;
        this.stagePrompt.textContent = `还差 ${missing} 个。想一想：当时是开心、自豪，还是有一点紧张或委屈？`;
        return;
      }
      this.emotionHints.hidden = true; this.emotionStage.hidden = true; this.storyStage.hidden = false;
      this.stageBadge.textContent = '第 2 关 · 小事表达';
      this.stageTitle.textContent = '现在，用刚刚的词说一件小事';
      this.stagePrompt.textContent = `拿“${this.emotionWords.join('、')}”来描述最近发生的一件事，一句话、两句话、三句话都可以。`;
      this.pickedWords.textContent = this.emotionWords.join(' · ');
      this.storyFeedback.textContent = '非常好！三个情绪词都找到了。现在说最近的一件小事。';
      this.storyInput.focus();
    }
    toggleVoice(kind) {
      if (this.recognition || this.voiceWanted) {
        const wasStory = this.voiceKind === 'story';
        this.stopVoice();
        if (wasStory) {
          window.kidsShellSharedExpressionEnd?.();
          this.stage.hidden = false;
          this.home?.classList.remove('is-launching');
        }
        return;
      }
      if (explainVoiceAccess((message, urgent) => this.setStoryAttention(message, urgent))) return;
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Recognition) {
        this.setStoryAttention('当前浏览器暂不支持语音输入，也可以直接输入文字。', false);
        return;
      }
      this.voiceWanted = true; this.voiceKind = kind; this.voiceBase = kind === 'story' ? this.storyInput.value.trim() : ''; this.voiceSessionText = '';
      if (kind === 'story') {
        window.kidsShellSharedExpressionStart?.({
          kind: 'adventure',
          title: `闯关故事 · ${this.selectedTopic?.title || '一件小事'}`,
          prompts: ['先说发生了什么', `用刚才的情绪词：${this.emotionWords.join('、')}`, '补一句后来结果怎样'],
          openingHint: '可以说一句、两句或三句，先从第一句开始。',
          fullPage: true,
          finishLabel: '完成这一关',
          onFinish: () => this.finishStory()
        });
        // 语音开始后只保留主表达器，避免闯关页的输入框和中央字幕重复显示。
        this.stage.hidden = true;
        this.home?.classList.add('is-launching');
      }
      this.createRecognition(Recognition, kind);
    }
    createRecognition(Recognition, kind) {
      const recognition = new Recognition();
      this.recognition = recognition;
      recognition.lang = 'zh-CN'; recognition.continuous = kind === 'story'; recognition.interimResults = true;
      recognition.onstart = () => { const button = kind === 'emotion' ? this.emotionMic : this.storyMic; if (button) button.textContent = '⏹ 停止听'; this.storyFeedback.textContent = kind === 'emotion' ? '我在听，你可以连续说三个感觉。' : '我在听，你可以自然停顿；说完请点击“完成这一关”。'; };
      recognition.onresult = event => {
        let finalText = ''; let interimText = '';
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const text = event.results[index][0].transcript;
          if (event.results[index].isFinal) finalText += text; else interimText += text;
        }
        this.voiceSessionText = `${this.voiceSessionText}${finalText}`;
        if (kind === 'emotion') {
          this.emotionInput.value = `${this.voiceSessionText}${interimText}`.trim();
          this.parseEmotionWords(finalText).forEach(word => this.addEmotion(word));
        } else {
          const prefix = this.voiceBase ? `${this.voiceBase} ` : '';
          this.storyInput.value = `${prefix}${this.voiceSessionText}${interimText}`.trim();
        }
        if (kind === 'story') {
          if (finalText) window.kidsShellSharedExpressionSpeech?.(finalText, true);
          if (interimText) window.kidsShellSharedExpressionSpeech?.(interimText, false);
        }
      };
      recognition.onerror = event => {
        if (event.error === 'no-speech' && kind === 'story' && this.voiceWanted) {
          this.setStoryAttention('暂时没有听到声音，可以继续说；说完再点击“完成这一关”。', false);
          return;
        }
        this.voiceWanted = false;
        this.setStoryAttention('没有听清，再试一次，或者直接输入文字。', true);
      };
      recognition.onend = () => {
        this.recognition = null;
        if (this.voiceWanted && kind === 'story') {
          this.setStoryAttention('麦克风短暂停顿了，但练习还没有结束，可以继续说。', false);
          clearTimeout(this.voiceRestartTimer);
          this.voiceRestartTimer = setTimeout(() => { if (this.voiceWanted) this.createRecognition(Recognition, kind); }, 280);
          return;
        }
        this.voiceWanted = false; this.resetVoiceButton();
      };
      try { recognition.start(); } catch (_) { this.voiceWanted = false; this.resetVoiceButton(); }
    }
    resetVoiceButton() {
      if (this.emotionMic) this.emotionMic.textContent = '🎤 开始说词语';
      if (this.storyMic) this.storyMic.textContent = '🎤 开始说故事';
      this.recognition = null; this.voiceKind = '';
    }
    setStoryAttention(message, attention = true) {
      if (!this.storyFeedback) return;
      this.storyFeedback.textContent = message;
      this.storyFeedback.classList.toggle('is-attention', attention);
    }
    clearStoryAttention() { this.storyFeedback?.classList.remove('is-attention'); }
    closeResultDialog() { if (this.resultDialog?.open) this.resultDialog.close(); }
    openResultDialog(stars, story, feedback) {
      if (!this.resultDialog) return;
      this.resultDialogStory.textContent = story;
      this.resultDialogStars.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
      this.resultDialogFeedback.textContent = feedback;
      if (!this.resultDialog.open) this.resultDialog.showModal();
    }
    stopVoice() {
      this.voiceWanted = false; clearTimeout(this.voiceRestartTimer);
      if (this.recognition) { try { this.recognition.stop(); } catch (_) {} this.recognition = null; }
      this.resetVoiceButton();
    }
    finishStory() {
      const text = this.storyInput?.value.trim() || '';
      if (text.length < 8) { this.setStoryAttention('还没说完，再补一小句：发生了什么，或者你有什么感受？'); this.storyInput.focus(); return; }
      this.stopVoice();
      const matchedEmotion = this.emotionWords.some(word => text.includes(word));
      const starCount = text.length >= 32 && matchedEmotion ? 3 : (text.length >= 16 || matchedEmotion ? 2 : 1);
      this.stageBadge.textContent = '第 3 步 · 通关结算'; this.emotionStage.hidden = true; this.storyStage.hidden = false; this.resultStage.hidden = true;
      this.stage.hidden = false;
      this.home?.classList.remove('is-launching');
      this.stars.textContent = '★'.repeat(starCount) + '☆'.repeat(3 - starCount);
      const feedback = `你完成了！你把“${this.selectedTopic.title}”这件事和${this.emotionWords.join('、')}的感受说出来了。${starCount === 3 ? '细节很完整，拿到三星！' : '再加一点细节，下一次就能拿更高星。'}`;
      this.resultFeedback.textContent = feedback;
      this.saveProgress({ stars: starCount, story: text, emotions: [...this.emotionWords] });
      window.kidsShellSharedExpressionFinish?.('故事完成！看看左边的表达小雷达，再选右边的一条提示练习。');
      window.kidsShellSharedExpressionEnd?.();
      this.openResultDialog(starCount, text, feedback);
    }
    saveProgress(result) {
      try {
        const history = JSON.parse(localStorage.getItem('expr_v3_adventure_progress') || '[]');
        const entry = { id: `quest-${Date.now()}`, island: this.selectedIsland?.name || '', topic: this.selectedTopic?.title || '', emotions: [...this.emotionWords], ...result, createdAt: new Date().toISOString() };
        localStorage.setItem('expr_v3_adventure_progress', JSON.stringify([entry, ...(Array.isArray(history) ? history : [])].slice(0, 50)));
      } catch (_) {}
    }
  }

  class KidsInfoPanel {
    constructor() {
      this.dialog = document.getElementById('kids-info-dialog');
      this.body = document.getElementById('kids-info-body');
      this.title = document.getElementById('kids-info-title');
      this.kicker = document.getElementById('kids-info-kicker');
      this.chatMessages = [];
      this.chatBusy = false;
      if (!this.dialog || !this.body) return;
      document.getElementById('kids-info-close')?.addEventListener('click', () => this.dialog.close());
      this.body.addEventListener('click', event => {
        const button = event.target.closest?.('[data-info-nav]');
        if (button) this.open(button.dataset.infoNav);
        const suggestion = event.target.closest?.('[data-growth-question]');
        if (suggestion) {
          const input = this.body.querySelector('[data-growth-chat-input]');
          if (input) { input.value = suggestion.dataset.growthQuestion || ''; input.focus(); }
        }
        if (event.target.closest?.('[data-growth-chat-settings]')) window.accessController?.open('settings');
      });
      this.body.addEventListener('submit', event => {
        const form = event.target.closest?.('[data-growth-chat-form]');
        if (!form) return;
        event.preventDefault();
        this.askGrowthCoach(form);
      });
    }
    readHistory() {
      try {
        const value = JSON.parse(localStorage.getItem('expr_v3_reading_history') || '[]');
        return Array.isArray(value) ? value : [];
      } catch (_) { return []; }
    }
    readAdventureProgress() {
      try {
        const value = JSON.parse(localStorage.getItem('expr_v3_adventure_progress') || '[]');
        return Array.isArray(value) ? value : [];
      } catch (_) { return []; }
    }
    readExpressionHistory() {
      try {
        const value = JSON.parse(localStorage.getItem('expr_v3_expression_history') || '[]');
        return Array.isArray(value) ? value : [];
      } catch (_) { return []; }
    }
    open(mode = 'history') {
      if (!this.dialog) return;
      const history = this.readHistory();
      const adventure = this.readAdventureProgress();
      const expression = this.readExpressionHistory();
      const labels = { history: ['我的练习', '历史记录'], growth: ['坚持会发光', '成长档案'], parent: ['一起陪伴', '家长中心'] };
      this.kicker.textContent = labels[mode]?.[0] || labels.history[0];
      this.title.textContent = labels[mode]?.[1] || labels.history[1];
      if (mode === 'growth') this.body.innerHTML = this.renderGrowth(history, adventure);
      else if (mode === 'parent') this.body.innerHTML = this.renderParent(history, adventure, expression);
      else this.body.innerHTML = this.renderHistory(history, adventure, expression);
      if (!this.dialog.open) this.dialog.showModal();
    }
    growthContext(history, adventure, expression) {
      const items = [
        ...history.map(item => ({ kind: '朗读复述', title: item.title, text: item.recite, analysis: item.analysis, createdAt: item.createdAt, matchedCount: item.matchedCount })),
        ...adventure.map(item => ({ kind: '闯关冒险', title: `${item.island || '闯关'} · ${item.topic || '表达主题'}`, text: item.story, emotions: item.emotions, stars: item.stars, createdAt: item.createdAt })),
        ...expression.map(item => ({ kind: '自由表达', title: item.title, text: item.text, analysis: item.report, createdAt: item.createdAt, density: item.density }))
      ].sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
      if (!items.length) return '目前还没有完成记录。请根据这一点给出鼓励，并建议孩子先完成一次短练习。';
      return items.map((item, index) => {
        const parts = [
          `${index + 1}. ${item.kind}｜${item.title || '未命名练习'}`,
          item.createdAt ? `时间：${item.createdAt}` : '',
          item.text ? `孩子说：${String(item.text).slice(0, 900)}` : '',
          item.emotions?.length ? `情绪词：${item.emotions.join('、')}` : '',
          Number.isFinite(Number(item.stars)) ? `星级：${item.stars}/3` : '',
          Number.isFinite(Number(item.matchedCount)) ? `原文关键词匹配：${item.matchedCount}` : '',
          Number.isFinite(Number(item.density)) ? `说清楚度：${item.density}%` : '',
          item.analysis ? `已有分析：${String(item.analysis).slice(0, 700)}` : ''
        ];
        return parts.filter(Boolean).join('\n');
      }).join('\n\n').slice(-18000);
    }
    renderGrowthChat(history, adventure, expression) {
      const messages = this.chatMessages.map(item => `<div class="growth-chat-message ${item.role === 'user' ? 'is-user' : 'is-coach'}"><b>${item.role === 'user' ? '你' : 'AI 小教练'}</b><p>${escapeHtml(item.content).replace(/\n/g, '<br>')}</p></div>`).join('');
      const empty = messages ? '' : '<div class="growth-chat-empty">你可以问我：最近进步在哪里？下一次该练什么？哪一次说得最完整？</div>';
      const recordCount = history.length + adventure.length + expression.length;
      return `<section class="growth-chat" aria-label="成长档案 AI 对话">
        <div class="growth-chat-head"><div><span class="section-kicker">一起看见进步</span><h4>问问 AI 小教练</h4><p>我会根据这 ${recordCount} 条练习记录，用孩子听得懂的话回答。</p></div><span class="growth-chat-orb" aria-hidden="true">💬</span></div>
        <div class="growth-chat-suggestions" aria-label="快捷问题"><button type="button" data-growth-question="请总结我最近的表达进步。">最近进步在哪里？</button><button type="button" data-growth-question="下一次练习，我最该先改哪一点？">下一次练什么？</button><button type="button" data-growth-question="哪一次练习说得最完整？为什么？">哪次说得最好？</button></div>
        <div class="growth-chat-messages" aria-live="polite">${empty}${messages}</div>
        <form class="growth-chat-form" data-growth-chat-form><textarea data-growth-chat-input rows="2" maxlength="500" placeholder="例如：帮我总结这周的表达变化"></textarea><div class="growth-chat-actions"><span>只会参考当前浏览器里的练习记录</span><button class="info-primary-button" type="submit" ${this.chatBusy ? 'disabled' : ''}>${this.chatBusy ? '思考中…' : '发送提问'}</button></div></form>
        <span class="growth-chat-settings">🔒 AI 服务由服务器安全提供</span>
      </section>`;
    }
    async askGrowthCoach(form) {
      if (this.chatBusy) return;
      const input = form.querySelector('[data-growth-chat-input]');
      const question = input?.value.trim() || '';
      if (!question) { input?.focus(); return; }
      const history = this.readHistory();
      const adventure = this.readAdventureProgress();
      const expression = this.readExpressionHistory();
      const access = window.accessController;
      if (!access?.canAnalyze?.()) {
        this.chatMessages.push({ role: 'user', content: question }, { role: 'assistant', content: 'AI 小教练暂时还没有连接，请联系管理员开通服务。刚才的问题还在这里。' });
        this.body.innerHTML = this.renderGrowth(history, adventure);
        return;
      }
      this.chatMessages.push({ role: 'user', content: question });
      this.chatBusy = true;
      this.body.innerHTML = this.renderGrowth(history, adventure);
      const system = '你是“表达宇宙·达达口才训练”的儿童表达小教练。服务对象是7到12岁孩子和陪伴孩子的家长。请只根据提供的真实练习记录回答，不要编造。先用一句鼓励开头，再给清楚、短小、可行动的建议。重点关注：事情是否说完整，顺序是否清楚，原因和结果，具体的情绪、动作、时间地点和画面词，是否听见并回应别人。不要排名，不要成人式评价，不要使用“差、问题很严重”等打击性语言。回答使用中文短句，最多5段；如果用户问总结，请按“已经做到、正在练、下一步”回答。';
      const context = this.growthContext(history, adventure, expression);
      const messages = [
        { role: 'system', content: `${system}\n\n以下是当前浏览器里保存的全部练习记录（仅供本次回答参考）：\n${context}` },
        ...this.chatMessages.slice(-8).map(item => ({ role: item.role, content: item.content }))
      ];
      try {
        const answer = await access.callAI(messages, 700);
        this.chatMessages.push({ role: 'assistant', content: answer || '我暂时没有整理好答案，再问我一次好吗？' });
      } catch (error) {
        this.chatMessages.push({ role: 'assistant', content: error?.message || '暂时连不上 AI 小教练，请检查网络后再试。' });
      } finally {
        this.chatBusy = false;
        this.body.innerHTML = this.renderGrowth(history, adventure);
      }
    }
    renderHistory(history, adventure = [], expression = []) {
      if (!history.length && !adventure.length && !expression.length) return '<div class="info-empty"><span>🗂️</span><h3>还没有保存的练习</h3><p>完成一次朗读复述、自由表达或闯关主题，就能在这里找到它。</p></div>';
      const readingCards = history.map(item => {
        const date = item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '刚刚';
        return `<article class="history-card"><div class="history-card-head"><b>${escapeHtml(item.title || '朗读练习')}</b><time>${date}</time></div><p>${escapeHtml(item.recite || '没有识别到复述文字')}</p><small>匹配原文关键词 ${Number(item.matchedCount) || 0} 个</small>${item.analysis ? `<details class="history-report"><summary>查看 AI 小教练分析</summary><div>${escapeHtml(item.analysis).replace(/\n/g, '<br>')}</div></details>` : ''}</article>`;
      }).join('');
      const adventureCards = adventure.map(item => {
        const date = item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '刚刚';
        const stars = '★'.repeat(Math.min(3, Number(item.stars) || 0)) + '☆'.repeat(Math.max(0, 3 - (Number(item.stars) || 0)));
        return `<article class="history-card history-card-adventure"><div class="history-card-head"><b>${escapeHtml(item.island || '闯关')} · ${escapeHtml(item.topic || '表达主题')}</b><time>${date}</time></div><p>${escapeHtml(item.story || '完成了一次情绪和故事表达')}</p><small>${stars} · 情绪词：${escapeHtml((item.emotions || []).join('、'))}</small></article>`;
      }).join('');
      const expressionCards = expression.map(item => {
        const date = item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '刚刚';
        const reportNote = item.report ? '已保存儿童版 AI 分析' : '已保存口述内容，分析稍后补充';
        return `<article class="history-card history-card-expression"><div class="history-card-head"><b>${escapeHtml(item.title || '自由表达练习')}</b><time>${date}</time></div><p>${escapeHtml(item.text || '没有识别到口述内容')}</p><small>${reportNote} · ${Number(item.totalWords) || 0} 字 · 说清楚度 ${Number(item.density) || 0}%</small>${item.report ? `<details class="history-report"><summary>查看 AI 小教练分析</summary><div>${escapeHtml(item.report).replace(/\n/g, '<br>')}</div></details>` : ''}</article>`;
      }).join('');
      return `<div class="info-intro"><span>最近完成 ${history.length + adventure.length + expression.length} 次</span><button class="info-text-button" data-info-nav="growth">查看成长档案 →</button></div><div class="history-list">${expressionCards}${adventureCards}${readingCards}</div>`;
    }
    renderGrowth(history, adventure = []) {
      const stars = adventure.reduce((sum, item) => sum + (Number(item.stars) || 0), 0);
      const expression = this.readExpressionHistory();
      const recent = [
        ...history.map(item => ({ ...item, _kind: 'reading' })),
        ...adventure.map(item => ({ ...item, _kind: 'adventure' })),
        ...expression.map(item => ({ ...item, _kind: 'expression' }))
      ].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
      const recentCards = recent.map(item => {
        const date = item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '刚刚';
        if (item._kind === 'adventure') {
          const starsText = '★'.repeat(Math.min(3, Number(item.stars) || 0)) + '☆'.repeat(Math.max(0, 3 - (Number(item.stars) || 0)));
          return `<article class="history-card history-card-adventure"><div class="history-card-head"><b>${escapeHtml(item.island || '闯关')} · ${escapeHtml(item.topic || '表达主题')}</b><time>${date}</time></div><p>${escapeHtml(item.story || '完成了一次情绪和故事表达')}</p><small>${starsText} · 情绪词：${escapeHtml((item.emotions || []).join('、'))}</small></article>`;
        }
        if (item._kind === 'expression') {
          return `<article class="history-card history-card-expression"><div class="history-card-head"><b>${escapeHtml(item.title || '自由表达练习')}</b><time>${date}</time></div><p>${escapeHtml(item.text || '没有识别到口述内容')}</p><small>已保存 AI 分析 · ${Number(item.totalWords) || 0} 字 · 说清楚度 ${Number(item.density) || 0}%</small></article>`;
        }
        return `<article class="history-card"><div class="history-card-head"><b>${escapeHtml(item.title || '朗读练习')}</b><time>${date}</time></div><p>${escapeHtml(item.recite || '没有识别到复述文字')}</p><small>匹配原文关键词 ${Number(item.matchedCount) || 0} 个</small></article>`;
      }).join('');
      const historySection = recent.length
        ? `<section class="growth-history"><div class="growth-history-head"><h4>历史记录</h4><span class="growth-history-count">共 ${recent.length} 次</span></div><div class="history-list">${recentCards}</div></section>`
        : '<div class="growth-history-empty">完成一次练习后，历史记录会出现在这里。</div>';
      return `<div class="growth-hero"><span class="growth-medal">🏅</span><div><h3>你已经完成 ${history.length + adventure.length + expression.length} 次练习</h3><p>每一次开口，都是表达力的一点点升级。</p></div></div><div class="growth-stats"><div><b>${history.length}</b><span>朗读复述</span></div><div><b>${adventure.length}</b><span>闯关主题</span></div><div><b>${expression.length}</b><span>自由表达</span></div></div>${historySection}${this.renderGrowthChat(history, adventure, expression)}<div class="info-tip"><b>下一步小目标</b><p>闯关时说清楚一件小事，再加上你的真实感受。完成记录会自动保存在这里。</p></div>`;
    }
    renderParent(history, adventure = [], expression = []) {
      return `<div class="parent-hero"><span>🧡</span><div><h3>陪孩子把话说完整</h3><p>这里可以查看朗读复述、自由表达和闯关主题的完成情况，了解孩子是否说清了事件和感受。</p></div></div><div class="parent-list"><div><b>朗读复述</b><span>${history.length ? `已保存 ${history.length} 次` : '暂时没有记录'}</span></div><div><b>自由表达</b><span>${expression.length ? `已保存 ${expression.length} 次` : '暂时没有记录'}</span></div><div><b>闯关进度</b><span>${adventure.length ? `已完成 ${adventure.length} 个主题` : '还没有完成主题'}</span></div><div><b>隐私说明</b><span>记录保存在当前浏览器，不会自动发布到网络。</span></div></div><button class="info-primary-button" data-info-nav="history">打开历史记录</button>`;
    }
  }

  class FreeExpressionPractice {
    constructor() {
      this.hub = document.getElementById('free-expression-hub');
      if (!this.hub) return;
      this.home = document.getElementById('kids-home');
      this.mainArea = document.querySelector('.main-area');
      this.step = document.getElementById('free-expression-step');
      this.count = document.getElementById('free-emotion-count');
      this.prompt = document.getElementById('free-prompt-text');
      this.startButton = document.getElementById('free-expression-start');
      this.scene = '';
      this.prompts = [];
      this.bind();
    }
    bind() {
      document.getElementById('free-expression-back')?.addEventListener('click', () => this.close());
      this.hub.querySelectorAll('[data-free-scene]').forEach(button => button.addEventListener('click', () => this.selectScene(button.dataset.freeScene)));
      this.startButton?.addEventListener('click', () => this.start());
    }
    open() {
      this.home.classList.add('is-reading');
      this.mainArea.classList.add('free-expression-mode');
      window.kidsShellSetTopBack?.(true);
      this.hub.hidden = false; this.hub.classList.add('is-visible');
      this.scene = ''; this.step.hidden = true; this.startButton.disabled = true;
      this.hub.querySelectorAll('[data-free-scene]').forEach(button => button.classList.remove('is-selected'));
      this.count.textContent = '已选场景';
    }
    close() {
      window.freeExpressionContext = null;
      this.hub.classList.remove('is-visible'); this.hub.hidden = true; this.mainArea.classList.remove('free-expression-mode'); this.home.classList.remove('is-reading');
      window.kidsShellSetTopBack?.(false);
    }
    selectScene(scene) {
      this.scene = scene; this.step.hidden = false; this.startButton.disabled = false; this.count.textContent = '已选场景 ✓';
      this.hub.querySelectorAll('[data-free-scene]').forEach(button => button.classList.toggle('is-selected', button.dataset.freeScene === scene));
      const prompts = {
        家庭: ['最近和家人发生过什么小事？', '为什么会这样？后来结果怎样？', '你因为这件事有什么感受或希望？'],
        校园: ['课堂、同学或老师之间发生了什么？', '事情为什么会这样发展？', '最后结果怎样？你有什么感受？'],
        户外: ['你在哪里发现了什么或完成了什么？', '哪个具体画面最清楚？', '后来怎么样？你有什么感受？'],
        社交: ['你和朋友之间发生了什么？', '你当时想表达什么？', '最后怎么回应或解决的？'],
        日常小事: ['今天哪一件小事值得说？', '它为什么让你记住？', '你希望下次怎么做？'],
        旅行: ['路上看到了什么新鲜事？', '哪个瞬间最具体、最有画面？', '后来结果怎样？你有什么感受？']
      };
      this.prompts = prompts[scene] || prompts['日常小事'];
      this.prompt.textContent = `${this.prompts[0]} ${this.prompts[1]} ${this.prompts[2]}`;
    }
    start() {
      if (!this.scene) return;
      const guidance = [
        '先说清楚：发生了什么',
        '补一句：为什么会这样、后来结果怎样',
        '加一个具体瞬间或例子',
        '说出感受和需求：我因为……感到……我希望……',
        '如果有观点，可以说：我认为……因为……'
      ];
      window.freeExpressionContext = { mode: 'free', scene: this.scene, emotions: [], prompts: [...this.prompts], guidance };
      this.hub.classList.remove('is-visible'); this.hub.hidden = true; this.mainArea.classList.remove('free-expression-mode'); this.home.classList.add('is-launching');
      const status = document.getElementById('access-status');
      if (status) status.textContent = `自由表达 · ${this.scene} · 右侧会实时提示`;
      window.accessController?.open('record');
    }
  }

  function init() {
    const home = document.getElementById('kids-home'); const dialog = document.getElementById('access-dialog');
    if (!home || !dialog) return;
    const topBack = document.getElementById('topbar-back');
    const setTopBack = visible => topBack?.classList.toggle('hidden', !visible);
    window.kidsShellSetTopBack = setTopBack;
    window.readingPractice = new ReadingPractice();
    window.kidsInfoPanel = new KidsInfoPanel();
    window.freeExpressionPractice = new FreeExpressionPractice();
    window.adventurePractice = new AdventurePractice();
    const tabs = [...document.querySelectorAll('[data-kids-mode]')]; const panels = [...document.querySelectorAll('[data-kids-panel]')];
    const setMode = mode => {
      const adventure = mode === 'adventure';
      tabs.forEach(tab => { const active = tab.dataset.kidsMode === mode; tab.classList.toggle('is-active', active); tab.setAttribute('aria-selected', String(active)); });
      panels.forEach(panel => { const active = adventure && panel.dataset.kidsPanel === 'adventure'; panel.classList.toggle('is-visible', active); panel.hidden = !active; });
      home.classList.toggle('adventure-open', adventure);
      setTopBack(adventure);
      if (adventure) window.adventurePractice?.open();
    };
    window.kidsShellReturnHome = () => {
      if (window.trainer?.isRecording) {
        window.trainer.addFeedbackItem('先点“结束”，再返回首页，这样刚才的字幕会被保存。', 'ai');
        return;
      }
      window.readingPractice?.close();
      window.freeExpressionPractice?.close();
      setMode('home');
      window.trainer?.returnToHome();
      setTopBack(false);
    };
    topBack?.addEventListener('click', () => window.kidsShellReturnHome?.());
    document.getElementById('adventure-home-back')?.addEventListener('click', () => setMode('home'));
    tabs.forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.kidsMode)));
    document.querySelectorAll('[data-open-task]').forEach(button => button.addEventListener('click', () => {
      const task = button.dataset.openTask;
      if (task === 'read') { window.readingPractice?.open(); return; }
      if (task === 'free') { window.freeExpressionPractice?.open(); return; }
      home.classList.add('is-launching'); window.accessController?.open('record');
    }));
    document.querySelectorAll('[data-adventure-scene]').forEach(button => button.addEventListener('click', () => window.adventurePractice?.selectIsland(button.dataset.adventureScene)));
    document.getElementById('kids-paste-link')?.addEventListener('click', () => window.trainer?.openPasteModal());
    document.querySelectorAll('[data-kids-view="growth"]').forEach(button => button.addEventListener('click', () => window.kidsInfoPanel?.open('growth')));
    dialog.addEventListener('close', () => home.classList.toggle('is-launching', Boolean(window.trainer?.isRecording)));
    document.getElementById('btn-start')?.addEventListener('click', () => { home.classList.add('is-launching'); setTopBack(true); });
    // 结束录制后仍停留在练习态，让字幕、实时反馈和分析入口继续可见；
    // 只有返回按钮才退出练习并显示首页。
    document.getElementById('btn-stop')?.addEventListener('click', () => home.classList.add('is-launching'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
