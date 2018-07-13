import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../events.service';
import { Subscription } from 'rxjs';
import { TextRect } from '../canvas/text-rect';
import { BubblesService } from '../bubbles.service';

@Component({
  selector: 'app-bubble-details',
  templateUrl: './bubble-details.component.html',
  styleUrls: ['./bubble-details.component.css']
})
export class BubbleDetailsComponent implements OnInit, OnDestroy {

  public bubble: TextRect;

  private bubbleSelectedSubscription: Subscription;

  constructor(
    private eventsService: EventsService,
    private bubblesService: BubblesService
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
    this.bubblesService.deleteBubble(this.bubble.getId());
    this.bubble = undefined;
  }

}
