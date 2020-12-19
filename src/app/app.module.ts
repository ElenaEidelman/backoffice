import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import {CdkTreeModule} from '@angular/cdk/tree';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';






import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin/admin.component';
import { MenuComponent } from './admin/menu/menu.component';
import { LoginComponent } from './admin/login/login.component';
import { HeaderComponent } from './admin/header/header.component';
import { ContentComponent } from './admin/content/content.component';
import { EditingComponent } from './admin/editing/editing.component';
import { GalleryComponent, ImgModal } from './admin/pageViewElements/galleryElement/gallery.component';
import { Dialog } from './admin/dialogs/dialog/dialog.component';
import { DialogConfirm } from './admin/dialogs/dialog-confirm/dialog-confirm.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EditorElementComponent } from './admin/pageViewElements/editor-element/editor-element.component';
import { IOPipe } from './admin/Pipes/Iterable object/io.pipe';
import { FluppPipe } from './admin/Pipes/flupp.pipe';
import { StatisticElementComponent } from './admin/pageViewElements/statistic-element/statistic-element.component';



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    MenuComponent,
    LoginComponent,
    HeaderComponent,
    ContentComponent,
    EditingComponent,
    GalleryComponent,
    Dialog,
    ImgModal,
    DialogConfirm,
    EditorElementComponent,
    IOPipe,
    FluppPipe,
    StatisticElementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    CdkTreeModule,
    QuillModule.forRoot(),
    FormsModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatMenuModule,
    MatRadioModule,
    Ng2ImgMaxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatExpansionModule
  ],
  providers: [ImgModal,DialogConfirm,Dialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
