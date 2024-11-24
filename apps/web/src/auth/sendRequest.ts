import type { EmailConfig } from "next-auth/providers";
interface Theme {
	brandColor?: string;
	buttonText?: string;
	logoUrl?: string; // Added field for the logo URL
}

interface SendVerificationParams {
	identifier: string;
	provider: EmailConfig;
	url: string;
	theme: Theme;
}

export async function sendVerificationRequest(params: SendVerificationParams) {
	const { identifier: to, provider, url, theme } = params;
	const { host } = new URL(url);

	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${provider.apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: provider.from,
			to,
			subject: `Sign in to ${host}`,
			html: generateHtml({ url, host, theme }),
			text: generateText({ url, host }),
		}),
	});

	if (!res.ok) {
		const errorBody = await res.json();
		throw new Error(`Resend error: ${JSON.stringify(errorBody)}`);
	}
}

function generateHtml(params: { url: string; host: string; theme: Theme }) {
	const { url, host, theme } = params;
	const escapedHost = host.replace(/\./g, "&#8203;.");
	const brandColor = theme.brandColor || "#346df1";
	const color = {
		background: "#f0f0f0",
		text: "#333333",
		mainBackground: "#ffffff",
		buttonBackground: brandColor,
		buttonBorder: brandColor,
		buttonText: theme.buttonText || "#ffffff",
	};

	const logoImgUrl = theme.logoUrl || ""; // Placeholder logo URL

	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Sign in to ${escapedHost}</title>
  <style>
    body {
      background-color: ${color.background};
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      color: ${color.text};
    }
    .email-container {
      background-color: ${color.mainBackground};
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 150px;
      height: auto;
    }
    .content {
      text-align: center;
    }
    .btn {
      display: inline-block;
      background-color: #222;
      color: #fff;
      padding: 15px 30px;
      font-size: 18px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 5px;
      border: 1px solid ${color.buttonBorder};
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #aaaaaa;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="logo">
      <img src="${logoImgUrl}" alt="Company Logo">
    </div>
    <div class="content">
      <h2>Sign in to <strong>${escapedHost}</strong></h2>
      <p>Click the button below to sign in:</p>
      <a href="${url}" class="btn" target="_blank">Sign in</a>
    </div>
    <p>If you did not request this email, you can safely ignore it.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} ${escapedHost}. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;
}

function generateText(params: { url: string; host: string }) {
	const { url, host } = params;
	return `Sign in to ${host}\n\n${url}\n\nIf you did not request this email, you can safely ignore it.`;
}
