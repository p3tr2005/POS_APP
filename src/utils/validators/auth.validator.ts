import { email, minLength, nonEmpty, object, pipe, string, trim } from 'valibot';

export const SignUpFormSchema = object({
  username: pipe(string(), nonEmpty('Name is required.'), trim()),
  email: pipe(
    string(),
    nonEmpty('Email is required.'),
    email('Email should contains valid email addres.'),
    trim()
  ),
  password: pipe(
    string(),
    nonEmpty('Password is required.'),
    minLength(6, 'Password at least contains 6 characters.'),
    trim()
  ),
});

export const SignInFormSchema = object({
  email: pipe(
    string(),
    nonEmpty('Email is required.'),
    email('Email should contains valid email addres.'),
    trim()
  ),
  password: pipe(
    string(),
    nonEmpty('Password is required.'),
    minLength(6, 'Password at least contains 6 characters.'),
    trim()
  ),
});
