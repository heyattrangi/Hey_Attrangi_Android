#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# Use a supported Node version when nvm is available.
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck source=/dev/null
  source "$HOME/.nvm/nvm.sh"
  nvm use 24.18.0 2>/dev/null || nvm use 22 2>/dev/null || nvm use 20.19.4 2>/dev/null || true
fi

# Detect LAN IP so physical devices can reach Metro (offline mode defaults to 127.0.0.1).
LAN_IP="${REACT_NATIVE_PACKAGER_HOSTNAME:-}"
if [ -z "$LAN_IP" ]; then
  LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
fi
if [ -z "$LAN_IP" ]; then
  LAN_IP="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
fi
if [ -z "$LAN_IP" ]; then
  echo "Could not detect LAN IP. Set REACT_NATIVE_PACKAGER_HOSTNAME and retry."
  exit 1
fi

export REACT_NATIVE_PACKAGER_HOSTNAME="$LAN_IP"
export EXPO_OFFLINE=1

echo ""
echo "========================================"
echo "  Expo Go — Hey Attrangi (SDK 57)"
echo "========================================"
echo "  Mode:     Expo Go (LAN + offline)"
echo "  Network:  LAN ($LAN_IP)"
echo "  URL:      exp://$LAN_IP:8081"
echo ""
echo "  Scan the QR code below with Expo Go."
echo "  Requires Expo Go for SDK 57 on your device."
echo "  (Play Store build may still be SDK 56 — use"
echo "   'npx expo start --go --android' over USB"
echo "   to install the matching Expo Go.)"
echo "========================================"
echo ""

# Print QR in terminal (Python qrcode is reliable; npx qrcode-terminal often hangs).
if command -v python3 >/dev/null 2>&1; then
  python3 - <<PY 2>/dev/null || true
try:
    import qrcode
    qr = qrcode.QRCode(border=1)
    qr.add_data("exp://$LAN_IP:8081")
    qr.make(fit=True)
    qr.print_ascii(invert=True)
except Exception:
    pass
PY
fi

exec npx expo start --go --host lan --clear "$@"
