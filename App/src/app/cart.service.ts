import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  RecommendedData = [];
  private cart = [];

  constructor() { }

  getProducts() {
    return this.RecommendedData;
  }
  getCart() {
    return this.cart;
  }
  addProduct(product){
    this.cart.push(product);
  }
  clearCart(){
    this.cart.pop();
  }
}
