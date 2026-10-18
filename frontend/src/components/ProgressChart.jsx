import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const toTs = (date) => new Date(date + "T00:00:00").getTime();

const shortDate = (ts) =>
  new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const longDate = (ts) =>
  new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function ProgressChart({ points, target, unit = "", label = "Value" }) {
  if (points.length < 2) {
    return (
      <div className="chart-empty">
        Add at least two entries to see your trend.
      </div>
    );
  }

  const data = points.map((p) => ({ ts: toTs(p.date), value: p.value }));

  const values = data.map((d) => d.value);
  if (target) values.push(target);
  const min = Math.floor(Math.min(...values) - 1);
  const max = Math.ceil(Math.max(...values) + 1);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#242832" strokeDasharray="3 3" />

        <XAxis
          dataKey="ts"
          type="number"
          scale="time"
          domain={["dataMin", "dataMax"]}
          tickFormatter={shortDate}
          stroke="#666d79"
          tick={{ fontSize: 12 }}
        />

        <YAxis
          domain={[min, max]}
          stroke="#666d79"
          tick={{ fontSize: 12 }}
          width={44}
        />

        <Tooltip
          labelFormatter={longDate}
          formatter={(value) => [`${value} ${unit}`, label]}
          contentStyle={{
            background: "#171a21",
            border: "1px solid #343a46",
            borderRadius: 8,
            color: "#ffffff",
          }}
          labelStyle={{ color: "#8f96a3" }}
        />

        {target && (
          <ReferenceLine
            y={target}
            stroke="#8f96a3"
            strokeDasharray="6 4"
            label={{
              value: `Target ${target} ${unit}`,
              fill: "#8f96a3",
              fontSize: 12,
              position: "insideTopRight",
            }}
          />
        )}

        <Line
          type="monotone"
          dataKey="value"
          stroke="#c8ff00"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#c8ff00", stroke: "#c8ff00" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ProgressChart;
