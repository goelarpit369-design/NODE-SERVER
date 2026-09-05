import styles from "./imageForm.module.css";
import { useEffect, useRef } from "react";

export const ImageForm = ({
  loading,
  onAdd,
  onUpdate,
  onCancel,
  albumName,
  updateIntent,
}) => {
  const imageTitleInput = useRef();
  const imageUrlInput = useRef();

  useEffect(() => {
    if (updateIntent) {
      imageTitleInput.current.value = updateIntent.title || "";
      imageUrlInput.current.value = updateIntent.url || "";
    } else {
      imageTitleInput.current.value = "";
      imageUrlInput.current.value = "";
    }
  }, [updateIntent]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const title = imageTitleInput.current.value.trim();
    const url = imageUrlInput.current.value.trim();

    if (!title || !url) return;

    if (updateIntent) {
      onUpdate({
        id: updateIntent.id,
        title,
        url,
      });
    } else {
      onAdd({
        title,
        url,
      });
    }
  };

  return (
    <div className={styles.imageForm}>
      <span>
        {!updateIntent
          ? `Add image to ${albumName}`
          : `Update image ${updateIntent.title}`}
      </span>

      <form onSubmit={handleSubmit}>
        <input
          required
          placeholder="Title"
          ref={imageTitleInput}
        />

        <input
          required
          placeholder="Image URL"
          ref={imageUrlInput}
        />

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button type="submit" disabled={loading}>
            {updateIntent ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};