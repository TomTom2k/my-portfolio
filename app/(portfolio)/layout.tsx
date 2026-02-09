import Header from "@/components/header";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import ThemeSwitch from "@/components/theme-switch";
import ThemeContextProvider from "@/context/theme-context";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Thanh Tin | Personal Portfolio",
  description: "Thanh Tin is a frontend developer with 2 years of experience.",
};

import BackToTop from "@/components/back-to-top";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 text-gray-950 relative pt-28 sm:pt-36 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="bg-[#fbe2e3] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263] animate-blob mix-blend-multiply filter opacity-70"></div>
      <div className="bg-[#dbd7fb] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394] animate-blob animation-delay-2000 mix-blend-multiply filter opacity-70"></div>

      {/* Additional Pastel Blobs for modern feel */}
      <div className="bg-[#fef9c3] absolute top-[20rem] -z-10 right-[-10rem] h-[25rem] w-[25rem] rounded-full blur-[8rem] dark:bg-[#854d0e] animate-blob animation-delay-4000 mix-blend-multiply filter opacity-60"></div>
      <div className="bg-[#dcfce7] absolute bottom-[10rem] -z-10 left-[-10rem] h-[30rem] w-[30rem] rounded-full blur-[10rem] dark:bg-[#14532d] animate-blob animation-delay-2000 mix-blend-multiply filter opacity-60"></div>

      <ThemeContextProvider>
        <ActiveSectionContextProvider>
          <Header />
          {children}
          <Footer />

          <Toaster position="top-right" />
          <ThemeSwitch />
          <BackToTop />
        </ActiveSectionContextProvider>
      </ThemeContextProvider>
    </div>
  );
}
