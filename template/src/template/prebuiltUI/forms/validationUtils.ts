/**
 * @description Simple email form validation that checks user input before submission.
 *
 * @param email email to be validated
 * @param emailRequiredMessage error message if a email was not provided
 * @param invalidMessage error message if email is invalid format
 * @returns undefined if no error or an error message string
 */
export const basicValidateEmailSubmission = (
  email: string,
  emailRequiredMessage?: string,
  invalidMessage?: string
): string | undefined => {
  let error;

  if (!email) {
    error = emailRequiredMessage ? emailRequiredMessage : "Email is required.";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    error = invalidMessage ? invalidMessage : "Invalid email address.";
  }

  return error;
};
