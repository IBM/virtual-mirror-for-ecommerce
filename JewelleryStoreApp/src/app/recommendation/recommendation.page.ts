import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { ProviderService } from '../provider.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.page.html',
  styleUrls: ['./recommendation.page.scss'],
})
export class RecommendationPage implements OnInit {

  virtualMirrorAPI: string = null;
  virtualMirrorAccess: any;
  recommendationEngineAPI: string;
  recommendationEngineAccess: any;
  objectStorageAccess: any;
  receivedAge: string = null;
  receivedName: string = null;
  receivedGender: string = null;
  url: string = null;
  data: Observable<any>;
  items: any = [];
  api;
  cart = [];

  sliderConfig = {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 1.6
  }

  constructor(private nav: NavController, private http: HttpClient, private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController, public toastController: ToastController,
    public loadingCtrl: LoadingController, private cartService: CartService,
    public providerService: ProviderService) {

    console.log('--> Recommendation page constructor() called');

    // Get the name, age & gender from home page

    this.receivedAge = this.activatedRoute.snapshot.paramMap.get('age');
    this.receivedName = this.activatedRoute.snapshot.paramMap.get('name');
    this.receivedGender = this.activatedRoute.snapshot.paramMap.get('gender');
  }

  //Toast setup

  async presentToastWithOptions(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 1000
    });
    toast.present();
  }

  // Make call to recommendation engine api and get recommendations

  async RecommendationEngine() {

    const loading = await this.loadingController.create({
      message: 'Getting Recommendations please wait...',
    });
    loading.present().then(() => {
      console.log('--> Calling Recommendation Engine API');
      this.providerService.getRecommendationEngineAccess().then(recommendationEngineAccess => {
        this.recommendationEngineAccess = recommendationEngineAccess;
        console.log('--> Received Object: ' + this.recommendationEngineAccess);
        this.recommendationEngineAPI = this.recommendationEngineAccess.RecommendationEngineApi;

        this.url = this.recommendationEngineAPI + '?age=' + this.receivedAge + '&name=' + this.receivedName + '&gender=' + this.receivedGender;
        this.url.toString();

        this.data = this.http.get(this.url);
        this.data.subscribe(data => {

          data.sort(GetSortOrder("count"));

          //Sort based on highest number of count of the product 

          function GetSortOrder(prop) {

            return function (a, b) {
              if (a[prop] < b[prop]) {
                return 1;
              } else if (a[prop] > b[prop]) {
                return -1;
              }
              return 0;
            }
          }
          this.items = data;
          this.cart = this.cartService.getCart();
          this.presentToastWithOptions("Tip: Click on top right icon to view cart.");
          loading.dismiss();
        });
      });
    });
  }

  ngOnInit() {
    this.loadCloudObjectStorageData();
    this.RecommendationEngine();
    this.loadVirtualMirror();
  }

  // Connect to Cloud Object Storage through Mobile Foundation

  async loadCloudObjectStorageData() {
    const loading = await this.loadingController.create({
      message: 'Authorizing Cloud Object Storage...',
    });
    loading.present().then(() => {
      console.log('--> Cloud Object Storage authorization method called');
      this.providerService.getObjectStorageAccess().then((objectStorageAccess) => {
        this.objectStorageAccess = objectStorageAccess;
        console.log('--> Received Object: ' + this.objectStorageAccess);
        console.log('--> Cloud Object Storage authorization successful');
        this.presentToastWithOptions("Cloud Object Storage authorization successful.");
        loading.dismiss();
      }).catch((err) => {
        this.presentToastWithOptions("MobileFirst Foundation Adapter Failed to authorize COS.");
      });
    });
  }

  async loadVirtualMirror() {
    const loading = await this.loadingController.create({
      message: 'Checking Virtual Mirror Configuration...',
    });
    loading.present().then(() => {
      console.log('--> Checking Virtual Mirror Configuration');
      this.providerService.getVirtualMirrorAccess().then((virtualMirrorAccess) => {
        this.virtualMirrorAccess = virtualMirrorAccess;
        console.log('--> Received Object: ' + this.virtualMirrorAccess);
        this.virtualMirrorAPI = this.virtualMirrorAccess.VirtualMirrorApi;
        console.log('--> Virtual Mirror configured: ' + this.virtualMirrorAPI);
        loading.dismiss();
        this.presentToastWithOptions("Virtual Mirror Configured.");
      }, (err) => {
        console.log("--> MobileFirst Foundation error: " + err);
        loading.dismiss();
        this.presentToastWithOptions("Virtual Mirror is not configured");
      });
    }).catch((err) => {
      this.presentToastWithOptions("MobileFirst Foundation Adapter Failed to make API call : " + err);
    });
  }


  addToCart(product) {
    this.cartService.addProduct(product);
  }

  // Redirect to try virtually page

  openCart() {
    this.presentToastWithOptions("Thank you for Checking out!");
    this.nav.navigateForward(`/checkout`);
  }

  // Redirect to try virtually page

  tryvirtually(imageUrl: string, type: string, height: string, width: string) {
    this.presentToastWithOptions("Hang ON!");
    this.api = this.virtualMirrorAPI.split("//", 2);
    this.nav.navigateForward(`/virtualmirror/${imageUrl.split('/')[0]}/${imageUrl.split('/')[1]}/${type}/${height}/${width}/${this.api[1]}`);
  }


}
