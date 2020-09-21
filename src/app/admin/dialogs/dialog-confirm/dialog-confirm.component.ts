import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetSetDataService } from 'src/app/services/getSetData/get-set-data.service';
import { GlobalSettings } from 'src/app/classes-const/globalSettings';
import { Alert } from 'src/app/classes-const/alerts';
import { FormTitles } from '../../../classes-const/menuFormTitles'
import { OtherTitles } from 'src/app/classes-const/Titles';

export interface ConfirmData{
  question: string;
  settings: GlobalSettings;
}
@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirm implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmData,
              public dialogRef: MatDialogRef<DialogConfirm>) { }

  yesButtonName = Alert;
  noButtonName = Alert; 
  formTitle = OtherTitles;

  ngOnInit(){
  }

  yes(){
    this.dialogRef.close({result: 'yes'}); 
  }
  no(){
    this.dialogRef.close({result: 'no'});
  }
  close(){
    this.dialogRef.close();
  }
}
