import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanActionComponent } from './scan-action.component';

describe('ScanActionComponent', () => {
  let component: ScanActionComponent;
  let fixture: ComponentFixture<ScanActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
