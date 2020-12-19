import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { resourceUsage } from 'process';
import { Alert } from 'src/app/classes-const/alerts';
import { ButtonsName } from 'src/app/classes-const/buttons';
import { OtherTitles } from 'src/app/classes-const/Titles';
import { GetSetDataService } from 'src/app/services/getSetData/get-set-data.service';
import { DialogConfirm } from '../../dialogs/dialog-confirm/dialog-confirm.component';
import { Dialog } from '../../dialogs/dialog/dialog.component';

@Component({
  selector: 'app-editor-element',
  templateUrl: './editor-element.component.html',
  styleUrls: ['./editor-element.component.css']
})
export class EditorElementComponent implements OnInit {

  constructor( private getDataService:GetSetDataService,
               private fb: FormBuilder,
               private dialog: MatDialog ) { }

  @Input() settings;
  @Input() editingPageId;
  @Input() pageSettings;
  @Input() data;

  //call to parent function
  @Output('dataFromParent') dataFromParent: EventEmitter<any> = new EventEmitter();

  deleteButtonDisabled: boolean = true;
  deleteEditorButtonName: string = '';
  saveEditorButtonTitle: string = "";
  sendFormDisabled: boolean = true;
  errorSubmit: boolean = false;
  savedEditorTitle: string = '';
  editorChangedValue = '';
  savedEditorMessage: string = '';

  editFormGroup = this.fb.group({
    editor: [''],
    pageId: [''],
    editorId: ['']
  });

  ngOnInit(): void {
    this.configuration();
    this.ifSettingsWasChanged();
    if(Object.keys(this.data).length > 0){
      this.deleteButtonDisabled = false;
      this.fillData();
    }
  }
  configuration(){
    this.saveEditorButtonTitle = OtherTitles[this.settings['language']].saveButton;
    this.deleteEditorButtonName = ButtonsName[this.settings['language']].deleteEditorButton;
    
  }
  ifSettingsWasChanged(){
    this.getDataService.settings.subscribe(result => {
      this.settings = result;
      this.configuration();
    });
  }
  fillData(){
    this.editFormGroup.get('editorId').setValue(this.data['id']);
    this.editFormGroup.get('editor').setValue(this.data['text']);
    this.editFormGroup.get('pageId').setValue(this.data['pageId']);
  }
  changeEditor(event: EditorChangeContent | EditorChangeSelection){
    let editorData = this.editFormGroup.get("editor").value;
    let editorChangedData = event['editor']['root']['innerHTML'];
    if(editorData != editorChangedData && editorChangedData){
      this.sendFormDisabled = false;
      this.editorChangedValue = editorChangedData;
    }
  }
  saveData(){
    if(this.editorChangedValue != ''){
        this.editFormGroup.get('pageId').setValue(this.editingPageId);
    }
    this.getDataService.saveEditor(this.editFormGroup.value).subscribe(result => {

        if(result.includes('SUCCESS')){
          this.editorChangedValue = '';
          this.savedEditorMessage = OtherTitles[this.settings['language']].savedSuccesfully;
          this.sendFormDisabled = true;

          //call for parent function to recive updated data
          this.dataFromParent.emit();
        }
        else{
          this.savedEditorMessage = OtherTitles[this.settings['language']].savedWithError;
          this.errorSubmit = true;
        }
        setTimeout(() => {
          this.savedEditorMessage = '';
          this.errorSubmit = false;
        }, 3000);
    });
  }
  deleteCurrentEditor(){
    //open confirm dialog
    this.dialog.open(DialogConfirm,{
      maxWidth: '100%',
      data: { 
        question: Alert[this.settings['language']].confirmDelete, 
        settings: this.settings
      }
    }).afterClosed().subscribe(result => {
      //when the modal close with yes/ no button
        if(result['result'] == 'yes'){
          this.getDataService.deleteEditor(this.data['id']).subscribe(result => {
            if(result.toString().includes('SUCCESS')){
              this.openDialog(Alert[this.settings['language']].alertDelete, this.settings, OtherTitles[this.settings['language']].close);
              this.dataFromParent.emit();
            }
            if(result.toString().includes('ERROR')){
              this.openDialog(Alert[this.settings['language']].alertError, this.settings, OtherTitles[this.settings['language']].close);
            }
          });
      }
    });
  }

  openDialog(text,settings,tooltip){
    this.dialog.open(Dialog,{
      maxWidth: '100%',
      data: {
        text: text,
        settings: settings,
        closeTooltip: tooltip
      }
    });
  }
}
