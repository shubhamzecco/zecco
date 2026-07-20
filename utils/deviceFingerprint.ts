import FingerprintJS from '@fingerprintjs/fingerprintjs';

export type FingerprintDeviceInfo = {
  deviceId?: string;
  deviceType?: string;
};

let fpPromise: Promise<any> | null = null;

const detectDeviceType = (userAgent: string): string => {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
};

const fallbackDeviceId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Generates a stable device identifier and infers device type.
 * Must be called client-side.
 */
export async function getFingerprintDeviceInfo(): Promise<FingerprintDeviceInfo> {
  if (typeof window === 'undefined') return {};

  const userAgent = navigator.userAgent || '';

  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }

  try {
    const fp = await fpPromise;
    const result = await fp.get();

    return {
      deviceId: result.visitorId,
      deviceType: detectDeviceType(userAgent),
    };
  } catch (err) {
    console.error('FingerprintJS failed', err);
    return {
      deviceId: fallbackDeviceId(),
      deviceType: detectDeviceType(userAgent),
    };
  }
}
