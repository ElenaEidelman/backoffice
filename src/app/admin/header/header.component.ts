import { Component, OnInit, Input } from '@angular/core';
import { LanguageService } from '../../services/languages/languages.service';
import { MatSidenav, MatDrawer } from '@angular/material/sidenav';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private formService: LanguageService, private globalFunc: GlobalFunctionsService) { }
  
  direction: string;
  language: string;
  enHeb: string = 'HEB';

  ngOnInit(): void {
    this.getCurrentLang();
    this.getDirection();
  }
  getDirection(){
    this.direction = this.formService.getDirection();
  }
  getCurrentLang(){
    this.language = this.formService.getLanguage();
  }
  changeLanguage(){
    // direction configuration by selected language

    this.language = this.language == 'eng' ? 'heb' : 'eng';
    this.formService.changeLanguage(this.language);
    
    //change direction and language
    this.enHeb = this.language == 'eng' ? 'HEB' : 'EN';
    this.direction = this.direction == 'ltr'  ? 'rtl' : 'ltr';
    document.body.style.textAlign = this.direction == 'rtl' ? 'right' : 'left';
    

   //tree menu configuration start
    let menuElements = document.querySelectorAll('cdk-nested-tree-node');
    menuElements.forEach((el, index)=> {
      (el as HTMLBodyElement).style.paddingRight = this.direction == 'rtl' ? '40px' : '0px';
      (el as HTMLBodyElement).style.paddingLeft = this.direction == 'rtl' ? '0px' : '40px';
      (el as HTMLBodyElement).dir = this.direction;
    });
    
    document.querySelector('cdk-tree').parentElement.style.marginRight = this.direction == 'rtl' ? '-40px' : '0px';
    document.querySelector('cdk-tree').parentElement.style.marginLeft = this.direction == 'rtl' ? '0px' : '-40px';

    
    document.querySelectorAll('mat-drawer-content').forEach(el => {
      (el as HTMLBodyElement).style.marginRight = this.direction == 'rtl' ? '240px' : '0px';
      (el as HTMLBodyElement).style.marginLeft = this.direction == 'rtl' ? '0px' : '240px';
    });
    //tree menu configuration end


    //header configuration
    document.querySelector('mat-toolbar-row').parentElement.dir = this.direction;

   
   }

  openMenu() {
    this.globalFunc.toggle();
  }
}
