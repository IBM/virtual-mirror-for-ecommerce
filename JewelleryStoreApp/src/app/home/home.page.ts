import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  name:string;
  age:string;
  gender:string;

  constructor(private nav: NavController,public loadingController:LoadingController,
    private androidPermissions: AndroidPermissions, public providerService: ProviderService,
    public toastController: ToastController){
    this.getCameraPermission();
  }

  getCameraPermission(){
    console.log('--> Camera permission checking in progress');
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then((result) => {
      console.log('Has permission?',result.hasPermission);
      if (!result.hasPermission){
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
      }
    }, (err) => {
      console.log(err);
    });
  }

   //Toast setup

   async presentToastWithOptions(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      showCloseButton: false,
      position: 'bottom',
      duration: 1000
    });
    toast.present();
  }

getRecommendations(){

  if (this.name == null){
    this.presentToastWithOptions("Please Enter a Name");
  }
  else if (this.age == null){
    this.presentToastWithOptions("Please Enter age");
  }
  else if (this.gender == null){
    this.presentToastWithOptions("Please choose a gender");
  }
  else if (this.name != null && this.age != null && this.gender !=null){
    this.nav.navigateForward(`/recommendation/${this.age}/${this.name}/${this.gender}`);
  }
  else {
    this.presentToastWithOptions("Check the Name/Age/Gender and try again.");
  }  
}
}
