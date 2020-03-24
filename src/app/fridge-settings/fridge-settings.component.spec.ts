import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FridgeSettingsComponent } from './fridge-settings.component';

describe('FridgeSettingsComponent', () => {
  let component: FridgeSettingsComponent;
  let fixture: ComponentFixture<FridgeSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FridgeSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FridgeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
