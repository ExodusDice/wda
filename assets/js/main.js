/**
 * Wisanu Digital Agency (www.wagency.digital) - Main Interactive Engine
 * Portfolio Filtering, Live Website Audit Tool, Pricing Calculator, FAQ & Social Proof
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu');

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.toggle('hidden');
      document.body.style.overflow = mobileMenuDrawer.classList.contains('hidden') ? '' : 'hidden';
    });
  }

  if (closeMobileMenuBtn && mobileMenuDrawer) {
    closeMobileMenuBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuDrawer) {
        mobileMenuDrawer.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  });

  // 2. Navbar Scroll Glass Effect
  const navbar = document.getElementById('main-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('bg-slate-950/90', 'border-b', 'border-slate-800/80', 'backdrop-blur-md');
    } else {
      navbar?.classList.remove('bg-slate-950/90', 'border-b', 'border-slate-800/80', 'backdrop-blur-md');
    }
  });

  // 3. Pricing Period Toggle (Year 1 vs Renewal)
  const basicPrice = document.getElementById('price-basic');
  const basicPeriod = document.getElementById('period-basic');
  const advancePrice = document.getElementById('price-advance');
  const advancePeriod = document.getElementById('period-advance');
  const ultraPrice = document.getElementById('price-ultra');
  const ultraPeriod = document.getElementById('period-ultra');

  window.setPricingMode = function(mode) {
    document.querySelectorAll('[data-pricing-mode]').forEach(btn => {
      if (btn.dataset.pricingMode === mode) {
        btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
        btn.classList.remove('text-slate-400', 'hover:text-white');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        btn.classList.add('text-slate-400', 'hover:text-white');
      }
    });

    if (mode === 'year1') {
      if (basicPrice) basicPrice.textContent = '8,900';
      if (basicPeriod) basicPeriod.textContent = 'บาท (ปีแรก)';
      if (advancePrice) advancePrice.textContent = '15,000';
      if (advancePeriod) advancePeriod.textContent = 'บาท (ปีแรก)';
      if (ultraPrice) ultraPrice.textContent = '25,000';
      if (ultraPeriod) ultraPeriod.textContent = 'บาท (ปีแรก)';
    } else {
      if (basicPrice) basicPrice.textContent = '3,000';
      if (basicPeriod) basicPeriod.textContent = 'บาท / ปีถัดไป';
      if (advancePrice) advancePrice.textContent = '5,000';
      if (advancePeriod) advancePeriod.textContent = 'บาท / ปีถัดไป';
      if (ultraPrice) ultraPrice.textContent = '8,000';
      if (ultraPeriod) ultraPeriod.textContent = 'บาท / ปีถัดไป';
    }
  };

  // 4. Portfolio Category Filtering
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('bg-blue-600', 'text-white', 'shadow-md'));
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');

      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          setTimeout(() => item.classList.remove('opacity-0', 'scale-95'), 10);
        } else {
          item.classList.add('hidden', 'opacity-0', 'scale-95');
        }
      });
    });
  });

  // 5. Interactive Free Website & PDPA Audit Tool
  const auditForm = document.getElementById('website-audit-form');
  const auditProgress = document.getElementById('audit-progress-container');
  const auditStatusText = document.getElementById('audit-status-text');
  const auditProgressBar = document.getElementById('audit-progress-bar');
  const auditResult = document.getElementById('audit-result-container');
  const auditTargetUrl = document.getElementById('audit-target-url');

  if (auditForm) {
    auditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputUrl = document.getElementById('audit-input-url')?.value.trim();
      if (!inputUrl) return;

      // Hide results, show progress
      auditResult?.classList.add('hidden');
      auditProgress?.classList.remove('hidden');
      if (auditTargetUrl) auditTargetUrl.textContent = inputUrl;

      const steps = [
        { progress: 25, text: 'กำลังตรวจเช็คความเร็วและโครงสร้างหน้าเว็บ (Speed & Mobile View)...' },
        { progress: 55, text: 'กำลังตรวจสอบการปักหมุด Google Maps และ Google Search Console...' },
        { progress: 85, text: 'กำลังสแกนแบนเนอร์คุกกี้ และนโยบายความเป็นส่วนตัวตามกฎหมาย PDPA...' },
        { progress: 100, text: 'การวิเคราะห์เสร็จสมบูรณ์! กำลังสร้างรายงานสรุป...' }
      ];

      let stepIdx = 0;
      const interval = setInterval(() => {
        if (stepIdx < steps.length) {
          if (auditProgressBar) auditProgressBar.style.width = steps[stepIdx].progress + '%';
          if (auditStatusText) auditStatusText.textContent = steps[stepIdx].text;
          stepIdx++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            auditProgress?.classList.add('hidden');
            auditResult?.classList.remove('hidden');
            lucide.createIcons();
          }, 400);
        }
      }, 550);
    });
  }

  // 6. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');
        faqItems.forEach(other => {
          if (other !== item) {
            other.querySelector('.faq-content')?.classList.add('hidden');
            other.querySelector('.faq-icon')?.classList.remove('rotate-180');
          }
        });

        if (isOpen) {
          content.classList.add('hidden');
          icon?.classList.remove('rotate-180');
        } else {
          content.classList.remove('hidden');
          icon?.classList.add('rotate-180');
        }
      });
    }
  });

  // 7. Select Package / Custom Service -> Scroll to Contact and select option
  window.selectPackage = function(packageName) {
    const selectEl = document.getElementById('package-select');
    if (selectEl) {
      selectEl.value = packageName;
      selectEl.classList.add('ring-2', 'ring-blue-500');
      setTimeout(() => selectEl.classList.remove('ring-2', 'ring-blue-500'), 1500);
    }
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  window.selectCustomService = function(serviceKey) {
    const selectEl = document.getElementById('package-select');
    if (selectEl) {
      selectEl.value = serviceKey;
      selectEl.classList.add('ring-2', 'ring-amber-400');
      setTimeout(() => selectEl.classList.remove('ring-2', 'ring-amber-400'), 1800);
    }
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 7.1 Interactive Google AdWords Budget Slider in Custom Services Section
  const adwordsSlider = document.getElementById('adwords-budget-slider');
  const adwordsDisplay = document.getElementById('adwords-budget-display');
  const adwordsFeeY1 = document.getElementById('adwords-fee-y1');
  const adwordsFeeY2 = document.getElementById('adwords-fee-y2');

  function updateAdwordsCardEstimator() {
    if (!adwordsSlider || !adwordsDisplay || !adwordsFeeY1 || !adwordsFeeY2) return;
    const budget = parseInt(adwordsSlider.value, 10) || 10000;
    const feeY1 = Math.round(budget * 2.5);
    const feeY2 = Math.round(budget * 2.0);

    adwordsDisplay.textContent = budget.toLocaleString('th-TH') + ' บาท/เดือน';
    adwordsFeeY1.textContent = feeY1.toLocaleString('th-TH') + ' บาท/ด.';
    adwordsFeeY2.textContent = feeY2.toLocaleString('th-TH') + ' บาท/ด.';
  }

  if (adwordsSlider) {
    adwordsSlider.addEventListener('input', updateAdwordsCardEstimator);
    updateAdwordsCardEstimator();
  }

  // 8. Lead Form Submission with PDPA Validation
  const leadForm = document.getElementById('agency-lead-form');
  const formSuccessModal = document.getElementById('form-success-modal');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const pdpaConsentCheck = document.getElementById('pdpa-consent-checkbox');
      if (pdpaConsentCheck && !pdpaConsentCheck.checked) {
        alert('กรุณาทำเครื่องหมายยินยอมตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) เพื่อให้คุณวิษณุติดต่อกลับ');
        pdpaConsentCheck.focus();
        return;
      }

      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> กำลังส่งข้อมูลไปยังคุณวิษณุ...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        leadForm.reset();

        if (formSuccessModal) {
          formSuccessModal.classList.remove('hidden');
          formSuccessModal.classList.add('flex');
        }
      }, 1000);
    });
  }

  // Close Success Modal
  const closeSuccessModalBtn = document.getElementById('close-success-modal-btn');
  if (closeSuccessModalBtn && formSuccessModal) {
    closeSuccessModalBtn.addEventListener('click', () => {
      formSuccessModal.classList.add('hidden');
      formSuccessModal.classList.remove('flex');
    });
  }

  // 9. Interactive Quotation Calculator
  const calcPackageSelect = document.getElementById('calc-package');
  const calcAddonChatbot = document.getElementById('calc-addon-chatbot');
  const calcAddonSeo = document.getElementById('calc-addon-seo');
  const calcAddonLogo = document.getElementById('calc-addon-logo');
  const calcCustomSeo = document.getElementById('calc-custom-seo');
  const calcCustomAdwords = document.getElementById('calc-custom-adwords');
  const calcAdwordsBudgetContainer = document.getElementById('calc-adwords-budget-container');
  const calcAdwordsBudgetSlider = document.getElementById('calc-adwords-budget-slider');
  const calcAdwordsBudgetVal = document.getElementById('calc-adwords-budget-val');
  const calcAdwordsFeePreview = document.getElementById('calc-adwords-fee-preview');
  const calcTotalFirstYear = document.getElementById('calc-total-firstyear');
  const calcTotalRenewal = document.getElementById('calc-total-renewal');

  if (calcCustomAdwords && calcAdwordsBudgetContainer) {
    calcCustomAdwords.addEventListener('change', () => {
      if (calcCustomAdwords.checked) {
        calcAdwordsBudgetContainer.classList.remove('hidden');
      } else {
        calcAdwordsBudgetContainer.classList.add('hidden');
      }
      window.calculateQuote();
    });
  }

  if (calcAdwordsBudgetSlider) {
    calcAdwordsBudgetSlider.addEventListener('input', () => {
      const b = parseInt(calcAdwordsBudgetSlider.value, 10) || 10000;
      if (calcAdwordsBudgetVal) calcAdwordsBudgetVal.textContent = b.toLocaleString('th-TH') + ' บาท/เดือน';
      if (calcAdwordsFeePreview) calcAdwordsFeePreview.textContent = Math.round(b * 2.5).toLocaleString('th-TH');
      window.calculateQuote();
    });
  }

  window.calculateQuote = function() {
    if (!calcPackageSelect || !calcTotalFirstYear || !calcTotalRenewal) return;

    let firstYear = 0;
    let renewal = 0;

    switch (calcPackageSelect.value) {
      case 'basic':
        firstYear = 8900;
        renewal = 3000;
        break;
      case 'advance':
        firstYear = 15000;
        renewal = 5000;
        break;
      case 'ultra':
        firstYear = 25000;
        renewal = 8000;
        break;
      default:
        firstYear = 8900;
        renewal = 3000;
    }

    // Standard Add-ons
    if (calcAddonChatbot && calcAddonChatbot.checked) firstYear += 3500;
    if (calcAddonSeo && calcAddonSeo.checked) {
      firstYear += 4500;
      renewal += 1500;
    }
    if (calcAddonLogo && calcAddonLogo.checked) firstYear += 2500;

    // Custom Services: SEO (Month 1: 10,000 + Month 2-6: 7,500*5 + Month 7-12: 5,000*6 = 77,500 / year 1; year 2+ = 5,000*12 = 60,000)
    if (calcCustomSeo && calcCustomSeo.checked) {
      firstYear += 77500;
      renewal += 60000;
    }

    // Custom Services: Google AdWords (Year 1: 2.5x monthly budget * 12; Year 2+: 2.0x monthly budget * 12)
    if (calcCustomAdwords && calcCustomAdwords.checked) {
      const budget = (calcAdwordsBudgetSlider ? parseInt(calcAdwordsBudgetSlider.value, 10) : 10000) || 10000;
      const adwordsY1Annual = Math.round(budget * 2.5 * 12);
      const adwordsY2Annual = Math.round(budget * 2.0 * 12);
      firstYear += adwordsY1Annual;
      renewal += adwordsY2Annual;
    }

    calcTotalFirstYear.textContent = firstYear.toLocaleString('th-TH') + ' บาท';
    calcTotalRenewal.textContent = renewal.toLocaleString('th-TH') + ' บาท / ปีถัดไป';
  };

  if (calcPackageSelect) calcPackageSelect.addEventListener('change', window.calculateQuote);
  if (calcAddonChatbot) calcAddonChatbot.addEventListener('change', window.calculateQuote);
  if (calcAddonSeo) calcAddonSeo.addEventListener('change', window.calculateQuote);
  if (calcAddonLogo) calcAddonLogo.addEventListener('change', window.calculateQuote);
  if (calcCustomSeo) calcCustomSeo.addEventListener('change', window.calculateQuote);
  window.calculateQuote();

  // 10. Subtle Trendy Social Proof Notifications
  const socialProofMessages = [
    { title: 'เริ่มแคมเปญ SEO ติดหน้าแรก', desc: 'ธุรกิจส่งออกอาหาร เลือกบริการ Custom SEO เดือนแรก 10,000.-', time: '8 นาทีที่แล้ว' },
    { title: 'ปรึกษากลยุทธ์ LLM SEO & GEO', desc: 'สตาร์ทอัพเทคโนโลยี ปรับโครงสร้างข้อมูลติด AI Search & Perplexity', time: '12 นาทีที่แล้ว' },
    { title: 'จองแพ็กเกจ Advance สำเร็จ', desc: 'คลินิกความงาม ย่านสาทร เลือกติดตั้ง LINE OA Rich Menu & Google Maps', time: '18 นาทีที่แล้ว' },
    { title: 'ติดตั้ง Cloud Identity สำเร็จ', desc: 'องค์กรขนาดกลาง วางระบบ Single Sign-On (SSO) & Multi-Factor Auth', time: '25 นาทีที่แล้ว' },
    { title: 'ตั้งค่า Google Ads (2.5x) สำเร็จ', desc: 'แบรนด์สินค้าแม่และเด็ก เริ่มยิงโฆษณา Search & PMax', time: '34 นาทีที่แล้ว' },
    { title: 'ออกแบบระบบ AI Identity', desc: 'แบรนด์ค้าปลีกชั้นนำ กำหนด Brand Voice & AI Agent Persona สื่อสารลูกค้า 24 ชม.', time: '41 นาทีที่แล้ว' },
    { title: 'ยืนยันสิทธิ์ Google Maps สำเร็จ', desc: 'ร้านอาหาร ย่านสีลม ได้รับหมุด Verified บน Google Maps', time: '49 นาทีที่แล้ว' },
    { title: 'เริ่มโปรเจกต์ Digital Transformation', desc: 'ธุรกิจ B2B เริ่มปรับเปลี่ยนระบบสู่ Cloud Automation & AI Workflow', time: '58 นาทีที่แล้ว' },
    { title: 'ลงทะเบียน Lead & Opportunity', desc: 'บริษัทค้าปลีก B2B ลงทะเบียนสนใจระบบ Lead & Opportunity Pipeline', time: '1 ชั่วโมงที่แล้ว' },
    { title: 'ลงทะเบียน Task Automation', desc: 'บริษัทขนส่ง ลงทะเบียนสนใจระบบ Task Workflow Automation อัตโนมัติ', time: '1 ชั่วโมงที่แล้ว' },
    { title: 'ลงทะเบียน Youtube Automation', desc: 'ครีเอเตอร์สายการเงิน ลงทะเบียนสนใจระบบ AI Video Pipeline & SEO Tags', time: '1 ชั่วโมงที่แล้ว' },
    { title: 'ลงทะเบียน Social Automation', desc: 'แบรนด์แฟชั่น ลงทะเบียนสนใจระบบ Multi-Platform Auto Posting & Inbox Bot', time: '2 ชั่วโมงที่แล้ว' },
    { title: 'ลงทะเบียน SWOT Analysis', desc: 'แบรนด์อาหารเพื่อสุขภาพ ลงทะเบียนสนใจระบบ Competitor Analysis to SWOT', time: '2 ชั่วโมงที่แล้ว' },
    { title: 'ผ่านเกณฑ์ตรวจสอบ PDPA 100%', desc: 'ธุรกิจส่งออก B2B ติดตั้งระบบความยินยอมและ DSAR เรียบร้อย', time: '2 ชั่วโมงที่แล้ว' }
  ];

  let toastIdx = 0;
  function showLiveToast() {
    const existing = document.getElementById('social-proof-toast');
    if (existing) existing.remove();

    const data = socialProofMessages[toastIdx % socialProofMessages.length];
    toastIdx++;

    const toast = document.createElement('div');
    toast.id = 'social-proof-toast';
    toast.className = 'fixed bottom-24 left-6 z-30 max-w-sm bg-slate-900/90 border border-blue-500/30 text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-start space-x-3 transition-all duration-500 transform translate-y-10 opacity-0 hidden sm:flex';
    toast.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
        <i data-lucide="bell" class="w-4 h-4"></i>
      </div>
      <div class="text-xs">
        <div class="font-bold text-white flex items-center space-x-1.5">
          <span>${data.title}</span>
          <span class="text-[10px] text-slate-400 font-normal">&bull; ${data.time}</span>
        </div>
        <p class="text-slate-300 text-[11px] leading-tight mt-0.5">${data.desc}</p>
      </div>
    `;
    document.body.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    }, 50);

    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
      setTimeout(() => toast.remove(), 600);
    }, 5000);
  }

  // Trigger toast every 28 seconds
  setTimeout(() => {
    showLiveToast();
    setInterval(showLiveToast, 28000);
  }, 4000);

  // 11. Headquarter Location & Directions Calculator
  const locationText = document.getElementById('office-address-text');
  const locationCoords = document.getElementById('office-coords-text');
  const googleMapIframe = document.getElementById('google-map-iframe');
  const googleMapPreviewIframe = document.getElementById('google-map-preview-iframe');
  const googleMapDirectLink = document.getElementById('google-map-direct-link');
  const detectLocationBtn = document.getElementById('detect-location-btn');

  // Headquarter Empire Tower (Sky Tower Landmark), Sathorn Bangkok
  const officeLat = 13.7196;
  const officeLon = 100.5286;
  const officeAddress = 'อาคารเอ็มไพร์ทาวเวอร์ (Empire Tower) ถนนสาทรใต้ แขวงยานนาวา เขตสาทร กรุงเทพมหานคร 10120 (BTS ช่องนนทรี)';

  // Calculate distance in km using Haversine formula
  function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  }

  if (detectLocationBtn) {
    detectLocationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!navigator.geolocation) {
        window.open('https://www.google.com/maps/dir/?api=1&destination=Empire+Tower+Sathorn+Bangkok', '_blank');
        return;
      }

      detectLocationBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> กำลังคำนวณเส้นทาง...
      `;

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLat = pos.coords.latitude;
          const userLon = pos.coords.longitude;
          const distanceKm = calculateDistanceKm(userLat, userLon, officeLat, officeLon);

          detectLocationBtn.innerHTML = `<i data-lucide="navigation-2" class="w-4 h-4 mr-1 text-cyan-400"></i> คุณอยู่ห่างจากสำนักงาน ~${distanceKm} กม. (คลิกเปิดนำทาง)`;
          lucide.createIcons();

          // Open directions on Google Maps
          setTimeout(() => {
            window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=Empire+Tower+Sathorn+Bangkok&travelmode=driving`, '_blank');
          }, 800);
        },
        (err) => {
          console.warn('Geolocation unavailable, opening direct directions:', err);
          window.open('https://www.google.com/maps/dir/?api=1&destination=Empire+Tower+Sathorn+Bangkok', '_blank');
          detectLocationBtn.innerHTML = `<i data-lucide="map-pin" class="w-4 h-4 mr-1"></i> เปิดเส้นทางไป Empire Tower บน Google Maps`;
          lucide.createIcons();
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    });
  }
});
