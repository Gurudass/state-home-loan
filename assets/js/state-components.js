/**
 * State Home Loan Centre - Single Reusable Header & Footer JS Component
 * Renders consistent header, navigation, sticky header, footer, mobile drawer,
 * search popup, and interactive review modal dialog across all site pages.
 * 
 * Supports both:
 *   <site-header></site-header>  or  <div id="site-header"></div>
 *   <site-footer></site-footer>  or  <div id="site-footer"></div>
 */

(function () {
    "use strict";

    function getHeaderHTML() {
        return `
        <header class="main-header">
            <div class="topbar">
                <div class="container">
                    <div class="topbar__left">
                        <div class="topbar__social">
                            <a href="https://www.linkedin.com/in/ashwanipande?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" class="fab fa-linkedin-in" aria-label="LinkedIn"></a>
                            <a href="#" class="fab fa-facebook-square" aria-label="Facebook"></a>
                            <a href="#" class="fab fa-instagram" aria-label="Instagram"></a>
                        </div>
                        <a href="about.html">About Us</a>
                        <a href="news.html">Market Insights</a>
                        <a href="contact.html">Barangaroo Office</a>
                    </div>
                    <div class="topbar__right">
                        <a href="mailto:enquiries@statehomeloans.com.au"><i class="pylon-icon-email1"></i> enquiries@statehomeloans.com.au</a>
                        <span class="topbar__sep">|</span>
                        <a href="tel:+61434436099"><i class="pylon-icon-telephone"></i> +61 434 436 099</a>
                    </div>
                </div>
            </div>

            <nav class="main-menu">
                <div class="container">
                    <div class="logo-box">
                        <a href="index.html" class="shl-brand-logo" aria-label="State Home Loan Centre home">
                            <img src="assets/images/218034243_124294506551687_6328577765282027099_n.jpg" alt="State Home Loan Centre Logo" class="shl-logo-img">
                            <div class="shl-brand-text">
                                <span class="shl-brand-title">State Home Loan</span>
                                <span class="shl-brand-sub">Barangaroo · Sydney</span>
                            </div>
                        </a>
                        <span class="fa fa-bars mobile-nav__toggler"></span>
                    </div>

                    <ul class="main-menu__list">
                        <li data-nav="home">
                            <a href="index.html">Home</a>
                        </li>
                        <li data-nav="about">
                            <a href="about.html">About Us</a>
                        </li>
                        <li data-nav="services">
                            <a href="services.html">Services</a>
                        </li>
                        <li data-nav="team">
                            <a href="team.html">Our Team</a>
                        </li>
                        <li class="dropdown" data-nav="news">
                            <a href="news.html">Blog</a>
                            <ul>
                                <li><a href="news.html">Blog (Coming Soon)</a></li>
                                <li><a href="faq.html">FAQs</a></li>
                            </ul>
                        </li>
                        <li data-nav="calculator">
                            <a href="loan-calculator.html">Calculator</a>
                        </li>
                        <li data-nav="contact">
                            <a href="contact.html">Contact Us</a>
                        </li>
                    </ul>

                    <div class="main-header__info">
                        <div class="main-header__info-phone">
                            <i class="pylon-icon-tech-support"></i>
                            <div class="main-header__info-phone-content">
                                <span>Speak with a Broker</span>
                                <h3><a href="tel:+61434436099">+61 434 436 099</a></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        <div class="stricky-header stricked-menu main-menu">
            <div class="sticky-header__content"></div>
        </div>
        `;
    }

    function getFooterHTML() {
        return `
        <!-- Main Footer -->
        <footer class="site-footer">
            <div class="container">
                <div class="row justify-content-between">
                    <div class="col-lg-3 col-sm-6">
                        <div class="footer-widget footer-widget__about">
                            <a href="index.html" class="shl-brand-logo mb-20" aria-label="State Home Loan Centre">
                                <img src="assets/images/218034243_124294506551687_6328577765282027099_n.jpg" alt="State Home Loan Centre Logo" class="shl-logo-img">
                                <div class="shl-brand-text">
                                    <span class="shl-brand-title">State Home Loan</span>
                                    <span class="shl-brand-sub">Barangaroo · Sydney</span>
                                </div>
                            </a>
                            <p>Personalised financial solutions and expert mortgage guidance under one roof. Barangaroo, New South Wales.</p>
                            <div class="footer-widget__about-phone">
                                <i class="pylon-icon-tech-support"></i>
                                <div class="footer-widget__about-phone-content">
                                    <span>Direct Office Line</span>
                                    <h3><a href="tel:+61434436099">+61 434 436 099</a></h3>
                                </div>
                            </div>
                            <div class="footer-widget__social">
                                <a href="https://www.linkedin.com/in/ashwanipande?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" class="fab fa-linkedin-in" aria-label="LinkedIn"></a>
                                <a href="#" class="fab fa-facebook-f" aria-label="Facebook"></a>
                                <a href="#" class="fab fa-instagram" aria-label="Instagram"></a>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-2 col-sm-6">
                        <div class="footer-widget footer-widget__link">
                            <h3 class="footer-widget__title">Quick Links</h3>
                            <ul class="list-unstyled footer-widget__link-list">
                                <li><a href="index.html"><i class="fa fa-arrow-right"></i>Home</a></li>
                                <li><a href="about.html"><i class="fa fa-arrow-right"></i>About Us</a></li>
                                <li><a href="services.html"><i class="fa fa-arrow-right"></i>Lending Services</a></li>
                                <li><a href="team.html"><i class="fa fa-arrow-right"></i>Our Team</a></li>
                                <li><a href="loan-calculator.html"><i class="fa fa-arrow-right"></i>Repayment Calculator</a></li>
                                <li><a href="news.html"><i class="fa fa-arrow-right"></i>Blog (Coming Soon)</a></li>
                                <li><a href="faq.html"><i class="fa fa-arrow-right"></i>FAQs</a></li>
                                <li><a href="contact.html"><i class="fa fa-arrow-right"></i>Contact Us</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-lg-3 col-sm-6">
                        <div class="footer-widget footer-widget__link">
                            <h3 class="footer-widget__title">Lending Services</h3>
                            <ul class="list-unstyled footer-widget__link-list">
                                <li><a href="services.html"><i class="fa fa-arrow-right"></i>Residential Home Loans</a></li>
                                <li><a href="services.html"><i class="fa fa-arrow-right"></i>Mortgage Refinancing</a></li>
                                <li><a href="services.html"><i class="fa fa-arrow-right"></i>Property Investment Loans</a></li>
                                <li><a href="services.html"><i class="fa fa-arrow-right"></i>SMSF Lending &amp; LRBA</a></li>
                                <li><a href="services.html"><i class="fa fa-arrow-right"></i>Commercial &amp; Business</a></li>
                                <li><a href="services.html"><i class="fa fa-arrow-right"></i>Car &amp; Asset Finance</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-lg-4 col-sm-6">
                        <div class="footer-widget footer-widget__contact">
                            <h3>Barangaroo Office</h3>
                            <ul class="list-unstyled footer-widget__contact-list">
                                <li>
                                    <a href="mailto:enquiries@statehomeloans.com.au"><i class="pylon-icon-email1"></i>enquiries@statehomeloans.com.au</a>
                                </li>
                                <li>
                                    <a href="#"><i class="pylon-icon-clock2"></i>Mon - Fri 8:00 AM - 6:30 PM</a>
                                </li>
                                <li>
                                    <a href="contact.html#map"><i class="pylon-icon-pin1"></i>L24, Three International Towers, 300 Barangaroo, Sydney, NSW, Australia, New South Wales</a>
                                </li>
                            </ul>
                            <div style="margin-top:16px;">
                                <button class="thm-btn shl-btn-gold" type="button" data-book style="padding:10px 18px;font-size:14px;border-radius:6px;">Book Free Review</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

        <!-- Bottom Copyright Footer -->
        <div class="bottom-footer">
            <div class="container">
                <p>&copy; 2026 State Home Loan Centre Pty Ltd. All Rights Reserved. ACR 512 890 | Australian Credit Licence #389328. This website provides general information only and does not take into account your individual circumstances. Terms, conditions, fees and lending criteria apply.</p>
            </div>
        </div>

        <!-- Mobile Navigation Drawer -->
        <div class="mobile-nav__wrapper">
            <div class="mobile-nav__overlay mobile-nav__toggler"></div>
            <div class="mobile-nav__content">
                <span class="mobile-nav__close mobile-nav__toggler"></span>
                <div class="logo-box mb-20">
                    <a href="index.html" class="shl-brand-logo" aria-label="State Home Loan Centre">
                        <img src="assets/images/218034243_124294506551687_6328577765282027099_n.jpg" alt="State Home Loan Centre Logo" class="shl-logo-img">
                        <div class="shl-brand-text">
                            <span class="shl-brand-title">State Home Loan</span>
                            <span class="shl-brand-sub">Barangaroo · Sydney</span>
                        </div>
                    </a>
                </div>
                <div class="mobile-nav__container"></div>
                <ul class="mobile-nav__contact list-unstyled">
                    <li>
                        <i class="pylon-icon-email1"></i>
                        <a href="mailto:enquiries@statehomeloans.com.au">enquiries@statehomeloans.com.au</a>
                    </li>
                    <li>
                        <i class="pylon-icon-telephone"></i>
                        <a href="tel:+61434436099">+61 434 436 099</a>
                    </li>
                </ul>
                <div style="margin-top:20px;">
                    <button class="thm-btn shl-btn-gold" type="button" data-book style="width:100%;border-radius:6px;padding:12px;">Book Free Review</button>
                </div>
            </div>
        </div>

        <!-- Scroll To Top Anchor -->
        <a href="#" data-target="html" class="scroll-to-target scroll-to-top"><i class="fa fa-angle-up"></i></a>

        <!-- Interactive 60-Second Review Dialog -->
        <dialog id="quiz" class="shl-quiz" aria-label="Book a Free Review"></dialog>
        `;
    }

    function highlightActiveNav(container) {
        if (!container) return;
        const currentPath = window.location.pathname.toLowerCase();
        let pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
        if (pageName === '') pageName = 'index.html';

        const navItems = container.querySelectorAll('.main-menu__list > li[data-nav]');
        navItems.forEach(li => {
            li.classList.remove('current');
            const navKey = li.getAttribute('data-nav');
            
            if (navKey === 'home' && (pageName === 'index.html' || pageName === 'index-2.html')) {
                li.classList.add('current');
            } else if (navKey === 'about' && pageName === 'about.html') {
                li.classList.add('current');
            } else if (navKey === 'services' && (pageName === 'services.html' || pageName === 'service-details.html')) {
                li.classList.add('current');
            } else if (navKey === 'team' && (pageName === 'team.html' || pageName === 'team-details.html')) {
                li.classList.add('current');
            } else if (navKey === 'news' && (pageName === 'news.html' || pageName === 'news-details.html' || pageName === 'faq.html')) {
                li.classList.add('current');
            } else if (navKey === 'calculator' && pageName === 'loan-calculator.html') {
                li.classList.add('current');
            } else if (navKey === 'contact' && pageName === 'contact.html') {
                li.classList.add('current');
            }
        });

        // Also check direct link match
        const allLinks = container.querySelectorAll('.main-menu__list a');
        allLinks.forEach(a => {
            const href = (a.getAttribute('href') || '').toLowerCase();
            if (href === pageName) {
                const parentLi = a.closest('li');
                if (parentLi) {
                    parentLi.classList.add('current');
                    const topLi = a.closest('.main-menu__list > li');
                    if (topLi) topLi.classList.add('current');
                }
            }
        });
    }

    function initHeader(el) {
        if (!el || el.dataset.rendered === 'true') return;
        el.innerHTML = getHeaderHTML();
        el.dataset.rendered = 'true';
        highlightActiveNav(el);

        // Pre-populate sticky header content if element exists
        const mainMenu = el.querySelector('.main-menu');
        const stickyContent = el.querySelector('.sticky-header__content');
        if (mainMenu && stickyContent) {
            stickyContent.innerHTML = mainMenu.innerHTML;
        }
    }

    function initFooter(el) {
        if (!el || el.dataset.rendered === 'true') return;
        el.innerHTML = getFooterHTML();
        el.dataset.rendered = 'true';

        // Pre-populate mobile nav container if header is available
        const mainNav = document.querySelector('.main-menu');
        const mobileContainer = el.querySelector('.mobile-nav__container');
        if (mainNav && mobileContainer && !mobileContainer.innerHTML.trim()) {
            mobileContainer.innerHTML = mainNav.innerHTML;
        }
    }

    // Define Custom Elements for modern, clean declarative HTML: <site-header></site-header> & <site-footer></site-footer>
    if (typeof customElements !== 'undefined') {
        if (!customElements.get('site-header')) {
            customElements.define('site-header', class extends HTMLElement {
                connectedCallback() {
                    initHeader(this);
                }
            });
        }
        if (!customElements.get('site-footer')) {
            customElements.define('site-footer', class extends HTMLElement {
                connectedCallback() {
                    initFooter(this);
                }
            });
        }
    }

    // Also support standard <div id="site-header"> and <div id="site-footer">
    function renderAllComponents() {
        document.querySelectorAll('site-header, #site-header').forEach(initHeader);
        document.querySelectorAll('site-footer, #site-footer').forEach(initFooter);

        // Ensure mobile nav container gets the menu
        const mainNav = document.querySelector('.main-menu');
        const mobileContainer = document.querySelector('.mobile-nav__container');
        if (mainNav && mobileContainer && !mobileContainer.innerHTML.trim()) {
            mobileContainer.innerHTML = mainNav.innerHTML;
        }
    }

    // Global delegated event listeners for Mobile Nav and Search Toggler so they work reliably everywhere
    document.addEventListener('click', function (e) {
        // Mobile menu toggle
        if (e.target.closest('.mobile-nav__toggler')) {
            e.preventDefault();
            const wrapper = document.querySelector('.mobile-nav__wrapper');
            if (wrapper) wrapper.classList.toggle('expanded');
        }



        // Scroll to top
        if (e.target.closest('.scroll-to-top')) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Run immediately when parsed
    renderAllComponents();

    // Also ensure on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderAllComponents);
    }

    // Expose for manual invocation if needed
    window.StateComponents = {
        renderHeader: initHeader,
        renderFooter: initFooter,
        renderAll: renderAllComponents
    };
})();
