import * as React from "react";

// Stubbed command exports (archived)

const Command: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <div>{children}</div>
);

const CommandDialog: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <div role="dialog">{children}</div>
);

const CommandInput: React.FC = () => null;
const CommandList: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <div>{children}</div>
);
const CommandEmpty: React.FC = () => null;
const CommandGroup: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <div>{children}</div>
);
const CommandSeparator: React.FC = () => <hr />;
const CommandItem: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => (
  <div>{children}</div>
);
const CommandShortcut: React.FC = () => null;

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
