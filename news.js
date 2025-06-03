// News Management
class NewsManager {
  constructor() {
    this.apiUrl = "http://localhost:3000" // Base API URL
    this.apiNewsUrl = `${this.apiUrl}/api/news` // News API endpoint
    this.init()
  }

  init() {
    this.loadNews()
  }

  async loadNews() {
    const newsContainer = document.getElementById("newsContainer")
    const noNewsElement = document.getElementById("noNews")

    try {
      const response = await fetch(this.apiNewsUrl)

      if (!response.ok) {
        throw new Error("Failed to fetch news")
      }

      const news = await response.json()

      if (news.length === 0) {
        newsContainer.style.display = "none"
        noNewsElement.style.display = "block"
        return
      }

      this.renderNews(news)
    } catch (error) {
      console.error("Error loading news:", error)
      newsContainer.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load news. Please try again later.</p>
        </div>
      `
    }
  }

  renderNews(newsArray) {
    const newsContainer = document.getElementById("newsContainer")

    const newsHTML = newsArray
      .map((news) => {
        // Use the full image URL directly from the API response
        const imageUrl = news.image

        return `
          <article class="news-card">
            <img src="${imageUrl}" alt="${this.escapeHtml(news.title)}" class="news-image"
                 onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="news-content">
              <h3 class="news-title">${this.escapeHtml(news.title)}</h3>
              <p class="news-description">${this.escapeHtml(news.description)}</p>
              <time class="news-date">${this.formatDate(news.createdAt)}</time>
            </div>
          </article>
        `
      })
      .join("")

    newsContainer.innerHTML = newsHTML
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

// Initialize news manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new NewsManager()
})
