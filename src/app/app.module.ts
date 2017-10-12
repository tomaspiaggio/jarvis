import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SpendingsComponent } from "../pages/spendings/spendings";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {NativeStorage} from "@ionic-native/native-storage";
import {HTTP} from "@ionic-native/http";
// declare var JSEncrypt: any;

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    SpendingsComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    SpendingsComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
