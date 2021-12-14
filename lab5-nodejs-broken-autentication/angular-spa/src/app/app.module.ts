import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { ROUTES } from './app.routes';

import { AuthService } from './auth/auth.service';
import { TimesheetsService } from './services/timesheets.service';
import { UsersService } from './services/user.service';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AuthGuardService } from './auth/auth-guard.service';
import { ScopeGuardService } from './auth/scope-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { CallbackComponent } from './callback/callback.component';
import { TimesheetListComponent } from './timesheet-list/timesheet-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { TimesheetAddComponent } from './timesheet-add/timesheet-add.component';
import { ApprovalComponent } from './approval/approval.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenGetter: (() => localStorage.getItem('access_token')),
    globalHeaders: [{'Content-Type': 'application/json'}],
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    CallbackComponent,
    UserListComponent,
    TimesheetListComponent,
    TimesheetAddComponent,
    ApprovalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    AuthService,
    AuthGuardService,
    ScopeGuardService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    TimesheetsService,
    UsersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
