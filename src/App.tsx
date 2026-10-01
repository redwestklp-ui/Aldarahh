/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext.tsx';
import { MenuItem } from './types/index.ts';

// Components
import { Navbar } from './components/Navbar.tsx';
import { TableBanner } from './components/TableBanner.tsx';
import { Hero } from './components/Hero.tsx';
import { OrderModeCards } from './components/OrderModeCards.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { TannourSpotlight } from './components/TannourSpotlight.tsx';
import { Highlights } from './components/Highlights.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { LocationSection } from './components/LocationSection.tsx';
import { Footer } from './components/Footer.tsx';

// Interactive Modals & Drawers
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderSuccessModal } from './components/OrderSuccessModal.tsx';
import { OrderTrackingModal } from './components/OrderTrackingModal.tsx';
import { TablePINModal } from './components/TablePINModal.tsx';
import { RestaurantPhotoModal } from './components/RestaurantPhotoModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { StickyMobileBar } from './components/StickyMobileBar.tsx';

function MainApp() {
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Table PIN Modal state
  const [pinModalTableNumber, setPinModalTableNumber] = useState<number | null>(null);

  const { isCartOpen, setIsCartOpen } = useRestaurant();

  // URL Table simulation detector (e.g. if URL is #table-7 or ?table=7)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam && !isNaN(Number(tableParam))) {
      setPinModalTableNumber(Number(tableParam));
    }
  }, []);

  const handleOpenPINModal = (tableNo: number) => {
    setPinModalTableNumber(tableNo);
  };

  const handleOpenTrackingForOrder = (orderId: string) => {
    setTrackingOrderId(orderId);
    setIsTrackingModalOpen(true);
  };

  const isAnyModalActive = 
    selectedProduct !== null ||
    isCartOpen ||
    isCheckoutOpen ||
    successOrderId !== null ||
    isTrackingModalOpen ||
    isPhotoModalOpen ||
    isAdminOpen ||
    pinModalTableNumber !== null;

  // Centralized body scroll lock management
  useEffect(() => {
    if (isAnyModalActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyModalActive]);

  // Global Escape key listener for customer-facing modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (pinModalTableNumber !== null) {
          setPinModalTableNumber(null);
        } else if (selectedProduct !== null) {
          setSelectedProduct(null);
        } else if (isPhotoModalOpen) {
          setIsPhotoModalOpen(false);
        } else if (isCheckoutOpen) {
          setIsCheckoutOpen(false);
        } else if (isTrackingModalOpen) {
          setIsTrackingModalOpen(false);
        } else if (successOrderId !== null) {
          setSuccessOrderId(null);
        } else if (isCartOpen) {
          setIsCartOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    pinModalTableNumber,
    selectedProduct,
    isPhotoModalOpen,
    isCheckoutOpen,
    isTrackingModalOpen,
    successOrderId,
    isCartOpen,
    setIsCartOpen,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F2EC] text-[#1A120D] font-arabic antialiased selection:bg-amber-500/20 selection:text-amber-950">
      
      {/* 1. Header with Cart & Admin trigger */}
      <Navbar
        onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 2. Active Table Session Banner (if seated inside restaurant) */}
      <TableBanner onOpenPINModal={handleOpenPINModal} />

      {/* Main Content Sections */}
      <main className="flex-1 pb-16 lg:pb-0">
        
        {/* 3. Hero Section */}
        <Hero />

        {/* 4. 3 Clear Order Cards (Dine-in / Takeaway / Delivery) */}
        <OrderModeCards
          onOpenPINModal={handleOpenPINModal}
          onTableGuideClick={() => handleOpenPINModal(1)}
        />

        {/* 5. Food Menu with Search, Categories, and Item Customizer */}
        <MenuSection
          onSelectDish={(item) => setSelectedProduct(item)}
        />

        {/* 6. Tannour Oven Fish Spotlight */}
        <TannourSpotlight
          onCustomizeItem={(item) => setSelectedProduct(item)}
        />

        {/* 7. Highlights */}
        <Highlights />

        {/* 8. Dining Services */}
        <ServicesSection />

        {/* 9. Reviews & Ratings */}
        <ReviewsSection />

        {/* 10. Location & Interactive Map */}
        <LocationSection />

      </main>

      {/* Footer */}
      <Footer 
        onOpenPhotoModal={() => setIsPhotoModalOpen(true)} 
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Product Customizer Modal */}
      <ProductDetailModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={(ordId) => setSuccessOrderId(ordId)}
        onOpenPINModal={handleOpenPINModal}
      />

      {/* Order Success Receipt Modal */}
      <OrderSuccessModal
        orderId={successOrderId}
        onClose={() => setSuccessOrderId(null)}
        onTrackOrder={(ordId) => handleOpenTrackingForOrder(ordId)}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        initialOrderId={trackingOrderId || undefined}
        onClose={() => {
          setIsTrackingModalOpen(false);
          setTrackingOrderId(null);
        }}
      />

      {/* Table PIN Verification Modal */}
      <TablePINModal
        isOpen={pinModalTableNumber !== null}
        targetTableNumber={pinModalTableNumber || 1}
        onClose={() => setPinModalTableNumber(null)}
        onSuccess={() => {
          const menuEl = document.getElementById('menu');
          menuEl?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Restaurant Photo Lightbox */}
      <RestaurantPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />

      {/* Admin Operations & Tables Management Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onSimulateTable={(tableNo) => handleOpenPINModal(tableNo)}
      />

      {/* Sticky Bottom Navigation on Mobile (Hides when any modal/cart is active) */}
      <StickyMobileBar
        hidden={isAnyModalActive}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
      />

    </div>
  );
}

export default function App() {
  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.title = 'فوال وشعبيات شعاع الدره | منصة الطلبات الذكية في عفيف';
  }, []);

  return (
    <RestaurantProvider>
      <MainApp />
    </RestaurantProvider>
  );
}
