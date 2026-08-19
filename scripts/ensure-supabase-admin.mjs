/**
 * Creates/promotes the Aromza super-admin in a connected Supabase project.
 * Reads credentials from the environment; never prints secrets.
 */
import { createClient } from "@supabase/supabase-js";

const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim() || "admin@aromza.store";
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || "AromzaPortal#2026";
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const serviceRole =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceRole) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

const admin = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const roles = ["super_admin", "marketplace_admin", "seller_owner"];

const { data: created, error: createError } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { first_name: "Aromza", last_name: "Admin" },
});

let userId = created?.user?.id;

if (createError) {
  const message = createError.message.toLowerCase();
  if (!message.includes("already") && !message.includes("registered") && createError.status !== 422) {
    console.error("Failed to create admin user.");
    process.exit(1);
  }

  const { data: list, error: listError } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (listError) {
    console.error("Admin user exists but could not be looked up.");
    process.exit(1);
  }
  userId = list.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())?.id;
}

if (!userId) {
  console.error("Could not resolve admin user id.");
  process.exit(1);
}

const { error: profileError } = await admin.from("profiles").upsert(
  {
    id: userId,
    email,
    first_name: "Aromza",
    last_name: "Admin",
  },
  { onConflict: "id" },
);

if (profileError) {
  console.error("Failed to upsert admin profile.");
  process.exit(1);
}

for (const role of roles) {
  const { error: roleError } = await admin.from("user_roles").upsert(
    { user_id: userId, role },
    { onConflict: "user_id,role,seller_id", ignoreDuplicates: true },
  );
  if (roleError && !roleError.message.toLowerCase().includes("duplicate")) {
    const { error: insertError } = await admin.from("user_roles").insert({ user_id: userId, role });
    if (insertError && !insertError.message.toLowerCase().includes("duplicate")) {
      console.error(`Failed to grant ${role}.`);
      process.exit(1);
    }
  }
}

console.log(`Supabase admin ready: ${email}`);
