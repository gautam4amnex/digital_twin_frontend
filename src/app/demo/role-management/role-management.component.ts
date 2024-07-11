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
import { ToastrService } from 'ngx-toastr';

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

@Component({
  selector: 'app-surveydetail',
  standalone: true,
  imports: [
    SharedModule,
    GridModule,
    ExcelModule,
    PDFModule,
    DialogModule,
    LabelModule,
    DropDownsModule,
    DateInputsModule,
    TreeViewModule,
    MatTooltipModule
  ],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
})
export default class RoleManagementComponent implements OnInit {

  public modules: any;
  public featureData: any[] = [];
  public editDataItem: SurveyDetail;
  public isNew: boolean;
  public surveyID: any;
  public surveyRecordDetails: any;
  public view: Observable<GridModule>;
  private editService: MonitoringService;
  public monitoringExcelExportData: any[] = [];
  modulesArray: any[] = []; // Array to store roles
  isLoading: boolean = true;
  webPermissionsArray: FormArray;
  roleForm: FormGroup;
  public btnName: any;
  public btnSubmit: any;
  public editData: any;
  public formdata: any;
  isAdd: boolean = false;

  public editDialog: any = false;
  editRoleId: any;


  constructor(private commonService: CommonsService, private fb: FormBuilder, private toastr: ToastrService) { }

  public grid_fields = [
    { 'fields': 'role_id', 'title': 'Role Id', 'hide': true },
    { 'fields': 'role_name', 'title': 'Role Name', 'hide': false },
    { 'fields': 'description', 'title': 'Description', 'hide': false },
    { 'fields': 'status', 'title': 'status', 'hide': false },
    { 'fields': 'assign_permission', 'title': 'Assigned Module', 'hide': false },
  ];

  ngOnInit() {
   
    this.loadGridData();
    this.loadModules();
  }

  loadGridData() 
  { const jsondata={"flag": "fetch"}
    this.commonService.getAllRoles().subscribe((data: any) => {
      this.isLoading = true;
      // Set loading to true before API call
      if (data) {
        this.featureData = data.data;
        this.isLoading = false; // Set loading to true before API call
       
        console.log('feature data',this.featureData)
      

      } else {
        console.error("Error fetching roles:", data.responseMessage);
        this.isLoading = false; // Set loading to false if error occurs
        
        this.toastr.error('Error fetching roles');
      }
    }, (error) => {
      console.error("API Error:", error);
      this.toastr.error('Something went wrong while fetching roles.');
    });
  }
  loadModules(){
    this.commonService.getAllModulesname().subscribe((data: any) => {
      this.modulesArray = data.map(permission => ({
        module_id: permission.module_id,
        module_name: permission.module_name
      }));
      console.log(this.modulesArray);
      this.initializeForm();
    });
  }
 
  initializeForm() {
    this.roleForm = new FormGroup({
      role_id: new FormControl('', [Validators.required]),
      role_name: new FormControl('', [Validators.required]),
      role_desc: new FormControl('', [Validators.required]),
      status: new FormControl('false'),
      web_permissions: this.fb.array([])

    });
    // , this.atLeastOneCheckedValidator
    // atLeastOneCheckedValidator(formArr: FormArray) {
    //   const atLeastOneChecked = formArr.controls.some(control => control.get('checked').value);
    //   return atLeastOneChecked ? null : { atLeastOneChecked: true };
    // }
    // Dynamically create form controls for web_permissions
    const webPermissionsArray = this.roleForm.get('web_permissions') as FormArray;
    console.log(this.modulesArray)
    this.modulesArray.forEach(module => {
      const moduleFormGroup = this.fb.group({
        module_id: module.module_id,
        module_name: module.module_name,
        checked: false, });
      webPermissionsArray.push(moduleFormGroup);
    });

    // Subscribe to value changes
    this.roleForm.valueChanges.subscribe(values => {
      // Log the form values in the desired format
      console.log(values);
    });
  }

  // Getter
  get role_id() {
    return this.roleForm.get('role_id');
  }
  get role_name() {
    return this.roleForm.get('role_name');
  }
  get role_desc() {
    return this.roleForm.get('role_desc');
  }
  get status() {
    return this.roleForm.get('status');
  }
  get web_permissions() {
    return this.roleForm.get('web_permissions');
  }

  public openEditDialog(btn:any, roleId:any) {

    console.log(this.roleForm.value, roleId, btn);
    if (btn === 'add') {
      this.isAdd = true; // Set flag to true for add mode
      this.initializeForm(); // Call to initialize the form
      this.btnName = "Add New Role";
      this.btnSubmit = "ADD";
      this.initializeForm();
    } else {
      this.isAdd = false; // Set flag to false for edit mode
      this.btnName = "Edit Role";
      this.btnSubmit = "UPDATE";
    
      this.editRoleId=roleId;
      this.commonService.getRoleDataById({"role_id": roleId}).subscribe((data: any) => {
        if (data) {
          this.editData = data.data[0];
          console.log(' this.editData', this.editData);

          const selectedModules = this.editData.assign_permission
          ;
          console.log("Fetched edit data:", selectedModules);
          this.roleForm.patchValue({
            role_id: roleId,
            role_name: this.editData.role_name,
            role_desc: this.editData.description,
            status: this.editData.status,
            
          })
          const webPermissionsArray = this.roleForm.get('web_permissions') as FormArray;

          // Clear existing checkboxes
          while (webPermissionsArray.length !== 0) {
            webPermissionsArray.removeAt(0);
          }
      
          // Populate checkboxes for all available modules
          this.modulesArray.forEach(module => {
            const checked = selectedModules.some(selectedModule => selectedModule.module_id === module.module_id);
            const moduleFormGroup = this.fb.group({
              module_id: module.module_id,
              module_name: module.module_name,
              checked: checked // Set to true if it should be checked
            });
            webPermissionsArray.push(moduleFormGroup);
          });
      
          // Patch values to dynamic checkboxes
          selectedModules.forEach(module => {
            const moduleIndex = webPermissionsArray.controls.findIndex(control =>
              control.get('module_id').value === module.module_id
            );
            if (moduleIndex !== -1) {
              webPermissionsArray.controls[moduleIndex].patchValue({
                checked: true
              });
            }
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

  onSubmit() {
    const formValue = this.roleForm.value;
    const checkedModules = formValue.web_permissions.filter((module: any) => module.checked);
    
    // Extract module_id and module_name from checkedModules
    const checkedModulesData = checkedModules.map((module: any) => {
      return {
        module_id: module.module_id,
       
      };
    });
  
    // Create the JSON structure
    const jsonData = {
     
      role_id:formValue.role_id,
      role_name: formValue.role_name,
      role_desc: formValue.role_desc,
      status: formValue.status,
      web_permissions: checkedModulesData
    };
  
    // Log or use the JSON data as required
    console.log('JSON Data:', jsonData);
  
      if (this.isAdd) {
      //  jsonData['flag']='insert';
        delete jsonData.role_id;
        this.commonService.roleCrudManagement(jsonData).subscribe((data: any) => {
          if (data) {
            console.log('useraddapi',data);
            this.loadGridData(); // Reload data after adding user
            this.toastr.success("user added successfully");
            this.editDialog = false;
          } else {
            this.toastr.error('Something Happened Wrong.');
          }
        });
  
      } else {

        let formdata={
          role_id:this.editRoleId,
          role_name: formValue.role_name,
          role_desc: formValue.role_desc,
          status: formValue.status,
          web_permissions: checkedModulesData

        }
        // jsonData['flag']='update';
        this.commonService.roleCrudManagement(formdata).subscribe((data: any) => {
          if (data) {
            console.log('userupdateapi',data);
            this.loadGridData(); // Reload data after adding user
            this.toastr.success("user updated successfully");
            this.editDialog = false;
          } else {
            this.toastr.error('Something Happened Wrong.');
          }
        });
      }
  }
 

   
    
 

  delete(id: any) {
    const jsondata={"role_id": id}
    this.commonService.deleteRole(jsondata).subscribe((data: any) => {
      if (data.responseCode === 200) {
        this.toastr.success("user deleted successfully");
        this.loadGridData();
      } else {
        console.error("Error :", data.responseMessage);
        this.toastr.error('Error in deleting data');
      }
    }, (error) => {
      console.error("API Error:", error);
      this.toastr.error('Something went wrong while fetching user data.');
    });
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
  atLeastOneCheckedValidator(): Validators {
    return (control: FormArray) => {
      const checkedCount = control.controls.filter(control => control.get('checked').value).length;
      return checkedCount > 0 ? null : { required: true };
    };
  }

}
// console.log(this.roleForm.value);
// const formValue = this.roleForm.value;
// const checkedModules = formValue.web_permissions.filter((module: any) => module.checked);

// // Extract module_id and module_name from checkedModules
// const checkedModulesData = checkedModules.map((module: any) => {
//   return {
//     module_id: module.module_id,
//     module_name: module.module_name
//   };
// });

// // Create the JSON structure
// const jsonData = {
//   role_name: formValue.role_name,
//   role_desc: formValue.role_desc,
//   status: formValue.status,
//   webPermissions: checkedModulesData
// };

// // Log or use the JSON data as required
// console.log('JSON Data:', jsonData);
