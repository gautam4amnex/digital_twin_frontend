import { Component, ViewChild, OnInit } from '@angular/core';
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
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
 

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
result:any;
  tableData: Role[] = [];
  displayedColumns: string[] = ["role_id", "role_name", "description", "assign_permission", "status", "action"];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: CommonsService,public dialog: MatDialog) {}
  
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

  add() {
    // const dialogRef = this.dialog.open(formComponent);
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
    // Implement add functionality
  }

  edit(id) {
    // Implement edit functionality
  }

  delete(id) {
    // Implement delete functionality
  }

  filterChange(event:any) {
    this.dataSource.filter = event.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
