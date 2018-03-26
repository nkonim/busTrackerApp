import { LoginPage } from './../login/login';
import { DriverMessPage } from './../drivermess/drivermess';
import { Component, transition, style } from '@angular/core';
import { NavController,IonicPage,ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FirebaseServiceProvider } from "../../providers/firebase-service/firebase-service";
import { GPSRecord } from "../../interfaces/GPSRecord";
import { Bus } from "../../interfaces/Bus";
import 'rxjs/add/operator/map';
import { mapStyle } from '../style/mapStyle';
import { nightStyle } from '../style/nightStyle';
import { MenuController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';

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
@IonicPage()
@Component({
  selector: 'page-drivertrack',
  templateUrl: 'drivertrack.html'
})
export class DriverTrackPage {
  
  loaded:boolean;
  // getURL: string  = "http://192.168.1.4/final/index.php";
  toggled: boolean = false;
  locati: any = [];
  busses: any = [];
  busStops: any = [];
  busStopsNames: any = [];
  busStopsLoca: any  = [];
  bussesInfo:  any = [];
  stopsAndEta: any = [];
  theRoute = null;
  lon:any;
  lat:any;
  stopTime:string;
  track:any;
  dataArray:any;
  busnum:any;
  setBus:boolean;
  confirmpage:boolean=false;
  busToTrack:any;
  viewM:any;
  map: any;
  start: any;
  end:any;
  endName: any;
  waitingPass: any;
  spin:boolean;
  // mapElement: HTMLElement;
  num:string;
  response: any;
  time:any;
  buslon: any;
  buslat: any;
  lonMap: any;
  latMap: any;
  busicon: any;
  locatiMap: any;
  busSeats: any;
  markerBus: any;
  trackMap:any;
  busKey:any;
  trackstatus:string="Stop Tracking";
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer(
  {suppressMarkers: true});
  
  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private geolocation: Geolocation,
  public http:Http, public afDatabase: AngularFireDatabase, private firebaseService : FirebaseServiceProvider,
  private googleMaps: GoogleMaps, public popoverCtrl: PopoverController, public events: Events) {
    // this.firebaseService.addStops();
  }
  
  ngOnInit() {
    this.firebaseService.getBusList().subscribe((resp)=>{
      // this.busses.push(resp);
      console.log(resp[0].name);
      resp.forEach( bus => {
        console.log(bus.name);
        this.busses.push(bus.name);
        this.setBus=true;
        return false;
      });
      console.log(resp);
    },
    (err)=>{
      console.log(err);
    })
  }
  addSeat(){
    if(this.busSeats<30){
      this.busSeats=this.busSeats+1;
    }
    this.updateSeats();
  }
  
  reduceSeat(){
    if(this.busSeats>0){
      this.busSeats=this.busSeats-1;
    }
    this.updateSeats();
  }
  
  updateSeats(){
    this.firebaseService.updateSeats(this.busKey,this.busSeats);
  }
  
  chooseItem(item){
    this.confirmpage=true;
    this.busToTrack=item;
    
    this.firebaseService.getBusInfo(item).subscribe((resp)=>{
      // this.busses.push(resp);
      
      this.busSeats = resp[0].seats;
      this.endName = resp[0].end;
      console.log(this.latMap);
      this.bussesInfo=resp;
      console.log(resp);
      this.theRoute = resp[0].route;
      localStorage.setItem('busGlobal', this.busToTrack);
      console.log(this.theRoute);
      
      this.firebaseService.getRoutesInfo(this.theRoute).subscribe((m)=>{
        m.forEach( bus => {
          this.busStops.push(bus);
          console.log(bus);
          
        });
        
        var i = 0;
        var len = this.busStops.length;
        for (; i < len; ) {
          this.busStopsNames.push(this.busStops[i].stop_name);
          
          i++;
        }
        var ready = "yes";
        localStorage.setItem('ready', ready);
        
        this.latMap=this.busStops[len-1].stop_lat;
        this.lonMap=this.busStops[len-1].stop_lon;
        localStorage.setItem('endLat', this.latMap);
        localStorage.setItem('endLon', this.lonMap);
        var t = 0;
        for (; t < len; ) {
          let stopLoca = new LatLng(this.busStops[t].stop_lat, this.busStops[t].stop_lon);
          this.busStopsLoca.push({location: stopLoca});
          t++;
        }
        console.log(this.busStopsLoca);
      },
      (err)=>{
        console.log(err);
      })
      
    },
    (err)=>{
      console.log(err);
    })
    
    
    
    this.firebaseService.getBusId(item).subscribe((resp)=>{
      this.busKey = resp.key;
      console.log(this.busKey)
    },
    (err)=>{
      console.log(err);
    })
    
  }
  
  
  toggle() {
    this.toggled = !this.toggled;
    if(this.toggled==true)
    {
      this.trackstatus="Start Tracking";
      this.stop();
    }
    if(this.toggled==false)
    {
      this.trackstatus="Stop Tracking";
      this.repeat();
    }
  }
  
  repeat(){
    this.track = setInterval(()=> this.getLocation()
    , 5000);
  }
  
  openMess(){
        let modal = this.modalCtrl.create(DriverMessPage);
        modal.present();
      }
logout(){
          this.navCtrl.setRoot(LoginPage);
}
  stop(){ 
    clearInterval(this.track);
    this.track=0;
  }
  getLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      let location : GPSRecord = {
        time : Date(),
        bus: this.busToTrack,
        longitude: resp.coords.longitude,
        latitude: resp.coords.latitude
      };
      this.locati[0]=resp.coords.latitude + " , " + resp.coords.longitude;
      
      // this.lon=resp.coords.longitude;
      // this.lat=resp.coords.latitude;
      //  alert(resp.coords.latitude + "" + resp.coords.longitude);
      console.log('inside getLocation');
      this.sendLocation(location);
      //alert(this.lon);
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    
  }
  
  // sendLocation(){
    //   var headers = new Headers();
    //   //headers.append("Accept", 'application/json');
    //   headers.append('Access-Control-Allow-Origin', '*');
    //   headers.append('Content-Type', 'application/json' );
    
    //   let options = new RequestOptions({ headers: headers });
    //     let body = {
      //       lon: this.lon,
      //       lat: this.lat
      //     };
      //     this.http.post(this.getURL, body, options)
      //     .subscribe((data) =>
      //     {
        //       console.log(data['_body']);
        //       console.log(body);
        //       },error => {
          //       console.log(error);
          //     });
          // }
          
          sendLocation(location : GPSRecord){
            this.firebaseService.addLocation(location);
          }
          
          // getLocations(){
            //   this.firebaseService.getLocationList()
            //   .subscribe((response)=>{
              //     console.log(response);
              //     console.log('here');
              //   },(err)=>{
                //     console.log(err);
                //   })
                // }
                
                // getSpecific(){
                  //   this.firebaseService.getSpecificLocation()
                  //   .subscribe((resp)=>{
                    //     console.log(resp[0].latitude);
                    //   },
                    //   (err)=>{
                      //     console.log(err);
                      //   })
                      // }
                      viewMap(){
                        this.spin=true;
                        console.log("in");
                        this.geolocation.getCurrentPosition().then((resp) => {
                          this.buslon=resp.coords.longitude;
                          this.buslat=resp.coords.latitude;
                          this.locatiMap = new LatLng(this.buslat, this.buslon);
                          console.log(this.lonMap);
                          this.loadMap();
                          this.loaded=true;
                          this.startNavigating();
                          this.addMarkers();
                          console.log("out");
                          // this.getSpecific();
                          //alert(this.lon);
                          // resp.coords.latitude
                          // resp.coords.longitude
                        }).catch((error) => {
                          console.log('Error getting location', error);
                        });        
                      }
                      
                      move(){
                        this.trackMap = setInterval(()=> this.moveBus()
                        , 5000);
                      }
                      loadMap(){
                        console.log("started");
                        // let latLng = new google.maps.LatLng(-34.9290, 138.6010);
                        let style = [];
                        if(this.isNight()){
                          style = nightStyle;
                        }
                        else{
                          style = mapStyle;
                        }
                        let mapOptions = {
                          center:this.locatiMap,
                          zoom:10,
                          mapTypeId: google.maps.MapTypeId.ROADMAP,
                          streetViewControl: false,
                          fullscreenControl:false,
                          mapTypeControl: false,
                          zoomControl:false,
                          styles: style
                        }
                        
                        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                        var trafficLayer = new google.maps.TrafficLayer();
                        trafficLayer.setMap(this.map);
                        this.move();
                        this.spin=false;
                        
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
                          isNight(){
                            let time = new Date().getHours();
                            return (time > 5 && time < 19) ? false : true;
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
                                let content = "<p>Bus " + this.busToTrack + "</p>";  
                                this.addInfoWindow(this.start, content);
                              }
                              else{
                                this.start.setPosition(posi);
                              }
                            }
                            
                            // addMarkerEnd(posi){
                              
                              //   if((this.end==null)|| (this.end=="")){
                                //     this.end = new google.maps.Marker({
                                  //       map: this.map,
                                  //       position: posi
                                  //     });
                                  
                                  //     let content = "<p>Bus " + this.busToTrack + " will arrive at " +this.endName+" in about " + this.time + " </p>";
                                  //     this.addInfoWindow(this.end, content);
                                  //   }
                                  //   else{
                                    //     this.end.setPosition(posi);
                                    //   }
                                    
                                    // }
                                    
                                    addMarkers(){
                                      var i = 0;
                                      var len = this.busStops.length;
                                      var image = {
                                        url: '../assets/imgs/stop.png'};
                                        for (; i < len; ) {
                                          this.num = this.busStops[i].stop_sequence;
                                          let locMark = new google.maps.LatLng(this.busStops[i].stop_lat, this.busStops[i].stop_lon);
                                          let mark = new google.maps.Marker({
                                            map: this.map,
                                            position: locMark,
                                            icon: image,
                                            label: {text:""+this.num, color:"white"}
                                          });
                                          
                                          let content = "<p>" + this.busStopsNames[i]+ " </p>";
                                          this.addInfoWindow(mark, content);
                                          // mark.setLabel(""+this.num);
                                          mark.setPosition(locMark);
                                          i++;
                                        }
                                      }
                                      
                                      showMap(){
                                        this.confirmpage=false;
                                        this.setBus=false;
                                        
                                        this.viewM=true;
                                        this.viewMap();
                                      }
                                      
                                      addInfoWindow(marker, content){
                                        
                                        let infoWindow = new google.maps.InfoWindow({
                                          content: content
                                        });
                                        
                                        google.maps.event.addListener(marker, 'click', () => {
                                          infoWindow.open(this.map, marker);
                                        });
                                      }
                                      
                                      getETA(){
                                        this.directionsService.route({
                                          origin: {lat:this.buslat, lng: this.buslon},
                                          destination:{lat:this.latMap, lng: this.lonMap},
                                          waypoints:this.busStopsLoca,
                                          optimizeWaypoints:true,
                                          travelMode: google.maps.TravelMode['DRIVING']
                                        }, (res, status) => {
                                          
                                          if(status == google.maps.DirectionsStatus.OK){
                                            this.time = res.routes[0].legs[0].duration.text;
                                          } else {
                                            console.warn(status);
                                          }
                                        });
                                      }
                                      startNavigating(){
                                        this.map.clear;
                                        var polylineOptionsActual = new google.maps.Polyline({
                                          strokeOpacity: 1,
                                          strokeWeight: 1
                                        });
                                        this.directionsDisplay.setMap(this.map);
                                        
                                        this.directionsService.route({
                                          origin: {lat:this.buslat, lng: this.buslon},
                                          destination:{lat:this.latMap, lng: this.lonMap},
                                          waypoints:this.busStopsLoca,
                                          optimizeWaypoints:true,
                                          travelMode: google.maps.TravelMode['DRIVING']
                                        }, (res, status) => {
                                          
                                          if(status == google.maps.DirectionsStatus.OK){
                                            this.time = res.routes[0].legs[0].duration.text;
                                            var leg = res.routes[ 0 ].legs[ 0 ];
                                            var i = 0;
                                            var len = this.busStopsNames.length;
                                            this.stopsAndEta = [];
                                            var theTime=0;
                                            for (; i < len; ) {
                                              theTime= theTime + res.routes[ 0 ].legs[ i ].duration.value;
                                              var date = new Date(theTime * 1000);                                   
                                              if(date.getHours()>0)
                                              {
                                                if(date.getHours()==1){
                                                  if(date.getMinutes()>0){
                                                    if(date.getMinutes()==1){
                                                      this.stopTime = date.getHours() + " hour " + date.getMinutes() + " min ";
                                                    }
                                                    else{
                                                      this.stopTime = date.getHours() + " hour " + date.getMinutes() + " mins ";
                                                    }
                                                  }
                                                  else{
                                                    this.stopTime = date.getHours() + " hour";
                                                  }
                                                }
                                                else{
                                                  if(date.getMinutes()>0){
                                                    if(date.getMinutes()==1){
                                                      this.stopTime = date.getHours() + " hours " + date.getMinutes() + " min";
                                                    }
                                                    else{
                                                      this.stopTime = date.getHours() + " hours " + date.getMinutes() + " mins";
                                                    }
                                                  }
                                                  else{
                                                    this.stopTime = date.getHours() + " hours";
                                                  }
                                                }
                                              }
                                              else{
                                                if(date.getMinutes()>0){
                                                  if(date.getMinutes()==1){
                                                    this.stopTime = date.getMinutes() + " min";
                                                  }
                                                  else{
                                                    this.stopTime = date.getMinutes() + " mins";
                                                  }
                                                }
                                                else{
                                                  if(date.getSeconds()<60){
                                                    this.stopTime = "less than 1 min";
                                                  }
                                                }
                                              }
                                              console.log(this.stopTime);
                                              
                                              this.firebaseService.getWaitInfo(this.busStops[0].stop_id).subscribe((resp)=>{
                                                  this.waitingPass = resp[0].waiting_pass;
                                              },
                                              (err)=>{
                                                console.log(err);
                                              })
                                              
                                              this.stopsAndEta.push({stop:this.busStopsNames[i], eta:this.stopTime, pass:this.waitingPass});
                                              i++;
                                            }
                                            console.log(this.stopsAndEta);
                                            this.events.publish('stops:added', JSON.stringify(this.stopsAndEta),this.busToTrack);
                                            this.map.clear;
                                            this.addMarkerStart(leg.start_location);
                                            // this.addMarkerEnd(leg.end_location);
                                            this.directionsDisplay.setDirections(res);
                                          } else {
                                            console.warn(status);
                                          }
                                        });
                                        google.maps.event.addListener(this.map, 'center_changed', () => {
                                          this.directionsDisplay= new google.maps.DirectionsRenderer(
                                          {suppressMarkers: true, preserveViewport:true, polylineOptions:{strokeOpacity: 1,
                                            strokeWeight: 1}});
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
                                                                                getCurr(){
                                                                                  this.geolocation.getCurrentPosition().then((resp) => {
                                                                                    this.buslon=resp.coords.longitude;
                                                                                    this.buslat=resp.coords.latitude;
                                                                                    this.locatiMap = new LatLng(this.buslat, this.buslon);
                                                                                    // this.getSpecific();
                                                                                    //alert(this.lon);
                                                                                    // resp.coords.latitude
                                                                                    // resp.coords.longitude
                                                                                  }).catch((error) => {
                                                                                    console.log('Error getting location', error);
                                                                                  });        
                                                                                }
                                                                                moveBus() {
                                                                                  this.getCurr();
                                                                                  console.log(this.buslat);
                                                                                  this.locatiMap = new LatLng(this.buslat, this.buslon);
                                                                                  this.startNavigating(); 
                                                                                  // this.map.moveCamera({
                                                                                    //   target: this.locati
                                                                                    // });
                                                                                  }
                                                                                }
                                                                                
                                                                                
                                                                                