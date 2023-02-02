interface Event<T = any> {
  target: T;
}

export class EventHandler<T> {
  private methods: ((event: Event<T>) => void)[];
  event: Event<T>;

  constructor(method: (event: Event<T>) => void, target: T) {
    this.methods = [method];
    this.event = { target };
  }

  add(method: (event: Event<T>) => void) {
    this.methods.push(method);
  }

  async call() {
    this.methods.map((_method) => {
      _method(this.event);
    });
  }
}
