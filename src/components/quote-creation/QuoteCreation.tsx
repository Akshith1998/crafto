import { useState } from "react";
import { uploadImage, createQuote } from "../../api/api";
import Cookies from "js-cookie";
import styles from "./QuoteCreation.module.scss";
import { MediaItem } from "../../utils/types";

function QuoteCreationPage() {
  const [text, setText] = useState<string>(""); // State for quote text
  const [imageFile, setImageFile] = useState<File | null>(null); // State for selected image
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!imageFile || !text) {
      setErrorMessage("Please provide both quote text and an image.");
      return;
    }
    const token = Cookies.get("token");
    if (!token) {
      setErrorMessage("User is not authenticated. Please log in.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Upload the image and get media URL
      const mediaUrl: MediaItem[] = await uploadImage(imageFile);

      if (!mediaUrl) {
        setErrorMessage("Failed to upload image. Please try again.");
        return;
      }
      const url = mediaUrl[0]["url"];

      // Submit the quote creation request with the text and media URL
      await createQuote(token, text, url);

      setSuccessMessage("Quote created successfully!");
      setText("");
      setImageFile(null);
    } catch (error) {
      setErrorMessage("Failed to create quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <h1 className={styles.headingText}>Create a New Quote</h1>
      <div className={styles.quoteTextWrapper}>
        <label htmlFor="quoteText" className={styles.quoteText}>
          Quote Text
        </label>
        <textarea
          id="quoteText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your quote"
          rows={4}
          cols={50}
          className={styles.quoteTextArea}
        />
      </div>
      <div className={styles.uploadWrapper}>
        <label htmlFor="imageUpload" className={styles.uploadText}>
          Upload an Image
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className={styles.uploadInput}
        />
      </div>
      <div className={styles.buttonWrapper}>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={styles.submit}
        >
          {isLoading ? "Submitting..." : "Submit Quote"}
        </button>
      </div>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
    </div>
  );
}

export default QuoteCreationPage;
