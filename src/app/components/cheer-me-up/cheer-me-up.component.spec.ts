import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheerMeUpComponent } from './cheer-me-up.component';

describe('CheerMeUpComponent', () => {
  let component: CheerMeUpComponent;
  let fixture: ComponentFixture<CheerMeUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheerMeUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheerMeUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
