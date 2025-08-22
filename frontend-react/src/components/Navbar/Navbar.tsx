import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiChevronDown } from 'react-icons/hi';
import { RiUserAddFill } from 'react-icons/ri';
import { MdAnalytics } from 'react-icons/md';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.navContainer}>
          {/* Logo con imagen */}
          <Link to="/" className={styles.brand} onClick={closeMobileMenu}>
            <div className={styles.logoContainer}>
              <div className={styles.logoImageWrapper}>
                <img 
                  src="/logo.png" 
                  alt="ConQuito Logo" 
                  className={styles.logoImage}
                />
              </div>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <ul className={styles.navLinks}>
            <li className={styles.navItem}>
              <Link
                to="/registro"
                className={`${styles.navLink} ${isActive('/registro') ? styles.active : ''}`}
              >
                <div className={styles.linkContent}>
                  <RiUserAddFill className={styles.linkIcon} />
                  <span className={styles.linkText}>Registro</span>
                </div>
                <div className={styles.linkIndicator}></div>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                to="/dashboard"
                className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}
              >
                <div className={styles.linkContent}>
                  <MdAnalytics className={styles.linkIcon} />
                  <span className={styles.linkText}>Dashboard</span>
                </div>
                <div className={styles.linkIndicator}></div>
              </Link>
            </li>
          </ul>

          {/* Enhanced Mobile Toggle */}
          <button
            className={`${styles.mobileToggle} ${isMobileMenuOpen ? styles.toggleActive : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={styles.toggleLine}></span>
            <span className={styles.toggleLine}></span>
            <span className={styles.toggleLine}></span>
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuHeader}>
            <h3>Navegación</h3>
          </div>
          <ul className={styles.mobileNavLinks}>
            <li>
              <Link
                to="/registro"
                className={`${styles.mobileNavLink} ${isActive('/registro') ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                <div className={styles.mobileItemIcon}>
                  <RiUserAddFill />
                </div>
                <div className={styles.mobileItemContent}>
                  <span className={styles.mobileItemTitle}>Registro de Personas</span>
                  <span className={styles.mobileItemDesc}>Crear nuevos registros</span>
                </div>
                <HiChevronDown className={styles.chevron} />
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className={`${styles.mobileNavLink} ${isActive('/dashboard') ? styles.active : ''}`}
                onClick={closeMobileMenu}
              >
                <div className={styles.mobileItemIcon}>
                  <MdAnalytics />
                </div>
                <div className={styles.mobileItemContent}>
                  <span className={styles.mobileItemTitle}>Dashboard</span>
                  <span className={styles.mobileItemDesc}>Analíticas y reportes</span>
                </div>
                <HiChevronDown className={styles.chevron} />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={closeMobileMenu}></div>
      )}
    </nav>
  );
};

export default Navbar;