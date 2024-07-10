import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Viewer } from 'cesium';
import * as Cesium from 'cesium';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonsService } from 'src/app/services/commons.service';
import * as turf from '@turf/turf';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import * as glob from '../../../environments/environment';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import html2canvas from 'html2canvas';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { WorkbookSheet, ExcelExportData } from '@progress/kendo-angular-excel-export';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';




@Component({
  selector: 'app-3d',
  standalone: true,
  //imports: [SharedModule],
  templateUrl: './3d.component.html',
  styleUrls: ['./3d.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [LabelModule, DropDownsModule, TreeViewModule, DialogModule, DateInputsModule, RouterOutlet, CommonModule, MatInputModule, MatSelectModule, MatButtonToggleModule, MatIconModule, MatSlideToggleModule, ReactiveFormsModule, MatButtonModule, MatMenuModule, MatFormFieldModule],
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
  //template: '<div appCesium></div>'
})

export default class _3D implements OnInit {
  data: any[] = [];
  bimdata: any[] = [];
  viewer: any;
  current_image: any;
  imageryLayers: any;
  map_3d_data = new Array();
  dropDownData: any;
  drawingMode: any = "line";
  activeShapePoints: any[] = [];
  activeShape: any;
  floatingPoint: any;
  handler: any;
  LineMeasurementhandler: any;
  infoClickHandler: any;
  geoJson: any;
  points: any[] = [];
  lineGraphics;
  labelEntities: any[] = [];
  dblClick = false;
  measureEnabled = false;
  polygonMeasureEnabled = false;
  info_click = false;
  goto_click = false;
  property_data: any;
  add_bim_data_click = false;
  pointmodelEntity: any;
  modelEntity: any;

  loadSatelliteImg: false;

  private url = glob.environment.baseUrl;

  galleryImg: any = "Satellite Map";

  formSubmitted = false;

  propertyDataInfohandler: any;
  propertyDataInfo_click = false;

  gridarr: any[] = [];
  gridInfoKeys: any;

  silhouetteGreen: any = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
  silhouetteBlue: any = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();

  selected: any = {
    feature: undefined,
    originalColor: new Cesium.Color(),
  };

  highlighted: any = {
    feature: undefined,
    originalColor: new Cesium.Color(),
  };

  selectedEntity: any = new Cesium.Entity();

  state = "closed";
  addBimDataHandler: any;

  latitude: any;
  longitude: any;
  bimDataForm: FormGroup;
  DataFormDetail: FormGroup;
  show: boolean = false;
  public editDialog: any = false;
  public layerDetailDialog: any = false;
  feature_name: any;
  selectFeatureDialog: any = false;

  gotopoint: any = null;
  cctv_entity: any[] = [];

  flag_details: any = null;
  
  captureElement: any = document.querySelector("#cesiumContainer");
  loadedBuildings: any;

  constructor(private http: HttpClient,
    private commonService: CommonsService,
  ) { }

  ngOnInit() {
    this.get_layer_panel_data()
    this.initializeViewer();
    // this.add_remove_3d_data_new(this.viewer);
  }
  async add_remove_3d_data_new(viewer:any) {
      //  let _3dTileSet = await Cesium.Cesium3DTileset.fromUrl("https://re-gis.mcgm.gov.in:9443/data/Building_A/tileset.json");
      //   _3dTileSet.show = true;
      //   viewer.scene.primitives.add(_3dTileSet);
      //   viewer.flyTo(_3dTileSet);
      }

showHideData(event){
  let service_url = event.target.getAttribute("service-url");
  let mobile_service_url = event.target.getAttribute("mobile_service_url")
  let is_combined_service = event.target.getAttribute("combined_service");
  let parent_layer = event.target.getAttribute("parent_layer");
  let table_name = event.target.getAttribute("value");
  let flag_status = event.target.getAttribute("_id");
  let imageryLayers = this.viewer.imageryLayers;

    if (event.target.checked == true) {
   
      this.cesium3d(table_name);

    }
    else {
      // this.loadedBuildings[table_name].show=false;
      // this.viewer.scene.primitives.remove(this.loadedBuildings[table_name]);
      // delete this.loadedBuildings[table_name];
      this.viewer.scene.primitives.removeAll();

 
    }
}
async cesium3d(buildind_id) {
  
  let _3dTileSet = await Cesium.Cesium3DTileset.fromUrl("https://re-gis.mcgm.gov.in:9443/data/"+buildind_id+"/tileset.json");
        _3dTileSet.show = true;
        this.viewer.scene.primitives.add(_3dTileSet);
        this.viewer.flyTo(_3dTileSet);
        this.loadedBuildings[buildind_id]=_3dTileSet;




  // viewer.scene.primitives.removeAll();//remove all the previous building
  //  let building = await Cesium.Cesium3DTileset.fromUrl(url);
  //  this.loadedBuildings[buildind_id]=building;
  // this.viewer.scene.primitives.add(building);
  // building.show = true;
  // var boundingSphere = building.boundingSphere;

  // // Fly to the bounding sphere of the tileset
  // this.viewer.camera.flyToBoundingSphere(boundingSphere, {
  //     duration: 2,
  //     complete: function() {
  //         var zoomDistance = boundingSphere.radius * 2;
  //         this.viewer.camera.zoomIn(zoomDistance);
  //     }
      
  // })
}
toggleCollapse(parentLayerId: number) {
  const collapseId = 'panelsStayOpen-collapse' + parentLayerId;
  const collapseElement = document.getElementById(collapseId);
  if (collapseElement) {
    collapseElement.classList.toggle('show');
  }
}

get_layer_panel_data() {
  this.data = [];
  var formData = {
    "page_name": "3D"
}
  this.commonService.getLayerAndImagePanel3D(formData).subscribe((data: any) => {
    this.data = data.data;
    console.log(this.data);
  });
}

initializeViewer() {

    this.viewer = new Cesium.Viewer("cesiumContainer", {
      baseLayer: new Cesium.ImageryLayer(new Cesium.OpenStreetMapImageryProvider({
        url: "https://tile.openstreetmap.org/"
      })),
      fullscreenButton: false,
      selectionIndicator: false,
      infoBox: true,
      animation: false,
      timeline: false,
      shadows: false,
      skyAtmosphere: false,
      baseLayerPicker: true,
      geocoder: false,
    });


    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(72.730797, 18.891774, 25000),
      orientation: {
        heading: Cesium.Math.toRadians(35.0),
        pitch: Cesium.Math.toRadians(-45.0),
        roll: 0.0,
      },
    });

  }

















































































































  // ngOnInit() {

  //   this.bimDataForm = new FormGroup({
  //     feature_name: new FormControl()
  //   });

  //   this.DataFormDetail = new FormGroup({
  //     cctv_asset_id: new FormControl(),
  //     location_name: new FormControl(),
  //     junction_type: new FormControl(),
  //     pstation_name: new FormControl()
  //   })

  //   this.initializeViewer();

  //   this.get_layer_panel_data("3D", "");

  //   var canvas = document.createElement('div');

  //   this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

  //   this.LineMeasurementhandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    

  //   this.addBimDataHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

  //   this.propertyDataInfohandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

  //   this.silhouetteGreen.uniforms.color = Cesium.Color.LIME;
  //   this.silhouetteGreen.uniforms.length = 0.01;
  //   this.silhouetteGreen.selected = [];

  //   this.silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
  //   this.silhouetteBlue.uniforms.length = 0.01;
  //   this.silhouetteBlue.selected = [];


  //   this.viewer.scene.postProcessStages.add(
  //     Cesium.PostProcessStageLibrary.createSilhouetteStage([
  //       this.silhouetteBlue,
  //       this.silhouetteGreen,
  //     ])
  //   );

  //   this.imageryLayers = this.viewer.imageryLayers; 

  // }


  // reactiveForm = new FormGroup({
  //   layer_name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
  //   table_name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
  //   layer_id: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
  //   layer_type: new FormControl('', [Validators.required]),
  //   parent_layer: new FormControl('', [Validators.required]),
  //   service_url: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1000)]),
  //   geometry_type: new FormControl('', [Validators.required]),
  //   scale_start: new FormControl('', [Validators.required]),
  //   scale_end: new FormControl('', [Validators.required]),
  //   status: new FormControl(),
  //   z_index: new FormControl(),
  //   wms: new FormControl(),
  //   info_click: new FormControl(),
  //   first_time: new FormControl()
  // });


  // public validate(): void {
  //   if (this.reactiveForm.invalid) {
  //     for (const control of Object.keys(this.reactiveForm.controls)) {
  //       this.reactiveForm.controls[control].markAsTouched();
  //     }
  //     return;
  //   }
  //   else {

  //     var wmsElement = <HTMLInputElement>document.getElementById("wms");
  //     var statusElement = <HTMLInputElement>document.getElementById("status");
  //     var info_clickElement = <HTMLInputElement>document.getElementById("info_click");
  //     var first_timeElement = <HTMLInputElement>document.getElementById("first_time");

  //     var form_data = {
  //       flag: "insert",
  //       layer_name: this.reactiveForm.controls.layer_name.value,
  //       table_name: this.reactiveForm.controls.table_name.value,
  //       layer_id: this.reactiveForm.controls.layer_id.value,
  //       layer_type: this.reactiveForm.controls.layer_type.value,
  //       parent_layer: this.reactiveForm.controls.parent_layer.value,
  //       service_url: this.reactiveForm.controls.service_url.value,
  //       geometry_type: this.reactiveForm.controls.geometry_type.value,
  //       scale_start: this.reactiveForm.controls.scale_start.value,
  //       scale_end: this.reactiveForm.controls.scale_end.value,
  //       wms: wmsElement.checked,
  //       status: statusElement.checked,
  //       is_info_click: info_clickElement.checked,
  //       z_index: this.reactiveForm.controls.z_index.value,
  //       is_first_time_load: first_timeElement.checked
  //     }

  //     this.commonService.crudLayerManagement(form_data).subscribe((data: any) => {
  //       console.log(data);
  //     });
  //   }
  // }

  // toggleCollapse(parentLayerId: number) {
  //   const collapseId = 'panelsStayOpen-collapse' + parentLayerId;
  //   const collapseElement = document.getElementById(collapseId);
  //   if (collapseElement) {
  //     collapseElement.classList.toggle('show');
  //   }
  // }

  // addLayerDetails() {
  //   this.formSubmitted = true;
  //   if (this.reactiveForm.valid) {
  //     return;
  //   }
  // }

  // public closeEditDialog() {
  //   this.editDialog = false;
  //   this.DataFormDetail.reset();
  // }

  // public openEditDialog() {
  //   this.editDialog = true;
  // }

  // public openLayerDetailDialog() {
  //   this.layerDetailDialog = true;

  //   /** Below Commented Code is to get all 3d data from db and add 3d object to map */
  //   // var form_data = {
  //   //   flag: "fetch"
  //   // }

  //   // this.commonService.crudBimData(form_data).subscribe((data: any) => {
  //   //   this.bimdata = data.data;    

  //   //   for(var i=0; i< this.bimdata.length; i++){
  //   //     this.add_data_on_click(this.bimdata[i].longitude , this.bimdata[i].latitude , "get" , this.bimdata[i] , "cctv");
  //   //   }

  //   // });


  // }

  // public closeLayerDetailDialog() {
  //   this.formSubmitted = false;
  //   this.reactiveForm.reset();
  //   this.layerDetailDialog = false;
  // }

  // get_layer_by_state_id(event) {


  //   var state_id = event.value;

  //   this.get_layer_panel_data("3D", state_id);

  // }

  // showHideData(event) {
  //   var service_url = event.target.getAttribute("service-url");
  //   var mobile_service_url = event.target.getAttribute("mobile_service_url")
  //   var is_combined_service = event.target.getAttribute("combined_service");
  //   var parent_layer = event.target.getAttribute("parent_layer");
  //   var table_name = event.target.getAttribute("value");
  //   var flag_status = event.target.getAttribute("_id");
  //   var imageryLayers = this.viewer.imageryLayers;

  //   if (event.target.checked == true) {

  //   var form_data = {
  //     flag: "fetch"
  //   }

  //   this.http.post("https://apagri.infinium.management/midcgis/layer/crud_cctv_location", form_data).subscribe((data: any) => {
  //     this.bimdata = data.data;    

  //     for(var i=0; i< this.bimdata.length; i++){
  //       this.add_data_on_click(this.bimdata[i].longitude , this.bimdata[i].latitude , "get" , this.bimdata[i] , table_name);
  //     }

  //   });

  //   }
  //   else {

  //     for(var i=0; i<this.cctv_entity.length; i++){
  //     this.viewer.entities.remove(this.cctv_entity[i]);
  //     }


  //   }
  // }


  // get_layer_panel_data(pageName, stateId) {
  //   this.data = [];
  //   var formData = {
  //     flag: "fetch_all",
  //     layer_type: "3D"
  //   }

  //   this.commonService.getLayerAndImagePanel(formData).subscribe((data: any) => {
  //     this.data = data.data;

  //   });


  // }


  // async add_remove_3d_data_new(assest_id, flag) {
  //   if (flag) {
  //     var tileurl = "https://re-gis.mcgm.gov.in:9443/data/" + assest_id + "/tileset.json";
  //     var _3dTileSet = await Cesium.Cesium3DTileset.fromUrl(tileurl); //2409626 //2411758
  //     this.viewer.scene.primitives.add(_3dTileSet);
  //     this.viewer.flyTo(_3dTileSet);
  //     this.map_3d_data.push(_3dTileSet);
  //     this.map_3d_data[assest_id] = _3dTileSet;
  //   } else {
  //     this.map_3d_data[assest_id].show = false;
  //   }
  // }


  // /* Measurement Starts */
  // createPoint(worldPosition) {
  //   const point = this.viewer.entities.add({
  //     position: worldPosition,
  //     point: {
  //       color: Cesium.Color.RED,
  //       pixelSize: 5,
  //       //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  //     },
  //   });
  //   return point;
  // }

  // drawShape(positionData) {
  //   let shape;
  //   if (this.drawingMode === "polygon") {
  //     shape = this.viewer.entities.add({
  //       polygon: {
  //         hierarchy: positionData,
  //         material: new Cesium.ColorMaterialProperty(
  //           Cesium.Color.WHITE.withAlpha(0.7)
  //         ),
  //       },
  //     });
  //   }
  //   return shape;
  // }

  // clearAllMeasurementData() {
  //   this.property_data = null;
  //   this.viewer.entities.removeAll();
  //   this.add_bim_data_click = false;
  //   this.propertyDataInfo_click = false;
  //   this.goto_click = false;
  //   this.info_click = false;
  //   this.measureEnabled = false;
  //   this.polygonMeasureEnabled = false;
  // }

  // clearMeasurements() {
  //   this.points = [];
  //   if (Cesium.defined(this.lineGraphics)) {
  //     this.viewer.entities.remove(this.lineGraphics);
  //   }
  //   for (var i = 0; i < this.labelEntities.length; i++) {
  //     this.viewer.entities.remove(this.labelEntities[i]);
  //   }
  //   this.labelEntities = [];
  // }


  // measurementType(event) {

  //   if (event.currentTarget.title == "Measure polyline") {

  //     this.measureEnabled = !this.measureEnabled;
  //     this.goto_click = false;
  //     this.polygonMeasureEnabled = false;
  //     this.info_click = false;
  //     this.add_bim_data_click = false;

  //     this.clearMeasurements();

  //     if (this.measureEnabled) {

  //       this.clearMeasurements();

  //       this.LineMeasurementhandler.setInputAction((click) => {

  //         if (!this.measureEnabled) {
  //           return;
  //         }

  //         if (this.dblClick == true) {
  //           this.points = [];
  //           this.clearMeasurements();
  //         }
  //         this.dblClick = false;

  //         var ray = this.viewer.camera.getPickRay(click.position);
  //         var cartesian = this.viewer.scene.pickPosition(click.position);

  //         if (Cesium.defined(cartesian)) {
  //           if (this.points.length === 0) {
  //             this.points.push(cartesian);
  //           } else {
  //             this.points.push(cartesian);
  //             this.drawLines();
  //           }
  //         }
  //       }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  //       this.LineMeasurementhandler.setInputAction((click) => {
  //         var ray = this.viewer.camera.getPickRay(click.position);
  //         var cartesian = this.viewer.scene.pickPosition(click.position);

  //         if (Cesium.defined(cartesian) && this.points.length > 1) {
  //           var totalDistance = 0;
  //           for (var i = 0; i < this.points.length - 1; i++) {
  //             totalDistance += Cesium.Cartesian3.distance(this.points[i], this.points[i + 1]);
  //           }

  //           console.log('Total distance between all points: ' + totalDistance.toFixed(2) + ' meters');

  //           var midpoint = Cesium.Cartesian3.lerp(this.points[i - 1], this.points[i], 0.5, new Cesium.Cartesian3());

  //           var entity = this.viewer.entities.add({
  //             position: midpoint,
  //             // point : {
  //             //     pixelSize : 10,
  //             //     color : Cesium.Color.YELLOW
  //             // },
  //             label: {
  //               showBackground: true,
  //               text: totalDistance.toFixed(2) + ' meters',
  //               backgroundColor: Cesium.Color.BLACK,
  //               border: 1

  //             }
  //           });

  //           this.labelEntities.push(entity);

  //           // var labelEntity = this.viewer.entities.add({
  //           //   position: midpoint,
  //           //   label: {
  //           //     text: totalDistance.toFixed(2) + ' meters',
  //           //     font: '12px sans-serif',
  //           //     fillColor: Cesium.Color.BLACK,
  //           //     outlineColor: Cesium.Color.BLACK,
  //           //     outlineWidth: 0.5,
  //           //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  //           //   }
  //           // });
  //           // this.labelEntities.push(labelEntity);

  //           this.dblClick = true;
  //         }
  //       }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  //     }
  //   }
  //   else {

  //     this.polygonMeasureEnabled = !this.polygonMeasureEnabled;

  //     this.measureEnabled = false;
  //     this.goto_click = false;
  //     this.info_click = false;
  //     this.add_bim_data_click = false;

  //     this.viewer.entities.removeAll();

  //     this.drawingMode = "polygon";

  //     this.handler.setInputAction((event) => {

  //       if (!this.polygonMeasureEnabled) {
  //         return;
  //       }

  //       const ray = this.viewer.camera.getPickRay(event.position);
  //       const earthPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);
  //       if (Cesium.defined(earthPosition)) {
  //         if (this.activeShapePoints.length === 0) {
  //           this.floatingPoint = this.createPoint(earthPosition);
  //           this.activeShapePoints.push(earthPosition);
  //           const dynamicPositions = new Cesium.CallbackProperty(() => {
  //             if (this.drawingMode === "polygon") {
  //               return new Cesium.PolygonHierarchy(this.activeShapePoints);
  //             }
  //             return this.activeShapePoints;
  //           }, false);
  //           this.activeShape = this.drawShape(dynamicPositions);
  //         }
  //         this.activeShapePoints.push(earthPosition);
  //         this.createPoint(earthPosition);
  //       }
  //     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  //     this.handler.setInputAction((event) => {
  //       if (Cesium.defined(this.floatingPoint)) {
  //         const ray = this.viewer.camera.getPickRay(event.endPosition);
  //         const newPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);
  //         if (Cesium.defined(newPosition)) {
  //           this.floatingPoint.position.setValue(newPosition);
  //           this.activeShapePoints.pop();
  //           this.activeShapePoints.push(newPosition);
  //         }
  //       }
  //     }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  //     this.handler.setInputAction((event) => {
  //       if (this.drawingMode === "polygon" && this.activeShapePoints.length > 2) {

  //         this.geoJson = null;
  //         this.geoJson = this.getGeoJsonFromPolygon(this.activeShapePoints);
  //         this.geoJson.features[0].geometry.coordinates[0].splice(this.geoJson.features[0].geometry.coordinates[0].length - 1, 1);
  //         this.geoJson.features[0].geometry.coordinates[0].push(this.geoJson.features[0].geometry.coordinates[0][0]);
  //         const area = turf.area(this.geoJson);
  //         console.log(area);
  //         this.terminateShape();

  //         var cartesian = this.viewer.scene.pickPosition(event.position);

  //         var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  //         var longitude = Cesium.Math.toDegrees(cartographic.longitude);
  //         var latitude = Cesium.Math.toDegrees(cartographic.latitude);

  //         var entity = this.viewer.entities.add({
  //           position: cartesian,
  //           label: {
  //             pixelSize: 1,
  //             showBackground: true,
  //             text: area.toFixed(2) + ' sq.m\^2',
  //             backgroundColor: Cesium.Color.BLACK,
  //             border: 1

  //           },
  //         });


  //       }
  //     }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


  //   }


  // }

  // getFeature() {
  //   this.selectFeatureDialog = false;
  //   this.editDialog = true;
  //   this.flag_details = 'create'
  // }

  // UpdateFeature(){
  //   this.editDialog = true;
  //   this.flag_details = 'update'
  // }

  // closeFeatureDialog() {
  //   this.selectFeatureDialog = false;
  // }

  // add_bim_data(event) {

  //   this.feature_name = event.target.value;
  //   this.selectFeatureDialog = true;

  //   this.add_bim_data_click = !this.add_bim_data_click;
  //   this.measureEnabled = false;
  //   this.goto_click = false;
  //   this.polygonMeasureEnabled = false;
  //   this.info_click = false;

  //   this.addBimDataHandler.setInputAction((click) => {

  //     if (this.add_bim_data_click == false) {
  //       return;
  //     }
  //     else {

  //       var cartesian = this.viewer.scene.pickPosition(click.position);


  //       var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  //       console.log(
  //         'lon ' + Cesium.Math.toDegrees(cartographic.longitude) + ', ' +
  //         'lat ' + Cesium.Math.toDegrees(cartographic.latitude) + ', ' +
  //         'alt ' + cartographic.height);

  //       this.add_data_on_click(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), "create", "", event.target.value);
  //     }
  //   }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // }

  // add_data_on_click(long, lat, type, response, Featuretype) {
  //   if (type == "create") {

  //     this.latitude = lat;
  //     this.longitude = long;

  //     console.log("Lat = ", this.latitude);

  //     if (Featuretype == "car") {

  //       this.modelEntity = this.viewer.entities.add({
  //         name: "milktruck",
  //         position: Cesium.Cartesian3.fromDegrees(long, lat),
  //         model: {
  //           uri:
  //             "../../../assets/3d_data/CesiumMilkTruck.glb",
  //           minimumPixelSize: 30,
  //           // maximumScale: 20000,
  //           heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  //         },

  //       });

  //       const initialOrientation = Cesium.Transforms.headingPitchRollQuaternion(
  //         this.modelEntity.position.getValue(this.viewer.clock.currentTime),
  //         new Cesium.HeadingPitchRoll(0, 0, 0)
  //       );

  //       this.modelEntity.orientation = initialOrientation;

  //       return;

  //     }
  //     if (Featuretype == "street_light") {

  //       this.modelEntity = this.viewer.entities.add({
  //         name: "milktruck",
  //         position: Cesium.Cartesian3.fromDegrees(long, lat),
  //         model: {
  //           uri:
  //             "../../../assets/3d_data/dividerStreetLight.glb",
  //           minimumPixelSize: 30,
  //           // maximumScale: 20000,
  //           heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  //         },

  //       });

  //       const initialOrientation = Cesium.Transforms.headingPitchRollQuaternion(
  //         this.modelEntity.position.getValue(this.viewer.clock.currentTime),
  //         new Cesium.HeadingPitchRoll(0, 0, 0)
  //       );

  //       this.modelEntity.orientation = initialOrientation;

  //       return;

  //     }
  //     if (Featuretype == "cctv") {

  //       this.modelEntity = this.viewer.entities.add({
  //         name: "milktruck",
  //         position: Cesium.Cartesian3.fromDegrees(long, lat),
  //         model: {
  //           uri:
  //             "../../../assets/3d_data/cctv.glb",
  //           minimumPixelSize: 30,
  //           // maximumScale: 20000,
  //           heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  //         },


  //       });

  //       const initialOrientation = Cesium.Transforms.headingPitchRollQuaternion(
  //         this.modelEntity.position.getValue(this.viewer.clock.currentTime),
  //         new Cesium.HeadingPitchRoll(0, 0, 0)
  //       );

  //       this.modelEntity.orientation = initialOrientation;

  //       return;

  //     }

  //     if (Featuretype == "smart_pole") {

  //       this.modelEntity = this.viewer.entities.add({
  //         name: "milktruck",
  //         position: Cesium.Cartesian3.fromDegrees(long, lat),
  //         model: {
  //           uri:
  //             "../../../assets/3d_data/smart_pole.glb",
  //           minimumPixelSize: 30,
  //           // maximumScale: 20000,
  //           heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  //         },

  //       });

  //       const initialOrientation = Cesium.Transforms.headingPitchRollQuaternion(
  //         this.modelEntity.position.getValue(this.viewer.clock.currentTime),
  //         new Cesium.HeadingPitchRoll(0, 0, 0)
  //       );

  //       this.modelEntity.orientation = initialOrientation;

  //       return;

  //     }

  //   }
  //   else {

  //     // if (Featuretype == "car") {

  //     //   let modelEntity = this.viewer.entities.add({
  //     //     name: "milktruck",
  //     //     position: Cesium.Cartesian3.fromDegrees(long, lat),
  //     //     model: {
  //     //       uri:
  //     //         "../../../assets/3d_data/CesiumMilkTruck.glb",
  //     //       minimumPixelSize: 30,
  //     //       // maximumScale: 20000,
  //     //       heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  //     //     },

  //     //   });

  //     //   const initialOrientation = Cesium.Transforms.headingPitchRollQuaternion(
  //     //     modelEntity.position.getValue(this.viewer.clock.currentTime),
  //     //     new Cesium.HeadingPitchRoll(0, 0, 0)
  //     //   );

  //     //   modelEntity.orientation = initialOrientation;

  //     //   if (response.orientation != null) {
  //     //     var result = JSON.parse(response.orientation);

  //     //     modelEntity.orientation._value.w = result.w
  //     //     modelEntity.orientation._value.x = result.x
  //     //     modelEntity.orientation._value.y = result.y
  //     //     modelEntity.orientation._value.z = result.z
  //     //   }

  //     //   return;

  //     // }

  //     // if (Featuretype == "street_light") {

  //     //   let modelEntity = this.viewer.entities.add({
  //     //     name: "milktruck",
  //     //     position: Cesium.Cartesian3.fromDegrees(long, lat),
  //     //     model: {
  //     //       uri:
  //     //         "../../../assets/3d_data/dividerStreetLight.glb",
  //     //       minimumPixelSize: 30,
  //     //       // maximumScale: 20000,
  //     //       heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  //     //     },

  //     //   });

  //     //   const initialOrientation = Cesium.Transforms.headingPitchRollQuaternion(
  //     //     modelEntity.position.getValue(this.viewer.clock.currentTime),
  //     //     new Cesium.HeadingPitchRoll(0, 0, 0)
  //     //   );

  //     //   modelEntity.orientation = initialOrientation;

  //     //   if (response.orientation != null) {
  //     //     var result = JSON.parse(response.orientation);

  //     //     modelEntity.orientation._value.w = result.w
  //     //     modelEntity.orientation._value.x = result.x
  //     //     modelEntity.orientation._value.y = result.y
  //     //     modelEntity.orientation._value.z = result.z
  //     //   }

  //     //   return;


  //     // }

  //     // if (Featuretype == "cctv") {

  //     //   var propertyBag = new Cesium.PropertyBag();
  //     //   propertyBag.addProperty('cctv_asset_id', response.cctv_asset_id);
  //     //   propertyBag.addProperty('cctv_id', response.cctv_id);
  //     //   propertyBag.addProperty('junction_type', response.junction_type);
  //     //   propertyBag.addProperty('latitude', response.latitude);
  //     //   propertyBag.addProperty('location_name', response.location_name);
  //     //   propertyBag.addProperty('longitude', response.longitude);
  //     //   propertyBag.addProperty('police_station_name', response.police_station_name);

  //     //   console.log(response);

  //     //   let modelEntity = this.viewer.entities.add({
  //     //     name: "milktruck",
  //     //     position: Cesium.Cartesian3.fromDegrees(long, lat),
  //     //     model: {
  //     //       uri:
  //     //         "../../../assets/3d_data/cctv.glb",
  //     //       minimumPixelSize: 30,
  //     //       // maximumScale: 20000,
  //     //       heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  //     //     },
  //     //     properties: propertyBag

  //     //   });

  //     //   const initialOrientation = Cesium.Transforms.headingPitchRollQuaternion(
  //     //     modelEntity.position.getValue(this.viewer.clock.currentTime),
  //     //     new Cesium.HeadingPitchRoll(0, 0, 0)
  //     //   );

  //     //   modelEntity.orientation = initialOrientation;

  //     //   if (response.orientation != null) {
  //     //     var result = JSON.parse(response.orientation);

  //     //     modelEntity.orientation._value.w = result.w
  //     //     modelEntity.orientation._value.x = result.x
  //     //     modelEntity.orientation._value.y = result.y
  //     //     modelEntity.orientation._value.z = result.z
  //     //   }

  //     //   return;


  //     // }

  //       var propertyBag = new Cesium.PropertyBag();
  //       propertyBag.addProperty('cctv_asset_id', response.cctv_asset_id);
  //       propertyBag.addProperty('cctv_id', response.cctv_id);
  //       propertyBag.addProperty('junction_type', response.junction_type);
  //       propertyBag.addProperty('latitude', response.latitude);
  //       propertyBag.addProperty('location_name', response.location_name);
  //       propertyBag.addProperty('longitude', response.longitude);
  //       propertyBag.addProperty('pstation_name', response.police_station_name);

  //       console.log(response);

  //       let modelEntity = this.viewer.entities.add({
  //         name: "milktruck",
  //         position: Cesium.Cartesian3.fromDegrees(long, lat),
  //         model: {
  //           uri:
  //             "../../../assets/3d_data/" + Featuretype +".glb",
  //           minimumPixelSize: 30,
  //           // maximumScale: 20000,
  //           heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  //         },
  //         properties: propertyBag

  //       });

  //       this.cctv_entity.push(modelEntity);

  //       const initialOrientation = Cesium.Transforms.headingPitchRollQuaternion(
  //         modelEntity.position.getValue(this.viewer.clock.currentTime),
  //         new Cesium.HeadingPitchRoll(0, 0, 0)
  //       );

  //       modelEntity.orientation = initialOrientation;

  //       if (response.orientation != null) {
  //         var result = JSON.parse(response.orientation);

  //         modelEntity.orientation._value.w = result.w
  //         modelEntity.orientation._value.x = result.x
  //         modelEntity.orientation._value.y = result.y
  //         modelEntity.orientation._value.z = result.z
  //       }

  //       return;




  //   }

  // }

  // rotateEntity(entity, angleDegrees) {

  //   const angleRadians = Cesium.Math.toRadians(angleDegrees);
  //   const rotationQuat = Cesium.Quaternion.fromAxisAngle(
  //     new Cesium.Cartesian3(0, 0, 1),
  //     angleRadians
  //   );
  //   const currentOrientation = this.modelEntity.orientation.getValue(this.viewer.clock.currentTime);
  //   const newOrientation = Cesium.Quaternion.multiply(currentOrientation, rotationQuat, new Cesium.Quaternion());
  //   this.modelEntity.orientation = newOrientation;

  //   console.log(this.modelEntity.orientation);

  // }

  // add_bim_data_to_db($event) {

  //   var form_data;
  //   if(this.flag_details == 'create'){

  //     form_data = {

  //     cctv_asset_id: this.DataFormDetail.controls['cctv_asset_id'].value,
  //     location_name: this.DataFormDetail.controls['location_name'].value,
  //     junction_type: this.DataFormDetail.controls['junction_type'].value,
  //     police_station_name: this.DataFormDetail.controls['pstation_name'].value,
  //     latitude: this.latitude,
  //     longitude: this.longitude,
  //     orientation: this.modelEntity.orientation._value,
  //     flag: "create"

  //   }

  // }

  // if(this.flag_details == 'update'){

  //   form_data = {

  //     cctv_id: this.gridarr['cctv_id'],
  //     cctv_asset_id: this.DataFormDetail.controls['cctv_asset_id'].value,
  //     location_name: this.DataFormDetail.controls['location_name'].value,
  //     junction_type: this.DataFormDetail.controls['junction_type'].value,
  //     police_station_name: this.DataFormDetail.controls['pstation_name'].value,
  //     orientation: this.modelEntity.orientation._value,
  //     flag: "update"

  //   }

  // }

  //   this.latitude = null;
  //   this.longitude = null;

  //   console.log(form_data);

  //   this.commonService.crudBimData(form_data).subscribe((data: any) => {
  //     this.bimdata = data.data;
  //   });
  //   this.DataFormDetail.reset();
  //   this.editDialog = false;

  // }

  // getBimData() {

  //   var form_data = {
  //     flag: "fetch"
  //   }

  //   this.commonService.crudBimData(form_data).subscribe((data: any) => {
  //     this.bimdata = data.data;

  //     for (var i = 0; i < this.bimdata.length; i++) {
  //       this.add_data_on_click(this.bimdata[i].longitude, this.bimdata[i].latitude, "get", this.bimdata[i], "car");
  //     }

  //   });




  // }

  // openPopup() {
  //   this.show = !this.show;
  // }

  // drawLines() {
  //   if (Cesium.defined(this.lineGraphics)) {
  //     this.viewer.entities.remove(this.lineGraphics);
  //   }
  //   for (var i = 0; i < this.labelEntities.length; i++) {
  //     this.viewer.entities.remove(this.labelEntities[i]);
  //   }

  //   var linePositions = [];
  //   var totalDistance = 0;
  //   for (var i = 0; i < this.points.length; i++) {
  //     linePositions.push(this.points[i].clone());
  //     if (i > 0) {
  //       var distance = Cesium.Cartesian3.distance(this.points[i - 1], this.points[i]);
  //       totalDistance += distance;
  //       var midpoint = Cesium.Cartesian3.lerp(this.points[i - 1], this.points[i], 0.5, new Cesium.Cartesian3());
  //       var labelEntity = this.viewer.entities.add({
  //         position: midpoint,
  //         label: {
  //           text: distance.toFixed(2) + ' meters',
  //           font: '12px sans-serif',
  //           fillColor: Cesium.Color.BLACK,
  //           outlineColor: Cesium.Color.BLACK,
  //           outlineWidth: 0.5,
  //           style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  //           //= heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  //         }
  //       });
  //       this.labelEntities.push(labelEntity);
  //     }
  //   }

  //   this.lineGraphics = this.viewer.entities.add({
  //     polyline: {
  //       positions: linePositions,
  //       width: 3,
  //       material: new Cesium.PolylineOutlineMaterialProperty({
  //         color: Cesium.Color.RED,
  //         outlineWidth: 2,
  //         outlineColor: Cesium.Color.WHITE
  //       })
  //     }
  //   });

  // }

  // terminateShape() {
  //   this.viewer.entities.removeAll();
  //   this.activeShapePoints.pop();
  //   this.drawShape(this.activeShapePoints);
  //   this.viewer.entities.remove(this.floatingPoint);
  //   this.viewer.entities.remove(this.activeShape);
  //   this.floatingPoint = undefined;
  //   this.activeShape = undefined;
  //   this.activeShapePoints = [];
  // }

  // getGeoJsonFromPolygon(positionData) {
  //   const positions = positionData.map(position => {
  //     const cartographic = Cesium.Cartographic.fromCartesian(position);
  //     return [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
  //   });


  //   const geoJson = {
  //     "type": "FeatureCollection",
  //     "features": [
  //       {
  //         "type": "Feature",
  //         "geometry": {
  //           "type": "Polygon",
  //           "coordinates": [positions]
  //         },
  //         "properties": {}
  //       }
  //     ]
  //   }

  //   return geoJson;
  // }


  // /* Measurement Ends */

  // /** 3D INFO CLICK starts*/

  // infoOf3DData() {

  //   /** BElow Code is to get Info of 3d object plotted by user */
  //   this.goto_click = false;
  //   this.measureEnabled = false;
  //   this.polygonMeasureEnabled = false;
  //   this.info_click = false;

  //   if (this.propertyDataInfo_click == true) {
  //     //document.querySelector("#property_tbl").setAttribute("style" , "display: none");
  //     this.propertyDataInfo_click = false;
  //   }
  //   else {
  //     this.propertyDataInfo_click = true;
  //   }


  //   this.propertyDataInfohandler.setInputAction((movement) => {

  //     if (!this.propertyDataInfo_click) {
  //       return;
  //     }
  //     else {

  //       var pickedFeature = this.viewer.scene.pick(movement.position);
  //       if (Cesium.defined(pickedFeature.id)) {
        
  //       this.gridInfoKeys =  pickedFeature.id.properties._propertyNames;

        
  //         this.modelEntity = pickedFeature.id;
  //         // const initialOrientation = Cesium.Transforms.headingPitchRollQuaternion(
  //         //   this.modelEntity.id.position.getValue(this.viewer.clock.currentTime),
  //         //   new Cesium.HeadingPitchRoll(0, 0, 0)
  //         // );
  
  //         // this.modelEntity.orientation = initialOrientation;
          
  //       for(let i=0; i<Object.values(pickedFeature.id.properties._propertyNames).length; i++){
  //         var key:any = Object.values(pickedFeature.id.properties._propertyNames)[i];

  //         this.gridarr[key] = pickedFeature.id.properties[key]._value;       
          
  //         if(key != 'latitude' && key != 'longitude' && key!= 'cctv_id'){
  //         this.DataFormDetail.controls[key].setValue(this.gridarr[key]);
  //         }

  //     }

  //     alert('Clicked');
  //     this.flag_details = 'update';
  //     console.log(this.gridInfoKeys);
  //     console.log(this.gridarr);
  //     this.selectFeatureDialog = false;
  //     this.editDialog = true;
  //   }

  //     }


  //    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  // }

  // /** 3D INFO CLICK ends */


  // /** INFO CLICK */
  // featureInfo() {

  //   this.goto_click = false;
  //   this.measureEnabled = false;
  //   this.polygonMeasureEnabled = false;

  //   if (this.info_click == true) {
  //     //document.querySelector("#property_tbl").setAttribute("style" , "display: none");
  //     this.info_click = false;
  //   }
  //   else {
  //     this.info_click = true;
  //   }


  //   let infoClickHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

  //   infoClickHandler.setInputAction((movement) => {

  //     if (!this.info_click) {
  //       return;
  //     }
  //     else {

  //       this.silhouetteGreen.selected = [];
  //       var pickedFeature = this.viewer.scene.pick(movement.position);
  //       if (!Cesium.defined(pickedFeature)) {

  //         return;
  //       }


  //       if (this.silhouetteGreen.selected[0] === pickedFeature) {
  //         return;
  //       }


  //       var highlightedFeature = this.silhouetteBlue.selected[0];
  //       if (pickedFeature === highlightedFeature) {
  //         this.silhouetteBlue.selected = [];
  //       }


  //       this.silhouetteGreen.selected = [pickedFeature];


  //       var featureName = pickedFeature.getProperty("Prabhag");

  //       this.property_data = [
  //         {
  //           value: 'Name',
  //           field: pickedFeature.getProperty("Name"),
  //         },
  //         {
  //           value: 'UID',
  //           field: pickedFeature.getProperty("Prabhag"),
  //         },
  //         {
  //           value: 'Area Sq.m',
  //           field: pickedFeature.getProperty("Area_Sq_m"),
  //         },
  //         {
  //           value: 'Height m',
  //           field: pickedFeature.getProperty("Height_m"),
  //         },
  //         {
  //           value: 'X',
  //           field: pickedFeature.getProperty("X"),
  //         },
  //         {
  //           value: 'Y',
  //           field: pickedFeature.getProperty("Y"),
  //         },
  //         {
  //           value: 'FUID',
  //           field: pickedFeature.getProperty("FUID"),
  //         },
  //         {
  //           value: 'Ward',
  //           field: pickedFeature.getProperty("Ward"),
  //         },
  //         {
  //           value: 'Prabhag',
  //           field: pickedFeature.getProperty("Prabhag"),
  //         },
  //         {
  //           value: 'Zone',
  //           field: pickedFeature.getProperty("Zone"),
  //         },
  //         {
  //           value: 'Sq Km.',
  //           field: pickedFeature.getProperty("Sq_Km"),
  //         },
  //         {
  //           value: 'Height Category',
  //           field: pickedFeature.getProperty("B_Category"),
  //         }

  //       ]

  //     }

  //   }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


  // }




  // /** Highlight Building */

  // per_selection() {

  //   this.goto_click = false;
  //   this.measureEnabled = false;
  //   this.info_click = false;
  //   this.polygonMeasureEnabled = false;


  //   this.viewer.screenSpaceEventHandler.setInputAction((movement) => {

  //     let element = document.getElementById("per_selection") as HTMLInputElement;
  //     if (!element.checked) {
  //       return;
  //     }
  //     else {

  //       if (Cesium.defined(this.selected.feature)) {
  //         this.selected.feature.color = this.selected.originalColor;
  //         this.selected.feature = undefined;
  //       }

  //       var pickedFeature = this.viewer.scene.pick(movement.position);
  //       if (!Cesium.defined(pickedFeature)) {
  //         //this.clickHandler(movement);
  //         return;
  //       }

  //       if (this.selected.feature === pickedFeature) {
  //         return;
  //       }
  //       this.selected.feature = pickedFeature;

  //       if (pickedFeature === this.highlighted.feature) {
  //         Cesium.Color.clone(
  //           this.highlighted.originalColor,
  //           this.selected.originalColor
  //         );
  //         this.highlighted.feature = undefined;
  //       } else {
  //         Cesium.Color.clone(pickedFeature.color, this.selected.originalColor);
  //       }

  //       pickedFeature.color = Cesium.Color.LIME;

  //     }


  //   },
  //     Cesium.ScreenSpaceEventType.LEFT_CLICK);
  // }

  // /** Highlight Building */

  // /* GOTO */

  // goto_location() {

  //   this.info_click = false;
  //   this.measureEnabled = false;
  //   this.polygonMeasureEnabled = false;

  //   if (this.goto_click == true) {
  //     if(this.gotopoint != null){
  //       this.viewer.entities.remove(this.gotopoint);
  //     }
  //     this.goto_click = false;
  //   }
  //   else {
  //     this.goto_click = true;
  //   }

  //   let myMouseHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

  //   myMouseHandler.setInputAction((e) => {

  //     if (!this.goto_click) {
  //       return;
  //     }
  //     else {

  //       if (this.gotopoint != null) {
  //         this.viewer.entities.remove(this.gotopoint);
  //       }

  //       var scene = this.viewer.scene;
  //       if (scene.mode !== Cesium.SceneMode.MORPHING) {
  //         var pickRay = scene.camera.getPickRay(e.position);
  //         var cartesian = scene.globe.pick(pickRay, scene);

  //         if (cartesian) {
  //           var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  //           var longitude = Cesium.Math.toDegrees(cartographic.longitude);
  //           var latitude = Cesium.Math.toDegrees(cartographic.latitude);

  //           this.viewer.camera.flyTo({
  //             destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 500),
  //             orientation: {
                
  //               roll: 0.0,
  //             },
  //             duration: 3
  //           });

  //           this.gotopoint = this.viewer.entities.add({
  //             name: "milktruck",
  //             position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
  //             model: {
  //               uri:
  //                 "../../../assets/3d_data/location_mark.glb",
  //               minimumPixelSize: 30,
  //               // maximumScale: 20000,
  //               heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  //             },
    
  //           });

  //         }
  //       }

  //     }

  //   }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // }

  // changeBaseLayer() {

  //   this.viewer.scene.imageryLayers.removeAll();

  //   if (this.galleryImg == "Satellite Map") {

  //     document.getElementById("mat-mdc-slide-toggle-1-label").setAttribute("style", "color: white; font-weight: 500;")


  //     this.galleryImg = "Default Map"
  //     const imageryLayer = Cesium.ImageryLayer.fromWorldImagery(null);
  //     this.viewer.scene.imageryLayers.add(imageryLayer);

  //   }
  //   else {
  //     this.galleryImg = "Satellite Map"
  //     document.getElementById("mat-mdc-slide-toggle-1-label").setAttribute("style", "color: black; font-weight: 500;")
  //     const imageryLayer = new Cesium.ImageryLayer(new Cesium.OpenStreetMapImageryProvider({
  //       url: "https://tile.openstreetmap.org/"
  //     }));
  //     this.viewer.scene.imageryLayers.add(imageryLayer);
  //   }

  // }

  // takeSS() {

  //   this.viewer.render();
  //   var captureElement: any = document.querySelector("#cesiumContainer");

  //   html2canvas(captureElement, { allowTaint: false, useCORS: true, }).then((canvas) => {

  //     const imageData = canvas.toDataURL("image/png");

  //     const link = document.createElement("a");
  //     link.setAttribute("download", "Map.png");
  //     link.setAttribute("href", imageData);
  //     link.click();
  //   });

  // }

  // togglePanel() {
  //   document.body.classList.toggle('closed-panel');
  //   this.state = (this.state === "closed") ? "open" : "closed";
  // }


  // initializeViewer() {

  //   this.viewer = new Cesium.Viewer("cesiumContainer", {
  //     baseLayer: new Cesium.ImageryLayer(new Cesium.OpenStreetMapImageryProvider({
  //       url: "https://tile.openstreetmap.org/"
  //     })),
  //     fullscreenButton: false,
  //     selectionIndicator: false,
  //     infoBox: true,
  //     animation: false,
  //     timeline: false,
  //     shadows: false,
  //     skyAtmosphere: false,
  //     baseLayerPicker: true,
  //     geocoder: false,
  //   });


  //   this.viewer.camera.flyTo({
  //     destination: Cesium.Cartesian3.fromDegrees(72.730797, 18.891774, 25000),
  //     orientation: {
  //       heading: Cesium.Math.toRadians(35.0),
  //       pitch: Cesium.Math.toRadians(-45.0),
  //       roll: 0.0,
  //     },
  //   });

  // }


}
