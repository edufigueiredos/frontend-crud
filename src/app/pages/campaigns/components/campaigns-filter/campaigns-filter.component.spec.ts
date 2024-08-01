import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsFilterComponent } from './campaigns-filter.component';

describe('CampaignsFilterComponent', () => {
  let component: CampaignsFilterComponent;
  let fixture: ComponentFixture<CampaignsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
