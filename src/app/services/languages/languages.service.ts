import { Injectable, EventEmitter, DebugNode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  language = new EventEmitter<string>();
  direction = new EventEmitter<string>();
  currentLang: string = 'eng';
  pageDirection: string = 'ltr';
  textAlign: string;

  constructor() {
    this.language.emit(this.currentLang);
    this.direction.emit(this.pageDirection);
    document.body.dir = this.pageDirection;
    document.body.style.textAlign = this.pageDirection == 'rtl' ? 'right' : 'left';
   }

   changeLanguage(lng){
     this.language.emit(lng);
     let dir = lng != 'heb' ? 'ltr' : 'rtl';
     this.direction.emit(dir);
   }
   getLanguage(){
    return this.currentLang;
   }
   getDirection(){
     return this.pageDirection;
   }
}
