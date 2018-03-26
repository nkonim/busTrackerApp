import { Routes } from './../../interfaces/Routes';
import { GPSRecord } from './../../interfaces/GPSRecord';
import { User } from './../../interfaces/User';
import { Message } from './../../interfaces/Message';
import { Bus } from './../../interfaces/Bus';
import { Wait } from './../../interfaces/Wait';
import { Seats } from './../../interfaces/Seats';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, AngularFireList, AngularFireAction } from 'angularfire2/database';
import { Observable } from "rxjs/Observable";
import { Item } from "ionic-angular";

/*
  Generated class for the FirebaseServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseServiceProvider {

    locations =  null; //  list of objects
    allbus = null;
    allRoutes = null;
    locRef = null;
    userRef = null;
    busRef = null;
    waitRef = null;
    stopsRef = null;
    seatsRef = null;
    routesRef = null;
    messRef = null;
    daKey = null;
    waitURL: string = 'waiting';
    userURL: string = 'user-list';
    baseURL: string = 'location-list';
    busURL: string = 'bus-list';
    stopsURL: string = 'stops';
    messURL: string = 'busMessages';
    seatsURL: string = 'seats';
    routesURL: string = 'routes';
    userObs: Observable<User[]>;

  constructor(private afDb: AngularFireDatabase) {
       this.locRef = afDb.list(this.baseURL);
       this.userRef = afDb.list(this.userURL);
       this.busRef = afDb.list<Bus>(this.busURL);
        this.waitRef = afDb.list<Wait>(this.waitURL);
       this.stopsRef = afDb.object(this.stopsURL);
        this.routesRef = afDb.list<Routes>(this.routesURL);
        this.seatsRef = afDb.list(this.seatsURL);
       this.messRef = afDb.list<Message>(this.messURL);
       
      // afList.push({ name: 'item' });
      this.allbus = this.busRef.valueChanges();
      this.allRoutes = this.routesRef.valueChanges();
      this.locations = this.locRef.snapshotChanges();
  }

  // constructor(public db: AngularFireDatabase) {
  //   this.locations = db.list<GPSRecord>(this.baseURL).valueChanges();
  // }

  updateLocation(key:string, lat : any, lon:any, now:any){
      this.locRef.update(key, {latitude: lat, longitude: lon, time: now});
  }

  addLocation(location : GPSRecord){
    this.locRef.push(location);
  }

  addUser(userinfo : User){
    this.userRef.push(userinfo);
  }

  addSeats(seats : Seats){
    this.seatsRef.push(seats);
  }

  addMess(mess: Message){
    this.messRef.push(mess);
  }

  getSeats(bus:any){
    return this.afDb.list<Seats>(this.seatsURL, 
    ref => ref.orderByChild('bus').equalTo(bus)).valueChanges();
  }
  
  updateSeats(key:string, newseats : string){
    this.seatsRef.update(key, {capacity: newseats});
  }

  getLocationList(){
    return this.locations;
  }


  getBusList(){
    return this.allbus;
  }
  
  getSpecificLocation(){
    return this.afDb.list<GPSRecord>(this.baseURL,ref => ref.limitToLast(1)).valueChanges();
  }

  getUserType(email: any){
    return this.afDb.list<User>(this.userURL, 
    ref => ref.orderByChild('email').equalTo(email)).valueChanges();
  }
  
  getWaitInfo(id: any){
      return this.afDb.list<Wait>(this.waitURL, 
    ref => ref.orderByChild('stop_id').equalTo(id)).valueChanges();
  }

  getBusId(name: any){
      return this.afDb.list(this.seatsURL, 
    ref => ref.orderByChild('bus').equalTo(name)).stateChanges();
  }
  
  getBusInfo(name: any){
    return this.afDb.list<Bus>(this.busURL, 
    ref => ref.orderByChild('name').equalTo(name)).valueChanges();
  }

    getRoutesInfo(route: any){
      let key = "routes/"+route;
    return this.afDb.list<Routes>(key, 
    ref => ref.orderByChild('route_id').equalTo(route)).valueChanges();
  }
}