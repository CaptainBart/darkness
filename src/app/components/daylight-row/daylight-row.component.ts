import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DaylightService } from '@app/shared/daylight.service';
import { getDate } from 'date-fns';
import { DaylightSectionsComponent } from '../daylight-sections/daylight-sections.component';

@Component({
  selector: 'app-daylight-row',
  standalone: true,
  imports: [
    DaylightSectionsComponent,
  ],
  templateUrl: './daylight-row.component.html',
  styleUrl: './daylight-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaylightRowComponent {
  #daylightService = inject(DaylightService);
  date = input.required<Date>();
  dayOfMonth = computed(() => getDate(this.date()))
  sections = computed(() => this.#daylightService.createSections(this.date()));
}
