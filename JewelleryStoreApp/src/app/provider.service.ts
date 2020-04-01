/// <reference path="../../plugins/cordova-plugin-mfp/typings/worklight.d.ts" /> 

import { Injectable } from '@angular/core';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  data: any = null;
  objectStorageAccess: any = null;
  recommendationEngineAccess: any = null;
  VirtualMirrorAccess: any = null;

  constructor() {
    console.log('--> Mobile Foundation: constructor() called');
  }

  getObjectStorageAccess() {
    console.log('--> Mobile Foundation: getting Object Storage AuthToken from adapter ...');
    return new Promise((resolve, reject) => {
      if (this.objectStorageAccess) {
        // already loaded data
        return resolve(this.objectStorageAccess);
      }
      const dataRequest = new WLResourceRequest("/adapters/ImagesFetch/resource/objectStorage", WLResourceRequest.GET);
      dataRequest.send().then(
        (response) => {
          console.log('--> Mobile Foundation: got Object Storage AuthToken from adapter ', response);
          this.objectStorageAccess = response.responseJSON;
          resolve(this.objectStorageAccess);
        }, (failure) => {
          console.log('--> Mobile Foundation: failed to get Object Storage AuthToken from adapter\n', JSON.stringify(failure));
          reject(failure);
        }),
        (error) => {
          console.log('--> Mobile Foundation error\n', JSON.stringify(error));
          reject(error);
        }
    });
  }

  getRecommendationEngineAccess() {
    console.log('--> Mobile Foundation: getting Recommendation Engine API from adapter ...');
    return new Promise((resolve, reject) => {
      if (this.recommendationEngineAccess) {
        // already loaded data
        return resolve(this.recommendationEngineAccess);
      }
      const dataRequest = new WLResourceRequest("/adapters/ImagesFetch/resource/recommendationEngine", WLResourceRequest.GET);
      dataRequest.send().then(
        (response) => {
          console.log('--> Mobile Foundation: got Recommendation Engine API from adapter ', response);
          this.recommendationEngineAccess = response.responseJSON;
          resolve(this.recommendationEngineAccess);
        }, (failure) => {
          console.log('--> Mobile Foundation: failed to get Recommendation Engine API from adapter\n', JSON.stringify(failure));
          reject(failure);
        }),
        (error) => {
          console.log('--> Mobile Foundation error\n', JSON.stringify(error));
          reject(error);
        };
    });
  }

  getVirtualMirrorAccess() {
    console.log('--> Mobile Foundation: getting Virtual Mirror API from adapter ...');
    return new Promise((resolve, reject) => {
      if (this.VirtualMirrorAccess) {
        // already loaded data
        return resolve(this.VirtualMirrorAccess);
      }
      const dataRequest = new WLResourceRequest("/adapters/ImagesFetch/resource/virtualMirror", WLResourceRequest.GET);
      dataRequest.send().then(
        (response) => {
          console.log('--> Mobile Foundation: got Virtual Mirror API from adapter ', response);
          this.VirtualMirrorAccess = response.responseJSON;
          resolve(this.VirtualMirrorAccess);
        }, (failure) => {
          console.log('--> Mobile Foundation: failed to get Virtual Mirror API from adapter\n', JSON.stringify(failure));
          reject(failure);
        }),
        (error) => {
          console.log('--> Mobile Foundation error\n', JSON.stringify(error));
          reject(error);
        };
    });
  }
}
