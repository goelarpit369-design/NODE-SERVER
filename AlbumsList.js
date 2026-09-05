import styles from "./albumsList.module.css";
import { useEffect, useState } from "react";
import Spinner from "react-spinner-material";
import { toast } from "react-toastify";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";
import { AlbumForm } from "../albumForm/AlbumForm";
import { ImagesList } from "../imagesList/ImagesList";

export const AlbumsList = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  const [addAlbumIntent, setAddAlbumIntent] = useState(false);
  const [albumLoading, setAlbumLoading] = useState(false);

  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    const getAlbums = async () => {
      try {
        setLoading(true);

        const snapshot = await getDocs(collection(db, "albums"));

        const albumData = snapshot.docs.map((albumDoc) => ({
          id: albumDoc.id,
          ...albumDoc.data(),
        }));

        setAlbums(albumData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load albums.");
      } finally {
        setLoading(false);
      }
    };

    getAlbums();
  }, []);

  const handleAddAlbum = async (albumName) => {
    try {
      setAlbumLoading(true);

      const albumRef = await addDoc(collection(db, "albums"), {
        name: albumName,
        createdAt: new Date(),
      });

      setAlbums((prev) => [
        ...prev,
        {
          id: albumRef.id,
          name: albumName,
        },
      ]);

      setAddAlbumIntent(false);

      toast.success("Album created successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create album.");
    } finally {
      setAlbumLoading(false);
    }
  };

  const handleDeleteAlbum = async (e, id) => {
    e.stopPropagation();

    try {
      await deleteDoc(doc(db, "albums", id));

      setAlbums((prev) =>
        prev.filter((album) => album.id !== id)
      );

      toast.success("Album deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete album.");
    }
  };

  const handleUpdateAlbum = async (id, name) => {
    try {
      await updateDoc(doc(db, "albums", id), {
        name,
      });

      setAlbums((prev) =>
        prev.map((album) =>
          album.id === id
            ? { ...album, name }
            : album
        )
      );

      toast.success("Album updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update album.");
    }
  };

  if (selectedAlbum) {
    return (
      <ImagesList
        albumId={selectedAlbum.id}
        albumName={selectedAlbum.name}
        onBack={() => setSelectedAlbum(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className={styles.loader}>
        <Spinner color="#0077ff" />
      </div>
    );
  }

  return (
    <>
      {addAlbumIntent && (
        <AlbumForm
          loading={albumLoading}
          onAdd={handleAddAlbum}
          onCancel={() => setAddAlbumIntent(false)}
        />
      )}

      <div className={styles.top}>
        <h3>Albums</h3>

        <button onClick={() => setAddAlbumIntent(true)}>
          Add album
        </button>
      </div>

      {!albums.length ? (
        <h3>No albums found.</h3>
      ) : (
        <div className={styles.albumList}>
          {albums.map((album) => (
            <div
              key={album.id}
              className={styles.album}
              onClick={() => setSelectedAlbum(album)}
            >
              <span>{album.name}</span>

              <div className={styles.actions}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    const newName = window.prompt(
                      "Album Name",
                      album.name
                    );

                    if (newName?.trim()) {
                      handleUpdateAlbum(
                        album.id,
                        newName.trim()
                      );
                    }
                  }}
                >
                  Update
                </button>

                <button
                  onClick={(e) =>
                    handleDeleteAlbum(e, album.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};