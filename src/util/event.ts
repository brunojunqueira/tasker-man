interface Event {
  [key: string]: any;
}

export class EventHandler {
  private methods: ((event: Event) => void)[];
  event: Event;

  constructor(method?: (event: Event) => void, ...args: any[]) {
    this.methods = method ? [method] : [];
    this.event = { ...args };
  }

  add(method: (event: Event) => void) {
    this.methods.push(method);
  }

  async call<TargetType>(target: TargetType, ...args: any[]) {
    this.event = { target, ...args };
    this.methods.map((_method) => {
      _method(this.event);
    });
  }
}
