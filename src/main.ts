import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Ion } from 'cesium';

(window as Record<string, any>)['CESIUM_BASE_URL'] = '/assets/cesium/';


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// Uncomment the following line and add your personal access token if you are using Cesium Ion
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YzJjMGUwNC1jNzg1LTQ5ZTktYjc3MS03ODU3NjFkYTFhNmYiLCJpZCI6MTA5Mzk5LCJpYXQiOjE2ODYxMzkyNDB9.JCZmtKITzcGIrxJVi-sa-5patZYhsk4XcItwgcOneNs';
