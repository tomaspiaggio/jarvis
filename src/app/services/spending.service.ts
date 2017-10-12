import {Injectable} from "@angular/core";
import {NativeStorage} from "@ionic-native/native-storage";
import {Spending} from "../model/spending.model";
import {Observable} from "rxjs";
import {EncryptedHttpService} from "./encrypted-http.service";
/**
 * Created by Tomas on 10/10/17.
 */

@Injectable()
export class SpendingService {

  constructor(private http: EncryptedHttpService,
              private storage: NativeStorage) {
  }

  /**
   * Gets the list of the day from nativeStorage and resolves it, then it checks for changes and if there is a change
   * it updates it on nativeStorage
   * @param date is a new Date() with no parameters
   * @returns {Observable<Spending[]>|"../../../Observable".Observable<Spending[]>|"../../Observable".Observable<Spending[]>}
   */
  public getAndCompareByDate(date: Date): Observable<Spending[]> {
    const dateKey = this.dateToKey(date);
    return new Observable<Spending[]>(observer => {
      let current: Spending[];
      this.storage.getItem(dateKey)
        .then((elements) => {
          const spendingArray = this.toSpendingArray(elements);
          observer.next(elements);
          current = elements;
        }).catch(err => console.log(err));
      this.http.get('https://spendings-cda7b.firebaseio.com/spendings/.json', {dateKey: dateKey}, {'Content-Type': 'application/json'})
        .then((response) => {
          const spendingArray = this.toSpendingArray(response);
          observer.next(spendingArray);
          this.updateStorage(dateKey, current, spendingArray);
        }).catch(err => console.log(err));
    });
  }

  /**
   * Adds an element both to nativeStorage and to backend (with the same key)
   * @param key new Date() with no parameters
   * @param spending the Spending object needed to be saved
   * @returns {Promise<T>} the resolution
   */
  public add(key: Date, spending: Spending): Promise<any> {
    return new Promise((resolve, reject) => {
      const dateKey = this.dateToKey(key);
      this.http.post('https://spendings-cda7b.firebaseio.com/spendings/' + dateKey + '/.json',
        JSON.stringify({amount: spending.amount, name: spending.name, additionalInfo: spending.additionalInfo}),
        {'Content-Type': 'application/json'})
        .then(response => {
          const id = response.data.name;
          this.storage.getItem(dateKey)
            .then(elements => {
              let spendingArray: Spending[] = this.toSpendingArray(elements);
              spending.id = id;
              spendingArray.push(spending);
              this.storage.setItem(dateKey, spendingArray)
                .then(result => resolve(result))
                .catch(err => reject(err))
            }).catch(err => reject(err));
        }).catch(err => reject(err));
    });
  }


  /**
   * Removes an element by id both from backend and nativeStorage
   * @param id the id of the spending wanted to be removed
   * @returns {Promise<T>} the resolution
   */
  public remove(spending: Spending, dateKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.getItem(dateKey)
        .then(elements => {
          let spendingArray = this.toSpendingArray(elements);
          for(let i = 0; i < spendingArray.length; i++)
            if(spendingArray[i].id === spending.id){
              spendingArray.splice(i, 1);
              break;
            }
          this.storage.setItem(dateKey, spendingArray)
            .catch(err => reject(err));
        }).catch(err => reject(err));
      this.http.delete('https://spendings-cda7b.firebaseio.com/spendings/' + dateKey + '/' + spending.id + '/.json',
        {},
        {'Content-Type': 'application/json'})
        .catch(err => reject(err));
    });
  }

  /**
   * Given a date, it returns a parsed dateKey
   * @param date the date of the spending
   * @returns {string} a dateKey
   */
  private dateToKey(date: Date): string {
    return date.getFullYear() + '-' + date.getMonth();
  }

  /**
   * Given a json, it returns a Spending[]
   * @param json
   */
  private toSpendingArray(json: any): Spending[] {
    const current = JSON.parse(json);
    return current.map(element => Spending.toSpending(element));
  }

  /**
   * The function updates the differences between the nativeStorage and the backend
   * @param key the dateKey wanted to be updated
   * @param current the nativeStorage Spending[]
   * @param response the backend storage Spending[]
   */
  private updateStorage(key: string, current: Spending[], response: Spending[]): void {
    this.storage.setItem(key, JSON.stringify(current.filter(element => response.indexOf(element) != -1)));
  }

}
