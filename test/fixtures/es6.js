import {EventEmitter} from 'events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

export default myEmitter;

export class Sample {
  constructor() {

  }

  isFunctionComplex() {
    if (true) {
      if (true) {
        if (true) {
          return false;
        }
      }
    }
  }
}

function isFunctionComplex() {
  if (true) {
    if (true) {
      if (true) {
        return false;
      }
    }
  }
}
