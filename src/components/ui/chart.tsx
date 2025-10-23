// Minimal stub for Chart wrapper (archived)

export type ChartConfig = Record<string, any>;

const ChartContainer: React.FC<React.PropsWithChildren<{ config?: ChartConfig }>> = ({ children }) => (
  <div>{children}</div>
);

const ChartTooltip: React.FC = () => null;
const ChartTooltipContent: React.FC = () => null;
const ChartLegend: React.FC = () => null;
const ChartLegendContent: React.FC = () => null;

const ChartStyle: React.FC = () => null;

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };
