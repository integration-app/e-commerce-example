import useSWR from "swr";
import { OrdersResponse } from "@/types/order";
import { authenticatedFetcher, getAuthHeaders } from "@/lib/fetch-utils";

export function useOrders(isSync = false) {
  const { data, error, isLoading, mutate } = useSWR<OrdersResponse>(
    "/api/orders",
    (url) => authenticatedFetcher<OrdersResponse>(url),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      // Poll every 5 seconds when sync is ON
      refreshInterval: isSync ? 10000 : 0,
      // Don't poll when tab is hidden
      refreshWhenHidden: false,
      // Deduplicate requests within 2 seconds
      dedupingInterval: 2000,
    }
  );

  const importOrders = async () => {
    try {
      const response = await fetch("/api/orders/import", {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to import orders");
      }

      // Refresh the orders list
      await mutate();

      return true;
    } catch (error) {
      console.error("Error importing orders:", error);
      throw error;
    }
  };

  return {
    orders: data?.records ?? [],
    isLoading,
    isError: error,
    mutate,
    importOrders,
  };
}
