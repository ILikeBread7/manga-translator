import { Component, OnInit, Input } from '@angular/core';
import { EventsService } from '../events.service';

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
    private eventsService: EventsService
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
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        this.eventsService.imageLoaded(img);
      };
    };
    reader.readAsDataURL(file);
    this.currentFile = file;
  }

}
