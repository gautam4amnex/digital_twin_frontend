import { Component, Input, Output, EventEmitter, SimpleChange, SimpleChanges, OnChanges, Inject } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
//import { Monitoring } from './../../models/monitoring.model';
//import { EditService } from '@progress/kendo-angular-grid/dist/es2015/editing/edit.service';
//import { MonitoringService } from '../../services/monitoring.service';
import * as glob from '../../../environments/environment';
import { OnInit } from '@angular/core';
import { SurveyDetail } from 'src/app/models/surveydetail';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
//import { UtilsModule } from '../../utils/utils';


@Component({
    selector: 'kendo-grid-edit-form',
    styles: [
        'input[type=text] { width: 100%; }' +
        '.w-100 {width: 100%; margin-top: 10px} .img-label{width: calc(30% + 20px); display:inline-block; vertical-align: middle; margin-bottom: 0;}' +
        '.image-array{display: inline-block; width: calc(70% - 20px); vertical-align: middle;}'
    ],
    template: `
        <kendo-dialog *ngIf="active" class="custom-kendo-dialog" (close)="closeForm()">
          <kendo-dialog-titlebar>
            {{ isNew ? 'Add new product' : 'Details' }}
          </kendo-dialog-titlebar>

            <form novalidate [formGroup]="editForm">
                <div class="form-group" *ngFor="let row of columns;let i = index">

                    <div class="d-flex" *ngIf="row.read == true">
                        <label for="UnitPrice" class="control-label">{{row.value}}</label>
                        <!-- <input type="text" class="k-textbox custom-popup-text overflow-text" formControlName="{{row.key}}" 
                                matTooltip="{{surveyData[0] ? surveyData[0][row.key] : ''}}"
                                    value="{{surveyData[0][row.key]}}" [readonly]="row.readonly"/> -->
                    </div>
                    
                </div>  

            </form>

             <kendo-dialog-actions>
                <button class="k-button k-primary btn-basic submit" *ngIf="isAmnexAdmin" [disabled]="!editForm.valid" (click)="onSave($event)">Save</button>
                <button class="k-button btn-basic cancel" *ngIf="isAmnexAdmin" (click)="onCancel($event)">Cancel</button>
            </kendo-dialog-actions> 
        </kendo-dialog>
    `,
    imports: [SharedModule,GridModule, ExcelModule, PDFModule, DialogModule],
    standalone: true
})

export class GridEditFormComponent implements OnChanges, OnInit {
    public active = false;

    @Input() public isNew = false;
    @Input() public surveyRecordDetails = [];
    @Input() public surveyID;

    public surveyData:any [] = [];
    public buildingData:any[] = [];
    //public ImageURL = glob.environment.ImageBaseURL;
    public ImageDataArray = {};
    private ImageTags = {
        "property": "Property Images",
        "saledeed": "Sale Deed Images",
        "electricbill": "Elctrict Bill Images",
        "buildingImages": "Building Images",
        "layoutimages": "Layout Images",
        "propertytax": "Propertytax Images",
        "other": "Other Images"
    };
    public SaleDeedImages: any[] = [];
    public BuildingImages: any[] = [];
    public LayoutImages: any[] = [];
    public ShopImages: any[] = [];
    public PropertyImages: any[] = [];
    public OtherImages: any[] = [];
    public  imageArray = [];

    public propertyUsageCatItems: Array<{ property_usage_cat_id: number, property_usage_cat: String }> = [];
    public propertyTypeItems: Array<{ property_type_id: number, property_type: String }> = [];
    public propertyFactorThreeItems: Array<{ factor3_id: number, factor3_type: String }> = [];
    public propertyFactorFourItems: Array<{ factor4_id: number, factor4_type: String }> = [];
    public propertySurveyStatusItems: Array<{ survey_status_id: number, value: String }> = [];


    public selectedPropertyUsageCat: any;
    public selectedPropertyType: any;
    public selectedPropertyFactorThreeType: any;
    public selectedPropertyFactorFourType: any;
    public selectedPropertyWaterConnExists: any;
    public selectedPropertyProfessionalTax: any;
    public selectedPropertySurveyStatus: any;
    public selectedPropertyIsRMCProperty: any;
    public selectedPropertyIsSolarConPower: any;
    public selectedPropertyIsSolarConWater: any;
    public selectedPropertyIsShopAvailable: any;
    public selectedPropertyLinkedUnlinked: any;
    public isAmnexAdmin: boolean;

    // @Input() public set model(product: SurveyDetail) {
    //     this.editForm.reset(product);
    //     this.active = product !== undefined;
    // }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<SurveyDetail> = new EventEmitter();
    @Output() update: EventEmitter<SurveyDetail> = new EventEmitter();

    public editForm: FormGroup = new FormGroup({
        'id' : new FormControl(),
        'property_no' : new FormControl(),
        'property_old_no' : new FormControl(),
        'type_of_occupancy' : new FormControl(),
        'owner_name' : new FormControl(),
        'mobile_no' : new FormControl(),
        'signature_respondent' : new FormControl(),
        'respondent_name' : new FormControl(),
        'respondent_mobile' : new FormControl(),
        'respondent_email': new FormControl(),
        'image_adhar_card' : new FormControl(),
        'owner_father_husband_name' : new FormControl(),
        'age' : new FormControl(),
        'service_number' : new FormControl(),
        'image_attached_document_of_service_number' : new FormControl(),
        'email' : new FormControl(),
        'address_of_communication' : new FormControl(),
        'parmanent_address' : new FormControl(),
        'image_adhar_card_tax_payer' : new FormControl(),
        'previous_owner_name' : new FormControl(),
        'map_correction_type' : new FormControl(),
        'map_correction_remarks' : new FormControl(),
        'is_property_under_construction' : new FormControl(),
        'house_number' : new FormControl(),
        'name_of_property' : new FormControl(),
        'road_lane_name' : new FormControl(),
        'ward_no' : new FormControl(),
        'colony_name' : new FormControl(),
        'landmark' : new FormControl(),
        'pincode' : new FormControl(),
        'city_survey_number' : new FormControl(),
        'gut_no_survey_number' : new FormControl(),
        'street_number' : new FormControl(),
        'directional_property' : new FormControl(),
        'name_of_owner_property' : new FormControl(),
        'usage_sub_type' : new FormControl(),
        'usage_sub_type_name' : new FormControl(),
        'is_trade_license_status' : new FormControl(),
        'trade_license_number' : new FormControl(),
        'is_shop_act_license_status' : new FormControl(),
        'shop_act_license_number' : new FormControl(),
        'shop_area' : new FormControl(),
        'image_shop_act_license_document' : new FormControl(),
        'is_open_plot_for_commercial' : new FormControl(),
        'size_open_plot' : new FormControl(),
        'is_water_connection_supply' : new FormControl(),
        'water_connection_consumer_number' : new FormControl(),
        'image_water_connection_bill' : new FormControl(),
        'electricity_consumer_number' : new FormControl(),
        'image_electricity_bill' : new FormControl(),
        'is_sewrage_connection' : new FormControl(),
        'property_status' : new FormControl(),
        'is_property_photo' : new FormControl(),
        'image_property_whole_photo' : new FormControl(),
        'property_code' : new FormControl(),
        'building_id' : new FormControl(),
        'self_assessment_form_number' : new FormControl(),
        'is_presence_of_toilet' : new FormControl(),
        'visit1' : new FormControl(),
        'visit2' : new FormControl(),
        'zone_no' : new FormControl(),
        'created_by' : new FormControl(),
        'respondent_relation_with_owner' : new FormControl(),
        'profession' : new FormControl(),
        'type_of_property' : new FormControl(),
        'type_of_sub_property' : new FormControl(),
        'direction' : new FormControl(),
        'open_plot_for_commercial' : new FormControl(),
        'water_supply_source' : new FormControl(),
        'type_of_water_connection' : new FormControl(),
        'water_connection_service_line' : new FormControl(),
        'number_of_water_connection' : new FormControl(),
        'type_of_sewrage_connection' : new FormControl(),
        'survey_status' : new FormControl(),
        'property_remarks' : new FormControl(),
        'built_under_government_scheme' : new FormControl(),
        'building_type' : new FormControl(),
        'building_name' : new FormControl(),
        'road_name' : new FormControl(),
        'year_of_construction' : new FormControl(),
        'no_of_floor' : new FormControl(),
        'facilities' : new FormControl(),
        'no_of_properties' : new FormControl(),
        'is_commencement_certificate' : new FormControl(),
        'is_occupancy_certificate' : new FormControl(),
        'service_provider_name' : new FormControl(),
        'agency_name' : new FormControl(),
        'building_lat' : new FormControl(),
        'building_long' : new FormControl()
    });


    public columns = [
        { key: "id" , value: "ID" , read : true , readonly: true , dropdown: false , type: 'Property'},
        { key: "property_no" , value: "Property No" ,read : true , readonly: false , dropdown: false , type: 'Property'},
        { key: "property_old_no" , value: "Property Old No" ,read : true , readonly: false , dropdown: false , type: 'Property'},
        { key: "self_assessment_form_number" , value: "Self assessment form number" ,read : true , readonly: false , dropdown: false , type: 'Property'},
        { key: "type_of_occupancy" , value: "Type of Occupancy" ,read : true , readonly: true , dropdown: false , type: 'Property'},
        { key: "respondent_relation_with_owner" , value: "Respondent's relationship with owner" ,read : true , readonly: false , dropdown: false , type: 'Property'},
        { key: "respondent_name" , value: "Respondent's Name" ,read : true , readonly: false , dropdown: false , type: 'Property'},
        { key: "respondent_mobile" , value: "Respondent's Mobile" ,read : true , readonly: false , dropdown: false , type: 'Property'},
        { key: "respondent_email" , value: "Respondent's Email" ,read : true , readonly: false , dropdown: false , type: 'Property'},
        { key: "owner_name" , value: "Tax payer/ occupier/ Owner's Name" ,read : true , readonly: false , dropdown: false , type: 'Property'},
        { key: "owner_father_husband_name" , value: "Tax payer/occupier/ Owner's father/ Husband Name" ,read : true , readonly: false , dropdown: false , type: 'Property'},
        { key: "age" , value: "Age" ,read : true , readonly: false , dropdown: false , type: 'Property'},
        { key: "profession" , value: "Profession" ,read : true , readonly: true , dropdown: false , type: 'Property'},
        { key: "service_number" , value: "Service Number" ,read : true , readonly: false , dropdown: false , type: 'Property'},
        { key: "mobile_no" , value: "Mobile Number" ,read : true , readonly: false , dropdown: false , type: 'Property'},
        { key: "email" , value: "Email Id" ,read : true , readonly: false , dropdown: false , type: 'Property'}
    ];

    public monitoringService: any;
    // constructor(@Inject(MonitoringService) editServiceFactory: any, private utilModule: UtilsModule) {
    //     this.monitoringService = editServiceFactory();
    // }

    ngOnInit() {
        // this.getLovsdata();
        let roleId = String(localStorage.getItem('token1'));
        if(roleId === '2'){
            this.isAmnexAdmin  = true;
        }else{
            this.isAmnexAdmin  = false;;
        }

        // console.log("call" + this.id);
        // this.userManagementService.getUserDetailsViewService(this.id).subscribe((res: any) => {
        //     //  = res.data[0];
        // });
        // console.log("call");
        // this.getward();
    }

    public onSave(e): void {
        e.preventDefault();
        console.log(this.editForm.value);
        //this.updatePropertyData(this.editForm.value);
        
    }

    ngOnChanges(changes: SimpleChanges) {
        
        /*
        if (changes.surveyID) {
            let surveyID = changes.surveyID.currentValue ? changes.surveyID.currentValue : 131280;
            this.imageArray = [];
            let viewresponse = this.monitoringService.getviewpropertydata(surveyID)
                .subscribe((data: any) => {
                    this.surveyData = data.data ? data.data : [];
                    
                    this.ImageDataArray = {};
                    //debugger
                    if (this.surveyData[0]) {
                        this.updateFormGroupValue();
                        //let imageArray = this.surveyData[0].images.split(',');

                        if(this.surveyData[0].signature_respondent !="" &&  this.surveyData[0].signature_respondent!=null){
                            //this.imageArray.push(this.surveyData[0].signature_respondent);
                            this.addImages("Property",this.surveyData[0].signature_respondent);
                        }
                        if(this.surveyData[0].image_adhar_card !="" &&  this.surveyData[0].image_adhar_card!=null){
                            //this.imageArray.push(this.surveyData[0].image_adhar_card);
                            this.addImages("Property",this.surveyData[0].image_adhar_card);
                        }
                        if(this.surveyData[0].image_adhar_card_tax_payer !="" && this.surveyData[0].image_adhar_card_tax_payer!=null ){
                            // this.imageArray.push(this.surveyData[0].image_adhar_card_tax_payer);
                            this.addImages("Property",this.surveyData[0].image_adhar_card_tax_payer);
                        }
                        if(this.surveyData[0].image_attached_document_of_service_number !="" && this.surveyData[0].image_attached_document_of_service_number!=null ){
                            // this.imageArray.push(this.surveyData[0].image_attached_document_of_service_number);
                            this.addImages("Property",this.surveyData[0].image_attached_document_of_service_number);
                        }
                        if(this.surveyData[0].image_electricity_bill !="" && this.surveyData[0].image_electricity_bill!=null){
                            // this.imageArray.push(this.surveyData[0].image_electricity_bill);
                            this.addImages("Property",this.surveyData[0].image_electricity_bill);
                        }
                        if(this.surveyData[0].image_property_whole_photo !="" && this.surveyData[0].image_property_whole_photo!=null){
                            // this.imageArray.push(this.surveyData[0].image_property_whole_photo);
                            this.addImages("Property",this.surveyData[0].image_property_whole_photo);
                        }
                        if(this.surveyData[0].image_shop_act_license_document !="" && this.surveyData[0].image_shop_act_license_document!=null){
                            // this.imageArray.push(this.surveyData[0].image_shop_act_license_document);
                            this.addImages("Property",this.surveyData[0].image_shop_act_license_document);
                        }
                        if(this.surveyData[0].image_water_connection_bill !="" && this.surveyData[0].image_water_connection_bill!=null){
                            // this.imageArray.push(this.surveyData[0].image_water_connection_bill);
                            this.addImages("Property",this.surveyData[0].image_water_connection_bill);
                        }

                        //Building Images
                        if(this.surveyData[0].buildingdata[0] != null){
                            if(this.surveyData[0].buildingdata[0].image_building !="" && this.surveyData[0].buildingdata[0].image_building != null){
                                //this.imageArray.push(this.surveyData[0].buildingdata[0].image_building);
                                this.addImages("Building",this.surveyData[0].buildingdata[0].image_building);
                            }

                            if(this.surveyData[0].buildingdata[0].image_commencement_certificate !="" && this.surveyData[0].buildingdata[0].image_commencement_certificate != null){
                                //this.imageArray.push(this.surveyData[0].buildingdata[0].image_commencement_certificate);
                                this.addImages("Building",this.surveyData[0].buildingdata[0].image_commencement_certificate);
                            }

                            if(this.surveyData[0].buildingdata[0].image_occupancy_certificate !="" && this.surveyData[0].buildingdata[0].image_occupancy_certificate != null){
                                //this.imageArray.push(this.surveyData[0].buildingdata[0].image_occupancy_certificate);
                                this.addImages("Building",this.surveyData[0].buildingdata[0].image_occupancy_certificate);
                            }

                            if(this.surveyData[0].buildingdata[0].image_mobile_tower !="" && this.surveyData[0].buildingdata[0].image_mobile_tower != null){
                                //this.imageArray.push(this.surveyData[0].buildingdata[0].image_mobile_tower);
                                this.addImages("Building",this.surveyData[0].buildingdata[0].image_mobile_tower);
                            }

                            if(this.surveyData[0].buildingdata[0].image_mobile_tower !="" && this.surveyData[0].buildingdata[0].image_mobile_tower != null){
                                //this.imageArray.push(this.surveyData[0].buildingdata[0].image_mobile_tower);
                                this.addImages("Building",this.surveyData[0].buildingdata[0].image_mobile_tower);
                            }

                        }


                        // this.imageArray.forEach(image => {
                        //         let imageType = "propertyImages";
                        //         let imagePath = this.ImageURL + imageType  + image;
                        //         if (!this.ImageDataArray[imageType]) {
                        //             this.ImageDataArray[imageType] = { "imageType": this.ImageTags[imageType], "images": [{ "image": imagePath, "thumbImage": imagePath }] };
                        //         } else {
                        //             this.ImageDataArray[imageType].images.push({ "image": imagePath, "thumbImage": imagePath });
                        //         }
                        // });
                        
                    }
                });

        }else if(changes.model){

            if(changes.model.currentValue != undefined){
                //let id = changes.model.currentValue.survey_id;
                let id = changes.model.currentValue.id;
                this.imageArray = [];
                let viewresponse = this.monitoringService.getviewpropertydata(id)
                .subscribe((data: any) => {
                    this.surveyData = data.data ? data.data : [];
                    
                    this.ImageDataArray = {};
                    if (this.surveyData[0]) {
                        this.updateFormGroupValue();
                        
                        if(this.surveyData[0].signature_respondent !="" &&  this.surveyData[0].signature_respondent!=null){
                            //this.imageArray.push(this.surveyData[0].signature_respondent);
                            this.addImages("Property",this.surveyData[0].signature_respondent);
                        }
                        if(this.surveyData[0].image_adhar_card !="" &&  this.surveyData[0].image_adhar_card!=null){
                            //this.imageArray.push(this.surveyData[0].image_adhar_card);
                            this.addImages("Property",this.surveyData[0].image_adhar_card);
                        }
                        if(this.surveyData[0].image_adhar_card_tax_payer !="" && this.surveyData[0].image_adhar_card_tax_payer!=null ){
                            // this.imageArray.push(this.surveyData[0].image_adhar_card_tax_payer);
                            this.addImages("Property",this.surveyData[0].image_adhar_card_tax_payer);
                        }
                        if(this.surveyData[0].image_attached_document_of_service_number !="" && this.surveyData[0].image_attached_document_of_service_number!=null ){
                            // this.imageArray.push(this.surveyData[0].image_attached_document_of_service_number);
                            this.addImages("Property",this.surveyData[0].image_attached_document_of_service_number);
                        }
                        if(this.surveyData[0].image_electricity_bill !="" && this.surveyData[0].image_electricity_bill!=null){
                            // this.imageArray.push(this.surveyData[0].image_electricity_bill);
                            this.addImages("Property",this.surveyData[0].image_electricity_bill);
                        }
                        if(this.surveyData[0].image_property_whole_photo !="" && this.surveyData[0].image_property_whole_photo!=null){
                            // this.imageArray.push(this.surveyData[0].image_property_whole_photo);
                            this.addImages("Property",this.surveyData[0].image_property_whole_photo);
                        }
                        if(this.surveyData[0].image_shop_act_license_document !="" && this.surveyData[0].image_shop_act_license_document!=null){
                            // this.imageArray.push(this.surveyData[0].image_shop_act_license_document);
                            this.addImages("Property",this.surveyData[0].image_shop_act_license_document);
                        }
                        if(this.surveyData[0].image_water_connection_bill !="" && this.surveyData[0].image_water_connection_bill!=null){
                            // this.imageArray.push(this.surveyData[0].image_water_connection_bill);
                            this.addImages("Property",this.surveyData[0].image_water_connection_bill);
                        }

                        if(this.surveyData[0].buildingdata[0] != null){
                            if(this.surveyData[0].buildingdata[0].image_building !="" && this.surveyData[0].buildingdata[0].image_building != null){
                                //this.imageArray.push(this.surveyData[0].buildingdata[0].image_building);
                                this.addImages("Building",this.surveyData[0].buildingdata[0].image_building);
                            }

                            if(this.surveyData[0].buildingdata[0].image_commencement_certificate !="" && this.surveyData[0].buildingdata[0].image_commencement_certificate != null){
                                //this.imageArray.push(this.surveyData[0].buildingdata[0].image_commencement_certificate);
                                this.addImages("Building",this.surveyData[0].buildingdata[0].image_commencement_certificate);
                            }

                            if(this.surveyData[0].buildingdata[0].image_occupancy_certificate !="" && this.surveyData[0].buildingdata[0].image_occupancy_certificate != null){
                                //this.imageArray.push(this.surveyData[0].buildingdata[0].image_occupancy_certificate);
                                this.addImages("Building",this.surveyData[0].buildingdata[0].image_occupancy_certificate);
                            }

                            if(this.surveyData[0].buildingdata[0].image_mobile_tower !="" && this.surveyData[0].buildingdata[0].image_mobile_tower != null){
                                //this.imageArray.push(this.surveyData[0].buildingdata[0].image_mobile_tower);
                                this.addImages("Building",this.surveyData[0].buildingdata[0].image_mobile_tower);
                            }

                            if(this.surveyData[0].buildingdata[0].image_mobile_tower !="" && this.surveyData[0].buildingdata[0].image_mobile_tower != null){
                                //this.imageArray.push(this.surveyData[0].buildingdata[0].image_mobile_tower);
                                this.addImages("Building",this.surveyData[0].buildingdata[0].image_mobile_tower);
                            }

                        }

                       
                        // this.imageArray.forEach(image => {
                        //     let imageType = "property";
   
                        //     let imagePath = this.ImageURL + image;
                        //     if (!this.ImageDataArray[imageType]) {
                        //         this.ImageDataArray[imageType] = { "imageType": this.ImageTags[imageType], "images": [{ "image": imagePath, "thumbImage": imagePath }] };
                        //     } else {
                        //         this.ImageDataArray[imageType].images.push({ "image": imagePath, "thumbImage": imagePath });
                        //     }
                        
                        // });
                    }
                });
                
            }
        }
        */
    }

    /*
    public addImages(imageType1,imageName){
        if(imageType1 == 'Property'){           
            if(imageName.includes(',')){
                imageName.split(',').forEach(imageObj => {
                    let imageType = "property";
                    let imagePath = this.ImageURL + "propertyImage/"  + imageObj;
                    if (!this.ImageDataArray[imageType]) {
                        this.ImageDataArray[imageType] = { "imageType": this.ImageTags[imageType], "images": [{ "image": imagePath, "thumbImage": imagePath }] };
                    } else {
                        this.ImageDataArray[imageType].images.push({ "image": imagePath, "thumbImage": imagePath });
                    }
                });
            }else{
                let imageType = "property";
                let imagePath = this.ImageURL + "propertyImage/"  + imageName;
                if (!this.ImageDataArray[imageType]) {
                    this.ImageDataArray[imageType] = { "imageType": this.ImageTags[imageType], "images": [{ "image": imagePath, "thumbImage": imagePath }] };
                } else {
                    this.ImageDataArray[imageType].images.push({ "image": imagePath, "thumbImage": imagePath });
                }
            }
        }
        if(imageType1 == 'Building'){
            if(imageName.includes(',')){
                imageName.split(',').forEach(imageObj => {
                    let imageType = "buildingImages"; //
                    if (imageType != "") {
                        let imagePath = this.ImageURL + "buildingImage/" + imageObj;
                        if (!this.ImageDataArray[imageType]) {
                            this.ImageDataArray[imageType] = { "imageType": this.ImageTags[imageType], "images": [{ "image": imagePath, "thumbImage": imagePath }] };
                        } else {
                            this.ImageDataArray[imageType].images.push({ "image": imagePath, "thumbImage": imagePath });
                        }
                    }
                });
            }else{
                let imageType = "buildingImages"; //
                if (imageType != "") {
                    let imagePath = this.ImageURL + "buildingImage/" + imageName;
                    if (!this.ImageDataArray[imageType]) {
                        this.ImageDataArray[imageType] = { "imageType": this.ImageTags[imageType], "images": [{ "image": imagePath, "thumbImage": imagePath }] };
                    } else {
                        this.ImageDataArray[imageType].images.push({ "image": imagePath, "thumbImage": imagePath });
                    }
                }
            }
            
        }

        
    }*/
    

    public onCancel(e): void {
        e.preventDefault();
        this.closeForm();
    }

    public closeForm(): void {
        this.active = false;
        this.cancel.emit();
    }

    private updateFormGroupValue() {
        this.editForm.controls['id'].setValue(this.surveyData[0].id);
        this.editForm.controls['property_no'].setValue(this.surveyData[0].property_no);
        this.editForm.controls['property_old_no'].setValue(this.surveyData[0].property_old_no);
        this.editForm.controls['type_of_occupancy'].setValue(this.surveyData[0].type_of_occupancy);
        this.editForm.controls['owner_name'].setValue(this.surveyData[0].owner_name);
        this.editForm.controls['mobile_no'].setValue(this.surveyData[0].mobile_no);
        this.editForm.controls['respondent_name'].setValue(this.surveyData[0].respondent_name);
        this.editForm.controls['respondent_mobile'].setValue(this.surveyData[0].respondent_mobile);
        this.editForm.controls['respondent_email'].setValue(this.surveyData[0].respondent_email);
        
    }

    public getLovsdata() {
        this.monitoringService.getLovsData()
            .subscribe((data: any) => {
                if (data.data) {
                    let responseData = data.data;
                    this.propertyUsageCatItems = responseData[0].lovs_property_usage_cat_master && responseData[0].lovs_property_usage_cat_master != null
                        ? responseData[0].lovs_property_usage_cat_master : [];

                    this.propertyTypeItems = responseData[0].lovs_property_type_master && responseData[0].lovs_property_type_master != null
                        ? responseData[0].lovs_property_type_master : [];

                    this.propertyFactorThreeItems = responseData[0].lovs_factor3 && responseData[0].lovs_factor3 != null
                        ? responseData[0].lovs_factor3 : [];

                    this.propertyFactorFourItems = responseData[0].lovs_factor4 && responseData[0].lovs_factor4 != null
                        ? responseData[0].lovs_factor4 : [];

                    this.propertySurveyStatusItems = responseData[0].lovs_survey_status && responseData[0].lovs_survey_status != null
                        ? responseData[0].lovs_survey_status : [];
                }
            });
    }

    /*
    public updatePropertyData(monitoringModel: Monitoring) {

        if(monitoringModel.no_of_water_connection !=null 
                && monitoringModel.no_of_water_connection != undefined 
                && monitoringModel.no_of_water_connection != ''
                && !/^-?\d+$/.test(monitoringModel.no_of_water_connection)){
            this.utilModule.notify(this.utilModule.ERROR_TAG, 'Please enter only number in no. of water connection');
            return;
        }
        if(monitoringModel.total_floors !=null 
                && monitoringModel.total_floors != undefined 
                && monitoringModel.total_floors != '' 
                && !/^-?\d+$/.test(monitoringModel.total_floors)){
            this.utilModule.notify(this.utilModule.ERROR_TAG, 'Please enter only number in total floors');
            return;
        }

        if (monitoringModel.factor3_type != null && monitoringModel.factor3_type != undefined) {
            monitoringModel.factor3_type_id = this.propertyFactorThreeItems.find(item => { return item.factor3_type === monitoringModel.factor3_type }).factor3_id;
        }
        if (monitoringModel.factor4_type != null && monitoringModel.factor4_type != undefined) {
            monitoringModel.factor4_type_id = this.propertyFactorFourItems.find(item => { return item.factor4_type === monitoringModel.factor4_type }).factor4_id;
        }

        if (monitoringModel.property_usage_cat != null && monitoringModel.property_usage_cat != undefined) {
            monitoringModel.property_usage_cat_id = this.propertyUsageCatItems.find(item => { return item.property_usage_cat === monitoringModel.property_usage_cat }).property_usage_cat_id;
        }

        if (monitoringModel.property_type != null && monitoringModel.property_type != undefined) {
            monitoringModel.property_type_id = this.propertyTypeItems.find(item => { return item.property_type === monitoringModel.property_type }).property_type_id;
        }

        if (monitoringModel.value != null && monitoringModel.value != undefined) {
            monitoringModel.survey_status_id = this.propertySurveyStatusItems.find(item => { return item.value === monitoringModel.value }).survey_status_id;
        }

        monitoringModel.is_professional_tax_available = monitoringModel.is_professional_tax_available != null
            && String(monitoringModel.is_professional_tax_available) === 'false' ? false : true;
        monitoringModel.is_rmc_property = monitoringModel.is_rmc_property != null
            && String(monitoringModel.is_rmc_property) === 'false' ? false : true;
        monitoringModel.is_solar_con_power = monitoringModel.is_solar_con_power != null
            && String(monitoringModel.is_solar_con_power) === 'false' ? false : true;
        monitoringModel.is_solar_con_water = monitoringModel.is_solar_con_water != null &&
            String(monitoringModel.is_solar_con_water) === 'false' ? false : true;
        monitoringModel.linked_unlinked = monitoringModel.linked_unlinked != null &&
            String(monitoringModel.linked_unlinked) === 'false' ? false : true;
        monitoringModel.water_connection_exists = monitoringModel.water_connection_exists != null &&
            String(monitoringModel.water_connection_exists) === 'false' ? false : true;
        monitoringModel.is_shop_available = monitoringModel.is_shop_available != null &&
            String(monitoringModel.is_shop_available) === 'false' ? false : true;
        monitoringModel.is_update_from_dashboard = true;
        
        debugger

        this.save.emit(monitoringModel);
        this.active = false;
    }
    */


}
