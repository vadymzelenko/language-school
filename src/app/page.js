import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Departures from '@/components/Departures';
import Statement from '@/components/Statement';
import Compare from '@/components/Compare';
import Baggage from '@/components/Baggage';
import Route from '@/components/Route';
import BoardingPass from '@/components/BoardingPass';
import Pricing from '@/components/Pricing';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import MobileBar from '@/components/MobileBar';

export default function Home() {
  return (
    <>
      <Header />
      <main id="top" className="page">
        <Hero />
        <Marquee />
        <Departures />
        <Statement />
        <Compare />
        <Baggage />
        <Route />
        <BoardingPass />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
