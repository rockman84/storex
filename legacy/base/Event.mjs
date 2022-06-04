export default class Event
{
  constructor(name, target, params = null) {
    this.name = name;
    this.target = target;
    this.params = params;
  }
}
