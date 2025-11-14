"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label"; // <-- Thêm Label
import { Card } from "@/src/components/ui/card"; // <-- Thêm Card
import { Separator } from "@/src/components/ui/separator";
import Link from "next/link";
import { useAuthStore } from "@/src/store/auth.store";
import apiClient, { isAxiosError } from "@/src/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/src/components/ui/skeleton"; // <-- Thêm Skeleton

export default function AccountPage() {
  // 1. Lấy user từ Auth Store (để chào mừng)
  const authUser = useAuthStore((state) => state.user);

  // 2. State cho các form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(""); // (Tạm thời, model chưa có)

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 3. Fetch dữ liệu profile (GET /api/users/me)
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile", authUser?.id], // Cache theo user ID
    queryFn: async () => {
      const { data } = await apiClient.get("/users/me");
      return data;
    },
    // Chỉ chạy khi đã có authUser (đã đăng nhập)
    enabled: !!authUser, 
  });

  // 4. Đồng bộ state của form khi data về
  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(profile.name || "");
      setEmail(profile.email || "");
      // setAddress(profile.address || "");
    }
  }, [profile]);

  // 5. Mutation để cập nhật profile (PUT /api/users/me)
  const updateProfileMutation = useMutation({
    mutationFn: (updatedProfile: { name: string; address?: string }) => {
      return apiClient.put("/users/me", updatedProfile);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update profile.");
      }
    }
  });

  // 6. Mutation để đổi mật khẩu
  const changePasswordMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (passwords: any) => {
      return apiClient.put("/users/change-password", passwords);
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      // Xóa state mật khẩu
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to change password.");
      }
    }
  });


  // 7. Hàm xử lý sự kiện
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name });
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>My Account</span>
        </div>
        <div className="text-sm">
          Welcome! <span className="text-destructive">{authUser?.name || 'User'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Cột 1: Sidebar Navigation (Giữ nguyên) */}
        <div className="col-span-1 flex flex-col gap-4">
          <div>
            <h3 className="font-medium mb-2">Manage My Account</h3>
            <ul className="pl-4 text-muted-foreground flex flex-col gap-2">
              <li><Link href="/account" className="text-destructive hover:underline">My Profile</Link></li>
              <li><Link href="/account/address" className="hover:underline">Address Book</Link></li>
              <li><Link href="/account/payment" className="hover:underline">My Payment Options</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">My Orders</h3>
            <ul className="pl-4 text-muted-foreground flex flex-col gap-2">
              {/* Link đến trang Lịch sử đơn hàng (sẽ tạo ở bước sau) */}
              <li><Link href="/account/orders" className="hover:underline">My Orders</Link></li>
              <li><Link href="/account/returns" className="hover:underline">My Returns</Link></li>
              <li><Link href="/account/cancellations" className="hover:underline">My Cancellations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2"><Link href="/wishlist" className="hover:underline">My Wishlist</Link></h3>
          </div>
        </div>

        {/* Cột 2: Content (Edit Profile) */}
        <div className="col-span-3">
          <Card className="p-8 shadow-md">
            {/* 8. Hiển thị Skeleton khi đang tải */}
            {isLoadingProfile ? (
              <div className="flex flex-col gap-6">
                <Skeleton className="h-8 w-1/3" />
                <div className="grid grid-cols-2 gap-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ) : (
              // 9. Hiển thị Form khi đã tải xong
              <form onSubmit={handleProfileSave} className="flex flex-col gap-6">
                <h2 className="text-xl font-medium text-destructive mb-2">Edit Your Profile</h2>
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="bg-secondary/50 border-none" 
                    />
                  </div>
                   <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName">Last Name (Not implemented)</Label>
                    <Input id="lastName" defaultValue="Rimel" className="bg-secondary/50 border-none" />
                  </div>
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-6">
                   <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-secondary/50 border-none" 
                      disabled // Không cho sửa email
                    />
                  </div>
                   <div className="flex flex-col gap-2">
                    <Label htmlFor="address">Address (Not implemented)</Label>
                    <Input id="address" defaultValue="Kingston, 5236, United State" className="bg-secondary/50 border-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-6 items-center mt-4">
                  <Button type="button" variant="ghost">Cancel</Button>
                  <Button 
                    type="submit" 
                    variant="destructive"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}

            <Separator className="my-8" />

            {/* Form Đổi Mật Khẩu */}
            <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
              <Label>Password Changes</Label>
              <Input 
                placeholder="Current Password" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-secondary/50 border-none" 
              />
              <Input 
                placeholder="New Password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-secondary/50 border-none" 
              />
              <Input 
                placeholder="Confirm New Password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-secondary/50 border-none" 
              />
              <div className="flex justify-end gap-6 items-center mt-4">
                <Button type="button" variant="ghost">Cancel</Button>
                <Button 
                  type="submit" 
                  variant="destructive"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}