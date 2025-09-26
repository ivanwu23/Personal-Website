import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
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
    
    animateSkillBars();
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
    
    const elementsToAnimate = document.querySelectorAll(
      '.section-header, .about-intro, .about-details, .timeline-item, .project-card, .activity-item, .stat-card, .contact-card'
    );
    
    elementsToAnimate.forEach(element => {
      element.classList.add('fade-in');
      observer.observe(element);
    });

    // Vinyl record scroll effect with debugging
    const handleVinylScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const vinylRecord = document.querySelector('.vinyl-record');
      const threshold = windowHeight * 0.1; // Trigger at 10% scroll
      
      if (vinylRecord) {
        if (scrollY > threshold) {
          vinylRecord.classList.add('scrolled');
          console.log('Vinyl scrolled - adding class'); // Debug
        } else {
          vinylRecord.classList.remove('scrolled');
          console.log('Vinyl not scrolled - removing class'); // Debug
        }
      }
    };

    // Call once to set initial state
    handleVinylScroll();
    
    window.addEventListener('scroll', handleVinylScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleVinylScroll);
    };
  }, []);

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
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

          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <span className={`hamburger-icon ${isMenuOpen ? 'hidden' : ''}`}>☰</span>
            <span className={`close-icon ${!isMenuOpen ? 'hidden' : ''}`}>✕</span>
          </button>
        </div>

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
        <div className="vinyl-record">
          <div className="vinyl-center"></div>
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">IVAN WU</h1>
          <p className="hero-subtitle">Software Engineer | Illustrator | Designer</p>
          
          <div className="social-icons">
            <div className="social-icon">📧</div>
            <div className="social-icon">💼</div>
            <div className="social-icon">🔗</div>
            <div className="social-icon-custom">I</div>
          </div>

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
                <img src="/headshot.JPG" alt="Profile" />
              </div>
              <p className="intro-text">
                I'm Ivan Wu, an aspiring software engineer passionate about creating innovative solutions at the intersection of technology, design, and problem-solving. 
                I entered the University at Buffalo as an Architecture major, later switching to Computer Science to pursue my passion for programming and computational thinking. 
                My diverse experiences—from art and design to software development—shape my ability to approach challenges creatively and with perseverance.
              </p>
            </div>

            <div className="about-details">
              <div className="profile-section">
                <h3 className="subsection-title">PROFILE</h3>
                <p className="profile-description">
                  Currently a Computer Science major at UB with hands-on experience in object-oriented programming, systems programming in C, and software design. 
                  Open to opportunities in software engineering, product development, or startups where I can leverage both technical expertise and creativity. 
                  If you think I'd be a strong fit, feel free to reach out at{' '}
                  <a href="mailto:ivanwu2024@gmail.com" className="email-link">
                    ivanwu2024@gmail.com
                  </a>.
                </p>
                <div className="profile-info">
                  <div className="info-item">
                    <span className="info-label">FULL NAME:</span>
                    <div className="info-value">Ivan Wu</div>
                  </div>
                  <div className="info-item">
                    <span className="info-label">EMAIL:</span>
                    <div className="info-value">ivanwu2024@gmail.com</div>
                  </div>
                </div>
              </div>

              <div className="skills-section">
                <h3 className="subsection-title">SKILLS</h3>
                <p className="skills-description">
                  I bring together technical skill, creativity, 
                  and leadership experience to contribute effectively 
                  as both a team player and independent problem-solver. 
                  Below are highlights of my technical skills:
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
            <p className="section-description">Here are my experiences and education.</p>
          </div>

          <div className="work-experience">
            <h3 className="work-title">Experience</h3>
            
            <div className="timeline">
              {/* Weather App */}
              <div className="timeline-item">
                <div className="timeline-date">
                  <h4 className="position-title">Independent Project</h4>
                  <p className="date-range">May 2025 - June 2025</p>
                </div>
                <div className="timeline-icon">
                  <div className="icon-circle">💼</div>
                </div>
                <div className="timeline-content">
                  <h4 className="company-name">Heatseek &lt;3</h4>
                  <p className="job-description">
                    Built a cross-platform desktop application using 
                    Electron.js with custom frameless window design.
                    Integrated Visual Crossing Weather API for 
                    real-time weather data retrieval with error handling.
                    Implemented smooth CSS animations including floating 
                    bubbles and character head rotation.
                  </p>
                </div>
              </div>

              {/* Media App */}
              <div className="timeline-item">
                <div className="timeline-date">
                  <h4 className="position-title">Student Project</h4>
                  <p className="date-range">February 2024 - June 2024</p>
                </div>
                <div className="timeline-icon">
                  <div className="icon-circle">💼</div>
                </div>
                <div className="timeline-content">
                  <h4 className="company-name">Multi-Media Database</h4>
                  <p className="job-description">
                    Designed and developed a robust multimedia database system 
                    using object-oriented programming principles in Java. 
                    Implemented classes for movies, songs, and reviewers, 
                    with clearly defined relationships and behaviors.
                  </p>
                </div>
              </div>

              {/* Message App */}
              <div className="timeline-item">
                <div className="timeline-date">
                  <h4 className="position-title">Student Project</h4>
                  <p className="date-range">February 2024 - June 2024</p>
                </div>
                <div className="timeline-icon">
                  <div className="icon-circle">💼</div>
                </div>
                <div className="timeline-content">
                  <h4 className="company-name">Instant Messenger</h4>
                  <p className="job-description">
                    Developed packet encoding and decoding functionality for an 
                    instant messaging system in C, gaining hands-on experience with 
                    data serialization, pointer arithmetic, and raw memory access to 
                    efficiently manage transmissions.
                  </p>
                </div>
              </div>

              {/* Community Collaborator */}
              <div className="timeline-item">
                <div className="timeline-date">
                  <h4 className="position-title">Community Collaborator</h4>
                  <p className="date-range">January 2025 - Present</p>
                </div>
                <div className="timeline-icon">
                  <div className="icon-circle">💼</div>
                </div>
                <div className="timeline-content">
                  <h4 className="company-name">Neighborhood Fundraisers & Welfare Organizations</h4>
                  <p className="job-description">
                    Partnered with local organizations to support underserved populations.
                    Coordinated fundraising events and welfare initiatives to directly aid those in need.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="education-experience">
            <h3 className="work-title">Education</h3>
            
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-date">
                  <h4 className="position-title">Bachelor's Degree</h4>
                  <p className="date-range">August 2022 - May 2027</p>
                </div>
                <div className="timeline-icon">
                  <div className="icon-circle">🎓</div>
                </div>
                <div className="timeline-content">
                  <h4 className="company-name">University at Buffalo</h4>
                  <p className="job-description">
                    Coursework: Discrete Structure, Data Structures, Algorithms & Complexity, Programming Languages, Systems Programming
                    <br />Interests: Software engineering, Marketing, Product innovation
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
                <h3>IVAN WU</h3>
                <p>Software Engineer | Illustrator | Designer</p>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image sigma-project">ALPHA KAPPA PSI</div>
            </div>
            <div className="project-card">
              <div className="project-image jellyfish-project">Heatseek</div>
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
            <div className="activity-item">
              <h3 className="activity-title">Member</h3>
              <p className="activity-org">Alpha Kappa Psi Professional Business Fraternity • August 2024 - Present</p>
              <div className="activity-description">
                <p>Participated in professional development workshops and networking events.</p>
                <p>Collaborated with fellow members on business case competitions and projects.</p>
                <p>Developed leadership and teamwork skills through fraternity activities.</p>
              </div>
            </div>

            <div className="activity-item">
              <h3 className="activity-title">Community Volunteer</h3>
              <p className="activity-org">Local Buffalo Organizations • January 2023 - Present</p>
              <div className="activity-description">
                <p>Organized and participated in community fundraising events.</p>
                <p>Supported welfare initiatives for underserved populations in Buffalo area.</p>
                <p>Coordinated with local organizations to maximize community impact.</p>
              </div>
            </div>

            <div className="activity-item">
              <h3 className="activity-title">Freelance Designer</h3>
              <p className="activity-org">Independent Work • June 2020 - Present</p>
              <div className="activity-description">
                <p>Created digital illustrations and design work for various clients.</p>
                <p>Developed brand identity materials and marketing graphics.</p>
                <p>Managed client relationships and project timelines independently.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="statistics">
        <div className="container">
          <h2 className="section-title">Statistics</h2>
          <p className="section-description">Some metrics that showcase my journey and growth</p>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">10+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">3+</div>
              <div className="stat-label">Years Coding</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Code Commits</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">8+</div>
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
              <p className="contact-info">ivanwu2024@gmail.com</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h4 className="contact-title">Phone</h4>
              <p className="contact-info">+1 (347) 425-5405</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">💼</div>
              <h4 className="contact-title">LinkedIn</h4>
              <p className="contact-info">linkedin.com/in/ivanw23</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">🔗</div>
              <h4 className="contact-title">GitHub</h4>
              <p className="contact-info">github.com/ivanwu23</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Ivan Wu. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;