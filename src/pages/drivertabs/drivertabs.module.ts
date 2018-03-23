import { DriverTabsPage } from './drivertabs';
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { NavController, IonicPage } from "ionic-angular";

@IonicPage()
@NgModule({
  declarations: [DriverTabsPage],
  imports: [IonicPageModule.forChild(DriverTabsPage)]
})
export class DriverTabsPageModule {}