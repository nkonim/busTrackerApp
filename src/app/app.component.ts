import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Events } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = LoginPage;
  allStops:any = []; 
  bus:any;


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // this.allStops=JSON.parse(localStorage.getItem("stops"));
    
    });
    events.subscribe('stops:added', (stops, busName) => {
    // user and time are the same arguments passed in `events.publish(user, time)`
    this.allStops=JSON.parse(stops);
    this.bus = busName;
    console.log(stops);
    console.log(this.allStops[0]);
  });

  }
}
