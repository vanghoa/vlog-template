"use strict";const root=document.querySelector(":root"),rootstyle=getComputedStyle(root),getp=rootstyle.getPropertyValue.bind(rootstyle),setp=root.style.setProperty.bind(root.style),$create=document.createElement.bind(document),$=document.querySelector.bind(document),$$=document.querySelectorAll.bind(document),section=$("main section"),nav=$("nav");nav[1]=$("#nav1"),nav[2]=$("#nav2");const text=$("p.week");text.transx=0,text.transy=0;const sub=$("p.sub"),keynotes=$("#keynotes");keynotes.transx=0,keynotes.transy=0;const kn_before=$(".keynotes.before"),kn_next=$(".keynotes.next");kn_before.disabled=!0,kn_next.disabled=!0;const kn_before_=[$(".keynotes.before b"),$(".keynotes.before span")],kn_next_=[$(".keynotes.next b"),$(".keynotes.next span")],buttonfull=[...$$('#nav1 [onclick="navigate(this);"]'),...$$('#nav2 [onclick="navigate(this);"]')],buttonall=$$("button:not(.keynotes)"),button={1:[],2:[]};let ylength,xlength;const navsz=+getp("--navsz_sampl").slice(0,-2);let width=innerWidth,height=innerHeight,xx=.5,yy=.5,limgrid={};const background=[$(".background:nth-child(1)"),$(".background:nth-child(2)"),$(".background:nth-child(3)"),$(".background:nth-child(4)")];for(let t of background)t.transx=0,t.transy=0;background[0].dx=background[2].dx=-navsz/2,background[0].dy=background[1].dy=-navsz/2,background[3].dx=background[1].dx=navsz/2,background[3].dy=background[2].dy=navsz/2;const snap=50,nmspc="vid";let navisopen=!1;const week=$("#week");let arrpetalfull,subdata,currentvid,arr=[],arrpetal=[],sovid=1,urlarrtong={};!async function(){let t=await(await fetch("scripts_min/subtitle.json")).json(),e=Object.keys(t).length;for(let n=1;n<=e;n++){let e=[],{ct:r,mxvd:o,type:s,link:a,vlog:i}=t[n];if(r.length>0&&(r.unshift(`Keynotes of week ${n}.`),r.push(`Thank you! That's it for week ${n}.`,"See the actual vlog recorded: ")),"webm"==s)for(let t=1;t<=o;t++)e.push({url:`week ${n}/vid (${t}).webm`,type:"webm"});else if("various"==s)for(let[t,r,o]of a)for(let s=t;s<=r;s++)e.push({url:`week ${n}/vid (${s}).${o}`,type:o});urlarrtong[n]={urlarr:e,subdata:r,vlog:i}}setup_buttons(),setup_petals();let n=+location.hash.substring(1);n>=1&&n<=buttonfull.length&&navigate(buttonfull[n-1])}(),window.onresize=_.debounce((function(){width=innerWidth,height=innerHeight,setup_buttons(),setup_petals(),button_arrange(1,+getp("--yy"),"vh","grid-column","grid-row","yy"),button_arrange(2,+getp("--xx"),"vw","grid-row","grid-column","xx"),navisopen&&grow_petals(!1)}),1e3),interact(".resize-drag").resizable({edges:{left:!0,right:!0,bottom:!0,top:!0},listeners:{move(t){let e=t.target;if(e.classList.contains("black")||0==e.resizable)return;let n=t.rect,r=e.transx,o=e.transy;e.style.width=n.width+"px",e.style.height=n.height+"px",arr[e.id].width=+n.width,arr[e.id].height=+n.height,r+=t.deltaRect.left,o+=t.deltaRect.top,e.style.transform="translate("+r+"px,"+o+"px)",e.transx=r,e.transy=o}},modifiers:[interact.modifiers.restrictSize({min:{width:1,height:1}}),interact.modifiers.snap({targets:[interact.snappers.grid({x:50,y:50})],range:1/0,relativePoints:[{x:0,y:0}]})],inertia:!1}).draggable({listeners:{move:window.dragMoveListener,start(t){let e=t.target;e.classList.remove("black"),+e.id+1<=sovid-1&&(arr[+e.id+1].parentElement.style.backgroundColor="transparent");try{e.firstElementChild?.play()}catch(t){return}}},modifiers:[interact.modifiers.snap({targets:[interact.snappers.grid({x:50,y:50})],range:1/0,relativePoints:[{x:0,y:0}]})]});