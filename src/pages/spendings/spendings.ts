import { Component } from '@angular/core';
import {Spending} from "../../app/model/spending.model";
import {SpendingService} from "../../app/services/spending.service";

/**
 * Generated class for the SpendingsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'spendings',
  templateUrl: 'spendings.html',
  providers: [SpendingService]
})
export class SpendingsComponent {

  elements: Spending[];

  constructor(private spendingService: SpendingService) {
    this.spendingService.getAndCompareByDate(new Date()).subscribe(
      elements => this.elements = elements,
      err => console.log(err)
    );
  }

  addElement(amount: number, name: string, additionalInfo: string) {
    const spending: Spending = new Spending(amount, name, additionalInfo);
    this.elements.push(spending);
    this.spendingService.add(new Date(), spending)
      .catch(err => console.log(err));
  }

  deleteElement(spending: any, dateKey: string): void {
    const spendingObject = Spending.toSpending(spending);
    for(let i = 0; i < this.elements.length; i++)
      if(this.elements[i].id === spendingObject.id) {
        this.elements.splice(i, 1);
        break;
      }
    this.spendingService.remove(spendingObject, dateKey);
  }

}
