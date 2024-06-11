// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,

  KENDO_UI_LICENSE: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkxJQyJ9.eyJwcm9kdWN0cyI6W3sidHJpYWwiOmZhbHNlLCJjb2RlIjoiS0VORE9VSVJFQUNUIiwibGljZW5zZUV4cGlyYXRpb25EYXRlIjoxNzM5ODYxMDkzfSx7InRyaWFsIjpmYWxzZSwiY29kZSI6IktFTkRPVUlDT01QTEVURSIsImxpY2Vuc2VFeHBpcmF0aW9uRGF0ZSI6MTczOTg2MTA5M30seyJ0cmlhbCI6ZmFsc2UsImNvZGUiOiJLRU5ET1VJVlVFIiwibGljZW5zZUV4cGlyYXRpb25EYXRlIjoxNzM5ODYxMDkzfSx7InRyaWFsIjpmYWxzZSwiY29kZSI6IktFTkRPVUlBTkdVTEFSIiwibGljZW5zZUV4cGlyYXRpb25EYXRlIjoxNzM5ODYxMDkzfV0sImludGVncml0eSI6Iko4cDBhblZXVzE5XC9UYnViN3pESnJvam1Zblk9IiwibGljZW5zZUhvbGRlciI6ImFydmluZEBhbW5leC5jb20iLCJpYXQiOjE3MDkxOTA2MjYsImF1ZCI6Im1hdWxpa0BhbW5leC5jb20iLCJ1c2VySWQiOiJkZTk4NWU5OS1kOTE4LTQ3YmMtODA3MC1hYTlmZmIyMTUwNGQifQ.QMFdhyXCmhsmSlX-i_DVbsrmIDbGMa5np6ioPgP53KwJHC8CKz7lzH0GBxxp_qS-Icws0vsPyUKX3tGiCE7_tWM41Q9xZRWJ-UZrlv2VBpS76tCTdEw_wVOY65ovcCCJPbiXEmac5arg0MQ5_RpIfMKOXhN3rvpYx0E-sbYXg3jHOuqq8es5DyXFbF293tsO3NlqKY8CVrns1kPaoWIaOwLtcl5ZIZg5da6WhOuSYmDHDTVdmxQV4Oj6kJCdFVhVba_xIdQbyqr3RtpLJkdECSLddcrRPPPr5Gd4fq1apaZHluoCd9BYc5ZjE0GVYXSfkUOtdXS_vuot-pleT9KBJg',

  // Local Server
  baseUrl:'http://localhost:8090/digitaltwin/',
  //baseUrl:'http://localhost:9090/midcgis/',

  // Staging Server - digitaltwin
  //baseUrl:'https://apagri.infinium.management/digitaltwin/',

  //Local - MIDC
  // baseUrl:'http://localhost:9090/midcgis/',
  
  //Staging - MIDC
  //baseUrl:'https://apagri.infinium.management/midcgis/',


  //baseUrl_midc:'https://apagri.infinium.management/midcgis/',
  baseUrl_midc:'http://localhost:9090/midcgis/',

  //MIDC Server
  //baseUrl: 'https://apagri.infinium.management/midcgis'


};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
