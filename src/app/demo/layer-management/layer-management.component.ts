import { Component } from '@angular/core';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { CommonsService } from 'src/app/services/commons.service';
import { WorkbookSheet, ExcelExportData } from '@progress/kendo-angular-excel-export';
import { State, process } from '@progress/kendo-data-query';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layer-management',
  standalone: true,
  imports: [GridModule, ExcelModule, PDFModule,DialogModule, LabelModule, DropDownsModule,  DateInputsModule, TreeViewModule , CommonModule ,FormsModule , ReactiveFormsModule],
  templateUrl: './layer-management.component.html',
  styleUrl: './layer-management.component.scss'
})
export class LayerManagementComponent {

  grid_data: any =  null;
  layerDetailDialog =  false;
  update_id: any = null;
  flag_form: any = "insert";
  reactiveForm = new FormGroup({
    layer_name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
    table_name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
    layer_id: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
    layer_type: new FormControl('', [Validators.required]),
    parent_layer: new FormControl('', [Validators.required]),
    service_url: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1000)]),
    geometry_type: new FormControl('', [Validators.required]),
    scale_start: new FormControl('', [Validators.required]),
    scale_end: new FormControl('', [Validators.required]),
    status: new FormControl(),
    z_index: new FormControl(),
    wms: new FormControl(),
    info_click: new FormControl(),
    first_time: new FormControl()
  });
  
  constructor(private commonService: CommonsService , private toastr: ToastrService) {
    
  }


  public grid_fields = [
    { 'fields': 'id',                 'title': 'Id',              'hide': false },
    { 'fields': 'layer_name',         'title': 'Layer Name',      'hide': false },
    { 'fields': 'table_name',         'title': 'Table Name',      'hide': false },
    { 'fields': 'layer_id',           'title': 'Layer Id',        'hide': false },
    { 'fields': 'layer_type',         'title': 'Layer Type',      'hide': false },
    { 'fields': 'parent_layer',       'title': 'Parent Type',     'hide': false },
    { 'fields': 'service_url',        'title': 'Service URL',     'hide': false },
    { 'fields': 'geometry_type',      'title': 'Geometry Type',   'hide': false },
    { 'fields': 'scale_start',        'title': 'Scale Start',     'hide': false },
    { 'fields': 'scale_end',          'title': 'Scale End',       'hide': false },
    { 'fields': 'wms',                'title': 'WMS',             'hide': false },
    { 'fields': 'status',             'title': 'Status',          'hide': false },
    { 'fields': 'is_info_click',      'title': 'Info Click',      'hide': false },
    { 'fields': 'z_index',            'title': 'Z-Index',         'hide': false },
    { 'fields': 'is_first_time_load', 'title': 'First Time Load', 'hide': false }
  ]


  ngOnInit() {
    
    this.initializeGrid();
  
  }

  initializeGrid(){
    this.grid_data = null;

    let reqBody = {"flag" : "fetch"};
    this.commonService.crudLayerManagement(reqBody).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.grid_data = data.data;
      } else{
        alert(data.responseMessage);
      }
    }, (error) => {
      alert('Something Happend Wrong.');
    });
  }

  closeLayerDetailDialog(){
    this.reactiveForm.reset();
    this.layerDetailDialog = false;
  }

  openEditDialog(dataitem){
    
    if(dataitem != ""){
      this.flag_form = "update";
      this.layerDetailDialog = true;
      this.update_id = dataitem.id;
      this.reactiveForm.controls.layer_name.setValue(dataitem.layer_name)
      this.reactiveForm.controls.table_name.setValue(dataitem.table_name)
      this.reactiveForm.controls.layer_id.setValue(dataitem.layer_id)
      this.reactiveForm.controls.layer_type.setValue(dataitem.layer_type)
      this.reactiveForm.controls.parent_layer.setValue(dataitem.parent_layer)
      this.reactiveForm.controls.service_url.setValue(dataitem.service_url)
      this.reactiveForm.controls.geometry_type.setValue(dataitem.geometry_type)
      this.reactiveForm.controls.scale_start.setValue(dataitem.scale_start)
      this.reactiveForm.controls.scale_end.setValue(dataitem.scale_end)
      this.reactiveForm.controls.status.setValue(dataitem.status)
      this.reactiveForm.controls.z_index.setValue(dataitem.z_index)
      this.reactiveForm.controls.wms.setValue(dataitem.wms)
      this.reactiveForm.controls.info_click.setValue(dataitem.is_info_click)
      this.reactiveForm.controls.first_time.setValue(dataitem.is_first_time_load)

    }
    else{
      this.flag_form = "insert";
      this.layerDetailDialog = true;
    }

  }

  deletLayer(dataitem){


     var form_data = {
        flag : "delete", 
        id: dataitem.id
      }

    this.commonService.crudLayerManagement(form_data).subscribe((data: any) => {
      console.log(data);
      if(data.responseCode == 200){
        this.toastr.success('Layer Data Delete Success');
      }
      else{
        this.toastr.error('Please Enter Captcha');
      }
      this.initializeGrid();
      this.layerDetailDialog = false;
      this.update_id = null;
    });

  }


  public validate(flag): void {
    if (this.reactiveForm.invalid) {
      for (const control of Object.keys(this.reactiveForm.controls)) {
        this.reactiveForm.controls[control].markAsTouched();
      }
      return;
    }
    else {

      var wmsElement = <HTMLInputElement>document.getElementById("wms");
      var statusElement = <HTMLInputElement>document.getElementById("status");
      var info_clickElement = <HTMLInputElement>document.getElementById("info_click");
      var first_timeElement = <HTMLInputElement>document.getElementById("first_time");
      var form_data;
      if(flag == "update"){
       form_data = {
          id: this.update_id,
          flag: "update",
          layer_name: this.reactiveForm.controls.layer_name.value,
          table_name: this.reactiveForm.controls.table_name.value,
          layer_id: this.reactiveForm.controls.layer_id.value,
          layer_type: this.reactiveForm.controls.layer_type.value,
          parent_layer: this.reactiveForm.controls.parent_layer.value,
          service_url: this.reactiveForm.controls.service_url.value,
          geometry_type: this.reactiveForm.controls.geometry_type.value,
          scale_start: this.reactiveForm.controls.scale_start.value,
          scale_end: this.reactiveForm.controls.scale_end.value,
          wms: wmsElement.checked,
          status: statusElement.checked,
          is_info_click: info_clickElement.checked,
          z_index: this.reactiveForm.controls.z_index.value,
          is_first_time_load: first_timeElement.checked
        }
      }

      if(flag == "insert"){

        form_data = {        
          flag: "insert",
          layer_name: this.reactiveForm.controls.layer_name.value,
          table_name: this.reactiveForm.controls.table_name.value,
          layer_id: this.reactiveForm.controls.layer_id.value,
          layer_type: this.reactiveForm.controls.layer_type.value,
          parent_layer: this.reactiveForm.controls.parent_layer.value,
          service_url: this.reactiveForm.controls.service_url.value,
          geometry_type: this.reactiveForm.controls.geometry_type.value,
          scale_start: this.reactiveForm.controls.scale_start.value,
          scale_end: this.reactiveForm.controls.scale_end.value,
          wms: wmsElement.checked,
          status: statusElement.checked,
          is_info_click: info_clickElement.checked,
          z_index: this.reactiveForm.controls.z_index.value,
          is_first_time_load: first_timeElement.checked
        }

      }     


      this.commonService.crudLayerManagement(form_data).subscribe((data: any) => {
        console.log(data);
        if(data.responseCode == 200){
          this.toastr.success('Success');
        }
        else{
          this.toastr.error('Something went wrong');
        }
        this.initializeGrid();
        this.layerDetailDialog = false;
        this.update_id = null;
      });
    }
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
