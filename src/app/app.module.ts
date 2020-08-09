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



import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin/admin.component';
import { MenuComponent } from './admin/menu/menu.component';
import { LoginComponent } from './admin/login/login.component';
import { HeaderComponent } from './admin/header/header.component';
import { ContentComponent } from './admin/content/content.component';
import { EditingComponent } from './admin/editing/editing.component';



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    MenuComponent,
    LoginComponent,
    HeaderComponent,
    ContentComponent,
    EditingComponent
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
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
