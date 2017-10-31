import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVoiceoverComponent } from './add-voiceover.component';

describe('AddVoiceoverComponent', () => {
  let component: AddVoiceoverComponent;
  let fixture: ComponentFixture<AddVoiceoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVoiceoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVoiceoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
