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
  
  get_verify_feature_data(jsonData){
    return this.http.post(`${this.url}` + 'get_verify_feature_data', { jsonData }, {headers:this.getAccessToken()});
  }

  get_verify_feature_data_by_id(jsonData){
    return this.http.post(`${this.url}` + 'get_verify_feature_data_by_id', jsonData , {headers:this.getAccessToken()});
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
    return this.http.post( this.url + "get_all_layer_and_image", jsonData, { headers: this.getAccessToken() });
  }

  public getStateName(){
    return this.http.get( this.url + "get_state_name", { headers: this.getAccessToken() });
  }
  public getRoleManagementTableData() {
    return this.http.get<Role[]>("http://localhost:8090/digitaltwin/get_all_role", {headers:this.getAccessToken()});
  }
  SaveRole(data:any){
    console.log(data)
    return this.http.post("http://localhost:3000/customer",data);
  }
  updateRole(data: any): Observable<any> {
    return this.http.put(`http://localhost:3000/employees`, data);
  }
  GetRoleById(data:any){
    return this.http.post("http://localhost:8090/digitaltwin/dashboard/get_role_by_id",data);
  }
  GetAllModules(){
    return this.http.get("http://localhost:8090/digitaltwin/dashboard/get_all_modules");
  }
  openSnackBar(message: string, action: string = 'ok') {
    this._snackBar.open(message, action, {
      duration: 1000,
      verticalPosition: 'top',
    });
  }
  deleteRole(id: number){
    return this.http.delete(`http://localhost:3000/employees/${id}`);
  }

  public crudBimData(jsonData){
    return this.http.post( "http://localhost:8085/crud_bim_data", jsonData);
  }

}
