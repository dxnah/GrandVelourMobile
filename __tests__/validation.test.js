import { validateEmail, validatePassword, validateRequired } from '../utils/validation';

describe('validateEmail', () => {
  it('returns error for empty email',   () => expect(validateEmail('')).toBeTruthy());
  it('returns error for invalid email', () => expect(validateEmail('notanemail')).toBeTruthy());
  it('returns null for valid email',    () => expect(validateEmail('test@example.com')).toBeNull());
});

describe('validatePassword', () => {
  it('returns error for short password', () => expect(validatePassword('123')).toBeTruthy());
  it('returns null for valid password',  () => expect(validatePassword('securepassword')).toBeNull());
});

describe('validateRequired', () => {
  it('returns error for empty value', () => expect(validateRequired('', 'Name')).toBeTruthy());
  it('returns null for filled value', () => expect(validateRequired('John', 'Name')).toBeNull());
});