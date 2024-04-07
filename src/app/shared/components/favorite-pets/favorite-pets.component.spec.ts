import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritePetsComponent } from './favorite-pets.component';

describe('FavoritePetsComponent', () => {
  let component: FavoritePetsComponent;
  let fixture: ComponentFixture<FavoritePetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoritePetsComponent]
    });
    fixture = TestBed.createComponent(FavoritePetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
