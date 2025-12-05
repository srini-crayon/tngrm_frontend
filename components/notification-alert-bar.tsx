"use client"

import { useState } from "react"
import { Info, X } from "lucide-react"

export function NotificationAlertBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-[#181818] shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.5)] relative w-full overflow-hidden group">
      <div className="w-full px-[30px] py-[5px]">
        <div className="flex items-center gap-[7px] py-2">
          {/* Notification Icon */}
          <div className="flex-shrink-0 w-[14px] h-[14px] z-10">
            <Info className="w-[14px] h-[14px] text-white" />
          </div>
          
          {/* Notification Text */}
          <div className="flex-1 overflow-hidden">
            <div className="whitespace-nowrap">
              <span 
                className="text-white text-[12px] leading-[16.8px] inline-block"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                <span className="font-bold">
                  Limited Availability.
                </span>
                <span className="font-normal">
                  {" "}This application is optimized for viewing on desktop and laptop computers.
                </span>
              </span>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-[6px] hover:opacity-80 transition-opacity z-10 bg-[#181818]"
            aria-label="Close notification"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

