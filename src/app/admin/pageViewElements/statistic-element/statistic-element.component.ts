import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../../dialogs/dialog/dialog.component';

@Component({
  selector: 'app-statistic-element',
  templateUrl: './statistic-element.component.html',
  styleUrls: ['./statistic-element.component.css']
})
export class StatisticElementComponent implements OnInit {

  constructor(private fb: FormBuilder, private dialog: MatDialog) { }

  @Input() settings;
  //options to upload data to statistic
  UploadOptions = ['File','Manually'];
  graphTypesArr = ['one','two','three'];

  optionToUploadTemp: string = 'File';

  errorSubmit: boolean = false;
  sendFormDisabled: boolean = false;
  
  statFormGroup = this.fb.group({
    optionToUpload: ['File'],
    graphType: ['one']
  });

  dataStatForm = this.fb.group({});


  ngOnInit(): void {
  }

  radioFormChanged(event){
    //display option to upload data by selected radio
    this.optionToUploadTemp = event.value;
  }
  jsonForExample(){
    this.openDialog('{test:{}}',this.settings,'');
  }
  addDataToGraph(){
    alert("add to graph data");
  }
  saveStatisticData(){
    alert('save statistic data');
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
