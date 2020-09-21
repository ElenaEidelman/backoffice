import { Injectable, EventEmitter, DebugNode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalSettings } from 'src/app/classes-const/globalSettings';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GetSetDataService } from '../getSetData/get-set-data.service';


@Injectable({
  providedIn: 'root'
})
export class LanguageService implements Resolve<any> {


  globalSettings: GlobalSettings; // not to be subscribed

  baseUrl = 'http://localhost:8080/apiBackoffice';
  constructor(private http: HttpClient, private getSetDataService: GetSetDataService) {
    
  }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ){
    return this.http.get(`${this.baseUrl}/getData/getSettings.php`).pipe(
      map(settings => {
        this.globalSettings = settings as GlobalSettings;
        this.getSetDataService.emitGlobalsettings(settings as GlobalSettings);
        return settings;
      })
    );
  } 
}
