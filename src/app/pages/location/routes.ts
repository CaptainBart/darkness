import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { Route } from "@angular/router";

const ROUTES: Route[] = [
  { path: '', loadComponent: () => import("./location.component"), providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }] },
];

export default ROUTES;
