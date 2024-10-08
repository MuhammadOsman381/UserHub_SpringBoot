import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

class Helpers {
  static localhost: string = '192.168.18.8:8080';
  // static server: string = '13.60.28.134:8080';
  static basePath: string = `http://${this.localhost}`;
  static apiUrl: string = `${this.basePath}/`;
  static imageUrl: string = `${this.basePath}/`;
  static authUser: Record<string, any> = JSON.parse(localStorage.getItem('user') || '{}') ?? {};
  static serverImage(name: string): string {
    return `${this.basePath}/uploads/${name}`;
  }
  static authHeaders: { headers: { "Content-Type": string; } } = {
    headers: {
      "Content-Type": 'application/json',
    }
  };
  static authFileHeaders: { headers: { "Content-Type": string; } } = {
    headers: {
      "Content-Type": 'multipart/form-data',
    }
  };
  static toast(type: 'success' | 'error', message: string): void {
    const notyf = new Notyf();
    notyf.open({
      message: message,
      type: type,
      position: { x: 'right', y: 'top' },
      ripple: true,
      dismissible: true,
      duration: 2000,
    });
  }
}

export default Helpers;
