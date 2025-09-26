import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  // Initialize skill bars animation
  useEffect(() => {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
      skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        const rect = bar.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && bar.style.width === '') {
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 200);
        }
      });
    };
    
    // Initial check
    animateSkillBars();
    
    // Check on scroll
    window.addEventListener('scroll', animateSkillBars);
    
    return () => window.removeEventListener('scroll', animateSkillBars);
  }, []);

  // Initialize scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    
    // Add fade-in class to elements and observe them
    const elementsToAnimate = document.querySelectorAll(
      '.section-header, .about-intro, .about-details, .timeline-item, .project-card, .activity-item, .stat-card, .contact-card'
    );
    
    elementsToAnimate.forEach(element => {
      element.classList.add('fade-in');
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          {/* Desktop Navigation */}
          <div className="nav-desktop">
            <button onClick={() => scrollToSection('home')} className="nav-link active">
              HOME
            </button>
            <button onClick={() => scrollToSection('about')} className="nav-link">
              ABOUT
            </button>
            <button onClick={() => scrollToSection('resume')} className="nav-link">
              RESUME
            </button>
            <button onClick={() => scrollToSection('projects')} className="nav-link">
              PROJECTS
            </button>
            <button onClick={() => scrollToSection('activities')} className="nav-link">
              ACTIVITIES
            </button>
            <button onClick={() => scrollToSection('statistics')} className="nav-link">
              STATISTICS
            </button>
            <button onClick={() => scrollToSection('contact')} className="nav-link">
              CONTACT
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <span className={`hamburger-icon ${isMenuOpen ? 'hidden' : ''}`}>☰</span>
            <span className={`close-icon ${!isMenuOpen ? 'hidden' : ''}`}>✕</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`nav-mobile ${!isMenuOpen ? 'hidden' : ''}`}>
          <div className="nav-mobile-content">
            <button onClick={() => scrollToSection('home')} className="nav-link-mobile">HOME</button>
            <button onClick={() => scrollToSection('about')} className="nav-link-mobile">ABOUT</button>
            <button onClick={() => scrollToSection('resume')} className="nav-link-mobile">RESUME</button>
            <button onClick={() => scrollToSection('projects')} className="nav-link-mobile">PROJECTS</button>
            <button onClick={() => scrollToSection('activities')} className="nav-link-mobile">ACTIVITIES</button>
            <button onClick={() => scrollToSection('statistics')} className="nav-link-mobile">STATISTICS</button>
            <button onClick={() => scrollToSection('contact')} className="nav-link-mobile">CONTACT</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Sunwoo Kang</h1>
          <p className="hero-subtitle">Data Analyst | Software Engineer | Founder</p>
          
          {/* Social Icons */}
          <div className="social-icons">
            <div className="social-icon">📧</div>
            <div className="social-icon">💼</div>
            <div className="social-icon">🔗</div>
            <div className="social-icon-custom">S</div>
          </div>

          {/* Scroll Down Arrow */}
          <div className="scroll-arrow">
            <span>⌄</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <p className="section-label">About</p>
            <h2 className="section-title">Let me introduce myself.</h2>
          </div>
          
          <div className="about-content">
            <div className="about-intro">
              <div className="profile-image">
                <img src="/api/placeholder/200/200" alt="Profile" />
              </div>
              <p className="intro-text">
                I'm an engineer seeking moonshot in the health / bio sector. I'm also 
                Stanford class of 2020 B.S. in Biomedical Computation, and class of 
                2021 M.S. in Computer Science AI specialization. My primary 
                interests have been precision health, data flow, zero to one, and the list 
                is still growing.
              </p>
            </div>

            <div className="about-details">
              {/* Profile */}
              <div className="profile-section">
                <h3 className="subsection-title">PROFILE</h3>
                <p className="profile-description">
                  Currently I have a job, but am open to a new software 
                  engineering/product owner/startup opportunities. If 
                  you think I'm a good fit, please contact me via{' '}
                  <a href="mailto:sunnybd97@gmail.com" className="email-link">
                    sunnybd97@gmail.com
                  </a>.
                </p>
                <div className="profile-info">
                  <div className="info-item">
                    <span className="info-label">FULL NAME:</span>
                    <div className="info-value">Sunwoo Kang</div>
                  </div>
                  <div className="info-item">
                    <span className="info-label">EMAIL:</span>
                    <div className="info-value">sunnybd97@gmail.com</div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="skills-section">
                <h3 className="subsection-title">SKILLS</h3>
                <p className="skills-description">
                  I'm a cell-like independent teamworker, strong in 
                  research and coding. My areas of expertise are 
                  computer science, bioinformatics, and genetics. Below 
                  are highlights of my technical skills:
                </p>
                
                <div className="skills-list">
                  {[
                    { skill: 'MS SUITE', level: 90 },
                    { skill: 'PYTHON', level: 90 },
                    { skill: 'JS/TS/REACT', level: 70 },
                    { skill: 'C/C++', level: 60 },
                    { skill: 'JAVA', level: 60 }
                  ].map((item, index) => (
                    <div key={index} className="skill-item">
                      <div className="skill-header">
                        <span className="skill-name">{item.skill}</span>
                        <span className="skill-percentage">{item.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div 
                          className="skill-progress" 
                          data-width={item.level}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section id="resume" className="resume">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Resume</p>
            <h2 className="section-title">More of my credentials.</h2>
            <p className="section-description">Here are my work experiences and education.</p>
          </div>

          <div className="work-experience">
            <h3 className="work-title">Work Experience</h3>
            
            <div className="timeline">
              {/* Amazon */}
              <div className="timeline-item">
                <div className="timeline-date">
                  <h4 className="position-title">Software Engineer</h4>
                  <p className="date-range">March 2022 - Present</p>
                </div>
                <div className="timeline-icon">
                  <div className="icon-circle">💼</div>
                </div>
                <div className="timeline-content">
                  <h4 className="company-name">Amazon</h4>
                  <p className="job-description">
                    Team member at Amazon Health & Wellness Halo Device CVML team. Won 
                    first place in healthtech hackathon with software prototype to highlight user's 
                    milestones and achievement to drive customer engagement.
                  </p>
                </div>
              </div>

              {/* Invitae */}
              <div className="timeline-item">
                <div className="timeline-date">
                  <h4 className="position-title">Software Engineer</h4>
                  <p className="date-range">June 2020 - March 2022</p>
                </div>
                <div className="timeline-icon">
                  <div className="icon-circle">💼</div>
                </div>
                <div className="timeline-content">
                  <h4 className="company-name">Invitae</h4>
                  <p className="job-description">
                    Owned fundamental company data transfer pipeline transferring genomic 
                    data from lab to compute clusters. Built automation system for 
                    troubleshooting sequencing results from variant confirmation process. 
                    Created complex and interactive web visualization tool for clinical 
                    interpretation based on React framework and Plotly visual tools.
                  </p>
                </div>
              </div>

              {/* Genentech */}
              <div className="timeline-item">
                <div className="timeline-date">
                  <h4 className="position-title">Bioinformatics Intern</h4>
                  <p className="date-range">June 2019 - September 2019</p>
                </div>
                <div className="timeline-icon">
                  <div className="icon-circle">💼</div>
                </div>
                <div className="timeline-content">
                  <h4 className="company-name">Genentech</h4>
                  <p className="job-description">
                    Worked in proteomics department under R&D. Created web data analysis & 
                    visualization for MS based proteomics using python pyramid server & 
                    typescript client. Ran high throughput computation analysis through Spotfire, 
                    R, and SQL queries. Was selected for Genentech Leader Intern Exchange 
                    program (gLINX) and mentored by senior VP executive
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Projects</p>
            <h2 className="section-title">Check out my creations.</h2>
          </div>
          
          <div className="projects-grid">
            <div className="project-card">
              <div className="project-image icd-project">ICD</div>
            </div>
            <div className="project-card">
              <div className="project-image network-project">Network Diagram</div>
            </div>
            <div className="project-card">
              <div className="project-image dots-project">Dots Away</div>
            </div>
            <div className="project-card">
              <div className="project-image gradient-project"></div>
            </div>
            <div className="project-card">
              <div className="project-image portfolio-project">
                <h3>Sunwoo Kang</h3>
                <p>Data Analyst | Software Engineer | Founder</p>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image sigma-project">SIGMA PSI ZETA</div>
            </div>
            <div className="project-card">
              <div className="project-image jellyfish-project">Combating Jellyfish Bloom</div>
            </div>
            <div className="project-card">
              <div className="project-image grid-project">
                <div className="color-grid">
                  <div className="grid-cell red"></div>
                  <div className="grid-cell blue"></div>
                  <div className="grid-cell yellow"></div>
                  <div className="grid-cell green"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="activities">
        <div className="activities-background"></div>
        <div className="container">
          <div className="section-header">
            <p className="section-label">Activities</p>
            <h2 className="section-title">My positions during undergraduate.</h2>
            <p className="section-description">Summary of my leadership & extracurricular activities</p>
          </div>

          <div className="activities-list">
            {/* Founder/Co-President */}
            <div className="activity-item">
              <h3 className="activity-title">Founder/Co-President</h3>
              <p className="activity-org">Stanford Transhumanist Association • March 2018 - Present</p>
              <div className="activity-description">
                <p>Organized executive board members & meeting.</p>
                <p>Designed STA discussion event posters.</p>
                <p>Took record of STA meeting & discussion.</p>
                <p>Recruited Stanford students into club members.</p>
              </div>
            </div>

            {/* Webmaster */}
            <div className="activity-item">
              <h3 className="activity-title">Webmaster</h3>
              <p className="activity-org">Omicron Charter, Sigma Psi Zeta • January 2018 - Present</p>
              <div className="activity-description">
                <p>Ran homepage for the biggest Asian interest sorority in campus.</p>
                <p>Publicized the organization's activity, redesigned user interface that doubled website traffic.</p>
                <a href="#" className="activity-link">Sigma Psi Zeta</a>
              </div>
            </div>

            {/* Student Associate */}
            <div className="activity-item">
              <h3 className="activity-title">Student Associate</h3>
              <p className="activity-org">Lane Library, Stanford Medical Center • March 2018 - Present</p>
              <div className="activity-description">
                <p>Helped manage 10000+ books through returning, lending, and shelving books.</p>
                <p>Assisted library users at the front desk.</p>
                <p>Participated in library user statistics through Google Docs.</p>
              </div>
            </div>

            {/* Community Director */}
            <div className="activity-item">
              <h3 className="activity-title">Community Director</h3>
              <p className="activity-org">Biology Interdisciplinary Open Maker Environment, Stanford • March 2003</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="statistics">
        <div className="container">
          <h2 className="section-title">Statistics</h2>
          <p className="section-description">This section can showcase your achievements, metrics, or data visualizations</p>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100+</div>
              <div className="stat-label">Code Commits</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15+</div>
              <div className="stat-label">Technologies Used</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <p className="contact-description">
            I'm always interested in new opportunities and collaborations. 
            Feel free to reach out if you'd like to connect or discuss potential projects.
          </p>
          
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h4 className="contact-title">Email</h4>
              <p className="contact-info">sunnybd97@gmail.com</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h4 className="contact-title">Phone</h4>
              <p className="contact-info">+1 (555) 123-4567</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">💼</div>
              <h4 className="contact-title">LinkedIn</h4>
              <p className="contact-info">linkedin.com/in/sunwoo</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">🔗</div>
              <h4 className="contact-title">GitHub</h4>
              <p className="contact-info">github.com/sunwoo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Sunwoo Kang. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;