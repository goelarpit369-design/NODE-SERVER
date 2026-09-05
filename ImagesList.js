import styles from "./imageList.module.css";
import { useState, useRef, useEffect } from "react";
import Spinner from "react-spinner-material";
import { toast } from "react-toastify";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase";
import { ImageForm } from "../imageForm/ImageForm";
import { Carousel } from "../carousel/Carousel";

export const ImagesList = ({
  albumId,
  albumName,
  onBack,
}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchIntent, setSearchIntent] = useState(false);
  const [filteredImages, setFilteredImages] = useState([]);

  const searchInput = useRef();

  const [addImageIntent, setAddImageIntent] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [updateImageIntent, setUpdateImageIntent] = useState(false);

  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [activeHoverImageIndex, setActiveHoverImageIndex] = useState(null);

  useEffect(() => {
    const getImages = async () => {
      try {
        setLoading(true);

        const imagesRef = collection(
          db,
          "albums",
          albumId,
          "images"
        );

        const snapshot = await getDocs(imagesRef);

        const imageData = (snapshot?.docs || []).map((imageDoc) => {
          const data = imageDoc.data?.() || {};

          return {
            id: imageDoc.id,
            title: data.title || "",
            url: data.url || "",
            ...data,
          };
        });

        setImages(imageData);
        setFilteredImages(imageData);
      } catch (error) {
        console.error("ImagesList getImages error:", error);
        toast.error("Failed to load images.");
        setImages([]);
        setFilteredImages([]);
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      getImages();
    }
  }, [albumId]);

  // ---------------------------
  // Carousel
  // ---------------------------

  const handleNext = () => {
    setActiveImageIndex((current) => {
      if (current === null || filteredImages.length === 0) {
        return 0;
      }

      return (current + 1) % filteredImages.length;
    });
  };

  const handlePrev = () => {
    setActiveImageIndex((current) => {
      if (current === null || filteredImages.length === 0) {
        return 0;
      }

      return (
        (current - 1 + filteredImages.length) %
        filteredImages.length
      );
    });
  };

  const handleCancel = () => {
    setActiveImageIndex(null);
  };

  // ---------------------------
  // Search
  // ---------------------------

  const handleSearchClick = () => {
    if (searchIntent) {
      searchInput.current.value = "";
      setFilteredImages(images);
    }

    setSearchIntent(!searchIntent);
  };

  const handleSearch = () => {
    const value = searchInput.current.value.toLowerCase();

    const result = images.filter((image) =>
      (image.title || "").toLowerCase().includes(value)
    );

    setFilteredImages(result);
  };

  // ---------------------------
  // Add image
  // ---------------------------

  const handleAdd = async ({ title, url }) => {
    try {
      setImgLoading(true);

      const imagesRef = collection(
        db,
        "albums",
        albumId,
        "images"
      );

      const imageRef = await addDoc(imagesRef, {
        title,
        url,
        createdAt: new Date(),
      });

      const newImage = {
        id: imageRef.id,
        title,
        url,
      };

      setImages((prev) => [...prev, newImage]);
      setFilteredImages((prev) => [...prev, newImage]);

      setAddImageIntent(false);

      toast.success("Image added successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add image.");
    } finally {
      setImgLoading(false);
    }
  };

  // ---------------------------
  // Update image
  // ---------------------------

  const handleUpdate = async ({ id, title, url }) => {
    try {
      setImgLoading(true);

      const imageRef = doc(
        db,
        "albums",
        albumId,
        "images",
        id
      );

      await updateDoc(imageRef, {
        title,
        url,
      });

      const updatedImages = images.map((image) =>
        image.id === id
          ? {
              ...image,
              title,
              url,
            }
          : image
      );

      setImages(updatedImages);
      setFilteredImages(updatedImages);

      setUpdateImageIntent(false);

      toast.success("Image updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update image.");
    } finally {
      setImgLoading(false);
    }
  };

  // ---------------------------
  // Delete image
  // ---------------------------

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    try {
      const imageRef = doc(
        db,
        "albums",
        albumId,
        "images",
        id
      );

      await deleteDoc(imageRef);

      const remainingImages = images.filter(
        (image) => image.id !== id
      );

      setImages(remainingImages);
      setFilteredImages(remainingImages);

      toast.success("Image deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image.");
    }
  };

  // ---------------------------
  // Loading
  // ---------------------------

  if (loading) {
    return (
      <div className={styles.loader}>
        <Spinner color="#0077ff" />
      </div>
    );
  }

  return (
    <>
      {(addImageIntent || updateImageIntent) && (
        <ImageForm
          loading={imgLoading}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onCancel={() => {
            setAddImageIntent(false);
            setUpdateImageIntent(false);
          }}
          albumName={albumName}
          updateIntent={updateImageIntent}
        />
      )}

      {activeImageIndex !== null &&
        filteredImages.length > 0 && (
          <Carousel
            title={filteredImages[activeImageIndex].title}
            url={filteredImages[activeImageIndex].url}
            onNext={handleNext}
            onPrev={handlePrev}
            onCancel={handleCancel}
          />
        )}

      <div className={styles.top}>
        <span onClick={onBack}>
          <img
            src="/assets/back.png"
            alt="back"
          />
        </span>

        <h3>Images in {albumName}</h3>

        <div className={styles.search}>
          {searchIntent && (
            <input
              placeholder="Search..."
              onChange={handleSearch}
              ref={searchInput}
              autoFocus
            />
          )}

          <img
            onClick={handleSearchClick}
            src={
              !searchIntent
                ? "/assets/search.png"
                : "/assets/clear.png"
            }
            alt="clear"
          />
        </div>

        {updateImageIntent ? (
          <button
            className={styles.active}
            onClick={() => setUpdateImageIntent(false)}
          >
            Cancel
          </button>
        ) : (
          <button
            className={
              addImageIntent ? styles.active : ""
            }
            onClick={() =>
              setAddImageIntent(!addImageIntent)
            }
          >
            {addImageIntent
              ? "Cancel"
              : "Add image"}
          </button>
        )}
      </div>

      {!filteredImages.length ? (
        <h3>No images found in the album.</h3>
      ) : (
        <div className={styles.imageList}>
          {filteredImages.map((image, i) => (
            <div
              key={image.id}
              className={styles.image}
              onMouseOver={() => setActiveHoverImageIndex(i)}
              onMouseOut={() => setActiveHoverImageIndex(null)}
              onClick={() => setActiveImageIndex(i)}
            >
              <div
                className={`${styles.update} ${
                  activeHoverImageIndex === i && styles.active
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdateImageIntent(image);
                  setAddImageIntent(false);
                }}
              >
                <img src="/assets/edit.png" alt="update" />
              </div>

              <div
                className={`${styles.delete} ${
                  activeHoverImageIndex === i && styles.active
                }`}
                onClick={(e) => handleDelete(e, image.id)}
              >
                <img src="/assets/trash-bin.png" alt="delete" />
              </div>

              <img
                src={image.url}
                alt={image.title}
                onError={({ currentTarget }) => {
                  currentTarget.src = "/assets/warning.png";
                }}
              />

              <span>{(image.title || "").substring(0, 20)}</span>
            </div>
            ))}
          </div>
      )}
    </>
  );
};