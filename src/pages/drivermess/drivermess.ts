import { Message } from './../../interfaces/Message';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseServiceProvider } from "../../providers/firebase-service/firebase-service";
import {
GoogleMaps,
GoogleMap,
GoogleMapsEvent,
GoogleMapOptions,
CameraPosition,
MarkerOptions,
Marker,
MarkerIcon,
LatLng
} from '@ionic-native/google-maps';
import 'rxjs/add/operator/map';
declare var google: any;

@Component({
  selector: 'page-drivermess',
  templateUrl: 'drivermess.html'
})
export class DriverMessPage {
    apiUrl: string = 'http://localhost/final/get.php';
    response: any;
    lon:any;
    lat:any;
    buslon:any;
    buslat:any;
    loading:any;
    busToTrack:any;
    bus:any = [];
    time:any = [];
    messag = {} as Message;
    date : any = new Date();
    now:string;
    // origin:any;
    // destination:any;
    // travelMode:any;
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
  constructor(public navCtrl: NavController, private geolocation: Geolocation, public http: Http,
  private firebaseService : FirebaseServiceProvider) {
    this.now  = this.date.toISOString();
    console.log(this.now);
    console.log(localStorage.getItem("busGlobal"))
  }
  sendMessage(){
    if(localStorage.getItem("busGlobal"))
        {
          this.busToTrack=localStorage.getItem("busGlobal");
           console.log(this.busToTrack);
        }
        console.log(this.messag.start);
    let mess : Message = {
              bus: this.busToTrack,
              message: this.messag.message,
              start: this.messag.start,
              end: this.messag.end
      };
      this.firebaseService.addMess(mess);
  }
}
