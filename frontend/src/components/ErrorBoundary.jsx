import React from "react";

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

  componentDidCatch(error, info) {
    console.log(
      "Error Boundary:",
      error,
      info
    );
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-6">
          <h1 className="text-5xl font-bold mb-6">
            Something Went Wrong
          </h1>

          <p className="text-slate-400 text-center max-w-xl leading-8 mb-8">
            The application encountered an unexpected error.
            Please refresh the page or try again later.
          </p>

          <button
            onClick={
              this.handleRefresh
            }
            className="bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl text-white font-semibold"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;