import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { EventsService } from '../events.service';
import 'fabric';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { TextRect } from './text-rect';
import { BubblesService } from '../bubbles.service';
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
  private projectStartedSubscription: Subscription;
  private bubbleDeletedSubscription: Subscription;

  private isDrawing = false;
  private drawingStartPointer: any;
  private currentlyDrawnRect: TextRect;
  private selectedBubble: TextRect;

  constructor(
    private eventsService: EventsService,
    private bubblesService: BubblesService
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
          height: 0
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
        this.bubblesService.addBubble(rect);
        const setBubbleActive = () => this.selectBubble(rect);
        const saveBubbles = () => this.bubblesService.saveBubbles();
        rect.on('selected', setBubbleActive);
        rect.on('scaled', setBubbleActive);
        rect.on('moved', setBubbleActive);
        rect.on('rotated', setBubbleActive);
        rect.on('scaled', saveBubbles);
        rect.on('moved', saveBubbles);
        rect.on('rotated', saveBubbles);
        rect.textboxOn('changed', saveBubbles);

        rect.setCoords();
        rect.enterEditing();
        this.selectBubble(rect);
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
        this.selectBubble(undefined);
        _.forEach(this.bubblesService.getCurrentBubbles(), (bubble) => bubble.addToCanvas());
      }
    );

    this.projectStartedSubscription = this.eventsService.projectStarted$.subscribe(
      (projectName: string) => {
        this.canvas.clear();
        this.canvas.setBackgroundColor('#fff');
        this.bubblesService.startNewProject(projectName);
        this.currentImage = undefined;
        this.selectBubble(undefined);
      }
    );

  }

  ngOnDestroy() {
    this.zoomChangedSubscription.unsubscribe();
    this.imageLoadedSubscription.unsubscribe();
    this.projectStartedSubscription.unsubscribe();
    this.bubbleDeletedSubscription.unsubscribe();
  }

  @HostListener('body:keyup', ['$event'])
  public handleKeyEvent(event: KeyboardEvent) {
    if ((event.target as HTMLElement).nodeName !== 'BODY') {
      return;
    }
    const keyCode = event.which || event.keyCode;
    if (
        keyCode === 46 // 46 = Delete
        && typeof this.selectedBubble !== 'undefined'
        && this.selectedBubble.isActiveAndNotEditing()) {
      this.bubblesService.deleteBubble(this.selectedBubble.getId());
      this.selectBubble(undefined);
    }
  }

  private setCanvasDimensions(dim: CanvasDimensions): void {
    this.canvas.setWidth(dim.width * dim.zoom);
    this.canvas.setHeight(dim.height * dim.zoom);
    this.canvas.setZoom(dim.zoom);
  }

  private selectBubble(bubble: TextRect) {
    this.selectedBubble = bubble;
    this.eventsService.bubbleSelected(bubble);
  }

}

interface CanvasDimensions {
  width: number;
  height: number;
  zoom: number;
}
