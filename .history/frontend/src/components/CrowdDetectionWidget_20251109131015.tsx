import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import api from "../services/api";

interface CrowdMetric {
  id: number;
  crowdCount: number;
  crowdLevel: string;
  timeSlot: string;
  confidence: number;
  timestamp: string;
}

const CrowdDetectionWidget: React.FC = () => {
  const [todayMetrics, setTodayMetrics] = useState<CrowdMetric[]>([]);
  const [peakHours, setPeakHours] = useState<CrowdMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCrowdData();
    const interval = setInterval(fetchCrowdData, 30000); // Every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchCrowdData = async () => {
    try {
      setLoading(true);
      const [todayRes, peaksRes] = await Promise.all([
        api.get("/crowd-detection/today"),
        api.get("/crowd-detection/peak-hours"),
      ]);
      setTodayMetrics(todayRes.data);
      setPeakHours(peaksRes.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch crowd data:", err);
      setError("Failed to load crowd data");
    } finally {
      setLoading(false);
    }
  };

  const currentCrowd = todayMetrics[todayMetrics.length - 1];
  const avgCrowd =
    todayMetrics.length > 0
      ? Math.round(
          todayMetrics.reduce((sum, m) => sum + m.crowdCount, 0) /
            todayMetrics.length
        )
      : 0;

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "#4CAF50";
      case "MEDIUM":
        return "#FFC107";
      case "HIGH":
        return "#FF9800";
      case "PEAK":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  if (error) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, background: "#ffebee" }}>
        <Typography sx={{ color: "#C62828", fontWeight: "bold" }}>
          ⚠️ {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, background: "white", boxShadow: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mr: 1 }}>
          Live Crowd Detection
        </Typography>
        <TrendingUpIcon sx={{ color: "#2196F3" }} />
      </Box>

      {loading && todayMetrics.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Current Crowd */}
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 2.5,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 2,
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Current Crowd
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: "bold", my: 1 }}
              >
                {currentCrowd?.crowdCount || 0}
              </Typography>
              <Box
                sx={{
                  display: "inline-block",
                  px: 2,
                  py: 0.5,
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {currentCrowd?.crowdLevel || "N/A"}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                Confidence: {currentCrowd?.confidence?.toFixed(0) || 0}%
              </Typography>
            </Box>
          </Grid>

          {/* Daily Statistics */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2.5, background: "#f5f5f5", borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                Daily Stats
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: "gray" }}>
                  Average Crowd
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {avgCrowd}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "gray" }}>
                  Peak Crowd
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {peakHours[0]?.crowdCount || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: "gray", display: "block" }}>
                  at {peakHours[0]?.timeSlot || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Hourly Breakdown */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1.5 }}>
              Crowd by Hour (Today)
            </Typography>
            <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
              {todayMetrics.slice(-8).map((metric, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    gap: 2,
                  }}
                >
                  <Typography variant="caption" sx={{ minWidth: 60 }}>
                    {metric.timeSlot}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((metric.crowdCount / 20) * 100, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        background: "#e0e0e0",
                        "& .MuiLinearProgress-bar": {
                          background: getCrowdColor(metric.crowdLevel),
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      background: getCrowdColor(metric.crowdLevel),
                      color: "white",
                      borderRadius: 1,
                      minWidth: 40,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      {metric.crowdCount}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Refresh Info */}
          <Grid item xs={12}>
            <Typography
              variant="caption"
              sx={{ color: "gray", fontStyle: "italic" }}
            >
              Data updates every 30 seconds
            </Typography>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default CrowdDetectionWidget;
