import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'multiSearchFilter'
})
export class MultiSearchFilter implements PipeTransform {
    transform(items: any[], parameter1: String, parameter2: String, parameter3: String, parameter4: String, parameter5: String): any {
      console.log(items);
      console.log(parameter1, parameter2, parameter3, parameter4, parameter5);

      if (parameter1) {
        parameter1.toLowerCase();
      }
      if (parameter2) {
        parameter1.toLowerCase();
      }
      if (parameter3) {
        parameter1.toLowerCase();
      }
      if (parameter4) {
        parameter1.toLowerCase();
      }
      if (parameter5) {
        parameter1.toLowerCase();
      }

      if (items.length > 0) {
        items.forEach( function (item)
        {
            item.title.toLowerCase();
        });
      }

        const filtered_items1 = parameter1 ? items.filter(item => item.title.indexOf(parameter1) !== -1 ) : [];
        const filtered_items2 = parameter2 ? items.filter(item => item.title.indexOf(parameter2) !== -1 ) : [];
        const filtered_items3 = parameter3 ? items.filter(item => item.title.indexOf(parameter3) !== -1 ) : [];
        const filtered_items4 = parameter4 ? items.filter(item => item.title.indexOf(parameter4) !== -1 ) : [];
        const filtered_items5 = parameter5 ? items.filter(item => item.title.indexOf(parameter5) !== -1 ) : [];
        return parameter1 || parameter2 || parameter3 || parameter4 || parameter5 ?
        filtered_items1.concat(filtered_items2, filtered_items3, filtered_items4, filtered_items5) : items;

    }
}