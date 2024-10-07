import LoginPage from "@/components/Login";
import SEOMetadata from "@/components/ui/SeoMetadata";
import Image from "next/image";


export default function Home() {
  return (
    <>
    <SEOMetadata
        title="Portfoliogg - Create Your Professional Portfolio"
        description="Portfoliogg is a user-friendly platform for creating and sharing professional portfolios. Showcase your skills, projects, and achievements with ease."
        canonicalUrl="https://www.portfoliogg.com/"
      />
      <LoginPage/>
    </>
  );
}
