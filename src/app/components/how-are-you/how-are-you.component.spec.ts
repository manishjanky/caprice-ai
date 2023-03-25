import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowAreYouComponent } from './how-are-you.component';

describe('HowAreYouComponent', () => {
  let component: HowAreYouComponent;
  let fixture: ComponentFixture<HowAreYouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowAreYouComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowAreYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
