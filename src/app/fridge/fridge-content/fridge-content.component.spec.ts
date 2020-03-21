import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FridgeContentComponent } from './fridge-content.component';

describe('FridgeContentComponent', () => {
  let component: FridgeContentComponent;
  let fixture: ComponentFixture<FridgeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FridgeContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FridgeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
