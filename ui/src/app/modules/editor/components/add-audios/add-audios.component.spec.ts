import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAudiosComponent } from './add-audios.component';

describe('AddAudiosComponent', () => {
  let component: AddAudiosComponent;
  let fixture: ComponentFixture<AddAudiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAudiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
