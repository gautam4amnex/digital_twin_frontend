import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as glob from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonsService extends BehaviorSubject<any[]> {
  private url = glob.environment.baseUrl;

  constructor(private http: HttpClient) {
    super([]);
  }

  getAccessToken() {
    return new HttpHeaders().set("Authorization",localStorage.getItem("token3"));
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

}
