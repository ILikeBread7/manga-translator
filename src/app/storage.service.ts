import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage = window.localStorage;
  private lastSaved: Date;
  private hasUnsavedData = false;
  private hasError = false;
  private debouncedSave = new Subject<KeyAndFunction>();

  constructor() {
    if (!this.storage) {
      console.error('Local storage not supperted!');
      return;
    }
    this.debouncedSave.pipe(
      debounceTime(3000),
      distinctUntilChanged()
    ).subscribe((data: KeyAndFunction) => this.setObject(data.key, data.getValue()));
  }

  public setObject(key: string, value: any) {
    try {
      this.storage.setItem(key, JSON.stringify(value));
      this.lastSaved = new Date();
      this.hasUnsavedData = false;
      this.hasError = false;
    } catch (e) {
      console.error(e);
      this.hasError = true;
    }
  }

  public setObjectWithDelay(key: string, getValue: () => any) {
    this.hasUnsavedData = true;
    this.debouncedSave.next({key: key, getValue: getValue});
  }

  public getObject(key: string) {
    return JSON.parse(this.storage.getItem(key));
  }

  public deleteObject(key: string) {
    this.storage.removeItem(key);
  }

  public listObjects(): string[] {
    const result = [];
    for (let i = 0; i < this.storage.length; i++) {
      result.push(this.storage.key(i));
    }
    return result;
  }

  public getLastSaved(): Date {
    return this.lastSaved;
  }

  public getHasUnsavedData(): boolean {
    return this.hasUnsavedData;
  }

  public getHasError(): boolean {
    return this.hasError;
  }

}

interface KeyAndFunction {
  key: string;
  getValue: () => any;
}
