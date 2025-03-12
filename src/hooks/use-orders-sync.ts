import { useState } from "react";
import { useIntegrationApp } from "@integration-app/react";

export function useOrdersSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const integrationApp = useIntegrationApp();

  const toggleSync = () => {
    const newSyncState = !isSyncing;
    setIsSyncing(newSyncState);
    try {
      integrationApp
        .connection("square")
        .flow("receive-order-events")
        .patch({ enabled: newSyncState });
    } catch (error) {
      console.error("Error toggling order sync:", error);
    }
  };

  return {
    isSyncing,
    toggleSync,
  };
}
