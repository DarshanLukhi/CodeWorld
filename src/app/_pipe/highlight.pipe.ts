import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(list: any, searchText: any): any {
    if (!list) { return []; }
    if (!searchText) { return list; }
    const re = new RegExp(searchText, 'i');
    return  list.replace(re, (match) => `<span class='yellow'>${match}</span>`);
  }
}
