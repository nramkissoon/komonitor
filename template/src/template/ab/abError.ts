export class AbError extends Error {
  constructor(message: string) {
    super();
    this.name = "AB Error";
    this.message = `AB error occurred: ${message}`;
  }
}
