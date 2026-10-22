declare module 'expo-apple-authentication' {
  import React from 'react';
  import { ViewStyle, StyleProp } from 'react-native';

  export enum AppleAuthenticationScope {
    FULL_NAME = 0,
    EMAIL = 1,
  }

  export enum AppleAuthenticationButtonType {
    SIGN_IN = 0,
    CONTINUE = 1,
    SIGN_UP = 2,
  }

  export enum AppleAuthenticationButtonStyle {
    WHITE = 0,
    WHITE_OUTLINE = 1,
    BLACK = 2,
  }

  export interface AppleAuthenticationFullName {
    namePrefix?: string | null;
    givenName?: string | null;
    middleName?: string | null;
    familyName?: string | null;
    nameSuffix?: string | null;
    nickname?: string | null;
  }

  export interface AppleAuthenticationCredential {
    user: string;
    state?: string | null;
    authorizedScopes: AppleAuthenticationScope[];
    identityToken?: string | null;
    authorizationCode?: string | null;
    email?: string | null;
    fullName?: AppleAuthenticationFullName | null;
  }

  export interface AppleAuthenticationButtonProps {
    onPress: () => void;
    type?: AppleAuthenticationButtonType;
    style?: StyleProp<ViewStyle>;
    buttonType?: AppleAuthenticationButtonType;
    buttonStyle?: AppleAuthenticationButtonStyle;
    cornerRadius?: number;
  }

  export const AppleAuthenticationButton: React.FC<AppleAuthenticationButtonProps>;

  export function isAvailableAsync(): Promise<boolean>;

  export function signInAsync(options?: {
    requestedScopes?: AppleAuthenticationScope[];
    nonce?: string;
    state?: string;
  }): Promise<AppleAuthenticationCredential>;
}

declare module 'expo-crypto' {
  export enum CryptoDigestAlgorithm {
    SHA1 = 'SHA-1',
    SHA256 = 'SHA-256',
    SHA384 = 'SHA-384',
    SHA512 = 'SHA-512',
    MD5 = 'MD5',
  }

  export enum CryptoEncoding {
    HEX = 'hex',
    BASE64 = 'base64',
  }

  export function getRandomBytesAsync(byteCount: number): Promise<Uint8Array>;

  export function digestStringAsync(
    algorithm: CryptoDigestAlgorithm,
    data: string,
    options?: { encoding?: CryptoEncoding },
  ): Promise<string>;
}
