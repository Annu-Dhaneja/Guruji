/**
 * Admin API Helper with automatic Bearer Token injection,
 * refresh token rotation, and error handling.
 */

export const getAdminToken = (): string | null => {
  return localStorage.getItem('gcp_admin_token');
};

export const setAdminToken = (token: string): void => {
  localStorage.setItem('gcp_admin_token', token);
};

export const getAdminRefreshToken = (): string | null => {
  return localStorage.getItem('gcp_admin_refresh_token');
};

export const setAdminRefreshToken = (refreshToken: string): void => {
  localStorage.setItem('gcp_admin_refresh_token', refreshToken);
};

export const removeAdminToken = (): void => {
  localStorage.removeItem('gcp_admin_token');
  localStorage.removeItem('gcp_admin_refresh_token');
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let token = getAdminToken();
  const headers = new Headers(init?.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(init?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  // If access token expired (401), try transparent refresh using refresh token
  if (response.status === 401) {
    const refreshToken = getAdminRefreshToken();
    if (refreshToken && !isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch('/api/admin/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          if (data.token && data.refreshToken) {
            setAdminToken(data.token);
            setAdminRefreshToken(data.refreshToken);
            token = data.token;
            onRefreshed(data.token);

            // Retry original request with new token
            headers.set('Authorization', `Bearer ${data.token}`);
            isRefreshing = false;
            return fetch(input, {
              ...init,
              headers,
            });
          }
        } else {
          removeAdminToken();
        }
      } catch (e) {
        console.error('[adminFetch] Token refresh failed:', e);
        removeAdminToken();
      } finally {
        isRefreshing = false;
      }
    }
  }

  return response;
}
