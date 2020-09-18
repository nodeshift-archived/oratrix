class Foo {
  run(message: string, uppercase: boolean): string {
    if (uppercase) {
      console.log(message.toUpperCase());
      return message.toUpperCase();
    }
    console.log(message);
    return message;
  }
}

export default Foo;
