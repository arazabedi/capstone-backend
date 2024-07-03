export {};

Array.prototype.delete = function (element) {
  let index = this.indexOf(element);
  if (index !== -1) {
    this.splice(index, 1);
  }
};
