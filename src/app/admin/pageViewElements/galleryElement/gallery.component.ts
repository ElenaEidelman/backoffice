import { Component, OnInit, Input, ViewChild, OnDestroy, Inject, OnChanges } from '@angular/core';
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
import { ScrollDispatcher } from '@angular/cdk/overlay';



@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy, OnChanges {

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
  @ViewChild('imgUploadFile') imgUploadFile;
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
  infoImgSize: string = '';
  selectedImgToEdit: string = '';
  //galleryNameChanged: boolean = false;
  sendFormDisabled: boolean = true;
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
    pageId: [''],
    galleryName: [''],
    imageTitle: [''],
    imgResolution:[this.resolutions.filter(res => res['resolution'] == '1280 x 720')[0]['resolution']],
    imgUpload: ['', Validators.required]
  });

  ngOnInit(): void {
    this.queryByPageSettings();
    this.queryByPageSettingsIfChange();
    this.configurationIfLanguageChange();
  }
  queryByPageSettings() {
    let dataToDb = {
      pageId: this.editingPageId,
      pageSettings: this.pageSettings
    }
    this.getSetData.getDataByPage(dataToDb).subscribe(data => {
      this.configuration(data);
    });
}
  queryByPageSettingsIfChange() {
    this.getSetData.pageSettings.subscribe(pageSettings => {
      if (pageSettings.length > 0) {
        let dataToDb = {
          pageId: this.editingPageId,
          pageSettings: pageSettings
        }
        this.getSetData.getDataByPage(dataToDb).subscribe(data => {
          this.configuration(this.pageData);
        });
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
    this.infoImgSize = FormTitles[this.settings['language']].imgSizeInfoTitle;
    this.fillPageByData(data);
  }
  configurationIfLanguageChange(data?) {
    this.getSetData.settings.subscribe(settings => {
      this.settings = settings;
      this.configuration(this.pageData);
    });
  }
  
  imgsUpload(img, event) {
    debugger
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
        debugger
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
      this.galleryForm.get('imgUpload').setValue(img);

    }
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
    this.getSetData.saveImageToGallery(img).subscribe(result => {
      if (result.includes('SUCCESS') || result.includes('successfully')) {
        this.savedImageTitle = JSON.parse(result)[this.settings['language']];
        //reset form data
        img.append('name', '');
        img.append('galleryName', '');
        img.append('pageId', '');
        img.append('imgfile', '');
        img.append('changingImgPath', '');
        this.imgSrcForView = '';
        this.imgTypeForView = '';
        this.selectedImgToEdit = '';
        this.resizedFile = undefined;
        this.editSrcPreview = '';
        this.imgUploadFile.nativeElement.value = '';
        this.galleryForm.get('imageTitle').setValue('');
        this.queryByPageSettings();
        setTimeout(() => {
          this.savedImageTitle = '';
        }, 3000);
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
            this.dialog.open(Dialog,{
              width: '350px',
              data: {
                text: Alert[this.settings['language']].alertDelete,
                settings: this.settings
              }
            })
          }
          else{
            this.dialog.open(Dialog,{
              width: '450px',
              data: {
                text: Alert[this.settings['language']].alertError,
                settings: this.settings
              }
            })
          }
        });
      }
    });
  }
  ngOnChanges(){
    this.galleryForm.get('galleryName').valueChanges.pipe(pairwise()).subscribe(([prev, next]) => {
      //disable save gallery button if data of gallery name was not changed
      if(prev != next){
        this.sendFormDisabled = false;
      }
    });
  }
  fillPageByData(data){
    for(let element of Object.entries(data)){
      switch(element[0]){
        case 'gallery': let galleryName = data['gallery'].find(el => el.galleryName)['galleryName'];
                        this.galleryForm.get('galleryName').setValue(galleryName);
        case 'editor' : ;
      }
    }
    this.pageData = data;
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