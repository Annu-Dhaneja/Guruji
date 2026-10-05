/**
 * Razorpay Checkout SDK Script Loader
 * Provides singleton, thread-safe, resilient loading of checkout.razorpay.com/v1/checkout.js
 * with timeout handling, ad-blocker detection, and error recovery.
 */

export enum RazorpayScriptState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  FAILED = 'FAILED',
}

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
const LOAD_TIMEOUT_MS = 12000; // 12 seconds

let scriptState: RazorpayScriptState = RazorpayScriptState.IDLE;
let loadingPromise: Promise<any> | null = null;

/**
 * Checks whether Razorpay is already available and callable on the window object
 */
export function isRazorpayReady(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as any).Razorpay === 'function'
  );
}

/**
 * Gets current script loading state
 */
export function getRazorpayScriptState(): RazorpayScriptState {
  if (isRazorpayReady()) {
    return RazorpayScriptState.LOADED;
  }
  return scriptState;
}

/**
 * Loads the Razorpay Checkout SDK script dynamically and returns window.Razorpay constructor
 */
export function loadRazorpayCheckout(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay Checkout can only be loaded in a browser environment.'));
  }

  // If already available, reuse immediately
  if (isRazorpayReady()) {
    console.log('[Razorpay] SDK already loaded and callable in window.');
    scriptState = RazorpayScriptState.LOADED;
    return Promise.resolve((window as any).Razorpay);
  }

  // If already in-flight, reuse existing promise
  if (loadingPromise && scriptState === RazorpayScriptState.LOADING) {
    console.log('[Razorpay] Reusing existing SDK load promise in-flight...');
    return loadingPromise;
  }

  scriptState = RazorpayScriptState.LOADING;
  console.log('[Razorpay] SDK loading started from:', RAZORPAY_SCRIPT_SRC);

  loadingPromise = new Promise((resolve, reject) => {
    let timeoutId: any = null;

    // Check if script tag already exists in DOM
    let scriptTag = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const handleSuccess = () => {
      cleanup();
      if (isRazorpayReady()) {
        scriptState = RazorpayScriptState.LOADED;
        console.log('[Razorpay] SDK loaded successfully.');
        resolve((window as any).Razorpay);
      } else {
        scriptState = RazorpayScriptState.FAILED;
        console.error('[Razorpay] Script loaded but window.Razorpay is not a function.');
        reject(
          new Error(
            'Razorpay Checkout could not be initialized. Please check your internet connection or browser extensions.'
          )
        );
      }
    };

    const handleError = (errorEvent?: any) => {
      cleanup();
      scriptState = RazorpayScriptState.FAILED;
      loadingPromise = null;
      console.error('[Razorpay] SDK script load failed:', errorEvent);
      reject(
        new Error(
          'Razorpay Checkout could not be loaded. Please check your internet connection and ensure ad-blockers or privacy extensions are not blocking checkout.razorpay.com.'
        )
      );
    };

    // Safety timeout
    timeoutId = setTimeout(() => {
      if (!isRazorpayReady()) {
        cleanup();
        scriptState = RazorpayScriptState.FAILED;
        loadingPromise = null;
        console.error('[Razorpay] SDK load timed out after', LOAD_TIMEOUT_MS, 'ms');
        reject(
          new Error(
            'Razorpay payment gateway is taking too long to load. Please check your connection and try again.'
          )
        );
      }
    }, LOAD_TIMEOUT_MS);

    if (scriptTag) {
      // Script tag exists, wait for it or check if ready
      if (isRazorpayReady()) {
        handleSuccess();
        return;
      }
      scriptTag.addEventListener('load', handleSuccess, { once: true });
      scriptTag.addEventListener('error', handleError, { once: true });
    } else {
      // Create new script tag
      const script = document.createElement('script');
      script.src = RAZORPAY_SCRIPT_SRC;
      script.type = 'text/javascript';
      script.async = true;
      script.crossOrigin = 'anonymous';

      script.onload = handleSuccess;
      script.onerror = handleError;

      document.body.appendChild(script);
    }
  });

  return loadingPromise;
}

/**
 * Resets script loader state for retry
 */
export function resetRazorpayLoader(): void {
  scriptState = RazorpayScriptState.IDLE;
  loadingPromise = null;
}
