import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ZoomComponent } from './zoom/zoom.component';
import { ImageSelectComponent } from './image-select/image-select.component';
import { CanvasComponent } from './canvas/canvas.component';
import { BubbleDetailsComponent } from './bubble-details/bubble-details.component';
import { ProjectsComponent } from './projects/projects.component';
import { ExportComponent } from './export/export.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ZoomComponent,
    ImageSelectComponent,
    CanvasComponent,
    BubbleDetailsComponent,
    ProjectsComponent,
    ExportComponent
  ],
  imports: [
    BrowserModule,
    environment.production ? ServiceWorkerModule.register('ngsw-worker.js') : []
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
