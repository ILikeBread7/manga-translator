import { Injectable } from '@angular/core';
import { TextRect } from './canvas/text-rect';
import { ExportTextRect } from './export-text-rect';
import * as _ from 'lodash';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class BubblesService {

  private projectName = '';
  private projectBubbles: { [name: string]: TextRect[] } = {};
  private textBubbles: TextRect[] = [];
  private deletedTextBubbles: TextRect[] = [];

  constructor(
    private storageService: StorageService
  ) { }

  public addBubble(bubble: TextRect) {
    const id = this.textBubbles.length;
    bubble.setId(id);
    this.textBubbles[id] = bubble;
    this.saveBubbles();
  }

  public deleteBubble(id: number) {
    this.deletedTextBubbles.push(this.textBubbles[id]);
    this.textBubbles[id].removeFromCanvas();
    delete this.textBubbles[id];
    this.saveBubbles();
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
      this.saveBubbles();
    }
  }

  public startNewProject(projectName: string) {
    this.projectName = projectName;
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
  }

  public getCurrentBubbles(): TextRect[] {
    return this.filteredBubbles();
  }

  public getExportBubbles(): ExportTextRect[] {
    return this.mapToExportBubbles(this.textBubbles);
  }

  public saveBubbles() {
    this.storageService.setObjectWithDelay(this.projectName, () => this.getProjectBubblesForSaving());
  }

  private mapToExportBubbles(bubbles: TextRect[]): ExportTextRect[] {
    return _.map(this.filterBubbles(bubbles), (bubble: TextRect) => new ExportTextRect(bubble));
  }

  private filteredBubbles(): TextRect[] {
    return this.filterBubbles(this.textBubbles);
  }

  private filterBubbles(bubbles: TextRect[]): TextRect[] {
    return _.filter(bubbles, (bubble) => !!bubble);
  }

  private getProjectBubblesForSaving() {
    return _.mapValues(this.projectBubbles, (bubbles: TextRect[]) =>
      _.map(this.filterBubbles(bubbles), (bubble: TextRect) => new ExportTextRect(bubble))
    );
  }

}
