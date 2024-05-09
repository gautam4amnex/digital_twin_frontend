import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as glob from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Role } from '../models/role';
import { MatSnackBar } from '@angular/material/snack-bar';
 import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommonsService extends BehaviorSubject<any[]> {
  private url = glob.environment.baseUrl;
  private measurement_type: string;

  constructor(private http: HttpClient,
    private _snackBar: MatSnackBar) {
    super([]);
  }
  
  get_verify_feature_data(){
    return this.http.get(`${this.url}` + 'get_all_role');
  }

  get_verify_feature_data_by_id(roll_id){
    return this.http.post(`${this.url}` + `getRollDetailsById/${roll_id}`, {headers:this.getAccessToken()});
  }

  getAccessToken() {
    return new HttpHeaders().set("Authorization",localStorage.getItem("token"));
  }

  public getWards() {
    let user_id = localStorage.getItem("token2");
    return this.http.post(`${this.url}` + 'dashboard/get_ward_data', { "user_id": user_id },{headers:this.getAccessToken()});
  }

  public getPoiMasterData() {
    return this.http.get(`${this.url}` + 'get_poi_master', {headers:this.getAccessToken()});
  }

  public getFeatureInformationFromURL(URL: any) {
    let res = this.http.get(URL);
    return res;
  }

  public getPropertyDataByGISID(gisID) {

    let response = this.http.post(`${this.url}` + 'propertysurvey/get_view_details_data', { "gis_id": gisID });
    return response;
  }

  public getLayerAndImagePanel(jsonData){
    debugger;
    return this.http.post( this.url + "get_all_layer_and_image", jsonData, { headers: this.getAccessToken() });
  }

  public getStateName(){
    return this.http.get( this.url + "get_state_name", { headers: this.getAccessToken() });
  }
  public getRoleManagementTableData() {
    return this.http.get<Role[]>("http://localhost:8090/digitaltwin/get_all_role", {headers:this.getAccessToken()});
  }
 
  openSnackBar(message: string, action: string = 'ok') {
    this._snackBar.open(message, action, {
      duration: 1000,
      verticalPosition: 'top',
    });
  }

// {"flag": "fetch"} -to fetch all records
// {"flag": "fetch","user_id":28,"email_id": "qatwo@amnex.com","user_name": "qatwo","password": "$2a$10$eX9l21JQkVsO3iJg898e0u8Htezik1TPWzsea1AKuiVNP9UMpuzwe",
  //  "contact_no":"9865263529","role_id": "2","status": true}--to add new record
  
  // {"flag": "fetch_id","user_id":"39"}--to get data by id
  userCrudManagement(jsonData:any){
    return this.http.post( this.url + "crud_user_management", jsonData, { headers: this.getAccessToken() });
  }
  getAllRoles(){//fn_web_get_all_role();
    return this.http.get(`${this.url}` + 'get_all_role',{ headers: this.getAccessToken() });
  }

  roleCrudManagement(jsonData:any){//.fn_web_add_or_update_role()
    return this.http.post( this.url + "add_update_role", jsonData, { headers: this.getAccessToken() });
  }
  deleteRole(jsonData:any){//fn_web_delete_role(?)
    return this.http.post( this.url + "delete_role", jsonData, { headers: this.getAccessToken() });

  }
  getRoleDataById(roll_id:any){
    return this.http.get(`${this.url}` + `getRollDetailsById/${roll_id}`,{ headers: this.getAccessToken() });

  }
  getAllModulesname(){
    return this.http.get(`${this.url}` + 'dashboard/get_all_modules',{ headers: this.getAccessToken() });

  }

}
