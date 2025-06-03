// Admin Panel Management
class AdminManager {
  constructor() {
    this.apiUrl = "http://localhost:3000/api"
    this.init()
  }

  init() {
    this.bindEvents()
    this.loadRecentPosts()
  }

  bindEvents() {
    const newsForm = document.getElementById("newsForm")
    const imageInput = document.getElementById("image")

    if (newsForm) {
      newsForm.addEventListener("submit", this.handleSubmit.bind(this))
    }

    if (imageInput) {
      imageInput.addEventListener("change", this.handleImagePreview.bind(this))
    }
  }

  handleImagePreview(e) {
    const file = e.target.files[0]
    const preview = document.getElementById("imagePreview")
    const previewImg = document.getElementById("previewImg")

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImg.src = e.target.result
        preview.style.display = "block"
      }
      reader.readAsDataURL(file)
    } else {
      preview.style.display = "none"
    }
  }

  async handleSubmit(e) {
    e.preventDefault()

    const form = e.target
    const submitBtn = form.querySelector('button[type="submit"]')
    const btnText = submitBtn.querySelector(".btn-text")
    const btnLoading = submitBtn.querySelector(".btn-loading")
    const messageDiv = document.getElementById("formMessage")

    // Show loading state
    btnText.style.display = "none"
    btnLoading.style.display = "inline-block"
    submitBtn.disabled = true

    try {
      const formData = new FormData(form)

      const response = await fetch(`${this.apiUrl}/news`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to publish post")
      }

      const result = await response.json()

      // Show success message
      messageDiv.innerHTML =
        '<div class="success-message"><i class="fas fa-check-circle"></i> Post published successfully!</div>'
      messageDiv.style.display = "block"

      // Reset form
      form.reset()
      document.getElementById("imagePreview").style.display = "none"

      // Reload recent posts
      this.loadRecentPosts()
    } catch (error) {
      console.error("Error publishing post:", error)
      messageDiv.innerHTML =
        '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Error publishing post. Please try again.</div>'
      messageDiv.style.display = "block"
    } finally {
      // Reset button state
      btnText.style.display = "inline-block"
      btnLoading.style.display = "none"
      submitBtn.disabled = false
    }
  }

  async loadRecentPosts() {
    const postsContainer = document.getElementById("adminPostsList")

    try {
      const response = await fetch(`${this.apiUrl}/news?limit=5`)

      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }

      const posts = await response.json()
      this.renderRecentPosts(posts)
    } catch (error) {
      console.error("Error loading recent posts:", error)
      postsContainer.innerHTML = `
                <div class="error-message">
                    <p>Failed to load recent posts.</p>
                </div>
            `
    }
  }

  renderRecentPosts(posts) {
    const postsContainer = document.getElementById("adminPostsList")

    if (posts.length === 0) {
      postsContainer.innerHTML = "<p>No posts yet.</p>"
      return
    }

    const postsHTML = posts
      .map(
        (post) => `
            <div class="admin-post-item">
                <div class="admin-post-title">${this.escapeHtml(post.title)}</div>
                <div class="admin-post-date">${this.formatDate(post.createdAt)}</div>
            </div>
        `,
      )
      .join("")

    postsContainer.innerHTML = postsHTML
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  formatDate(date) {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(date).toLocaleDateString(undefined, options)
  }
}

// Initialize admin manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AdminManager()
})
