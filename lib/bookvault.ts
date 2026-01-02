const BOOKVAULT_API_URL = process.env.BOOKVAULT_API_URL
const BOOKVAULT_API_KEY = process.env.BOOKVAULT_API_KEY

export async function createBookVaultOrder(orderData: any) {
  const response = await fetch(`${BOOKVAULT_API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BOOKVAULT_API_KEY}`,
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    throw new Error("Failed to create Book Vault order")
  }

  return response.json()
}

export async function getBookVaultOrderStatus(orderId: string) {
  const response = await fetch(`${BOOKVAULT_API_URL}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${BOOKVAULT_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to get Book Vault order status")
  }

  return response.json()
}
