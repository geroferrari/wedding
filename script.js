// Enhanced Wedding Site JavaScript with improved error handling and performance

class WeddingSiteManager {
  constructor() {
    this.currentUser = null
    this.carousel = null
    this.musicPlayer = null
    this.modals = new Map()

    this.init()
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initializeComponents()
      this.setupEventListeners()
      this.initializeAccessibility()
    })
  }


  // Component Initialization
  initializeComponents() {
    this.initializeCountdown()
    this.initializeCarousel()
    this.initializeMusicPlayer()
    this.initializeModals()
    this.initializeLazyLoading()
    this.initializeTimeline()
  }

  // Enhanced Countdown
  initializeCountdown() {
    this.startCountdown()
    setInterval(() => this.startCountdown(), 1000)
  }

  startCountdown() {
    const targetDate = new Date("2026-03-28T18:00:00").getTime()
    const now = new Date().getTime()
    const diff = targetDate - now

    const timerElement = document.getElementById("timer")
    if (!timerElement) return

    if (diff <= 0) {
      timerElement.innerHTML = "¡Es hoy! 💍✨"
      timerElement.style.fontSize = "2rem"
      return
    }

    const timeUnits = this.calculateTimeUnits(diff)
    timerElement.innerHTML = this.formatCountdown(timeUnits)
  }

  calculateTimeUnits(diff) {
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    }
  }

  formatCountdown({ days, hours, minutes, seconds }) {
    return `
      <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
        <div style="background: rgba(74, 74, 74, 0.1); padding: 0.5rem 1rem; border-radius: 8px; text-align: center; min-width: 60px;">
          <div style="font-size: 1.5rem; font-weight: bold; color: var(--color-oscuro);">${days}</div>
          <div style="font-size: 0.7rem; opacity: 0.7;">días</div>
        </div>
        <div style="background: rgba(74, 74, 74, 0.1); padding: 0.5rem 1rem; border-radius: 8px; text-align: center; min-width: 60px;">
          <div style="font-size: 1.5rem; font-weight: bold; color: var(--color-oscuro);">${hours}</div>
          <div style="font-size: 0.7rem; opacity: 0.7;">horas</div>
        </div>
        <div style="background: rgba(74, 74, 74, 0.1); padding: 0.5rem 1rem; border-radius: 8px; text-align: center; min-width: 60px;">
          <div style="font-size: 1.5rem; font-weight: bold; color: var(--color-oscuro);">${minutes}</div>
          <div style="font-size: 0.7rem; opacity: 0.7;">min</div>
        </div>
      </div>
    `
  }

  // Enhanced Carousel
  initializeCarousel() {
    this.carousel = new EnhancedCarousel()
  }

  // Music Player
  initializeMusicPlayer() {
    this.musicPlayer = new MusicPlayer()
  }

  // Modal Management
  initializeModals() {
    const modalTypes = ["indicaciones", "lineup", "fotos", "transporte", "alojamiento"]

    modalTypes.forEach((type) => {
      const modal = document.getElementById(`${type}Modal`)
      if (modal) {
        this.modals.set(type, new Modal(type, modal))
      }
    })

    this.setupModalEventListeners()
  }

  setupModalEventListeners() {
    // Global modal controls
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllModals()
      }
    })

    // Click outside to close
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        const modalId = e.target.id
        const type = modalId.replace("Modal", "")
        this.closeModal(type)
      }
    })
  }

  openModal(type) {
    const modal = this.modals.get(type)
    if (modal) {
      modal.open()
    }
  }

  closeModal(type) {
    const modal = this.modals.get(type)
    if (modal) {
      modal.close()
    }
  }

  closeAllModals() {
    this.modals.forEach((modal) => modal.close())
  }

  // Lazy Loading
  initializeLazyLoading() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove("lazy")
              imageObserver.unobserve(img)
            }
          }
        })
      })

      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        imageObserver.observe(img)
      })
    }
  }

  // Timeline Animations
  initializeTimeline() {
    this.timelineAnimations = new TimelineAnimations()
  }

  // Accessibility
  initializeAccessibility() {
    this.setupScrollAnimations()
    this.setupKeyboardNavigation()
    this.setupFocusManagement()
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    document.querySelectorAll("section").forEach((section) => {
      section.style.opacity = "0"
      section.style.transform = "translateY(20px)"
      section.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(section)
    })
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation for carousel
    document.addEventListener("keydown", (e) => {
      if (e.target.closest(".carousel-container")) {
        if (e.key === "ArrowLeft") {
          e.preventDefault()
          this.carousel?.prevSlide()
        } else if (e.key === "ArrowRight") {
          e.preventDefault()
          this.carousel?.nextSlide()
        }
      }
    })
  }

  setupFocusManagement() {
    // Ensure proper focus management for modals and interactive elements
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    document.addEventListener("focusin", (e) => {
      // Add focus indicators for better accessibility
      if (e.target.matches(focusableElements)) {
        e.target.classList.add("focus-visible")
      }
    })

    document.addEventListener("focusout", (e) => {
      e.target.classList.remove("focus-visible")
    })
  }

  setupEventListeners() {
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })

    // Form enhancement
    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        const submitButton = form.querySelector('button[type="submit"]')
        if (submitButton) {
          submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
          submitButton.disabled = true
        }
      })
    })
  }
}

// Enhanced Carousel Class
class EnhancedCarousel {
  constructor() {
    this.track = document.querySelector(".carousel-track")
    this.slides = Array.from(this.track?.children || [])
    this.nextButton = document.querySelector(".carousel-btn.next")
    this.prevButton = document.querySelector(".carousel-btn.prev")
    this.indicatorsContainer = document.querySelector(".carousel-indicators")

    this.currentIndex = 0
    this.slideWidth = 0
    this.autoPlayInterval = null
    this.isPlaying = true

    if (this.track && this.slides.length > 0) {
      this.init()
    }
  }

  init() {
    this.createIndicators()
    this.updateSlideWidth()
    this.setupEventListeners()
    this.startAutoPlay()

    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.updateSlideWidth()
        this.moveToSlide(this.currentIndex, false)
      }, 250),
    )
  }

  createIndicators() {
    if (!this.indicatorsContainer) return

    this.slides.forEach((_, index) => {
      const indicator = document.createElement("button")
      indicator.classList.add("indicator")
      indicator.setAttribute("aria-label", `Ir a foto ${index + 1}`)
      indicator.setAttribute("type", "button")
      if (index === 0) indicator.classList.add("active")

      indicator.addEventListener("click", () => {
        this.moveToSlide(index)
        this.resetAutoPlay()
      })

      this.indicatorsContainer.appendChild(indicator)
    })
  }

  updateSlideWidth() {
    if (this.slides.length > 0) {
      this.slideWidth = this.slides[0].getBoundingClientRect().width
    }
  }

  setupEventListeners() {
    this.nextButton?.addEventListener("click", () => {
      this.nextSlide()
      this.resetAutoPlay()
    })

    this.prevButton?.addEventListener("click", () => {
      this.prevSlide()
      this.resetAutoPlay()
    })

    // Pause on hover
    this.track?.parentElement?.addEventListener("mouseenter", () => {
      this.stopAutoPlay()
    })

    this.track?.parentElement?.addEventListener("mouseleave", () => {
      if (this.isPlaying) {
        this.startAutoPlay()
      }
    })

    // Touch/swipe support
    this.setupTouchEvents()
  }

  setupTouchEvents() {
    let startX = 0
    let currentX = 0
    let isDragging = false

    this.track?.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
      isDragging = true
      this.stopAutoPlay()
    })

    this.track?.addEventListener("touchmove", (e) => {
      if (!isDragging) return
      currentX = e.touches[0].clientX
    })

    this.track?.addEventListener("touchend", () => {
      if (!isDragging) return
      isDragging = false

      const diffX = startX - currentX
      const threshold = 50

      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          this.nextSlide()
        } else {
          this.prevSlide()
        }
      }

      this.resetAutoPlay()
    })
  }

  moveToSlide(index, animate = true) {
    if (!this.track) return

    if (!animate) {
      this.track.style.transition = "none"
    } else {
      this.track.style.transition = "transform 0.5s ease-in-out"
    }

    this.track.style.transform = `translateX(-${this.slideWidth * index}px)`
    this.currentIndex = index
    this.updateIndicators()

    if (!animate) {
      requestAnimationFrame(() => {
        if (this.track) {
          this.track.style.transition = "transform 0.5s ease-in-out"
        }
      })
    }
  }

  nextSlide() {
    const nextIndex = this.currentIndex + 1 >= this.slides.length ? 0 : this.currentIndex + 1
    this.moveToSlide(nextIndex)
  }

  prevSlide() {
    const prevIndex = this.currentIndex - 1 < 0 ? this.slides.length - 1 : this.currentIndex - 1
    this.moveToSlide(prevIndex)
  }

  updateIndicators() {
    const indicators = document.querySelectorAll(".indicator")
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentIndex)
    })
  }

  startAutoPlay() {
    this.stopAutoPlay()
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide()
    }, 5000)
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
      this.autoPlayInterval = null
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay()
    if (this.isPlaying) {
      this.startAutoPlay()
    }
  }

  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
}

// Music Player Class
class MusicPlayer {
  constructor() {
    this.audio = document.getElementById("bg-music")
    this.controlButton = document.getElementById("music-control")
    this.playIcon = document.querySelector("#music-control .play-icon")
    this.pauseIcon = document.querySelector("#music-control .pause-icon")
    this.isInitialized = false

    if (this.audio && this.controlButton) {
      this.init()
    }
  }

  init() {
    this.setupEventListeners()
    this.setupAutoPlay()
  }

  setupEventListeners() {
    this.controlButton?.addEventListener("click", () => {
      this.toggle()
    })

    this.audio?.addEventListener("ended", () => {
      this.updateUI(false)
    })

    this.audio?.addEventListener("error", (e) => {
      console.warn("Audio playback error:", e)
    })
  }

  setupAutoPlay() {
    const initializeOnInteraction = () => {
      if (!this.isInitialized) {
        this.play()
        this.isInitialized = true
      }
    }

    document.addEventListener("click", initializeOnInteraction, { once: true })
    document.addEventListener("touchstart", initializeOnInteraction, { once: true })
  }

  async toggle() {
    if (!this.audio) return

    try {
      if (this.audio.paused) {
        await this.play()
      } else {
        this.pause()
      }
    } catch (error) {
      console.warn("Music control error:", error)
    }
  }

  async play() {
    if (!this.audio) return

    try {
      await this.audio.play()
      this.updateUI(true)
    } catch (error) {
      console.warn("Audio play failed:", error)
    }
  }

  pause() {
    if (!this.audio) return

    this.audio.pause()
    this.updateUI(false)
  }

  updateUI(isPlaying) {
    if (!this.playIcon || !this.pauseIcon) return

    if (isPlaying) {
      this.playIcon.style.display = "none"
      this.pauseIcon.style.display = "block"
    } else {
      this.playIcon.style.display = "block"
      this.pauseIcon.style.display = "none"
    }
  }
}

// Modal Class
class Modal {
  constructor(type, element) {
    this.type = type
    this.element = element
    this.isOpen = false
    this.focusableElements = null
    this.previousFocus = null

    this.init()
  }

  init() {
    this.focusableElements = this.element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    this.setupEventListeners()
  }

  setupEventListeners() {
    const closeButton = this.element.querySelector(".cerrar")
    closeButton?.addEventListener("click", () => this.close())
  }

  open() {
    this.previousFocus = document.activeElement
    this.element.style.display = "block"
    this.element.setAttribute("aria-hidden", "false")
    document.body.style.overflow = "hidden"
    this.isOpen = true

    // Focus first focusable element
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus()
    }

    // Trap focus within modal
    this.trapFocus()
  }

  close() {
    this.element.style.display = "none"
    this.element.setAttribute("aria-hidden", "true")
    document.body.style.overflow = "auto"
    this.isOpen = false

    // Return focus to previous element
    if (this.previousFocus) {
      this.previousFocus.focus()
    }
  }

  trapFocus() {
    if (this.focusableElements.length === 0) return

    const firstElement = this.focusableElements[0]
    const lastElement = this.focusableElements[this.focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (!this.isOpen) {
        document.removeEventListener("keydown", handleTabKey)
        return
      }

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleTabKey)
  }
}

// Timeline Animations Class
class TimelineAnimations {
  constructor() {
    this.timelineEvents = []
    this.observer = null
    this.init()
  }

  init() {
    this.timelineEvents = document.querySelectorAll(".timeline-event")
    if (this.timelineEvents.length === 0) return

    this.setupIntersectionObserver()
    this.observeElements()
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.2, // Trigger when 20% of element is visible
      rootMargin: "0px 0px -50px 0px", // Trigger slightly before element comes into view
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add a small delay based on the element's index for staggered animation
          const index = Number.parseInt(entry.target.dataset.index) || 0
          const delay = index * 200 // 200ms delay between each element

          setTimeout(() => {
            entry.target.classList.add("animate")
          }, delay)

          // Stop observing this element once it's animated
          this.observer.unobserve(entry.target)
        }
      })
    }, options)
  }

  observeElements() {
    this.timelineEvents.forEach((event) => {
      this.observer.observe(event)
    })
  }

  // Method to reset animations (useful for testing)
  resetAnimations() {
    this.timelineEvents.forEach((event) => {
      event.classList.remove("animate")
      this.observer.observe(event)
    })
  }
}

// Global functions for backward compatibility
function abrirIndicaciones() {
  window.weddingSite?.openModal("indicaciones")
}

function cerrarIndicaciones() {
  window.weddingSite?.closeModal("indicaciones")
}

function abrirModal(tipo) {
  window.weddingSite?.openModal(tipo)
}

function cerrarModal(tipo) {
  window.weddingSite?.closeModal(tipo)
}

function toggleMusic() {
  window.weddingSite?.musicPlayer?.toggle()
}

// Initialize the wedding site
window.weddingSite = new WeddingSiteManager()

// Performance monitoring
if ("performance" in window) {
  window.addEventListener("load", () => {
    const perfData = performance.getEntriesByType("navigation")[0]
    console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`)
  })
}
