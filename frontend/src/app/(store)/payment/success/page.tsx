'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

import { Suspense } from 'react';

function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orderInfo, setOrderInfo] = useState<any>(null);

    useEffect(() => {
        // Clear cart from localStorage
        localStorage.removeItem('cart');

        // Get order info from URL params if available
        const orderId = searchParams.get('orderCode');
        const amount = searchParams.get('amount');

        if (orderId) {
            setOrderInfo({ orderId, amount });
        }
    }, [searchParams]);

    return (
        <Card className="max-w-2xl mx-auto p-8 text-center">
            <div className="flex justify-center mb-6">
                <CheckCircle2 className="w-20 h-20 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold mb-4">Thanh toán thành công!</h1>

            <p className="text-gray-600 mb-6">
                Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
            </p>

            {orderInfo && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-600">Mã đơn hàng: <span className="font-semibold">{orderInfo.orderId}</span></p>
                    {orderInfo.amount && (
                        <p className="text-sm text-gray-600">Số tiền: <span className="font-semibold">{Number(orderInfo.amount).toLocaleString('vi-VN')} đ</span></p>
                    )}
                </div>
            )}

            <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push('/account/orders')} variant="default">
                    Xem đơn hàng
                </Button>
                <Button onClick={() => router.push('/')} variant="outline">
                    Về trang chủ
                </Button>
            </div>
        </Card>
    );
}

export default function PaymentSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <Suspense fallback={<div>Đang tải...</div>}>
                <PaymentSuccessContent />
            </Suspense>
        </div>
    );
}
