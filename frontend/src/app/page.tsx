import Image from "next/image";
import { Metadata } from "next";
import { Layout } from "@/components/landing-page-components/landing-home-layout";
import Hero from "@/components/landing-page-components/hero";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Home - ${process.env.APPNAME}`,
  };
}

export default function Home() {
  return (
    <Layout>
      <Hero></Hero>
    </Layout>
  );
}
