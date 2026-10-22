import { Platform } from 'react-native';
import Purchases, {
  PurchasesPackage,
  PurchasesOfferings,
  CustomerInfo,
  MakePurchaseResult,
} from 'react-native-purchases';
import { env } from '../../config/env';

class RevenueCatService {
  private configured = false;

  public isSupported(): boolean {
    return Platform.OS === 'ios';
  }

  public configure(userId?: string | null): void {
    if (!this.isSupported()) return;

    const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || '';
    if (!apiKey) {
      console.warn('[REVENUECAT] EXPO_PUBLIC_REVENUECAT_IOS_API_KEY is not configured.');
      return;
    }

    try {
      Purchases.configure({
        apiKey,
        appUserID: userId ?? undefined,
      });
      this.configured = true;
      console.log(`[REVENUECAT] Configured successfully for userId=${userId ?? 'anonymous'}`);
    } catch (err: any) {
      console.error('[REVENUECAT] Configuration error:', err?.message || err);
    }
  }

  public async syncUserIdentity(userId: string): Promise<void> {
    if (!this.isSupported()) return;

    try {
      if (!this.configured) {
        this.configure(userId);
      } else {
        await Purchases.logIn(userId);
        console.log(`[REVENUECAT] Logged in RevenueCat user id=${userId}`);
      }
    } catch (err: any) {
      console.error('[REVENUECAT] Login error:', err?.message || err);
    }
  }

  public async handleSignOut(): Promise<void> {
    if (!this.isSupported() || !this.configured) return;

    try {
      await Purchases.logOut();
      console.log('[REVENUECAT] Logged out RevenueCat user.');
    } catch (err: any) {
      console.error('[REVENUECAT] Logout error:', err?.message || err);
    }
  }

  public async getOfferings(): Promise<PurchasesOfferings | null> {
    if (!this.isSupported() || env.USE_MOCK_SERVICES) return null;

    try {
      if (!this.configured) this.configure();
      return await Purchases.getOfferings();
    } catch (err: any) {
      console.error('[REVENUECAT] getOfferings error:', err?.message || err);
      return null;
    }
  }

  public async purchasePackage(pkg: PurchasesPackage): Promise<MakePurchaseResult | null> {
    if (!this.isSupported()) {
      throw new Error('In-App Purchases are only supported on iOS.');
    }

    try {
      if (!this.configured) this.configure();
      const result = await Purchases.purchasePackage(pkg);
      console.log(`[REVENUECAT] Purchase successful for product=${result.productIdentifier}`);
      return result;
    } catch (err: any) {
      if (err?.userCancelled) {
        console.log('[REVENUECAT] User cancelled purchase.');
        return null;
      }
      console.error('[REVENUECAT] purchasePackage error:', err?.message || err);
      throw err;
    }
  }

  public async restorePurchases(): Promise<CustomerInfo | null> {
    if (!this.isSupported()) {
      throw new Error('Restore purchases is only supported on iOS.');
    }

    try {
      if (!this.configured) this.configure();
      const customerInfo = await Purchases.restorePurchases();
      console.log('[REVENUECAT] Restore purchases successful.');
      return customerInfo;
    } catch (err: any) {
      console.error('[REVENUECAT] restorePurchases error:', err?.message || err);
      throw err;
    }
  }
}

export const revenueCatService = new RevenueCatService();
