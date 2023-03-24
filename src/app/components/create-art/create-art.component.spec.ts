import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArtComponent } from './create-art.component';

describe('CreateArtComponent', () => {
  let component: CreateArtComponent;
  let fixture: ComponentFixture<CreateArtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateArtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
