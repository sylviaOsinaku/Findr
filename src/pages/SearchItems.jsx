"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { searchReports } from "../services/reportService"
import styles from "./SearchItems.module.css"

const SearchItems = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    type: "ALL",
    status: "OPEN",
    dateRange: "30",
  })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const searchResults = await searchReports(searchTerm, filters)
      setResults(searchResults)
    } catch (err) {
      console.error("Error searching reports:", err)
      setError("Failed to search reports. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial search on component mount
    handleSearch()
  }, [])

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className={styles.searchPage}>
      <h1 className={styles.title}>Search Lost & Found Items</h1>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <div className={styles.searchBar}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for items..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </div>

        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label>Item Type</label>
            <div className={styles.filterOptions}>
              <button
                type="button"
                className={`${styles.filterOption} ${filters.type === "ALL" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("type", "ALL")}
              >
                All
              </button>
              <button
                type="button"
                className={`${styles.filterOption} ${filters.type === "LOST" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("type", "LOST")}
              >
                Lost
              </button>
              <button
                type="button"
                className={`${styles.filterOption} ${filters.type === "FOUND" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("type", "FOUND")}
              >
                Found
              </button>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Status</label>
            <div className={styles.filterOptions}>
              <button
                type="button"
                className={`${styles.filterOption} ${filters.status === "ALL" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("status", "ALL")}
              >
                All
              </button>
              <button
                type="button"
                className={`${styles.filterOption} ${filters.status === "OPEN" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("status", "OPEN")}
              >
                Open
              </button>
              <button
                type="button"
                className={`${styles.filterOption} ${filters.status === "CLOSED" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("status", "CLOSED")}
              >
                Closed
              </button>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Date Range</label>
            <div className={styles.filterOptions}>
              <button
                type="button"
                className={`${styles.filterOption} ${filters.dateRange === "7" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("dateRange", "7")}
              >
                Last 7 days
              </button>
              <button
                type="button"
                className={`${styles.filterOption} ${filters.dateRange === "30" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("dateRange", "30")}
              >
                Last 30 days
              </button>
              <button
                type="button"
                className={`${styles.filterOption} ${filters.dateRange === "ALL" ? styles.activeFilter : ""}`}
                onClick={() => handleFilterChange("dateRange", "ALL")}
              >
                All time
              </button>
            </div>
          </div>
        </div>
      </form>

      {loading ? (
        <div className={styles.loading}>Searching...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.resultsContainer}>
          <h2 className={styles.resultsTitle}>
            {results.length} {results.length === 1 ? "Result" : "Results"} Found
          </h2>

          {results.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No items found matching your search criteria</p>
              <p className={styles.emptyStateSubtext}>Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className={styles.resultsList}>
              {results.map((report) => (
                <div key={report.id} className={styles.resultCard}>
                  <div className={styles.resultHeader}>
                    <div className={styles.resultType} data-type={report.type}>
                      {report.type}
                    </div>
                    <div className={styles.resultStatus} data-status={report.status}>
                      {report.status}
                    </div>
                  </div>

                  <div className={styles.resultContent}>
                    <h3 className={styles.resultTitle}>{report.items.map((item) => item.name).join(", ")}</h3>

                    <div className={styles.resultDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Location:</span>
                        <span>{report.location}</span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{report.type === "LOST" ? "Lost On:" : "Found On:"}</span>
                        <span>{new Date(report.lastSeen).toLocaleDateString()}</span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Reported By:</span>
                        <span>{report.user.name}</span>
                      </div>
                    </div>

                    <div className={styles.resultDescription}>
                      <p>{report.description.substring(0, 150)}...</p>
                    </div>
                  </div>

                  <div className={styles.resultActions}>
                    <Link to={`/reports/${report.id}`} className={styles.viewButton}>
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchItems
