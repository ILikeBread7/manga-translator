import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private zoomChangedSource = new Subject<number>();
  public zoomChanged$ = this.zoomChangedSource.asObservable();
  private imageLoadedSource = new Subject<HTMLImageElement>();
  public imageLoaded$ = this.imageLoadedSource.asObservable();

  constructor() { }

  public zoomChanged(zoom: number) {
    this.zoomChangedSource.next(zoom);
  }

  public imageLoaded(img: HTMLImageElement) {
    this.imageLoadedSource.next(img);
  }

}
