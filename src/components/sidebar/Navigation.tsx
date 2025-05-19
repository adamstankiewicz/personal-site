import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

interface NavItemProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

function NavItem({ to, isActive, children }: NavItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    const element = document.getElementById(to.replace('#', ''));
    if (element && isActive) {
      e.preventDefault();
      // Calculate the target position with offset
      const offset = 20; // Match this with your scrollOffset if needed
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      
      // Smooth scroll to the element with offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <li>
      <Link
        to={to}
        onClick={handleClick}
        className={`relative inline-block px-2 py-2 transition-colors duration-200 cursor-pointer group ${
          isActive 
            ? 'text-sky-900 font-medium' 
            : 'text-gray-700 hover:text-sky-900'
        }`}
      >
        <span className="relative">
          {children}
          <span 
            className={`absolute left-0 -bottom-1 h-0.5 bg-sky-900 transition-all duration-300 ${
              isActive ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          />
        </span>
      </Link>
    </li>
  );
}

export function Navigation() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');
  const scrollOffset = 20;

  // Handle initial scroll and hash
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        // Small delay to ensure the page has rendered
        const timer = setTimeout(() => {
          window.scrollTo({
            top: element.offsetTop - scrollOffset,
            behavior: 'auto'
          });
        }, 50);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location]);

  // Handle scroll events and hash changes
  useEffect(() => {
    let isScrolling: number;
    let ignoreScroll = false;

    const handleScroll = () => {
      // Skip if we're in the middle of a programmatic scroll
      if (ignoreScroll) return;

      const scrollPosition = window.scrollY + scrollOffset;
      const sections = ['about', 'experience', 'projects'];
      
      // Find which section is currently in view
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (!element) continue;
        
        const { top, bottom } = element.getBoundingClientRect();
        const elementTop = top + window.pageYOffset;
        const elementBottom = bottom + window.pageYOffset;
        
        // If the element is in the viewport
        if (scrollPosition >= elementTop - 100 && scrollPosition < elementBottom - 100) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    // Throttle scroll events
    const throttledScroll = () => {
      if (isScrolling) {
        window.cancelAnimationFrame(isScrolling);
      }
      isScrolling = window.requestAnimationFrame(handleScroll);
    };

    // Handle hash changes
    const handleHashChange = () => {
      const hash = location.hash.replace('#', '');
      if (hash) {
        setActiveSection(hash);
        const element = document.getElementById(hash);
        if (element) {
          ignoreScroll = true;
          const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementTop - scrollOffset,
            behavior: 'smooth'
          });
          // Re-enable scroll handling after a short delay
          setTimeout(() => { ignoreScroll = false; }, 100);
        }
      }
    };

    // Initial check
    handleScroll();
    
    // Add event listeners
    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial hash handling
    if (location.hash) {
      handleHashChange();
    }

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('hashchange', handleHashChange);
      if (isScrolling) {
        window.cancelAnimationFrame(isScrolling);
      }
    };
  }, [location.hash, scrollOffset]);

  // Simple active section check
  const getIsActive = (section: string) => activeSection === section;

  return (
    <nav className="mt-12" aria-label="Main navigation">
      <ul className="space-y-1">
        <NavItem 
          to="/#about" 
          isActive={getIsActive('about')}
        >
          About
        </NavItem>
        <NavItem 
          to="/#experience" 
          isActive={getIsActive('experience')}
        >
          Experience
        </NavItem>
        <NavItem 
          to="/#projects" 
          isActive={getIsActive('projects')}
        >
          Projects
        </NavItem>
      </ul>
    </nav>
  );
}
