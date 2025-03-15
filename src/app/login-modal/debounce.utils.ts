import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class DebounceUtil {
  private static subjects: { [key: string]: Subject<any> } = {};

  static debounce(key: string, callback: (...args: any[]) => void, delay = 500) {
    if (!this.subjects[key]) {
      this.subjects[key] = new Subject();
      this.subjects[key].pipe(debounceTime(delay)).subscribe((args) => callback(...args));
    }
    return (...args: any[]) => this.subjects[key].next(args);
  }
}
