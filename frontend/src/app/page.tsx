import Image from "next/image";
import { Metadata } from "next";
import { Layout } from "@/components/landing-page-components/landing-home-layout";
import Hero from "@/components/landing-page-components/hero";
import ReactLenis from "lenis/react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Home - ${process.env.APPNAME}`,
  };
}



export default function Home() {
  return (
    <Layout>
      <ReactLenis root />
        <Hero />
        <section className="h-screen">
          <div className="h-full flex items-center justify-center">
            <h1 className="text-4xl font-bold">Louiegie Monkey ong</h1>
          </div>
        </section>
        <section className="h-screen">
          <div className="h-full flex items-center justify-center">
            <h1 className="text-4xl font-bold">Explore our features</h1>
          </div>
        </section>
        <section className="h-screen">
          <div className="h-full flex items-center justify-center">
            <h1 className="text-4xl font-bold">Join us today!</h1>
          </div>
        </section>
    </Layout>
  );
}
