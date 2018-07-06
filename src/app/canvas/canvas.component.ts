import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EventsService } from '../events.service';
import 'fabric';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { TextRect } from './text-rect';
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

  private isDrawing = false;
  private drawingStartPointer: any;
  private currentlyDrawnRect: TextRect;

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

    this.canvas.on('mouse:down', options => {
      if (options.target !== this.currentImage) {
        return;
      }
      const pointer = _.mapValues(this.canvas.getPointer(options.e), Math.floor);
      this.drawingStartPointer = pointer;
      const rect = new TextRect(
        this.canvas,
        '',
        {
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: '#eee',
          opacity: 0.7
        }
      );
      rect.addToCanvas();
      rect.setActive();
      this.currentlyDrawnRect = rect;
      this.isDrawing = true;
    });

    this.canvas.on('mouse:move', options => {
      if (!this.isDrawing) {
        return;
      }
      const pointer = _.mapValues(this.canvas.getPointer(options.e), Math.floor);
      const rect = this.currentlyDrawnRect;
      rect.set({
          left: Math.min(pointer.x, this.drawingStartPointer.x),
          width: Math.abs(pointer.x - this.drawingStartPointer.x),
          top: Math.min(pointer.y, this.drawingStartPointer.y),
          height: Math.abs(pointer.y - this.drawingStartPointer.y)
      });
      this.canvas.renderAll();
    });

    this.canvas.on('mouse:up', options => {
      if (!this.isDrawing) {
        return;
      }
      this.isDrawing = false;
      const rect = this.currentlyDrawnRect;
      if (rect.get('width') === 0 || rect.get('height') === 0) {
        rect.removeFromCanvas();
      } else {
        rect.setCoords();
        rect.enterEditing();
      }
    });

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
          hoverCursor: 'default'
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