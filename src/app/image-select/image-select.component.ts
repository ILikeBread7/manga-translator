import { Component, OnInit, Input } from '@angular/core';
import { EventsService } from '../events.service';
import { BubblesService } from '../bubbles.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-image-select',
  templateUrl: './image-select.component.html',
  styleUrls: ['./image-select.component.css']
})
export class ImageSelectComponent implements OnInit {

  public files: File[];
  public currentFile: File;

  @Input()
  public height: number;

  constructor(
    private eventsService: EventsService,
    public bubblesService: BubblesService
  ) { }

  ngOnInit() {
  }

  public loadDir($event): void {
    if ($event.target.files.length === 0) {
      return;
    }
    this.files = _.filter($event.target.files, (f: File) => f.type.startsWith('image/'));
    this.bubblesService.setProjectImages(this.files);
    this.eventsService.projectStarted(this.getDirName(this.files[0].webkitRelativePath));
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
        this.bubblesService.changeImage(file.name);
        this.eventsService.imageLoaded(img);
      };
    };
    reader.readAsDataURL(file);
    this.currentFile = file;
  }

  private getDirName(filepath: string): string {
    const firstSlash = this.getFirstPosition(filepath.indexOf('/'), filepath.indexOf('\\'));
    return firstSlash > 0 ? filepath.substring(0, firstSlash) : filepath;
  }


  private getFirstPosition(firstSlash: number, firstBackslash: number): number {
    if (firstSlash > 0 && firstBackslash > 0) {
      return Math.min(firstSlash, firstBackslash);
    } else if (firstSlash > 0) {
      return firstSlash;
    } else if (firstBackslash > 0) {
      return firstBackslash;
    }
    return -1;
  }
}
