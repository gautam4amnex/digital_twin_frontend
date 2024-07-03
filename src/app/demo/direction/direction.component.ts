import { Component, OnInit } from '@angular/core';
import Openrouteservice from 'openrouteservice-js';
import GeoJSON from 'geojson';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-direction',
  standalone: true,
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
        color: '#0efa7d',
        width: 4
      })
    })
  });

  view: any;
  orsDirections: any;
  geojsondata:any;
constructor(private http:HttpClient){};

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

   
    this.http.get("https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624837d0d92fba7048cd85a8893a7148bfdb&start=72.508511,23.027203&end=70.801009,21.973743").subscribe((data)=>{
      const format = new this.ol.format.GeoJSON();
      const features = format.readFeatures(data, {
        featureProjection: 'EPSG:3857' // Ensure the projection is correct
      });
      this.source.addFeatures(features);
    }, error => {
      console.error('Error fetching route data:', error);
    });
  
    this.map.addLayer(this.vector);
    // this.orsDirections = new Openrouteservice.Directions({
    //   api_key: "5b3ce3597851110001cf624837d0d92fba7048cd85a8893a7148bfdb",
    //   host: "https://api.openrouteservice.org"
    // });

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
      const features = new this.ol.format.GeoJSON().readFeatures(json, {
        featureProjection: 'EPSG:3857'
      });

      this.source.addFeatures(features);
    })
    .catch((error: any) => {
      console.error(error);
    });
  }
}
