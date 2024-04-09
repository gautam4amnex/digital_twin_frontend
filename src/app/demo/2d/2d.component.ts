import { Component, ElementRef, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Viewer } from 'cesium';
import * as Cesium from 'cesium';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';import { NgModule } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './2d.component.html',
  styleUrls: ['./2d.component.scss'],
})
export default class _2D {
  map: Map;

  constructor() { }

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap() {
    this.map = new Map({
      target:'map' ,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
  }
}
