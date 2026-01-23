'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { XCircle } from 'lucide-react';

import { Suspense } from 'react';

function PaymentFailedContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get('message') || 'Đã có lỗi xảy ra trong quá trình thanh toán.';

    return (
        <Card className="max-w-2xl mx-auto p-8 text-center">
            <div className="flex justify-center mb-6">
                <XCircle className="w-20 h-20 text-red-500" />
            </div>

            <h1 className="text-3xl font-bold mb-4">Thanh toán thất bại</h1>

            <p className="text-gray-600 mb-6">
                {errorMessage}
            </p>

            <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push('/checkout')} variant="default">
                    Thử lại
                </Button>
                <Button onClick={() => router.push('/cart')} variant="outline">
                    Về giỏ hàng
                </Button>
            </div>
        </Card>
    );
}

export default function PaymentFailedPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <Suspense fallback={<div>Đang tải...</div>}>
                <PaymentFailedContent />
            </Suspense>
        </div>
    );
}
