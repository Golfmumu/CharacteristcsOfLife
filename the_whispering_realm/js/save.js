export class SaveManager {
  constructor(){this.key='whispering-realm-save';}
  save(data){
    try { localStorage.setItem(this.key,JSON.stringify({...data,savedAt:new Date().toISOString()})); return true; }
    catch(error){ console.warn('Could not save journey:',error); return false; }
  }
  load(){
    try { const raw=localStorage.getItem(this.key); return raw?JSON.parse(raw):null; }
    catch(error){ console.warn('Could not load journey:',error); return null; }
  }
}
