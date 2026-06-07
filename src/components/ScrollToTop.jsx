import { useState, useEffect } from 'react';
import { FaChevronUp } from 'react-icons/fa';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 left-3 lg:left-auto lg:right-4 z-40 w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 fade-in"
      style={{ background: 'linear-gradient(135deg, #1a5c2a, #2d7a3a)' }}
      title="Back to top"
    >
      <FaChevronUp className="text-white text-sm" />
    </button>
  );
}
