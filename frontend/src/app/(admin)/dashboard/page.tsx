import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { ShoppingCart, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header Trang */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        {/* (Phần chọn ngày tháng tạm thời bỏ qua) */}
      </div>
      
      {/* 4 Thẻ Stats (Dùng màu đỏ destructive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value="₹126,500" icon={ShoppingCart} change="+34.7%" />
        <StatCard title="Active Orders" value="₹126,500" icon={ShoppingCart} change="+34.7%" />
        <StatCard title="Completed Orders" value="₹126,500" icon={CheckCircle} change="+34.7%" />
        <StatCard title="Return Orders" value="₹126,500" icon={XCircle} change="+34.7%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột 1: Sale Graph & Best Sellers */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Sale Graph */}
          <Card>
            <CardHeader>
              <CardTitle>Sale Graph</CardTitle>
              <Tabs defaultValue="monthly" className="w-full">
                <TabsList>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {/* Placeholder cho biểu đồ */}
              <div className="h-[300px] w-full bg-muted flex items-center justify-center">
                <p>Sale Graph Placeholder (Recharts)</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Best Sellers */}
          <Card>
            <CardHeader>
              <CardTitle>Best Sellers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <BestSellerItem name="Lorem Ipsum" sales="989 sales" price="₹126.50" />
                <BestSellerItem name="Lorem Ipsum" sales="989 sales" price="₹126.50" />
                <BestSellerItem name="Lorem Ipsum" sales="989 sales" price="₹126.50" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Cột 2: Recent Orders */}
        <div className="lg:col-span-1">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}

// Component phụ
function StatCard({ title, value, icon: Icon, change }: {
  title: string, value: string, icon: React.ElementType, change: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change} Compared to last week</p>
      </CardContent>
    </Card>
  );
}

function BestSellerItem({ name, sales, price }: { name: string, sales: string, price: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-muted rounded-md"></div>
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{sales}</p>
      </div>
      <p className="font-medium">{price}</p>
    </div>
  );
}

function RecentOrders() {
  const orders = [
    { id: "#25426", name: "Kevin", date: "Nov 8th, 2023", status: "Delivered", amount: "₹200.00" },
    { id: "#25425", name: "Komael", date: "Nov 7th, 2023", status: "Cancelled", amount: "₹200.00" },
    { id: "#25424", name: "Nikhil", date: "Nov 6th, 2023", status: "Delivered", amount: "₹200.00" },
    // ...
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>
                  <Badge variant={order.status === "Delivered" ? "default" : "destructive"}>
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}