import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobListings } from './job-listings';

describe('JobListings', () => {
  let component: JobListings;
  let fixture: ComponentFixture<JobListings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobListings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobListings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
