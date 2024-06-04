import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CelestialEvents, DarknessComponent, DarknessSections } from '@app/darkness';
import { ShellService } from '@app/shell';
import { format } from 'date-fns';

@Component({
  standalone: true,
  imports:[
    CommonModule,
    DarknessComponent,
    MatToolbarModule,
  ],
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent {
  events: CelestialEvents | null = null;

  public constructor(
    private readonly shellService: ShellService,
  ) { }

  onDateChanged(ev: {date: Date, sections: DarknessSections}) {
    this.shellService.changeTitle(format(ev.date, 'MMM yyyy'));
    this.events = ev.sections.events;
    console.dir(this.events.sunset);
  }
}
