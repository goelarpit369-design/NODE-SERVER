import styles from "./albumForm.module.css";
import { useRef } from "react";

export const AlbumForm = ({ loading, onAdd, onCancel }) => {
  const albumNameInput = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const albumName = albumNameInput.current.value.trim();

    if (!albumName) return;

    onAdd(albumName);
  };

  return (
    <div className={styles.albumForm}>
      <span>Create an album</span>

      <form onSubmit={handleSubmit}>
        <input
          required
          placeholder="Album Name"
          ref={albumNameInput}
        />

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>

        <button type="submit" disabled={loading}>
          Create an album
        </button>
      </form>
    </div>
  );
};