import paypal from "@paypal/checkout-server-sdk"

const environment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!

  if (process.env.PAYPAL_MODE === "production") {
    return new paypal.core.LiveEnvironment(clientId, clientSecret)
  }
  return new paypal.core.SandboxEnvironment(clientId, clientSecret)
}

export const paypalClient = () => {
  return new paypal.core.PayPalHttpClient(environment())
}
