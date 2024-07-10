import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthorizationCheckService } from './services/authorization-check.service';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        //redirectTo: 'dashboard',
        redirectTo: '/auth/signin',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component'),
        //canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {
        path: 'basic',
        loadChildren: () =>
          import('./demo/ui-elements/ui-basic/ui-basic.module').then(
            (m) => m.UiBasicModule,
          ),
        // canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./demo/pages/form-elements/form-elements.module').then(
            (m) => m.FormElementsModule,
          ),
        // canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./demo/pages/tables/tables.module').then(
            (m) => m.TablesModule,
          ),
        // canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {
        path: 'apexchart',
        loadComponent: () =>
          import('./demo/chart/apex-chart/apex-chart.component'),
        canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {
        path: 'sample-page',
        loadComponent: () =>
          import('./demo/extra/sample-page/sample-page.component'),
        canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {
        path: '3d',
        loadComponent: () =>
          import('./demo/3d/3d.component'),
        // canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {
        path: '2d',
        loadComponent: () => import('./demo/2d/2d.component'),
        canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {

        path: 'user-management-old',
       
        loadComponent: () => import('./demo/user-management_old/user-management_old.component').then(module => module.UserManagementComponent),
        // canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      // {
      //   path: 'role-management',
      //   //loadComponent: () => import('./demo/role-management/role-management.component'),
      //   loadComponent: () => import('./demo/role-management/role-management.component').then(module => module.RoleManagementComponent),
      //   canActivate: [AuthorizationCheckService],
      //   pathMatch:'full'
      // },
      {
        path: 'role-management',
        loadComponent: () => import('./demo/role-management/role-management.component'),
        // canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {
        path: 'user-management',
        loadComponent: () => import('./demo/user-management/user-management.component'),
        //canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {
        path: 'surveydetail',
        loadComponent: () => import('./demo/surveydetail/surveydetail.component'),
        pathMatch:'full'
      },
      {
        path: 'layermanagement',
        loadComponent: () => import('./demo/layer-management/layer-management.component').then(module => module.LayerManagementComponent),
        // canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {
        path: 'project-management',
        loadComponent: () => import('./demo/project-management/project-management.component').then(module => module.ProjectManagementComponent),
        // canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {
        path: 'announcement',
        loadComponent: () => import('./demo/announcement/announcement.component').then(module => module.AnnouncementComponent),
        // canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      },
      {
        path: 'directions',
        loadComponent: () => import('./demo/direction/direction.component').then(module => module.DirectionComponent),
        // canActivate: [AuthorizationCheckService],
        pathMatch:'full'
      }
    ],
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./demo/pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
