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
  private url_midc = glob.environment.baseUrl_midc;

  private measurement_type: string;

  constructor(private http: HttpClient) {
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
    return this.http.post( this.url + "get_all_layer_and_image", jsonData, { headers: this.getAccessToken() });
  }

  public getStateName(){
    return this.http.get( this.url + "get_state_name", { headers: this.getAccessToken() });
  }

  // userCrudManagement(jsonData:any){
  //       return this.http.post( this.url_midc + "crud_user_management", jsonData);
  //     }

  userCrudManagement(jsonData:any){
    return this.http.post( this.url + "crud_user_management", jsonData);
  }

  // getUserBYId(roll_id:any){
  //   return this.http.get(`${this.url_midc}` + `getUserDetailsById/${roll_id}`);
  // }

  getUserBYId(roll_id:any){
    return this.http.get(`${this.url}` + `getUserDetailsById/${roll_id}`);
  }
 
  roleCrudManagement(jsonData:any){
            return this.http.post( this.url_midc + "role_management", jsonData);
          }
  getRoleDataById(roll_id:any){
    return this.http.get(`${this.url_midc}` + `getRollDetailsById/${roll_id}`,{ headers: this.getAccessToken() });
            
              } 
            
  getAllModulesname(){
    return this.http.get( this.url_midc + "get_all_modules",{ headers: this.getAccessToken() });
              
  }            

  public crudBimData(jsonData){
    return this.http.post( "https://apagri.infinium.management/midcgis/layer/crud_cctv_location", jsonData);
  }

  public crudLayerManagement(jsonData){
    return this.http.post( "https://apagri.infinium.management/midcgis/layer/layer_management", jsonData);
  }

}
