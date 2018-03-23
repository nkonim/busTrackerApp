import { TabsPage } from './tabs';
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { NavController, IonicPage } from "ionic-angular";

@IonicPage()
@NgModule({
  declarations: [TabsPage],
  imports: [IonicPageModule.forChild(TabsPage)]
})
export class TabsPageModule {}