export function getErrorStringFromErrorCode(errorCode: string) {
  switch (errorCode) {
    case "Configuration": // There is a problem with the server configuration.
      return "A server error occurred. Unable to sign in.";
    case "AccessDenied": // Usually occurs, when you restricted access through the signIn callback, or redirect callback
      return "Access denied, try using a different account";
    case "Verification": // Related to the Email provider. The token has expired or has already been used
      return "Email verification token has expired or already been used. Please try signing in again.";
    case "OAuthSignin": //  Error in constructing an authorization URL
      return "A server error occurred. Unable to sign in.";
    case "OAuthCallback": //  Error in handling the response from an OAuth provider.
      return "A server error occurred. Unable to sign in.";
    case "OAuthCreateAccount": // Could not create OAuth provider user in the database.
      return "A server error occurred. Unable to sign in.";
    case "EmailCreateAccount": //  Could not create email provider user in the database.
      return "A server error occurred. Unable to sign in.";
    case "Callback": // Error in the OAuth callback handler route
      return "A server error occurred. Unable to sign in.";
    case "OAuthAccountNotLinked": // If the email on the account is already linked, but not with this OAuth account
      return "Looks like you already have an account with this email, try signing in via email instead.";
    case "EmailSignin": //  Sending the e-mail with the verification token failed
      return "Unable to send verification email. Please try another email.";
    case "CredentialsSignin": // The authorize callback returned null in the Credentials provider. We don't recommend providing information about which part of the credentials were wrong, as it might be abused by malicious hackers.
      return '"A server error occurred. Unable to sign in.';
    case "SessionRequired": // The content of this page requires you to be signed in at all times. See useSession for configuration.
      return "The page you tried to access requires you to be signed in.";
    case "Default":
      return "A server error occurred. Unable to sign in.";
    default:
      // Catch all, will apply, if none of the above matched
      return "";
  }
}
