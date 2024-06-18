import { Component, computed, inject, input } from '@angular/core';
import { DaylightService } from '@app/shared/daylight.service';
import { DaylightSectionsComponent } from '../daylight-sections/daylight-sections.component';

@Component({
  selector: 'app-daylight-row',
  standalone: true,
  imports: [
    DaylightSectionsComponent,
  ],
  templateUrl: './daylight-row.component.html',
  styleUrl: './daylight-row.component.css'
})
export class DaylightRowComponent {
  #daylightService = inject(DaylightService);
  date = input.required<Date>();
  sections = computed(() => this.#daylightService.createSections(this.date()));
}
