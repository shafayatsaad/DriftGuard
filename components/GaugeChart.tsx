import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { COLORS } from '../constants';

interface GaugeChartProps {
  value: number; // 0 to 100
  label: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, label }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 160;
    const margin = { top: 20, right: 20, bottom: 0, left: 20 };
    const radius = Math.min(width, height * 2) / 2 - margin.top;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height - 10})`);

    // Scale
    const scale = d3.scaleLinear().domain([0, 100]).range([-Math.PI / 2, Math.PI / 2]);

    // Arc Generator
    const arc = d3.arc<any>()
      .innerRadius(radius - 20)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2);

    // Background Arc
    g.append('path')
      .datum({ endAngle: Math.PI / 2 })
      .style('fill', '#2c3e50') // Darker track
      .attr('d', arc);

    // Foreground Arc (Animated)
    // Determine color based on value
    let color = COLORS.success;
    if (value < 60) color = COLORS.critical;
    else if (value < 80) color = COLORS.warning;

    const foregroundPath = g.append('path')
      .datum({ endAngle: -Math.PI / 2 })
      .style('fill', color)
      .attr('d', arc);

    foregroundPath.transition()
      .duration(1500)
      .attrTween('d', function(d: any) {
        const i = d3.interpolate(d.endAngle, scale(value));
        return function(t: number) {
          d.endAngle = i(t);
          return arc(d) || '';
        };
      });

    // Value Text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '48px')
      .style('font-weight', 'bold')
      .style('fill', COLORS.text)
      .text(value);
    
    // /100 Label
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dx', '3.5em')
      .attr('dy', '-1.5em')
      .style('font-size', '16px')
      .style('fill', COLORS.textDim)
      .text('/100');

    // Label Text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5em') // Below the gauge arc base
      .style('font-size', '14px')
      .style('fill', COLORS.textDim)
      .style('text-transform', 'uppercase')
      .style('letter-spacing', '1px')
      .text(label);

  }, [value, label]);

  return (
    <div className="flex justify-center items-center w-full h-full p-4">
      <svg ref={svgRef} width="100%" height="200" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
};

export default GaugeChart;
