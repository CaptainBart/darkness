import { Route } from "@angular/router";
import { locationGuard } from "../pages/location/location.guard";
import { ShellComponent } from "./shell.component";

const ROUTES: Route[] = [
    {
      path: '',
      component: ShellComponent,
      children: [
        {
          path: '',
          redirectTo: 'year',
          pathMatch: 'full',
        },
        {
          path: 'info',
          loadChildren: () => import('../pages/info/routes'),
        },
        {
          path: 'year',
          loadChildren: () => import('../pages/year/routes'),
          canActivate: [locationGuard]
        },
        {
          path: 'location',
          loadChildren: () => import('../pages/location/routes')
        },
      ]
    }
];

export default ROUTES;