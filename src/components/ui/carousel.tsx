import * as React from "react";

// Minimal stub for Carousel wrapper (archived). Exports basic placeholders
// so other modules that import these symbols keep compiling.

export type CarouselApi = any;

const Carousel: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children, ..._ }) => (
  <div>{children}</div>
);

const CarouselContent: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children, ..._ }) => (
  <div>{children}</div>
);

const CarouselItem: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children, ..._ }) => (
  <div>{children}</div>
);

const CarouselPrevious: React.FC = () => <button type="button" aria-hidden />;
const CarouselNext: React.FC = () => <button type="button" aria-hidden />;

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
