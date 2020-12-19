import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alert } from 'src/app/classes-const/alerts';
import { OtherTitles } from 'src/app/classes-const/Titles';

export interface DialogData{
  text: string;
  settings: string;
  closeTooltip: string;
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class Dialog {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              public dialogRef: MatDialogRef<Dialog>) { }

  yesButtonName = Alert;
  formTitle = OtherTitles;
  close(){
    this.dialogRef.close();
  }
}
