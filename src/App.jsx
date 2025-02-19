import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
} from "@mui/material";

// Dark Theme Configuration
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#ffffff" },
  },
  typography: { fontFamily: "Roboto, sans-serif" },
});

// Categories List
const categories = [
  "Sports",
  "Education",
  "Home Cooking",
  "Premanand Ji Maharaj",
  "Bhakti",
  "Lord Krishna",
  "Motivation",
  "Health & Wellness",
  "Technology",
  "Coding & Programming",
  "Startup & Business",
  "Meditation & Mindfulness",
  "Science & Space",
  "History & Mythology",
  "Travel & Exploration",
  "Spirituality",
  "Finance & Investing",
  "Personal Development",
  "Fitness & Yoga",
  "Bhagavad Gita",
  "Shiv Bhakti",
  "Mahadev",
  "Ramayan & Mahabharat",
  "Indian Culture",
];

const App = () => {
  const [videos, setVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [index, setIndex] = useState(10);
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Sports");
  const loader = useRef(null);

  // Fetch videos when category changes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `https://goodshorts-server.onrender.com/api/shorts?category=${selectedCategory}`
        );
        setVideos(response.data.videos);
        setVisibleVideos(response.data.videos.slice(0, 10));
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, [selectedCategory]);

  // Infinite Scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreVideos();
        }
      },
      { threshold: 1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
  }, [visibleVideos]);

  // Load More Videos
  const loadMoreVideos = () => {
    if (index < videos.length) {
      setVisibleVideos(videos.slice(0, index + 10));
      setIndex(index + 10);
    }
  };

  // Auto-Play Video When Visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveVideo(entry.target.dataset.videoid);
          }
        });
      },
      { threshold: 0.8 }
    );

    const videoElements = document.querySelectorAll(".video-card");
    videoElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [visibleVideos]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          textAlign: "center",
          padding: "10px",
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: "white" }}>
          GoodShorts
        </Typography>

        {/* Category Dropdown */}
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel sx={{ color: "white" }}>Select Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ color: "white", borderColor: "white" }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Shorts Feed */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {visibleVideos.map((video) => (
            <Card
              key={video.videoId}
              className="video-card"
              data-videoid={video.videoId}
              sx={{
                width: "100%",
                maxWidth: "400px",
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=${
                  activeVideo === video.videoId ? "1" : "0"
                }&mute=0`}
                title={video.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ borderRadius: "10px" }}
              ></iframe>
              <CardContent>
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  {video.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {video.channel}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Loader */}
        <div
          ref={loader}
          style={{ height: "20px", background: "transparent" }}
        ></div>
      </Box>
    </ThemeProvider>
  );
};

export default App;
