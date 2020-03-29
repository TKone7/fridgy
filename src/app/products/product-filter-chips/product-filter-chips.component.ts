import { Router } from '@angular/router';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'product-filter-chips',
  templateUrl: './product-filter-chips.component.html',
  styleUrls: ['./product-filter-chips.component.css']
})
export class ProductFilterChipsComponent implements OnInit {
  categories$;
  @Input('category') category: string;

  constructor(
    categoryService: CategoryService,
    private router: Router
  ) {
    this.categories$ = categoryService.getAll({ order: { column: 'slug', dir: 'desc' } });
  }

  change(categorySlug?: string) {
    console.log('log ', categorySlug);
    if (categorySlug)
      this.router.navigate(['products'], {queryParams: {category: categorySlug}});
    else
      this.router.navigate(['products']);

  }

  ngOnInit() {
  }

}
