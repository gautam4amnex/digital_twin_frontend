import { Component, ElementRef, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Viewer } from 'cesium';
import * as Cesium from 'cesium';
import { CesiumDirective } from './cesium.directive';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import axios from 'axios';


@Component({
  selector: 'app-3d',
  standalone: true,
  //imports: [SharedModule],
  templateUrl: './3d.component.html',
  styleUrls: ['./3d.component.scss'],
  imports: [CesiumDirective, RouterOutlet, CommonModule]
  //template: '<div appCesium></div>'
})

export default class _3D {
  data: any;

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
        if(res.data.responseCode == 200){
          debugger
          console.log(res.data.data);
          this.data = res.data.data;
        }
       })


      .catch((err) => { });

  }


  ngOnInit() {

    this.get_layer_panel_data();

  }

}
