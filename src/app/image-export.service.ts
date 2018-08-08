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

  public exportImage(img: HTMLImageElement, bubbles: ExportTextRect[], callback: (Blob) => void) {
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
        const rect = new fabric.Rect({
          left: bubble.getLeft(),
          top: bubble.getTop(),
          width: bubble.getWidth(),
          height: bubble.getHeight(),
          angle: bubble.getAngle()
        });
        rect.rotate(0);

        const textbox = new fabric.Textbox(bubble.getText(), {
          left: bubble.getLeft(),
          top: bubble.getTop(),
          width: bubble.getWidth(),
          fontSize: bubble.getFontSize(),
          angle: bubble.getAngle(),
          fill: bubble.isInvertedColors() ? '#fff' : '#000',
          lineHeight: 0.75,
          textAlign: 'center',
          fontFamily: bubble.getFontFamily()
        });
        textbox.rotate(0);
        textbox.set('left', rect.get('left'));
        textbox.set('top', rect.get('top') + Math.floor((rect.get('height') - textbox.get('height')) / 2));
        rect.rotate(bubble.getAngle());
        textbox.rotate(bubble.getAngle());

        canvas.add(textbox);
      }
    });

    canvas.renderAll();
    canvasElement.toBlob((blob) => {
      const file = new Blob([blob], {type: 'image/png'});
      callback(file);
    });
  }

}
