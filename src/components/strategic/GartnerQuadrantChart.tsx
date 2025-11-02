import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { GartnerQuadrant, QUADRANTS } from "@/types/strategic-analysis";

interface GartnerQuadrantChartProps {
  data: GartnerQuadrant[];
  onPartnerClick?: (partnerId: string) => void;
}

export function GartnerQuadrantChart({ data, onPartnerClick }: GartnerQuadrantChartProps) {
  const getQuadrantColor = (quadrant: GartnerQuadrant['quadrant']) => {
    return QUADRANTS[quadrant].color;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{data.partnerName}</p>
          <p className="text-sm text-muted-foreground">{QUADRANTS[data.quadrant].label}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p>Fit Score: <span className="font-medium">{data.fitScore.toFixed(1)}</span></p>
            <p>Rebate Score: <span className="font-medium">{data.rebateScore.toFixed(1)}</span></p>
            <p>Lojas: <span className="font-medium">{data.totalStores}</span></p>
            <p>GMV Total: <span className="font-medium">R$ {data.totalGMV.toLocaleString()}</span></p>
            <p>Rebate Total: <span className="font-medium">R$ {data.totalRebate.toLocaleString()}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quadrante de Gartner - Posicionamento Estratégico</CardTitle>
        <CardDescription>
          Análise de fit com lojas (eixo X) vs. rebate gerado (eixo Y)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="fitScore" 
                name="Fit Score" 
                domain={[0, 100]}
                label={{ value: 'Fit com Base de Lojas', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="rebateScore" 
                name="Rebate Score" 
                domain={[0, 100]}
                label={{ value: 'Rebate Gerado', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Linhas de divisão dos quadrantes */}
              <line x1="70%" y1="0" x2="70%" y2="100%" stroke="hsl(var(--border))" strokeDasharray="5 5" />
              <line x1="0" y1="70%" x2="100%" y2="70%" stroke="hsl(var(--border))" strokeDasharray="5 5" />

              <Scatter 
                name="Parceiros" 
                data={data} 
                onClick={(data) => onPartnerClick && onPartnerClick(data.partnerId)}
                cursor="pointer"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getQuadrantColor(entry.quadrant)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda dos Quadrantes */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {Object.entries(QUADRANTS).map(([key, quadrant]) => (
            <div key={key} className="flex items-start gap-2 p-3 rounded-lg border">
              <div 
                className="w-4 h-4 rounded-full mt-0.5" 
                style={{ backgroundColor: quadrant.color }}
              />
              <div>
                <p className="font-medium text-sm">{quadrant.label}</p>
                <p className="text-xs text-muted-foreground">{quadrant.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
