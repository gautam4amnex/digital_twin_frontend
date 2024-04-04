import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as glob from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private  baseUrl1 =  glob.environment.baseUrl;  
  constructor(private http:HttpClient) { }


  logindata(user:object) : Observable<object>  
  {   
      const headers = new HttpHeaders().set('Content-Type','application/json');
      let url = this.baseUrl1 + "weblogin";  
      return this.http.post(url, JSON.stringify(user),{headers:headers});  
      
  }
  
}
