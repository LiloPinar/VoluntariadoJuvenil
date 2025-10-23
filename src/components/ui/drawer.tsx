import * as React from "react";

// Stubbed drawer exports (archived)

const Drawer: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <div>{children}</div>
);

const DrawerPortal: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <div>{children}</div>
);

const DrawerOverlay: React.FC = () => null;
const DrawerTrigger: React.FC = () => null;
const DrawerClose: React.FC = () => null;
const DrawerContent: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <div>{children}</div>
);
const DrawerHeader: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <div>{children}</div>
);
const DrawerFooter: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <div>{children}</div>
);
const DrawerTitle: React.FC = () => null;
const DrawerDescription: React.FC = () => null;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
