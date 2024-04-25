import { Component } from '@angular/core';
import {  inject } from '@angular/core';
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
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [MatSelectModule, SharedModule, MatDialogModule, MatButtonModule,
    MatInputModule, MatIconModule, JsonPipe, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './edit-popup.component.html',
  styleUrl: './edit-popup.component.scss'
})
export class EditPopupComponent {
  roleForm: FormGroup;
role_id:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<EditPopupComponent>,
    
    private route: ActivatedRoute,
    private service: CommonsService,
    private fb: FormBuilder) { };
  router = inject(Router);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.role_id = +params.get('id'); // Convert to number
    this.service.GetRoleById(this.role_id).subscribe((result:any)=>{
      this.roleForm.patchValue(result);
    })
    }
    );

    this.roleForm = this.fb.group({
      roleName: [''],
      roleDescription: [''],
      status: ['active'], // Assuming 'active' is the default value
      permissions: this.fb.array([])
    });


  }

 
  

  

  // setpopupdata(code: any) {
  //   this.service.GetRoleById(code).subscribe(item => {
  //     this.editdata = item;
  //     this.roleForm.setValue({
  //       role: this.editdata.role, description: this.editdata.description, permissions: this.editdata.permissions,
  //       status: this.editdata.status
  //     })
  //   });
  // }

  closepopup() {
    this.ref.close('Closed using function');
  }

  onupdate() {
  
  }
  
}
