
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function testCycle() {
    const email = `test-del-${Date.now()}@example.com`;
    console.log(`Creating user: ${email}`);

    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: 'password123',
        email_confirm: true
    });

    if (createError) {
        console.error("Create Error:", createError);
        return;
    }

    const userId = userData.user!.id;
    console.log(`Created user: ${userId}`);

    // Wait a bit?
    // console.log("Waiting 1s...");
    // await new Promise(r => setTimeout(r, 1000));

    console.log("Deleting user via RPC...");
    const { data: delData, error: delError } = await supabaseAdmin.rpc('delete_user_complete', {
        target_user_id: userId
    });

    if (delError) {
        console.error("RPC Delete Error:", JSON.stringify(delError, null, 2));
    } else {
        console.log("RPC Delete Success");
    }
}

testCycle();
