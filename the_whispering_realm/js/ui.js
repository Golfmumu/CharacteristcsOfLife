import { CHAPTERS } from './story.js';

export class GameUI {
  constructor() {
    this.$ = s => document.querySelector(s);
    this.panelOpen = false;
    this.$('#start-button').addEventListener('click',()=>this.start?.());
    this.$('#journal-button').addEventListener('click',()=>this.journal?.());
    this.$('#inventory-button').addEventListener('click',()=>this.inventory?.());
    this.$('#pause-button').addEventListener('click',()=>this.pause?.());
    this.$('#resume-button').addEventListener('click',()=>this.resume?.());
    this.$('#save-button').addEventListener('click',()=>this.save?.());
    this.$('#back-title-button').addEventListener('click',()=>this.title?.());
    document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>this.closePanel?.()));
    this.$('#mobile-interact').addEventListener('click',()=>this.mobileInteract?.());
    this.$('#mobile-run').addEventListener('pointerdown',()=>this.mobileRun?.(true));
    this.$('#mobile-run').addEventListener('pointerup',()=>this.mobileRun?.(false));
    this.$('#mobile-run').addEventListener('pointerleave',()=>this.mobileRun?.(false));
    this.setupJoystick();
  }
  setupJoystick() {
    const base=this.$('#joystick'), knob=this.$('#joystick-knob');
    let active=false, center={x:0,y:0};
    const move=e=>{
      if(!active)return;
      const dx=e.clientX-center.x, dy=e.clientY-center.y, max=34;
      const len=Math.hypot(dx,dy), scale=len>max?max/len:1;
      const x=dx*scale,y=dy*scale;
      knob.style.transform=`translate(${x}px,${y}px)`;
      this.mobileMove?.({x:x/max,y:y/max});
    };
    base.addEventListener('pointerdown',e=>{
      active=true; base.setPointerCapture(e.pointerId);
      const r=base.getBoundingClientRect(); center={x:r.left+r.width/2,y:r.top+r.height/2}; move(e);
    });
    base.addEventListener('pointermove',move);
    const end=()=>{active=false;knob.style.transform='translate(0,0)';this.mobileMove?.({x:0,y:0});};
    base.addEventListener('pointerup',end); base.addEventListener('pointercancel',end);
  }
  onStart(fn){this.start=fn;} onInteract(fn){this.interact=fn;}
  onPause(fn){this.pause=fn;} onResume(fn){this.resume=fn;}
  onSave(fn){this.save=fn;} onTitle(fn){this.title=fn;}
  onJournal(fn){this.journal=fn;} onInventory(fn){this.inventory=fn;}
  onClosePanel(fn){this.closePanel=fn;}
  onMobileRun(fn){this.mobileRun=fn;} onMobileMove(fn){this.mobileMove=fn;}
  onMobileInteract(fn){this.mobileInteract=fn;}
  showGame(){
    ['#hud','#objective','#controls-hint','#mobile-controls'].forEach(s=>this.$(s).classList.remove('hidden'));
  }
  setChapter(chapter,index){
    this.$('#chapter-label').textContent=`CHAPTER ${String(index+1).padStart(2,'0')}`;
    this.$('#chapter-name').textContent=chapter.name;
    this.renderJournal();
  }
  setObjective(text,count,required){
    this.$('#objective-text').textContent=text;
    this.$('#objective-progress').textContent=`${count} / ${required} memories`;
  }
  showInteraction(text){this.$('#interaction-text').textContent=text;this.$('#interaction-prompt').classList.remove('hidden');}
  hideInteraction(){this.$('#interaction-prompt').classList.add('hidden');}
  toast(message){const t=this.$('#toast');t.textContent=message;t.classList.remove('hidden');}
  hideToast(){this.$('#toast').classList.add('hidden');}
  showChapterBanner(chapter,index){
    this.$('#banner-kicker').textContent=`CHAPTER ${String(index+1).padStart(2,'0')}`;
    this.$('#banner-title').textContent=chapter.name;
    const b=this.$('#chapter-banner');b.classList.remove('hidden');
    clearTimeout(this.bannerTimer);this.bannerTimer=setTimeout(()=>b.classList.add('hidden'),3200);
  }
  setPaused(value){this.$('#pause-panel').classList.toggle('hidden',!value);}
  togglePanel(id){
    const panel=this.$('#'+id);const opening=panel.classList.contains('hidden');
    document.querySelectorAll('.side-panel').forEach(p=>p.classList.add('hidden'));
    if(opening){panel.classList.remove('hidden');this.panelOpen=true;}
    else this.panelOpen=false;
    if(id==='journal-panel')this.renderJournal();
    if(id==='inventory-panel')this.renderInventory();
  }
  anyPanelOpen(){return this.panelOpen || !this.$('#journal-panel').classList.contains('hidden') || !this.$('#inventory-panel').classList.contains('hidden');}
  renderJournal(){
    const root=this.$('#journal-content');root.innerHTML='';
    CHAPTERS.forEach((c,i)=>{
      const div=document.createElement('div');div.className='quest-entry';
      div.innerHTML=`<strong>${String(i+1).padStart(2,'0')} · ${c.name}</strong><p>${c.objective}</p><p>${i===0?'Current chapter':'Chapter '+(i+1)+' · Memories to discover: '+c.required}</p>`;
      root.appendChild(div);
    });
  }
  renderInventory(){
    const root=this.$('#inventory-content');root.innerHTML='';
    const data=JSON.parse(localStorage.getItem('whispering-realm-save')||'{}');
    const collected=data.collected||[];
    CHAPTERS.forEach(c=>c.items.forEach((id,i)=>{
      if(collected.includes(id)){
        const div=document.createElement('div');div.className='item-card';
        div.innerHTML=`<div class="item-icon">✧</div><strong>${c.itemLabels[i]}</strong><p>${c.descriptions[i]}</p>`;
        root.appendChild(div);
      }
    }));
    if(!root.children.length)root.innerHTML='<p class="small-note">Your satchel is empty. The realm is waiting.</p>';
  }
}
