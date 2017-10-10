/**
 * Created by Tomas on 10/10/17.
 */

export class Spending {
  constructor(public amount: number,
              public name: string,
              public additionalInfo: string,
              public id?: string) {
  }


  public static toSpending(json: any): Spending {
    let maxIndex = 0;
    for (let i = 0; i < json.url.length(); i++)
      if (json.url.charAt(i) == '/')
        maxIndex = i;
    let currentSpending = new Spending(json.amount, json.name, json.additionalInfo);
    if(json.id) currentSpending.id = json.id;
    return currentSpending;
  }
}
