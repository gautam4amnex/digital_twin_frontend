import { Injectable } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
import { AppComponent } from 'src/app/app.component';
import * as Cesium from 'cesium';


@Injectable({
    providedIn: 'root'
})
export class MapController {

    public ol: any;
    public map: any;
    public popup: any;
    public layers: any = [];
    public pointLayer: any;
    public defaultLatLong: any[] = [75.3433, 19.8762];

    public viewer: any;


    constructor(private app: AppComponent, private commonsService: CommonsService) {
    }

    public initMap() {
        this.viewer = new Cesium.Viewer("cesiumContainer", {
            baseLayer: new Cesium.ImageryLayer(new Cesium.OpenStreetMapImageryProvider({
                url: "https://tile.openstreetmap.org/"
            })),
            fullscreenButton: false,
            selectionIndicator: false,
            infoBox: true,
            animation: false,
            timeline: false,
            shadows: false,
            skyAtmosphere: false,
            baseLayerPicker: true,
            geocoder: false
        });

        // this.viewer.camera.flyTo({
        //     destination: Cesium.Cartesian3.fromDegrees(72.730797, 18.891774, 25000),
        //     orientation: {
        //       heading: Cesium.Math.toRadians(35.0),
        //       pitch: Cesium.Math.toRadians(-45.0),
        //       roll: 0.0,
        //     },
        // });
    }


    async temp_data_new() {
        if (true) {
          var tileurl = "http://localhost:8080/fme/Test1/Metadata.FileInformation/tileset.json";

          //var tileurl = "https://apagri.infinium.management/3d/MIDCBuilding/tileset.json";
          var _3dTileSet = await Cesium.Cesium3DTileset.fromUrl(tileurl); 
          this.viewer.scene.primitives.add(_3dTileSet);
          this.viewer.flyTo(_3dTileSet);
        } 
    }

}