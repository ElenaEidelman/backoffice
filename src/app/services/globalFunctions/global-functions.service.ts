import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav/drawer';
import { LanguageService } from '../languages/languages.service';


@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {

  private globalMenu: MatDrawer;

  constructor(private languageService: LanguageService) { }
  globalLanguage: any;
  setDrawer(menu: MatDrawer) {
    this.globalMenu = menu;
  }

  toggle(): void {

    this.globalMenu.toggle();
  }
}
