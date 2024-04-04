// import { ElementRef, OnInit, Component } from '@angular/core';
// import { Viewer } from 'cesium';
// import * as Cesium from 'cesium';

// //declare var Cesium:any;

// @Component({
//   selector: '[appCesium]',
//   standalone: true,
//   template: ''
// })
// export class CesiumDirective implements OnInit {

//   current_image: any;
//   viewer: any;

//   constructor(private el: ElementRef) { }

//   showHide(event, checked_unchecked) {

//   }


//   ngOnInit(): void {

//     this.viewer = new Cesium.Viewer(this.el.nativeElement, {
//       baseLayer: new Cesium.ImageryLayer(new Cesium.OpenStreetMapImageryProvider({
//         url: "https://tile.openstreetmap.org/"
//       })),
//     });


//     this.viewer.camera.flyTo({
//       destination: Cesium.Cartesian3.fromDegrees(72.730797, 18.891774, 25000),
//       orientation: {
//         heading: Cesium.Math.toRadians(35.0),
//         pitch: Cesium.Math.toRadians(-45.0),
//         roll: 0.0,
//       },
//     });

//     this.add_remove_3d_data_new('Building_D','');


//   }

//   async add_remove_3d_data_new(asset_id, flag) {
//     alert(asset_id);
//     let _3dTileSet = await Cesium.Cesium3DTileset.fromUrl("https://re-gis.mcgm.gov.in:9443/data/"+ asset_id  +"/tileset.json");
//     _3dTileSet.show = true;
//     debugger;
//     console.log(this.viewer);
//     this.viewer.scene.primitives.add(_3dTileSet);
//     this.viewer.flyTo(_3dTileSet);
//   }


// }

