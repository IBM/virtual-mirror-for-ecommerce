import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';  
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
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
  manualdetails:boolean = false;
  photos:any;
  rawImage:any;
  result:any = [];
  data:Observable<any>;
  flag:boolean = false;
  flag2:boolean = false;
  flag3:boolean = false;
  myphoto:any = null;
  fileTransfer:FileTransferObject;
  upload:any;
  url:string;
  VisualRecognitionAPI:string;
  VisualRecognitionAccess:any;

  constructor(private camera:Camera, private base64ToGallery: Base64ToGallery,
    private file: File, private http: HttpClient, private transfer:FileTransfer,
    private filePath:FilePath, private fileChooser:FileChooser, private nav: NavController,
    public loadingController:LoadingController, public actionSheetController: ActionSheetController,
    private androidPermissions: AndroidPermissions, public providerService: ProviderService, public toastController: ToastController){
    this.getCameraPermission();
    this.inputMethod(false);
  }

  inputMethod(value: boolean){
    this.manualdetails = value;
    if (!this.manualdetails){
      this.loadVisualRecognition();
    }
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

  async loadVisualRecognition() {
    const loading = await this.loadingController.create({
      message: 'Checking Watson Visual Recognition Configuration...',
    });
    loading.present().then(() => {
      console.log('--> Checking Watson Visual Recognition Configuration');
        this.providerService.getVisualRecognitionAccess().then( (VisualRecognitionAccess) => {
          this.VisualRecognitionAccess = VisualRecognitionAccess;
          console.log('--> Received Object: '+this.VisualRecognitionAccess);
          this.url = this.VisualRecognitionAccess.VisualRecognitionApi;
          console.log('--> Visual Recognition configured: '+this.url);
          loading.dismiss();
          this.presentToastWithOptions("Visual Recognition Configured.");
        }, (err) => {
          console.log("--> MobileFirst Foundation error: "+err);
          this.manualdetails = true;
          loading.dismiss();
          this.presentToastWithOptions("Visual Recognition is not configured.");
        });
    }).catch (() => {
      this.presentToastWithOptions("MobileFirst Foundation Adapter Failed to make API call.");
    });
  }


async captureImage(useAlbum: boolean) {
  console.log('--> Image Capture in progress');
  this.flag = true;
  const CaptureOptions: CameraOptions = {
    quality: 40,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    ...useAlbum ? {sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM} : {}
  }
  const imageData = await this.camera.getPicture(CaptureOptions);
  this.myphoto = `data:image/jpeg;base64,${imageData}`;

  if (!useAlbum) {
    const saveOptions = {
      prefix: 'Watson',
      mediaScanner:true
    }
    this.base64ToGallery.base64ToGallery(imageData, saveOptions).then(
      res => console.log('Saved image to gallery ', this.rawImage = res),
      err => console.log('Error saving image to gallery ', err));
    }
    alert('Now select the image from the list...');
    this.uploadFile();
  }

async uploadFile(){
  this.flag = true;
  this.flag3 = true;
  var url = this.url+'/api/Upload';
  const loading = await this.loadingController.create({
    message: 'Making Watson Visual Recognition API call please wait...',
  });
  this.fileChooser.open().then((uri) => {
    console.log(uri);
    loading.present().then(() => {
    this.filePath.resolveNativePath(uri).then((nativepath) => {
      this.fileTransfer = this.transfer.create();
      const UploadOptions:FileUploadOptions = {
        fileKey:'imgUploader',
        fileName:'image.jpg',
        chunkedMode:false,
        headers:{},
        mimeType:'multipart/form-data',
      }
      this.fileTransfer.upload(nativepath,url,UploadOptions).then((data) =>{
        loading.dismiss();
        this.WatsonVisualRecognition();
      },(err) => {
        loading.dismiss();
        alert('ERROR: '+JSON.stringify(err));
      })
    },(err)=> {
      alert(JSON.stringify(err));
    })
  },(err) => {
    loading.dismiss();
    alert('Error Making API Call: '+JSON.stringify(err));
  });
})
}

async WatsonVisualRecognition(){  
  var url = this.url+'/watson';
  const loading = await this.loadingController.create({
    message: 'Analysing Image please wait...',
  });
  
  loading.present().then( () => {
    
    console.log('--> Calling Watson API');

      this.data = this.http.get(url);
      this.data.subscribe(data => {
      this.result = data;
      for (const i of data) {
        this.age = i.age;
        this.gender = i.gender;
      }
      
      this.flag2 = true;
      loading.dismiss();
    });
  });
}

async presentActionSheet() {
  const actionSheet = await this.actionSheetController.create({
    header: 'Watson Visual Recognition',
    buttons: [{
      text: 'Open camera to capture your Image',
      icon: 'camera',
      handler: () => {
        this.captureImage(false);
      }
    }, {
      text: 'Choose your existing Image',
      icon: 'photos',
      handler: () => {
        this.uploadFile();
      }
    }]
  });
  await actionSheet.present();
}

getRecommendations(){
  if (this.gender == 'MALE'){
    this.gender = 'M';
  }
  if (this.gender == 'FEMALE'){
    this.gender = 'F';
  }

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
