"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import apiClient, { isAxiosError } from "@/src/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function AccountPage() {
  // State (giữ nguyên)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch dữ liệu (giữ nguyên)
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data } = await apiClient.get("/users/me");
      return data;
    },
  });

  // Đồng bộ state (giữ nguyên)
  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(profile.name || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail(profile.email || "");
    }
  }, [profile]);

  // Mutations (giữ nguyên)
  const updateProfileMutation = useMutation({
    mutationFn: (updatedProfile: { name: string }) => {
      return apiClient.put("/users/me", updatedProfile);
    },
    onSuccess: () => toast.success("Profile updated successfully!"),
    onError: () => { /* ... (xử lý lỗi) */ }
  });
  const changePasswordMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (passwords: any) => {
      return apiClient.put("/users/change-password", passwords);
    },
    onSuccess: () => { /* ... (xử lý thành công) */ },
    onError: () => { /* ... (xử lý lỗi) */ }
  });
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

  // JSX (ĐÃ XÓA BỎ LAYOUT)
  return (
    <Card className="p-8 shadow-md">
      {/* Skeleton UI (giữ nguyên) */}
      {isLoadingProfile ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : (
        // Form Profile (giữ nguyên)
        <form onSubmit={handleProfileSave} className="flex flex-col gap-6">
          <h2 className="text-xl font-medium text-destructive mb-2">Edit Your Profile</h2>
          {/* ... (Input Tên, Email, Address) ... */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary/50 border-none" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/50 border-none" disabled />
            </div>
          </div>
          <div className="flex justify-end gap-6 items-center mt-4">
            <Button type="button" variant="ghost">Cancel</Button>
            <Button type="submit" variant="destructive" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      )}

      <Separator className="my-8" />

      {/* Form Đổi Mật Khẩu (giữ nguyên) */}
      <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
        {/* ... (Input Mật khẩu) ... */}
      </form>
    </Card>
  );
}