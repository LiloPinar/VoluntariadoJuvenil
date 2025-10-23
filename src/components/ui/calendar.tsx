import * as React from "react";

// Stubbed Calendar component (archived)

export type CalendarProps = Record<string, unknown>;

const Calendar: React.FC<React.PropsWithChildren<CalendarProps>> = ({ children }) => <div>{children}</div>;

export { Calendar };
