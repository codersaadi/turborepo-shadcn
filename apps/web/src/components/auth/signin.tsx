'use client'
import { MagicSignInForm, SignInForm } from '@authjs/client'
import { AuthFormComponent } from './AuthFormComponent'

export function SigninCredentials() {
    return AuthFormComponent(SignInForm)
}
export function SigninMagic() {
    return AuthFormComponent(MagicSignInForm)
}

