import { 
  Component, 
  OnInit, 
  Input, 
  ViewChild, 
  OnDestroy, 
  Inject, 
  OnChanges, 
  ElementRef, 
  AfterViewInit, 
  ViewContainerRef, 
  TemplateRef, 
  Output, 
  EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OtherTitles } from 'src/app/classes-const/Titles';
import { FormTitles } from 'src/app/classes-const/menuFormTitles';
import { GetSetDataService } from 'src/app/services/getSetData/get-set-data.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { isDevMode } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { pairwise } from 'rxjs/operators';
import { DeleteDataService } from 'src/app/services/deleteData/delete-data.service';
import { ConfirmData, DialogConfirm } from '../../dialogs/dialog-confirm/dialog-confirm.component';
import { Alert } from 'src/app/classes-const/alerts';
import { Dialog } from '../../dialogs/dialog/dialog.component';
import { InfoTooltip } from '../../../classes-const/info';
import { ButtonsName } from '../../../classes-const/buttons';



@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  constructor(
    private fb: FormBuilder, 
    private getSetData: GetSetDataService, 
    private ng2Img: Ng2ImgMaxService,
    private dialog: MatDialog,
    private deleteData: DeleteDataService) {

  }
  @Input() settings;
  @Input() editingPageId;
  @Input() pageSettings;
  @Input() data;
  @Input() createdGallery;
  @Output('dataFromParent') dataFromParent: EventEmitter<any> = new EventEmitter();
  @ViewChild('imgUploadFile') imgUploadFile;
  @ViewChild('galleryFormDomElement') galleryFormDomElement: ElementRef;
  galleryNameTitle: string = '';
  uploadImgTitle: string = '';
  savedImgTitle: string = '';
  errorImgSubmitTitle: boolean = false;
  imgSpinner: boolean = false;
  imgTypeForView: string = '';
  imgSrcForView: string = '';
  saveGalleryButtonTitle: string = '';
  savedImageTitle: string = '';
  errorSubmit: boolean = false;
  resizedFile;
  imageFormTitle: string = '';
  // settingsUnsubscribe;
  imgClickedId;
  fullScreenImgTooltip: string = '';
  editImgTooltip: string = '';
  deleteImgTooltip: string = '';
  editSrcPreview: string = '';
  independentFieldTitle: string = '';
  independentFieldTooltip: string = '';
  infoImgSize: string = '';
  selectedImgToEdit: string = '';
  deleteButtonDisabled: boolean = true;
  sendFormDisabled: boolean = true;
  deleteGalleryButton: string = '';
  resolutions = [
    {name:'','resolution':'640 x 480'},
    {name:'','resolution':'800 x 600'},
    {name:'','resolution':'960 x 720'},
    {name:' - HD','resolution':'1280 x 720'},
    {name:' - FHD','resolution':'1920 x 1080'},
    {name:' - QHD','resolution':'2560 x 1440'}
    // {name:'4K','resolution':'3840 x 2160'},
    // {name:'8K','resolution':'7680 x 4320'},
  ];




  pageData;

  galleryForm = this.fb.group({
    galleryId: [''],
    pageId: [''],
    galleryName: [''],
    imageTitle: [''],
    imgResolution:[this.resolutions.filter(res => res['resolution'] == '1280 x 720')[0]['resolution']],
    imgUpload: ['', Validators.required]
  });

  ngOnInit(): void {
    // this.queryByPageSettings();
    this.queryByPageSettingsIfChange();
    this.configuration(this.data);
    this.configurationIfLanguageChange();
  }
  queryByPageSettings() {
    let dataToDb = {
      pageId: this.editingPageId,
      pageSettings: this.pageSettings
    }
    debugger
    this.getSetData.getDataByPage(dataToDb).subscribe(data => {
      debugger
      //check if several galleries
      //where gallery is saving, gallery id is saving on variable FormData
      //but, if we need to create gallery, still no have id, so, can recive id from last list of data
      let currentGalleryId = this.galleryForm.get('galleryId').value != "" && Object.keys(data['gallery']).indexOf(this.galleryForm.get('galleryId').value) > -1 ? this.galleryForm.get('galleryId').value : +Object.keys(data['gallery'])[Object.keys(data['gallery']).length - 1];
      if(data['gallery'] != undefined){
        if(Object.entries(data['gallery']).length > 1){
          this.configuration(data['gallery'][+currentGalleryId]);
        }
        else{
          this.configuration(data['gallery'][Object.keys(data['gallery'])]);
        }
      }
      //when last gallery was deleted
      else if(Object.entries(data).length == 0){
        this.configuration(undefined);
      }
      
    });
}
  queryByPageSettingsIfChange() {
    this.getSetData.pageSettings.subscribe(pageSettings => {
      if (pageSettings.length > 0) {
        // let dataToDb = {
        //   pageId: this.editingPageId,
        //   pageSettings: pageSettings
        // }
        // this.getSetData.getDataByPage(dataToDb).subscribe(data => {
          this.configuration(this.pageData);
        // });
      }
    });
  }

  configuration(data) {
    this.galleryForm.get('pageId').setValue(this.editingPageId);
    this.galleryNameTitle = FormTitles[this.settings['language']].galleryTitle;
    this.uploadImgTitle = FormTitles[this.settings['language']].uploadImg;
    this.saveGalleryButtonTitle = OtherTitles[this.settings['language']].saveButton;
    this.imageFormTitle = FormTitles[this.settings['language']].titleInputAddMenu;
    this.fullScreenImgTooltip = OtherTitles[this.settings['language']].imageFullScreen;
    this.editImgTooltip = OtherTitles[this.settings['language']].editImg;
    this.deleteImgTooltip = OtherTitles[this.settings['language']].delete;
    this.independentFieldTitle = FormTitles[this.settings['language']].independentFieldTitle;
    this.independentFieldTooltip = InfoTooltip[this.settings['language']].independedFieldInfo;
    this.infoImgSize = FormTitles[this.settings['language']].imgSizeInfoTitle;
    this.deleteGalleryButton = ButtonsName[this.settings['language']].deleteGalleryButton;
    this.fillPageByData(data);
  }
  configurationIfLanguageChange(data?) {
    this.getSetData.settings.subscribe(settings => {
      this.settings = settings;
      this.configuration(this.pageData);
    });
  }
  
  imgsUpload(img, event) {
    let fileReader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.sendFormDisabled = false;
      let imgFile = event.target.files[0];
      if (imgFile.type.includes('image')) {
        //resize img for:  1,280x720   HD, High Definition 720p resolution
        /* 
        1280 * 720 HD
        1,920x1,080  1080p  Full HD, FHD, HD, High Definition
        1,920x1,200  WUXGA  Widescreen Ultra Extended Graphics Array
        2,048x[unspecified]  2k
        3,840x2,160  UHD  4K, Ultra HD, Ultra-High Definition
        7,680x4,320  8kng
        
        */
        this.imgSpinner = true;
        let resolution = this.galleryForm.get('imgResolution').value.split(' x ');
        this.ng2Img.resizeImage(imgFile, resolution[0], resolution[1]).subscribe(resizedFile => {
          this.resizedFile = resizedFile;
          this.imgSpinner = false;
          //convert img to base-64 for preview
          fileReader.readAsDataURL(resizedFile);
          fileReader.onload = () => {
            this.galleryForm.get('imgUpload').setValue(resizedFile);
            this.imgSrcForView = fileReader.result.toString().split(',')[1];
            this.imgTypeForView = resizedFile.type;
          }
        });
      }
      else {
        this.errorImgSubmitTitle = true;
        this.savedImgTitle = FormTitles[this.settings['language']].ErrorUploadOnlyImg;
        this.imgUploadFile.nativeElement.value = '';//reset value
        setTimeout(() => {
          this.errorImgSubmitTitle = false;
          this.savedImgTitle = '';
        }, 3000);
      }
    }
    else{}
  }
  saveGallery() {
    this.sendFormDisabled = true;
    const img: FormData = new FormData();
    img.append('pageId', this.editingPageId);
    if(this.createdGallery){
      img.append('ifAddedGallery','yes');//if gallery was created
    }
    else{
      img.append('ifAddedGallery','no');
    }
    //if saving gallery have image
    if(this.resizedFile != undefined){
      let file;
      if(this.resizedFile == 'do not to be updated'){
        img.append('name', this.selectedImgToEdit);
        img.append('imgfile', '');
      }
      else{
        file = new File([this.resizedFile], new Date().getTime() + this.resizedFile.name, { type: this.resizedFile.type, lastModified: Date.now() });
        img.append('name', file.name);
        img.append('imgfile', file);
        //if file need to be updated
        if(this.selectedImgToEdit != ''){
          img.append('changingImgPath', this.selectedImgToEdit);
        }
        else{
          img.append('changingImgPath', '');
        }
      }
      img.append('galleryName', this.galleryForm.get('galleryName').value);
      img.append('imgTitle', this.galleryForm.get('imageTitle').value);
      img.append('galleryId',this.galleryForm.get('galleryId').value);
      this.galleryForm.get('imgUpload').setValue(img);

    }
    //saving gallery have no image
    else{
      let galleryName = this.galleryForm.get('galleryName').value;
      //save only gallery name
      if(galleryName != ''){
        img.append('galleryName', galleryName);
        img.append('name', '');
        img.append('imgTitle', '');
        img.append('imgfile', '');
      }
      //change image
      else{

      }
    }
    this.getSetData.saveGallery(img).subscribe(result => {
      if (result.includes('SUCCESS') || result.includes('successfully')) {
        this.savedImageTitle = JSON.parse(result)[this.settings['language']];
        //reset form data
        img.append('name', '');
        img.append('galleryName', '');
        img.append('pageId', '');
        img.append('imgfile', '');
        img.append('changingImgPath', '');
        this.resetForm();
        // this.galleryForm.get('galleryId').setValue(+img.get('galleryId'));
        //this.queryByPageSettings();
        setTimeout(()=>{
          this.dataFromParent.emit();
        },1000);
        // setTimeout(() => {
        //   this.savedImageTitle = '';
        // }, 3000);
      }
      else {
        this.errorSubmit = true;
        this.savedImageTitle = JSON.parse(result)[this.settings['language']];
        setTimeout(() => {
          this.savedImageTitle = '';
          this.errorSubmit = false;
        }, 3000);
      }
    });
  }
  resetForm(){
    this.imgSrcForView = '';
    this.imgTypeForView = '';
    this.selectedImgToEdit = '';
    this.resizedFile = undefined;
    this.editSrcPreview = '';
    this.imgUploadFile.nativeElement.value = '';
    this.galleryForm.get('imageTitle').setValue('');
  }
  //create img path depending on mode(development or not)
  modePath(path:string){
    let localPath = 'http://localhost:8080' + path;
    let hostPath = '..' + path;
    return isDevMode() == true ? localPath : hostPath;
  }
  imgClicked(img){
   this.imgClickedId =  this.imgClickedId == img['id'] ? -1 : img['id'];
  }
  editImage(gallery){
    this.sendFormDisabled = false;
    this.imgClickedId = -1;//do not hide cover image
    let imgPath = this.modePath(gallery['img_path']);
    this.editSrcPreview = imgPath;
    this.galleryForm.get('imageTitle').setValue(gallery['img_title']);
    this.selectedImgToEdit = gallery['img_path'];
    this.resizedFile = 'do not to be updated';
  }
  imgFullScreen(gallery){
    let path = this.modePath(gallery['img_path']);
    this.dialog.open(ImgModal,{
      maxWidth: '100%',
      data: {
        imgPath: path, 
        title: gallery['img_title'], 
        closeTooltip: OtherTitles[this.settings['language']].close, 
        direction: this.settings['direction']
      }
    });         
  }
  deleteImg(gallery){
    this.dialog.open(DialogConfirm,{
      width: '350px',
      data:{
        question: Alert[this.settings['language']].confirmDelete,
        settings: this.settings
      }
    }).afterClosed().subscribe(response => {
      if(response['result'] == 'yes'){
        this.deleteData.deleteImageGallery(gallery).subscribe(result => {
          if(result.includes('SUCCESS')){
            this.queryByPageSettings();
            this.openDialog(Alert[this.settings['language']].alertDelete);
          }
          else if(result.includes("ERROR")){
            this.openDialog(Alert[this.settings['language']].alertError);
          }
          else if(result.includes('LAST IMAGE')){
            this.dialog.open(DialogConfirm,{
              width: '350px',
              data:{
                question: Alert[this.settings['language']].lastImage,
                settings: this.settings
              }
            }).afterClosed().subscribe(response => {
              if(response['result'] == "yes"){
                this.deleteCurrentGalleryWithNoConfirm();
              }
            });
          }
        });
      }
    });
  }
  ngOnChanges(){
    this.galleryForm.get('galleryName').valueChanges.pipe(pairwise()).subscribe(([prev, next]) => {
      //disable save gallery button if data of gallery name was not changed
      if(prev != next && Object.keys(this.pageData).length > 0){
        this.sendFormDisabled = false;
      }
    });
  }
  fillPageByData(data){
    if(Object.keys(data).length > 0){
      this.deleteButtonDisabled = false;
      let galleryName = data[+Object.keys(data)[0]]['galleryName'];
      let galleryId = data[+Object.keys(data)[0]]['galleryId'];
      this.pageData = data;
      this.galleryForm.get('galleryId').setValue(galleryId);
      this.galleryForm.get('galleryName').setValue(galleryName);

    }
    //data is empty
    else{
      this.deleteButtonDisabled = true;
      this.galleryForm.get('galleryId').setValue('');
      this.pageData = [];
    }
  }
  deleteCurrentGallery(){
    this.dialog.open(DialogConfirm,{
      width: '350px',
      data:{
        question: Alert[this.settings['language']].confirmDelete,
        settings: this.settings
      }
    }).afterClosed().subscribe(response => {
      if(response['result'] == 'yes'){
        let currentGalleryId = this.galleryForm.get('galleryId').value;
        this.getSetData.deleteGallery(currentGalleryId).subscribe(result => {
          if(result.includes('SUCCES')){
            this.openDialog(Alert[this.settings['language']].alertDelete);
            this.galleryForm.get('galleryName').setValue('');
            this.resetForm();
            this.sendFormDisabled = true;
           this.dataFromParent.emit();
          //  this.queryByPageSettings();

          }
          else{
            this.openDialog(Alert[this.settings['language']].alertError);
          }
        });
    
      }
    })
  }
  deleteCurrentGalleryWithNoConfirm(){
    let currentGalleryId = this.galleryForm.get('galleryId').value;
    this.getSetData.deleteGallery(currentGalleryId).subscribe(result => {
      if(result.includes('SUCCES')){
    
        this.openDialog(Alert[this.settings['language']].alertDelete);
        this.galleryForm.get('galleryName').setValue('');
        this.resetForm();
        this.sendFormDisabled = true;
        //this.queryByPageSettings();
        this.dataFromParent.emit();
      }
      else{
        this.openDialog(Alert[this.settings['language']].alertError);
      }
    });

    }
  
  openDialog(message: string){
    this.dialog.open(Dialog,{
      width: '450px',
      data: {
        text: message,
        settings: this.settings
      }
    })
  }
  ngAfterViewInit(){
    //set equal height between image upload form to gallery block
    let formHeight = this.galleryFormDomElement.nativeElement.offsetHeight + 'px';
    document.querySelectorAll('.adminGallery').forEach(element => {
      (element as HTMLBodyElement).style.height = formHeight;
    })
  }
  ngOnDestroy() {
    
  }
}

export interface ImageModalData {
  title: string;
  imgPath: string;
  closeTooltip: string;
  direction: string;
}
@Component({
  selector: './app-img-modal',
  templateUrl: './img-modal.html'
})

export class ImgModal{
  constructor(@Inject(MAT_DIALOG_DATA) public data: ImageModalData,
              public dialogRef: MatDialogRef<ImgModal>){}

  dialogClose(){
    this.dialogRef.close();
  }
}