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
          redirectTo: 'diagram',
          pathMatch: 'full',
        },
        {
          path: 'info',
          loadChildren: () => import('@app/pages/info/routes'),
        },
        {
          path: 'diagram',
          loadChildren: () => import('@app/pages/diagram/routes'),
          canActivate: [locationGuard]
        },
        {
          path: 'location',
          loadChildren: () => import('@app/pages/location/routes'),
        },
      ]
    }
];

export default ROUTES;