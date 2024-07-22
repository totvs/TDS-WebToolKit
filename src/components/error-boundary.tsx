/*
Copyright 2024 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as React from "react";
import { tdsVscode } from "../utilities/vscodeWrapper";

type TErrorBoundaryProps = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

type TErrorBoundaryState = {
  hasError: boolean;
};

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in a child component tree, 
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * Uses React 16+ static getDerivedStateFromError feature.
 */
export class ErrorBoundary extends React.Component<TErrorBoundaryProps, TErrorBoundaryState> {
  constructor(props: TErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    console.error(error, info.componentStack);

    // tdsVscode.postMessage({
    //   command: "ERROR_BOUNDARY_LOG",
    //   data: {
    //     error: error,
    //     info: info
    //   }
    // });
    //}

    //logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}