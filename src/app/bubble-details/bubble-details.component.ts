import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../events.service';
import { Subscription } from 'rxjs';
import { TextRect } from '../canvas/text-rect';

@Component({
  selector: 'app-bubble-details',
  templateUrl: './bubble-details.component.html',
  styleUrls: ['./bubble-details.component.css']
})
export class BubbleDetailsComponent implements OnInit, OnDestroy {

  public bubble: TextRect;

  private bubbleSelectedSubscription: Subscription;

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.bubbleSelectedSubscription = this.eventsService.bubbleSelected$.subscribe(
      bubble => this.bubble = bubble
    );
  }

  ngOnDestroy() {
    this.bubbleSelectedSubscription.unsubscribe();
  }

  public deleteBubble() {
    this.eventsService.bubbleDeleted(this.bubble.getId());
    this.bubble = undefined;
  }

}
