import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriminalComponent } from './criminal.component';

describe('CriminalComponent', () => {
  let component: CriminalComponent;
  let fixture: ComponentFixture<CriminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriminalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
