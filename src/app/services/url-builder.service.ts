import {Injectable} from "@angular/core";
/**
 * Created by Tomas on 10/12/17.
 */

@Injectable()
export class URLBuilderService {

  private DEFAULT_URL: string = 'https://spendings-cda7b.firebaseio.com/';
  private DEFAULT_SUFFIX: string = '/.json';
  private parameters: any[];

  constructor() {
    this.parameters = [];
  }

  public buildURL(path: string): string {
    let params: string = '?';
    this.parameters.map(param => params += param.key + '=' + param.value + '&');
    this.parameters = [];
    return this.DEFAULT_URL + path + this.DEFAULT_SUFFIX + params.substring(0, params.length - 1);
  }

  public setParameter(key: string, value: string): void {
    this.parameters.push({key: key, value: value});
  }

}
