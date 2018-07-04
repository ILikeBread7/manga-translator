import { Component, OnInit } from '@angular/core';
import 'fabric';
declare const fabric: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private canvas;
  private currentImage;
  private defaultZoom = 1;

  public MAX_WIDTH = 500;
  public MAX_HEIGHT = 700;

  public zoom = 1;

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas', {
      backgroundColor: '#fff',
      selection: false
    });
    this.canvas.setWidth(500);
    this.canvas.setHeight(700);
  }

  public loadFile($event): void {
    console.log($event.target.files[0]);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const fabricImage = new fabric.Image(img, {
          selectable: false,
          hoverCursor: 'cursor'
        });
        this.canvas.clear();
        this.currentImage = fabricImage;
        this.defaultZoom = this.zoom = this.getCanvasInitialZoom(img.width, img.height);
        this.setCanvasDimensions(
          {
            zoom: this.zoom,
            width: img.width,
            height: img.height
          }
        );
        this.canvas.add(fabricImage);
      };
    };
    reader.readAsDataURL($event.target.files[0]);
  }

  public zoomChange($event): void {
    const newZoom = $event.target.value;
    if (newZoom > 0 && newZoom <= 2) {
      this.setCanvasZoom(newZoom);
    }
  }

  public isImageLoaded(): boolean {
    return !!this.currentImage;
  }

  public changeZoomToDefault(): void {
    this.setCanvasZoom(this.defaultZoom);
  }

  private setCanvasZoom(zoom): void {
    this.zoom = zoom;
    const dim = this.currentImage
      ? {zoom: zoom, width: this.currentImage.width, height: this.currentImage.height}
      : {zoom: zoom, width: this.MAX_WIDTH, height: this.MAX_HEIGHT};
    this.setCanvasDimensions(dim);
  }

  private setCanvasDimensions(dim: CanvasDimensions): void {
    this.canvas.setWidth(dim.width * dim.zoom);
    this.canvas.setHeight(dim.height * dim.zoom);
    this.canvas.setZoom(dim.zoom);
  }

  private getCanvasInitialZoom(imgWidth: number, imgHeight: number) {
    const widthRatio = this.MAX_WIDTH / imgWidth;
    const heightRatio = this.MAX_HEIGHT / imgHeight;
    return Math.min(widthRatio, heightRatio, 2);
  }

}

interface CanvasDimensions {
  width: number;
  height: number;
  zoom: number;
}
