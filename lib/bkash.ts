const BKASH_BASE_URL = process.env.BKASH_BASE_URL;
const BKASH_API_KEY = process.env.BKASH_API_KEY!;
const BKASH_SECRET = process.env.BKASH_SECRET!;
const BKASH_USERNAME = process.env.BKASH_USERNAME!;
const BKASH_PASSWORD = process.env.BKASH_PASSWORD!;

let cachedToken: string | null = null;
let tokenIssuedAt: number = 0;


async function grantToken(): Promise<string> {
    const url = `${BKASH_BASE_URL}/tokenized/checkout/token/grant`;
    console.log("[bKash] Granting token from:", url);

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'username': BKASH_USERNAME,
            'password': BKASH_PASSWORD,
        },
        body: JSON.stringify({
            app_key: BKASH_API_KEY,
            app_secret: BKASH_SECRET,
        }),
    });

    const data = await res.json();
    console.log("[bKash] Token response status:", res.status, "body:", JSON.stringify(data, null, 2));

    if (data.id_token) {
        cachedToken = data.id_token;
        tokenIssuedAt = Date.now();
        console.log("[bKash] Token granted successfully");
        return data.id_token;
    }

    console.error("[bKash] Token grant FAILED:", JSON.stringify(data, null, 2));
    throw new Error(`bKash token failed: ${data.statusMessage || data.msg || JSON.stringify(data)}`);
}


async function getToken(): Promise<string> {
    const ageSeconds = (Date.now() - tokenIssuedAt) / 1000;
    if (cachedToken && ageSeconds < 3500) {
        return cachedToken;
    }
    return grantToken();
}

export async function createBkashPayment({
    amount,
    orderID,
    callbackURL,
}: {
    amount: number;
    orderID: string;
    callbackURL: string;
}): Promise<{ bkashURL: string; paymentID: string }> {
    const token = await getToken();
    const url = `${BKASH_BASE_URL}/tokenized/checkout/create`;

    const payload = {
        mode: '0011',
        payerReference: ' ',
        callbackURL,
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: orderID,
    };

    console.log("[bKash] Creating payment at:", url);
    console.log("[bKash] Payload:", JSON.stringify(payload, null, 2));

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'authorization': token,
            'x-app-key': BKASH_API_KEY,
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("[bKash] Create payment response:", JSON.stringify(data, null, 2));

    if (data.statusCode && data.statusCode !== '0000') {
        throw new Error(`bKash Error: ${data.statusMessage || data.statusCode}`);
    }

    if (!data.bkashURL) {
        throw new Error(
            `bKash: No redirect URL. statusCode=${data.statusCode}, statusMessage=${data.statusMessage}`
        );
    }

    return { bkashURL: data.bkashURL, paymentID: data.paymentID };
}

export async function executeBkashPaymentAPI(paymentID: string) {
    const token = await getToken();
    const url = `${BKASH_BASE_URL}/tokenized/checkout/execute`;

    console.log("[bKash] Executing payment:", paymentID);

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'authorization': token,
            'x-app-key': BKASH_API_KEY,
        },
        body: JSON.stringify({ paymentID }),
    });

    const data = await res.json();
    console.log("[bKash] Execute response:", JSON.stringify(data, null, 2));

    if (data.statusCode && data.statusCode !== '0000') {
        throw new Error(`bKash Execute Error: ${data.statusMessage || data.statusCode}`);
    }

    return data as {
        paymentID: string;
        trxID: string;
        transactionStatus: string;
        amount: string;
        currency: string;
        intent: string;
        merchantInvoiceNumber: string;
        statusCode: string;
        statusMessage: string;
    };
}


export async function queryBkashPayment(paymentID: string) {
    const token = await getToken();
    const url = `${BKASH_BASE_URL}/tokenized/checkout/payment/status`;

    console.log("[bKash] Querying payment status:", paymentID);

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'authorization': token,
            'x-app-key': BKASH_API_KEY,
        },
        body: JSON.stringify({ paymentID }),
    });

    const data = await res.json();
    console.log("[bKash] Query response:", JSON.stringify(data, null, 2));

    return data as {
        paymentID: string;
        trxID: string;
        transactionStatus: string;
        amount: string;
        currency: string;
        intent: string;
        merchantInvoiceNumber: string;
        statusCode: string;
        statusMessage: string;
    };
}
