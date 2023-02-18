import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingAppComponent } from './loading-app.component';

describe('LoadingAppComponent', () => {
  let component: LoadingAppComponent;
  let fixture: ComponentFixture<LoadingAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
