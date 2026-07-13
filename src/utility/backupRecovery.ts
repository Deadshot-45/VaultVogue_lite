/**
 * Client-side Backup & Restore Strategy (inspired by odoo-backup-strategy)
 * Captures snapshots of critical local database stores before role-based session updates.
 */

export interface StateBackup {
  id: string;
  email: string;
  timestamp: string;
  data: {
    products: any[];
    orders: any[];
    sellers: any[];
  };
}

const BACKUP_KEY = "vault_vogue_state_backups";
const MAX_BACKUPS = 5;

export const backupRecovery = {
  /**
   * Creates a timestamped backup of the current localStorage state for the logging-in user
   */
  createBackup: (email: string): string => {
    try {
      const timestamp = new Date().toISOString();
      const id = `backup_${new Date().getTime()}`;

      // Retrieve existing active stores
      const products = JSON.parse(localStorage.getItem("vault_vogue_seller_products") || "[]");
      const orders = JSON.parse(localStorage.getItem("vault_vogue_seller_orders") || "[]");
      const sellers = JSON.parse(localStorage.getItem("vault_vogue_admin_sellers") || "[]");

      const newBackup: StateBackup = {
        id,
        email: email.toLowerCase(),
        timestamp,
        data: { products, orders, sellers },
      };

      // Retrieve all existing backups
      const rawBackups = localStorage.getItem(BACKUP_KEY);
      let backups: StateBackup[] = rawBackups ? JSON.parse(rawBackups) : [];

      // Add new backup at the beginning
      backups = [newBackup, ...backups];

      // Limit backups to MAX_BACKUPS (Odoo-style cleaning of old archives)
      if (backups.length > MAX_BACKUPS) {
        backups = backups.slice(0, MAX_BACKUPS);
      }

      localStorage.setItem(BACKUP_KEY, JSON.stringify(backups));
      console.log(`[Backup System] Created snapshot: ${id} for ${email}`);
      return id;
    } catch (err) {
      console.error("[Backup System] Failed to create state snapshot:", err);
      return "";
    }
  },

  /**
   * Lists all available backups for a specific user email
   */
  listBackups: (email: string): StateBackup[] => {
    try {
      const rawBackups = localStorage.getItem(BACKUP_KEY);
      if (!rawBackups) return [];
      const backups: StateBackup[] = JSON.parse(rawBackups);
      return backups.filter((b) => b.email === email.toLowerCase());
    } catch (err) {
      console.error("[Backup System] Failed to list snapshots:", err);
      return [];
    }
  },

  /**
   * Restores active localStorage keys to a specific backup snapshot
   */
  restoreBackup: (backupId: string): boolean => {
    try {
      const rawBackups = localStorage.getItem(BACKUP_KEY);
      if (!rawBackups) return false;

      const backups: StateBackup[] = JSON.parse(rawBackups);
      const match = backups.find((b) => b.id === backupId);

      if (!match) {
        console.error(`[Backup System] Snapshot ${backupId} not found.`);
        return false;
      }

      // Restore active partitions
      localStorage.setItem("vault_vogue_seller_products", JSON.stringify(match.data.products));
      localStorage.setItem("vault_vogue_seller_orders", JSON.stringify(match.data.orders));
      localStorage.setItem("vault_vogue_admin_sellers", JSON.stringify(match.data.sellers));

      console.log(`[Backup System] Successfully restored database state to: ${backupId}`);
      return true;
    } catch (err) {
      console.error(`[Backup System] Failed to restore snapshot ${backupId}:`, err);
      return false;
    }
  },
};
