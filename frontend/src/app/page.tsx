import Image from "next/image";
import { Metadata } from "next";
import { Layout } from "@/components/layout/home-layout";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Home - ${process.env.APPNAME}`,
  };
}

export default function Home() {
  return (
    <Layout>
      <div>hello, world!</div>
    </Layout>
  );
}
