"use client"

import { Rocket } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { renderToStaticMarkup } from "react-dom/server"

export default function AnimatedFavicon() {
  useEffect(() => {
    const svg = encodeURIComponent(
      renderToStaticMarkup(
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{width: '24px', height: '24px'}}
        >
          <Rocket stroke="#22d3ee" width={24} height={24} />
        </motion.svg>
      )
    );

    const url = `data:image/svg+xml;utf8,${svg}`;

    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement
    if (!link) {
      link = document.createElement("link")
      link.rel = "icon"
      document.head.appendChild(link)
    }

    link.href = url
  }, [])

  return null
}