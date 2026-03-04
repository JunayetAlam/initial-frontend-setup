import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overlanding outpost",
  description: "Buy sell explore",
};
import Container from "@/components/Global/Container";
import Navbar from "@/components/Global/Navbar";
import Footer from "@/components/Global/Footer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Container className="w-full md:px-10 pt-24 lg:pt-40 min-h-[70vh] pb-20 flex justify-center items-center">
        <div className="flex justify-center items-center flex-col gap-5  min-h-full w-full">
          {children}
        </div>
      </Container>
      <Footer />
    </>
  );
}
