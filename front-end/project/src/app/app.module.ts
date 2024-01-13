import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
// import { ToggleButtonModule } from 'primeng/togglebutton';
// import { RippleModule } from 'primeng/ripple';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    HttpClientModule,
    TableModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    MultiSelectModule,
    ToastModule,
    InputTextModule,
    TagModule,
    ProgressBarModule,
    SliderModule,
    AppRoutingModule,
    // ToggleButtonModule,
    // RippleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
