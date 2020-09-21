import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeleteDataService {

  constructor( private http: HttpClient) { }
  baseUrl =  'http://localhost:8080/apiBackoffice';
  deleteImageGallery(imgData: any){
    return this.http.post(`${this.baseUrl}/deleteData/deleteImgFromGallery.php`,imgData,{responseType:'text'}).pipe(
      map(result => {
        return result;

      })
    );
  }
}
