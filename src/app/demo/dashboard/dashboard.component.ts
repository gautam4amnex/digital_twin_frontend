// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MapController } from '../utils/mapController';

//
import * as Cesium from 'cesium';

declare const AmCharts: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MapController]
})
export default class DashboardComponent implements OnInit {
  
  public mapConroller: any;
  public viewer: any;

  constructor(private mapConroller1 : MapController){
    this.mapConroller = mapConroller1;
  }

  ngOnInit() {
    this.mapConroller.initMap();
  }



}


