import { Component, ElementRef, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Viewer } from 'cesium';
import * as Cesium from 'cesium';
import { CesiumDirective } from './cesium.directive';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-3d',
  standalone: true,
  //imports: [SharedModule],
  templateUrl: './3d.component.html',
  styleUrls: ['./3d.component.scss'],
  imports: [CesiumDirective,RouterOutlet,CommonModule]
  //template: '<div appCesium></div>'
})
export default class _3D {
  

}
