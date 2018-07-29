import { Injectable } from '@angular/core';
import { TextRect } from './canvas/text-rect';
import { ExportTextRect } from './export-text-rect';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class BubblesService {

  private projectBubbles: { [name: string]: TextRect[] } = {};
  private textBubbles: TextRect[] = [];
  private deletedTextBubbles: TextRect[] = [];

  constructor() { }

  public addBubble(bubble: TextRect) {
    const id = this.textBubbles.length;
    bubble.setId(id);
    this.textBubbles[id] = bubble;
  }

  public deleteBubble(id: number) {
    this.deletedTextBubbles.push(this.textBubbles[id]);
    this.textBubbles[id].removeFromCanvas();
    delete this.textBubbles[id];
  }

  public getBubble(id: number): TextRect {
    return this.textBubbles[id];
  }

  public isDeletedStackNotEmpty(): boolean {
    return this.deletedTextBubbles.length > 0;
  }

  public undeleteLastBubble() {
    if (this.isDeletedStackNotEmpty()) {
      const bubble = this.deletedTextBubbles.pop();
      this.textBubbles[bubble.getId()] = bubble;
      bubble.addToCanvas();
      bubble.setActive();
    }
  }

  public clearBubbles() {
    this.projectBubbles = {};
    this.textBubbles = [];
    this.deletedTextBubbles = [];
  }

  public changeImage(name: string) {
    this.textBubbles = this.projectBubbles[name];
    if (typeof this.textBubbles === 'undefined') {
      this.textBubbles = this.projectBubbles[name] = [];
    }
    this.deletedTextBubbles = [];
    console.log(this.textBubbles);
  }

  public getCurrentBubbles(): TextRect[] {
    return this.filteredBubbles();
  }

  public getExportBubbles(): ExportTextRect[] {
    return _.map(this.filteredBubbles(), (bubble: TextRect) => new ExportTextRect(bubble));
  }

  private filteredBubbles(): TextRect[] {
    return _.filter(this.textBubbles, (bubble) => !!bubble);
  }

}
