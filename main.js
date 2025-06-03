// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light"
    this.init()
  }

  init() {
    this.applyTheme()
    this.bindEvents()
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.theme)
    this.updateThemeIcon()
  }

  updateThemeIcon() {
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      const icon = themeToggle.querySelector("i")
      if (this.theme === "dark") {
        icon.className = "fas fa-sun"
      } else {
        icon.className = "fas fa-moon"
      }
    }
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light"
    localStorage.setItem("theme", this.theme)
    this.applyTheme()
  }

  bindEvents() {
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.init()
  }

  init() {
    this.bindEvents()
    this.setActiveLink()
  }

  bindEvents() {
    // Mobile menu toggle
    const hamburger = document.querySelector(".hamburger")
    const navMenu = document.querySelector(".nav-menu")

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active")
        hamburger.classList.toggle("active")
      })
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu) {
          navMenu.classList.remove("active")
        }
        if (hamburger) {
          hamburger.classList.remove("active")
        }
      })
    })
  }

  setActiveLink() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html"
    const navLinks = document.querySelectorAll(".nav-link")

    navLinks.forEach((link) => {
      link.classList.remove("active")
      const href = link.getAttribute("href")
      if (href === currentPage || (currentPage === "" && href === "index.html")) {
        link.classList.add("active")
      }
    })
  }
}

// Smooth Scrolling
class SmoothScroll {
  constructor() {
    this.init()
  }

  init() {
    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach((link) => {
      link.addEventListener("click", this.handleClick.bind(this))
    })
  }

  handleClick(e) {
    e.preventDefault()
    const targetId = e.target.getAttribute("href").substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }
}

// Animation on Scroll
class ScrollAnimations {
  constructor() {
    this.observer = null
    this.init()
  }

  init() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      })
      this.observeElements()
    }
  }

  observeElements() {
    const elements = document.querySelectorAll(".stat-item, .service-card, .skill-item, .news-card")
    elements.forEach((element) => {
      if (this.observer) {
        this.observer.observe(element)
      }
    })
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"

        // Animate skill bars
        if (entry.target.classList.contains("skill-item")) {
          const progressBar = entry.target.querySelector(".skill-progress")
          if (progressBar) {
            const width = progressBar.style.width
            progressBar.style.width = "0%"
            setTimeout(() => {
              progressBar.style.width = width
            }, 100)
          }
        }
      }
    })
  }
}

// Form Validation
class FormValidator {
  constructor() {
    this.init()
  }

  init() {
    const forms = document.querySelectorAll("form")
    forms.forEach((form) => {
      form.addEventListener("submit", this.handleSubmit.bind(this))

      const inputs = form.querySelectorAll("input, textarea")
      inputs.forEach((input) => {
        input.addEventListener("blur", this.validateField.bind(this))
        input.addEventListener("input", this.clearErrors.bind(this))
      })
    })
  }

  handleSubmit(e) {
    const form = e.target
    const isValid = this.validateForm(form)

    if (!isValid) {
      e.preventDefault()
    }
  }

  validateForm(form) {
    let isValid = true
    const inputs = form.querySelectorAll("input[required], textarea[required]")

    inputs.forEach((input) => {
      if (!this.validateField({ target: input })) {
        isValid = false
      }
    })

    return isValid
  }

  validateField(e) {
    const field = e.target
    const value = field.value.trim()
    const fieldType = field.type
    let isValid = true
    let errorMessage = ""

    // Remove existing error
    this.clearFieldError(field)

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      errorMessage = "This field is required"
      isValid = false
    }

    // Email validation
    if (fieldType === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        errorMessage = "Please enter a valid email address"
        isValid = false
      }
    }

    // Phone validation
    if (fieldType === "tel" && value) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(value.replace(/\s/g, ""))) {
        errorMessage = "Please enter a valid phone number"
        isValid = false
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage)
    }

    return isValid
  }

  showFieldError(field, message) {
    field.classList.add("error")

    let errorElement = field.parentNode.querySelector(".field-error")
    if (!errorElement) {
      errorElement = document.createElement("div")
      errorElement.className = "field-error"
      field.parentNode.appendChild(errorElement)
    }

    errorElement.textContent = message
  }

  clearFieldError(field) {
    field.classList.remove("error")
    const errorElement = field.parentNode.querySelector(".field-error")
    if (errorElement) {
      errorElement.remove()
    }
  }

  clearErrors(e) {
    this.clearFieldError(e.target)
  }
}

// Initialize all components when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager()
  new NavigationManager()
  new SmoothScroll()
  new ScrollAnimations()
  new FormValidator()

  // Add initial animation styles
  const animatedElements = document.querySelectorAll(".stat-item, .service-card, .skill-item, .news-card")
  animatedElements.forEach((element) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(20px)"
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  })
})

// Utility functions
const utils = {
  formatDate: (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  },

  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  showNotification: (message, type = "info") => {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  },
}
