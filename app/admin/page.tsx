import { db } from "@/lib/db"
import { BookOpen, ShoppingCart, DollarSign, Users } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [totalBooks, totalOrders, totalRevenue, totalCustomers] =
    await Promise.all([
      db.book.count(),
      db.order.count(),
      db.order.aggregate({
        where: { status: "PAID" },
        _sum: { total: true },
      }),
      db.user.count({ where: { role: "CUSTOMER" } }),
    ])

  const recentOrders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  })

  const stats = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Revenue",
      value: `$${(totalRevenue._sum.total || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: Users,
      color: "from-amber-500 to-orange-500",
    },
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-card rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-foreground/70 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl shadow-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Recent Orders</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg"
              >
                <div>
                  <p className="font-semibold">{order.user.name || order.user.email}</p>
                  <p className="text-sm text-foreground/70">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-foreground/70">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
