export function getStripeOAuthLink(redirectUri: string, state: string) {
	return "https://connect.stripe.com/oauth/authorize?redirect_uri=https://connect.stripe.com/hosted/oauth&client_id=ca_QzzJBB93VHgrUxtFFGVAD7YEWseedzrw&state=onbrd_R2XqY71fCFYYUcWhW0AltMl5Ld&response_type=code&scope=read_write&stripe_user[country]=AE";
}
