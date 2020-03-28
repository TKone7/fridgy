import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], callback: (item: any, filter: string) => boolean, filter?: string): any {
    if (!items || !callback) {
      return items;
    }
    let result = items.filter((item) => callback(item, filter));
    if (result.length === 0) return [];
    return result;
  }

}
