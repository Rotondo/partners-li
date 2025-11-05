import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileMenuButton } from "@/components/layout/MobileMenuButton";
import { PartnersOverview } from "@/components/partners/PartnersOverview";

const Partners = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <MobileMenuButton 
        onClick={() => setMobileMenuOpen(true)} 
        isOpen={mobileMenuOpen} 
      />
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="flex-1 overflow-y-auto pl-0 md:pl-0">
        <div className="container mx-auto p-8">
          <PartnersOverview />
        </div>
      </main>
    </div>
  );
};

export default Partners;
