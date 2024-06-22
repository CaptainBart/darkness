import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DaylightHoursDiagramComponent } from '@app/components/daylight-hours-diagram/daylight-hours-diagram.component';

@Component({
  standalone: true,
  imports: [
    DaylightHoursDiagramComponent,
  ],
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagramComponent {
  date = new Date();
}
