import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Home as HomeIcon,
  KeyRound,
  Building2,
  Search,
  CheckCircle2,
} from "lucide-react";

import LatestProperties from "./LatestProperties";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-image"></div>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-label">
            <span></span>
            UYMA-UY REAL ESTATE
          </span>

          <h1>
            Yangi hayotingiz
            <br />
            <span>shu yerdan boshlanadi.</span>
          </h1>

          <p>
            Siz orzu qilgan uy, siz kutgan manzil.
            O‘zbekiston bo‘ylab ko‘chmas mulklarni oson toping.
          </p>

          <div className="hero-actions">
            <Link to="/properties" className="hero-button">
              <Search size={18} />
              Uylarni ko‘rish
              <ArrowUpRight size={18} />
            </Link>

            <Link to="/register" className="hero-secondary">
              E’lon joylash
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="hero-note">
            <CheckCircle2 size={17} />
            O‘zingizga mos uyni bir joydan toping
          </div>
        </div>

        <div className="hero-bottom">
          <span>01 — SIZNING YANGI MANZILINGIZ</span>
          <span>UYMA-UY © 2026</span>
        </div>
      </section>

      {/* YANGI E'LONLAR (real API) */}
      <LatestProperties />

      {/* SERVICES */}
      <section className="services-section">
        <div className="section-heading">
          <div>
            <span className="section-label">BIZNING XIZMATLAR</span>
            <h2>
              Sizga kerakli
              <br />
              <span>hamma narsa bir joyda.</span>
            </h2>
          </div>

          <p>
            Uy sotib olish, ijaraga olish yoki o‘z mulkingizni
            sotish — barchasi oson va qulay.
          </p>
        </div>

        <div className="service-grid">
          <Link to="/properties" className="service-card">
            <div className="service-icon">
              <HomeIcon size={25} />
            </div>

            <span className="service-number">01 / SOTIB OLISH</span>

            <h3>Orzuyingizdagi uy</h3>

            <p>
              Sizga mos narx va manzildagi uylarni kashf eting.
            </p>

            <div className="service-arrow">
              <ArrowUpRight size={21} />
            </div>
          </Link>

          <Link to="/properties" className="service-card">
            <div className="service-icon">
              <KeyRound size={25} />
            </div>

            <span className="service-number">02 / IJARA</span>

            <h3>Qulay ijara</h3>

            <p>
              Yashash uchun qulay va zamonaviy uylarni toping.
            </p>

            <div className="service-arrow">
              <ArrowUpRight size={21} />
            </div>
          </Link>

          <Link to="/register" className="service-card">
            <div className="service-icon">
              <Building2 size={25} />
            </div>

            <span className="service-number">03 / SOTISH</span>

            <h3>Mulkni sotish</h3>

            <p>
              Ko‘chmas mulkingizni platformamizda e’lon qiling.
            </p>

            <div className="service-arrow">
              <ArrowUpRight size={21} />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;