import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreModule } from 'angularfire2/firestore';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule} from '@angular/http';
import { Http} from '@angular/http';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { DriverTrackPage } from '../pages/drivertrack/drivertrack';
import { DriverMessPage } from '../pages/drivermess/drivermess';
import { DriverStopsPage } from '../pages/driverstops/driverstops';
// import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireAction } from 'angularfire2/database';
import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 



// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyANWT6gAAvL4O78cCbQhg3Jh_AAqlgFh1Y",
  authDomain: "etaproject-e6512.firebaseapp.com",
  databaseURL: "https://etaproject-e6512.firebaseio.com",
  storageBucket: "etaproject-e6512.appspot.com",
  messagingSenderId: "1003854890345",
  projectId: "etaproject-e6512"
};


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    DriverTrackPage,
    DriverMessPage,
    DriverStopsPage,
    // TabsPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    DriverTrackPage,
    DriverMessPage,
    DriverStopsPage,
    // TabsPage,
    LoginPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseServiceProvider
  ]
})
export class AppModule {
  
}
