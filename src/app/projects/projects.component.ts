import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  constructor(
    public storageService: StorageService
  ) { }

  ngOnInit() {
  }

  public formatSize(size: number): string {
    if (size < 1024) {
      return size.toString() + 'B';
    }
    const mb = 1024 * 1024;
    if (size < mb) {
      return (size / 1024).toFixed(2) + 'KB';
    }
    return (size / mb).toFixed(2) + 'MB';
  }

  public deleteProject(name: string) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      this.storageService.deleteObject(name);
    }
  }

  public deleteAll() {
    if (confirm('Are you sure you want to delete all projects?')) {
      this.storageService.deleteAll();
    }
  }

  public downloadProject(name: string) {
    const blob = new Blob([this.storageService.getObjectAsText(name)], {
      type: 'text/plain;charset=utf-8'
    });
    saveAs(blob, name + '.json');
  }

  public downloadAll() {
    const zip = new JSZip();
    _.forEach(this.storageService.getAllProjects(), (project: {name: string, content: string}) => {
      zip.file(project.name + '.json', project.content);
    });
    zip.generateAsync({type: 'blob'}).then((content) => {
      saveAs(content, `MangaTranslator_projects_${moment().format('Y-MM-DD_HH-mm-ss')}.zip`);
    });
  }

  public loadProject($event) {
    if ($event.target.files.length === 0) {
      return;
    }
    const file: File = $event.target.files[0];
    const jsonTypeString = '.json';
    if (!file.name.endsWith(jsonTypeString)) {
      alert('Incorrect file type, only .json files are accepted.');
      return;
    }
    const name = file.name.substring(0, file.name.length - jsonTypeString.length);
    if (confirm(
      this.storageService.hasObject(name)
      ? `Project ${name} already exists, are you sure you want to overwrite it?`
      : `Are you sure you want to load project ${name}?`
    )) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const content = event.target.result;
        this.storageService.setString(name, content);
      };
      reader.readAsText(file);
    }
  }

}
