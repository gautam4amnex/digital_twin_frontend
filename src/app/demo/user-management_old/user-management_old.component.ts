import { Component, ViewChild, OnInit, Output, inject } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/theme/shared/password.validator';
import { ToastrService, ToastNoAnimation } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-user-management',
  templateUrl: './user-management_old.component.html',
  styleUrls: ['./user-management_old.component.scss'],
  imports: [
    SharedModule, GridModule, ExcelModule, PDFModule, DialogModule, LabelModule, DropDownsModule, DateInputsModule, TreeViewModule, MatTooltipModule
  ]
})
export class UserManagementComponent implements OnInit {
  isLoading: boolean = true; // Initialize as true to show loader by default
  // emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  userForm: FormGroup;
  roles: any[] = []; // Array to store roles
  public editDialog: any = false;
  public btnName: any;
  public btnSubmit: any;
  public editData: any;
  public formdata: any;
  isAdd: boolean = false; // Added flag for controlling add mode
  passwordHandler: any = false;

  constructor(private commonService: CommonsService, private fb: FormBuilder, private toastr: ToastrService) { }

  initializeForm() {
    this.userForm = new FormGroup({
      user_id: new FormControl('',),
      user_name: new FormControl('', [Validators.required]),
      role_id: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      contact_no: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")]),
      email_id: new FormControl(  { value: '', disabled: true }),
      status: new FormControl('false', [Validators.required]),
    }, { validators: confirmPasswordValidator });

  }
  // validateContactNumber(control: FormControl) {
  //   const contactNumber = control.value;
  //   const isValid = /^\d{10}$/.test(contactNumber); // Validate 10-digit number
  //   return isValid ? null : { invalidContactNumber: true };
  // }

  userData: any
  ngOnInit(): void {

    this.initializeForm();
    this.loadRoles();
    this.loadData();
  }

  public grid_fields = [
    { 'fields': 'user_id', 'title': 'User Id', 'hide':true },
    { 'fields': 'role_id', 'title': 'role Id', 'hide': true },
    { 'fields': 'user_name', 'title': 'User Name', 'hide': false },
    { 'fields': 'role_name', 'title': 'Role Name', 'hide': false },
    { 'fields': 'contact_no', 'title': 'contact no', 'hide': false },
    { 'fields': 'email_id', 'title': 'Email Id', 'hide': false },
    { 'fields': 'status', 'title': ' status', 'hide': false },
  ];

  loadData() {
    debugger
    this.commonService.userCrudManagement({ "flag": "fetch" }).subscribe((data: any) => {
      console.log("load user data",data)
      this.isLoading = true;
      if (data.responseCode === 200) {
        this.userData = data.data;
        this.isLoading = false;
      }
    }, (error) => {
      this.isLoading = false; // Set loading to false if error occurs
      this.toastr.error('Something Happened Wrong.');
    });
  }

  loadRoles() {
    debugger
    const jsonData={"flag":"fetch"}
    this.commonService.get_all_role().subscribe((data: any) => {
      console.log("load roles",data)
      if (data.responseCode === 200) {
        this.roles = data.data;
      } else {
        console.error("Error fetching roles:", data.responseMessage);
        this.toastr.error('Error fetching roles');
      }
    }, (error) => {
      console.error("API Error:", error);
      this.toastr.error('Something went wrong while fetching roles.');
    });
  }

  public openEditDialog(btn: string, userId?: any) {
    console.log(this.userForm.value);
    if (btn === 'add') {
      this.isAdd = true; // Set flag to true for add mode
      this.initializeForm(); // Call to initialize the form
      this.btnName = "Add New User";
      this.btnSubmit = "ADD"
      this.initializeForm;
    } else {
      this.isAdd = false; // Set flag to false for edit mode
      this.btnName = "Edit User";
      this.btnSubmit = "UPDATE"
      this.formdata = { "flag": "fetch_id", "user_id": userId };

      this.commonService.userCrudManagement( { "flag": "fetch_id", "user_id": userId }).subscribe((data: any) => {
        console.log("get user by id",data)
        if (data) {
          this.editData = data.data[0];
          console.log("Fetched edit data:", this.editData);
          this.userForm.patchValue({
            user_id: this.editData.user_id,
            user_name: this.editData.user_name,
            contact_no: this.editData.contact_no,
            email_id: this.editData.email_id,
            status: this.editData.status,
            role_id: this.editData.role_id,
            role_name: this.editData.role_name

          });
        } else {
          console.error("Error fetching user data:", data.responseMessage);
          this.toastr.error('Error fetching user data');
        }
      }, (error) => {
        console.error("API Error:", error);
        this.toastr.error('Something went wrong while fetching user data.');
      });
    }
    this.editDialog = true;
  }
  public closeEditDialog() {
    this.editDialog = false;
  }

  exportExcel(component1) {
    Promise.all([component1.workbookOptions()]).then((workbooks) => {
      workbooks[0].sheets.forEach((sheet: WorkbookSheet, index: number) => {
        if (index == 0) {
          sheet.name = `Feature Data`;
        }
      });
      component1.save(workbooks[0]);
    });
  }

  delete(id: any) {
    this.commonService.userCrudManagement({ "flag": "delete", "user_id": id }).subscribe((data: any) => {
      console.log("data delete id",data,id)
      if (data.responseCode === 200) {

        this.toastr.success("user deleted");
        this.loadData();
      } else {
        console.error("Error :", data.responseMessage);
        this.toastr.error('Error in deleting data');
      }
    }, (error) => {
      console.error("API Error:", error);
      this.toastr.error('Something went wrong while fetching user data.');
    });
  }
  onSubmit(mode: any) {

  

    if (mode == "ADD") {

      if(this.userForm.invalid && this.userForm.controls['password'].value != this.userForm.controls['confirmPassword'].value){
        this.passwordHandler = true;
        const controls = this.userForm.controls;
        Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
        return;
      }
      this.userForm.value['flag'] = 'create';
      delete this.userForm.value["user_id"];
      this.commonService.userCrudManagement(this.userForm.value).subscribe((data: any) => {
        console.log("adding user data",this.userForm.value,data)
        if (data.responseCode === 200) {
          this.loadData(); // Reload data after adding user
          this.toastr.success("user added");
          this.editDialog = false;
        }
        else {
          this.toastr.error('Something Happened Wrong.');
        }
      });
    }
    else {
      if(this.userForm.controls['user_name'] &&this.userForm.controls['role_id'] &&this.userForm.controls['contact_no'] &&this.userForm.controls['email_id'] &&this.userForm.controls['status']){
        this.userForm.value['flag'] = 'update';
        this.commonService.userCrudManagement(this.userForm.value).subscribe((data: any) => {
           console.log("load user data",data)
          if (data.responseCode === 200) {
            this.loadData(); // Reload data after adding user
            this.toastr.success("user updated");
            this.editDialog = false;
          }
          else {
            this.toastr.error('Something Happened Wrong.');
          }
        });
      }
    
    }
    this.passwordHandler = false;
    console.log('submit data', this.userForm.value);
  }
  
}