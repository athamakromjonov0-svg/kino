import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#121216] border border-red-500/20 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">
                Kutilmagan xatolik yuz berdi
              </h2>
              <p className="text-xs text-zinc-400">
                Ilovada kutilmagan dasturiy xatolik yuzaga keldi. Iltimos, sahifani yangilang.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-[#18181F] p-3 rounded-xl border border-[#27272A] text-left">
                <p className="text-[11px] font-mono text-red-400 line-clamp-3">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="secondary"
                size="md"
                icon={Home}
                onClick={this.handleHome}
              >
                Bosh sahifa
              </Button>

              <Button
                variant="primary"
                size="md"
                icon={RefreshCw}
                onClick={this.handleReload}
                className="glow-red"
              >
                Yangilash
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
