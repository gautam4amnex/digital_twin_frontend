import { Directive, ElementRef, OnInit } from '@angular/core';
import { Viewer } from 'cesium';
import * as Cesium from 'cesium';

//declare var Cesium:any;

@Directive({
  selector: '[appCesium]',
  standalone: true
})
export class CesiumDirective implements OnInit {

  constructor(private el: ElementRef) {}
  

  ngOnInit(): void {

    var viewer = new Cesium.Viewer(this.el.nativeElement,{
      baseLayer: new Cesium.ImageryLayer(new Cesium.OpenStreetMapImageryProvider({
              url: "https://tile.openstreetmap.org/"
             })),
    });
    

    viewer.camera.flyTo({ 
      destination: Cesium.Cartesian3.fromDegrees(72.730797, 18.891774, 25000),
      orientation: {
          heading: Cesium.Math.toRadians(35.0),
          pitch: Cesium.Math.toRadians(-45.0),
          roll: 0.0,
      },
    });

    this.add_remove_3d_data_new(viewer);
    

  }

  async add_remove_3d_data_new(viewer:any) {
    let _3dTileSet = await Cesium.Cesium3DTileset.fromUrl("https://re-gis.mcgm.gov.in:9443/data/Building_A/tileset.json");
    _3dTileSet.show = true;
    viewer.scene.primitives.add(_3dTileSet);
    viewer.flyTo(_3dTileSet);
  }
  
    
}

