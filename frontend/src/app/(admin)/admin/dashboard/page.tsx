"use client";

import {
  Card,
  CardContent,
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
import { Badge } from "@/src/components/ui/badge";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { toast } from "sonner";
import { format } from "date-fns";
// 1. Import useEffect
import { useEffect } from "react"; 

// --- ĐỊNH NGHĨA TYPE (GIỮ NGUYÊN) ---
type Stats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
};

type RecentOrder = {
  _id: string;
  userId: { name: string };
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
};

// --- CÁC HÀM FETCH (GIỮ NGUYÊN) ---
const fetchStats = async (): Promise<Stats> => {
  const { data } = await apiClient.get("/dashboard/stats");
  return data;
};
const fetchRecentOrders = async (): Promise<RecentOrder[]> => {
  const { data } = await apiClient.get("/dashboard/recent-orders");
  return data;
};


export default function DashboardPage() {
  
  // 2. SỬA LỖI TYPESCRIPT VÀ REACT QUERY V5
  const { data: stats, isLoading: isLoadingStats, isError: isErrorStats } = useQuery<Stats>({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
    // XÓA 'onError' ở đây
  });

  // 3. SỬA LỖI TYPESCRIPT VÀ REACT QUERY V5
  const { data: recentOrders, isLoading: isLoadingOrders, isError: isErrorOrders } = useQuery<RecentOrder[]>({
    queryKey: ["dashboard-recent-orders"],
    queryFn: fetchRecentOrders,
    // XÓA 'onError' ở đây
  });

  // 4. THÊM useEffect ĐỂ XỬ LÝ LỖI (Cách làm của v5)
  useEffect(() => {
    if (isErrorStats) {
      toast.error("Failed to load dashboard stats.");
    }
    if (isErrorOrders) {
      toast.error("Failed to load recent orders.");
    }
  }, [isErrorStats, isErrorOrders]);


  return (
    <div className="flex flex-col gap-8">
      {/* Header Trang (Giữ nguyên) */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>
      
      {/* 4 Thẻ Stats (Hiển thị Skeleton khi tải) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingStats ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            {/* 5. SỬA LỖI 'Property does not exist' (Giờ đã fix) */}
            <StatCard title="Total Revenue" value={`$${stats?.totalRevenue.toLocaleString() || 0}`} icon={DollarSign} change="+20.1%" />
            <StatCard title="Total Orders" value={`$${stats?.totalOrders.toLocaleString() || 0}`} icon={ShoppingCart} change="+18.2%" />
            <StatCard title="Total Products" value={`$${stats?.totalProducts.toLocaleString() || 0}`} icon={Package} change="+12.5%" />
            <StatCard title="Total Customers" value={`$${stats?.totalUsers.toLocaleString() || 0}`} icon={Users} change="+5.1%" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột 1: Sale Graph (Giữ nguyên) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* ... (Code Sale Graph giữ nguyên) ... */}
        </div>
        
        {/* Cột 2: Recent Orders (Dùng dữ liệu thật) */}
        <div className="lg:col-span-1">
          {/* 6. SỬA LỖI 'Type is not assignable' (Giờ đã fix) */}
          <RecentOrders data={recentOrders} isLoading={isLoadingOrders} />
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT PHỤ (GIỮ NGUYÊN) ---

// Skeleton (Giữ nguyên)
function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-5" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </CardContent>
    </Card>
  );
}

// StatCard (Giữ nguyên)
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
        <p className="text-xs text-muted-foreground">{change} from last month</p>
      </CardContent>
    </Card>
  );
}

// RecentOrders (Cập nhật kiểu 'data')
function RecentOrders({ data, isLoading }: { data: RecentOrder[] | undefined, isLoading: boolean }) {
  const renderStatus = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-600">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      {order.userId?.name || 'Guest'}
                    </TableCell>
                    <TableCell>
                      {renderStatus(order.status)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), "dd/MM/yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">No recent orders.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}