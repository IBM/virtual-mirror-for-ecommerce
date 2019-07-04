import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import {DomSanitizer} from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { ProviderService } from '../provider.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-virtualmirror',
  templateUrl: './virtualmirror.page.html',
  styleUrls: ['./virtualmirror.page.scss'],
})
export class VirtualmirrorPage implements OnInit {

  virtualMirrorAPI:string;
  virtualMirrorAccess:any;
  objectStorageAccess:any;
  objectStorageBaseUrl:string;
  receivedUrl:string;
  folder:string;
  finalUrl:string; 
  imgUrl:string;
  type:string;
  height:string;
  width:string;

  constructor(public loadingController:LoadingController, public toastController: ToastController, private activatedRoute: ActivatedRoute, public sanitizer: DomSanitizer, public providerService: ProviderService) { 
    
    // Get the parameters from recommendation page

    this.folder = this.activatedRoute.snapshot.paramMap.get('folder');
    this.receivedUrl = this.activatedRoute.snapshot.paramMap.get('imageUrl');
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.height = this.activatedRoute.snapshot.paramMap.get('height');
    this.width = this.activatedRoute.snapshot.paramMap.get('width');
    this.virtualMirrorAPI = this.activatedRoute.snapshot.paramMap.get('api');

  }


  async presentToastWithOptions(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      showCloseButton: false,
      position: 'bottom',
      duration: 1000
    });
    toast.present();
  }


  // Connect to Cloud Object Storage through Mobile Foundation

  async loadCloudObjectStorageData() {
    const loading = await this.loadingController.create({
      message: 'Authorizing Cloud Object Storage...',
    });
    loading.present().then(() => {
      console.log('--> Cloud Object Storage authorization method in Virtual Mirror page called');
        this.providerService.getObjectStorageAccess().then(objectStorageAccess => {
          this.objectStorageAccess = objectStorageAccess;
          console.log('--> Received Object: '+this.objectStorageAccess);
          this.objectStorageBaseUrl = this.objectStorageAccess.baseUrl;
          this.imgUrl=this.objectStorageBaseUrl+this.folder+"/"+this.receivedUrl;
          console.log('--> Image: '+this.imgUrl);
          loading.dismiss();
          this.presentToastWithOptions("Cloud Object Storage authorization successful.");
        });
    }).catch (() => {
      this.presentToastWithOptions("MobileFirst Foundation Adapter Failed to authorize COS.");
    });
  }

  async VirtualMirror(){
    const loading = await this.loadingController.create({
      message: 'please wait...',
    });
    const loadingagain = await this.loadingController.create({
      message: 'Loading Virtual Mirror...',
      duration: 6000
    });   
    loading.present().then( () => {
      this.finalUrl="https://"+this.virtualMirrorAPI+"/page2.html?para1="+this.imgUrl+"="+this.type+"="+this.height+"="+this.width;
      console.log('--> Final URL: '+this.finalUrl);
      loading.dismiss();
      loadingagain.present();
    });
  }

  ngOnInit() {
    this.loadCloudObjectStorageData();
    
    if(this.virtualMirrorAPI !== null)
    {
      this.VirtualMirror();
    }
    else
    {
      this.presentToastWithOptions("Virtual Mirror Not Configured. Cannot Open.");
    }
  }
}

// !Important -> Required to display iframe

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(finalUrl) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }
} 
