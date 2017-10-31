import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoPanelComponent } from './bo-panel.component';

describe('BoPanelComponent', () => {
  let component: BoPanelComponent;
  let fixture: ComponentFixture<BoPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
