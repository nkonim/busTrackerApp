import { Component } from '@angular/core';
import { NavController, IonicPage } from "ionic-angular";

import { DriverTrackPage } from '../drivertrack/drivertrack';
import { DriverMessPage } from '../drivermess/drivermess';
import { DriverStopsPage } from '../driverstops/driverstops';
@IonicPage()
@Component({
  templateUrl: 'drivertabs.html'
})
export class DriverTabsPage {

  tab1Root = DriverTrackPage;
  tab2Root = DriverStopsPage;
  tab3Root = DriverMessPage;

  constructor() {

  }
}
