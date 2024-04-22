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
  Measuredraw: any
  GoToVectorLayer: any = null;
  view: any;
  clickHandler: any;

  curr_layer_source_arr: any[] = [];
  goto_click = false;
  info_click = false;


  /** Measurement Starts */

  style = new this.ol.style.Style({
    fill: new this.ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new this.ol.style.Stroke({
      color: 'rgba(255,0,0,3)',
      lineDash: [10, 10],
      width: 2,
    }),
  });

  labelStyle = new this.ol.style.Style({
    text: new this.ol.style.Text({
      font: '14px Calibri,sans-serif',
      fill: new this.ol.style.Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new this.ol.style.Fill({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      padding: [3, 3, 3, 3],
      textBaseline: 'bottom',
      offsetY: -15,
    }),
    image: new this.ol.style.RegularShape({
      radius: 8,
      points: 3,
      angle: Math.PI,
      displacement: [0, 10],
      fill: new this.ol.style.Fill({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
    }),
  });

  tipStyle = new this.ol.style.Style({
    text: new this.ol.style.Text({
      font: '12px Calibri,sans-serif',
      fill: new this.ol.style.Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new this.ol.style.Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
      padding: [2, 2, 2, 2],
      textAlign: 'left',
      offsetX: 15,
    }),
  });


  modifyStyle = new this.ol.style.Style({
    text: new this.ol.style.Text({
      text: 'Drag to modify',
      font: '12px Calibri,sans-serif',
      fill: new this.ol.style.Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new this.ol.style.Fill({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      padding: [2, 2, 2, 2],
      textAlign: 'left',
      offsetX: 15,
    }),
  });

  segmentStyle = new this.ol.style.Style({
    text: new this.ol.style.Text({
      font: '12px Calibri,sans-serif',
      fill: new this.ol.style.Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new this.ol.style.Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
      padding: [2, 2, 2, 2],
      textBaseline: 'bottom',
      offsetY: -12,
    }),
    image: new this.ol.style.RegularShape({
      radius: 6,
      points: 3,
      angle: Math.PI,
      displacement: [0, 8],
      fill: new this.ol.style.Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
    }),
  });

  segmentStyles = [this.segmentStyle];

  formatLength = function (line) {
    const length = this.ol.sphere.getLength(line, { projection: 'EPSG:4326' });
    return (length / 1000).toFixed(2) + ' km';
  };

  formatArea = function (polygon) {
    const area = this.ol.sphere.getArea(polygon, { projection: 'EPSG:4326' });
    return (area / 1000000).toFixed(2) + ' km²';
  };

  raster = new this.ol.layer.Tile({
    source: new this.ol.source.OSM(),
  });

  source = new this.ol.source.Vector();

  modify = new this.ol.interaction.Modify({
    source: this.source,
    style: this.modifyStyle
  });

  tipPoint: any;
  

  styleFunction(feature, segments, drawType, tip) {
    const styles = [];
    const geometry = feature.getGeometry();
    const type = geometry.getType();
    let point, label, line;
    if (!drawType || drawType === type || type === 'Point') {
      styles.push(style);
      if (type === 'Polygon') {
        point = geometry.getInteriorPoint();
        label = this.formatArea(geometry);
        line = new this.ol.geom.LineString(geometry.getCoordinates()[0]);
      } else if (type === 'LineString') {
        point = new this.ol.geom.Point(geometry.getLastCoordinate());
        label = this.formatLength(geometry);
        line = geometry;
      }
    }
    if (segments && line) {
      let count = 0;
      line.forEachSegment(function (a, b) {
        const segment = new this.ol.geom.LineString([a, b]);
        const label = this.formatLength(segment);
        if (this.segmentStyles.length - 1 < count) {
          this.segmentStyles.push(this.segmentStyle.clone());
        }
        const segmentPoint = new this.ol.geom.Point(segment.getCoordinateAt(0.5));
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

  vector = new this.ol.layer.Vector({
    source: this.source,
    style: function (feature) {
      return this.styleFunction(feature, true);
    },
  });

  addInteraction(event) {
    const drawType = event.currentTarget.title;
    const activeTip =
      'Click to continue drawing the ' +
      (drawType === 'Polygon' ? 'polygon' : 'line');
    const idleTip = 'Click to start measuring';
    let tip = idleTip;
    this.Measuredraw = new this.ol.interaction.Draw({
      source: this.source,
      type: drawType,
      style: (feature) : any => {
        return this.styleFunction(feature, true, drawType, tip);
      },
    });
    this.Measuredraw.on('drawstart', function () {
      if (this.clearPrevious.checked) {
        this.source.clear();
      }
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

  /** Measurement Ends */


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
  url: any;
  layer_name: any;
  all_layer = new Array();

  // addElement(element: any) {
  //   this.all_layer.push(element);

  //   this.all_layer['Hinal'] = "pancha;l";

  // }
  showHideData(event) {
    this.url = event.target.getAttribute("service-url");
    this.layer_name = event.target.getAttribute("layer_name");
    this.layer_id = event.target.getAttribute("layer_id");


    if (event.target.checked == true) {

      // this.add_layer_on_map(this.url, this.layer_id);

    }
    else {

      console.log(this.all_layer);
      this.map.removeLayer(this.all_layer[this.layer_id]);

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
        //know_your_coordinate = this.ol.proj.fromLonLat([know_your_coordinate[0], know_your_coordinate[1]], 'EPSG:3857', 'EPSG:4326');

        console.log(know_your_coordinate);

        // this.map.un('click', clickHandler);

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

        if (clickedFeatures.length > 0) {

          var selectedFeature = clickedFeatures[0];
          var properties = selectedFeature.getProperties();

          var content = "";

          for (let i in properties) {
            var value = properties[i];
            content += "<table class='table mb-0' style='font-size:0.8rem'><tbody><tr><td style='padding:0.25rem;;width:230px'><label class='mb-0'><strong> " + i.toUpperCase() + "</strong>: </label></td> <td style='padding:0.25rem'>" + value + "</td></tr></tbody></table>";
          }

          var name = properties['name'];
          var e: any = document.getElementById("model-heading");
          e.innerHTML(name)

          var contentValue: any = document.getElementById("modelContentValue");
          contentValue.innerHTML(content);

          var commonModalPopup: any = document.getElementById(commonModalPopup);
          commonModalPopup.show();
        }

        for (let k = 0; k < this.curr_layer_source_arr.length; k++) {
          const viewResolution = /** @type {number} */ (this.view.getResolution());
          const url = this.curr_layer_source_arr[k].getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326', { 'INFO_FORMAT': 'application/json' });
          if (url) {

            axios.get(url)
              .then(response => {

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
  ngOnInit(): void {

    this.get_layer_panel_data("3D", "");

    this.osm = new this.ol.layer.Tile({
      source: new this.ol.source.OSM()
    });

    this.view = new this.ol.View({
      projection: 'EPSG:4326',
      center: [75.8577, 22.7196],
      zoom: 12,
    });

    this.map = new this.ol.Map({
      layers: [this.osm],
      target: 'map',
      view: this.view
    });

    this.map.addLayer(this.vector);
		this.map.addInteraction(this.modify);					


  }

  add_layer_on_map(mobile_service_url, layer_name) {
    this.current_layer = new this.ol.layer.Tile({
      source: new this.ol.source.TileWMS({
        url: mobile_service_url,
        params: { 'LAYERS': "iscdl:" + layer_name },
        transition: 0,
        crossOrigin: 'anonymous'
      })
    });
    this.map.addLayer(this.current_layer);
    this.all_layer[layer_name] = this.current_layer;
    this.curr_layer_source_arr.push(this.current_layer.getSource());
    console.log(this.all_layer);
  }


}
