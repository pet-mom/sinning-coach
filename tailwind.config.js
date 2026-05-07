/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans KR"', 'sans-serif'],
        orbitron: ['"Orbitron"', 'monospace'],
        concert: ['"Black Han Sans"', 'sans-serif'],
      },
      colors: {
        // 노래방 컬러 테마
        karaoke: {
          primary: '#FF1493',    // 핫핑크 (노래방 대표 색)
          secondary: '#FFD700',  // 골드
          accent: '#00D9FF',     // 시안 블루
          neon: '#39FF14',       // 네온 그린
          purple: '#9D00FF',     // 보라
          orange: '#FF6B35',     // 오렌지
        },
        perfect: '#39FF14',      // 네온 그린
        good: '#FFD700',         // 골드
        fair: '#FF6B35',         // 오렌지
        off: '#FF1493',          // 핫핑크
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        'slide-in': 'slide-in 0.5s ease-out',
        'disco': 'disco 4s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 0.1s infinite alternate',
        'rainbow': 'rainbow 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 20, 147, 0.5), 0 0 40px rgba(0, 217, 255, 0.3)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(255, 20, 147, 0.8), 0 0 80px rgba(0, 217, 255, 0.6)',
            transform: 'scale(1.05)'
          },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(-30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'disco': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'rainbow': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'disco-ball': 'repeating-linear-gradient(45deg, #FFD700, #FFD700 10px, #FF1493 10px, #FF1493 20px)',
        'neon-grid': 'linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 20, 147, 0.1) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
