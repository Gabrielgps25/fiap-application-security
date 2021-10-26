import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { Product } from './models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'frontend';

  product = {} as Product;
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }
  
  getProducts() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }
}

