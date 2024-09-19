import { useEffect, useState } from "react";
import { getQuotes } from "../../api/api";
import styles from "./QuoteList.module.scss";
import Cookies from "js-cookie";
import { Quotes } from "../../utils/types";
import { useNavigate } from "react-router-dom";

const QuoteList = () => {
  const [quotes, setQuotes] = useState<Quotes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const fetchQuotes = async () => {
        try {
          setLoading(true);
          const { data } = await getQuotes(token, 20, offset);
          if (data.length === 0) {
            setHasMore(false); // Stop pagination if no more quotes
          } else {
            setQuotes((prevQuotes) => [...prevQuotes, ...data]);
          }
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "Something went wrong."
          );
        } finally {
          setLoading(false);
        }
      };

      if (hasMore) {
        fetchQuotes();
      }
    } else {
      if (!token) {
        setError("User is not authenticated. Please log in.");
        return;
      }
    }
  }, [offset, hasMore]);

  const handleFloatingButton = () => {
    navigate("/quote-creation");
  };

  const loadMoreQuotes = () => {
    if (hasMore && !loading) {
      setOffset((prevOffset) => prevOffset + 20); // Load next page
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => setOffset(0)}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.headingText}>Quotes</h1>
      <div className={styles.quotes}>
        {quotes.map((quote) => (
          <div key={quote?.id} className={styles.quoteCard}>
            <div className={styles.quoteImageContainer}>
              <img
                src={quote.mediaUrl}
                alt="Quote background"
                className={styles.quoteImage}
              />
              <div className={styles.quoteText}>{quote.text}</div>
            </div>
            <div className={styles.quoteInfo}>
              <p>
                <strong>{quote.username}</strong>
              </p>
              <p>{new Date(quote.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={loadMoreQuotes}
          className={styles.loadMoreButton}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
      <button
        className={styles.floatingActionButton}
        onClick={handleFloatingButton}
      >
        +
      </button>
    </div>
  );
};

export default QuoteList;
