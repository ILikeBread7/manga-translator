import 'fabric';
declare const fabric: any;

export class TextRect {

  private frontRect;
  private bgRect;
  private textbox;

  constructor(private canvas: any, text: string, options: any) {
    this.bgRect = new fabric.Rect(options);
    const dims = {
      left: options.left,
      top: options.top,
      width: options.width
    };
    this.textbox = new fabric.Textbox(text, dims);
    dims['height'] = options.height;
    dims['opacity'] = 0;
    this.frontRect = new fabric.Rect(dims);
    const handler = () => this.onScaledOrMovedOrRotated();
    this.frontRect.on('scaling', handler);
    this.frontRect.on('moving', handler);
    this.frontRect.on('rotating', handler);

    this.frontRect.on('mousedblclick', () => this.enterEditing());
    this.textbox.on('editing:exited', () => this.canvas.setActiveObject(this.frontRect));
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
  }

  public get(value: string) {
    return this.frontRect.get(value);
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
    this.canvas.setActiveObject(this.textbox);
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
  }

}
