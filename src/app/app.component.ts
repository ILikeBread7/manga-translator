import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from './events.service';
import { Subscription } from 'rxjs';
import { BubblesService } from './bubbles.service';
import { ImageExportService } from './image-export.service';
import { StorageService } from './storage.service';
import { SwUpdate } from '@angular/service-worker';

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
  public currentTab = 'CANVAS';

  public currentImage;
  public currentProjectName: string;

  private imageLoadedSubscription: Subscription;
  private projectStartedSubscription: Subscription;
  private bubbleSelectedSubscription: Subscription;

  constructor(
    private eventsService: EventsService,
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
      (name) => {
        this.showRightPanel = false;
        this.currentImage = undefined;
        this.currentProjectName = name;
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

}
