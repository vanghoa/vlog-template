"use strict"

function button_arrange(btn,__,wh,g_static,g_change,limprefix) {
  let but = button[btn];
  let length = but.length;
  let lim = Math.round(__*length);
      limgrid[limprefix] = lim;
      
  let sh = `calc(
                  (100${wh}*${__} - ${navsz/2}px)/${lim}
                )`;
  let sh_ = `calc(
                  (100${wh}*${1-__} - ${navsz/2}px)/${length - lim}
                )`;

  setp(`--${limprefix}lim`,`${lim}`);
  setp(`--${limprefix}sh`,sh);
  setp(`--${limprefix}sh_`,sh_);

  for (let i=0; i<=length-1; i++) {
    but[i].classList.remove('upleft','downright');
    but[i].style[g_static] = `1`;
    if ((i+1) <= lim) {
      but[i].style[g_change] = `${i+1}`;
      but[i].classList.add('upleft');
    } else {
      but[i].style[g_change] = `${i+2}`;
      but[i].classList.add('downright');
    }
  }
}

function setup_buttons() {
  button[1] = []; button[2] = [];
  let r = (height > 500) && (width > 500) ? 0.5 : height/(width + height);
  let lim_bs = r*buttonfull.length;

  for (let i = 0; i<=buttonfull.length-1; i++) {
    let i_ = i < lim_bs ? 1 : 2;
    let btn = buttonfull[i];

    nav[i_].appendChild(btn);
    button[i_].push(btn);
  }

  ylength = button[1].length;
  xlength = button[2].length;
  setp(`--yyleng`,`${ylength}`);
  setp(`--xxleng`,`${xlength}`);
}

function setup_petals() {
  let petal_ = $$('.petal');
  for (let i of petal_) {i.remove();}
  arrpetal = [];
  arrpetalfull = Array(ylength + 1);

  let buttonclone = $create('button');
      buttonclone.className = 'petal';
  
  for (let row = 0; row <= ylength; row++) {
    arrpetalfull[row] = [];
    for (let col = 0; col <= xlength; col++) {

      let clone = buttonclone.cloneNode(true)
          clone.style.gridRow = row + 2;
          clone.style.gridColumn = col + 2;
      nav.appendChild(clone);
      arrpetalfull[row].push(clone);
    }
  }
  
}

async function grow_petals(wait) {
  arrpetal = [];
  let yy = Array(4).fill(limgrid.yy);
  let xx = Array(4).fill(limgrid.xx);

  yy[0]--; xx[0]--;
  yy[1]--; xx[1]++;
  yy[2]++; xx[2]--;
  yy[3]++; xx[3]++;

  while (true) {
    let quit = 0;
    
    if (yy[0] >= 0 && xx[0] >= 0) {petal(0); yy[0]--; xx[0]--; }
    else {quit++}
    if (yy[1] >= 0 && xx[1] <= xlength) {petal(1); yy[1]--; xx[1]++; }
    else {quit++}
    if (yy[2] <= ylength && xx[2] >= 0) {petal(2); yy[2]++; xx[2]--; }
    else {quit++}
    if (yy[3] <= ylength && xx[3] <= xlength) {petal(3); yy[3]++; xx[3]++; }
    else {quit++}

    if(quit == 4) {break;}
  }

  if (wait) {await timeout(200);}

  for (let clone of arrpetal) {
    if (wait) {clone.addEventListener('transitionend', clone_remap);}
    else {clone.classList.add('notransition');}
      clone.classList.add('show');
    if (wait) {await timeout(100);}
    else {clone_remap({target : clone});}
  }

  for (let btn of buttonall) {btn.disabled = false;}

  function clone_remap(e) {
    let clone = e.target;
    let xx, yy;
    let rect = clone.getBoundingClientRect();
    switch (clone.corner) {
      case 0:
        yy = xx = -navsz/2;
      break;
      case 1:
        xx = navsz/2;
        yy = -navsz/2;
      break;
      case 2:
        xx = -navsz/2;
        yy = navsz/2;
      break;
      case 3:
        yy = xx = navsz/2;
    }
    clone.style.backgroundPosition = `calc(50% + ${width/2 - (rect.left + rect.width/2) + xx}px) calc(50% + ${height/2 - (rect.top + rect.height/2) + yy}px)`;
    clone.removeEventListener('transitionend', clone_remap);
  }

  function petal(i) {
    let clone = arrpetalfull[yy[i]][xx[i]];
        clone.classList.remove('show');
        clone.classList.add(`p${i}`,`visibility`);
        clone.corner = i;
        arrpetal.push(clone);
  }
}

async function dispose_petals() {
  arrpetal.reverse();
  for (let clone of arrpetal) {
    clone.classList.remove('notransition','show');
    await timeout(100);
    clone.classList.remove('p0','p1','p2','p3','visibility');
  }
  for (let btn of buttonall) {btn.disabled = false;}
}

async function opennav() {
    xx = map(Math.random(),0,1,(1/xlength),1-(1/xlength));
    yy = map(Math.random(),0,1,(1/ylength),1-(2/ylength));
    setp('--xx',`${xx}`);
    setp('--yy',`${yy}`);

    button_arrange(1,yy,'vh','grid-column','grid-row','yy');
    button_arrange(2,xx,'vw','grid-row','grid-column','xx');

    root.classList.add('open');

    grow_petals(true);
  
    let d = navsz/2;
    let xcen = width*xx; //u
    let ycen = height*yy; //u
  
    for (let item of arr) {
      let dx = d;
      let dy = d;
      let posx = item.posx() + item.transx;
      let posy = item.posy() + item.transy;
      let left = item.left + item.transx;
      let left_ = item.left_() + item.transx;
      let top = item.top + item.transy;
      let top_ = item.top_() + item.transy;
  
      if (posx < xcen) {dx = -d;} 
      if (posy < ycen) {dy = -d;} 
  
      if ((left < xcen) && (left_ > xcen)) {
          item.classList.add('transition_wh');
          if (posx >= xcen) {dx = -dx;}
          item.width+=d*2;
          item.style.width = `${item.width}px`;
      }
      
      if ((top < ycen) && (top_ > ycen)) {
          item.classList.add('transition_wh');
          if (posy >= ycen) {dy = -dy;} 
          item.height+=d*2;
          item.style.height = `${item.height}px`;
      }

      item.classList.add('transition');
      translate(item,dx,dy);
    }
    translate(text,-d,-d);
        
    for (let item of background) {
      translate(item,item.dx,item.dy);
    }
    translate(keynotes,0,d);
  }
  
  function closenav() {
    dispose_petals() 
    root.classList.remove('open');

    let d = -navsz/2;
    let xcen = width*xx; //u
        let xcenl = xcen - navsz/2;
        let xcenr = xcen + navsz/2;
    let ycen = height*yy; //u
        let ycent = ycen - navsz/2;
        let ycenb = ycen + navsz/2;
  
    for (let item of arr) {
      let dx = d;
      let dy = d;
      let posx = item.posx() + item.transx;
      let posy = item.posy() + item.transy;
      let left = item.left + item.transx;
      let left_ = item.left_() + item.transx;
      let top = item.top + item.transy;
      let top_ = item.top_() + item.transy;
  
      if (posx < xcen) {dx = -dx;} 
      if (posy < ycen) {dy = -dy;} 
  
      if (
        (left < xcenl) && (left_ > xcenl) ||
        (left < xcenr) && (left_ > xcenr)
      ) {
        item.classList.add('transition_wh');
        let sz1 = left_ - xcenl;
        let sz2 =  xcenr - left;
        let szoff = sz1 < sz2 ? sz1 : sz2;
            szoff = szoff > navsz ? navsz : szoff;
            szoff++;
        if (posx >= xcen) {dx += szoff;}

        item.width-= szoff;
        item.style.width = `${item.width}px`;
      } else if ((left > xcenl) && (left_ < xcenr)) {
        dx = 0;
      }

      if (
        (top < ycent) && (top_ > ycent) ||
        (top < ycenb) && (top_ > ycenb)
      ) {
        item.classList.add('transition_wh');
        let sz1 = top_ - ycent;
        let sz2 = ycenb - top;
        let szoff = sz1 < sz2 ? sz1 : sz2;
            szoff = szoff > navsz ? navsz : szoff;
            szoff++;
        if (posy >= ycen) {dy += szoff;}

        item.height-= szoff;
        item.style.height = `${item.height}px`;
      } else if ((top > ycent) && (top_ < ycenb)) {
        dy = 0;
      }

      item.classList.add('transition');
      translate(item,dx,dy);
    }
    translate(text,-d,-d);
            
    for (let item of background) {
      translate(item,-item.dx,-item.dy);
    }
    translate(keynotes,0,d);
  }
  
  async function wait() {
    let hw = width*xx;
    let hh = height*yy;
    let hn = navsz/2;
    let week_num = week.innerText;
    let urlarr = urlarrtong[week_num].urlarr;
    sovid = urlarr.length;
    subdata = urlarrtong[week_num].subdata;
    arr = [];
  
    while (section.firstChild) {section.removeChild(section.lastChild);}

    currentvid = sovid - 1;
    setp('--pardiv_opacity', 1/sovid);
  
    for (let i = 1; i <= sovid; i++) {
        let xcheck, ycheck;
        let urlitem = urlarr[sovid-1 - (i-1)];
        switch (i % 4) {
          case 0:
            xcheck = true;
            ycheck = true;
          break;
          case 1:
            xcheck = false;
            ycheck = true;
          break;
          case 2:
            xcheck = true;
            ycheck = false;
          break;
          case 3:
            xcheck = false;
            ycheck = false;
        }
  
        let pardiv = pardiv_create(i);
        let div = div_create(i,xcheck,ycheck);
        ////////////
        let core; 
        switch (urlitem.type) {
          case 'vid':
            core = $create('video');
            core.muted = true;
            core.loop = true;
            core.setAttribute('playsinline', true);

            let src = $create('source');
                src.setAttribute('src', urlitem.url);
                src.setAttribute('type', `video/webm`);
            core.appendChild(src);
            if (i == sovid) {
              core.play();
            }
          break;
          case 'img':
            core = $create('img');
            core.src = urlitem.url;
            core.alt = 'internship_image';
        }

        div.appendChild(core);
        pardiv.appendChild(div);
        section.appendChild(pardiv);
  
        arr.push(div);
        setp('--oparoad',`${i*0.5/sovid}`);

        await timeout(100);
    }

    if (sovid == 0) {
      sovid = 1;
      let pardiv = pardiv_create(1);
          pardiv.style.backgroundColor = `rgba(255,255,255,0.3)`;
      let div = div_create(1,true,true);
          div.classList.add('annoucement');
          div.height = map(Math.random(),0,1,snap*5,hh*2 * (4/7));
          div.width = map(Math.random(),0,1,snap*5,hw*2 * (4/7));
          div.left = hw - div.width/2;
          div.top = hh - div.height/2;
          div.style.left = `${div.left}px`;
          div.style.top = `${div.top}px`;
          div.style.width = `${div.width}px`;
          div.style.height = `${div.height}px`;
      let p = $create('p');
          p.textContent = `This week not have any recording (yet)`;

      div.appendChild(p);
      pardiv.appendChild(div);
      section.appendChild(pardiv);
      arr.push(div);
      setp('--oparoad',`0.2`);
      await timeout(100);
    }
    
    if (subdata.length == 0) {
      subdata = false;
      sub.textContent = `"No keynotes for week ${week_num}."`;
      sub.classList.remove('haskeynotes');
      kn_before.disabled = true;
      kn_next.disabled = true;
      kn_before.textContent = `Prev`;
      kn_next.textContent = `Next`;
    } else {
      kn_before.disabled = false;
      kn_next.disabled = false;
      kn_before.textContent = `${subdata.length}/${subdata.length}`;
      kn_next.textContent = `2/${subdata.length}`;
      sub.textContent = `"${subdata[0]}"`;
      sub.current = 0;
      sub.classList.add('haskeynotes');
    }

    week_click();

    function pardiv_create(i) {
      let pardiv = $create('div');
          pardiv.className = 'pardiv';
      return pardiv;
    }

    function div_create(i,xcheck,ycheck) {
      let div = $create('div');

          div.width = map(Math.random(),0,1,
            snap*4,
            (xcheck ? hw : (width-hw))*6/7
          ); //u
          div.height = map(Math.random(),0,1,
            snap*4,
            (ycheck ? hh : (height-hh))*6/7
          ); //u

          div.left = map(Math.random(),0,1,
            (xcheck ? 0 : hw) - hn,
            (xcheck ? hw : width) - div.width + hn
          );
          div.top = map(Math.random(),0,1,
            (ycheck ? 0 : hh) - hn,
            (ycheck ? hh : height) - div.height + hn
          );
          ////////////
          div.left_ = function() {
            return this.left + this.width;
          }

          div.top_ = function() {
            return this.top + this.height;
          }

          div.posx = function() {
            return this.left + this.width/2;
          }

          div.posy = function() {
            return this.top + this.height/2;
          }
          ////////////
          div.transx = 0;
          div.transy = 0;

          div.className = `resize-drag ${i == sovid ? '' : 'black'}`;
          div.style.left = `${div.left}px`;
          div.style.top = `${div.top}px`;
          div.style.height = `${div.height}px`;
          div.style.width = `${div.width}px`;

          div.ontransitionend = (event) => { 
            div.classList.remove('transition');
            div.classList.remove('transition_wh');
          };
          div.id = i-1;
          div.ondblclick = (e) => {
            let t = e.currentTarget;
            if (`${currentvid}` !== t.id) {return;}

            setp('--oparoad',`${+t.id*0.5/sovid}`);
            currentvid = t.id - 1;
            t.parentElement.remove();
            arr[t.id-1]?.classList.remove('black');

            try {
              t.firstElementChild?.pause();
            } catch(err) {}
            try {
              arr[t.id-1]?.firstElementChild.play();
            } catch(err) {}
          };

      return div;
    }
  }

  function week_click() {
    clicktimes++;
    if (clicktimes%2==0) {
      closenav();
    } else {
      for (let btn of buttonall) {btn.disabled = true;}
      opennav();
    }
  }
  
  function navigate(t) {
    for (let btn of buttonall) {btn.disabled = true;}
    week.innerText = t.innerText.substring(5);
    wait();
  }
  
  function dragMoveListener (event) {
    translate(event.target,event.dx,event.dy);
  }
  
  function map (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }
  
  function UrlExists(url) {
      var http = new XMLHttpRequest();
      http.open('HEAD', url, false);
      http.send();
      return http.status!=404;
  }
  
  function translate(target,dx,dy) {
    var x = +target.transx + dx;
    var y = +target.transy + dy;
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.transx = x;
    target.transy = y;
  }
  
  function timeout(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  function toDeci(num) {
    let split = num.split('/');
    return +split[0] / +split[1];
  }

  function keynote_nav(next) {
    let cur = sub.current;
    if (next) {
      cur = check_cur(cur + 1);
    } else {
      cur = check_cur(cur - 1);
    }
    sub.textContent = `"${subdata[cur]}"`;
    kn_before.textContent = `${check_cur(cur - 1) + 1}/${subdata.length}`;
    kn_next.textContent = `${check_cur(cur + 1) + 1}/${subdata.length}`;
    sub.current = cur;
  }
  function check_cur(so) {
    let cur = so > (subdata.length - 1) ? 0 : so;
        cur = cur < 0 ? (subdata.length - 1) : cur;
    return cur;
  }