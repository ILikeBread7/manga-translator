import { Component, OnInit, Input } from '@angular/core';
import { EventsService } from '../events.service';
import { BubblesService } from '../bubbles.service';

@Component({
  selector: 'app-image-select',
  templateUrl: './image-select.component.html',
  styleUrls: ['./image-select.component.css']
})
export class ImageSelectComponent implements OnInit {

  public files;
  public currentFile;

  @Input()
  public maxCanvasHeight: number;

  constructor(
    private eventsService: EventsService,
    private bubblesService: BubblesService
  ) { }

  ngOnInit() {
  }

  public loadDir($event): void {
    if ($event.target.files.length === 0) {
      return;
    }
    this.files = $event.target.files;
    this.eventsService.projectStarted();
  }

  public loadFile(file: any) {
    if (file === this.currentFile) {
      return;
    }
    console.log(file);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        this.bubblesService.changeImage(file.name);
        this.eventsService.imageLoaded(img);
      };
    };
    reader.readAsDataURL(file);
    this.currentFile = file;
  }

}
