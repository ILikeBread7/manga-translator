import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from './events.service';
import { Subscription } from 'rxjs';
import { BubblesService } from './bubbles.service';
import { ImageExportService } from './image-export.service';
import { StorageService } from './storage.service';

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

  private currentImage;

  private imageLoadedSubscription: Subscription;
  private projectStartedSubscription: Subscription;
  private bubbleSelectedSubscription: Subscription;

  constructor(
    private eventsService: EventsService,
    private imageExportService: ImageExportService,
    public bubblesService: BubblesService,
    public storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.imageLoadedSubscription = this.eventsService.imageLoaded$.subscribe(
      img => {
        this.showRightPanel = true;
        this.currentImage = img;
      }
    );
    this.projectStartedSubscription = this.eventsService.projectStarted$.subscribe(
      () => {
        this.showRightPanel = false;
        this.currentImage = undefined;
      }
    );
    this.bubbleSelectedSubscription = this.eventsService.bubbleSelected$.subscribe(
      bubble => this.showBubbleDetails = true
    );
  }

  ngOnDestroy(): void {
    this.imageLoadedSubscription.unsubscribe();
    this.projectStartedSubscription.unsubscribe();
    this.bubbleSelectedSubscription.unsubscribe();
  }

  public exportImage() {
    this.imageExportService.exportImage(this.currentImage, this.bubblesService.getExportBubbles());
  }

}
