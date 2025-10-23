import * as React from "react";

// Stubbed resizable exports (archived)

const ResizablePanelGroup: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <div>{children}</div>
);

const ResizablePanel: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <div>{children}</div>
);

const ResizableHandle: React.FC = () => null;

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
