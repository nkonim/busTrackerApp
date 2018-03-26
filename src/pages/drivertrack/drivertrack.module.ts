import { DriverTrackPage } from './drivertrack';
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { NavController, IonicPage } from "ionic-angular";

@IonicPage()
@NgModule({
  declarations: [DriverTrackPage],
  imports: [IonicPageModule.forChild(DriverTrackPage)]
})
export class DriverTrackPageModule {}