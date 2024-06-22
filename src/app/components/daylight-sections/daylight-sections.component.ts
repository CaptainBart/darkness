import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DaylightSectionType, DaylightSections } from '@app/celestial/daylight-sections.model';
import { ToLocaleTime } from '@app/shared/date-locale.pipe';

@Component({
  selector: 'app-daylight-sections',
  standalone: true,
  imports: [NgStyle, ToLocaleTime],
  templateUrl: './daylight-sections.component.html',
  styleUrl: './daylight-sections.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaylightSectionsComponent {
  SectionType = DaylightSectionType;
  sections = input.required<DaylightSections>();
  totalMinutesBetweenNoons = computed(() => this.sections().events.totalMinutesBetweenNoons);
  timezone = computed(() => this.sections().events.timezone);
}
