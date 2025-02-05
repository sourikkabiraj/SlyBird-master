import { NgModule } from '@angular/core';


import { CommonModule } from '@angular/common';

// Angular Material modules
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";

import {MatButtonModule, MatCheckboxModule, MatSlideToggleModule,
        MatSelectModule,MatInputModule,MatRadioModule,MatDialogModule,MatSnackBarModule} from '@angular/material';

// UI components
import { ButtonComponent } from 'ui/button/button.component';
import { DialogService } from "ui/dialog/dialog.service";
import { InputComponent } from "ui/input/input.component";
import { UITabsComponent } from "ui/tab/tabs.component";
import { UITabComponent } from "ui/tab/tab.component";
import { CheckboxComponent } from "ui/checkbox/checkbox.component";
import { DropdownComponent } from "ui/dropdown/dropdown.component";
import { LongTextComponent } from "ui/long-text/long-text.component";
import { ConfirmationDialogComponent } from "ui/dialog/confirmation-dialog/confirmation-dialog.component";
import { NotificationBarService } from "ui/notification-bar/notification-bar.service";
import { RadioButtonComponent } from "ui/radio-button/radio-button.component";
import { ProgressIndicatorComponent } from "ui/progress-indicator/progress-indicator.component";
import { RouteableComponent } from "ui/animations/RouteableComponent";



@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  declarations: [
    ButtonComponent,
    InputComponent,
    UITabsComponent,
    UITabComponent,
    CheckboxComponent,
    DropdownComponent,
    LongTextComponent,
    ConfirmationDialogComponent,
    RadioButtonComponent,
    ProgressIndicatorComponent
  ],
  providers:[
    DialogService,
    NotificationBarService
  ],
  exports:[
    ButtonComponent,
    InputComponent,
    UITabsComponent,
    UITabComponent,
    CheckboxComponent,
    DropdownComponent,
    LongTextComponent,
    ConfirmationDialogComponent,
    RadioButtonComponent,
    ProgressIndicatorComponent
  ],
  entryComponents:[
    ConfirmationDialogComponent
  ]
})
export class UiModule { }
