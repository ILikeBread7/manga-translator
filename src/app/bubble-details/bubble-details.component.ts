import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../events.service';
import { Subscription } from 'rxjs';
import { TextRect } from '../canvas/text-rect';
import { BubblesService } from '../bubbles.service';
import 'fabric';
declare const fabric: any;

@Component({
  selector: 'app-bubble-details',
  templateUrl: './bubble-details.component.html',
  styleUrls: ['./bubble-details.component.css']
})
export class BubbleDetailsComponent implements OnInit, OnDestroy {

  public bubble: TextRect;

  private zoomChangedSubscription: Subscription;
  private imageLoadedSubscription: Subscription;
  private bubbleSelectedSubscription: Subscription;

  private canvas;
  private currentImage;

  constructor(
    private eventsService: EventsService,
    public bubblesService: BubblesService
  ) { }

  ngOnInit() {
    this.bubbleSelectedSubscription = this.eventsService.bubbleSelected$.subscribe(
      bubble => {
        this.bubble = bubble;
        if (this.bubble) {
          this.showViewOnCanvas(bubble);
        } else {
          this.resetCanvas();
        }
      }
    );

    this.zoomChangedSubscription = this.eventsService.zoomChanged$.subscribe(
      zoom => this.setCanvasSizeAndZoom(this.bubble, zoom)
    );

    this.imageLoadedSubscription = this.eventsService.imageLoaded$.subscribe(
      img => this.currentImage = img
    );

    this.canvas = new fabric.StaticCanvas('selectionViewCanvas');
    this.resetCanvas();
  }

  private showViewOnCanvas(bubble: TextRect) {
    this.setCanvasSizeAndZoom(bubble, this.canvas.getZoom());
    this.canvas.clear();

    const fabricImage = new fabric.Image(this.currentImage, {
      top: -bubble.get('top'),
      left: -bubble.get('left')
    });
    this.canvas.add(fabricImage);
    this.canvas.renderAll();
  }

  ngOnDestroy() {
    this.zoomChangedSubscription.unsubscribe();
    this.imageLoadedSubscription.unsubscribe();
    this.bubbleSelectedSubscription.unsubscribe();
  }

  public deleteBubble() {
    this.bubblesService.deleteBubble(this.bubble.getId());
    this.bubble = undefined;
    this.resetCanvas();
  }

  private setCanvasSizeAndZoom(bubble: TextRect, zoom: number) {
    this.canvas.setZoom(zoom);
    if (bubble) {
      this.canvas.setWidth(bubble.get('width') * zoom);
      this.canvas.setHeight(bubble.get('height') * zoom);
    }
  }

  private resetCanvas() {
    this.canvas.setWidth(0);
    this.canvas.setHeight(0);
    this.canvas.clear();
  }

}
