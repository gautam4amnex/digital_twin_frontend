import { Component, ViewEncapsulation, Renderer2 } from '@angular/core';
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
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [ MatTabsModule, MatInputModule, MatDatepickerModule, MatFormFieldModule, SharedModule, GridModule, ExcelModule, PDFModule, DialogModule, LabelModule, DropDownsModule, DateInputsModule, TreeViewModule, MatTooltipModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProjectManagementComponent implements OnInit {
  projectData: any;
  projectForm: FormGroup;
  editDialog: any = false;
  btnName: any;
  btnSubmit: any;
  editData: any;
  isAdd: boolean = false; // Added flag for controlling add mode

  // --------------------------

  milestoneForm: FormGroup;
  milestoneData: any;
  editDialogMilestone: any = false;
  btnNameMilestone: any;
  btnSubmitMilestone: any;
  editDataMilestone: any;
  projectSelected: any = false;
  isAddMilestone: boolean = false;
  projects: any[] = []; // Array
  current_project_id: any;
  status_list: any[] = [];

  uploadedImages: string[] = []; // Array to hold image URLs
  imageFiles: File[] = []; // Array to hold image files
  milestoneformdata: any;
  isimgVisible=true;
  projectName: any;


  constructor(private renderer: Renderer2, private commonService: CommonsService, private fb: FormBuilder, private toastr: ToastrService, private elementRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
    this.loadALLProjects();//dropdown
    this.initializeMilestoneForm();
    // this.loadMilestoneData();
    this.loadStatusList();
 
  }


  public grid_fields = [
    { 'fields': 'project_id', 'title': 'Project Id', 'hide': true },
    { 'fields': 'project_name', 'title': 'Project Name', 'hide': false },
    { 'fields': 'location_name', 'title': 'Location Name', 'hide': false },
    { 'fields': 'contractor_name', 'title': 'Contractor Name', 'hide': false },
    { 'fields': 'contractor_number', 'title': 'Phone number', 'hide': false },
    { 'fields': 'contractor_email', 'title': 'Email', 'hide': false },
    { 'fields': 'start_date', 'title': ' Start date', 'hide': false },
    { 'fields': 'end_date', 'title': ' End date', 'hide': false },
    { 'fields': 'total_cost', 'title': ' Total cost', 'hide': false },


  ];

  public grid_fields_milestone = [
    {
      'fields': 'milestone_id', 'title': 'Milestone Id', 'hide': false
    },
    { 'fields': 'milestone_name', 'title': 'Milestone Name', 'hide': false },
    { 'fields': 'description', 'title': 'Description', 'hide': false },
    { 'fields': 'is_approved', 'title': 'Is Approved', 'hide': false },
    { 'fields': 'start_date', 'title': 'Start Date', 'hide': false },
    { 'fields': 'end_date', 'title': 'End Date', 'hide': false },
    { 'fields': 'milestone_status_name', 'title': 'Status', 'hide': false },
    { 'fields': 'remarks', 'title': 'Remarks', 'hide': false },
    { 'fields': 'image', 'title': 'Image', 'hide': false },
    { 'fields': 'document', 'title': 'Document', 'hide': false },
  ];

  loadData() {
    this.commonService.projectManagement({ "flag": "fetch" }).subscribe((data: any) => {
      console.log("load project data", data)
      if (data.responseCode === 200) {
        this.projectData = data.data;
        console.log('project data', this.projectData);
      }
    }, (error) => {

      this.toastr.error('Something Happened Wrong.');
    });
  }

  loadMilestoneData() {

    const jsonData = { "flag": "fetch", "project_id": this.current_project_id };
    const formData = new FormData();
    formData.append('jsonData', JSON.stringify(jsonData))
    this.commonService.milestoneManagement(formData).subscribe((data: any) => {
      console.log("load projects", data)
      if (data.responseCode === 200) {
        this.milestoneData = data.data;
        console.log('this.milestoneData', this.milestoneData);
      } else {
        console.error("Error fetching milestones:", data.responseMessage);
        this.toastr.error('Error fetching milestones');
      }
    }, (error) => {
      console.error("API Error:", error);
      this.toastr.error('Something went wrong while fetching data.');
    });
  }

  initializeForm() {
    this.projectForm = new FormGroup({
      project_id: new FormControl('',),
      project_name: new FormControl('', [Validators.required]),
      location_name: new FormControl('', [Validators.required]),
      contractor_name: new FormControl('', [Validators.required]),
      contractor_number: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")]),
      contractor_email: new FormControl('', [Validators.required, Validators.email]),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', [Validators.required]),
      total_cost: new FormControl('', [Validators.required]),
      milestone: new FormControl('', [Validators.required]),
    });
  }

  initializeMilestoneForm() {
    this.milestoneForm = new FormGroup({
      milestone_id: new FormControl('',),
      milestone_name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      milestone_status: new FormControl('', Validators.required),
      image: new FormControl(''),
      // document: new FormControl(''),
      remarks: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
      is_approved: new FormControl('false'),

    });
  }

  loadALLProjects() {//for dropdown
    const jsonData = { "flag": "fetch" }
    this.commonService.projectManagement(jsonData).subscribe((data: any) => {
      console.log("load projects for dropdown", data)
      if (data.responseCode === 200) {
        this.projects = data.data;

      } else {
        console.error("Error fetching projects:", data.responseMessage);
        this.toastr.error('Error fetching projects');
      }
    }, (error) => {
      console.error("API Error:", error);
      this.toastr.error('Something went wrong while fetching roles.');
    });
  }


  loadMilestoneOnChange(event) {
    this.loadALLProjects() 
    this.projectSelected = true;
    this.current_project_id = event.target.value;
    this.projectName=event.target.getAttribute("name")
    if (this.current_project_id) {
      this.loadMilestoneData()
    } else {
      this.projectSelected = false;
      this.milestoneData = "";
    }

  }

  loadStatusList() {

    this.commonService.getStatusList().subscribe((data: any) => {
      console.log("status list", data)
      if (data.responseCode === 200) {
        this.status_list = data.data;
      } else {
        console.error("Error fetching status_list:", data.responseMessage);
        this.toastr.error('Error fetching status_list');
      }
    }, (error) => {
      console.error("API Error:", error);
      this.toastr.error('Something went wrong while fetching status_list.');
    });
  }

  openEditDialog(btn: any, id: number) {
    this.editDialog = true;
    if (btn == 'add') {
      this.isAdd = true; // Set flag to true for add mode
      this.initializeForm(); // Call to initialize the form
      this.btnName = "Add New Project";
      this.btnSubmit = "ADD"


    } else {
      this.isAdd = false; // Set flag to false for edit mode
      this.btnName = "Edit Project";
      this.btnSubmit = "UPDATE"
      const formdata = { "flag": "fetch_id", "project_id": id };
      this.commonService.projectManagement(formdata).subscribe((data: any) => {
        console.log("get project by id", data)
        if (data) {
          this.editData = data.data[0];
          console.log("Fetched edit data:", this.editData);
          this.projectForm.patchValue({
            project_id: this.editData.project_id,
            project_name: this.editData.project_name,
            location_name: this.editData.location_name,
            contractor_name: this.editData.contractor_name,
            contractor_number: this.editData.contractor_number,
            contractor_email: this.editData.contractor_email,
            start_date: this.editData.start_date,
            end_date: this.editData.end_date,
            total_cost: this.editData.total_cost
          });
        } else {
          console.error("Error fetching project data:", data.responseMessage);
          this.toastr.error('Error fetching project data');
        }
      }, (error) => {
        console.error("API Error:", error);
        this.toastr.error('Something went wrong while fetching project data.');
      });
    }
  }

  openEditDialogMilestone(btn: any, id: any) {
 
    if (this.projectSelected) {

      this.editDialogMilestone = true;
      if (btn == 'add') {
        this.initializeMilestoneForm();
        // this.isAddMilestone = true; // Set flag to true for add mode

        this.btnNameMilestone = "Add New Milestone";
        this.btnSubmitMilestone = "ADD"

      } else {
        this.isAddMilestone = false; // Set flag to false for edit mode
        this.btnNameMilestone = "Edit milestone";
        this.btnSubmitMilestone = "UPDATE"
        const jsonData = { "flag": "fetch_id", "milestone_id": id };
        console.log('request edit formdata', jsonData);
        const formData = new FormData();
        formData.append('jsonData', JSON.stringify(jsonData))
        this.commonService.milestoneManagement(formData).subscribe((data: any) => {
          console.log("get milestone for edit", data)
          if (data) {
            this.editDataMilestone = data.data[0];
            console.log("Fetched edit data for milestone:", this.editData);
            this.milestoneForm.patchValue({
              milestone_id: this.editDataMilestone.milestone_id,
              milestone_name: this.editDataMilestone.milestone_name,
              description: this.editDataMilestone.description,
              milestone_status: this.editDataMilestone.milestone_status,
              milestone_status_name: this.editDataMilestone.milestone_status_name,
              image: this.editDataMilestone.image,
              start_date: this.editDataMilestone.start_date,
              end_date: this.editDataMilestone.end_date,
              is_approved: this.editDataMilestone.is_approved,
              remarks: this.editDataMilestone.remarks,
              document: this.editDataMilestone.document,
            });
            
         
            console.log(this.milestoneForm);

          } else {
            console.error("Error fetching milestone data:", data.responseMessage);
            this.toastr.error('Error fetching milestone data');
          }
        }, (error) => {
          console.error("API Error:", error);
          this.toastr.error('Something went wrong while fetching milestone data.');
        });
      }
    } else {
      this.toastr.info("select project first");
    }

  }

  closeEditDialog() {
    this.editDialogMilestone = false;
    this.editDialog = false;
    this.ImageDialog = false;
    this.documentDialog = false;
  }
  delete(id: any) {
    this.commonService.projectManagement({ "flag": "delete", "project_id": id }).subscribe((data: any) => {
      console.log("data delete id", data, id)
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
  deleteMilestone(id: any) {
    const formData = new FormData();
    const jsonData = { "flag": "delete", "milestone_id": id }
    formData.append('jsonData', JSON.stringify(jsonData))
    this.commonService.milestoneManagement(formData).subscribe((data: any) => {
      console.log("milestone delete id", data, id)
      if (data.responseCode === 200) {
        this.toastr.success("milestone deleted");
        this.loadMilestoneData();
      } else {
        console.error("Error :", data.responseMessage);
        this.toastr.error('Error in deleting data');
      }
    }, (error) => {
      console.error("API Error:", error);
      this.toastr.error('Something went wrong while fetching milestone data.');
    });
  }


  onSubmit(formType: any) {
    const formdata = this.projectForm.value;

    if (false) {
      const controls = this.projectForm.controls;
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
    } else {
      if (formType == "ADD") {
        formdata['flag'] = 'create';
        delete formdata["project_id"];
        console.log("form data for adding new project", formdata)
        this.commonService.projectManagement(formdata).subscribe((data: any) => {
          console.log("response of addform", data)
          if (data.responseCode === 200) {
            this.loadData(); 
            this.loadALLProjects()
            this.toastr.success("project added successfully");
            this.editDialog = false;
          }
          else {
            this.toastr.error('project cant be added');
          }
        });
      }
      else {
        const formdata = this.projectForm.value;
        formdata['flag'] = 'update';
        console.log("form data for update project", formdata)
        this.commonService.projectManagement(formdata).subscribe((data: any) => {
          console.log("update form response", data)
          if (data.responseCode === 200) {
            this.loadData(); // Reload data after adding user
            this.toastr.success("project updated");
            this.editDialog = false;
          }
          else {
            this.toastr.error('project cant be updated.');
          }
        });
      }
      console.log('submit data', formdata);
    }
  }
  convertToDateOnly(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  imgfilenamecomma = "";
  imgFiles: FileList;
 
  
  onImageChange(event: any) {
    this.isimgVisible = false;
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    this.renderer.setStyle(fileInput, 'color', 'grey');
    this.imgfilenamecomma = "";
    this.imgFiles = event.target.files;//images files
    if (this.imgFiles) {


      if(this.editDialogMilestone==true){
        const string=this.milestoneForm.get('image').value;
        const deleteImg=string.split(",");
        deleteImg.forEach(element => {
          this.commonService.deletefile("images", element).subscribe((result=>{
            console.log(result);
          }))
        });
     
      }
      const imgfileNames: string[] = [];
      for (let i = 0; i < this.imgFiles.length; i++) {
        const file: File = this.imgFiles[i];
        imgfileNames.push(file.name);
      }
    
      // Join the file names into a comma-separated string
      this.imgfilenamecomma = imgfileNames.join(",");//all images name in comma seperated value

    }
  }
  docfilenamecomma = "";
  docFiles: FileList;
  isdocVisible=true;
  onDocumentChange(event: any) {
    this.isdocVisible = false;

    const fileInput = document.getElementById('docInput') as HTMLInputElement;
    this.renderer.setStyle(fileInput, 'color', 'grey');
    this.docfilenamecomma = "";
    this.docFiles = event.target.files;
    if (this.docFiles) {
      if(this.editDialogMilestone==true){
        const string=this.milestoneForm.get('document').value;
        const deleteImg=string.split(",");
        deleteImg.forEach(element => {
          this.commonService.deletefile("documents", element).subscribe((result=>{
            console.log(result);
          }))
        });
        
      }
      const fileNames: string[] = [];
      for (let i = 0; i < this.docFiles.length; i++) {
        const file: File = this.docFiles[i];
        fileNames.push(file.name);
      }
      // Join the file names into a comma-separated string
      this.docfilenamecomma = fileNames.join(",");

    }
  }
  retrievedImage: any
  retrieveddoc: any;
  fetchedImages: string[] = [];
  fetchedDocuments: string[] = [];
  ImageDialog = false;
  documentDialog = false;
  
  @ViewChild('img_div') imgdiv: ElementRef;
  @ViewChild('doc_div') docdiv: ElementRef;
  fetchImageDocs(milestoneId: any, type: any) {
    if (type == 'image') {
      this.ImageDialog = true;
    }
    if (type == 'document') {
      this.documentDialog = true;

    }
    const formData = new FormData();
    const jsonData = { "flag": "fetch_id", "milestone_id": milestoneId };
    formData.append('jsonData', JSON.stringify(jsonData));
    this.commonService.milestoneManagement(formData).subscribe((data: any) => {
      console.log("response of fetchImageDocs", data);
      if (data.responseCode === 200) {
        const res = data.data[0];

        if (res.image) {
          this.fetchedImages = res.image.split(",");
          console.log(this.fetchedImages);
        
        }
        if (res.document) {
          this.fetchedDocuments = res.document.split(",");
          console.log(this.fetchedDocuments);
        
          
        } else {
          console.error('fileNamesString is undefined');
        }

      }
    });
  }
  @ViewChild('ngcarousel', { static: true }) ngCarousel!: NgbCarousel;
   // Move to specific slide
   navigateToSlide(item: any) {
    this.ngCarousel.select(item);
    console.log(item);
  }

  // Move to previous slide
  getToPrev() {
    this.ngCarousel.prev();
  }

  // Move to next slide
  goToNext() {
    this.ngCarousel.next();
  }

  // Pause slide
  stopCarousel() {
    this.ngCarousel.pause();
  }

  // Restart carousel
  restartCarousel() {
    this.ngCarousel.cycle();
  }
  slideActivate(ngbSlideEvent: NgbSlideEvent) {
    console.log(ngbSlideEvent.source);
    console.log(ngbSlideEvent.paused);
    console.log(NgbSlideEventSource.INDICATOR);
    console.log(NgbSlideEventSource.ARROW_LEFT);
    console.log(NgbSlideEventSource.ARROW_RIGHT);
  }

  getFileSrc(filename: any, filetype: any) {

    if (filetype == 'image') {

      this.commonService.getfile(filename,"images").subscribe(
        res => {
          const retrieveResonse = res;
          this.retrievedImage = 'data:image/png;base64,' + retrieveResonse;
          return this.retrievedImage;
        });
      console.log("retrieveResonse", this.retrievedImage);
    }
    if (filetype == 'document') {
      this.commonService.getfile(filename,"documents").subscribe(
        res => {
          const retrieveResponse = res;
          this.retrieveddoc = 'data:image/png;base64,' + retrieveResponse;
          console.log("retrieveResponse", this.retrieveddoc);
          return this.retrieveddoc;
        }
      );
    }

  }

 


  onSubmitMilestone(formType: any) {
    const formData = new FormData();

    this.milestoneformdata = this.milestoneForm.value;

    if (this.milestoneForm.valid) {
      const controls = this.milestoneForm.controls;
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      this.toastr.error('milestone cant be added');
    } 


      if (formType == "ADD") {
        this.milestoneformdata['flag'] = 'create';
        this.milestoneformdata['project_id'] = this.current_project_id;
        this.milestoneformdata['image'] = this.imgfilenamecomma;
        this.milestoneformdata['document'] = this.docfilenamecomma;
        delete this.milestoneformdata['milestone_id']
        const dataJsonString = JSON.stringify(this.milestoneformdata);
        console.log("dataJson", dataJsonString)

        formData.append('jsonData', dataJsonString);
        if (this.imgFiles) {
          for (let i = 0; i < this.imgFiles.length; i++) {
            formData.append('images', this.imgFiles[i], this.imgFiles[i].name);
          }
        }
        if (this.docFiles) {
          for (let j = 0; j < this.docFiles.length; j++) {
            formData.append('documents', this.docFiles[j], this.docFiles[j].name);
          }
        }

        console.log("form data for adding new milestone", formData.getAll('images'));

        this.commonService.milestoneManagement(formData).subscribe((data: any) => {
          console.log("response of addform", data)
          if (data.responseCode === 200) {
            this.loadMilestoneData(); // Reload 
            this.toastr.success("milestone added successfully");
            this.editDialogMilestone = false;
          }
          else {
            // this.toastr.error('milestone cant be added');
          }
        });
      }
      else {
        this.milestoneformdata['flag'] = 'update';
        this.milestoneformdata['project_id'] = this.current_project_id;
        this.milestoneformdata['image'] = this.imgfilenamecomma;
        this.milestoneformdata.start_date = this.convertToDateOnly(this.milestoneformdata.start_date);// Convert dates to the desired format
        this.milestoneformdata.end_date = this.convertToDateOnly(this.milestoneformdata.end_date);
        console.log("form data for update ", this.milestoneformdata)
        const dataJsonString = JSON.stringify(this.milestoneformdata);
        console.log("dataJson", dataJsonString)

        formData.append('jsonData', dataJsonString);
        if (this.imgFiles) {
          for (let i = 0; i < this.imgFiles.length; i++) {
            formData.append('images', this.imgFiles[i], this.imgFiles[i].name);
          }
        }
        if (this.docFiles) {
          for (let j = 0; j < this.docFiles.length; j++) {
            formData.append('documents', this.docFiles[j], this.docFiles[j].name);
          }
        }
        console.log("form data for adding new milestone", formData)
        this.commonService.milestoneManagement(formData).subscribe((data: any) => {
          console.log("update form response", data)
          if (data.responseCode === 200) {
            this.loadMilestoneData(); // Reload data after adding user
            this.toastr.success("milestone updated");
            this.editDialog = false;
          }
          else {
            this.toastr.error('milestone cant be updated.');
          }
        });
      }
      console.log('submit data', formData.getAll("images"));
    
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
