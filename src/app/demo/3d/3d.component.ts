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
import { ReactiveFormsModule , FormGroup, FormControl } from '@angular/forms';



interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-3d',
  standalone: true,
  //imports: [SharedModule],
  templateUrl: './3d.component.html',
  styleUrls: ['./3d.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [LabelModule, DropDownsModule, TreeViewModule ,DialogModule , DateInputsModule,  RouterOutlet, CommonModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatButtonToggleModule, MatIconModule ,MatSlideToggleModule , ReactiveFormsModule],
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

  loadSatelliteImg: false;

  private url = glob.environment.baseUrl;

  galleryImg: any = "Satellite Map";


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
  show: boolean = false;
  public editDialog:any = false;
  feature_name: any;
  selectFeatureDialog: any = false;

  constructor(private http: HttpClient,
    private commonService: CommonsService,
    ) { }

  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  toggleCollapse(parentLayerId: number) {
    const collapseId = 'panelsStayOpen-collapse' + parentLayerId;
    const collapseElement = document.getElementById(collapseId);
    if (collapseElement) {
      collapseElement.classList.toggle('show');
    }
  }

  public closeEditDialog() {
    this.editDialog = false;
  }

  public openEditDialog() {
    this.editDialog = true;
  }

  get_layer_by_state_id(event) {


    var state_id = event.value;

    this.get_layer_panel_data("3D", state_id);

  }

  showHideData(event) {
    //console.log(event.target.getAttribute("mobile_service_url");;
    var service_url = event.target.getAttribute("service-url");
    var mobile_service_url = event.target.getAttribute("mobile_service_url")
    var is_combined_service = event.target.getAttribute("combined_service");
    var parent_layer = event.target.getAttribute("parent_layer");
    var table_name = event.target.getAttribute("value");
    var flag_status = event.target.getAttribute("_id");
    var imageryLayers = this.viewer.imageryLayers;

    if (event.target.checked == true) {



      if (flag_status != "Image") {
        if (parent_layer == "3D Buildings" || parent_layer == "3D Bridge" || parent_layer == "3D Flyover"
          || parent_layer == "3D Metro Line" || parent_layer == "3D Metro Station" || parent_layer == "Vector Model") {
          this.add_remove_3d_data_new(table_name, true);
        }


      } else {
        this.current_image = new Cesium.WebMapTileServiceImageryProvider({
          url: service_url,
          layer: table_name,
          style: 'default',
          format: 'image/png',
          tileMatrixSetID: 'GoogleMapsCompatibleExt2:epsg:3857'
        });


        imageryLayers.addImageryProvider(this.current_image);

      }


    }
    else {
      if (flag_status == "Image") {
        for (var i = 0; i < imageryLayers._layers.length; i++) {
          if (imageryLayers._layers[i].imageryProvider._layer == table_name) {
            imageryLayers._layers[i].show = false;
          }
        }
      } else {
        this.add_remove_3d_data_new(table_name, false);
      }
    }
  }



  get_state_name() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.commonService.getStateName().subscribe((data: any) => {
      this.dropDownData = data;
       // console.log(this.dropDownData);
    });
  }

  get_layer_panel_data(pageName, stateId) {
    this.data = [];
    var formData = {
      "page_name": pageName,
      "state_id": stateId
    }

    this.commonService.getLayerAndImagePanel(formData).subscribe((data: any) => {
      this.data = data.data;
    //  console.log(this.data);
    });


  }


  async add_remove_3d_data_new(assest_id, flag) {
    if (flag) {
      //var _3dTileSet = await Cesium.Cesium3DTileset.fromIonAssetId(asset_id); //2409626 //2411758
      var tileurl = "https://re-gis.mcgm.gov.in:9443/data/" + assest_id + "/tileset.json";
      var _3dTileSet = await Cesium.Cesium3DTileset.fromUrl(tileurl); //2409626 //2411758
      this.viewer.scene.primitives.add(_3dTileSet);
      this.viewer.flyTo(_3dTileSet);
      this.map_3d_data.push(_3dTileSet);
      this.map_3d_data[assest_id] = _3dTileSet;
    } else {
      this.map_3d_data[assest_id].show = false;
    }
  }


  /* Measurement Starts */
  createPoint(worldPosition) {
    const point = this.viewer.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.RED,
        pixelSize: 5,
        //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
    return point;
  }

  drawShape(positionData) {
    let shape;
    if (this.drawingMode === "polygon") {
      debugger;
      shape = this.viewer.entities.add({
        polygon: {
          hierarchy: positionData,
          material: new Cesium.ColorMaterialProperty(
            Cesium.Color.WHITE.withAlpha(0.7)
          ),
        },
      });
    }
    return shape;
  }

  clearAllMeasurementData(){
    this.property_data = null;
    this.viewer.entities.removeAll();
  }

  clearMeasurements() {
    this.points = [];
    if (Cesium.defined(this.lineGraphics)) {
      this.viewer.entities.remove(this.lineGraphics);
    }
    for (var i = 0; i < this.labelEntities.length; i++) {
      this.viewer.entities.remove(this.labelEntities[i]);
    }
    this.labelEntities = [];
  }


  measurementType(event) {

    if (event.currentTarget.title == "Measure polyline") {
      debugger;


      this.measureEnabled = !this.measureEnabled;
      this.goto_click = false;
      this.polygonMeasureEnabled = false;
      this.info_click = false;
      this.add_bim_data_click = false;

      this.clearMeasurements();

      if (this.measureEnabled) {

        this.clearMeasurements();

        this.LineMeasurementhandler.setInputAction((click) => {

          if (!this.measureEnabled) {
            return;
          }

          if (this.dblClick == true) {
            this.points = [];
            this.clearMeasurements();
          }
          this.dblClick = false;

          var ray = this.viewer.camera.getPickRay(click.position);
          var cartesian = this.viewer.scene.pickPosition(click.position);

          if (Cesium.defined(cartesian)) {
            if (this.points.length === 0) {
              this.points.push(cartesian);
            } else {
              this.points.push(cartesian);
              this.drawLines();
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.LineMeasurementhandler.setInputAction((click) => {
          var ray = this.viewer.camera.getPickRay(click.position);
          var cartesian = this.viewer.scene.pickPosition(click.position);

          if (Cesium.defined(cartesian) && this.points.length > 1) {
            var totalDistance = 0;
            for (var i = 0; i < this.points.length - 1; i++) {
              totalDistance += Cesium.Cartesian3.distance(this.points[i], this.points[i + 1]);
            }

            console.log('Total distance between all points: ' + totalDistance.toFixed(2) + ' meters');

            var midpoint = Cesium.Cartesian3.lerp(this.points[i - 1], this.points[i], 0.5, new Cesium.Cartesian3());

//            document.getElementById('ol-popup').setAttribute('style' , 'background-color: white;    border-radius: 10px;     border: 1px solid black;      padding: 5px 10px !important;')

            var entity = this.viewer.entities.add({
              position : midpoint,
              // point : {
              //     pixelSize : 10,
              //     color : Cesium.Color.YELLOW
              // },
              label: {
                     showBackground: true  ,
                     text: totalDistance.toFixed(2) + ' meters',
                     backgroundColor: Cesium.Color.BLACK,
                     border: 1
                                        
              }
          });

          this.labelEntities.push(entity);

            // var labelEntity = this.viewer.entities.add({
            //   position: midpoint,
            //   label: {
            //     text: totalDistance.toFixed(2) + ' meters',
            //     font: '12px sans-serif',
            //     fillColor: Cesium.Color.BLACK,
            //     outlineColor: Cesium.Color.BLACK,
            //     outlineWidth: 0.5,
            //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            //   }
            // });
            // this.labelEntities.push(labelEntity);

            this.dblClick = true;
          }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

      }
    }
    else {

      this.polygonMeasureEnabled = !this.polygonMeasureEnabled;

      this.measureEnabled = false;
      this.goto_click = false;
      this.info_click = false;
      this.add_bim_data_click = false;

      this.viewer.entities.removeAll();

      this.drawingMode = "polygon";

      this.handler.setInputAction((event) => {

        if (!this.polygonMeasureEnabled) {
          return;
        }

        const ray = this.viewer.camera.getPickRay(event.position);
        const earthPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        if (Cesium.defined(earthPosition)) {
          if (this.activeShapePoints.length === 0) {
            this.floatingPoint = this.createPoint(earthPosition);
            this.activeShapePoints.push(earthPosition);
            const dynamicPositions = new Cesium.CallbackProperty(() => {
              if (this.drawingMode === "polygon") {                
                return new Cesium.PolygonHierarchy(this.activeShapePoints);
              }
              return this.activeShapePoints;
            }, false);
            this.activeShape = this.drawShape(dynamicPositions);
          }
          this.activeShapePoints.push(earthPosition);
          this.createPoint(earthPosition);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this.handler.setInputAction((event) => {
        if (Cesium.defined(this.floatingPoint)) {
          const ray = this.viewer.camera.getPickRay(event.endPosition);
          const newPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);
          if (Cesium.defined(newPosition)) {
            this.floatingPoint.position.setValue(newPosition);
            this.activeShapePoints.pop();
            this.activeShapePoints.push(newPosition);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      this.handler.setInputAction((event) => {
        if (this.drawingMode === "polygon" && this.activeShapePoints.length > 2) {

          this.geoJson = null;
          this.geoJson = this.getGeoJsonFromPolygon(this.activeShapePoints);
          this.geoJson.features[0].geometry.coordinates[0].splice(this.geoJson.features[0].geometry.coordinates[0].length - 1, 1);
          this.geoJson.features[0].geometry.coordinates[0].push(this.geoJson.features[0].geometry.coordinates[0][0]);
          const area = turf.area(this.geoJson);
          console.log(area);
          this.terminateShape();

          var cartesian = this.viewer.scene.pickPosition(event.position);

          var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);

            var entity = this.viewer.entities.add({
              position : cartesian,
              label: {
                      pixelSize: 2,
                     showBackground: true  ,
                     text: area.toFixed(2) + ' sq.m\^2',
                     backgroundColor: Cesium.Color.BLACK,
                     border: 1
                                        
              }
          });


        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


    }


  }

  getFeature(event){
    console.log(event.target.value);
    this.feature_name = event.target.value;
    this.selectFeatureDialog = false;
  }

  closeFeatureDialog() {
    this.selectFeatureDialog = false;
  }

  add_bim_data(event) {

    this.selectFeatureDialog = true;

    this.add_bim_data_click = !this.add_bim_data_click;
    this.measureEnabled = false;
    this.goto_click = false;
    this.polygonMeasureEnabled = false;
    this.info_click = false;

    this.addBimDataHandler.setInputAction((click) => {

      if (this.add_bim_data_click == false) {
        return;
      }
      else {


        this.latitude = null;
        this.longitude = null;


        var cartesian = this.viewer.scene.pickPosition(click.position);


        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        console.log(
          'lon ' + Cesium.Math.toDegrees(cartographic.longitude) + ', ' +
          'lat ' + Cesium.Math.toDegrees(cartographic.latitude) + ', ' +
          'alt ' + cartographic.height);

        this.add_data_on_click(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), "create" , "");
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  }

  add_data_on_click(long , lat , type , modelProperty){

    if(type == "create"){

    
    this.latitude = null;
    this.longitude = null;

    if(this.feature_name == "car"){
      let modelEntity = this.viewer.entities.add({
        name: "milktruck",
        position: Cesium.Cartesian3.fromDegrees(long, lat),
        model: {
          uri:
            "../../../assets/3d_data/CesiumMilkTruck.glb",
            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
        },
        
      });
      this.viewer.zoomTo(modelEntity);
    }
    else if(this.feature_name == "street_light"){
      let modelEntity = this.viewer.entities.add({
        name: "milktruck",
        position: Cesium.Cartesian3.fromDegrees(long, lat),
        model: {
          uri:
            "../../../assets/3d_data/streetLight.glb",
            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
        },
        
      });
      this.viewer.zoomTo(modelEntity);
    }

    this.latitude = lat;
    this.longitude = long;

    this.editDialog = true;
  }

  else{
    debugger;

    console.log(modelProperty);


    let modelEntity = this.viewer.entities.add({
      name: "milktruck",
      position: Cesium.Cartesian3.fromDegrees(long, lat),
      model: {
        uri:
          "../../../assets/3d_data/CesiumMilkTruck.glb",
          heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
      },
      //properties: propertyBag
      
    });

    modelEntity.addProperty('latitude');
    modelEntity.latitude = modelProperty.latitude;

    modelEntity.addProperty('longitude');
    modelEntity.longitude = modelProperty.longitude;

    modelEntity.addProperty('layer_name');
    modelEntity.layer_name = modelProperty.layer_name;

    modelEntity.addProperty('description_feature');
    modelEntity.description_feature = modelProperty.description;

    this.viewer.zoomTo(modelEntity);




  }

    
  
  }

  add_bim_data_to_db($event){
    
    var form_data = {

      latitude: this.latitude,
      longitude: this.longitude,
      flag: "create",
      bim_data_name: this.bimDataForm.controls['layer_name'].value,
      description: this.bimDataForm.controls['description'].value

    }

    console.log(form_data);

    this.commonService.crudBimData(form_data).subscribe((data: any) => {
      this.bimdata = data.data;    
    });

    this.editDialog = false;

  }

  getBimData(){

    var form_data = {

      latitude: "",
      longitude: "",
      flag: "fetch",
      bim_data_name: ""

    }

    this.commonService.crudBimData(form_data).subscribe((data: any) => {
      this.bimdata = data.data;    
      
      for(var i=0; i< this.bimdata.length; i++){
        this.add_data_on_click(this.bimdata[i].longitude , this.bimdata[i].latitude , "get" , this.bimdata[i]);
      }

    });

    


  }

  openPopup(){
    alert('Done');
    this.show = !this.show;
  }

  drawLines() {
    if (Cesium.defined(this.lineGraphics)) {
      this.viewer.entities.remove(this.lineGraphics);
    }
    for (var i = 0; i < this.labelEntities.length; i++) {
      this.viewer.entities.remove(this.labelEntities[i]);
    }

    var linePositions = [];
    var totalDistance = 0;
    for (var i = 0; i < this.points.length; i++) {
      linePositions.push(this.points[i].clone());
      if (i > 0) {
        var distance = Cesium.Cartesian3.distance(this.points[i - 1], this.points[i]);
        totalDistance += distance;
        var midpoint = Cesium.Cartesian3.lerp(this.points[i - 1], this.points[i], 0.5, new Cesium.Cartesian3());
        var labelEntity = this.viewer.entities.add({
          position: midpoint,
          label: {
            text: distance.toFixed(2) + ' meters',
            font: '12px sans-serif',
            fillColor: Cesium.Color.BLACK,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 0.5,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            //= heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          }
        });
        this.labelEntities.push(labelEntity);
      }
    }

    this.lineGraphics = this.viewer.entities.add({
      polyline: {
        positions: linePositions,
        width: 3,
        material: new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.RED,
          outlineWidth: 2,
          outlineColor: Cesium.Color.WHITE
        })
      }
    });

    // console.log('Total distance between all points: ' + totalDistance.toFixed(2) + ' meters');
  }

  terminateShape() {
    this.viewer.entities.removeAll();
    this.activeShapePoints.pop();
    this.drawShape(this.activeShapePoints);
    this.viewer.entities.remove(this.floatingPoint);
    this.viewer.entities.remove(this.activeShape);
    this.floatingPoint = undefined;
    this.activeShape = undefined;
    this.activeShapePoints = [];
  }

  getGeoJsonFromPolygon(positionData) {
    const positions = positionData.map(position => {
      const cartographic = Cesium.Cartographic.fromCartesian(position);
      return [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
    });


    const geoJson = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [positions]
          },
          "properties": {}
        }
      ]
    }

    return geoJson;
  }


  /* Measurement Ends */

  /** INFO CLICK */
  featureInfo() {

    this.goto_click = false;
    this.measureEnabled = false;
    this.polygonMeasureEnabled = false;

    if (this.info_click == true) {
      //document.querySelector("#property_tbl").setAttribute("style" , "display: none");
      this.info_click = false;
    }
    else {
      this.info_click = true;
    }


    let infoClickHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

    infoClickHandler.setInputAction((movement) => {

      if (!this.info_click) {
        return;
      }
      else {

        this.silhouetteGreen.selected = [];

        // Pick a new feature
        var pickedFeature = this.viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedFeature)) {
          //clickHandler(movement);
          return;
        }

        // Select the feature if it's not already selected
        if (this.silhouetteGreen.selected[0] === pickedFeature) {
          return;
        }

        // Save the selected feature's original color
        var highlightedFeature = this.silhouetteBlue.selected[0];
        if (pickedFeature === highlightedFeature) {
          this.silhouetteBlue.selected = [];
        }

        // Highlight newly selected feature
        this.silhouetteGreen.selected = [pickedFeature];

        // Set feature infobox description
        var featureName = pickedFeature.getProperty("Prabhag");

        this.property_data = [
          {
            value: 'UID',
            field: pickedFeature.getProperty("Prabhag"),
          },
          {
            value: 'Area Sq.m',
            field: pickedFeature.getProperty("Area_Sq_m"),
          },
          {
            value: 'Height m',
            field: pickedFeature.getProperty("Height_m"),
          },
          {
            value: 'X',
            field: pickedFeature.getProperty("X"),
          },
          {
            value: 'Y',
            field: pickedFeature.getProperty("Y"),
          },
          {
            value: 'FUID',
            field: pickedFeature.getProperty("FUID"),
          },
          {
            value: 'Ward',
            field: pickedFeature.getProperty("Ward"),
          },
          {
            value: 'Prabhag',
            field: pickedFeature.getProperty("Prabhag"),
          },
          {
            value: 'Zone',
            field: pickedFeature.getProperty("Zone"),
          },
          {
            value: 'Sq Km.',
            field: pickedFeature.getProperty("Sq_Km"),
          },
          {
            value: 'Height Category',
            field: pickedFeature.getProperty("B_Category"),
          }

        ]

        //document.querySelector("#property_tbl").setAttribute("style" , "display: block");

      }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


  }




  /** Highlight Building */

  per_selection() {

    this.goto_click = false;
    this.measureEnabled = false;
    this.info_click = false;
    this.polygonMeasureEnabled = false;


    this.viewer.screenSpaceEventHandler.setInputAction((movement) => {

      let element = document.getElementById("per_selection") as HTMLInputElement;
      if (!element.checked) {
        return;
      }
      else {

        if (Cesium.defined(this.selected.feature)) {
          this.selected.feature.color = this.selected.originalColor;
          this.selected.feature = undefined;
        }

        var pickedFeature = this.viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedFeature)) {
          //this.clickHandler(movement);
          return;
        }

        if (this.selected.feature === pickedFeature) {
          return;
        }
        this.selected.feature = pickedFeature;

        if (pickedFeature === this.highlighted.feature) {
          Cesium.Color.clone(
            this.highlighted.originalColor,
            this.selected.originalColor
          );
          this.highlighted.feature = undefined;
        } else {
          Cesium.Color.clone(pickedFeature.color, this.selected.originalColor);
        }

        pickedFeature.color = Cesium.Color.LIME;

      }


    },
      Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /** Highlight Building */

  /* GOTO */

  goto_location() {

    this.info_click = false;
    this.measureEnabled = false;
    this.polygonMeasureEnabled = false;

    if (this.goto_click == true) {
      this.goto_click = false;
    }
    else {
      this.goto_click = true;
    }


    let myMouseHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

    myMouseHandler.setInputAction((e) => {

      if (!this.goto_click) {
        return;
      }
      else {

        var scene = this.viewer.scene;
        if (scene.mode !== Cesium.SceneMode.MORPHING) {
          var pickRay = scene.camera.getPickRay(e.position);
          var cartesian = scene.globe.pick(pickRay, scene);

          if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);

            this.viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 500),
              orientation: {

                roll: 0.0,
              },
              duration: 3
            });
          }
        }

      }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  }

  changeBaseLayer(){

    this.viewer.scene.imageryLayers.removeAll();

    if(this.galleryImg == "Satellite Map"){

      document.getElementById("mat-mdc-slide-toggle-1-label").setAttribute("style" , "color: white; font-weight: 500;")
      //element.setAttribute("style", "color:red; border: 1px solid blue;");

      this.galleryImg = "Default Map"
      const imageryLayer = Cesium.ImageryLayer.fromWorldImagery(null);
      this.viewer.scene.imageryLayers.add(imageryLayer);
      
    }
    else{
      this.galleryImg = "Satellite Map"
      document.getElementById("mat-mdc-slide-toggle-1-label").setAttribute("style" , "color: black; font-weight: 500;")
      const imageryLayer = new Cesium.ImageryLayer(new Cesium.OpenStreetMapImageryProvider({
      url: "https://tile.openstreetmap.org/"
    }));
    this.viewer.scene.imageryLayers.add(imageryLayer);
  }
    
  }

  takeSS(){

    this.viewer.render();
    var captureElement: any = document.querySelector("#cesiumContainer");

    html2canvas(captureElement , {allowTaint: false, useCORS: true,}).then((canvas) => {
   
      const imageData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.setAttribute("download", "Map.png");
      link.setAttribute("href", imageData);
      link.click();
    });
  
  }

  togglePanel() {
    document.body.classList.toggle('closed-panel');
    this.state = (this.state === "closed") ? "open" : "closed";
  }

  


  ngOnInit() {

    this.bimDataForm = new FormGroup({
      layer_name: new FormControl(),
      description: new FormControl()
  });

    this.get_layer_panel_data("3D", "");

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

    var canvas = document.createElement('div');

    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

    this.LineMeasurementhandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

    this.addBimDataHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

//     var bimhandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);


//     bimhandler.setInputAction((click) =>{

//   var pickedFeature = this.viewer.scene.pick(click.position);
//   console.log(pickedFeature);

// }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    this.silhouetteGreen.uniforms.color = Cesium.Color.LIME;
    this.silhouetteGreen.uniforms.length = 0.01;
    this.silhouetteGreen.selected = [];

    this.silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
    this.silhouetteBlue.uniforms.length = 0.01;
    this.silhouetteBlue.selected = [];


    this.viewer.scene.postProcessStages.add(
      Cesium.PostProcessStageLibrary.createSilhouetteStage([
        this.silhouetteBlue,
        this.silhouetteGreen,
      ])
    );

    this.imageryLayers = this.viewer.imageryLayers;

    this.get_state_name();

  }


}
