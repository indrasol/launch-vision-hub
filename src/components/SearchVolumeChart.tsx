
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SearchVolumeChartProps {
  data: Array<{
    month: string;
    volume: number;
  }>;
  keyword: string;
  monthlyVolume: number;
  growthPercentage: number;
}

const SearchVolumeChart = ({ data, keyword, monthlyVolume, growthPercentage }: SearchVolumeChartProps) => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">Search Volume Trends</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{(monthlyVolume / 1000).toFixed(1)}K</div>
            <div className="text-sm text-green-600">+{growthPercentage}% growth</div>
          </div>
        </div>
        <p className="text-sm text-gray-600">Keyword: <span className="font-medium">{keyword}</span></p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number) => [`${(value / 1000).toFixed(1)}K`, 'Volume']}
              labelStyle={{ color: '#333' }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="volume" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SearchVolumeChart;
