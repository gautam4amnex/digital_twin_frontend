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

  // public getLayerAndImagePanel(jsonData){
  //   return this.http.post( this.url + "get_all_layer_and_image", jsonData, { headers: this.getAccessToken() });
  // }

  public getLayerAndImagePanel(jsonData){
    return this.http.post("http://localhost:8090/digitaltwin/get_all_layer_and_image", jsonData);
  }
  public getLayerAndImagePanel3D(jsonData){
    return this.http.post("http://localhost:8090/digitaltwin/get_all_layer_and_image", jsonData);
  }

  public getStateName(){
    return this.http.get( this.url + "get_state_name", { headers: this.getAccessToken() });
  }

  // userCrudManagement(jsonData:any){
  //       return this.http.post( this.url_midc + "crud_user_management", jsonData);
  //     }

  userCrudManagement(jsonData:any){
    return this.http.post( this.url + "crud_user_management", jsonData);
    // return this.http.post( this.url_midc + "crud_user_management", jsonData);
  }

  get_all_role(){
    // return this.http.post( this.url_midc + "role_management", jsonData);
    return this.http.get( this.url + "get_all_role");

  }

  getUserBYId(roll_id:any){
    return this.http.get(`${this.url}` + `getUserDetailsById/${roll_id}`);
  }
 
  // roleCrudManagement(jsonData:any){
  //           // return this.http.post( this.url_midc + "role_management", jsonData);
  //           return this.http.post( this.url + "role_management", jsonData);

  //         }
          
  // getRoleDataById(roll_id:any){
  //   // return this.http.get(`${this.url_midc}` + `getRollDetailsById/${roll_id}`,{ headers: this.getAccessToken() });
  //   return this.http.get(`${this.url}` + `getRollDetailsById/${roll_id}`,{ headers: this.getAccessToken() });
            
  //             } 
            
    getAllRoles(){//fn_web_get_all_role();
        return this.http.get(`${this.url}` + 'get_all_role',{ headers: this.getAccessToken() });
      }
    
      roleCrudManagement(jsonData:any){//.fn_web_add_or_update_role()
        return this.http.post( this.url + "add_update_role", jsonData, { headers: this.getAccessToken() });
      }
      deleteRole(jsonData:any){//fn_web_delete_role(?)
        return this.http.post( this.url + "delete_role", jsonData, { headers: this.getAccessToken() });
    
      }
      getRoleDataById(json:any){
        return this.http.post(`http://localhost:8090/digitaltwin/dashboard/get_role_by_id`,json);
    
      }
      getAllModulesname(){
        return this.http.get(`${this.url}` + 'dashboard/get_all_modules',{ headers: this.getAccessToken() });
    
       }

  // getAllModulesname(){
  //   // return this.http.get( this.url_midc + "get_all_modules",{ headers: this.getAccessToken() });
              
  //   return this.http.get( this.url + "get_all_modules",{ headers: this.getAccessToken() });

  // }            

  public crudBimData(jsonData){
    return this.http.post(this.url_midc +  "layer/crud_cctv_location", jsonData);
  }

  public crudLayerManagement(jsonData){
    return this.http.post(this.url_midc +  "layer/layer_management", jsonData);
  }
  projectManagement(jsonData:any){
    return this.http.post( this.url + "dashboard/project_management", jsonData);
  }
 
  milestoneManagement(jsonData:any){
    return this.http.post( this.url + "dashboard/crud_milestone_image", jsonData,{headers: {contentType: 'multipart/form-data',
    responseType: 'json'}});
  }
  public getStatusList(){
    return this.http.get( this.url + "dashboard/milestone_status_list");
  }
  getfile(filename:any,foldername:any) {//jsonString={"images":"","directorypath":""}
    //Make a call to Sprinf Boot to get the Image Bytes.
    return this.http.get(this.url +`dashboard/get_files/${foldername}/${filename}`);
   
  }
  deletefile(foldername:any, filename:any){
    return this.http.delete(this.url +`dashboard/delete_files/${foldername}/${filename}`);

  }
  uploadFile(jsonData:any){
    return this.http.post(this.url +`dashboard/upload_files`,jsonData,{headers: {contentType: 'multipart/form-data',
    responseType: 'json'}});
  }
  // MODULE:Announcement
  announcementManagement(jsonData:any){
    return this.http.post( this.url + "dashboard/announcement_management", jsonData);
  }
  getRoleByUser(user:any){
    return this.http.post( this.url + "dashboard/get_role_by_userid", user);

  }
  getRoleList(){
    return this.http.get( this.url + "dashboard/get_role_list");

  }
  getLayerData(){
    return this.http.get( this.url + "dashboard/get_point_layers");
  }
  searchChildlayer(jsonData:any) {
    return this.http.post( this.url + "dashboard/search_layer",jsonData);
  }


}


