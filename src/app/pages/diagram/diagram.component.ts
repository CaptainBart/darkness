import { ChangeDetectionStrategy, Component, effect, inject, model } from '@angular/core';
import { DaylightHoursDiagramComponent } from '@app/components/daylight-hours-diagram/daylight-hours-diagram.component';
import { DaylightInfoComponent } from '@app/daylight-info/daylight-info.component';
import { ShellService } from '@app/shared/shell.service';
import { format } from 'date-fns';

@Component({
  standalone: true,
  imports: [
    DaylightHoursDiagramComponent,
    DaylightInfoComponent,
  ],
  templateUrl: './diagram.component.html',
  styleUrl: './diagram.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagramComponent {
  #shellService = inject(ShellService);
  date = model(new Date());

  constructor() {
    effect(() => {
      this.#shellService.changeTitle(format(this.date(), 'MMM yyyy'));
    }, { allowSignalWrites: true });
  }
}
