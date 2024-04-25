import { Component, ViewChild, OnInit, Output, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Role } from 'src/app/models/role';
import { CommonsService } from 'src/app/services/commons.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PopupComponent } from 'src/app/theme/shared/components/popup/popup.component';
import { EditPopupComponent } from 'src/app/theme/shared/components/edit-popup/edit-popup.component';
import { Router } from '@angular/router';
import { EventEmitter } from 'ws';
 

@Component({
  standalone:true,
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
  imports: [
    
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    MatButtonModule,
    
  ]
})
export class RoleManagementComponent implements OnInit {

  tableData: Role[] = [];
  displayedColumns: string[] = ["role_id", "role_name", "description", "assign_permission", "status", "action"];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: CommonsService,
    public dialog: MatDialog,
    
   ) {

    }

  ngOnInit(): void {
    this.loadCustomer();
  }
  

  loadCustomer() {
    this.service.getRoleManagementTableData().subscribe((res:any) => {
      this.tableData = res.data;
      this.dataSource = new MatTableDataSource<Role>(this.tableData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  openAddForm(){
    const dialogRef = this.dialog.open(PopupComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadCustomer();
        }
      },
    });
  }

  openEditForm(roledata:any,button:string){
    
      const dialog = this.dialog.open(PopupComponent, {
        data:{roledata,button}});
        dialog.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadCustomer();
        }
      },
    });
  }
  add() {
    // const dialogRef = this.dialog.open(formComponent);
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
    // Implement add functionality
  }

 

  delete(id:number) {
    this.service.deleteRole(id).subscribe({
      next: (res) => {
        this.service.openSnackBar('Employee deleted!', 'done');
        this.loadCustomer();
      },
      error: console.log,
    });
  }

  filterChange(event:any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}
}