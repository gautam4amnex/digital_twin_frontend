import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as glob from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private  baseUrl1 =  glob.environment.baseUrl;  
  headers = new HttpHeaders().set('Content-Type','application/json');
  constructor(private http:HttpClient) { }


  logindata(user:object) : Observable<object>  
  {   
      
      let url = this.baseUrl1 + "weblogin";  
      return this.http.post(url, JSON.stringify(user),{headers: this.headers});  
      
  }

  public getCaptcha(form_data){
    const headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.get(this.baseUrl1 + "getcaptcha");
  }

  
  public verifyCaptcha(form_data){
    const headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(this.baseUrl1 + "verify_captcha" , JSON.stringify(form_data),{headers: this.headers});
  }
  
}
