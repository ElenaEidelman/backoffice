import { Component, OnInit, Input, AfterContentInit, AfterViewInit, HostListener } from '@angular/core';
import { LanguageService } from '../../services/languages/languages.service';
import { MatSidenav, MatDrawer } from '@angular/material/sidenav';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { FormTitles } from '../../classes-const/menuFormTitles';
import { OtherTitles } from 'src/app/classes-const/Titles';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { GetSetDataService } from 'src/app/services/getSetData/get-set-data.service';
import { GlobalSettings } from 'src/app/classes-const/globalSettings';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [LanguageService]
})
export class HeaderComponent implements OnInit, AfterContentInit, AfterViewInit {

  constructor(
    private languageService: LanguageService,
    private globalFunc: GlobalFunctionsService,
    private fb: FormBuilder,
    private getSetData: GetSetDataService) { }


    @HostListener('scroll', [])
    onWindowScroll(event) {
      var el = document.querySelector('.content');
      var destinationFromTop = el.scrollTop;
      alert();
    }




  @Input() settings;

  // language: string;
  openMenuElement: boolean = false;
  menuIcon: string = 'close';
  openMenuTooltip: string = '';
  closeTooltip: string = '';
  saveButtonTitles: string = '';
  languageTooltip: string = '';
  savedTitle: string = '';
  errorSubmit: boolean = false;
  globalSettingForm = this.fb.group({
    language: ['']
  });
  languageSettings;

  ngOnInit(): void {
    this.getLanguageSettings();
    this.configuration();
    this.getSettingsIfChange();

  }
  configuration() {
    // document.querySelectorAll('app-root').forEach(element => {
    //   (element as HTMLBodyElement).dir = this.settings['direction'];
    // });

    //header configuration
    let headerElement = document.querySelector('mat-toolbar-row');
    headerElement.parentElement.dir = this.settings['direction'];
    headerElement.parentElement.style.backgroundImage = this.settings['direction'] == 'rtl' ? 'linear-gradient(to left,rgba(13,230,255,0.15) 0%,rgba(201,189,174,0) 25%)' : 'linear-gradient(to right,rgba(13,230,255,0.15) 0%,rgba(201,189,174,0) 25%)';

    let content = document.querySelectorAll('mat-drawer-content, mat-drawer');
    content.forEach(content => {
      (content as HTMLBodyElement).dir = this.settings['direction'];
    });

    
    let pageViewSettings = document.querySelectorAll('.pageViewSettings');
    pageViewSettings.forEach(settings => {
      (settings as HTMLBodyElement).style.textAlign = this.settings['direction'] == 'rtl' ? 'right' : 'left';
    });

    let menu = document.querySelectorAll('.content-menu-wrap');
    menu.forEach(menu => {
      (menu as HTMLBodyElement).style.flexDirection = this.settings['direction'] == 'rtl' ? 'row-reverse' : 'row';
    });

    let treeMenu = document.querySelectorAll('.viewMenu');
    treeMenu.forEach(treeMenu => {
      (treeMenu as HTMLBodyElement).dir = this.settings['direction'];
    });


    this.configTitles(this.settings);
  }
  getLanguageSettings(){
    this.getSetData.getLanguagesSettings().subscribe(langSettings => {
      this.languageSettings = langSettings;
    });
  }
  getSettingsIfChange(){
    this.getSetData.settings.subscribe(settings => {
      this.settings = settings;
      this.configuration();
    });
  }
  
  configTitles(settings: GlobalSettings) {
    this.openMenuTooltip = this.openMenuElement == true ? FormTitles[settings['language']].tooltipOpenMenu : FormTitles[settings['language']].tooltipCloseMenu;
    this.saveButtonTitles = OtherTitles[settings['language']].saveButton;
    this.languageTooltip = OtherTitles[settings['language']].language;
    this.closeTooltip = OtherTitles[settings['language']].close;
  }
  changeLanguage(lang) {
    this.getSetData.emitGlobalsettings(lang);
    this.configTitles(lang);
  }

  saveGlobalSettings() {
    let dataLangFromForm = this.globalSettingForm.get('language').value;
    let lang =  dataLangFromForm != '' ? dataLangFromForm : this.settings['language'];
    let direction = Array.from(this.getSetData.languageSettings['language']).find(el => el['language'] == lang)['direction'];
    let globalSettingObj: GlobalSettings = {
      language: lang,
      direction: direction
    }
    this.getSetData.saveGlobalSettings(globalSettingObj).subscribe(response => {
      if(response.includes('SUCCESS')){
        this.settings = globalSettingObj;
        this.configuration();
        this.getSetData.settings.emit(globalSettingObj);
        this.savedTitle = OtherTitles[this.settings['language']].savedSuccesfully;
        setTimeout(() => {
          this.savedTitle = '';
        }, 3000);
      }
      else{
        this.savedTitle = OtherTitles[this.settings['language']].savedWhithError;
        this.errorSubmit = !this.errorSubmit;
        setTimeout(()=>{
          this.savedTitle = '';
          this.errorSubmit = !this.errorSubmit;
        },3000);
      }
    });
  }

  onLanguageChange(event, parameter) {





    // const checkArray: FormArray = this.globalSettingForm.get('arrayValues') as FormArray;

    // if (e.checked) {
    //   checkArray.push(new FormControl(e.source.value));
    // } else {
    //   let i: number = 0;
    //   checkArray.controls.forEach((item: FormControl) => {
    //     if (item.value == e.source.value) {
    //       checkArray.removeAt(i);
    //       return;
    //     }
    //     i++;
    //   });
    // }
  }

  openMenu() {
    if (this.settings != undefined) {
      this.openMenuElement = !this.openMenuElement;
      let appMenu = document.querySelectorAll('app-menu').forEach(el => {
        (el as HTMLBodyElement).style.display = this.openMenuElement == true ? 'none' : 'block';
        this.menuIcon = this.openMenuElement == true ? 'menu' : 'close';
        this.openMenuTooltip = this.openMenuElement == true ? FormTitles[this.settings['language']].tooltipOpenMenu : FormTitles[this.settings['language']].tooltipCloseMenu;
      });
    }
    else {

    }
  }

  ngAfterContentInit() {


  }
  ngAfterViewInit(){

  }
}
