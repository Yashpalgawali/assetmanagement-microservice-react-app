import axios from "axios";


// ═══════════════════════════════════════════════
//  Keycloak Configuration — UPDATE THESE VALUES
// ═══════════════════════════════════════════════
const KEYCLOAK_URL = "http://localhost:7080";
const REALM = "savera";
const CLIENT_ID = "assetmanagement-react-app";
const REDIRECT_URI = `${window.location.origin}/assetmanagement/callback`;

const AUTH_URL = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth`;
const TOKEN_URL = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;
const LOGOUT_URL = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`;

// ═══════════════════════════════════════════════
//  PKCE Helpers — Proof Key for Code Exchange
//  Uses Web Crypto API (available in all modern browsers)
// ═══════════════════════════════════════════════

/**
 * Generate a cryptographically random code verifier (43–128 chars, URL-safe).
 */
function generateCodeVerifier() {
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);
    return base64UrlEncode(array);
}

/**
 * Derive the S256 code challenge from a code verifier.
 * challenge = BASE64URL( SHA-256( verifier ) )
 *
 * Uses Web Crypto API when available (HTTPS / localhost).
 * Falls back to a pure-JS SHA-256 for non-secure contexts (plain HTTP on LAN IPs).
 */
async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);

    if (crypto.subtle) {
        // Secure context — use native Web Crypto
        const digest = await crypto.subtle.digest("SHA-256", data);
        return base64UrlEncode(new Uint8Array(digest));
    }

    // Non-secure context fallback — pure JS SHA-256
    const digest = sha256(data);
    return base64UrlEncode(digest);
}

/**
 * Pure-JS SHA-256 implementation (RFC 6234).
 * Only used as a fallback when crypto.subtle is unavailable (non-HTTPS contexts).
 * @param {Uint8Array} msgBytes
 * @returns {Uint8Array} 32-byte SHA-256 hash
 */
function sha256(msgBytes) {
    // Initial hash values (first 32 bits of the fractional parts of the square roots of the first 8 primes)
    const H = new Uint32Array([
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]);

    // Round constants (first 32 bits of the fractional parts of the cube roots of the first 64 primes)
    const K = new Uint32Array([
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]);

    // Pre-processing: pad message
    const msgLen = msgBytes.length;
    const bitLen = msgLen * 8;
    // Message + 1 byte (0x80) + padding + 8 bytes (length), total must be multiple of 64
    const padLen = (((msgLen + 9 + 63) >>> 6) << 6);
    const padded = new Uint8Array(padLen);
    padded.set(msgBytes);
    padded[msgLen] = 0x80;
    // Write bit length as 64-bit big-endian at end (only lower 32 bits for typical sizes)
    const view = new DataView(padded.buffer);
    view.setUint32(padLen - 4, bitLen, false);

    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    const W = new Uint32Array(64);

    // Process each 512-bit (64-byte) block
    for (let offset = 0; offset < padLen; offset += 64) {
        // Prepare message schedule
        for (let i = 0; i < 16; i++) {
            W[i] = view.getUint32(offset + i * 4, false);
        }
        for (let i = 16; i < 64; i++) {
            const s0 = rotr(W[i - 15], 7) ^ rotr(W[i - 15], 18) ^ (W[i - 15] >>> 3);
            const s1 = rotr(W[i - 2], 17) ^ rotr(W[i - 2], 19) ^ (W[i - 2] >>> 10);
            W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
        }

        let [a, b, c, d, e, f, g, h] = H;

        for (let i = 0; i < 64; i++) {
            const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
            const ch = (e & f) ^ (~e & g);
            const t1 = (h + S1 + ch + K[i] + W[i]) | 0;
            const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const t2 = (S0 + maj) | 0;

            h = g; g = f; f = e; e = (d + t1) | 0;
            d = c; c = b; b = a; a = (t1 + t2) | 0;
        }

        H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0;
        H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
        H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0;
        H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }

    // Produce the final hash as Uint8Array
    const result = new Uint8Array(32);
    const resultView = new DataView(result.buffer);
    for (let i = 0; i < 8; i++) {
        resultView.setUint32(i * 4, H[i], false);
    }
    return result;
}

/**
 * Base64-URL encode a Uint8Array (no padding, URL-safe chars).
 */
function base64UrlEncode(bytes) {
    let binary = "";
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

// ═══════════════════════════════════════════════
//  LOGIN — Authorization Code + PKCE Flow
//  Redirects to Keycloak's hosted login page
// ═══════════════════════════════════════════════

/**
 * Build the Keycloak authorization URL and redirect the browser.
 * Stores `code_verifier` and `state` in sessionStorage for the callback.
 */
export async function redirectToKeycloakLogin() {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Random state for CSRF protection
    const state = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));

    // Persist for the callback to use
    sessionStorage.setItem("pkce_code_verifier", codeVerifier);
    sessionStorage.setItem("oauth_state", state);

    const params = new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: "openid email profile",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state: state,
    });

    // Redirect the browser to Keycloak login
    window.location.href = `${AUTH_URL}?${params.toString()}`;
}

// ═══════════════════════════════════════════════
//  CALLBACK — Exchange authorization code for tokens
// ═══════════════════════════════════════════════

/**
 * Exchange the authorization code + PKCE verifier for access/refresh tokens.
 * Called from the OAuth callback route after Keycloak redirects back.
 */
export const exchangeCodeForTokens = (code, codeVerifier) => {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", CLIENT_ID);
    params.append("code", code);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("code_verifier", codeVerifier);

    return axios.post(TOKEN_URL, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
};

// ═══════════════════════════════════════════════
//  REFRESH TOKEN — Direct call to Keycloak
// ═══════════════════════════════════════════════
export const executeTokenRefresh = (refreshToken) => {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", CLIENT_ID);
    params.append("refresh_token", refreshToken);

    return axios.post(TOKEN_URL, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
};

// ═══════════════════════════════════════════════
//  LOGOUT — Revoke refresh token on Keycloak
// ═══════════════════════════════════════════════
export const executeKeycloakLogout = (refreshToken) => {
    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("refresh_token", refreshToken);

    return axios.post(LOGOUT_URL, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
};

// ═══════════════════════════════════════════════
//  REGISTER — Redirect to Keycloak's built-in registration page
//  Uses the same Authorization Code + PKCE flow
// ═══════════════════════════════════════════════
const REGISTRATION_URL = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/registrations`;

/**
 * Redirect to Keycloak's hosted registration page.
 * After registration, Keycloak redirects back with an auth code (same as login).
 */
export async function redirectToKeycloakRegister() {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));

    sessionStorage.setItem("pkce_code_verifier", codeVerifier);
    sessionStorage.setItem("oauth_state", state);

    const params = new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: "openid email profile",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state: state,
    });

    window.location.href = `${REGISTRATION_URL}?${params.toString()}`;
}