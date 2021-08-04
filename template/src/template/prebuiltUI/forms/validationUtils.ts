/**
 * @description Simple email form validation that checks user input before submission.
 *
 * @param email
 * @returns undefined if no error or an error message string
 */
export const basicValidateEmailSubmission = (
  email: string
): string | undefined => {
  let error;

  if (!email) {
    error = "Email is required.";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    error = "Invalid email address";
  }

  return error;
};
