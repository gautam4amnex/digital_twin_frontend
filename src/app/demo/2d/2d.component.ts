import { Component, ElementRef, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Viewer } from 'cesium';
import * as Cesium from 'cesium';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; import { NgModule } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import * as glob from '../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CommonsService } from 'src/app/services/commons.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import axios from 'axios';
import html2canvas from 'html2canvas'; 


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [SharedModule, MatButtonToggleModule, MatIconModule],
  templateUrl: './2d.component.html',
  styleUrls: ['./2d.component.scss'],
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
})

export default class _2D {
  
  data: any;
  ol: any = window['ol'];
  state = "closed";
  osm: any;
  map: any;
  table_name: any
  mobile_service_url: any
  current_layer: any;
  layer_id: any
  Measuredraw: any = null;
  GoToVectorLayer: any = null;
  location_mark : any;
  view: any;
  clickHandler: any;

  curr_layer_source_arr: any[] = [];
  curr_layer_source: any =  null;
  goto_click = false;
  info_click = false;

  projection = this.ol.proj.get('EPSG:3857');
  projectionExtent = this.projection.getExtent();
  size = this.ol.extent.getWidth(this.projectionExtent) / 256;
  resolutions = new Array(25);
  matrixIds = new Array(25);
  map_layers: any[] = [];
  vector_arr: any[] = [];
  drawsource: any;

  drawvector: any;

  source = new this.ol.source.Vector();

  vector = new this.ol.layer.Vector({
    source: this.source,
    style: new this.ol.style.Style({        
      stroke: new this.ol.style.Stroke({
        color: '#0e97fa',
        width:4
      })
    })
  });


  container: any = document.getElementById('popup') as HTMLElement;
  content: any = document.getElementById('popup-content') as HTMLElement;
  closer: any = document.getElementById('popup-closer') as HTMLElement;
  calculated_measurement: any = "";

  overlay = new this.ol.Overlay({
    element: this.container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

  gridarr: any[] = [];
  gridInfoKeys: any;

  private baseUrl1 = glob.environment.baseUrl;
  constructor(private http: HttpClient, private commonService: CommonsService) { }

  ngOnInit(): void {

    this.get_layer_panel_data("2D", "");

    this.osm = new this.ol.layer.Tile({
      source: new this.ol.source.OSM()
    });

    this.view = new this.ol.View({
      projection: 'EPSG:3857',
      center: this.ol.proj.fromLonLat([72.893189, 19.076986]),
      zoom: 12,
    });

    this.map = new this.ol.Map({
      layers: [this.osm],
      target: 'map',
      view: this.view
    });

    this.map.addLayer(this.vector);		

    for (let z = 0; z < 25; ++z) {
      this.resolutions[z] = this.size / Math.pow(2, z);
      this.matrixIds[z] = z;
    }
    this.map.addOverlay(this.overlay);
    //this.map.addLayer(this.drawvector);


  }


  toggleCollapse(parentLayerId: number) {
    const collapseId = 'panelsStayOpen-collapse' + parentLayerId;
    const collapseElement = document.getElementById(collapseId);
    if (collapseElement) {
      collapseElement.classList.toggle('show');
    }
  }

  togglePanel() {
    (this.state == "closed") ? this.state = "open" : this.state = "closed";
  }


  get_layer_panel_data(pageName, stateId) {
    this.data = [];
    var formData = {
      flag: "fetch_all",
      layer_type: "2D"
    }


    this.commonService.getLayerAndImagePanel(formData).subscribe((data: any) => {
      this.data = data;
      console.log(this.data);
    });


  }
  url: any;
  layer_name: any;
  all_layer = new Array();

  showHideData(event) {
    this.url = event.target.getAttribute("service-url");
    this.layer_name = event.target.getAttribute("layer_name");
    this.layer_id = event.target.getAttribute("layer_id");

    const flag_status =           event.target.getAttribute("dataid");
    const service_url =           event.target.getAttribute("service-url");
    const mobile_service_url =    event.target.getAttribute("mobile_service_url");
    const is_combined_service =   event.target.getAttribute("combined_service");
    const is_info_popup =         event.target.getAttribute("is_info_popup");
    const is_attribute_info =     event.target.getAttribute("is_attribute_info");
    const layer_name =            event.target.getAttribute("layer_name");
    const defination =            event.target.getAttribute("defination");
    const parent_layer =          event.target.getAttribute("parent_layer");
    const table_name =            event.target.getAttribute("value");


    if (event.target.checked == true) {


      let curr_layer_source = new this.ol.source.TileWMS({
        url: service_url,
                    params: { 'LAYERS': "MIDC:" + table_name , 'TILED': true },
                    serverType: 'geoserver',
                    transition: 0, 
        })
      
      this.curr_layer_source_arr.push(curr_layer_source);
      
      let current_layer:any = new this.ol.layer.Tile({
        source: curr_layer_source
      })

            this.map.addLayer(current_layer);
            this.map_layers[table_name] = current_layer;


    }
    else {

      this.map.removeLayer(this.map_layers[table_name]);
      if (this.all_layer.includes(this.layer_name)) {
        delete this.all_layer[this.layer_id];
      }
    }
  }


  /** GOTO STARTS */


  gotoFtn() {

    if (this.GoToVectorLayer != null) {
      this.map.removeLayer(this.GoToVectorLayer);
    }


    if(this.goto_click == true){
      this.goto_click = false;
    }
    else{
      this.goto_click = true;
    }
    
    this.info_click = false;

    this.clickHandler = (evt) => {



      if (!this.goto_click) {
        return;
      }
      else {
        if (this.GoToVectorLayer != null) {
          this.map.removeLayer(this.GoToVectorLayer);
        }

        console.info(evt.pixel);
        console.info(this.map.getPixelFromCoordinate(evt.coordinate));
        console.info(this.ol.proj.fromLonLat(evt.coordinate));

        var know_your_coordinate = this.ol.proj.fromLonLat(evt.coordinate, 'EPSG:4326', 'EPSG:3857');

        console.log(know_your_coordinate);
        const iconFeature = new this.ol.Feature({
          geometry: new this.ol.geom.Point(know_your_coordinate)
        });

        const vectorSource = new this.ol.source.Vector({
          features: [iconFeature],
        });

        this.GoToVectorLayer = new this.ol.layer.Vector({
          source: vectorSource,
          //style: location_mark,
        });
        this.map.addLayer(this.GoToVectorLayer);


        this.view.animate({
          projection: 'EPSG: 4326',
          center: [know_your_coordinate[0], know_your_coordinate[1]],
          duration: 2000,
          zoom: 20
        });
      }

    }

    this.map.on('click', this.clickHandler);

  }

  /** INFO STARTS */

  featureInfo() {

    this.info_click = true;
    this.goto_click = false;

    if (!this.info_click) {
      return;
    }
    else {



      this.clickHandler = (evt) => {

        var clickedFeatures = [];
        this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          clickedFeatures.push(feature);
        });

        for (let k = 0; k < this.curr_layer_source_arr.length; k++) {
          const viewResolution = /** @type {number} */ (this.view.getResolution());
          const url = this.curr_layer_source_arr[k].getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:3857', { 'INFO_FORMAT': 'application/json' });
          if (url) {

            axios.get(url)
              .then(response => {

                if(response.data.features[0].properties != null || response.data.features[0].properties != ""){

                  this.gridInfoKeys = Object.keys(response.data.features[0].properties);


                    this.gridarr = response.data.features[0].properties;

                }

                var id = document.querySelectorAll('#tbl_info');
                id.forEach(e => e.remove());

                var content = '<table id="property_tbl" class="table table-striped ng-tns-c3968409143-0" style="display: block;"><tbody _ngcontent-ng-c3968409143="" class="ng-tns-c3968409143-0">';

                for (var i = 0; i < this.gridInfoKeys.length; i++) {

                  if (this.gridInfoKeys[i] != 'orientation') {
                    
                    this.gridInfoKeys[i].replace("/_/g" , " ");

                    content += '<tr><th>' + this.gridInfoKeys[i] + '</th>' + '<td>' + this.gridarr[this.gridInfoKeys[i]] + '</td></tr>';
                    
                  }

                }

                this.addPropertyInfoPopup(content , evt.coordinate);

                console.log(response);
              })
              .catch(error => {

                console.error(error);
              });
          }
        }

      }
    }

    this.map.on('click', this.clickHandler);

  }


  /** INFO ENDS */


  takeSS(){

    var captureElement: any = document.querySelector("#map");

    html2canvas(captureElement , {allowTaint: false, useCORS: true,}).then((canvas) => {
   
      const imageData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.setAttribute("download", "Map.png");
      link.setAttribute("href", imageData);
      link.click();
    });
  
  }

  /** GOTO ENDS */

  addDrawInteraction(geometryType) {   

    this.drawsource = new this.ol.source.Vector({ wrapX: false });

    this.drawvector = new this.ol.layer.Vector({
      source: this.drawsource,
      style: new this.ol.style.Style({        
        stroke: new this.ol.style.Stroke({
          color: '#0e97fa',
          width:4
        })
      })
    });


    this.Measuredraw = new this.ol.interaction.Draw({
      source: this.drawsource,
      //type: geometryType,
      type: /** @type {ol.geom.GeometryType} */ (geometryType)
    });
    this.map.addInteraction(this.Measuredraw);
    this.map.addLayer(this.drawvector);
    
    this.vector_arr.push(this.drawvector);
    var measurementFormatted;
    this.Measuredraw.on('drawstart', function (event) {
      

      event.feature.on('change', function (event) {
        var measurement = geometryType === 'Polygon' ? event.target.getGeometry().getArea() : event.target.getGeometry().getLength();

        measurementFormatted = measurement > 1000 ? (measurement / 1000).toFixed(2) + 'km' : measurement.toFixed(2) + 'm';

        console.log(measurementFormatted);

      });
    });

    this.Measuredraw.on('drawend', (event) => {
      const geometry = event.feature.getGeometry();
      const coordinate = geometry.getLastCoordinate();

      if (measurementFormatted) {
        this.addPopupOverlay(measurementFormatted, coordinate);
      }

    });
  }

  clearDrawnFeature(){

    if (this.Measuredraw != null) {
      this.map.removeInteraction(this.Measuredraw);
      this.Measuredraw = null; 
    }
  
    var id = document.querySelectorAll('#ol-popup');
    id.forEach(e => e.remove());

    var id = document.querySelectorAll('#tbl_info');
    id.forEach(e => e.remove());
   
    console.log(this.vector_arr);

    for (var i = 0; i < this.vector_arr.length; i++) {      
      this.map.removeLayer(this.vector_arr[i]); 
    }
  

    this.vector_arr = [];
  
    this.map.removeLayer(this.GoToVectorLayer);

  }

  addPopupOverlay(content: string, coordinate: any): void {
    
    const popupElement = document.createElement('div');
    popupElement.id = 'ol-popup';
    popupElement.innerHTML = content;

    const popupOverlay = new this.ol.Overlay({
      element: popupElement,
      position: coordinate,
      positioning: 'bottom-center',
      stopEvent: true,
    });

    this.map.addOverlay(popupOverlay);

    document.getElementById('ol-popup').setAttribute('style' , 'background-color: white;    border-radius: 10px;     border: 1px solid black;      padding: 5px 10px !important;')

  }
  
  addLineStringMeasurement(): void {
    if(this.Measuredraw != null){
      this.map.removeInteraction(this.Measuredraw);
    }
    
    this.addDrawInteraction('LineString');
  }

  addPolygonMeasurement(): void {
   
    if(this.Measuredraw != null){
      this.map.removeInteraction(this.Measuredraw);
    }
    this.addDrawInteraction('Polygon');
  }

  addPropertyInfoPopup(content , coordinate){

    const popupElement = document.createElement('div');
    popupElement.id = 'tbl_info';
    popupElement.innerHTML = content;

    const popupOverlay = new this.ol.Overlay({
      element: popupElement,
      position: coordinate,
      positioning: 'bottom-center',
      stopEvent: true,
    });

    this.map.addOverlay(popupOverlay);


    document.getElementById('tbl_info').setAttribute('style' , 'background-color: white;    border-radius: 10px;     border: 1px solid black;      padding: 5px 10px !important;');


  }


}