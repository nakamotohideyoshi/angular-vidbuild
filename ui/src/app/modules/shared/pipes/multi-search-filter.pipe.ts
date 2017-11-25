import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'multiSearchFilter'
})
export class MultiSearchFilter implements PipeTransform {
    transform(items: any[], parameter1: String, parameter2: String, parameter3: String, parameter4: String, parameter5: String): any {

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

      if (items && items.length > 0) {
        items.forEach( function (item)
        {
            item.title.toLowerCase();
        });
      }
      if(items){
        const filtered_items1 = parameter1 ? items.filter(item => item.title.indexOf(parameter1) !== -1 ) : Array.from(new Set(items.map(itemInArray => itemInArray)));
        const filtered_items2 = parameter2 ? filtered_items1.filter(item => item.title.indexOf(parameter2) !== -1 ) : filtered_items1;
        const filtered_items3 = parameter3 ? filtered_items2.filter(item => item.title.indexOf(parameter3) !== -1 ) : filtered_items2;
        const filtered_items4 = parameter4 ? filtered_items3.filter(item => item.title.indexOf(parameter4) !== -1 ) : filtered_items3;
        const filtered_items5 = parameter5 ? filtered_items4.filter(item => item.title.indexOf(parameter5) !== -1 ) : filtered_items4;
        return filtered_items5;
      }

    }
}
