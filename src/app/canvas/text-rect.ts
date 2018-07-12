import 'fabric';
declare const fabric: any;
import * as _ from 'lodash';

export class TextRect {

  private id: number;

  private frontRect;
  private bgRect;
  private textbox;

  private fontSizeFrozen = false;

  constructor(private canvas: any, text: string, options: any) {
    this.bgRect = new fabric.Rect(options);
    const textboxOptions = {
      left: options.left,
      top: options.top,
      width: options.width,
      lineHeight: 1,
      textAlign: 'center',
      fontFamily: 'Comic Sans MS, Comic Sans'
    };
    this.textbox = new fabric.Textbox(text, textboxOptions);
    const rectOptions = {
      left: options.left,
      top: options.top,
      width: options.width,
      height: options.height,
      opacity: 0
    };
    this.frontRect = new fabric.Rect(rectOptions);
    const handler = () => this.onScaledOrMovedOrRotated();
    this.frontRect.on('scaling', handler);
    this.frontRect.on('moving', handler);
    this.frontRect.on('rotating', handler);

    this.frontRect.on('mousedblclick', () => this.enterEditing());
    this.textbox.on('editing:exited', () => this.canvas.setActiveObject(this.frontRect));
    this.textbox.on('changed', () => this.adjustFontSize(this.textbox.get('width')));
  }

  public addToCanvas() {
    this.canvas.add(this.bgRect, this.textbox, this.frontRect);
  }

  public removeFromCanvas() {
    this.canvas.remove(this.bgRect, this.textbox, this.frontRect);
  }

  public set(options: any) {
    this.frontRect.set(options);
    this.bgRect.set(options);
    this.textbox.set(options);
    if (_.has(options, 'width')) {
      this.adjustFontSize(options.width);
    }
  }

  public setId(id: number) {
    this.id = id;
  }

  public getId(): number {
    return this.id;
  }

  public on(event: string, handler: () => void) {
    this.frontRect.on(event, handler);
  }

  public get(value: string) {
    return this.frontRect.get(value);
  }

  public getFromTextbox(value: string) {
    return this.textbox.get(value);
  }

  public setToTextbox(key: string, value: any) {
    this.textbox.set(key, value);
    this.adjustFontSize(this.frontRect.get('width'));
    this.canvas.renderAll();
  }

  public setCoords() {
    this.textbox.setCoords();
    this.bgRect.setCoords();
    this.frontRect.setCoords();
  }

  public setActive() {
    this.canvas.setActiveObject(this.frontRect);
  }

  public enterEditing() {
    this.textbox.enterEditing();
    const textLength = this.textbox.get('text').length;
    this.textbox.setSelectionStart(textLength);
    this.textbox.setSelectionEnd(textLength);
    this.canvas.setActiveObject(this.textbox);
  }

  public isFontSizeFrozen(): boolean {
    return this.fontSizeFrozen;
  }

  public setFontSizeFrozen(value: boolean) {
    this.fontSizeFrozen = value;
    if (value === false) {
      this.adjustFontSize(this.frontRect.get('width'));
      this.canvas.renderAll();
    }
  }

  private onScaledOrMovedOrRotated() {
    this.frontRect.set({
      width: this.frontRect.get('width') * this.frontRect.get('scaleX'),
      height: this.frontRect.get('height') * this.frontRect.get('scaleY'),
      scaleX: 1,
      scaleY: 1
    });
    const newDims = {
      left: this.frontRect.get('left'),
      top: this.frontRect.get('top'),
      width: this.frontRect.get('width'),
      angle: this.frontRect.get('angle')
    };
    this.textbox.set(newDims);
    newDims['height'] = this.frontRect.get('height');
    this.bgRect.set(newDims);
    this.adjustFontSize(this.frontRect.get('width'));
  }

  private adjustFontSize(width: number) {
    if (this.fontSizeFrozen) {
      return;
    }
    this.textbox.set('fontSize', width / 4);
    const rectWidth = this.frontRect.get('width');
    const textboxWidth = this.textbox.get('width');
    if (textboxWidth > rectWidth) {
      this.textbox.set('fontSize', this.textbox.get('fontSize') * rectWidth / (textboxWidth + 1));
      this.textbox.set('width', rectWidth);
    }
  }

}
