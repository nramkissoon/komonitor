import { overrideStyles } from "../src/utils";

describe("overrideStyles", () => {
  it("leaves non-overridden values untouched", () => {
    const ob1 = { a: 1 };
    const ob2 = { b: 1 };
    const ob3 = overrideStyles(ob1, ob2);
    expect(ob3.a).toEqual(1);
    expect(ob3.b).toEqual(1);
  });
  it("overrides values correctly", () => {
    const ob1 = { a: 1 };
    const ob2 = { a: 2 };
    const ob3 = overrideStyles(ob1, ob2);
    expect(ob3.a).toEqual(2);
  });
});
