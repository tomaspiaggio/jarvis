import {Injectable} from "@angular/core";
import {HTTP, HTTPResponse} from "@ionic-native/http";
import {NativeStorage} from "@ionic-native/native-storage";
declare var JSEncrypt: any;
/**
 * Created by Tomas on 10/11/17.
 */

@Injectable()
export class EncryptedHttpService {

  private server;
  private mine;

  constructor(private http: HTTP,
              private nativeStorage: NativeStorage) {
    /**
     * Tries to get user's private key and if it does not find one, it creates a keypair
     */
    this.nativeStorage.getItem('my-key')
      .then(pk => {
        const keys = JSON.parse(pk);
        this.mine.setPrivateKey(keys.privateKey);
        this.mine.setPublicKey(keys.publicKey);
      }).catch(() => {
        this.mine = new JSEncrypt();
        this.nativeStorage.setItem('my-key', {privateKey: this.mine.getPrivateKey(), publicKey: this.mine.getPublicKey()})
          .catch(err => console.log(err));
    });

    /**
     * Gets server keys (should be here from login response)
     */
    this.nativeStorage.getItem('server-key')
      .then(keys => {
        const parsed = JSON.parse(keys);
        this.server.setPublicKey(parsed.publicKey);
        this.server.setPrivateKey(parsed.privateKey);
      }).catch(() => {
      throw new Error('No server keys found')
    });
  }

  /**
   * GET decrypts and resolves the http response
   * @param url the path of the request
   * @param parameters parameters of the request
   * @param headers headers of the request
   * @returns {Promise<EncryptedHttpresponse>}
   */
  public get(url: string, parameters: any, headers: any): Promise<EncryptedHttpresponse> {
    return new Promise<EncryptedHttpresponse>((resolve, reject) => {
      this.http.get(url, parameters, headers)
        .then((encrypted: HTTPResponse) => resolve(new EncryptedHttpresponse(encrypted.status, encrypted.headers, this.server.decrypt(encrypted.data))))
        .catch((err: HTTPResponse) => reject(err.error));
    });
  }

  /**
   * POST encrypted JSON file
   * @param url
   * @param body
   * @param headers
   * @returns {Promise<EncryptedHttpresponse>}
   */
  public post(url: string, body: any, headers: any): Promise<EncryptedHttpresponse> {
    return new Promise<EncryptedHttpresponse>((resolve, reject) => {
      this.http.post(url, JSON.stringify({data: this.mine.encrypt(body)}), headers)
        .then((encrypted: HTTPResponse) => resolve(new EncryptedHttpresponse(encrypted.status, encrypted.headers, this.server.decrypt(encrypted.data))))
        .catch((err: HTTPResponse) => reject(err.error));
    });
  }

  /**
   * PUT encrypted JSON file
   * @param url
   * @param body
   * @param headers
   * @returns {Promise<EncryptedHttpresponse>}
   */
  public put(url: string, body: any, headers: any): Promise<EncryptedHttpresponse> {
    return new Promise<EncryptedHttpresponse>((resolve, reject) => {
      this.http.put(url, JSON.stringify({data: this.mine.encrypt(body)}), headers)
        .then((encrypted: HTTPResponse) => resolve(new EncryptedHttpresponse(encrypted.status, encrypted.headers, this.server.decrypt(encrypted.data))))
        .catch((err: HTTPResponse) => reject(err.error));
    });
  }

  /**
   * DELETE http method
   * @param url
   * @param parameters
   * @param headers
   * @returns {Promise<EncryptedHttpresponse>}
   */
  public delete(url: string, parameters: any, headers: any): Promise<EncryptedHttpresponse> {
    return new Promise<EncryptedHttpresponse>((resolve, reject) => {
      this.http.delete(url, parameters, headers)
        .then((encrypted: HTTPResponse) => resolve(new EncryptedHttpresponse(encrypted.status, encrypted.headers, this.server.decrypt(encrypted.data))))
        .catch((err: HTTPResponse) => reject(err.error));
    });
  }

}

export class EncryptedHttpresponse implements HTTPResponse{
  constructor(public status: number,
              public headers: any,
              public data?: any,
              public error?: any) {}
}
