import { NgStyle } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { DarknessSections, SectionType } from '@app/celestial/darkness-sections.model';
import { ToLocaleTime } from '@app/shared/date-locale.pipe';

@Component({
  selector: 'app-day-sections',
  standalone: true,
  imports: [NgStyle, ToLocaleTime],
  templateUrl: './day-sections.component.html',
  styleUrl: './day-sections.component.css'
})
export class DaySectionsComponent {
  SectionType = SectionType;
  sections = input.required<DarknessSections>();
  totalMinutesBetweenNoons = computed(() => this.sections().events.totalMinutesBetweenNoons);
  timezone = computed(() => this.sections().events.timezone);
}
