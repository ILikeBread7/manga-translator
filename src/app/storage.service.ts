import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage = localStorage;
  private lastSaved: Date;
  private hasUnsavedData = false;
  private hasError = false;
  private debouncedSave = new Subject<KeyAndFunction>();

  private PROPERTY_PREFIX = '_mt_property_';

  constructor() {
    if (!this.storage) {
      console.error('Local storage not supported!');
      return;
    }
    this.debouncedSave.pipe(
      debounceTime(1500),
      distinctUntilChanged()
    ).subscribe((data: KeyAndFunction) => this.setObject(data.key, data.getValue()));
  }

  public setObject(key: string, value: any) {
    this.setString(key, JSON.stringify(value));
  }

  public setString(key: string, value: string) {
    try {
      this.storage.setItem(key, value);
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

  public hasObject(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  public getObjectAsText(key: string) {
    return this.storage.getItem(key);
  }

  public deleteObject(key: string) {
    this.storage.removeItem(key);
  }

  public deleteAll() {
    for (let i = 0; i < this.storage.length; i++) {
      const name = this.storage.key(i);
      if (name.startsWith(this.PROPERTY_PREFIX)) {
        continue;
      }
      this.storage.removeItem(name);
      i--;
    }
  }

  public setProperty(key: string, value: string) {
    this.storage.setItem(this.PROPERTY_PREFIX + key, value);
  }

  public getProperty(key: string) {
    return this.storage.getItem(this.PROPERTY_PREFIX + key);
  }

  public listProjects(): ProjectData[] {
    const result = [];
    for (let i = 0; i < this.storage.length; i++) {
      const name = this.storage.key(i);
      if (name.startsWith(this.PROPERTY_PREFIX)) {
        continue;
      }
      result.push({
        name: name,
        size: this.storage.getItem(name).length * 2
      });
    }
    return result;
  }

  public getTotalSize(): number {
    let totalChars = 0;
    for (let i = 0; i < this.storage.length; i++) {
      const name = this.storage.key(i);
      if (name.startsWith(this.PROPERTY_PREFIX)) {
        continue;
      }
      totalChars += this.storage.getItem(name).length;
    }
    return totalChars * 2;
  }

  public getAllProjects(): Project[] {
    const result = [];
    for (let i = 0; i < this.storage.length; i++) {
      const name = this.storage.key(i);
      if (name.startsWith(this.PROPERTY_PREFIX)) {
        continue;
      }
      result.push({
        name: name,
        content: this.storage.getItem(name)
      });
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

interface ProjectData {
  name: string;
  size: number;
}

interface Project {
  name: string;
  content: string;
}
