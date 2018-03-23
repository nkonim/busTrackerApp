import { RegisterPage } from './register';
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { NavController, IonicPage } from "ionic-angular";

@IonicPage()
@NgModule({
  declarations: [RegisterPage],
  imports: [IonicPageModule.forChild(RegisterPage)]
})
export class RegisterPageModule {}