import { db } from "@/lib/db"

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      orderItems: {
        include: {
          bookFormat: {
            include: {
              book: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const statusColors: any = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-200 text-green-900",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Orders Management</h1>

      <div className="bg-card rounded-xl shadow-lg">
        <div className="p-6">
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-6 bg-background rounded-lg border-2 border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-foreground/70">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="font-semibold">
                      {order.user.name || order.user.email}
                    </p>
                    <p className="text-sm text-foreground/70">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                    <p className="text-2xl font-bold text-primary mt-2">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-foreground/70">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold mb-2">Order Items:</p>
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.bookFormat.book.title} ({item.bookFormat.type})
                        </span>
                        <span className="font-semibold">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.shippingAddress && (
                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-sm font-semibold mb-2">
                      Shipping Address:
                    </p>
                    <p className="text-sm text-foreground/70">
                      {order.shippingName}
                      <br />
                      {order.shippingAddress}
                      <br />
                      {order.shippingCity}, {order.shippingState}{" "}
                      {order.shippingZip}
                      <br />
                      {order.shippingCountry}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
