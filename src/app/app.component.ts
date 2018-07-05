import { Component, OnInit } from '@angular/core';
import { EventsService } from './events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public MAX_WIDTH = 500;
  public MAX_HEIGHT = 700;

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit(): void {
  }

}
