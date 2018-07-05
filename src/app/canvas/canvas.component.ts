import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EventsService } from '../events.service';
import 'fabric';
import { Subscription } from 'rxjs';
declare const fabric: any;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {

  @Input()
  public maxCanvasWidth: number;

  @Input()
  public maxCanvasHeight: number;

  private canvas;
  private currentImage;

  private zoomChangedSubscription: Subscription;
  private imageLoadedSubscription: Subscription;

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas', {
      backgroundColor: '#fff',
      selection: false
    });
    this.canvas.setWidth(this.maxCanvasWidth);
    this.canvas.setHeight(this.maxCanvasHeight);

    this.zoomChangedSubscription = this.eventsService.zoomChanged$.subscribe(
      zoom => this.setCanvasDimensions(
        {
          zoom: zoom,
          width: this.currentImage.width,
          height: this.currentImage.height
        }
      )
    );

    this.imageLoadedSubscription = this.eventsService.imageLoaded$.subscribe(
      img => {
        const fabricImage = new fabric.Image(img, {
          selectable: false,
          hoverCursor: 'cursor'
        });
        this.canvas.clear();
        this.currentImage = fabricImage;
        this.canvas.add(fabricImage);
      }
    );
  }

  ngOnDestroy() {
    this.zoomChangedSubscription.unsubscribe();
    this.imageLoadedSubscription.unsubscribe();
  }

  private setCanvasDimensions(dim: CanvasDimensions): void {
    this.canvas.setWidth(dim.width * dim.zoom);
    this.canvas.setHeight(dim.height * dim.zoom);
    this.canvas.setZoom(dim.zoom);
  }

}

interface CanvasDimensions {
  width: number;
  height: number;
  zoom: number;
}
