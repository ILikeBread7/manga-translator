import { Component, OnInit, Input } from '@angular/core';
import { ImageExportService } from '../image-export.service';
import { BubblesService } from '../bubbles.service';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  @Input()
  public currentImage;

  @Input()
  public currentProjectName;

  public showInNewTab = true;
  public omitUntouched = true;

  public exported: NamedBlob[] = [];
  public totalToExport = 0;

  constructor(
    private imageExportService: ImageExportService,
    private bubblesService: BubblesService
  ) { }

  ngOnInit() {
  }

  public exportImage() {
    const callback = this.showInNewTab
      ? (blob) => {
        const fileURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = fileURL;
        link.click();
      }
      : (blob) => {
        saveAs(blob, this.extToPng(this.bubblesService.getCurrentImageName()));
      };
    this.imageExportService.exportImage(this.currentImage, this.bubblesService.getExportBubbles(), callback);
  }

  public exportAll() {
    const files = this.bubblesService.getProjectImages();
    const bubbles = this.bubblesService.getExportBubblesForWholeProject();
    this.totalToExport = this.omitUntouched ? Object.keys(bubbles).length : files.length;
    this.exported = [];
    _.forEach(files, (file) => {
      if (!this.omitUntouched || bubbles[file.name]) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            this.imageExportService.exportImage(img, bubbles[file.name], (blob) => {
              this.exported.push({name: file.name, blob: blob});
              if (this.exported.length === this.totalToExport) {
                this.zipAllExportedImages();
              }
            });
          };
        };
        reader.readAsDataURL(file);
      }
    });
  }

  private extToPng(filename: string) {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot >= 0) {
      filename = filename.substring(0, lastDot);
    }
    return filename + '.png';
  }

  private zipAllExportedImages() {
    this.totalToExport = 0;

    const zip = new JSZip();
    _.forEach(this.exported, (image: NamedBlob) => {
      zip.file(this.extToPng(image.name), image.blob);
    });
    zip.generateAsync({type: 'blob'}).then((content) => {
      saveAs(content,
        `MangaTranslator_${this.currentProjectName}${this.omitUntouched ? '_omitted' : ''}_${moment().format('Y-MM-DD_HH-mm-ss')}.zip`);
    });

    this.exported = [];
  }

}

interface NamedBlob {
  name: string;
  blob: Blob;
}
