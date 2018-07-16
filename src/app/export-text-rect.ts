import { TextRect } from './canvas/text-rect';

export class ExportTextRect {

  private left: number;
  private top: number;
  private width: number;
  private height: number;
  private fontSize: number;
  private fontFamily: number;
  private angle: number;
  private visibleBackground: boolean;
  private invertedColors: boolean;
  private text: string;

  constructor(rect: TextRect) {
    this.left = rect.get('left');
    this.top = rect.get('top');
    this.width = rect.get('width');
    this.height = rect.get('height');
    this.fontSize = rect.getFromTextbox('fontSize');
    this.fontFamily = rect.getFromTextbox('fontFamily');
    this.angle = rect.get('angle');
    this.visibleBackground = rect.isVisibleBackground();
    this.invertedColors = rect.isInvertedColors();
    this.text = rect.getFromTextbox('text');
  }

  public getLeft() {
    return this.left;
  }

  public getTop() {
    return this.top;
  }

  public getWidth() {
    return this.width;
  }

  public getHeight() {
      return this.height;
  }

  public getFontSize() {
      return this.fontSize;
  }

  public getFontFamily() {
      return this.fontFamily;
  }

  public getAngle() {
      return this.angle;
  }

  public isVisibleBackground() {
      return this.visibleBackground;
  }

  public isInvertedColors() {
      return this.invertedColors;
  }

  public getText() {
      return this.text;
  }

}
