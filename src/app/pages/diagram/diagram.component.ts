import { Component } from '@angular/core';
import { DaylightRowComponent } from '@app/app/components/daylight-row/daylight-row.component';

@Component({
  standalone: true,
  imports: [
    DaylightRowComponent,
  ],
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent {
  date = new Date();
}
