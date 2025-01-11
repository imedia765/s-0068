import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WebMetricsD3 } from "@/components/visualizations/WebMetricsD3";
import { WebMetricsP5 } from "@/components/visualizations/WebMetricsP5";
import { WebMetricsHighcharts } from "@/components/visualizations/WebMetricsHighcharts";

interface MetricsDisplayProps {
  metrics: Array<{ metric: string; value: string }>;
}

export const MetricsDisplay = ({ metrics }: MetricsDisplayProps) => {
  const getMetricsByCategory = () => {
    const categories = {
      Performance: ["Load Time", "First Paint", "First Contentful Paint"],
      SEO: ["Meta Description", "Title Tag", "Canonical URL"],
      Security: ["HTTPS", "Content Security Policy", "X-Frame-Options"],
      Accessibility: ["ARIA Labels", "Alt Tags", "Color Contrast"],
    };

    return Object.entries(categories).map(([category, metricNames]) => ({
      category,
      metrics: metrics.filter((m) => metricNames.includes(m.metric)),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getMetricsByCategory().map(({ category, metrics: categoryMetrics }) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categoryMetrics.map((metric) => (
                  <div
                    key={metric.metric}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <span
                      className={`text-sm ${
                        metric.value === "Present" || metric.value === "Yes"
                          ? "text-green-500"
                          : metric.value === "Missing" || metric.value === "No"
                          ? "text-red-500"
                          : "text-blue-500"
                      }`}
                    >
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WebMetricsD3 data={metrics} />
        <WebMetricsHighcharts data={metrics} />
      </div>
      
      <WebMetricsP5 data={metrics} />
    </div>
  );
};