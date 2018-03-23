import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseServiceProvider } from "../../providers/firebase-service/firebase-service";
import { Geolocation } from '@ionic-native/geolocation';

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

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

 @ViewChild('map') mapElement: ElementRef;
  
  map: any;
  start: any;
  end:any;
  // mapElement: HTMLElement;
  response: any;
  time:any;
  buslon: any;
  buslat: any;
  lon: any;
  lat: any;
  busicon: any;
  locati: any;
  markerBus: any;
  track:any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer(
  {suppressMarkers: true});
  
  constructor(public navCtrl: NavController, private googleMaps: GoogleMaps, private geolocation: Geolocation, 
  public http: Http, public platform: Platform,
  private firebaseService : FirebaseServiceProvider) {
    platform.ready().then(() => {
      this.getLocation();
      
    });
  }
  // ionViewDidLoad() {
    //    this.loadMap();
    //   }
    getSpecific(){
      this.firebaseService.getSpecificLocation()
      .subscribe((resp)=>{
        this.buslon = resp[0].longitude;
        this.buslat= resp[0].latitude;
        this.locati = new LatLng(this.buslat, this.buslon);
        this.getLocation();
      },
      (err)=>{
        console.log(err);
      })
    }
    
    ionViewDidLoad(){
      //  this.firebaseService.getSpecificLocation()
      // .subscribe((resp)=>{
        //       this.buslon = resp[0].longitude;
        //       this.buslat= resp[0].latitude;
        //       this.getLocation();
        
        //       this.startNavigating();
        //       this.locati = new google.maps.LatLng(this.buslat, this.buslon);
        
        // },
        // (err)=>{
          //   console.log(err);
          // })
          this.firebaseService.getSpecificLocation()
          .subscribe((resp)=>{
            this.buslon = resp[0].longitude;
            this.buslat= resp[0].latitude;
            this.locati = new LatLng(this.buslat, this.buslon);
            this.loadMap();      
          },
          (err)=>{
            console.log(err);
          })          
        }
        
        loadMap(){
          
          // let latLng = new google.maps.LatLng(-34.9290, 138.6010);
          
          let mapOptions = {
            center:this.locati,
            zoom:18,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          
          this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
          var trafficLayer = new google.maps.TrafficLayer();
          trafficLayer.setMap(this.map);
          this.repeat();
          
          // this.map.setTrafficEnabled(true);
          
          //  let markerOptions: MarkerOptions = {
            //   position: this.locati,
            //   icon: { url : 'www/assets/imgs/bus.png' }
            //     };
            //   this.map.addMarker(markerOptions)
            //   .then(
            //     (marker: Marker) => {
              //         this.markerBus=marker;
              //       //marker.showInfoWindow();
              //     }
              //   );
              // 
            }
            
            addMarkerStart(posi){
              var image = {
                url: '../assets/imgs/busMarker.png'};
                if((this.end==null)|| (this.end=="")){
                  this.start = new google.maps.Marker({
                    map: this.map,
                    position: posi,
                    icon:image
                  });
                  let content = "<p>Bus A will arrive in " + this.time + " </p>";         
                  this.addInfoWindow(this.start, content);
                }
                else{
                  this.start.setPosition(posi);
                }
              }
              
              addMarkerEnd(posi){
                if((this.end==null)|| (this.end=="")){
                  this.end = new google.maps.Marker({
                    map: this.map,
                    position: posi
                  });
                  let content = "<p>You are here</p>";         
                  
                  this.addInfoWindow(this.end, content);
                }
                else{
                  this.end.setPosition(posi);
                }
                
                
                
              }
              
              
              addInfoWindow(marker, content){
                
                let infoWindow = new google.maps.InfoWindow({
                  content: content
                });
                
                google.maps.event.addListener(marker, 'click', () => {
                  infoWindow.open(this.map, marker);
                });
                
              }
              startNavigating(){
                this.map.clear;
                this.directionsDisplay.setMap(this.map);
                
                this.directionsService.route({
                  origin: {lat:this.buslat, lng: this.buslon},
                  destination:{lat:this.lat, lng: this.lon},
                  travelMode: google.maps.TravelMode['DRIVING']
                }, (res, status) => {
                  
                  if(status == google.maps.DirectionsStatus.OK){
                    this.time = res.routes[0].legs[0].duration.text;
                    var leg = res.routes[ 0 ].legs[ 0 ];
                    this.map.clear;
                    this.addMarkerStart(leg.start_location);
                    this.addMarkerEnd(leg.end_location);
                    this.directionsDisplay.setDirections(res);
                  } else {
                    console.warn(status);
                  }
                });
                google.maps.event.addListener(this.map, 'center_changed', () => {
                  this.directionsDisplay= new google.maps.DirectionsRenderer(
                  {suppressMarkers: true, preserveViewport:true});
                });
              }
              // loadMap() {
                //   this.mapElement = document.getElementById('map');
                //   //this.locati = new LatLng(this.buslat, this.buslon); 
                //   let mapOptions: GoogleMapOptions = {
                  //     styles: [{ stylers: [
                    //       {saturation: -100}]}],
                    //     camera: {
                      //       target: {
                        //         lat: this.buslat,
                        //         lng: this.buslon
                        //       },
                        //       zoom: 18,
                        //       tilt: 10
                        //     }
                        //   };
                        
                        //   this.map = this.googleMaps.create(this.mapElement, mapOptions);
                        
                        //   // Wait the MAP_READY before using any methods.
                        //             this.directionsDisplay.setMap(this.map);
                        
                        //     this.map.one(GoogleMapsEvent.MAP_READY)
                        //       .then(() => {
                          //         alert('Map is ready!');
                          //       this.map.setTrafficEnabled(true);
                          //         let markerOptions: MarkerOptions = {
                            //     position: this.locati,
                            //     icon: { url : 'www/assets/imgs/bus.png' }
                            //       };
                            //     this.map.addMarker(markerOptions)
                            //     .then(
                            //       (marker: Marker) => {
                              //           this.markerBus=marker;
                              //         //marker.showInfoWindow();
                              //       }
                              //     );
                              
                              
                              //     });
                              
                              //       this.repeat();
                              // }
                              
                              // getCoord(){
                                //   this.http.get('http://192.168.1.4/final/get.php').map(res => res.json()).subscribe(data => {
                                  //       this.response = data;
                                  //       //alert(this.response[0].lon);
                                  //       this.buslon = this.response[0].lon;
                                  //       this.buslat= this.response[0].lat;
                                  //   });
                                  // }
                                  
                                  repeat(){
                                    this.track = setInterval(()=> this.moveBus()
                                    , 5000);
                                  }
                                  getLocation(){
                                    this.geolocation.getCurrentPosition().then((resp) => {
                                      this.lon=resp.coords.longitude;
                                      this.lat=resp.coords.latitude;
                                      console.log(this.lon);
                                      this.startNavigating();
                                      
                                      // this.getSpecific();
                                      //alert(this.lon);
                                      // resp.coords.latitude
                                      // resp.coords.longitude
                                    }).catch((error) => {
                                      console.log('Error getting location', error);
                                    });
                                    
                                  }
                                  
                                  // calculateAndDisplayRoute() {
                                    //     this.directionsService.route({
                                      //       origin: {lat:this.buslat, lng: this.buslon},
                                      //       destination:{lat:this.lat, lng: this.lon},
                                      //       travelMode: google.maps.TravelMode['DRIVING']
                                      //       }, (response, status) => {
                                        //       if(status == google.maps.DirectionsStatus.OK){
                                          //                 this.directionsDisplay.setDirections(response);
                                          //                   // this.directionsDisplay.setMap(this.map);
                                          //                 console.log(response);
                                          //                 console.log(response.routes[0].legs[0].duration.text);
                                          //             } else {
                                            //                 console.warn(status);
                                            //             }
                                            //     });
                                            //   }
                                            // startNavigating(){
                                              
                                              //         // directionsDisplay.setMap(this.map);
                                              
                                              //         this.directionsService.route({
                                                //             origin: {lat:5.7598, lng: 0.2197},
                                                //             destination:{lat:5.6037, lng: 0.1870},
                                                //             travelMode: google.maps.TravelMode['DRIVING']
                                                //         }, (res, status) => {
                                                  
                                                  //             if(status == google.maps.DirectionsStatus.OK){
                                                    //                 this.directionsDisplay.setDirections(res);
                                                    //             } else {
                                                      //                 console.warn(status);
                                                      //             }
                                                      
                                                      //         });
                                                      
                                                      //     }
                                                      
                                                      moveBus() {
                                                        this.getSpecific();
                                                        this.locati = new LatLng(this.buslat, this.buslon); 
                                                        // this.map.moveCamera({
                                                          //   target: this.locati
                                                          // });
                                                        }
                                                      }
                                                      
                                                      
                                                      