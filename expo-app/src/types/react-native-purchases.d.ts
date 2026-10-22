declare module 'react-native-purchases' {
  export interface PurchasesStoreProduct {
    identifier: string;
    description: string;
    title: string;
    price: number;
    priceString: string;
    currencyCode: string;
  }

  export interface PurchasesPackage {
    identifier: string;
    packageType: string;
    product: PurchasesStoreProduct;
    offeringIdentifier: string;
  }

  export interface PurchasesOffering {
    identifier: string;
    serverDescription: string;
    availablePackages: PurchasesPackage[];
    lifetime?: PurchasesPackage | null;
    annual?: PurchasesPackage | null;
    sixMonth?: PurchasesPackage | null;
    threeMonth?: PurchasesPackage | null;
    twoMonth?: PurchasesPackage | null;
    monthly?: PurchasesPackage | null;
    weekly?: PurchasesPackage | null;
  }

  export interface PurchasesOfferings {
    all: Record<string, PurchasesOffering>;
    current: PurchasesOffering | null;
  }

  export interface CustomerInfo {
    activeSubscriptions: string[];
    allPurchasedProductIdentifiers: string[];
    latestExpirationDate?: string | null;
    originalAppUserId: string;
    requestDate: string;
    entitlements: {
      active: Record<string, any>;
      all: Record<string, any>;
    };
  }

  export interface MakePurchaseResult {
    productIdentifier: string;
    customerInfo: CustomerInfo;
  }

  export interface LogInResult {
    customerInfo: CustomerInfo;
    created: boolean;
  }

  export default class Purchases {
    static configure(configuration: { apiKey: string; appUserID?: string | null }): void;
    static isConfigured(): boolean;
    static logIn(appUserID: string): Promise<LogInResult>;
    static logOut(): Promise<CustomerInfo>;
    static getOfferings(): Promise<PurchasesOfferings>;
    static purchasePackage(purchasesPackage: PurchasesPackage): Promise<MakePurchaseResult>;
    static restorePurchases(): Promise<CustomerInfo>;
    static getCustomerInfo(): Promise<CustomerInfo>;
  }
}
