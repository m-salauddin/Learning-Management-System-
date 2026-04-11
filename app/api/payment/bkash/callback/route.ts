import { handleBkashCallback } from "@/lib/actions/bkash";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const paymentID = searchParams.get('paymentID');
    const status = searchParams.get('status');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (status === 'success' && paymentID) {
        const result = await handleBkashCallback(paymentID);
        // Both internal success and failure go to summary (internal failure will show the error)
        return Response.redirect(`${appUrl}/checkout/summary?paymentID=${paymentID}`);
    }

    if (status === 'cancel') {
        return Response.redirect(`${appUrl}/checkout/summary?status=cancel&message=Payment%20cancelled%20by%20user`);
    }

    if (status === 'failure') {
        const url = paymentID 
            ? `${appUrl}/checkout/summary?paymentID=${paymentID}&status=failure`
            : `${appUrl}/checkout/summary?status=failure&message=Payment%20failed`;
        return Response.redirect(url);
    }

    return Response.redirect(`${appUrl}/checkout/summary?status=failure&message=Invalid%20payment%20status`);
}
