import { Component } from "react";
import Button from "./Button";

// Catches unexpected rendering errors and shows a friendly message instead of a blank screen.
// (Error boundaries must be class components.)
export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="mx-auto my-16 max-w-md rounded-xl bg-white p-8 text-center shadow ring-1 ring-slate-200">
        <div className="text-5xl">😵</div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">Oops! Something went wrong</h2>
        <p className="mt-2 text-slate-600">An unexpected error occurred. Please try again or go back to the home page.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={this.handleReset}>Try again</Button>
          <Button variant="secondary" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }
}
