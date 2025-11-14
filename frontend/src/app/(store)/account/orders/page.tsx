"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { format } from "date-fns"; // Thư viện định dạng ngày (cần cài: npm install date-fns)

// Định nghĩa kiểu Order (Đơn hàng)
type Order = {
  id: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
};

// Hàm fetch data
const fetchMyOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get("/orders");
  return data;
};

export default function MyOrdersPage() {
  // 1. Gọi API GET /api/orders
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
  });

  // 2. Hàm render Status (cho đẹp)
  const renderStatus = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'delivered':
        return <Badge className="bg-green-600">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 3. Trạng thái Loading */}
        {isLoading && (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {/* 4. Trạng thái Lỗi */}
        {isError && (
          <p className="text-destructive">Failed to load your orders.</p>
        )}

        {/* 5. Hiển thị Bảng Dữ Liệu */}
        {!isLoading && !isError && orders && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    You have no orders.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id.substring(0, 8)}... {/* Rút gọn ID */}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), "dd MMMM, yyyy")}
                    </TableCell>
                    <TableCell>
                      {renderStatus(order.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.totalPrice.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}