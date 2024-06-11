import { Component, ViewEncapsulation, Renderer2, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ViewChild, OnInit } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
import { ElementRef } from '@angular/core';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { WorkbookSheet, ExcelExportData } from '@progress/kendo-angular-excel-export';
// kendo
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
//openlayer
import 'ol/style';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import View from 'ol/View.js';
import { data } from 'jquery';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Style, Icon, Fill, Stroke } from 'ol/style';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorSource from 'ol/source/Vector';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import CircleStyle from 'ol/style/Circle';
import { style } from '@angular/animations';



@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    NgIf, MatTabsModule,ReactiveFormsModule, DateInputsModule, MatDatepickerModule, MatFormFieldModule, SharedModule, GridModule, ExcelModule, PDFModule, DialogModule, LabelModule, DropDownsModule, DateInputsModule, TreeViewModule, MatTooltipModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent  implements OnInit, AfterViewChecked  {
  min: Date;
  viewDialog: boolean=false;
  @ViewChild('mapElement') mapElement: ElementRef;
  renderer: any;
  element: string | HTMLElement;
  announcementData: any;
  announcementForm: FormGroup;
  editDialog: any = false;
  btnName: any;
  btnSubmit: any;
  editData: any;
  roles:any[];
  currentRoleId:any;
  userStatus:any=false;
  isDialogInitialized: boolean = false;
  ol: any = window['ol'];
  state = "closed";
  osm: any;
  map: any;
  view: any;
  point:Point;
  place:any=[];
  lat: any;
  long: any;
  
  constructor(private cdRef: ChangeDetectorRef,renderer: Renderer2, private commonService: CommonsService, private fb: FormBuilder, private toastr: ToastrService, private elementRef: ElementRef<HTMLElement>) {
  }
 
  ngOnInit() {
    this.currentRoleId = localStorage.getItem('role_id');
    console.log('currentRoleId', this.currentRoleId);
    const currentDay = new Date();
    this.min = currentDay;
    if (this.currentRoleId === "1") {
      this.userStatus = true;
    } else {
      this.userStatus = false;
    }
    this.loadData();
    this.initializeForm();
    this.loadRoles();

  }
  mapInitialized: boolean = false;

  ngAfterViewChecked() {
    if (this.viewDialog && this.mapElement && this.mapElement.nativeElement) {
     this.element = this.mapElement.nativeElement;
      console.log('Map element:', this.element);
      this.initializeMap();
   
    }
  }

  public grid_fields = [
    { 'fields': 'role_id',                    'title': 'Role id', 'hide': false },
    { 'fields': 'role_name',                  'title': 'Role', 'hide': false },
    { 'fields': 'announcement_title',         'title': 'Announcement title', 'hide': false },
    { 'fields': 'announcement_description',   'title': 'Description', 'hide': false },
    { 'fields': 'announcement_datetime',      'title': 'Announcement Date', 'hide': false },
    { 'fields': 'address',                    'title': 'Address', 'hide': false },
    { 'fields': 'latitude',                   'title': 'Latitude', 'hide': false },
    { 'fields': 'longitude',                  'title': 'Longitude', 'hide': false },

  ];
  
  initializeForm() {
    this.announcementForm = new FormGroup({
      role_id:                  new FormControl('',Validators.required),
      announcement_id:          new FormControl(''),
      announcement_title:       new FormControl('',Validators.required),
      announcement_description: new FormControl('',Validators.required),
      announcement_datetime:    new FormControl(null,Validators.required),
      address:                  new FormControl('',Validators.required),
      latitude:                 new FormControl('',Validators.required),
      longitude:                new FormControl('',Validators.required),
    
    });
  }

  loadData() {
   let formdata;
    if(this.userStatus){
       formdata={ "flag": "fetch"}
    }
    else{
      formdata={ "flag": "fetch_by_roleid","role_id":this.currentRoleId}
    }
    this.commonService.announcementManagement(formdata).subscribe((data: any) => {
      console.log("load announcementt data", data)
      if (data.responseCode === 200) {
        this.announcementData = data.data;
        let date = this.parseDate(this.announcementData.announcement_datetime);
        this.announcementData.announcement_datetime = date;
        console.log('announcementt data', this.announcementData);
      }
    }, (error) => {

      this.toastr.error('Cant fetch data');
    });
  }
  loadRoles() {
   
    this.commonService. get_all_role().subscribe((data: any) => {
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
  parseDate(dateString: string): Date {
    return new Date(dateString);
  } 

  initializeMap() {
    if (this.viewDialog && this.mapElement?.nativeElement && !this.mapInitialized) {
      const element: HTMLElement = this.mapElement.nativeElement;

      const pointStyle = new this.ol.style.Style({
        image: new this.ol.style.Icon({
            anchor: [0.5, 1],
            src: 'https://apagri.infinium.management/temp/point_icon.png',
        })
    });

      const myFeature = new Feature({
        geometry: new Point(fromLonLat([this.long, this.lat])),

        // style: new Style({
        //   image: new CircleStyle({
        //     radius: 10,
        //     fill: new Fill({ color: 'red' }),
        //     stroke: new Stroke({ color: 'red', width: 20 })
        //   })
        // })
      });
  
      myFeature.setStyle(pointStyle);

      this.map = new Map({
        target: element,
        layers: [
          new TileLayer({ source: new OSM() }),
          new VectorLayer({
            source: new VectorSource({ features: [myFeature] })
          })
        ],
        view: new View({
          projection: 'EPSG:3857', // Using Web Mercator projection for consistency with OSM tiles
          center: fromLonLat([this.long, this.lat]),
          zoom: 20
        })
      });
  
      this.mapInitialized = true;
    }
  }
  

 

 
  openEditDialog(btn: any, dataItem: any) {
    
    if (btn == 'add') {
      this.editDialog = true;
      this.initializeForm();
      this.btnName = "Add New User";
      this.btnSubmit = "ADD"
    }
    else if(btn == 'view'){
      this.viewDialog=true;
      this.lat =dataItem.latitude;
      this.long=dataItem.longitude;
      
     
    }
    else {
      this.editDialog = true;
      this.btnName = "Edit User";
      this.btnSubmit = "UPDATE"
      const formdata = { "flag": "fetch_id","announcement_id": dataItem.announcement_id  };
      console.log("get announcementt by id", formdata);
      this.commonService.announcementManagement(formdata).subscribe((data: any) => {
        console.log("get announcementt by id", data)
        if (data) {
          this.editData = data.data[0];
          console.log("Fetched edit data:", this.editData);
          this.announcementForm.patchValue({
            role_id:                  this.editData.role_id,
            role_name:                this.editData.role_name,
            announcement_id:          this.editData.announcement_id,
            announcement_title:       this.editData.announcement_title,
            announcement_description: this.editData.announcement_description,
            announcement_datetime:    this.parseDate(this.editData.announcement_datetime),
            latitude:                 this.editData.latitude,
            longitude:                this.editData.longitude,
            address:                this.editData.address

          });
        } else {
          console.error("Error fetching announcement data:", data.responseMessage);
          this.toastr.error('Error fetching announcement data');
        }
      }, (error) => {
        console.error("API Error:", error);
        this.toastr.error('Something went wrong while fetching announcement data.');
      });
    }
  }
  closeDialog() {
    this.editDialog = false;
    this.viewDialog=false;
    this.mapInitialized=false;
  }
  delete(dataItem: any) {
    this.commonService.announcementManagement({ "flag": "delete", "announcement_id": dataItem.announcement_id }).subscribe((data: any) => {
      console.log("data delete id", data, dataItem.announcement_id)
      if (data.responseCode === 200) {

        this.toastr.success("announcement deleted");
        this.loadData();
      } else {
        console.error("Error :", data.responseMessage);
        this.toastr.error('Error in deleting data');
      }
    }, (error) => {
      console.error("API Error:", error);
      this.toastr.error('Something went wrong while fetching announcement data.');
    });
  }
  onSubmit(formType: any) {
    if (this.announcementForm.invalid) {
      const controls = this.announcementForm.controls;
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      this.toastr.error('announcement cant be added');
    } else {
      if (formType == "ADD") {
        const formdata = this.announcementForm.value;
        formdata['flag'] = 'create';
        delete formdata['announcement_id'];
        console.log("form data for adding new announcement", formdata)
        this.commonService.announcementManagement(formdata).subscribe((data: any) => {
          console.log("response of addform", data)
          if (data.responseCode === 200) {
            this.loadData(); 
            this.toastr.success("announcement added successfully");
            this.editDialog = false;
          }
          else {
            this.toastr.error('announcement cant be added');
          }
        });
      }
      else {
        const formdata = this.announcementForm.value;
        formdata['flag'] = 'update';
        console.log("form data for update announcement", formdata)
        this.commonService.announcementManagement(formdata).subscribe((data: any) => {
          console.log("update form response", data)
          if (data.responseCode === 200) {
            this.loadData(); 
            this.toastr.success("announcement updated");
            this.editDialog = false;
          }
          else {
            this.toastr.error('announcement cant be updated.');
          }
        });
      }
 
    }
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


}
