import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Menu } from '../../classes-const/menuClass';


@Injectable({
  providedIn: 'root'
})
export class GetSetDataService {

  constructor(private http: HttpClient) { }
  baseUrl =  'http://localhost:8080/apiBackoffice';

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
}
