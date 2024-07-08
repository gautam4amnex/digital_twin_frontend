import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import Openrouteservice from 'openrouteservice-js';
import { transform } from 'ol/proj';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-direction',
  standalone: true,
  imports: [CommonModule,HttpClientModule,HttpClientModule],
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
  current_coords: number[];
  picked_coords:any[];

  source_element=document.getElementById('input_start');
  destination_element=document.getElementById('input_end');
  isSourcePickActive: boolean = false;
  isDestinationPickActive: boolean = false;
  inputValueSource: any[] =['empty'] ;
  inputValueDestination:any[]=['empty'];
  
  constructor(private http: HttpClient) {}
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

   
    // this.getDirections([72.474672,23.001824], [72.471732,22.987879]);

    
  }

  getDirections(start: number[], end: number[]): void {

    this.http.get(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624837d0d92fba7048cd85a8893a7148bfdb&start=${start}&end=${end}`).subscribe(
      (data)=>{
      // let json = new this.ol.format.GeoJSON();
     
      let features = new this.ol.format.GeoJSON().readFeatures(data, {
        featureProjection: 'EPSG:3857'
      });
      let extent = this.ol.extent.createEmpty();
      features.forEach((feature: any) => {
      this.ol.extent.extend(extent, feature.getGeometry().getExtent());
    });

    // Get the center of the extent
    // let center = this.ol.extent.getCenter(extent);

    // Zoom the map to the center of the extent
    this.map.getView().fit(extent, { duration: 2000,  maxZoom: 14 });
    // this.map.getView().setZoom(14); 
      this.source.addFeatures(features);
      this.map.addLayer(this.vector);
    })
    // .catch((error: any) => {
    //   console.error(error);
    //   alert('route not available');
    // });


    // this.orsDirections.calculate({
    //   coordinates: [start, end],
    //   profile: 'driving-car',
    //   format: 'geojson'
    // })
    // .then((json: any) => {
    //   console.log(json);

    //   let features = new this.ol.format.GeoJSON().readFeatures(json, {
    //     featureProjection: 'EPSG:3857'
    //   });
    //   let extent = this.ol.extent.createEmpty();
    //   features.forEach((feature: any) => {
    //   this.ol.extent.extend(extent, feature.getGeometry().getExtent());
    // });

    // // Get the center of the extent
    // // let center = this.ol.extent.getCenter(extent);

    // // Zoom the map to the center of the extent
    // this.map.getView().fit(extent, { duration: 2000,  maxZoom: 14 });
    // // this.map.getView().setZoom(14); 
    //   this.source.addFeatures(features);
    
    // })
    // .catch((error: any) => {
    //   console.error(error);
    //   alert('route not available');
    // });
  }

  findCoords(evt: any) {
  
  if(this.isSourcePickActive){
    debugger
    const coordinate = this.map.getEventCoordinate(evt);
    const transformedCoordinate = this.ol.proj.toLonLat(coordinate);
    this.picked_coords=transformedCoordinate;
    console.log(this.picked_coords);
    
    this.start=this.picked_coords
     console.log('start',this.start);
     this.inputValueSource=this.start;
     this.addMarker(this.start);
    this.isSourcePickActive = false;
    this.picked_coords=[];
  }
  if (this.isDestinationPickActive) {

    const coordinate = this.map.getEventCoordinate(evt);
    console.log('Event coordinate:', coordinate);
  
    const transformedCoordinate = this.ol.proj.toLonLat(coordinate);
    console.log('Transformed coordinate:', transformedCoordinate);

    this.picked_coords=transformedCoordinate;
    console.log(this.picked_coords);
    this.end=this.picked_coords
      console.log('end',this.end);
      
      this.inputValueDestination=this.end;
      this.addMarker(this.end);
      this.isDestinationPickActive = false;
      this.picked_coords=[];
    
  } 
     
  

 
  }

addMarker(geo_coords){

  let addMarkserFeature = new this.ol.Feature({
    geometry: new this.ol.geom.Point(this.ol.proj.fromLonLat(geo_coords)),
    featureProjection: 'EPSG:3826',
});

  var vector_layer = new this.ol.layer.Vector({
    source: new this.ol.source.Vector({ features: [addMarkserFeature] })
  });

  addMarkserFeature.setStyle(this.pointStyle);
  this.map.addLayer(vector_layer);
  

}

// this.Map.cal{

//   if(this.isSourcePickActive){
//     this.findCoords(event);
//   }
// }


async pickLocation(value:any,event:any) {
    
    if(value=='start')
    {
      this.isSourcePickActive = true;

    }
    else{
      this.isDestinationPickActive = true;
  
    }
   
  }

 

  getCurrentLocation(value:any): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.current_coords = [position.coords.longitude, position.coords.latitude];
        console.log('coords',this.current_coords);
        this.addMarker(this.current_coords);
        if(value=='start'){
          this.start=this.current_coords;
          console.log('start',this.start);
          this.inputValueSource=this.start;
   
        }
        else{

          this.end=this.current_coords;
          console.log('end',this.end);
          this.inputValueDestination=this.end;
  
        }

      });
    }
     else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  findRoute(){
    if(this.start!=null && this.end!=null){
      console.log('this.start, this.end',this.start, this.end)
      this.getDirections(this.start, this.end);
    }
    else{
      alert('enter both coords');
    }
   
    
  }
  clear(){
    this.start=[''];
    this.end=[''];
    this.source.clear(); 
   
  }
}
