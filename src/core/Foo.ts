export default class Foo {
  run(message: string, uppercase: boolean): string {
    if (uppercase) {
      console.log(message.toUpperCase());
      return message.toUpperCase();
    } else {
      console.log(message);
      return message;
    }
  }
}