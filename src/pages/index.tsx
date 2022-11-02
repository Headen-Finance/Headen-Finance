import dynamic from "next/dynamic";
import Image from "next/image";
import Background from "public/images/landing/landing_bg.png";
import React from "react";
import { MdOutlineBuild } from "react-icons/md";

import LandingLayout from "@/components/layout/LandingLayout";
import NextImage from "@/components/NextImage";
import Seo from "@/components/Seo";

const ParticlesBackground = dynamic(
  () => import("@/components/ParticlesBackground"),
  {
    suspense: true,
  }
);

export default function LandingPage() {
  return (
    <LandingLayout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <main className="flex flex-col  justify-center text-white">
        <MainSection />
        <InfoSection />
        <MarketsSection />
        <CommunitySection />
        <InvestorsSection />
      </main>
    </LandingLayout>
  );
}

function MainSection() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center bg-black bg-cover bg-center">
      <NextImage
        fill={true}
        imgClassName="object-cover"
        className="absolute inset-0 object-cover"
        alt="Headen Finance Background"
        src={Background}
      />
      <React.Suspense fallback="nothing">
        <ParticlesBackground />
      </React.Suspense>

      <div className="z-10 mx-12 flex w-full max-w-7xl flex-col items-center">
        <h1 className="text-center font-normal font-medium leading-normal  md:text-3xl lg:text-4xl xl:text-5xl">
          Stake NFTs, Liquidity tokens as collateral, and borrow without needing
          70% of total staked value.
        </h1>
        <h3 className="mt-24 max-w-xl text-center font-normal font-medium md:text-lg lg:text-xl xl:text-2xl">
          <span className="text-secondary">$789,982,343</span> of liquidity is
          located in Headen.Finance with over{" "}
          <span className="text-secondary">2</span> networks
        </h3>
      </div>
    </section>
  );
}

function InfoSection() {
  return (
    <section className=" flex justify-center bg-gradient-to-r from-[#CDEDF7] to-[#FFFFFF] py-4">
      <div className="mx-6 flex max-w-screen-2xl flex-col items-center text-black sm:mx-12 md:flex-row ">
        <div className="px-4 py-10 md:px-10 md:py-20 lg:px-20 lg:py-28">
          <h2 className="text-lg font-light leading-normal lg:text-xl  xl:text-2xl">
            Insurance HeadenFinance Protocol
          </h2>
          <h3 className="mt-6  text-lg font-semibold leading-normal lg:text-xl  xl:text-2xl">
            Earn interest, multi chain lending and better collateral
            opportunities.
          </h3>
        </div>
        <div className="px-4 py-10 md:px-10 md:py-20 lg:px-20 lg:py-28">
          <div className="mb-2 flex justify-between">
            <span className="font-semibold">Stake</span>
            <span className="font-semibold">Borrow</span>
            <span>Repay</span>
            <span>Withdraw</span>
          </div>
          <div className="h-1 bg-gray-200">
            <div className="h-full w-1/2 bg-secondary" />
          </div>
          <h4 className="mt-4">
            Credit based lending possible without having a collateral upto 70%
            of total staked assets value.
          </h4>
        </div>
      </div>
    </section>
  );
}

function MarketsSection() {
  return (
    <section className="flex justify-center bg-[#0E1118]">
      <div className="mx-2 mt-40  flex w-full max-w-screen-2xl flex-col text-white sm:mx-12 ">
        <h3 className="mt-20 ml-10 text-4xl sm:ml-20">Headen markets</h3>
        <div className="m-4 flex flex-wrap justify-center sm:m-10">
          {Array.of(...Array(3)).map((value, index) => (
            <div key={index} className="w-full p-5 md:w-1/2 lg:w-1/3">
              <div className="flex flex-col justify-start rounded bg-[#1B1D23] px-10 py-8 ">
                <div>
                  <Image
                    src="/images/landing/eth.png"
                    alt="Eth logo"
                    width={48}
                    height={48}
                  />
                </div>
                <span className="mt-3.5 text-lg  font-bold">Ethereum</span>
                <p className="mt-3.5 text-sm">
                  HeadenFinance will soon be depoloyed on the Ethereum network
                  in 2022. Ethereum will be the largest market on the
                  HeadenFinance protocol by liquidity and will have the most
                  listed assets.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="flex justify-center bg-[#0E1118]">
      <div className="mx-2 mt-40 flex w-full max-w-screen-2xl flex-col text-white sm:mx-12 ">
        <h3 className="mt-20 ml-10 text-4xl sm:ml-20">Community</h3>
        <div className="m-4 flex flex-wrap justify-center sm:m-10">
          {Array.of(...Array(3)).map((value, index) => (
            <div key={index} className="w-full p-5 md:w-1/2 lg:w-1/3">
              <div className="flex flex-col justify-start rounded bg-[#1B1D23] px-10 py-8">
                <span className="my-14 text-lg  font-bold">
                  <MdOutlineBuild className="mr-2 inline" />
                  Community
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InvestorsSection() {
  return (
    <section className="flex justify-center bg-[#0E1118] pb-24">
      <div className="mx-2 mt-40 flex w-full max-w-screen-2xl flex-col text-white sm:mx-12 ">
        <h3 className="mt-20 ml-10 text-4xl sm:ml-20">Investors</h3>
        <div className="m-4 flex flex-wrap justify-center sm:m-10">
          {Array.of(...Array(10)).map((value, index) => (
            <div
              key={index}
              className="w-full px-10 py-8 md:w-1/2 lg:w-1/3 xl:w-1/4"
            >
              <Image
                src="/images/landing/ethglobal.png"
                alt="ETHGlobal logo"
                height={100}
                width={200}
                layout="responsive"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
