/**
 * Wisanu Digital Agency - PDPA (Personal Data Protection Act B.E. 2562) Consent Engine
 * Standard-compliant Cookie Consent & Data Subject Rights (DSAR) Management
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'wisanu_pdpa_consent';
  const DSAR_STORAGE_KEY = 'wisanu_dsar_requests';
  const CONSENT_VERSION = '1.2.0';

  const defaultConsent = {
    consentGiven: false,
    timestamp: null,
    uuid: null,
    version: CONSENT_VERSION,
    preferences: {
      necessary: true,   // Always active
      functional: false, // Site preferences
      analytics: false,  // Traffic analysis (Google Analytics, etc.)
      marketing: false   // Advertising & Line Pixel, Facebook Pixel
    }
  };

  function generateUUID() {
    return 'pdpa-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getSavedConsent() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('PDPA storage access error:', e);
    }
    return null;
  }

  function saveConsent(preferences) {
    const consent = {
      consentGiven: true,
      timestamp: new Date().toISOString(),
      uuid: getSavedConsent()?.uuid || generateUUID(),
      version: CONSENT_VERSION,
      preferences: {
        necessary: true,
        functional: !!preferences.functional,
        analytics: !!preferences.analytics,
        marketing: !!preferences.marketing
      }
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) {
      console.error('Failed to save PDPA consent', e);
    }

    // Dispatch event for analytics / tag managers
    window.dispatchEvent(new CustomEvent('wisanu_pdpa_consent_updated', { detail: consent }));
    applyConsentScripts(consent);
    updateAuditInfo(consent);
    hideBanner();
    hideSettingsModal();
    showToastNotification('บันทึกการตั้งค่าความยินยอม PDPA เรียบร้อยแล้ว');
  }

  function applyConsentScripts(consent) {
    // Sync with Google Analytics / Google Tag Manager Consent Mode
    if (typeof gtag === 'function' && consent && consent.preferences) {
      gtag('consent', 'update', {
        'analytics_storage': consent.preferences.analytics ? 'granted' : 'denied',
        'ad_storage': consent.preferences.marketing ? 'granted' : 'denied',
        'ad_user_data': consent.preferences.marketing ? 'granted' : 'denied',
        'ad_personalization': consent.preferences.marketing ? 'granted' : 'denied'
      });
    }
  }

  function showBanner() {
    const banner = document.getElementById('pdpa-cookie-banner');
    if (banner) {
      banner.classList.remove('hidden');
      setTimeout(() => {
        banner.classList.remove('translate-y-full', 'opacity-0');
        banner.classList.add('translate-y-0', 'opacity-100');
      }, 50);
    }
  }

  function hideBanner() {
    const banner = document.getElementById('pdpa-cookie-banner');
    if (banner) {
      banner.classList.add('translate-y-full', 'opacity-0');
      banner.classList.remove('translate-y-0', 'opacity-100');
      setTimeout(() => {
        banner.classList.add('hidden');
      }, 300);
    }
  }

  function openSettingsModal() {
    const modal = document.getElementById('pdpa-settings-modal');
    if (!modal) return;

    const current = getSavedConsent() || defaultConsent;
    const pref = current.preferences;

    // Set toggle values
    const funcToggle = document.getElementById('toggle-functional');
    const analyticsToggle = document.getElementById('toggle-analytics');
    const marketingToggle = document.getElementById('toggle-marketing');

    if (funcToggle) funcToggle.checked = pref.functional;
    if (analyticsToggle) analyticsToggle.checked = pref.analytics;
    if (marketingToggle) marketingToggle.checked = pref.marketing;

    updateAuditInfo(current);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function hideSettingsModal() {
    const modal = document.getElementById('pdpa-settings-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  function updateAuditInfo(consent) {
    const auditIdEl = document.getElementById('pdpa-audit-uuid');
    const auditDateEl = document.getElementById('pdpa-audit-date');
    if (auditIdEl && consent && consent.uuid) {
      auditIdEl.textContent = consent.uuid;
    }
    if (auditDateEl && consent && consent.timestamp) {
      const d = new Date(consent.timestamp);
      auditDateEl.textContent = d.toLocaleString('th-TH');
    }
  }

  function showToastNotification(message) {
    let toast = document.getElementById('pdpa-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'pdpa-toast';
      toast.className = 'fixed bottom-6 left-6 z-[9999] bg-slate-900 border border-blue-500/40 text-white text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 transition-all duration-300 transform translate-y-12 opacity-0';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <div class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
      <span>${message}</span>
    `;
    toast.classList.remove('translate-y-12', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.add('translate-y-12', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3500);
  }

  // Handle DSAR (Data Subject Access Request - แบบฟอร์มขอใช้สิทธิ)
  function submitDsarRequest(formData) {
    const ticketId = 'PDPA-TH-' + Math.floor(100000 + Math.random() * 900000);
    const requestRecord = {
      ticketId: ticketId,
      submittedAt: new Date().toISOString(),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      rightType: formData.rightType,
      details: formData.details,
      status: 'อยู่ระหว่างตรวจสอบสิทธิ (Pending Verification)'
    };

    try {
      const existing = JSON.parse(localStorage.getItem(DSAR_STORAGE_KEY) || '[]');
      existing.unshift(requestRecord);
      localStorage.setItem(DSAR_STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('DSAR storage write error:', e);
    }

    return requestRecord;
  }

  // Initialize
  function init() {
    const saved = getSavedConsent();

    if (!saved || !saved.consentGiven) {
      // Delay slightly for smooth page entrance
      setTimeout(showBanner, 800);
    } else {
      applyConsentScripts(saved);
      updateAuditInfo(saved);
    }

    // Attach Event Listeners
    // Accept All
    document.querySelectorAll('[data-pdpa-action="accept-all"]').forEach(btn => {
      btn.addEventListener('click', () => {
        saveConsent({
          functional: true,
          analytics: true,
          marketing: true
        });
      });
    });

    // Reject Non-Essential
    document.querySelectorAll('[data-pdpa-action="reject-all"]').forEach(btn => {
      btn.addEventListener('click', () => {
        saveConsent({
          functional: false,
          analytics: false,
          marketing: false
        });
      });
    });

    // Open Settings Modal
    document.querySelectorAll('[data-pdpa-action="open-settings"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSettingsModal();
      });
    });

    // Save Custom Preferences
    const saveCustomBtn = document.getElementById('pdpa-save-preferences-btn');
    if (saveCustomBtn) {
      saveCustomBtn.addEventListener('click', () => {
        const func = document.getElementById('toggle-functional')?.checked || false;
        const analytics = document.getElementById('toggle-analytics')?.checked || false;
        const marketing = document.getElementById('toggle-marketing')?.checked || false;
        saveConsent({
          functional: func,
          analytics: analytics,
          marketing: marketing
        });
      });
    }

    // Close Settings Modal
    const closeModalBtn = document.getElementById('pdpa-close-settings-modal');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', hideSettingsModal);
    }

    const modalBackdrop = document.getElementById('pdpa-settings-modal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          hideSettingsModal();
        }
      });
    }

    // Revoke consent helper
    document.querySelectorAll('[data-pdpa-action="reset-consent"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem(STORAGE_KEY);
        showToastNotification('รีเซ็ตข้อมูลความยินยอมแล้ว หน้าเว็บจะโหลดใหม่');
        setTimeout(() => location.reload(), 800);
      });
    });
  }

  // Expose API
  window.WisanuPDPA = {
    init,
    showBanner,
    hideBanner,
    openSettingsModal,
    hideSettingsModal,
    getSavedConsent,
    saveConsent,
    submitDsarRequest,
    showToastNotification
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
