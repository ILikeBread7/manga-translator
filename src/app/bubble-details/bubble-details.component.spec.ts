import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleDetailsComponent } from './bubble-details.component';

describe('BubbleDetailsComponent', () => {
  let component: BubbleDetailsComponent;
  let fixture: ComponentFixture<BubbleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
