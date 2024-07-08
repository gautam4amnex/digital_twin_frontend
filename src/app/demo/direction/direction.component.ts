import { Component, OnInit } from '@angular/core';
import Openrouteservice from 'openrouteservice-js';
import { transform } from 'ol/proj';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-direction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss']
})
export class DirectionComponent implements OnInit {
  ol: any = window['ol'];
  state = "closed";
  osm: any;
  map: any;
  source = new this.ol.source.Vector();

  vector = new this.ol.layer.Vector({
    source: this.source,
    style: new this.ol.style.Style({
      stroke: new this.ol.style.Stroke({
        color: '#0e97fa',
        width: 4
      })
    })
  });

  view: any;
  orsDirections: any;
  pointStyle: any;
  start: any[];
  end: any[];

  ngOnInit(): void {
    this.osm = new this.ol.layer.Tile({
      source: new this.ol.source.OSM()
    });

    this.view = new this.ol.View({
      projection: 'EPSG:3857',
      center: this.ol.proj.fromLonLat([75.352478, 19.901054]),
      zoom: 12
    });

    this.map = new this.ol.Map({
      layers: [this.osm],
      target: 'map',
      view: this.view
    });
    this.pointStyle = new this.ol.style.Style({
      image: new this.ol.style.Icon({
        anchor: [0.5, 1],
        src: 'https://apagri.infinium.management/temp/point_icon.png',
      })
    });

    this.map.addLayer(this.vector);

    this.orsDirections = new Openrouteservice.Directions({
      api_key: "5b3ce3597851110001cf624837d0d92fba7048cd85a8893a7148bfdb",
      host: "https://api.openrouteservice.org"
    });

    // Example of fetching directions
    // this.getDirections([75.352478, 19.901054], [72.877426, 19.076090]);
  }

  getDirections(start: number[], end: number[]): void {
    this.orsDirections.calculate({
      coordinates: [start, end],
      profile: 'driving-car',
      format: 'geojson'
    })
    .then((json: any) => {
      console.log(json);

      // Assuming geojson contains a feature collection
      let features = new this.ol.format.GeoJSON().readFeatures(json, {
        featureProjection: 'EPSG:3857'
      });

      this.source.addFeatures(features);
      this.count=0;
    })
    .catch((error: any) => {
      console.error(error);
    });
  }
count=0
  findCoords(evt: any): void {
    this.count+=1;
    const coordinate = this.map.getEventCoordinate(evt);
    console.log('Event coordinate:', coordinate);
  
    const transformedCoordinate = this.ol.proj.toLonLat(coordinate);
    console.log('Transformed coordinate:', transformedCoordinate);

    let addMarkserFeature = new this.ol.Feature({
      geometry: new this.ol.geom.Point(this.ol.proj.fromLonLat(transformedCoordinate)),
      featureProjection: 'EPSG:3826',
  });

    var vector_layer = new this.ol.layer.Vector({
      source: new this.ol.source.Vector({ features: [addMarkserFeature] })
    });

    addMarkserFeature.setStyle(this.pointStyle);
    this.map.addLayer(vector_layer);
    
    if(this.count==1){
       this.start=transformedCoordinate;
       console.log('start coordinate:', this.start);
   
    }
    if(this.count==2){
      this.end=transformedCoordinate;
      this.getDirections( this.start, this.end);
      console.log('end coordinate:', this.end);
    }

  }
  isSourcePickActive: boolean = false;
  isDestinationPickActive: boolean = false;

  toggleSourcePick() {
    this.isSourcePickActive = !this.isSourcePickActive;
  }

  toggleDestinationPick() {
    this.isDestinationPickActive = !this.isDestinationPickActive;
  }
  
}
