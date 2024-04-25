import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as glob from '../../environments/environment';
import { tap, map } from 'rxjs/operators';
import { SurveyDetail } from '../models/surveydetail';
//import { Monitoring } from '../models/monitoring.model';


const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService extends BehaviorSubject<any[]> {

  constructor(private http: HttpClient) {
    super([]);
  }
  private url = glob.environment.baseUrl;

  private data: any[] = [];

  getAccessToken() {
    return new HttpHeaders().set("Authorization",localStorage.getItem("token3"));
  }

  public read() {
    if (this.data.length) {
      return super.next(this.data);
    }

    this.fetch()
      .pipe(
        tap((data1: any) => {
          this.data = data1 ? data1 : [];
        })
      )
      .subscribe(data => {
        super.next(data);
      });
  }

  public save(data: any, isNew?: boolean) {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();

    this.fetch(action, data)
      .subscribe(() => this.read(), () => this.read());
  }

  public remove(data: any) {
    this.reset();

    this.fetch(REMOVE_ACTION, data)
      .subscribe(() => this.read(), () => this.read());
  }

  public resetItem(dataItem: any) {
    if (!dataItem) { return; }

    // find orignal data item
    const originalDataItem = this.data.find(item => item.ProductID === dataItem.ProductID);

    // revert changes
    Object.assign(originalDataItem, dataItem);

    super.next(this.data);
  }

  private reset() {
    this.data = [];
  }

  private fetch(action: string = '', data?: any) {
    let response = this.http.get(`${this.url}` + 'propertysurvey/getproperty').pipe(map((res: any) => res.data));
    return response;
  }

  private fetch1(action: string = '', data?: any) {
    // let response =  this.http.post('http://localhost:5006/api/propertysurvey/get_filter_data',{"ward_id":,"block_no":,"from_dt":f_date,"to_dt":}).pipe(map((res : any) => res.data));
    // return  response ;
  }


  public getWards() {
    let user_id = localStorage.getItem("token2");
    return this.http.post(`${this.url}` + 'dashboard/get_ward_data', { "user_id": user_id });
  }

  public getSurveyor() {
    return this.http.get(`${this.url}` + 'get_surveyor_name',{headers:this.getAccessToken()});
  }

  public getSurveyor_status() {
    return this.http.get(`${this.url}` + 'propertysurvey/getsurveyor_status');
  }

  public getMasterData() {
    return this.http.get(`${this.url}` + 'get_master_data',{headers:this.getAccessToken()});
  }

  
  public getfilterdata(ward_no, value_block, surveyor_name,surveyor_status,property_change, f_date, to_date, roleid1) {
    let user_id = localStorage.getItem("token2");
    let response = this.http.post(`${this.url}` + 'getSurveyedData',
      { "ward_id": ward_no, "block_no": value_block, "surveyor_name": surveyor_name,"survey_status" : surveyor_status ,"property_change": property_change, "from_dt": f_date, "to_dt": to_date, "role_id": roleid1, "user_id": user_id },{headers:this.getAccessToken()});
    return response;
  }

  public getFilterDataForExcelExport(ward_no, value_block, surveyor_name,surveyor_status,property_change, f_date, to_date, roleid1) {
    let user_id = localStorage.getItem("token2");
    let response = this.http.post(`${this.url}` + 'getSurveyedDataForExcelExport',
      { "ward_id": ward_no, "block_no": value_block, "surveyor_name": surveyor_name,"survey_status" : surveyor_status ,"property_change": property_change, "from_dt": f_date, "to_dt": to_date, "role_id": roleid1, "user_id": user_id },{headers:this.getAccessToken()});
    return response;
  }

  public getviewpropertydata(survey_id) {

    let response = this.http.post(`${this.url}` + 'get_view_details_data', { "property_id": survey_id },{headers:this.getAccessToken()});
    return response;
  }

  public deletepropertydata(survey_id) {
    let response = this.http.post(`${this.url}` + 'delete_property_data', { "property_id": survey_id },{headers:this.getAccessToken()});
    return response;
  }


  public getupdateDatabystatus(survey_id, status, code, user_id) {

    let response = this.http.post(`${this.url}` + 'propertysurvey/update_status_data', { "survey_id": survey_id, "status": status, "code": code, "user_id": user_id });
    return response;
  }

  public getBlocks(ward_no) {
    return this.http.post(`${this.url}` + 'propertysurvey/get_block_data', { "ward_no": ward_no });
  }


  private serializeModels(data?: any): string {
    return data ? `&models=${JSON.stringify([data])}` : '';
  }

  public getLovsData() {
    return this.http.get(`${this.url}` + 'lovs/data');
  }

  public updatePropertyData(monimonitoringModel: SurveyDetail = null) {
    let response = this.http.post(`${this.url}` + 'web_update_property_survey_data', monimonitoringModel,{headers:this.getAccessToken()});
    return response;
  }

  public getPoiDataByBuildingId(building_id,poi_table_nmae,id){
    let response = this.http.post(`${this.url}` + 'getPoiDataByBuildingId', { "building_id": building_id, "poi_table_name": poi_table_nmae, "id": id },{headers:this.getAccessToken()});
    return response;
  }

}
