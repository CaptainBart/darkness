import { Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToLocaleTime } from '@app/shared/date-locale.pipe';
import { DaylightService } from '@app/shared/daylight.service';

@Component({
  selector: 'app-daylight-info',
  standalone: true,
  imports: [ToLocaleTime, MatIconModule],
  templateUrl: './daylight-info.component.html',
  styleUrl: './daylight-info.component.css'
})
export class DaylightInfoComponent {
  #daylightService = inject(DaylightService);
  date = input.required<Date>();
  events = computed(() => this.#daylightService.createSections(this.date()).events);


}
