import { basicValidateEmailSubmission } from "./../src/validation-utils";

describe("basicValidateEmailSubmission", () => {
  it("returns default email required message for missing email", () => {
    expect(basicValidateEmailSubmission("")).toEqual("Email is required.");
  });

  it("returns provided email required message for missing email", () => {
    const message = "email required";
    expect(basicValidateEmailSubmission("", message)).toEqual(message);
  });

  it("returns invalid message for invalid emails", () => {
    const invalidEmails: string[] = [
      "a",
      "a@a",
      "a@a.c",
      "a.a",
      "@#$#@gmail.com",
      "ahhh@*&^*&.com",
      "ahhhh@ahhhh.(*&(*",
    ];

    invalidEmails.forEach((invalidEmail) => {
      expect(basicValidateEmailSubmission(invalidEmail)).toEqual(
        "Invalid email address."
      );
    });
  });

  it("returns provided invalid message for invalid email", () => {
    const invalidMessage = "invalid";
    expect(basicValidateEmailSubmission("a", "", invalidMessage)).toEqual(
      invalidMessage
    );
  });

  it("returns undefined when email is valid", () => {
    expect(basicValidateEmailSubmission("ahhh@ahhhhh.com")).toBeUndefined();
  });
});
