import { User } from './models/user';
import { switchMap } from 'rxjs/operators';
import { UserService } from './services/user.service';
import { FridgeService } from './services/fridge.service';
import { Product } from './models/product';
import { Item } from './models/item';
import { DatePipe } from '@angular/common';
import { ItemService } from './services/item.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FridgeManagerService {

  constructor(
    private itemService: ItemService,
    private fridgeService: FridgeService,
    private userService: UserService,
    private datePipe: DatePipe
  ) { }


  async addItem(product: Product) {
    let item = await this.getCurrentItem(product);
    if (item){
      item.qty++;
      await this.itemService.update(item.id, item).toPromise();
    } else{
      let newItem = this.createNewItem(product);
      await this.itemService.create(newItem).toPromise();
    }
  }

    private async getCurrentItem(product: Product) {
      let today = new Date();
      let todayStr = this.datePipe.transform(today, 'yyyy-MM-dd');
      let items = await this.itemService.getAll({filter: {field: 'barcode', value: product.barcode}}).toPromise();
      return items.filter(item => item.created === todayStr).pop();
    }

    private createNewItem(product: Product): Item {
      return {
        barcode: product.barcode,
        fridge: this.fridgeService.currentFridgeValue.id,
        qty: 1
      };
    }

    addOwner(fridgeId: string, ownerEmail: string) {
      return this.userService.getByEmail(ownerEmail)
        .pipe(
          switchMap(user => {
            return this.fridgeService.addOwner(fridgeId, user);
          })
        );
    }

    removeOwner(fridgeId: string, owner: User){
      return this.fridgeService.removeOwner(fridgeId, owner.uuid);
    }
}
