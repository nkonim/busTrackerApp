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
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
    apiUrl: string = 'http://localhost/final/get.php';
    response: any;
    lon:any;
    lat:any;
    buslon:any;
    buslat:any;
    loading:any;
    bus:any = [];
    time:any = [];
    // origin:any;
    // destination:any;
    // travelMode:any;
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
  constructor(public navCtrl: NavController, private geolocation: Geolocation, public http: Http,
  private firebaseService : FirebaseServiceProvider) {

    
  }

ionViewDidLoad(){
    this.loading=true;
    this.getLocation();
  }

getSpecific(){
this.firebaseService.getSpecificLocation()
.subscribe((resp)=>{
  if(resp[0].longitude<=6){
      this.buslon = resp[0].longitude;
      this.buslat= resp[0].latitude;
      this.calculateAndDisplayRoute();
  }
},
(err)=>{
  console.log(err);
})
}

getLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lon=resp.coords.longitude;
      this.lat=resp.coords.latitude;
      console.log(this.lon);
      this.getSpecific();
      //alert(this.lon);
 // resp.coords.latitude
 // resp.coords.longitude
}).catch((error) => {
  console.log('Error getting location', error);
});

  }

   calculateAndDisplayRoute() {
    console.log(this.lon);
    this.directionsService.route({
      origin: {lat:this.buslat, lng: this.buslon},
      destination:{lat:this.lat, lng: this.lon},
      travelMode: google.maps.TravelMode['DRIVING']
      }, (response, status) => {
      if(status == google.maps.DirectionsStatus.OK){
                // this.directionsDisplay.setDirections(response);
                console.log(response);
                console.log(response.routes[0].legs[0].duration.text);
                  this.loading=false;
                  this.bus[0] = response.routes[0].legs[0];

            } else {
                console.warn(status);
            }
    });
  }

}
