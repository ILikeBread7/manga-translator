import { Injectable } from '@angular/core';
import { ExportTextRect } from './export-text-rect';
import 'fabric';
declare const fabric: any;
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ImageExportService {

  constructor() { }

  public exportImage(img: HTMLImageElement, bubbles: ExportTextRect[]) {
    const canvasElement = document.createElement('canvas');
    const canvas = new fabric.StaticCanvas(canvasElement, {
      width: img.width,
      height: img.height
    });
    const fabricImage = new fabric.Image(img);
    canvas.add(fabricImage);

    _.forEach(bubbles, (bubble) => {
      if (bubble.isVisibleBackground()) {
        canvas.add(
          new fabric.Rect({
            left: bubble.getLeft(),
            top: bubble.getTop(),
            width: bubble.getWidth(),
            height: bubble.getHeight(),
            angle: bubble.getAngle(),
            fill: bubble.isInvertedColors() ? '#000' : '#fff'
          })
        );
      }
    });

    _.forEach(bubbles, (bubble) => {
      if (bubble.getText()) {
        canvas.add(
          new fabric.Textbox(bubble.getText(), {
            left: bubble.getLeft(),
            top: bubble.getTop(),
            width: bubble.getWidth(),
            fontSize: bubble.getFontSize(),
            angle: bubble.getAngle(),
            fill: bubble.isInvertedColors() ? '#fff' : '#000',
            lineHeight: 1,
            textAlign: 'center',
            fontFamily: 'Comic Sans MS, Comic Sans'
          })
        );
      }
    });

    canvas.renderAll();
    canvasElement.toBlob((blob) => {
      const file = new Blob([blob], {type: 'image/png'});
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  }

}
