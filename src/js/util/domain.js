import map from 'lodash/map';

export default class {
  constructor() {
    this.domains = map(arguments, d => [ d[0], d[1] ]);
  }

  get(i) {
    return this.domains[i];
  }

  getDelta(i) {
    return this.domains[i][1] - this.domains[i][0];
  }
}