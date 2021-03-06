import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { EventsService } from '../events.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.css']
})
export class ZoomComponent implements OnInit, OnDestroy {

  @Input()
  public maxCanvasWidth: number;

  @Input()
  public maxCanvasHeight: number;

  public zoom = 1;

  private imageLoadedSubscription: Subscription;
  private defaultZoom = 1;

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.imageLoadedSubscription = this.eventsService.imageLoaded$.subscribe(
      img => {
        this.defaultZoom = this.getCanvasInitialZoom(img.width, img.height);
        this.setCanvasZoom(this.defaultZoom);
      }
    );
  }

  ngOnDestroy() {
    this.imageLoadedSubscription.unsubscribe();
  }

  public zoomChange($event): void {
    const newZoom = $event.target.value;
    if (newZoom > 0 && newZoom <= 2) {
      this.setCanvasZoom(newZoom);
    }
  }

  public changeZoomToDefault(): void {
    this.setCanvasZoom(this.defaultZoom);
  }

  public changeToRealSize(): void {
    this.setCanvasZoom(1);
  }

  private setCanvasZoom(zoom): void {
    this.zoom = zoom;
    this.eventsService.zoomChanged(zoom);
  }

  private getCanvasInitialZoom(imgWidth: number, imgHeight: number) {
    const widthRatio = this.maxCanvasWidth / imgWidth;
    const heightRatio = this.maxCanvasHeight / imgHeight;
    return Math.min(widthRatio, heightRatio, 2);
  }

}
