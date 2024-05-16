// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MapController } from '../utils/mapController';

//
import * as Cesium from 'cesium';
import { WorkbookSheet } from '@progress/kendo-angular-excel-export';
import { UserModel } from 'src/app/models/user-management.model';
import { UserManagementService } from 'src/app/services/user-management.service';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [SharedModule,GridModule, ExcelModule, PDFModule, DialogModule, LabelModule, DropDownsModule, DateInputsModule, TreeViewModule, MatTooltipModule, ReactiveFormsModule, CommonModule, RouterOutlet],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  animations: [
    trigger('widthGrow', [
      state('closed', style({
        height: 0,
      })),
      state('open', style({
        height: 500
      })),
      transition('* => *', animate(900))
    ]),
  ]
  //providers: [MapController]
})
export default class UserManagementComponent implements OnInit {
  
  //public userData: any[] = [];
  public mapConroller: any;
  public viewer: any;
  public userData: UserModel[];
  formSubmitted = false;
  public userDetailDialog: any = false;
  

  userForm = new FormGroup({
    user_name: new FormControl('', [ Validators.required, Validators.minLength(1), Validators.maxLength(250) ]),
    email_id: new FormControl('' , [ Validators.required, Validators.minLength(1), Validators.maxLength(250) ]),
    contact_no: new FormControl('' , [ Validators.required, Validators.minLength(1), Validators.maxLength(10) ]),
    role_id: new FormControl('' , [ Validators.required]),
    status: new FormControl()
  });

  constructor(private userManagementService: UserManagementService){

  }

  ngOnInit() {
    //this.mapConroller.initMap();
    this.getUserManagement();
  }

  public grid_fields = [
    {'fields': 'user_id', 'title': 'User Id' , 'hide': true },
    {'fields': 'user_name', 'title': 'User Name' , 'hide': false },
    {'fields': 'email_id', 'title': 'Email Id' , 'hide': false },
    {'fields': 'contact_no', 'title': 'Contact No' , 'hide': false },
    {'fields': 'role_id', 'title': 'Role Id' , 'hide': true },
    {'fields': 'role_name', 'title': 'Role Name' , 'hide': false },
    {'fields': 'status', 'title': 'Status' , 'hide': false }
  ]

  //get() { return this.userForm.controls; }
  

  public getUserManagement() {
    let userModel = new UserModel();
    userModel.flag = 'fetch';
    this.userManagementService.getUserDetailsService(userModel).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.userData = data.data;
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

  public validate(): void {
    if (this.userForm.invalid) {    
      for (const control of Object.keys(this.userForm.controls)) {
        this.userForm.controls[control].markAsTouched();
      }  
      return;
    }
    else{
      //alert('Done');
      console.log('Done');
    }
  }

  public closeUserDetailDialog(){
    this.formSubmitted = false;
    this.userForm.reset();
    this.userDetailDialog = false;
  }

  public openEditDialog(flag,dataitem) {
    let userModel = new UserModel();
    if(flag == 'add'){
      this.addUserDetails(userModel);
    }else if(flag == 'edit'){
      userModel.flag = 'fetch';  
      this.userDetailDialog = true;
      this.getUserDetailsById(dataitem.user_id);
    }else{

    }

  }

  getUserDetailsById(_id){
    let req = { "id" : _id };
    this.userManagementService.getUserDetailsById(_id).subscribe((res: any) => {
      if (res.responseCode === 200) {
        this.userForm.patchValue({
          user_name: res.data[0].user_name,
          email_id: res.data[0].email_id,
          contact_no: res.data[0].contact_no,
          role_id: res.data[0].role_id,
          status: res.data[0].status
        })
      } else{
        alert(res.responseMessage);
      }
    }, (error) => {
      alert('Something Happend Wrong.');
    });
  }


  addUserDetails(userModel){
    userModel.flag = 'create';
    this.userManagementService.getUserDetailsService(userModel).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.userData = data.data;
      } else{
        alert(data.responseMessage);
      }
    }, (error) => {
      alert('Something Happend Wrong.');
    });
  }



}


