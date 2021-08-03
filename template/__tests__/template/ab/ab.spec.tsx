import { AbError } from "../../../src/template/ab/abError";

describe("AB Error", () => {
  it("message is correct", () => {
    const error = new AbError('message')
    expect(error.message).toEqual('AB error occurred: message')
  })
})