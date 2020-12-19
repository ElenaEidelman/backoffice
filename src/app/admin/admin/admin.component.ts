import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Alert } from '../../classes-const/alerts';
import { MatDrawer } from '@angular/material/sidenav';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { LanguageService } from 'src/app/services/languages/languages.service';
import { GlobalSettings } from 'src/app/classes-const/globalSettings';
import { ActivatedRoute } from '@angular/router';

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
  globalSettings;
  settings = new GlobalSettings();
  constructor(private globalFunc: GlobalFunctionsService, private languageService: LanguageService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getSettings();
    //this.getLanguageIfChange();

  }
  getSettings(){
    // debugger
    // this.languageService.getSettings().subscribe(settings => {
    //   debugger
    //   this.settings = settings;
    // });
    this.settings = this.route.snapshot.data['settings'];


   

    // this.globalSettings = this.languageService.globalSettings;
    // this.language = this.languageService.settings['language'];
    // this.matDrawerPOsition = this.languageService.settings['direction'] != 'rtl' ? 'start' : 'end';
    
  }
  getLanguageIfChange(){
    // debugger
    // this.languageToUnsubscribe = this.languageService.settings.subscribe(settings => {
    //   debugger
    //   this.language = settings['language'];
    //   this.matDrawerPOsition = settings['direction'] == 'rtl' ? 'end' : 'start';
    // });
  }
  ngAfterViewInit(){

  }
  ngOnDestroy(){
    //this.languageToUnsubscribe.unsubscribe();
  }
}
