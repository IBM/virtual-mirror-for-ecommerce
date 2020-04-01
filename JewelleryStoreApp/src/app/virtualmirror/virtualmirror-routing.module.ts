import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VirtualmirrorPage } from './virtualmirror.page';

const routes: Routes = [
  {
    path: '',
    component: VirtualmirrorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VirtualmirrorPageRoutingModule {}
