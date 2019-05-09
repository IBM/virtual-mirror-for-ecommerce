import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  selectedItems = [];
  total = 0;
  items;
  count = 0;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.loadCart();
  }

  removeLast(){
    this.cartService.clearCart();
    this.total = 0;
    this.loadCart();
  }

  loadCart(){
    this.items = this.cartService.getCart();
    for (const iterator of this.items) {
      this.total = this.total + parseFloat(iterator.price);
    }
  }

}
