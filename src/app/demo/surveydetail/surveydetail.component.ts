// angular import
import { Component, OnInit, Inject, ElementRef, NgModule } from '@angular/core';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { CommonsService } from 'src/app/services/commons.service';
import { WorkbookSheet, ExcelExportData } from '@progress/kendo-angular-excel-export';
import { SurveyDetail } from 'src/app/models/surveydetail';
import { Observable } from 'rxjs';

// kendo
import { State, process } from '@progress/kendo-data-query';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { MonitoringService } from 'src/app/services/monitoring.service';
import { Router } from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-surveydetail',
  standalone: true,
  imports: [SharedModule,GridModule, ExcelModule, PDFModule, DialogModule, LabelModule,DropDownsModule,DateInputsModule,TreeViewModule,MatTooltipModule, CommonModule],
  templateUrl: './surveydetail.component.html',
  styleUrls: ['./surveydetail.component.scss'],
})
export default class SurveyDetailComponent implements OnInit {

  public featureData: any[] = [];
  public editDataItem: SurveyDetail;
  public isNew: boolean;
  public surveyID: any;
  public surveyRecordDetails: any;
  public view: Observable<GridModule>;
  private editService: MonitoringService;
  public monitoringExcelExportData: any[] = [];
  
  public editDialog:any = false;
  SurveyDetailsForm: FormGroup;


  constructor(private commonService: CommonsService) {
    
  }

  public grid_fields = [
    {'fields': 'id', 'title': 'Id' , 'hide': true },
    {'fields': 'layer_name', 'title': 'Layer Name' , 'hide': false },
    {'fields': 'location_status', 'title': 'Location Status' , 'hide': false },
    {'fields': 'ward_no', 'title': 'Ward No' , 'hide': false },
    {'fields': 'status', 'title': 'Status' , 'hide': false },
    {'fields': 'location_name', 'title': 'Location Name' , 'hide': false },
    {'fields': 'comment', 'title': 'Comment' , 'hide': false }
  ]

  ngOnInit() {
    
    this.featureData = [];
    let reqBody = {"attribute_status":[],"end_date":"","layer_name":"","location_status":[],"start_date":"","status":[],"ward_no":""};
    // this.commonService.get_verify_feature_data(reqBody).subscribe((data: any) => {
    //   if (data.responseCode === 200) {
    //     this.featureData = data.data;
    //   } else{
    //     alert(data.responseMessage);
    //   }
    // }, (error) => {
    //   alert('Something Happend Wrong.');
    // });

    this.initializeSurveyDetails();

  }

  exportExcel(component1){
    Promise.all([component1.workbookOptions()]).then((workbooks) => {
      workbooks[0].sheets.forEach((sheet: WorkbookSheet, index: number) => {
        if (index == 0) {
          sheet.name = `Feature Data`;
        } 
      });
      component1.save(workbooks[0]);
    });
  }

  initializeSurveyDetails(){
    this.SurveyDetailsForm = new FormGroup({
      layer_name : new FormControl(),
      location_status : new FormControl(),
      ward_no : new FormControl(),
      status : new FormControl(),
      location_name : new FormControl(),
      comment : new FormControl(),
      chkbox : new FormControl(true)
    })
  }

  public openEditDialog(dataitem) {
    this.getfeatureSurveyDetails(dataitem.id);
    this.editDialog = true;
  }

  public closeEditDialog() {
    this.editDialog = false;
  }


  getfeatureSurveyDetails(_id){
    let req = { "id" : _id };
    this.commonService.get_verify_feature_data_by_id(req).subscribe((res: any) => {
      if (res.responseCode === 200) {
        this.SurveyDetailsForm.patchValue({
          layer_name : res.data[0].layer_name,
          location_status : res.data[0].location_status,
          ward_no : res.data[0].ward_no,
          status : res.data[0].status,
          location_name : res.data[0].location_name,
          comment : res.data[0].comment,
        })
      } else{
        alert(res.responseMessage);
      }
    }, (error) => {
      alert('Something Happend Wrong.');
    });
  }


  onsubmit(){
    this.SurveyDetailsForm.value;
    
  }

}
