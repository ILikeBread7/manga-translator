import 'fabric';
declare const fabric: any;
import * as _ from 'lodash';

export class TextRect {

  private id: number;

  private frontRect;
  private bgRect;
  private textbox;

  private fontSizeFrozen = false;
  private visibleBackground = true;
  private invertedColors = false;

  private bgRectVisibleOptions = {
    fill: '#ee4',
    opacity: 0.7
  };

  private bgRectNotVisibleOptions = {
    fill: '#eee',
    opacity: 0.7
  };

  private bgRectInvertedOptions = {
    fill: '#e44',
    opacity: 0.7
  };

  constructor(private canvas: any, text: string, options: any) {
    const bgRectOptions = Object.assign({}, options);
    Object.assign(bgRectOptions, this.bgRectVisibleOptions);
    this.bgRect = new fabric.Rect(bgRectOptions);
    const textboxOptions = {
      left: options.left,
      top: options.top,
      width: options.width,
      lineHeight: 1,
      textAlign: 'center',
      fontFamily: options.fontFamily ? options.fontFamily : 'Mufferaw',
      angle: _.has(options, 'angle') ? options.angle : 0
    };
    this.textbox = new fabric.Textbox(text, textboxOptions);
    const rectOptions = {
      left: options.left,
      top: options.top,
      width: options.width,
      height: options.height,
      angle: _.has(options, 'angle') ? options.angle : 0,
      opacity: 0
    };

    this.frontRect = new fabric.Rect(rectOptions);
    if (_.has(options, 'visibleBackground')) {
      this.setVisibleBackground(options.visibleBackground);
    }
    if (_.has(options, 'invertedColors')) {
      this.setInvertedColors(options.invertedColors);
    }
    if (_.has(options, 'fontSize')) {
      this.adjustFontSize(options.width, options.height);
      if (this.textbox.get('fontSize') !== options.fontSize) {
        this.setFontSizeFrozen(true);
        this.textbox.set('fontSize', options.fontSize);
      }
    }

    const handler = () => this.onScaledOrMovedOrRotated();
    this.frontRect.on('scaling', handler);
    this.frontRect.on('moving', handler);
    this.frontRect.on('rotating', handler);

    this.frontRect.on('mousedblclick', () => this.enterEditing());
    this.textbox.on('editing:exited', () => this.canvas.setActiveObject(this.frontRect));
    this.textbox.on('changed', () => this.adjustFontSize(this.frontRect.get('width'), this.frontRect.get('height')));
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
    const width = _.has(options, 'width') ? options.width : this.frontRect.get('width');
    const height = _.has(options, 'height') ? options.height : this.frontRect.get('height');
    if (_.has(options, 'width') || _.has(options, 'height')) {
      this.adjustFontSize(width, height);
    }
    this.centerTextboxVetically();
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

  public textboxOn(event: string, handler: () => void) {
    this.textbox.on(event, handler);
  }

  public get(value: string) {
    return this.frontRect.get(value);
  }

  public getFromTextbox(value: string) {
    return this.textbox.get(value);
  }

  public setToTextbox(key: string, value: any) {
    this.textbox.set(key, value);
    this.adjustFontSize(this.frontRect.get('width'), this.frontRect.get('height'));
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

  public isActiveAndNotEditing(): boolean {
    return this.frontRect === this.canvas.getActiveObject();
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
      this.adjustFontSize(this.frontRect.get('width'), this.frontRect.get('height'));
      this.canvas.renderAll();
    }
  }

  public isVisibleBackground(): boolean {
    return this.visibleBackground;
  }

  public setVisibleBackground(value: boolean) {
    this.visibleBackground = value;
    if (value) {
      this.bgRect.set(this.invertedColors ? this.bgRectInvertedOptions : this.bgRectVisibleOptions);
    } else {
      this.bgRect.set(this.bgRectNotVisibleOptions);
    }
    this.canvas.renderAll();
  }

  public isInvertedColors(): boolean {
    return this.invertedColors;
  }

  public setInvertedColors(value: boolean) {
    this.invertedColors = value;
    if (value && this.visibleBackground) {
      this.bgRect.set(this.bgRectInvertedOptions);
    }
    this.textbox.set('fill', value ? '#fff' : '#000');
    this.canvas.renderAll();
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
    this.adjustFontSize(this.frontRect.get('width'), this.frontRect.get('height'));
  }

  private adjustFontSize(width: number, height: number) {
    if (!this.fontSizeFrozen) {
      const maxVerticalSize = height / this.textbox.get('text').split('\n').length * 0.88;
      this.textbox.set('fontSize', Math.min(width / 4, maxVerticalSize));
      const rectWidth = this.frontRect.get('width');
      const textboxWidth = this.textbox.get('width');
      if (textboxWidth > rectWidth) {
        this.textbox.set('fontSize', this.textbox.get('fontSize') * rectWidth / (textboxWidth + 1));
        this.textbox.set('width', rectWidth);
      }
    }
    this.centerTextboxVetically();
  }

  private centerTextboxVetically() {
    const angle = this.frontRect.get('angle');
    this.frontRect.rotate(0);
    this.textbox.rotate(0);
    this.textbox.set('left', this.frontRect.get('left'));
    this.textbox.set('top', this.frontRect.get('top') + Math.floor((this.frontRect.get('height') - this.textbox.get('height')) / 2));
    this.textbox.rotate(angle);
    this.frontRect.rotate(angle);
  }

}
