"use client";

import { useActionState } from "react";
import { saveCategory, type AdminActionResult } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminCategory } from "@/types/admin";

const initialState: AdminActionResult | null = null;

export function CategoryForm({ category }: { category?: AdminCategory }) {
  const [state, formAction, isPending] = useActionState(saveCategory, initialState);

  return (
    <form action={formAction} className="bg-surface space-y-4 rounded-xl border border-border p-4">
      {category ? <input type="hidden" name="categoryId" value={category.id} /> : null}
      <Input
        label="Category name"
        id={`name-${category?.id ?? "new"}`}
        name="name"
        defaultValue={category?.name}
        required
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`active-${category?.id ?? "new"}`}
          name="isActive"
          value="true"
          defaultChecked={category?.isActive ?? true}
          className="rounded border-border"
        />
        <label htmlFor={`active-${category?.id ?? "new"}`} className="text-sm">
          Active on storefront
        </label>
      </div>
      {state && !state.success ? (
        <p className="text-error text-sm" role="alert">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="text-success text-sm" role="status">Category saved.</p>
      ) : null}
      <Button type="submit" size="sm" isLoading={isPending}>
        {category ? "Update category" : "Add category"}
      </Button>
    </form>
  );
}
