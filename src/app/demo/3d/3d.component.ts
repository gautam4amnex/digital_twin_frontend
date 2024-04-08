import { Component, ElementRef, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Viewer } from 'cesium';
import * as Cesium from 'cesium';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import { trigger, transition, style, animate, state } from '@angular/animations';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';


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
  imports: [RouterOutlet, CommonModule , MatInputModule , MatSelectModule , MatFormFieldModule],
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

  state = "closed";

  constructor(private http:HttpClient) { }

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  toggleCollapse(parentLayerId: number) {
    const collapseId = 'panelsStayOpen-collapse' + parentLayerId;
    const collapseElement = document.getElementById(collapseId);
    if (collapseElement) {
      collapseElement.classList.toggle('show');
    }
  }

  get_layer_by_state_id(event){


    var state_id = event.value;

    this.get_layer_panel_data("3D" , state_id);

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
    const headers = new HttpHeaders().set('Content-Type','application/json');
    let url = "http://localhost:8085/get_state_name";
    this.http.get(url, {headers:headers}).subscribe(
      result => {
      this.dropDownData=result;
      console.log(this.dropDownData);
  });
  }

  get_layer_panel_data(pageName , stateId) {
    this.data = []; // Clear the existing data before fetching new data
    var formData = {
      "page_name": pageName,
      "state_id": stateId
    }
  
    axios({
      url: "http://localhost:8085/get_all_layer_and_image",
      method: "POST",
      data: formData,
    })
    .then((res) => {
      if (res.data.responseCode == 200) {
        console.log(res.data.data);
        this.data = res.data.data;
      }
    })
    .catch((err) => { });
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


  togglePanel() {
    document.body.classList.toggle('closed-panel');
  this.state = (this.state === "closed") ? "open" : "closed";
  }
  
  ngOnInit() {

    this.get_layer_panel_data("3D" , "");
    
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      baseLayer: new Cesium.ImageryLayer(new Cesium.OpenStreetMapImageryProvider({
        url: "https://tile.openstreetmap.org/"
      })),
    });


    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(72.730797, 18.891774, 25000),
      orientation: {
        heading: Cesium.Math.toRadians(35.0),
        pitch: Cesium.Math.toRadians(-45.0),
        roll: 0.0,
      },
    });

    this.imageryLayers = this.viewer.imageryLayers;

    this.get_state_name();

  }

}
