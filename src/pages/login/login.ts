import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { User } from "../../interfaces/User";
import { Bus } from "../../interfaces/Bus";
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseServiceProvider } from "../../providers/firebase-service/firebase-service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
 
  animations: [
 
    //For the logo
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0'}),
        animate('2000ms ease-in-out')
      ])
    ]),
 
    //For the background detail
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0)'}),
        animate('1000ms ease-in-out')
      ])
    ]),
 
    //For the login form
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({transform: 'translate3d(0,2000px,0)', offset: 0}),
          style({transform: 'translate3d(0,-20px,0)', offset: 0.9}),
          style({transform: 'translate3d(0,0,0)', offset: 1})
        ]))
      ])
    ]),
 
    //For login button
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({opacity: 0}),
        animate('1000ms 2000ms ease-in')
      ])
    ])
  ]
})
export class LoginPage {
  user = {} as User;
  userType: any;
  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";
 
  constructor(private afAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, private firebaseService : FirebaseServiceProvider) {
      
  }

    async login(user: User) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if (result) {
        console.log(this.firebaseService.getUserType(user.email));
        this.firebaseService.getUserType(user.email)
      .subscribe((resp)=>{
        this.userType=resp[0].type;
        console.log(this.userType);
        if(this.userType=="Driver"){
        this.navCtrl.setRoot('DriverTabsPage');
      }
        if(this.userType=="Rider"){
        this.navCtrl.setRoot('TabsPage');
      }
      
      },
      (err)=>{
        console.log(err);
      })
      
     
      }  
    }
    catch (e) {
      console.error(e);
    }
  }

    register(){
      this.navCtrl.setRoot('RegisterPage');
    }
 
 
}