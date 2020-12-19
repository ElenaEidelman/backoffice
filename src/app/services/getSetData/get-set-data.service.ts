import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Menu } from '../../classes-const/menuClass';
import { GlobalSettings } from 'src/app/classes-const/globalSettings';



@Injectable({
  providedIn: 'root'
})
export class GetSetDataService {

  constructor(private http: HttpClient) { }
  baseUrl =  'http://localhost:8080/apiBackoffice';
  settings = new EventEmitter<GlobalSettings>();
  settingsG = new GlobalSettings();
  languageSettings;
  pageSettings = new EventEmitter<any>();

  getSettings() {
    return this.http.get(`${this.baseUrl}/getData/getSettings.php`).pipe(
      map(settings => {
        this.settings.emit(settings as GlobalSettings);
        this.settingsG = settings as GlobalSettings;
        return settings;
      })
    );
  }
  saveMenu(menu: Menu){
     return this.http.post(`${this.baseUrl}/addSave/addMenu.php`, menu, {responseType: 'text'}).pipe(
       map(result => {
         return result;
       })
       
     );
  }
  getMenu(){
    return this.http.get(`${this.baseUrl}/getData/getMenu.php`).pipe(
      map(menu => {
        return menu as Menu[];
      })
    );
  }
  getSettingsforEditingPage(pageId){
    return this.http.post(`${this.baseUrl}/getData/getEditingPageSettings.php`,pageId, {responseType: 'json'}).pipe(
      map(settingList => {
        return settingList;
      })
    );
  }
  setSettingsOfEditingPage(pageSettings){
    return this.http.post(`${this.baseUrl}/addSave/savePageSettings.php`,pageSettings,{responseType: 'text'}).pipe(
      map(result => {
        return result;
      })
    );
  }
  getLanguagesSettings(){
    return this.http.get(`${this.baseUrl}/getData/getLanguagesSettings.php`).pipe(
      map(settings => {
        this.languageSettings = settings as GlobalSettings;
        return settings;
      })
    );
  }
  saveGlobalSettings(settings: GlobalSettings){
    return this.http.post(`${this.baseUrl}/addSave/saveGlobalSettings.php`, settings, {responseType : 'text'}).pipe(
      map(response => {
        return response;
      })
    );
  }

  emitGlobalsettings(settings: GlobalSettings){
    this.settings.emit(settings);
  }

  saveGallery(data){
    return this.http.post(`${this.baseUrl}/addSave/saveGallery.php`,data,{responseType: 'text'}).pipe(
      map(result => {
        
        return result;
      })
    );
  }
  getDataByPage(pageSetting: any){
    return this.http.post(`${this.baseUrl}/getData/getDataPage.php`, pageSetting).pipe(
      map(result => {
        return result;
      })
    );
  }
  fillPageSettings(settings: any){
    this.pageSettings.emit(settings);
  }
  deleteGallery(galleryId: number){
    return this.http.post(`${this.baseUrl}/deleteData/deleteGallery.php`,galleryId, {responseType: 'text'}).pipe(
      map(result => {
        return result;
      })
    );
  }
  saveEditor(data: any){
    return this.http.post(`${this.baseUrl}/addSave/addEditor.php`,data, {responseType: "text"}).pipe(
      map((result: any) => {
        return result;
      })
    );
  }
  deleteEditor(id: number){
    debugger
    return this.http.post(`${this.baseUrl}/deleteData/deleteEditor.php`, id, {responseType:'text'}).pipe(
      map(result => {
        return result;
      })
    );
  }
}
