// Cookie Banner Management Script
(function() {
    'use strict';
    
    const COOKIE_NAME = 'cookieConsent';
    const COOKIE_EXPIRY_DAYS = 7;
    const BANNER_SELECTOR = '.c-cookies';
    const BUTTON_SELECTOR = '.c-btn';
    const ACTIVE_CLASS = 'is-active';
    
    // Utility functions for cookie management
    const cookieUtils = {
        set: function(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
        },
        
        get: function(name) {
            const nameEQ = name + "=";
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i];
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1, cookie.length);
                }
                if (cookie.indexOf(nameEQ) === 0) {
                    return cookie.substring(nameEQ.length, cookie.length);
                }
            }
            return null;
        },
        
        delete: function(name) {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    };
    
    // Cookie management functions
    const cookieManager = {
        clearAllCookies: function() {
            // Get all cookies
            const cookies = document.cookie.split(";");
            
            // Clear each cookie (except our consent cookie)
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                
                // Don't delete our consent tracking cookie
                if (name !== COOKIE_NAME) {
                    cookieUtils.delete(name);
                    // Also try deleting with different path and domain combinations
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + window.location.hostname;
                }
            }
            

        }
    };
    
    // Main banner controller
    const cookieBanner = {
        banner: null,
        buttons: null,
        
        init: function() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.setup.bind(this));
            } else {
                this.setup();
            }
        },
        
        setup: function() {
            this.banner = document.querySelector(BANNER_SELECTOR);
            
            if (!this.banner) {
                console.warn('Cookie banner element not found:', BANNER_SELECTOR);
                return;
            }
            
            this.buttons = this.banner.querySelectorAll(BUTTON_SELECTOR);
            
            if (this.buttons.length < 2) {
                console.warn('Expected at least 2 buttons in cookie banner, found:', this.buttons.length);
                return;
            }
            
            this.bindEvents();
            this.checkConsent();
        },
        
        bindEvents: function() {
            // Accept button (first button)
            this.buttons[0].addEventListener('click', this.handleAccept.bind(this));
            
            // Reject button (second button)
            this.buttons[1].addEventListener('click', this.handleReject.bind(this));
        },
        
        checkConsent: function() {
            const consent = cookieUtils.get(COOKIE_NAME);
            
            if (!consent) {
                // No consent recorded, show banner
                this.showBanner();
            } else {
                // Consent exists, keep banner hidden
                this.hideBanner();
                

            }
        },
        
        showBanner: function() {
            if (this.banner) {
                this.banner.classList.add(ACTIVE_CLASS);
            }
        },
        
        hideBanner: function() {
            if (this.banner) {
                this.banner.classList.remove(ACTIVE_CLASS);
            }
        },
        
        handleAccept: function(e) {
            e.preventDefault();
            
            // Save acceptance
            cookieUtils.set(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
            
            // Hide banner
            this.hideBanner();
            

            
            // Trigger custom event for other scripts to listen to
            this.dispatchConsentEvent('accepted');
        },
        
        handleReject: function(e) {
            e.preventDefault();
            
            // Save rejection
            cookieUtils.set(COOKIE_NAME, 'rejected', COOKIE_EXPIRY_DAYS);
            
            // Clear existing cookies
            cookieManager.clearAllCookies();
            
            // Hide banner
            this.hideBanner();
            

            
            // Trigger custom event for other scripts to listen to
            this.dispatchConsentEvent('rejected');
        },
        
        dispatchConsentEvent: function(status) {
            // Dispatch custom event that other scripts can listen to
            const event = new CustomEvent('cookieConsent', {
                detail: {
                    status: status,
                    timestamp: new Date().toISOString()
                }
            });
            
            document.dispatchEvent(event);
        }
    };
    
    // Public API for manual control (optional)
    window.CookieBanner = {
        show: function() {
            cookieBanner.showBanner();
        },
        hide: function() {
            cookieBanner.hideBanner();
        },
        reset: function() {
            cookieUtils.delete(COOKIE_NAME);
            cookieBanner.showBanner();
        },
        getStatus: function() {
            return cookieUtils.get(COOKIE_NAME);
        }
    };
    
    // Initialize the banner
    cookieBanner.init();
    
    // Optional: Listen for consent events
    document.addEventListener('cookieConsent', function(e) {
        // You can add additional logic here based on consent status
        if (e.detail.status === 'accepted') {
            // Enable analytics, tracking, etc.
        } else if (e.detail.status === 'rejected') {
            // Disable analytics, tracking, etc.
        }
    });
    
})();