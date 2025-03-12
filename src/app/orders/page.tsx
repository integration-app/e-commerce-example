"use client";

import { OrdersTable } from "./components/orders-table";
import { useOrders } from "@/hooks/use-orders";
import { useOrdersSync } from "@/hooks/use-orders-sync";
import { Button } from "@/components/ui/button";
import { RefreshCw, Power } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const { isSyncing, toggleSync } = useOrdersSync();
  const { orders, isLoading, isError, importOrders } = useOrders(isSyncing);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    try {
      setIsImporting(true);
      await importOrders();
    } catch (error) {
      console.error("Failed to import orders:", error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">Manage your orders</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isSyncing ? "default" : "outline"}
              onClick={toggleSync}
              className={cn(
                "transition-colors",
                isSyncing &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                !isSyncing && "hover:bg-muted"
              )}
            >
              <Power
                className={cn(
                  "mr-2 h-4 w-4",
                  isSyncing ? "text-primary-foreground" : "text-foreground"
                )}
              />
              Sync {isSyncing ? "On" : "Off"}
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              <RefreshCw
                className={cn("mr-2 h-4 w-4", isImporting && "animate-spin")}
              />
              {isImporting ? "Importing..." : "Import Orders"}
            </Button>
          </div>
        </div>
        <OrdersTable orders={orders} isLoading={isLoading} isError={isError} />
      </div>
    </div>
  );
}
