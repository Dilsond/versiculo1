export default class Config {
  static API_URL = 'https://26a1-41-63-175-141.ngrok-free.app/';
  static APP_NAME = 'MeuApp';
  static API_URL_WS = '26a1-41-63-175-141.ngrok-free.app';

  static getApiUrl() {
    return this.API_URL;
  }
  static getApiUrlWs() {
    return this.API_URL_WS;
  }
}