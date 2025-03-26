import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlotReelComponent } from './slot-reel.component';

describe('SlotReelComponent', () => {
  let component: SlotReelComponent;
  let fixture: ComponentFixture<SlotReelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotReelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SlotReelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
