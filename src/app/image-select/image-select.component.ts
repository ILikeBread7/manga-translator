import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-image-select',
  templateUrl: './image-select.component.html',
  styleUrls: ['./image-select.component.css']
})
export class ImageSelectComponent implements OnInit {

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit() {
  }

  public loadFile($event): void {
    if (!$event.target.files[0]) {
      return;
    }
    console.log($event.target.files[0]);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        this.eventsService.imageLoaded(img);
      };
    };
    reader.readAsDataURL($event.target.files[0]);
  }

}
