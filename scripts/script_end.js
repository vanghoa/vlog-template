"use strict"
const root = document.querySelector(':root');
const rootstyle = getComputedStyle(root);
const getp = rootstyle.getPropertyValue.bind(rootstyle);
const setp = root.style.setProperty.bind(root.style);
const $create = document.createElement.bind(document);
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const section = $('main section');
const nav = $('nav');
      nav[1] = $('#nav1');
      nav[2] = $('#nav2');
const text = $('p.week');
      text.transx = 0;
      text.transy = 0;
const sub = $('p.sub');
const keynotes = $('#keynotes');
      keynotes.transx = 0;
      keynotes.transy = 0;
const kn_before = $('.keynotes.before');
const kn_next= $('.keynotes.next');
      kn_before.disabled = true;
      kn_next.disabled = true;
const kn_before_ = [$('.keynotes.before b'), $('.keynotes.before span')];
const kn_next_ = [$('.keynotes.next b'), $('.keynotes.next span')];

const buttonfull = [...$$('#nav1 [onclick="navigate(this);"]'), ...$$('#nav2 [onclick="navigate(this);"]')];
const buttonall = $$('button:not(.keynotes)');
const button = {1 : [],2 : []};
let ylength; let xlength;

const navsz = +getp('--navsz_sampl').slice(0,-2);

let width = innerWidth;
let height = innerHeight;
let xx = 1/2;
let yy = 1/2;
let limgrid = {};

const background = [
  $('.background:nth-child(1)'),
  $('.background:nth-child(2)'),
  $('.background:nth-child(3)'),
  $('.background:nth-child(4)')
];
for (let item of background) {
  item.transx = 0;
  item.transy = 0;
}
  background[0].dx = background[2].dx = -navsz/2;
  background[0].dy = background[1].dy = -navsz/2;
  background[3].dx = background[1].dx = navsz/2;
  background[3].dy = background[2].dy = navsz/2;
const snap = 50;
const nmspc = 'vid';

let navisopen = false;
const week = $('#week');

let arr = [];
let arrpetal = [];
let sovid = 1;
let arrpetalfull;
let subdata;
let currentvid;
let urlarrtong = {};

//////////////////////////////////////////////////////////////////////

(async function setup_fetch() {
  let subdata = await (await fetch(`scripts_min/subtitle.json`)).json();
  let subdatalength = Object.keys(subdata).length;

  for (let week_num=1; week_num<=subdatalength; week_num++) {
    let urlarr = [];
    let {ct, mxvd, type, link, vlog} = subdata[week_num];

    if (ct.length > 0) {
      ct.unshift(`Keynotes of week ${week_num}.`);
      ct.push(`Thank you! That's it for week ${week_num}.`, `See the actual vlog recorded: `);
    }

    if (type == 'webm') {
      for (let i=1; i<=mxvd; i++) {
        urlarr.push({
          url : `week ${week_num}/${nmspc} (${i}).webm`,
          type : 'webm'
        })
      }
    } else if (type == 'various') {
      for (let [last,end,type_] of link) {
        for (let i = last; i<=end; i++) {
          urlarr.push({
            url : `week ${week_num}/${nmspc} (${i}).${type_}`,
            type : type_
          })
        }
      }
    }

    urlarrtong[week_num] = {
      urlarr,
      subdata : ct,
      vlog
    };
  }
  /*
  for (let week_num=1; week_num<=12; week_num++) {
    let sovid = 1;
    let urlarr = [];
    while (true) {
      if (UrlExists(`week ${week_num}/${nmspc} (${sovid}).webm`)) {
        urlarr.push({
          url : `week ${week_num}/${nmspc} (${sovid}).webm`,
          type : 'vid'
        })
        sovid++;
      } else if (UrlExists(`week ${week_num}/${nmspc} (${sovid}).jpg`)) {
        urlarr.push({
          url : `week ${week_num}/${nmspc} (${sovid}).jpg`,
          type : 'img'
        })
        sovid++;
      } else {
        sovid--;
        break;
      }
    }

    urlarrtong[week_num] = {
      urlarr,
      subdata : subdata[week_num].ct
    };
  }
  */
  //console.clear();

  setup_buttons();
  setup_petals();
  
  let hash = +location.hash.substring(1);
  if ((hash >= 1) && (hash <= buttonfull.length)) {
    navigate(buttonfull[hash - 1]);
  }
})();

window.onresize = _.debounce(function() {
  width = innerWidth;
  height = innerHeight;
  // reconstruct navbar
  setup_buttons();
  setup_petals();
  button_arrange(1,+getp('--yy'),'vh','grid-column','grid-row','yy');
  button_arrange(2,+getp('--xx'),'vw','grid-row','grid-column','xx');
  if (!navisopen) {return;}
  grow_petals(false);
}, 1000);

interact('.resize-drag')
  .resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    listeners: {
      move (event) {
        let t = event.target;
        if (t.classList.contains('black') || t.resizable == false) {return;}
        let rect = event.rect;

        let x = t.transx;
        let y = t.transy;

        // update the element's style
        t.style.width = rect.width + 'px'
        t.style.height = rect.height + 'px'
        arr[t.id].width = +rect.width;
        arr[t.id].height = +rect.height;

        // translate when resizing from top or left edges
        x += event.deltaRect.left
        y += event.deltaRect.top

        t.style.transform = 'translate(' + x + 'px,' + y + 'px)'

        t.transx = x;
        t.transy = y;
        }
    },
    modifiers: [
      // minimum size
      interact.modifiers.restrictSize({
        min: { width: 1, height: 1 }
      }),
      interact.modifiers.snap({
        targets: [
          interact.snappers.grid({ x: snap, y: snap })
        ],
        range: Infinity,
        relativePoints: [ { x: 0, y: 0 } ]
      })
    ],

    inertia: false
  })
  .draggable({
    listeners: { 
      move: window.dragMoveListener, 
      start(event) {
        let t = event.target;
        t.classList.remove('black');
        if ((+t.id + 1) <= sovid - 1) {
          arr[+t.id + 1].parentElement.style.backgroundColor = `transparent`;
        }
        
        try {
          t.firstElementChild?.play();
        } catch(err) {
          return;
        }
      }
    },
    modifiers: [
      interact.modifiers.snap({
        targets: [
          interact.snappers.grid({ x: snap, y: snap })
        ],
        range: Infinity,
        relativePoints: [ { x: 0, y: 0 } ]
      })
    ]
  })

//////////////////////////////////////////////////////////////////////
