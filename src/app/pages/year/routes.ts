import { Route } from "@angular/router";
import { MonthComponent } from "./month.component";

const ROUTES: Route[] = [
    {
        path: '',
        redirectTo: `${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
        pathMatch: 'full',
    },
    {
        path: ':year/:month',
        component: MonthComponent,
    },
];

export default ROUTES;