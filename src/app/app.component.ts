import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from './events.service';
import { Subscription } from 'rxjs';
import { BubblesService } from './bubbles.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public MAX_WIDTH = 500;
  public MAX_HEIGHT = 700;

  public showRightPanel = false;
  public showBubbleDetails = false;

  private imageLoadedSubscription: Subscription;
  private bubbleSelectedSubscription: Subscription;

  constructor(
    private eventsService: EventsService,
    public bubblesService: BubblesService
  ) { }

  ngOnInit(): void {
    this.imageLoadedSubscription = this.eventsService.imageLoaded$.subscribe(
      img => this.showRightPanel = true
    );
    this.bubbleSelectedSubscription = this.eventsService.bubbleSelected$.subscribe(
      bubble => this.showBubbleDetails = true
    );
  }

  ngOnDestroy(): void {
    this.imageLoadedSubscription.unsubscribe();
    this.bubbleSelectedSubscription.unsubscribe();
  }
}
