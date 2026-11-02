/* Local calculations and an interpretive story quiz; no psychometric claim. */
(function(root){
'use strict';
const typeKeys=["warmth", "joy", "discovery", "connection", "cherish", "courage"];
const relations=['長輩','兄弟姊妹／其他親人','小朋友','伴侶','暫時唔揀人','想念嘅人'];
const questions=[
  {
    "place": "01 / 忽然落雨",
    "scene": "你同家人出街散步，行到一半忽然落雨。",
    "title": "等雨停嗰陣，你會想……",
    "choices": [
      [
        "搵間小店坐低，飲杯熱嘢，再一齊諗去邊",
        0,
        5
      ],
      [
        "影低大家避雨嗰個樣，話呢張相一定要留低",
        1,
        4
      ],
      [
        "行入附近嘅舊商場避雨，聽家人講呢度以前係點",
        2,
        3
      ]
    ]
  },
  {
    "place": "02 / 搵到張舊相",
    "scene": "執嘢嗰陣，你搵到一張家人後生時嘅相。",
    "title": "你會想再望多兩眼，係因為……",
    "choices": [
      [
        "想擺喺平時見到嘅地方，原來佢以前係咁嘅樣",
        0,
        4
      ],
      [
        "想知相入面嗰個地方，而家仲可唔可以一齊去",
        5,
        3
      ],
      [
        "呢身打扮幾得意，想問吓嗰陣興啲乜",
        1,
        2
      ]
    ]
  },
  {
    "place": "03 / 食完飯之後",
    "scene": "食完飯，大家都仲坐喺枱邊，未想咁快走。",
    "title": "你會順手做邊樣？",
    "choices": [
      [
        "斟多杯茶，繼續聽家人講最近啲小事",
        0,
        3
      ],
      [
        "問吓今日碟餸點整，順手記低個做法",
        4,
        2
      ],
      [
        "睇吓仲有咩材料，叫家人一齊試整個甜品",
        5,
        1
      ]
    ]
  },
  {
    "place": "04 / 一段語音",
    "scene": "家人傳咗段語音訊息畀你，講起今日一件小事。",
    "title": "你會點覆佢？",
    "choices": [
      [
        "有啲細節想知，索性打畀佢慢慢傾",
        0,
        2
      ],
      [
        "講返個你哋先明嘅笑話，諗住佢聽完會笑",
        3,
        1
      ],
      [
        "佢提起以前成日做嘅事，想搵日陪佢再做一次",
        4,
        5
      ]
    ]
  },
  {
    "place": "05 / 多咗個下晝",
    "scene": "原本嘅安排取消咗，你同家人多咗成個下晝。",
    "title": "你會想去邊度？",
    "choices": [
      [
        "成日去嗰間小店，唔使諗行程，坐低傾吓閒偈",
        0,
        1
      ],
      [
        "一直經過但未入過嘅地方，今次一齊入去睇吓",
        2,
        5
      ],
      [
        "以前成日一齊去嘅地方，睇吓仲有咩冇變",
        3,
        4
      ]
    ]
  },
  {
    "place": "06 / 第一次試",
    "scene": "你同家人一齊做手工，兩個都未係好識。",
    "title": "做到一半，你會講邊句？",
    "choices": [
      [
        "「慢慢嚟，我陪你再試吓。」",
        0,
        5
      ],
      [
        "「整歪咗都要影低，第時睇返一定好好笑。」",
        1,
        4
      ],
      [
        "「你頭先嗰步點整㗎？我哋一齊睇吓。」",
        2,
        3
      ]
    ]
  },
  {
    "place": "07 / 留句說話",
    "scene": "返到屋企，你想喺家庭群組講返句嘢。",
    "title": "邊句最似你會講嘅？",
    "choices": [
      [
        "「今日食嗰樣嘢好有以前嘅味道，下次再一齊食吖。」",
        0,
        4
      ],
      [
        "「頭先講嗰樣嘢，下次一齊試吖。」",
        5,
        3
      ],
      [
        "「頭先嗰件趣事仲未問完，點解最後會咁嘅？」",
        1,
        2
      ]
    ]
  }
];
// Each question covers all six companions once, with two equal contributions per choice.
function scores(answers){const s=Array(6).fill(0);questions.forEach((q,i)=>{const c=q.choices[answers[i]];if(c){s[c[1]]+=2;s[c[2]]+=2;}});return s;}
// Stable tie lottery: answers give the same result on repeat; question position has no priority.
function tieValue(answers,type){let h=2166136261;for(const n of [...answers,type]){h^=n+1;h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,0x7feb352d);h^=h>>>15;h=Math.imul(h,0x846ca68b);h^=h>>>16;return h>>>0;}
function rank(answers){if(answers.length!==questions.length||answers.some((a,i)=>!Number.isInteger(a)||!questions[i].choices[a]))throw Error('請先完成七條問題。');const s=scores(answers);return s.map((score,type)=>({score,type,tie:tieValue(answers,type)})).sort((a,b)=>b.score-a.score||a.tie-b.tie||a.type-b.type).map(x=>typeKeys[x.type]);}
function resolve(answers){return rank(answers)[0];}
function validateProfile(p,table){
 if(!relations.includes(p.relation))return '先揀一個最接近嘅關係，亦可以略過。';
 if(!['life','fixed','skip'].includes(p.mode))return '揀一個時間參考方式。';
 if(p.mode==='skip')return '';
 if(['暫時唔揀人','想念嘅人'].includes(p.relation))return '呢條路線會略過時間估算。';
 if(![1,3,7,14].includes(Number(p.hours)))return '揀一個最接近嘅每週相處時間。';
 if(p.mode==='life'){
  if(p.age===''||!Number.isInteger(Number(p.age))||Number(p.age)<0||Number(p.age)>100)return '請填 0 至 100 歲，或者用未來 10 年作參考。';
  if(!['M','F'].includes(p.sex)||!Number.isFinite(table?.[p.sex]?.[p.age]))return '請揀生命表組別，或者用未來 10 年作參考。';
 }else if(Number(p.years)!==10)return '固定情境使用未來 10 年。';
 return '';
}
function estimate(p,table){const err=validateProfile(p,table);if(err)throw Error(err);if(p.mode==='skip')throw Error('呢條路線冇時間估算。');const years=p.mode==='life'?table[p.sex][p.age]:10;return {years,weekly:Number(p.hours),annual:Number(p.hours)*52,total:Number(p.hours)*52*years};}
function weeks(p,table){const e=estimate(p,table);const past=p.mode==='life'?Number(p.age)*52:0;const future=Math.ceil(e.years*52);return {past,future,total:past+future};}
root.MemoryModel={typeKeys,relations,questions,scores,rank,resolve,validateProfile,estimate,weeks};
})(typeof window!=='undefined'?window:globalThis);
