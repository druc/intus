export class File {
  constructor(name, type, size) {
    this.name = name;
    this.type = type;
    this.size = size * 1024 ** 2;
  }
}

export default function makeFile(name, type, size = 1) {
  return new File(name, type, size);
}
