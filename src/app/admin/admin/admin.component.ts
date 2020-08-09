import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Alert } from '../../classes-const/alerts';
import { MatDrawer } from '@angular/material/sidenav';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { LanguageService } from 'src/app/services/languages/languages.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('drawer') public globalMenu: MatDrawer;
  matDrawerPOsition: string;
  language: string;
  languageToUnsubscribe;

  constructor(private globalFunc: GlobalFunctionsService, private languageService: LanguageService) { }

  ngOnInit(): void {
    this.getLanguage();
    this.getLanguageIfChange();

  }
  getLanguage(){
    this.language = this.languageService.getLanguage();
    this.matDrawerPOsition = this.language == 'heb' ? 'end' : 'start';
  }
  getLanguageIfChange(){
    this.languageToUnsubscribe = this.languageService.language.subscribe(lng => {
      this.language = lng;
      this.matDrawerPOsition = lng == 'heb' ? 'end' : 'start';
    });
  }
  ngAfterViewInit(){
    this.globalFunc.setDrawer(this.globalMenu);
  }
  ngOnDestroy(){
    this.languageToUnsubscribe.unsubscribe();
  }
}
