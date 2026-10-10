import { useCallback, useEffect, useState } from "react";
import { fetchProducts, hasLiveBackend } from "../lib/api";
import type { LoadStatus, Product, ProductsResult } from "../types";

interface ProductsState {
  status: LoadStatus;
  products: readonly Product[];
  errorMessage: string | null;
}

export function useProducts(): ProductsResult {
  const [state, setState] = useState<ProductsState>({ status: "loading", products: [], errorMessage: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, status: "loading", errorMessage: null }));

    fetchProducts(controller.signal)
      .then((products) => setState({ status: "success", products, errorMessage: null }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        const message = error instanceof Error ? error.message : "Something went wrong while loading listings.";
        setState({ status: "error", products: [], errorMessage: message });
      });

    return () => controller.abort();
  }, [attempt]);

  const refetch = useCallback(() => setAttempt((value) => value + 1), []);

  return { ...state, isDemoData: !hasLiveBackend, refetch };
}
