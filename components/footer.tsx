import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="relative bg-black text-white overflow-hidden w-full">
      <div className="absolute top-4 left-4 w-20 h-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 via-orange-400 to-transparent transform -rotate-45 origin-top-left" />
        <div className="absolute top-2 left-0 w-full h-[1px] bg-gradient-to-r from-orange-400/50 to-transparent transform -rotate-45 origin-top-left" />
      </div>
      <div className="absolute bottom-4 right-4 w-20 h-20 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-yellow-500 via-yellow-400 to-transparent transform -rotate-45 origin-bottom-right" />
        <div className="absolute bottom-2 right-0 w-full h-[1px] bg-gradient-to-l from-yellow-400/50 to-transparent transform -rotate-45 origin-bottom-right" />
      </div>

      <div className="relative px-8 md:px-12 lg:px-16 py-8 md:py-12 min-h-[320px] z-10">
        {/* Top section with logos and button */}
        <div className="flex items-start justify-between mb-8">
          {/* Left side - Logos and tagline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-8">
              <Image src="/img/Crayon Logo.png" alt="Crayon" width={130} height={40} className="h-7 w-auto" />
              <Image src="/img/tangram.ai logo.png" alt="Tangram.ai" width={150} height={40} className="h-7 w-auto" />
            </div>
            <p
              style={{
                color: '#B3B3B3',
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: 'normal',
                width: 307,
              }}
            >
              AI-led revenue acceleration platform for enterprises
            </p>
            {/* Social media icons */}
            <div className="flex items-center gap-4 mt-4">
              <Link href="#" className="w-6 h-6 hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                <Image 
                  src="/img/linkedin.svg" 
                  alt="LinkedIn" 
                  width={24} 
                  height={24} 
                  className="w-full h-full"
                />
              </Link>
              <Link href="#" className="w-6 h-6 hover:opacity-80 transition-opacity" aria-label="Twitter">
                <Image 
                  src="/img/x.svg" 
                  alt="Twitter/X" 
                  width={24} 
                  height={24} 
                  className="w-full h-full"
                />
              </Link>
              <Link href="#" className="w-6 h-6 hover:opacity-80 transition-opacity" aria-label="Instagram">
                <Image 
                  src="/img/insta.svg" 
                  alt="Instagram" 
                  width={24} 
                  height={24} 
                  className="w-full h-full"
                />
              </Link>
            </div>
          </div>

          {/* Right side - Lets Talk button */}
          <Link 
            href="/contact" 
            className="flex items-center gap-[12px] text-[52px] font-medium hover:opacity-80 transition-opacity tracking-wide leading-[52px] text-[#e4e4e4] font-['Poppins',sans-serif]"
          >
            Let&apos;s Talk
            <Image 
              src="/img/Line 1.png" 
              alt="Arrow" 
              width={30} 
              height={30} 
              className="w-[30px] h-[30px]"
            />
          </Link>
        </div>
          </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[1512px] h-[126px] overflow-hidden z-0">
        <Image 
          src="/img/Footer Container.png" 
          alt="Footer decoration" 
          fill
          className="object-contain object-bottom"
          priority
        />
        </div>

        {/* Copyright text */}
      <div className="absolute bottom-[8px] left-1/2 transform -translate-x-1/2 text-center z-10">
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.80)',
            fontFamily: 'Poppins',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
          }}
        >
          © 2025 Crayon Data Pvt Ltd & Tangram.ai. All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
