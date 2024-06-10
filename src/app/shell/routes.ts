import { Route } from "@angular/router";
import { locationGuard } from "@app/shared/location.guard";
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
          path: 'diagram',
          loadChildren: () => import('@app/pages/diagram/routes'),
          canActivate: [locationGuard],
        },
        {
          path: 'location',
          loadChildren: () => import('@app/pages/location/routes'),
        },
        {
          path: 'info',
          loadChildren: () => import('@app/pages/info/routes'),
        },
      ]
    }
];

export default ROUTES;