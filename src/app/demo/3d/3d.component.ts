import { Component, ElementRef, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Viewer } from 'cesium';
import * as Cesium from 'cesium';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import axios from 'axios';

@Component({
  selector: 'app-3d',
  standalone: true,
  //imports: [SharedModule],
  templateUrl: './3d.component.html',
  styleUrls: ['./3d.component.scss'],
  imports: [RouterOutlet, CommonModule],
  //template: '<div appCesium></div>'
})

export default class _3D {
  data: any;
  viewer: any;
  

  toggleCollapse(parentLayerId: number) {
    const collapseId = 'panelsStayOpen-collapse' + parentLayerId;
    const collapseElement = document.getElementById(collapseId);
    if (collapseElement) {
      collapseElement.classList.toggle('show');
    }
  }

  showHideData(event) {
    debugger;
    //console.log(event.target.getAttribute("mobile_service_url");;
    if (event.target.checked == true) {
      var service_url = event.target.getAttribute("service-url");
      var mobile_service_url = event.target.getAttribute("mobile_service_url")
      var is_combined_service = event.target.getAttribute("combined_service");
      var parent_layer = event.target.getAttribute("parent_layer");
      var table_name = event.target.getAttribute("value");
      var flag_status = event.target.getAttribute("_id");



      if (parent_layer == "DP department layers") {

      } else if (parent_layer == "Disaster Management") {

      }
      else if (parent_layer == "3D Buildings" || parent_layer == "3D Bridge" || parent_layer == "3D Flyover"
        || parent_layer == "3D Metro Line" || parent_layer == "3D Metro Station" || parent_layer == "Vector Model") {
        //this.cesiumDirective.add_remove_3d_data_new(table_name, true);
      }


    }
    else {
      alert('checkbox is unchecked');
    }
  }


  get_layer_panel_data() {

    var formData = {
      "page_name": "3D"
    }

    axios({

      url: "http://localhost:8085/get_all_layer_and_image",
      method: "POST",
      data: formData,
    })

      .then((res) => {
        if (res.data.responseCode == 200) {
          debugger
          console.log(res.data.data);
          this.data = res.data.data;
        }
      })


      .catch((err) => { });

  }

   async add_remove_3d_data_new() {
    let _3dTileSet = await Cesium.Cesium3DTileset.fromUrl("https://re-gis.mcgm.gov.in:9443/data/Building_A/tileset.json");
    _3dTileSet.show = true;
    debugger;
    console.log(this.viewer);
    this.viewer.scene.primitives.add(_3dTileSet);
    this.viewer.flyTo(_3dTileSet);
  }


  ngOnInit() {

    this.get_layer_panel_data();

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

   this.add_remove_3d_data_new();

  }

}
