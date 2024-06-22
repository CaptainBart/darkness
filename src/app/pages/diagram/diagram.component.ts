import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DaylightHoursDiagramComponent } from '@app/components/daylight-hours-diagram/daylight-hours-diagram.component';
import { ShellService } from '@app/shared/shell.service';
import { format } from 'date-fns';

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
  #shellService = inject(ShellService);

  onDateChange(date: Date): void {
    this.#shellService.changeTitle(format(date, 'MMM yyyy'));
  }
}
