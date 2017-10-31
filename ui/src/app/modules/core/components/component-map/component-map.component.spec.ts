import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentMapComponent } from './component-map.component';

describe('ComponentMapComponent', () => {
  let component: ComponentMapComponent;
  let fixture: ComponentFixture<ComponentMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
