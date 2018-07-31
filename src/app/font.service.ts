import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FontService {

  private lastUsedFont: string;

  constructor(
    private storageService: StorageService
  ) {
    this.lastUsedFont = storageService.getProperty('lastUsedFont');
  }

  public setLastUsedFont(font: string) {
    this.lastUsedFont = font;
    this.storageService.setProperty('lastUsedFont', font);
  }

  public getLastUsedFont(): string {
    return this.lastUsedFont;
  }

}
