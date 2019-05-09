import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VirtualmirrorPage, SafePipe } from './virtualmirror.page';

const routes: Routes = [
  {
    path: '',
    component: VirtualmirrorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VirtualmirrorPage, SafePipe]
})
export class VirtualmirrorPageModule {}
