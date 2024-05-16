import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as glob from '../../environments/environment';
import { tap, map } from 'rxjs/operators';
import { UserModel } from '../models/user-management.model';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';


@Injectable({
  providedIn: 'root'
})
export class UserManagementService extends BehaviorSubject<any[]> {

    private url = glob.environment.baseUrl;
    private data: any[] = [];

    constructor(private http: HttpClient) {
        super([]);
    }

    getAccessToken() {
        return new HttpHeaders().set("Authorization",localStorage.getItem("token3"));
    }

    getUserDetailsService(userData : UserModel = null){
        if(!userData){
            userData = new UserModel();
            userData.flag = 'fetch';
        }
        return this.http.post(`${this.url}` + 'crud_user_management',userData);    
    }

    public getUserDetailsById(id) {
        //let user_id = localStorage.getItem("token2");
        return this.http.get(`${this.url}` + 'getUserDetailsById/'+id);
    }


//   public read() {
//       if (this.data.length) {
//           return super.next(this.data);
//       }

//       this.fetch().pipe(tap(data => {this.data = data;}))
//           .subscribe(data => {
//               super.next(data);
//           });
//   }

    
//   public save(data: any, isNew?: boolean) {
//       const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

//       this.reset();

//       this.fetch(action, data)
//           .subscribe(() => this.read(), () => this.read());
//   }

//   public remove(data: any) {
//       this.reset();

//       this.fetch(REMOVE_ACTION, data)
//           .subscribe(() => this.read(), () => this.read());
//   }

//   public resetItem(dataItem: any) {
//       if (!dataItem) { return; }

//       // find orignal data item
//       const originalDataItem = this.data.find(item => item.ProductID === dataItem.ProductID);

//       // revert changes
//       Object.assign(originalDataItem, dataItem);

//       super.next(this.data);
//   }

//   private reset() {
//       this.data = [];
//   }

//   private serializeModels(data?: any): string {
//       return data ? `&models=${JSON.stringify([data])}` : '';
//   }

  

}
