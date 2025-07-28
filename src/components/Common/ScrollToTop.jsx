// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ignoreKeys = ["minPrice", "maxPrice"];
    const onlyPriceChanged = [...params.keys()].every((key) =>
      ignoreKeys.includes(key)
    );

    if (!onlyPriceChanged) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return null;
};

export default ScrollToTop;

