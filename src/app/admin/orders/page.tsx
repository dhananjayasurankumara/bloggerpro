import prisma from "@/lib/prisma";
import { 
  CreditCard, 
  ShoppingBag, 
  User, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Search,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { title: true } }
    }
  });

  return (
    <div className="p-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Commerce Console</h1>
          <p className="text-gray-500">Track and manage every digital transaction on BLOGGERPRO.</p>
        </div>
        <div className="flex gap-4">
             <div className="px-6 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-xl flex items-center gap-3 shadow-sm">
                <CreditCard className="w-5 h-5 text-primary" />
                <span className="font-bold">{orders.length} Total Orders</span>
             </div>
        </div>
      </header>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
            { label: "Successful Payments", value: orders.filter(o => o.status === 'PAID').length, icon: CheckCircle2, color: "text-emerald-500" },
            { label: "Pending Processing", value: orders.filter(o => o.status === 'PENDING').length, icon: Clock, color: "text-amber-500" },
            { label: "Estimated Revenue", value: `$${orders.filter(o => o.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}`, icon: ArrowUpRight, color: "text-primary" },
        ].map((stat) => (
            <div key={stat.label} className="p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-gray-900 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                   <h4 className="text-xl font-bold">{stat.value}</h4>
                </div>
            </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-zinc-950/50 flex justify-between items-center">
            <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search by Order ID, customer, or product..." 
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary font-medium text-sm transition-all"
                />
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold hover:border-primary transition-all">
                Export CSV
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-zinc-950 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <tr>
                <th className="px-8 py-6">Order ID</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Product</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors group text-sm">
                  <td className="px-8 py-6">
                    <span className="font-mono text-[10px] bg-gray-100 dark:bg-zinc-900 px-2 py-1 rounded-md text-gray-500 font-bold">
                        #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 font-bold">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                        {order.user.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span>{order.user.name}</span>
                        <span className="text-[10px] font-medium text-gray-400">{order.user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                        <span className="font-medium">{order.product.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-900 dark:text-white">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="px-8 py-6">
                    {order.status === 'PAID' ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    ) : order.status === 'CANCELLED' ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit">
                        <XCircle className="w-3 h-3" /> Cancelled
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-all text-primary">
                        <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <CreditCard className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-bold font-display text-xl">No Orders Detected</p>
                    <p className="text-gray-400 text-sm mt-1">Transactions will appear here once users checkout from the shop.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
