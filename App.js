import styles from "./App.module.css";

import { Navbar } from "./components/navbar/Navbar";
import { AlbumsList } from "./components/albumsList/AlbumsList";
import React from "react"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  return (
    <div className={styles.App}>
      <ToastContainer />

      <Navbar />

      <div className={styles.content}>
        <AlbumsList />
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error);
    console.error("Error info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Check the console.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;