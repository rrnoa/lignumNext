import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <header className="header">
        <Link href="/">
          <Image
            src="/lignum-logo.svg"
            width={120}
            height={120}
            alt="Logo Lignum"
          />
        </Link>
        <Link className="button button--cart" href="/">
          <Image
            src="/icons/shopping-cart.svg"
            width={24}
            height={24}
            alt="Shopping Cart"
          />
          <span>Cart</span>
        </Link>
      </header>
      <section className="home">
        <article className="article--header">
          <video
            aria-hidden="true"
            playsInline=""
            autoPlay=""
            loop=""
            poster="https://starlink.ua/media/mod_starlink/snapshot.png"
          >
            <source
              src="//starlink.ua/media/mod_starlink/car-blur.webm"
              type="video/webm"
            />
            <source
              src="//starlink.ua/media/mod_starlink/car-blur.mp4"
              type="video/mp4"
            />
          </video>
          <div className="wrapper-md">
            <div className="row">
              <div className="col-12 text-center">
                <h1 className="h2">Introducing LignumBLOCKS 3D</h1>
                <h4>Revolutionize Your Design Experience</h4>
                <h5>
                  Unlock new dimensions in interior design with customizable 3D
                  models & artisan-crafted wooden panels.
                </h5>
                <div className="article--header__butons">
                  <Link className="button button--brand" href="/upload">
                    Experience LignumBLOCKS
                  </Link>
                  <Link className="button button--secondary" href="/upload">
                    Discover the LignumBLOCKS Difference
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
        <article className="article--lignum-blocks">
          <div className="wrapper-md">
            <div className="row">
              <div className="col-12">
                <h3 className="bold text-brand">LignumBLOCKS</h3>
                <h5 className="mb-d1-2 mb-x2-md">
                  Bringing Acoustic Design to Digital & Physical Realms
                </h5>
                <p className="mb-x4-md">
                  In the bustling sphere of modern interior design and
                  architecture, every detail counts, and every second is
                  invaluable. At LignumBLOCKS, we don`t just provide a tool; we
                  present a transformative dual experience
                </p>
                <div className="box">
                  <h5>Physical Aristry</h5>
                  <p>
                    Beyond the screen, we bring your digital design to life,
                    delivering a tangible wooden block panel that mirrors your
                    virtual creation. Precise, color-matched, and authentic,
                    it`s acoustic artistry manifested.
                  </p>
                </div>
                <div className="box">
                  <h5>Digital Customization</h5>
                  <p>
                    From any image or illustration, craft a 3D wooden block
                    model ready for top design software like 3ds Max, Unreal
                    Engine, and Blender. Ideal for VR walkthroughs and immersive
                    showcases.
                  </p>
                </div>
                <div className="hidden block-md">
                  <h5 className="mt-x3 mb-d2">Personalize with precision</h5>
                  <p>
                    Transform your client`s chosen image, photo, or illustration
                    into a pixelated wooden block panel. Each block is
                    accurately color-matched to the image, ensuring the final
                    artwork stays authentic.
                  </p>
                </div>
                <div className="row mb mb-x3-md">
                  <div className="col-12 col-offset-2-md col-8-md">
                    <p className="mt mb-d2 bold text-left">Original image</p>
                    <Image
                      src="/home/example-1.png"
                      width={450}
                      height={450}
                      className="img--blocks"
                      alt="Lignum example 1"
                    />
                  </div>
                </div>
                <h5 className="mt mt-x3 mb-d2">Real-Time 3D Preview</h5>
                <p>
                  Envision your design live, eliminating guesswork and
                  expediting client feedback
                </p>
                <div className="row mt-x2 mt-x3 mb-x2 mb-x4-md">
                  <div className="col-12 col-offset-2-md col-8-md">
                    <Image
                      src="/home/example-2.png"
                      width={450}
                      height={450}
                      className="img--blocks"
                      alt="Lignum example 2"
                    />
                  </div>
                </div>
                <h5 className="mb">Instant Cost Calculation</h5>
                <div className="flex middle mb-x2">
                  <Image
                    src="/home/icon-dollar.svg"
                    className="mr-d1-2 mr-x1-2-md icon--home"
                    width={64}
                    height={64}
                    alt="Dollar"
                  />
                  <p>
                    Gain immediate clarity on your project`s budget without the
                    traditional quote wait times
                  </p>
                </div>
                <h5 className="mb">Efficiency Amplified</h5>
                <div className="flex middle mb-x6">
                  <Image
                    src="/home/icon-time.svg"
                    className="mr-d1-2 mr-x1-2-md icon--home"
                    width={64}
                    height={64}
                    alt="Time"
                  />
                  <p>
                    Sidestep the prolonged delays in seeking specialized
                    craftsmen. Instant visualization meets immediate quotation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
        <article className="article--footer">
          <div className="wrapper-md">
            <div className="pt-x1-2 pt-x5-md">
              <h3 className="mb-x1-2 text-brand bold">
                With LignumBLOCKS, you`re not just getting a product but an
                avant-garde design experience
              </h3>
              <h5 className="mb-x2 mb-x5">
                Amplify your pitches, thrill clients promptly, and position
                yourself at the vanguard of acoustic and digital design fusion.
              </h5>
              <div className="text-center">
                <Link className="button button--brand" href="/upload">
                  Experience LignumBLOCKS
                </Link>
              </div>
            </div>
          </div>
          <div className="wrapper-lg pt-x6">
            <div className="row article--footer__info">
              <div className="col-12 col-6-md">
                <h6>The One-Stop-Shop For All Your Custom</h6>
                <h6 className="mb">Woodwork Needs.</h6>
                <p>
                  Founded 13 years ago, our crew has more than 50 years of
                  combined experience working for clients like Hilton, Marriot,
                  and Ritz Carlton, and many Hotels, Bars, and Restaurants in
                  the USA.
                </p>
              </div>
              <div className="col-12 col-offset-2-md col-4-md">
                <p>Lignum Custom Design Co.</p>
                <p>8211 NW 74th Design Co.</p>
                <p>info@lignumcd.com</p>
                <p>786 - 472 - 1833</p>
                <div className="separator">&nbsp;</div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
