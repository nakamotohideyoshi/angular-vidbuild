import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryHeaderComponent } from './library-header.component';

describe('LibraryHeaderComponent', () => {
  let component: LibraryHeaderComponent;
  let fixture: ComponentFixture<LibraryHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
