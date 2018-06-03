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

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas', {
      backgroundColor: '#fff',
      selection: false
    });
    this.canvas.setWidth(300);
    this.canvas.setHeight(500);

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 20,
      height: 20,
      angle: 45
    });

    rect.on('modified', (e) => {
      console.log(`Left: ${rect.left}, Top: ${rect.top}, ScaleX: ${rect.scaleX}, ScaleY: ${rect.scaleY}, Angle: ${rect.angle}`);
    });

    this.canvas.add(rect);
  }

  public toggleCanvasZoom(): void {
    const zoom = this.canvas.getZoom();
    this.canvas.setZoom(zoom === 1 ? 2 : 1);
  }

}
