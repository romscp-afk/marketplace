"use client";

import { useActionState } from "react";
import { saveSellerProduct, type ActionResult } from "@/lib/seller/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { SellerProduct } from "@/types/seller";
import type { Category } from "@/types";

const initialState: ActionResult | null = null;

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "Submit for review" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "out_of_stock", label: "Out of stock" },
];

interface ProductFormProps {
  categories: Category[];
  product?: SellerProduct;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(saveSellerProduct, initialState);

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {product ? <input type="hidden" name="productId" value={product.id} /> : null}

      <Input
        label="Product title"
        name="title"
        defaultValue={product?.title}
        required
      />
      <Textarea
        label="Description"
        name="description"
        defaultValue={product?.description}
        required
        rows={5}
      />
      <Select
        label="Category"
        name="categoryId"
        options={categoryOptions}
        defaultValue={product?.categoryId}
        placeholder="Select category"
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product?.price}
          required
        />
        <Input
          label="Compare-at price"
          name="compareAtPrice"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product?.compareAtPrice}
          hint="Optional — shown as was/now pricing"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Cost price"
          name="costPrice"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product?.costPrice}
          hint="Not visible to customers"
        />
        <Input
          label="SKU"
          name="sku"
          defaultValue={product?.sku}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Stock quantity"
          name="stock"
          type="number"
          min="0"
          defaultValue={product?.stock ?? 0}
          required
        />
        <Select
        label="Status"
        name="status"
        options={statusOptions}
          defaultValue={product?.status ?? "active"}
          required
        />
      </div>
      <Input
        label="Product image URL"
        name="imageUrl"
        type="url"
        defaultValue={product?.imageUrl}
        placeholder="https://"
        hint="Paste a direct HTTPS image link. Active products appear on Aromza immediately."
      />

      <p className="text-muted text-xs">
        Set status to Active to publish this product to the storefront.
      </p>

      {state && !state.success ? (
        <p className="text-error text-sm" role="alert">{state.error}</p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" isLoading={isPending}>
          {product ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
