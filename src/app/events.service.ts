import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TextRect } from './canvas/text-rect';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private zoomChangedSource = new Subject<number>();
  public zoomChanged$ = this.zoomChangedSource.asObservable();
  private imageLoadedSource = new Subject<HTMLImageElement>();
  public imageLoaded$ = this.imageLoadedSource.asObservable();
  private projectStartedSource = new Subject<string>();
  public projectStarted$ = this.projectStartedSource.asObservable();
  private bubbleSelectedSource = new Subject<TextRect>();
  public bubbleSelected$ = this.bubbleSelectedSource.asObservable();

  constructor() { }

  public zoomChanged(zoom: number) {
    this.zoomChangedSource.next(zoom);
  }

  public imageLoaded(img: HTMLImageElement) {
    this.imageLoadedSource.next(img);
  }

  public projectStarted(projectName: string) {
    this.projectStartedSource.next(projectName);
  }

  public bubbleSelected(bubble: TextRect) {
    this.bubbleSelectedSource.next(bubble);
  }

}
