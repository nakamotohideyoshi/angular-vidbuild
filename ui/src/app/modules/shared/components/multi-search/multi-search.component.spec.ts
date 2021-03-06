import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSearchComponent } from './multi-search.component';

describe(' MultiSearchComponent', () => {
  let component: MultiSearchComponent;
  let fixture: ComponentFixture< MultiSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
