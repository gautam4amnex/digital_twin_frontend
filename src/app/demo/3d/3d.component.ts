import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Viewer } from 'cesium';
import * as Cesium from 'cesium';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import axios from 'axios';
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
  imports: [RouterOutlet, CommonModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatButtonToggleModule, MatIconModule],
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


  private url = glob.environment.baseUrl;

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
        console.log(this.dropDownData);
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
      console.log(this.data);
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
                debugger;
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
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


    }


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
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
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

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            this.viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 500),
              orientation: {
                //heading: Cesium.Math.toRadians(60.0),
                // pitch: Cesium.Math.toRadians(-45.0),
                roll: 0.0,
              },
              duration: 3
            });
          }
        }

      }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  }


  togglePanel() {
    document.body.classList.toggle('closed-panel');
    this.state = (this.state === "closed") ? "open" : "closed";
  }

  ngOnInit() {

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

    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

    this.LineMeasurementhandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

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

    //   this.viewer.screenSpaceEventHandler.setInputAction((movement) => {
    //     var pickedObject = this.viewer.scene.pick(movement.position);
    //     if (Cesium.defined(pickedObject)) {
    //         console.log(pickedObject);
    //     }
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.get_state_name();

  }


}
