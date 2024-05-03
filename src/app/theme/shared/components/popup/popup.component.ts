import { Component, inject } from '@angular/core';
import { Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonsService } from 'src/app/services/commons.service';
import { SharedModule } from '../../shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { JsonPipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { threadId } from 'worker_threads';
import { MatFormFieldModule } from "@angular/material/form-field";



@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [MatSelectModule, SharedModule, MatDialogModule, MatButtonModule,
    MatInputModule, MatIconModule, JsonPipe, MatCheckboxModule, ReactiveFormsModule , MatFormFieldModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  module_data: any = [];
  roleForm: FormGroup;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PopupComponent>,

    private service: CommonsService,
    private fb: FormBuilder) {

    console.log(this.data);
    this.roleForm = this.fb.group({
      roleId:[''],
      roleName: [''],
      roleDescription: [''],
      status: [''], // Assuming 'active' is the default value
      permissions:this.fb.group({})
    });
  }


  button=this.data.button
  // router = inject(Router);

  ngOnInit(): void {  
    this.LoadModulesInCheckBox();
    if(this.button=="edit"){
      debugger
      this.roleForm.patchValue({
        roleId: this.data.roledata.role_id,
        roleName: this.data.roledata.role_name,
        roleDescription: this.data.roledata.description,
        status:this.data.roledata.status, // Assuming 'active' is the default value
        //permissions: this.data.roledata.assign_permission,
      });
    }
    console.log(JSON.stringify(this.data.roledata));
   
    
    
  }
  

  LoadModulesInCheckBox() {
    console.log("----------------->>> "); 
    this.service.GetAllModules().subscribe(item => {
      this.module_data = item;

      // const permissionArray = this.roleForm.get('permissions') as FormArray;
      // this.module_data.forEach(module,i => {
      //   //permissionArray.push(module+i);
      //   console.log("----------------->>> " + permissionArray);
      //   //permissionArray.push(this.fb.control(module.selected || false)); // Default to false if 'selected' is not provided
      // });


  })
  
}

  closepopup() {
  this.dialogRef.close('Closed using function');
  }
  onchange(event:any){
    let selectedValue=event.target.value;
    const checked=event.target.checked;
    const checkedArray=this.roleForm.get('permission') as FormArray;

    if(checked){
      checkedArray.push(new FormControl(selectedValue));
    }
    else{
      let i:number=0;
      checkedArray.controls.forEach(item => {
        if(item.value==selectedValue){
          checkedArray.removeAt(i)
        }
        i++
      });
    }

  }


  
onSubmit(){

  if (this.button=="edit") {
    console.log(this.roleForm.value);
    if (this.data.roledata) {
      this.service
        .updateRole(this.data.roledata)
        .subscribe({
          next: (val: any) => {
            this.service.openSnackBar('Employee detail updated!');
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
    } else {
      this.service.SaveRole(this.data.roledata).subscribe({
        next: (val: any) => {
          this.service.openSnackBar('Role added added successfully');
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
        },
      });
    }
  }}



  }
