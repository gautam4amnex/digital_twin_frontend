// angular import
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MapController } from '../utils/mapController';
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";

import * as Cesium from 'cesium';
import { CommonsService } from 'src/app/services/commons.service';


declare const AmCharts: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule, DropDownsModule, InputsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MapController]
})
export default class DashboardComponent implements OnInit {
  //public mapConroller: any;
  public viewer: any;
  constructor(
    private mapController: MapController, 
    private commonService: CommonsService, ) {}
  ngOnInit() {
    this.mapController.initMap();
    this.mapController.temp_data_new();
   }

}
