import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { RouteModule } from './router/router.module';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from "angular-6-social-login";

import { AppComponent } from './app.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { DevicesComponent } from './components/devices/devices.component';
import { MonitorComponent } from './components/monitor/monitor.component';
import { ManageDevicesComponent } from './components/devices/manage-devices/manage-devices.component';
import { ManageMonitorComponent } from './components/monitor/manage-monitor/manage-monitor.component';
import { DeviceDialogComponent } from './components/monitor/manage-monitor/device-dialog/device-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';

import { DatabaseService } from './services/database.service';
import { CookieService } from 'ngx-cookie-service';
import { MyCookieService } from './services/cookie.service';
import { FacebookService } from './services/facebook.service';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderBarComponent,
    SideBarComponent,
    DevicesComponent,
    MonitorComponent,
    ManageDevicesComponent,
    ManageMonitorComponent,
    DeviceDialogComponent,
    DeleteDialogComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouteModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule
  ],
  providers: [
    DatabaseService,
    MyCookieService,
    FacebookService,
    CookieService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
  ],
  entryComponents: [
    DeleteDialogComponent,
    ManageDevicesComponent,
    ManageMonitorComponent,
    DeviceDialogComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [{
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider("2462994850384693")
    }]
  );
  return config;
}