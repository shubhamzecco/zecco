import { io } from "socket.io-client";

export const fallbackPrivacyPolicy = {
  title: "Privacy Policy",
  description: `
    <p><strong>Last Updated: June 5, 2026</strong></p>
    <p>Welcome to Zecco Real Estate. We are committed to protecting your privacy and ensuring that your personal information is handled securely and responsibly.</p>
    <h3>Information We Collect</h3>
    <p>We may collect personal information such as your name, email address, phone number, account details, and property search criteria while you use our services.</p>
    <h3>How We Use Your Information</h3>
    <p>We use your information to:</p>
    <ul>
      <li>Provide personalized AI property recommendations and search services.</li>
      <li>Process transactions, inquiries, and advisor consultations.</li>
      <li>Respond to customer support requests and provide local real estate guidance.</li>
      <li>Send important property updates, notifications, and saved search alerts.</li>
      <li>Comply with Spanish and EU legal obligations (GDPR).</li>
    </ul>
    <h3>Information Sharing</h3>
    <p>We do not sell your personal information. We only share information with trusted advisors and verified partners who assist in delivering our property and legal services.</p>
    <h3>Data Security</h3>
    <p>We implement robust technical and organizational measures to protect your data against unauthorized access, loss, or disclosure.</p>
    <h3>Cookies & Analytics</h3>
    <p>Our platform uses cookies and analytics technologies to enhance your browsing experience, remember saved searches, and optimize property matching.</p>
    <h3>Your Rights</h3>
    <p>Under GDPR and applicable laws, you have the right to access, rectify, delete, or restrict the processing of your personal data at any time.</p>
    <h3>Contact Us</h3>
    <p>If you have any questions regarding this Privacy Policy, please contact our support team at info@zecco.es.</p>
  `,
};

export const fallbackTermsConditions = {
  title: "Terms & Conditions",
  description: `
    <p><strong>Last Updated: June 5, 2026</strong></p>
    <p>By accessing or using the Zecco Real Estate platform, you agree to be bound by these Terms & Conditions.</p>
    <h3>Acceptance of Terms</h3>
    <p>By using our website, AI property tools, and advisory services, you acknowledge that you have read, understood, and agreed to these terms.</p>
    <h3>User Accounts</h3>
    <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your portal account.</p>
    <h3>Acceptable Use</h3>
    <p>Users agree not to violate applicable laws, upload malicious content, or misuse the platform for fraudulent real estate inquiries.</p>
    <h3>Property Listings & Accuracy</h3>
    <p>While Zecco strives to ensure all property information, pricing, and AI insights are accurate, listings are subject to verification and market availability.</p>
    <h3>Intellectual Property</h3>
    <p>All content, branding, AI models, and listings on this platform are owned by or licensed to Zecco Real Estate.</p>
    <h3>Limitation of Liability</h3>
    <p>Zecco provides its search and advisory platform on an "as is" basis and shall not be liable for indirect damages arising from property transactions between third parties.</p>
    <h3>Governing Law</h3>
    <p>These Terms & Conditions are governed by and construed in accordance with the laws of Spain.</p>
    <h3>Contact Information</h3>
    <p>For inquiries regarding these Terms & Conditions, please contact us at info@zecco.es.</p>
  `,
};

export async function fetchPrivacyPolicyData(): Promise<{ title: string; description: string }> {
  const url = process.env.NEXT_PUBLIC_ENDPOINT_API_URL || "https://zn.appristine.co.in";
  try {
    const socket = io(url, { transports: ["websocket"], reconnection: false, timeout: 3000 });
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        try { socket.disconnect(); } catch (_) {}
        resolve(fallbackPrivacyPolicy);
      }, 2500);

      socket.on("connect", () => {
        socket.emit("action", {
          type: "privacyPolicyService",
          action: "get",
          payload: {},
        });
      });

      socket.onAny((_event, res) => {
        if (res?.request?.type === "privacyPolicyService" && res?.request?.action === "get") {
          clearTimeout(timer);
          try { socket.disconnect(); } catch (_) {}
          if (res?.data?.description) {
            resolve({
              title: res.data.title || "Privacy Policy",
              description: res.data.description,
            });
          } else {
            resolve(fallbackPrivacyPolicy);
          }
        }
      });

      socket.on("connect_error", () => {
        clearTimeout(timer);
        resolve(fallbackPrivacyPolicy);
      });
    });
  } catch (e) {
    return fallbackPrivacyPolicy;
  }
}

export async function fetchTermsConditionsData(): Promise<{ title: string; description: string }> {
  const url = process.env.NEXT_PUBLIC_ENDPOINT_API_URL || "https://zn.appristine.co.in";
  try {
    const socket = io(url, { transports: ["websocket"], reconnection: false, timeout: 3000 });
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        try { socket.disconnect(); } catch (_) {}
        resolve(fallbackTermsConditions);
      }, 2500);

      socket.on("connect", () => {
        socket.emit("action", {
          type: "termsConditionsService",
          action: "get",
          payload: {},
        });
      });

      socket.onAny((_event, res) => {
        if (res?.request?.type === "termsConditionsService" && res?.request?.action === "get") {
          clearTimeout(timer);
          try { socket.disconnect(); } catch (_) {}
          if (res?.data?.description) {
            resolve({
              title: res.data.title || "Terms & Conditions",
              description: res.data.description,
            });
          } else {
            resolve(fallbackTermsConditions);
          }
        }
      });

      socket.on("connect_error", () => {
        clearTimeout(timer);
        resolve(fallbackTermsConditions);
      });
    });
  } catch (e) {
    return fallbackTermsConditions;
  }
}
