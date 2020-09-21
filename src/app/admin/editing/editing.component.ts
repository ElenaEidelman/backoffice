import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { LanguageService } from 'src/app/services/languages/languages.service';
import { FormTitles } from '../../classes-const/menuFormTitles';
import { OtherTitles } from '../../classes-const/Titles';
// import { EditingSettings } from '../../classes-const/editingSettings';
import { GetSetDataService } from 'src/app/services/getSetData/get-set-data.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { GlobalSettings } from 'src/app/classes-const/globalSettings';

@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.css']
})
export class EditingComponent implements OnInit, OnDestroy {

  constructor(
    private activatedRoute: ActivatedRoute, 
    private languageService: LanguageService,
    private getSetData: GetSetDataService,
    private fb: FormBuilder) {

   }
  editingSettingsTooltip: string = '';
  editorPlaceholder: string = '';
  id:any;
  idUnsubscribe;

  pageSettingsArr = [];
  viewPageElemets = [];
  viewPageElementsUnsubscribe;
  settingForm = this.fb.group({});
  settingFormView: boolean = true;
  settingsDrawerPosition: string = '';
  saveSettingsTitleButton: string = '';
  settings: GlobalSettings;
  allPageSettingView: boolean = false;
  savedTitle: string = '';
  errorSubmit: boolean = false;

  ngOnInit(): void {
    this.idUnsubscribe = this.activatedRoute.params.subscribe(prm => {
      this.id = prm['id'];
      this.getLanguage();
      this.getLanguageIfChange();
    });
  }
  getLanguage(){
      this.getSetData.getSettings().subscribe(settings => {
        this.settings = settings as GlobalSettings;
        this.fillPageSettings(settings['language']);
        this.configuration(settings as GlobalSettings);
      });
  }
  configuration(settings: GlobalSettings){
    this.settingsDrawerPosition = settings['direction'] == 'ltr' ? 'start' : 'end';    
    this.editorPlaceholder = OtherTitles[settings['language']].editorPlaceholder;
    this.editingSettingsTooltip = OtherTitles[settings['language']].editingSettingTooltip;
    this.saveSettingsTitleButton = OtherTitles[settings['language']].saveButton;

    document.querySelectorAll('form.pageEditingSettingsForm').forEach(el => {
      (el as HTMLBodyElement).style.textAlign = settings['direction'] == 'rtl' ? 'right' : 'left';
      (el as HTMLBodyElement).style.direction = settings['direction'];
    });
  }
  getLanguageIfChange(){
    this.getSetData.settings.subscribe(settings => {
      this.settings = settings;
      this.configuration(settings);
      this.fillPageSettings(settings['language']);
    });
  }
  changeEditor(event: EditorChangeContent | EditorChangeSelection){
    console.log(event['editor']['root']['innerHTML']);
  }
  fillPageSettings(lng){
   this.getSetData.getSettingsforEditingPage(this.id).subscribe(settings => {
        this.settingForm = this.fb.group({});
        this.viewPageElemets = [];
        this.pageSettingsArr = [];
        settings[lng].forEach(element => {
        if(element.checked == 'true'){
          this.viewPageElemets.push(element.elementName);
        }
        let controlVal = element.checked == 'false' ? false : true;
        this.settingForm.addControl(element['elementName'], new FormControl(controlVal));
        this.pageSettingsArr.push(element);
      });
      this.getSetData.fillPageSettings(this.viewPageElemets);
    });
  }
  settingOptionsChange(event, value){
    let checkedElement = this.pageSettingsArr.find(el => el['elementName'] == value.elementName);
    checkedElement.checked = event.checked;
    let elementIndex = this.pageSettingsArr.findIndex(el => el['elementName'] == value.elementName);
    this.pageSettingsArr[elementIndex] = checkedElement;
    this.settingForm.get(value['elementName']).setValue(event.checked);
    //fill view page elements array
    let elementOfPageExist =  this.viewPageElemets.indexOf(value.elementName);
    if(event.checked){
     
     if(elementOfPageExist == -1){
      this.viewPageElemets.push(value.elementName)
     }
    }
    else{
      delete this.viewPageElemets[elementOfPageExist];
    }
  }

  savePageViewSettings(){
    let uploadObj = {
      pageId: this.id,
      settingsViewPage: this.settingForm.value
    }
   this.getSetData.setSettingsOfEditingPage(uploadObj).subscribe(result => {
     if(result.includes('SUCCESS')){
       this.savedTitle = OtherTitles[this.settings['language']].savedSuccesfully;
       setTimeout(()=>{
        this.savedTitle = '';
       },3000);
     }
     else{
      this.savedTitle = OtherTitles[this.settings['language']].savedWithError;
      this.errorSubmit = !this.errorSubmit;
      setTimeout(()=>{
        this.savedTitle = '';
        this.errorSubmit = !this.errorSubmit;
      },3000);
     }
   });
  }
  resetForm(){
    this.settingFormView = false;
    setTimeout(()=>{
      this.settingForm.reset();
      this.settingFormView = true;
    },0);
  }
  ngOnDestroy(){
    this.idUnsubscribe.unsubscribe();
  }

}
