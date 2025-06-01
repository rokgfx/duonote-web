/**
 * Translates Firebase Auth error codes into user-friendly messages
 */
export function getAuthErrorMessage(error: any): string {
  // Extract error code from Firebase error
  const errorCode = error?.code || '';
  const errorMessage = error?.message || '';

  // Map Firebase error codes to user-friendly messages
  switch (errorCode) {
    // Login errors
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please check your credentials and try again.';
    
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support for assistance.';
    
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later or reset your password.';

    // Registration errors
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please use a different email or try logging in.';
    
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.';
    
    case 'auth/operation-not-allowed':
      return 'Account creation is currently disabled. Please contact support.';

    // General errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again later.';
    
    case 'auth/app-deleted':
      return 'Authentication service is unavailable. Please try again later.';
    
    case 'auth/invalid-api-key':
      return 'Authentication configuration error. Please contact support.';
    
    case 'auth/requires-recent-login':
      return 'Please log in again to complete this action.';
    
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
    
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for authentication.';

    // OAuth errors
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    
    case 'auth/credential-already-in-use':
      return 'This credential is already associated with a different account.';

    // Custom validation errors (for our app)
    case 'passwords-do-not-match':
      return 'Passwords do not match. Please make sure both passwords are identical.';

    // Fallback for unknown errors
    default:
      // If it's our custom error message, return as-is
      if (!errorCode && errorMessage && !errorMessage.includes('Firebase:')) {
        return errorMessage;
      }
      
      // For any other Firebase errors, provide a generic message
      console.error('Unhandled auth error:', error);
      return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
  }
}