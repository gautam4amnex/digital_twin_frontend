import { Component, ElementRef, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Viewer } from 'cesium';
import * as Cesium from 'cesium';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; import { NgModule } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import { trigger, transition, style, animate, state } from '@angular/animations';
import * as glob from '../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { TileWMS, Vector } from 'ol/source';
import { forEachCorner } from 'ol/extent';
import { CommonsService } from 'src/app/services/commons.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Text from 'ol/style/Text';
import RegularShape from 'ol/style/RegularShape.js';
import {getLength , getArea} from 'ol/sphere';
import {  Modify,  Select} from 'ol/interaction.js';
import { LineString, Point } from 'ol/geom';
import Draw from 'ol/interaction/Draw.js';
import VectorLayer from 'ol/layer/Vector.js';



@Component({
  selector: 'app-map',
  standalone: true,
  imports: [SharedModule , MatButtonToggleModule , MatIconModule],   
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
  state = "closed";
  map: Map;
  table_name: any
  mobile_service_url: any
  current_layer: any;  
  layer_id:any
  Measuredraw: any

  showSegments: any = document.getElementById('segments');
	clearPrevious: any = document.getElementById('clear');


  style: any = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new Stroke({
      color: 'rgba(255,0,0,3)',
      lineDash: [10, 10],
      width: 2,
    }),
  });

  labelStyle: any = new Style({
    text: new Text({
      font: '14px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      padding: [3, 3, 3, 3],
      textBaseline: 'bottom',
      offsetY: -15,
    }),
    image: new RegularShape({
      radius: 8,
      points: 3,
      angle: Math.PI,
      displacement: [0, 10],
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
    }),
  });

  tipStyle: any = new Style({
    text: new Text({
      font: '12px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
      padding: [2, 2, 2, 2],
      textAlign: 'left',
      offsetX: 15,
    }),
  });

  modifyStyle: any = new Style({
    text: new Text({
      text: 'Drag to modify',
      font: '12px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      padding: [2, 2, 2, 2],
      textAlign: 'left',
      offsetX: 15,
    }),
  });

  segmentStyle: any = new Style({
    text: new Text({
      font: '12px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
      padding: [2, 2, 2, 2],
      textBaseline: 'bottom',
      offsetY: -12,
    }),
    image: new RegularShape({
      radius: 6,
      points: 3,
      angle: Math.PI,
      displacement: [0, 8],
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
    }),
  });

  segmentStyles: any = [this.segmentStyle];

  formatLength: any = function (line) {
    const length = getLength(line, {projection: 'EPSG:4326'});
        return (length / 1000).toFixed(2) + ' km';
  };

  formatArea = function (polygon) {
     const area = getArea(polygon, {projection: 'EPSG:4326'});
        return (area / 1000000).toFixed(2) + ' km²';
  };

  raster: any = new TileLayer({
    source: new OSM(),
  });

  source: any = new Vector();

  modify: any = new Modify({
    source: this.source, 
    style: this.modifyStyle
    });
  
  tipPoint: any;

  vector = new VectorLayer({
    source: this.source,
    style: function (feature) {
      return this.styleFunction(feature, this.showSegments.checked);
    },
  });

  private baseUrl1 = glob.environment.baseUrl;
  constructor(private http: HttpClient, private commonService: CommonsService) { }


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
      "page_name": pageName,
      "state_id": stateId
    }

    this.commonService.getLayerAndImagePanel(formData).subscribe((data: any) => {
      this.data = data;
      console.log(this.data);
    });


  }
url:any;
layer_name:any;
all_layer = new Array();  

// addElement(element: any) {
//   this.all_layer.push(element);

//   this.all_layer['Hinal'] = "pancha;l";

// }
  showHideData(event) {
    this.url=event.target.getAttribute("service-url");
    this.layer_name=event.target.getAttribute("layer_name"); 
    this.layer_id=event.target.getAttribute("layer_id");
   

    if (event.target.checked == true) {
     
      this.add_layer_on_map(this.url,this.layer_id );

    }
    else {
      
      console.log(this.all_layer);
      this.map.removeLayer(this.all_layer[this.layer_id]);
      
      if (this.all_layer.includes(this.layer_name)) {
      delete this.all_layer[this.layer_id];}
    }
  }




  /** MEASUREMENT STARTS */

  styleFunction(feature, drawType, tip) {
    const styles = [];
    const geometry = feature.getGeometry();
    const type = geometry.getType();
    let point, label, line;
    if (!drawType || drawType === type || type === 'Point') {
      styles.push(style);
      if (type === 'Polygon') {
        point = geometry.getInteriorPoint();
        label = this.formatArea(geometry);
        line = new LineString(geometry.getCoordinates()[0]);
      } else if (type === 'LineString') {
        point = new Point(geometry.getLastCoordinate());
        label = this.formatLength(geometry);
        line = geometry;
      }
    }
    if (line) {
      let count = 0;
      line.forEachSegment(function (a, b) {
        const segment = new LineString([a, b]);
        const label = this.formatLength(segment);
        if (this.segmentStyles.length - 1 < count) {
          this.segmentStyles.push(this.segmentStyle.clone());
        }
        const segmentPoint = new Point(segment.getCoordinateAt(0.5));
        this.segmentStyles[count].setGeometry(segmentPoint);
        this.segmentStyles[count].getText().setText(label);
        styles.push(this.segmentStyles[count]);
        count++;
      });
    }
    if (label) {
      this.labelStyle.setGeometry(point);
      this.labelStyle.getText().setText(label);
      styles.push(this.labelStyle);
    }
    if (
      tip &&
      type === 'Point' &&
      !this.modify.getOverlay().getSource().getFeatures().length
    ) {
      this.tipPoint = geometry;
      this.tipStyle.getText().setText(tip);
      styles.push(this.tipStyle);
    }
    return styles;
  }

  addInteraction(value) {
    const drawType = value;
    const activeTip =
      'Click to continue drawing the ' +
      (drawType === 'Polygon' ? 'polygon' : 'line');
    const idleTip = 'Click to start measuring';
    let tip = idleTip;
    this.Measuredraw = new Draw({
      source: this.source,
      type: drawType,
      style: (feature): any => {
        return this.styleFunction(feature, drawType, tip);
      },
    });
    this.Measuredraw.on('drawstart', function () {      
      this.source.clear();      
      this.modify.setActive(false);
      tip = activeTip;
    });
    this.Measuredraw.on('drawend', function () {
      this.modifyStyle.setGeometry(this.tipPoint);
      this.modify.setActive(true);
      this.map.once('pointermove', function () {
        this.modifyStyle.setGeometry();
      });
      tip = idleTip;
    });
    this.modify.setActive(true);
    this.map.addInteraction(this.Measuredraw);
  }


  measurementFtn(event){
    this.map.removeInteraction(this.Measuredraw);
		this.addInteraction(event.currentTarget.title);
    this.vector.changed();
	  this.Measuredraw.getOverlay().changed();
  }

  /** MEASUREMENT ENDS */

  ngOnInit(): void {
    this.get_layer_panel_data("3D", "");
    this.map = new Map({
      view: new View({
        projection: 'EPSG:4326',
				    center: [72.8777, 19.0760],
				    zoom: 11.5,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'map'
    });

    this.map.addLayer(this.vector);
    this.map.addInteraction(this.modify);		
  

  }


add_layer_on_map(mobile_service_url, layer_name) {
  this.current_layer = new TileLayer({
    source: new TileWMS({
      url: mobile_service_url,
      params: { 'LAYERS': "iscdl:" + layer_name },
      transition: 0,
      crossOrigin: 'anonymous'
    })
  });
  this.map.addLayer(this.current_layer);
  this.all_layer[layer_name] = this.current_layer;
  console.log(this.all_layer);
}

}
