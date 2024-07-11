import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item',
      },
    ],
  },


  {
    id: 'gis',
    title: 'GIS',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: '3d',
        title: '3D',
        type: 'item',
        url: '/3d',
        icon: 'feather icon-home',
        classes: 'nav-item',
      },
      {
        id: '2d',
        title: '2D',
        type: 'item',
        url: '/2d',
        icon: 'feather icon-home',
        classes: 'nav-item',
      },
      {
        id: 'user-management-old',
        title: 'User Management',
        type: 'item',
        url: '/user-management-old',
        icon: 'feather icon-home',
        classes: 'nav-item',
      },
     
     {

        id: 'role-management',
        title: 'Role Management',
        type: 'item',
        url: '/role-management',
        icon: 'feather icon-home',
        classes: 'nav-item',
      },
      // {
      //   id: 'user-management',
      //   title: 'User Management',
      //   type: 'item',
      //   url: '/user-management',
      //   icon: 'feather icon-home',
      //   classes: 'nav-item',
      // },
    //  {

    //     id: 'surveydetail',
    //     title: 'Survey Detail',
    //     type: 'item',
    //     url: '/surveydetail',
    //     icon: 'feather icon-home',
    //     classes: 'nav-item',
    //   },
      {

        id: 'layermanagement',
        title: 'Layer Management',
        type: 'item',
        url: '/layermanagement',
        icon: 'feather icon-home',
        classes: 'nav-item',
      }
      ,
      {

        id: 'project-management',
        title: 'Project Management',
        type: 'item',
        url: '/project-management',
        icon: 'feather icon-home',
        classes: 'nav-item',
      },
       {
        id: 'Annoucement',
        title: 'Announcement',
        type: 'item',
        url: '/announcement',
        icon: 'feather icon-home',
        classes: 'nav-item',
      },
      {
        id: 'Directions',
        title: 'Directions',
        type: 'item',
        url: '/directions',
        icon: 'feather icon-home',
        classes: 'nav-item',
      }
    ],
  },
  

  
  // {
  //   id: 'ui-element',
  //   title: 'UI ELEMENT',
  //   type: 'group',
  //   icon: 'icon-ui',
  //   children: [
  //     {
  //       id: 'basic',
  //       title: 'Component',
  //       type: 'collapse',
  //       icon: 'feather icon-box',
  //       children: [
  //         {
  //           id: 'button',
  //           title: 'Button',
  //           type: 'item',
  //           url: '/basic/button',
  //         },
  //         {
  //           id: 'badges',
  //           title: 'Badges',
  //           type: 'item',
  //           url: '/basic/badges',
  //         },
  //         {
  //           id: 'breadcrumb-pagination',
  //           title: 'Breadcrumb & Pagination',
  //           type: 'item',
  //           url: '/basic/breadcrumb-paging',
  //         },
  //         {
  //           id: 'collapse',
  //           title: 'Collapse',
  //           type: 'item',
  //           url: '/basic/collapse',
  //         },
  //         {
  //           id: 'tabs-pills',
  //           title: 'Tabs & Pills',
  //           type: 'item',
  //           url: '/basic/tabs-pills',
  //         },
  //         {
  //           id: 'typography',
  //           title: 'Typography',
  //           type: 'item',
  //           url: '/basic/typography',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 'forms',
  //   title: 'Forms & Tables',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'forms-element',
  //       title: 'Form Elements',
  //       type: 'item',
  //       url: '/forms/basic',
  //       classes: 'nav-item',
  //       icon: 'feather icon-file-text',
  //     },
  //     {
  //       id: 'tables',
  //       title: 'Tables',
  //       type: 'item',
  //       url: '/tables/bootstrap',
  //       classes: 'nav-item',
  //       icon: 'feather icon-server',
  //     },
  //   ],
  // },
  // {
  //   id: 'chart-maps',
  //   title: 'Chart',
  //   type: 'group',
  //   icon: 'icon-charts',
  //   children: [
  //     {
  //       id: 'apexChart',
  //       title: 'ApexChart',
  //       type: 'item',
  //       url: 'apexchart',
  //       classes: 'nav-item',
  //       icon: 'feather icon-pie-chart',
  //     },
  //   ],
  // },
  // {
  //   id: 'pages',
  //   title: 'Pages',
  //   type: 'group',
  //   icon: 'icon-pages',
  //   children: [
  //     {
  //       id: 'auth',
  //       title: 'Authentication',
  //       type: 'collapse',
  //       icon: 'feather icon-lock',
  //       children: [
  //         {
  //           id: 'signup',
  //           title: 'Sign up',
  //           type: 'item',
  //           url: '/auth/signup',
  //           target: true,
  //           breadcrumbs: false,
  //         },
  //         {
  //           id: 'signin',
  //           title: 'Sign in',
  //           type: 'item',
  //           url: '/auth/signin',
  //           target: true,
  //           breadcrumbs: false,
  //         },
  //       ],
  //     },
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'feather icon-sidebar',
  //     },
  //     {
  //       id: 'disabled-menu',
  //       title: 'Disabled Menu',
  //       type: 'item',
  //       url: 'javascript:',
  //       classes: 'nav-item disabled',
  //       icon: 'feather icon-power',
  //       external: true,
  //     },
  //     {
  //       id: 'buy_now',
  //       title: 'Buy Now',
  //       type: 'item',
  //       icon: 'feather icon-book',
  //       classes: 'nav-item',
  //       url: 'https://codedthemes.com/item/datta-able-angular/',
  //       target: true,
  //       external: true,
  //     },
    // ],
  // },
  

];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
