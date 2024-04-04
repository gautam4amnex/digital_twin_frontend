// import { NgModule, Inject, Injectable } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { NotifierOptions, NotifierService } from 'angular-notifier';

// @Injectable({
//   providedIn: 'root'
// })
// export class UtilsModule {

//   public SUCCESS_TAG = 'success';
//   public ERROR_TAG = 'error';


//   private notifier: NotifierService;
//   constructor(notifierService: NotifierService) {
//     this.notifier = notifierService;
//   }

//   public notify(type = this.ERROR_TAG, header = "", message = "") {
//     this.notifier.notify(type, header);
//   }
  
// }
// export const customNotifierOptions: NotifierOptions = {
//   position: {
//     horizontal: {
//       position: 'right',
//       distance: 12
//     },
//     vertical: {
//       position: 'top',
//       distance: 12,
//       gap: 10
//     }
//   },
//   theme: 'material',
//   behaviour: {
//     autoHide: 3000,
//     onClick: 'hide',
//     onMouseover: 'pauseAutoHide',
//     showDismissButton: true,
//     stacking: 4
//   },
//   animations: {
//     enabled: true,
//     show: {
//       preset: 'slide',
//       speed: 300,
//       easing: 'ease'
//     },
//     hide: {
//       preset: 'fade',
//       speed: 300,
//       easing: 'ease',
//       offset: 50
//     },
//     shift: {
//       speed: 300,
//       easing: 'ease'
//     },
//     overlap: 150
//   }
// };