import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarknessInfiniteComponent } from './darkness-infinite.component';

describe('DarknessInfiniteComponent', () => {
  let component: DarknessInfiniteComponent;
  let fixture: ComponentFixture<DarknessInfiniteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DarknessInfiniteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DarknessInfiniteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
