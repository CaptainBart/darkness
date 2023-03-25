import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DarknessComponent } from '@app/darkness';
import { ShellService } from '@app/shell';
import { format } from 'date-fns';

@Component({
  standalone: true,
  imports:[
    CommonModule,
    DarknessComponent,
  ],
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent {
  public constructor(
    private readonly shellService: ShellService,
  ) { }

  onDateChanged(date: Date) {
    this.shellService.changeTitle(format(date, 'MMM yyyy'));
  }
}
