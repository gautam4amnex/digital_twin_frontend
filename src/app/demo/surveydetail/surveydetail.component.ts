// angular import
import { Component, OnInit } from '@angular/core';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { CommonsService } from 'src/app/services/commons.service';
import { WorkbookSheet } from '@progress/kendo-angular-excel-export';


@Component({
  selector: 'app-surveydetail',
  standalone: true,
  imports: [SharedModule,GridModule, ExcelModule, PDFModule, DialogModule],
  templateUrl: './surveydetail.component.html',
  styleUrls: ['./surveydetail.component.scss'],
})
export default class SurveyDetailComponent implements OnInit {

  public featureData: any[] = [];
  
  constructor(private commonService: CommonsService) {
  }

  public grid_fields = [
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
    this.commonService.get_verify_feature_data(reqBody).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.featureData = data.data;
      } else{
        alert(data.responseMessage);
      }
    }, (error) => {
      alert('Something Happend Wrong.');
    });

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

}
