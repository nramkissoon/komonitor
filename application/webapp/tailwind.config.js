module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", 
  "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#EBF8FF",
          100: "#BEE3F8",
          200: "#90CDF4",
          300: "#63B3ED",
          400: "#4299E1",
          500: "#3182CE",
          600: "#2B6CB0",
          700: "#2C5282",
          800: "#2A4365",
          900: "#1A365D",
        }
      },
      animation: {
        "scale-fade-in": "scale-fade-in .4s ease-in forwards",
        "scale-fade-out": "scale-fade-out .2s ease-out forwards",
        "slide-fade-in-right": "slide-fade-in-right .4s ease-out forwards",
        "slide-fade-out-right": "slide-fade-out-right .4s ease-in forwards",
        "slide-fade-in-left": "slide-fade-in-left .4s ease-out forwards",
        "slide-fade-out-left": "slide-fade-out-left .4s ease-in forwards",
        "slide-fade-in-top": "slide-fade-in-top .5s ease-out forwards",
        "slide-fade-out-top": "slide-fade-out-top .4s ease-in forwards",
        "slide-fade-in-bottom": "slide-fade-in-bottom .5s ease-out forwards",
        "slide-fade-out-bottom": "slide-fade-out-bottom .4s ease-in forwards",
        "notification-fade-in": "notification-fade-in .2s ease-in-out forwards",
        "notification-fade-out": "notification-fade-out .2s ease-in forwards",
      },
      variants: {
        animation: ["motion-safe"]
      },
      keyframes: {
        "scale-fade-in": {
          "0%": { opacity: 0, transform: "scale(.95)" },
          "60%": {opacity: .60, transform: "scale(1.02)"},
          "100%": { opacity: 1, transform: "scale(1)" }
        },
        "scale-fade-out": {
          "0%": { opacity: 1, transform: "scale(1)" },
          "100%": { opacity: 0, transform: "scale(.95)" }
        },
        "slide-fade-in-right": {
          "0%": { opacity: 0, transform: "scale(.95) translateX(-50%)" },
          "60%": {opacity: .60, transform: "scale(.97) translateX(1%)"},
          "100%": { opacity: 1, transform: "scale(1) translateX(0)" }
        },
        "slide-fade-out-right": {
          "0%": { opacity: 1, transform: "translateX(0)" },
          "100%": { opacity: 0, transform: "translateX(50%)" }
        },
        "slide-fade-in-left": {
          "0%": { opacity: 0, transform: "scale(.95) translateX(50%)" },
          "60%": {opacity: .60, transform: "scale(.97) translateX(-1%)"},
          "100%": { opacity: 1, transform: "scale(1) translateX(0)" }
        },
        "slide-fade-out-left": {
          "0%": { opacity: 1, transform: "translateX(0)" },
          "100%": { opacity: 0, transform: "translateX(-50%)" }
        },
        "slide-fade-in-top": {
          "0%": { opacity: 0, transform: "translateY(50%)" },
          "100%": { opacity: 1, transform: "translateY(0%)" }
        },
        "slide-fade-in-bottom": {
          "0%": { opacity: 0, transform: "translateY(-50%)" },
          "100%": { opacity: 1, transform: "translateY(0%)" }
        },
        "notification-fade-in": {
          "0%": { opacity: 0, transform: "translateY(50%) scale(.85)" },
          "100%": { opacity: 1, transform: "translateY(0%) scale(1)" }
        },
        "notification-fade-out": {
          "0%": { opacity: 1, transform: "scale(1)" },
          "100%": { opacity: 0, transform: "scale(.70)" }
        }
      }
    },
  },
  plugins: [],
}
