import LoginPage from "@/components/Login";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import SEOMetadata from "@/components/ui/SeoMetadata";


export default function Login() {
  return (
    <>
    <SEOMetadata
        title="Portfoliogg - Create Your Professional Portfolio"
        description="Portfoliogg is a user-friendly platform for creating and sharing professional portfolios. Showcase your skills, projects, and achievements with ease."
        canonicalUrl="https://www.portfoliogg.com/"
      />
      <Header/>
        <LoginPage/>
      <Footer/>
    </>
  );
}
