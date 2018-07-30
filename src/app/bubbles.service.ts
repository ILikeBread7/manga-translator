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
  private currentImageName = '';
  private projectBubbles: ImageToBubblesMap = {};
  private textBubbles: TextRect[] = [];
  private deletedTextBubbles: TextRect[] = [];
  private projectImages: File[];

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

  public startNewProject(projectName: string, canvas: any, addCallbacks: (bubble: TextRect) => void) {
    this.projectName = projectName;
    this.projectBubbles = {};
    this.textBubbles = [];
    this.deletedTextBubbles = [];
    this.loadBubblesFromStorage(projectName, canvas, addCallbacks);
  }

  public hasBubblesForImage(name: string): boolean {
    return this.existsAndNotEmpty(this.projectBubbles[name]);
  }

  public setProjectImages(images: File[]) {
    this.projectImages = images;
  }

  public getProjectImages(): File[] {
    return this.projectImages;
  }

  private loadBubblesFromStorage(projectName: string, canvas: any, addCallbacks: (bubble: TextRect) => void) {
    const savedBubbles = this.storageService.getObject(projectName);
    if (!savedBubbles) {
      return;
    }
    _.forOwn(savedBubbles, (bubbles: any, name: string) => {
      let id = 0;
      this.projectBubbles[name] = _.map(bubbles, (bubble) => {
        const rect = this.createTextRect(canvas, bubble);
        addCallbacks(rect);
        rect.setId(id++);
        return rect;
      });
    });
  }

  public changeImage(name: string) {
    this.textBubbles = this.projectBubbles[name];
    if (typeof this.textBubbles === 'undefined') {
      this.textBubbles = this.projectBubbles[name] = [];
    }
    this.currentImageName = name;
    this.deletedTextBubbles = [];
  }

  public getCurrentBubbles(): TextRect[] {
    return this.filteredBubbles();
  }

  public getExportBubbles(): ExportTextRect[] {
    return this.mapToExportBubbles(this.textBubbles);
  }

  public getExportBubblesForWholeProject(): { [name: string]: ExportTextRect[] } {
    return this.getProjectExportBubbles();
  }

  public saveBubbles() {
    this.storageService.setObjectWithDelay(this.projectName, () => this.getProjectExportBubbles());
  }

  public getCurrentImageName() {
    return this.currentImageName;
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

  private getProjectExportBubbles() {
    return _.pickBy(
            _.mapValues(this.projectBubbles
              , (bubbles: TextRect[]) =>
                _.map(this.filterBubbles(bubbles)
                  , (bubble: TextRect) => new ExportTextRect(bubble)
                )
            ) , (bubblesForFile) => this.existsAndNotEmpty(bubblesForFile)
    );
  }

  private createTextRect(canvas, savedObject): TextRect {
    return new TextRect(
      canvas,
      savedObject.text,
      {
        left: savedObject.left,
        top: savedObject.top,
        width: savedObject.width,
        height: savedObject.height,
        angle: savedObject.angle,
        fontSize: savedObject.fontSize,
        fontFamily: savedObject.fontFamily,
        visibleBackground: savedObject.visibleBackground,
        invertedColors: savedObject.invertedColors
      }
    );
  }

  private existsAndNotEmpty(arr: any[]) {
    return arr && arr.length > 0;
  }

}

interface ImageToBubblesMap {
  [name: string]: TextRect[];
}
