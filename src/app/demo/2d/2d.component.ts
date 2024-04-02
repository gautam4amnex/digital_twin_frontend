import { Component, ElementRef, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Viewer } from 'cesium';
import * as Cesium from 'cesium';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-2d',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './2d.component.html',
  styleUrls: ['./2d.component.scss'],
})
export default class _2D {

}
