import { Mulish } from "@next/font/google";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineBuild } from "react-icons/md";

import clsxm from "@/lib/clsxm";

import LandingLayout from "@/components/layout/LandingLayout";
import NextImage from "@/components/NextImage";
import Seo from "@/components/Seo";

import EthGlobal from "~/images/landing/ethglobal.png";
import EurBtcImage from "~/images/landing/eur_btc.png";
import HyperLane from "~/images/landing/hyperlane.png";
import Background from "~/images/landing/landing_bg.png";
import NetworkImage from "~/images/landing/network.png";
import Polygon from "~/images/landing/polygon.png";
import HowItWorksImage from "~/images/landing/temp_how_it_works.png";

const ParticlesBackground = dynamic(
  () => import("@/components/ParticlesBackground"),
  {
    suspense: true,
  }
);

const mulish = Mulish({
  subsets: ["latin"],
});

export default function LandingPage() {
  return (
    <LandingLayout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <main className="flex flex-col  justify-center text-white">
        <MainSection />
        <InfoSection />
        {/* DEFI AND WEB3*/}
        <section className="flex flex-col items-center bg-[#1E1E1E] py-14 sm:py-20 md:py-40">
          <h2
            className={clsxm(
              "mx-10 text-center text-xl font-bold sm:text-2xl md:text-4xl",
              mulish.className
            )}
          >
            Web3 & DeFi is taking over the world!
          </h2>
          <h3 className="mx-10 mt-4 max-w-[650px] text-center  text-sm font-light text-[#FFFFFF80] sm:mt-10 md:text-lg ">
            Headen Finance aims to be a standard protocol used globally for
            cross chain lending & staking
          </h3>
          <Image
            src={NetworkImage}
            alt="World map"
            width={1500}
            className="object-cover"
          />
        </section>
        {/* SPONSORS */}
        <section className="flex flex-col items-center bg-[#1E1E1E] pb-14 sm:pb-20 md:pb-40">
          <h2
            className={clsxm(
              "mx-10 text-center text-xl font-bold sm:text-2xl md:text-4xl",
              mulish.className
            )}
          >
            Sponsors
          </h2>
          <h3 className="mx-10 mt-4 max-w-[650px] text-center  text-sm font-light text-[#FFFFFF80] sm:mt-10 md:text-lg ">
            Headen Finance is sponsored by reputable global companies. In the
            just concluded ETHonline Hackaton, the protocol was also selected
            amongst the highlights of the competition.
          </h3>
          <div className="mt-10 flex w-full max-w-screen-xl flex-wrap justify-evenly sm:mt-20">
            <Link href="https://polygon.technology/">
              <Image
                src={Polygon}
                alt="Polygon logo"
                height={45}
                className="mx-5 my-2"
              />
            </Link>
            <Link href="https://ethglobal.com/">
              <Image
                src={EthGlobal}
                alt="EthOnline logo"
                height={45}
                className="mx-5 my-2"
              />
            </Link>
            <Link href="https://www.hyperlane.xyz/">
              <Image
                src={HyperLane}
                alt="HyperLane logo"
                height={45}
                className="mx-5 my-2"
              />
            </Link>
          </div>
        </section>
        {/* DESCRIPTION */}
        <section className="flex flex-col items-center bg-[#F4F4F4] py-14 sm:py-20 md:py-40">
          <div className="mb-10 flex gap-10">
            <div className="rounded-full px-5 text-xl text-[#858C93] outline">
              STAKE
            </div>
            <div className="rounded-full px-5 text-xl text-[#858C93] outline">
              BORROW
            </div>
          </div>
          <h2 className="mx-10 text-center text-xl font-medium text-black sm:text-2xl md:text-3xl">
            Headen Finance allows users to stake NFTs, use Liquidity tokens as
            collateral, and borrow without needing 70% of total staked value.
          </h2>
        </section>

        <section className="flex flex-col items-center py-14 sm:py-20 md:py-40">
          <h2
            className={clsxm(
              "mx-10 mx-10 max-w-[650px] text-center text-center text-xl font-bold sm:text-2xl md:text-4xl",
              mulish.className
            )}
          >
            How Headen Finance Makes Cross Chain Loans
          </h2>
          <Image
            src={HowItWorksImage}
            alt="How the protocol works"
            width={1200}
            className="m-10"
          />
        </section>
        <section className="flex flex-col items-center py-14 sm:py-20 md:py-40">
          <div className="w-full max-w-screen-xl ">
            <div className="flex flex-wrap content-center justify-between gap-y-10">
              <div className="min-w-[300px] flex-1 ">
                <div className="mx-auto max-w-[390px]">
                  <h2 className="mx-10 text-xl font-medium text-white sm:text-2xl md:text-3xl">
                    No-collateral lending
                  </h2>
                  <p className="mx-10 mt-4 text-sm font-light  text-[#FFFFFF80] sm:mt-10 md:text-lg ">
                    Lorem ipsum dolor sit amet consectetur. Egestas vulputate
                    dui vel ornare magna aliquam ornare nisl felis. Sit congue
                    fusce elit nec quam sit. Pellentesque morbi posuere urna
                    faucibus eget.{" "}
                  </p>
                  <p className="mx-10 mt-4 text-sm font-light  text-[#FFFFFF80] sm:mt-10 md:text-lg ">
                    Lorem ipsum dolor sit amet consectetur. Egestas vulputate
                    dui vel ornare magna aliquam ornare nisl felis. Sit congue
                    fusce elit nec quam sit. Pellentesque morbi posuere urna
                    faucibus eget.{" "}
                  </p>
                </div>
              </div>
              <div className="min-w-[300px] flex-1">
                <div className="mx-auto  max-w-[390px]">
                  <h2 className="mx-10 text-xl font-medium text-white sm:text-2xl md:text-3xl">
                    Introducing Credit score for Stakers
                  </h2>
                  <div className="relative mx-10 mt-10 aspect-[4.48]">
                    <Image
                      src={EurBtcImage}
                      alt="Euro to BTC symbol"
                      fill={true}
                      className=""
                    />
                  </div>
                  <p className="mx-10 mt-4 text-sm font-light  text-[#FFFFFF80] sm:mt-10 md:text-lg ">
                    Lorem ipsum dolor sit amet consectetur. Egestas vulputate
                    dui vel ornare magna aliquam ornare nisl felis. Sit congue
                    fusce elit nec quam sit. Pellentesque morbi posuere urna
                    faucibus eget.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-40 flex flex-wrap justify-between gap-y-10">
              <div className="min-w-[300px] flex-1">
                <div className="mx-auto max-w-[390px]">
                  <h2 className="mx-10 text-xl font-medium text-white sm:text-2xl md:text-3xl">
                    NFTs & Liquidity Tokens as Collaterals
                  </h2>
                  <div className="relative mx-10 mt-10 aspect-[4.48]">
                    <Image
                      src={EurBtcImage}
                      alt="Euro to BTC symbol"
                      fill={true}
                      className=""
                    />
                  </div>
                  <p className="mx-10 mt-4 text-sm font-light  text-[#FFFFFF80] sm:mt-10 md:text-lg ">
                    Lorem ipsum dolor sit amet consectetur. Egestas vulputate
                    dui vel ornare magna aliquam ornare nisl felis. Sit congue
                    fusce elit nec quam sit. Pellentesque morbi posuere urna
                    faucibus eget.{" "}
                  </p>
                </div>
              </div>
              <div className="min-w-[300px] flex-1">
                <div className="mx-auto max-w-[390px]">
                  <h2 className="mx-10 text-xl font-medium text-white sm:text-2xl md:text-3xl">
                    Earn interests, Create markets and more
                  </h2>

                  <p className="mx-10 mt-4 text-sm font-light  text-[#FFFFFF80] sm:mt-10 md:text-lg ">
                    Lorem ipsum dolor sit amet consectetur. Egestas vulputate
                    dui vel ornare magna aliquam ornare nisl felis. Sit congue
                    fusce elit nec quam sit. Pellentesque morbi posuere urna
                    faucibus eget.{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*<MarketsSection />*/}
        {/*<CommunitySection />*/}
        {/*<InvestorsSection />*/}
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
        placeholder="blur"
        src={Background}
      />
      <React.Suspense>
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

// eslint-disable-next-line unused-imports/no-unused-vars
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

// eslint-disable-next-line unused-imports/no-unused-vars
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

// eslint-disable-next-line unused-imports/no-unused-vars
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
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
