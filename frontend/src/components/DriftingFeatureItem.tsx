import React from "react";
import { DriftFeature } from "../types";
import { COLORS } from "../constants";
import { ChevronRight, BarChart2 } from "lucide-react";

interface DriftingFeatureItemProps {
  feature: DriftFeature;
  onClick?: () => void;
}

const DriftingFeatureItem: React.FC<DriftingFeatureItemProps> = ({
  feature,
  onClick,
}) => {
  const getColor = () => {
    switch (feature.status) {
      case "critical":
        return COLORS.critical;
      case "warning":
        return feature.psi > 0.2 ? COLORS.warning : "#f1c40f"; // Orange/Yellow split
      case "good":
        return COLORS.success;
      default:
        return COLORS.success;
    }
  };

  const width = Math.min((feature.psi / 0.5) * 100, 100); // Scale 0.5 PSI to 100% width

  return (
    <div
      className={`mb-4 last:mb-0 group ${
        onClick
          ? "cursor-pointer p-2 -mx-2 rounded-lg hover:bg-[#20203a] transition-all border border-transparent hover:border-gray-700"
          : ""
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center">
          <span
            className={`text-sm font-medium text-gray-300 ${
              onClick ? "group-hover:text-white" : ""
            }`}
          >
            {feature.name}
          </span>
          {onClick && (
            <span className="ml-2 flex items-center text-[10px] font-bold bg-[#0f4c75] text-white px-1.5 py-0.5 rounded shadow-sm">
              <BarChart2 className="w-3 h-3 mr-1" /> ANALYZE
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-gray-400">
            PSI:{" "}
            {feature.psi < 0.01
              ? feature.psi.toFixed(4)
              : feature.psi.toFixed(2)}
          </span>
          <span className="text-xs font-mono text-gray-400">
            KS:{" "}
            {feature.ks < 0.01 ? feature.ks.toFixed(4) : feature.ks.toFixed(2)}
          </span>
          <span className="text-xs font-mono text-gray-400">
            KL:{" "}
            {feature.kl < 0.01 ? feature.kl.toFixed(4) : feature.kl.toFixed(2)}
          </span>
          {onClick && (
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          )}
        </div>
      </div>
      <div className="w-full bg-[#0f1526] h-2.5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${width}%`, backgroundColor: getColor() }}
        >
          {/* Shimmer effect for critical items */}
          {feature.status === "critical" && (
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriftingFeatureItem;
